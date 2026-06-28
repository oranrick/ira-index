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

/** Decodifica entidades HTML comunes (español + básicas) */
function decodeEntities(text) {
  return text
    .replace(/&aacute;/gi, 'á').replace(/&Aacute;/gi, 'Á')
    .replace(/&eacute;/gi, 'é').replace(/&Eacute;/gi, 'É')
    .replace(/&iacute;/gi, 'í').replace(/&Iacute;/gi, 'Í')
    .replace(/&oacute;/gi, 'ó').replace(/&Oacute;/gi, 'Ó')
    .replace(/&uacute;/gi, 'ú').replace(/&Uacute;/gi, 'Ú')
    .replace(/&ntilde;/gi, 'ñ').replace(/&Ntilde;/gi, 'Ñ')
    .replace(/&uuml;/gi,   'ü').replace(/&Uuml;/gi,   'Ü')
    .replace(/&iquest;/gi, '¿').replace(/&iexcl;/gi, '¡')
    .replace(/&ldquo;/gi, '“').replace(/&rdquo;/gi, '”')
    .replace(/&lsquo;/gi, '‘').replace(/&rsquo;/gi, '’')
    .replace(/&ndash;/gi, '–').replace(/&mdash;/gi, '—')
    .replace(/&#(\d+);/g,    (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');   // último para no interferir con los anteriores
}

function stripTags(html) {
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
 * Extrae el texto útil de la página de gob.mx:
 * 1. Intenta aislar el contenedor del artículo (evita nav/breadcrumbs).
 * 2. Si no lo encuentra, toma el texto completo y recorta desde el primer
 *    marcador reconocible de inicio de mañanera.
 */
function extractText(html) {
  // Intentar extraer el cuerpo del artículo directamente del HTML
  const containerPatterns = [
    /<div[^>]+class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]+class="[^"]*content-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];
  for (const re of containerPatterns) {
    const m = html.match(re);
    if (m && m[1].length > 1000) {
      return decodeEntities(stripTags(m[1]));
    }
  }

  // Fallback: strip todo el HTML y recortar boilerplate de navegación de gob.mx
  const full = decodeEntities(stripTags(html));

  // Las versiones estenográficas siempre empiezan con alguno de estos patrones
  const speechStart = /PRESIDENTA\s+DE\s+MÉ?XICO|PRESIDENTE\s+DE\s+MÉ?XICO|Muy\s+buenos\s|Buenos\s+d[íi]as|Buenas\s+tardes|Buenas\s+noches/i;
  const idx = full.search(speechStart);
  if (idx > 50 && idx < full.length * 0.6) {
    return full.slice(idx).trim();
  }
  return full;
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? decodeEntities(match[1].replace(/\s*\|\s*.*$/, '').trim()) : null;
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
    const text          = extractText(detailHtml).slice(0, MAX_CHARS);

    if (text.length < 2000) {
      // Menos de ~350 palabras → no es una mañanera real, probablemente aviso/error de CDN
      return res.status(200).json({
        skipped: true,
        reason: `Texto demasiado corto (${text.length} chars), no parece una conferencia`,
        sourceUrl,
      });
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
