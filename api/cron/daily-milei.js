// api/cron/daily-milei.js
// Vercel Cron (ver vercel.json) — una vez al día:
//   1. Busca el discurso más reciente en casarosada.gob.ar/informacion/discursos
//   2. Si no está ya en daily_analyses (dedup por source_url), lo analiza con el motor IRA
//   3. Guarda el resultado en daily_analyses
//
// Protegido por CRON_SECRET — Vercel inyecta automáticamente la cabecera
// Authorization en las invocaciones de Cron Jobs cuando esta env var está configurada.

import { runIraAnalysis } from '../_lib/iraEngine.js';

const LIST_URL = 'https://www.casarosada.gob.ar/informacion/discursos';
const BASE_URL = 'https://www.casarosada.gob.ar';
const ENTITY = {
  entity_id: 'milei',
  entity_name: 'Javier Milei',
  entity_country: 'Argentina',
  entity_flag: '🇦🇷',
};
const MAX_CHARS = 8000;

const UA = 'Mozilla/5.0 (compatible; IRA-Index-Bot/1.0)';

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function findLatestSpeechPath(listHtml) {
  const match = listHtml.match(/<a[^>]*class="panel"[^>]*href="(\/informacion\/discursos\/[^"]+)"/);
  return match ? match[1] : null;
}

function extractTitle(detailHtml) {
  const match = detailHtml.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractDate(detailHtml) {
  const match = detailHtml.match(/(\d{1,2}\s+de\s+[a-záéíóúñ]+\s+de\s+\d{4})/i);
  if (!match) return null;
  const MONTHS = {
    enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
    julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
  };
  const m = match[1].match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const [, day, monthName, year] = m;
  const month = MONTHS[monthName.toLowerCase()];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, '0')}`;
}

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const listRes = await fetch(LIST_URL, { headers: { 'User-Agent': UA } });
    if (!listRes.ok) throw new Error(`No se pudo listar discursos (${listRes.status})`);
    const listHtml = await listRes.text();

    const speechPath = findLatestSpeechPath(listHtml);
    if (!speechPath) throw new Error('No se encontró ningún discurso en el listado');
    const sourceUrl = `${BASE_URL}${speechPath}`;

    // Dedup: ¿ya existe esta URL?
    const existingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/daily_analyses?source_url=eq.${encodeURIComponent(sourceUrl)}&select=id`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    );
    const existing = await existingRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(200).json({ skipped: true, reason: 'already processed', sourceUrl });
    }

    const detailRes = await fetch(sourceUrl, { headers: { 'User-Agent': UA } });
    if (!detailRes.ok) throw new Error(`No se pudo leer el discurso (${detailRes.status})`);
    const detailHtml = await detailRes.text();

    const title = extractTitle(detailHtml);
    const publishedDate = extractDate(detailHtml);
    const text = stripTags(detailHtml).slice(0, MAX_CHARS);

    if (text.length < 200) throw new Error('Texto extraído demasiado corto, posible fallo de parseo');

    const result = await runIraAnalysis(text, {
      name: ENTITY.entity_name,
      category: 'Político',
      situational: title,
    });

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        ...ENTITY,
        source_url: sourceUrl,
        title,
        published_date: publishedDate,
        text,
        ira: result.ira,
        params: result.params,
        summary: result.summary,
        lectura_autor: result.lecturaAutor,
        origin: 'cron',
      }),
    });

    if (!insertRes.ok) {
      const errBody = await insertRes.text();
      throw new Error(`Supabase insert failed: ${insertRes.status} ${errBody}`);
    }

    res.status(200).json({ inserted: true, sourceUrl, ira: result.ira });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
