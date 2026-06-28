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

function decodeEntities(text) {
  return text
    .replace(/&aacute;/gi, 'á').replace(/&Aacute;/gi, 'Á')
    .replace(/&eacute;/gi, 'é').replace(/&Eacute;/gi, 'É')
    .replace(/&iacute;/gi, 'í').replace(/&Iacute;/gi, 'Í')
    .replace(/&oacute;/gi, 'ó').replace(/&Oacute;/gi, 'Ó')
    .replace(/&uacute;/gi, 'ú').replace(/&Uacute;/gi, 'Ú')
    .replace(/&ntilde;/gi, 'ñ').replace(/&Ntilde;/gi, 'Ñ')
    .replace(/&iquest;/gi, '¿').replace(/&iexcl;/gi, '¡')
    .replace(/&ldquo;/gi, '"').replace(/&rdquo;/gi, '"')
    .replace(/&lsquo;/gi, '‘').replace(/&rsquo;/gi, '’')
    .replace(/&ndash;/gi, '–').replace(/&mdash;/gi, '—')
    .replace(/&#(\d+);/g,    (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
}

function stripTagsRaw(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrae el texto útil de la página de casarosada.gob.ar:
 * 1. Intenta aislar el cuerpo del artículo (article-body, main, article).
 * 2. Si no, toma el texto completo y recorta desde el inicio reconocible del discurso,
 *    eliminando el boilerplate de navegación ("Compartilo en redes", "Tweet -->", "Detalles -->").
 */
function extractContent(html) {
  const containers = [
    /<div[^>]+class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div\s*>/i,
    /<div[^>]+class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/div\s*>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];
  for (const re of containers) {
    const m = html.match(re);
    if (m && m[1].length > 1000) {
      return decodeEntities(stripTagsRaw(m[1]));
    }
  }

  const full = decodeEntities(stripTagsRaw(html));
  const speechStart = /Buenos\s+d[íi]as|Buenas\s+tardes|Buenas\s+noches|Javier\s+Milei:|PRESIDENTE\s+DE\s+LA\s+NACI[ÓO]N/i;
  const idx = full.search(speechStart);
  if (idx > 50 && idx < full.length * 0.6) {
    return full.slice(idx).trim();
  }

  return full
    .replace(/^.*?Detalles\s*[-–—>]+\s*/i, '')
    .replace(/Compartilo en redes[\s\S]*?Tweet\s*[-–—>]+\s*/gi, '')
    .trim();
}

/**
 * Limpia filas antiguas de Milei que todavía tengan entidades HTML sin decodificar
 * o boilerplate de navegación de Casa Rosada en el texto almacenado.
 * Se ejecuta al inicio de cada cron; si todo ya está limpio, termina en microsegundos.
 */
async function cleanExistingRows(SUPABASE_URL, SERVICE_KEY) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/daily_analyses?entity_id=eq.milei&select=id,title,text`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const rows = await res.json();
  if (!Array.isArray(rows)) return;

  const speechStart = /Buenos\s+d[íi]as|Buenas\s+tardes|Buenas\s+noches|Javier\s+Milei:|PRESIDENTE\s+DE\s+LA\s+NACI[ÓO]N/i;

  for (const row of rows) {
    const needsDecode = (row.text || '').includes('&') || (row.title || '').includes('&');
    const hasBoilerplate = /Compartilo en redes|Tweet\s*[-–—>]/i.test(row.text || '');
    if (!needsDecode && !hasBoilerplate) continue;

    let newText = decodeEntities(row.text || '');
    newText = newText.replace(/^.*?Detalles\s*[-–—>]+\s*/i, '').trim();
    newText = newText.replace(/Compartilo en redes[\s\S]*?Tweet\s*[-–—>]+\s*/gi, '').trim();
    const idx = newText.search(speechStart);
    if (idx > 50 && idx < newText.length * 0.7) newText = newText.slice(idx).trim();

    const newTitle = decodeEntities(row.title || '');

    await fetch(`${SUPABASE_URL}/rest/v1/daily_analyses?id=eq.${row.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ title: newTitle, text: newText }),
    });
  }
}

function findLatestSpeechPath(listHtml) {
  const match = listHtml.match(/<a[^>]*class="panel"[^>]*href="(\/informacion\/discursos\/[^"]+)"/);
  return match ? match[1] : null;
}

function extractTitle(detailHtml) {
  const match = detailHtml.match(/<title>([^<]*)<\/title>/i);
  return match ? decodeEntities(match[1].trim()) : null;
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
    // Autocorrección: limpiar filas antiguas con entidades HTML o boilerplate
    await cleanExistingRows(SUPABASE_URL, SERVICE_KEY);

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
    const text = extractContent(detailHtml).slice(0, MAX_CHARS);

    if (text.length < 2000) {
      return res.status(200).json({
        skipped: true,
        reason: `Texto demasiado corto (${text.length} chars), no parece un discurso`,
        sourceUrl,
      });
    }

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
        segments: result.segments,
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
