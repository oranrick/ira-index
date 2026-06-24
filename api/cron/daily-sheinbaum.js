// api/cron/daily-sheinbaum.js
// Vercel Cron (ver vercel.json) — una vez al día:
//   1. Construye la URL del artículo de hoy en gob.mx/presidencia
//      (la página índice requiere JS, así que calculamos la URL directamente desde la fecha).
//      Si la conferencia de hoy no existe, retrocede hasta 7 días (fines de semana, feriados).
//   2. Si la URL no está ya en daily_analyses (dedup por source_url), la analiza con el motor IRA.
//   3. Guarda el resultado en daily_analyses.
//
// Protegido por CRON_SECRET — Vercel inyecta automáticamente la cabecera
// Authorization en las invocaciones de Cron Jobs cuando esta env var está configurada.

import { runIraAnalysis } from '../_lib/iraEngine.js';

const BASE_URL  = 'https://www.gob.mx';
const SLUG_BASE = '/presidencia/articulos/version-estenografica-conferencia-de-prensa-de-la-presidenta-claudia-sheinbaum-pardo-del-';
const ENTITY = {
  entity_id:      'sheinbaum',
  entity_name:    'Claudia Sheinbaum',
  entity_country: 'México',
  entity_flag:    '🇲🇽',
};
const MAX_CHARS   = 8000;
const MAX_LOOKBACK = 7; // días hacia atrás si no hay conferencia hoy

const UA = 'Mozilla/5.0 (compatible; IRA-Index-Bot/1.0)';

const MONTHS_ES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
];

/** Construye el slug de la URL para una fecha dada, ej. "22-de-junio-de-2026" */
function dateToSlug(date) {
  const dd    = String(date.getUTCDate());
  const month = MONTHS_ES[date.getUTCMonth()];
  const yyyy  = date.getUTCFullYear();
  return `${dd}-de-${month}-de-${yyyy}`;
}

/** Formatea una fecha como "YYYY-MM-DD" para la base de datos */
function dateToISO(date) {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${date.getUTCFullYear()}-${mm}-${dd}`;
}

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

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].replace(/\s*\|\s*.*$/, '').trim() : null;
}

/** Intenta probar hasta MAX_LOOKBACK fechas comenzando desde hoy hacia atrás.
 *  Devuelve { url, date, html } del primer artículo que responda 200, o null. */
async function findRecentArticle() {
  const now = new Date();
  for (let i = 0; i < MAX_LOOKBACK; i++) {
    const candidate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - i,
    ));
    const slug = dateToSlug(candidate);
    const url  = `${BASE_URL}${SLUG_BASE}${slug}`;
    const res  = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) {
      const html = await res.text();
      // Sanity check: debe contener texto sustancial (no un 200 vacío de CDN)
      if (html.length > 2000) {
        return { url, date: candidate, html };
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const article = await findRecentArticle();
    if (!article) {
      return res.status(200).json({
        skipped: true,
        reason: `No se encontró artículo en los últimos ${MAX_LOOKBACK} días`,
      });
    }

    const { url: sourceUrl, date: articleDate, html: detailHtml } = article;

    // Dedup: ¿ya existe esta URL?
    const existingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/daily_analyses?source_url=eq.${encodeURIComponent(sourceUrl)}&select=id`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
    );
    const existing = await existingRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(200).json({ skipped: true, reason: 'already processed', sourceUrl });
    }

    const title         = extractTitle(detailHtml);
    const publishedDate = dateToISO(articleDate);
    const text          = stripTags(detailHtml).slice(0, MAX_CHARS);

    if (text.length < 200) {
      throw new Error('Texto extraído demasiado corto, posible fallo de parseo');
    }

    const result = await runIraAnalysis(text, {
      name:        ENTITY.entity_name,
      category:    'Político',
      situational: title,
    });

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey:         SERVICE_KEY,
        Authorization:  `Bearer ${SERVICE_KEY}`,
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({
        ...ENTITY,
        source_url:     sourceUrl,
        title,
        published_date: publishedDate,
        text,
        ira:            result.ira,
        params:         result.params,
        segments:       result.segments,
        summary:        result.summary,
        lectura_autor:  result.lecturaAutor,
        origin:         'cron',
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
