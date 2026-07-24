// api/_lib/scrapeUtils.js
// Utilidades de scraping compartidas por los adaptadores de fuentes diarias
// (api/_lib/dailySources.js). Extraídas de los antiguos daily-milei.js /
// daily-sheinbaum.js para no duplicar lógica entre figuras.

export const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
// gob.mx acepta el UA de bot honesto desde IPs de datacenter pero rechaza el
// UA de navegador (verificado: el cron viejo con este UA insertaba a diario
// desde Vercel; con UA Chrome devuelve vacío en producción).
export const UA_BOT = 'Mozilla/5.0 (compatible; IRA-Index-Bot/1.0)';

export const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const MONTH_TO_NUM = Object.fromEntries(MONTHS_ES.map((m, i) => [m, String(i + 1).padStart(2, '0')]));

export function decodeEntities(text) {
  return text
    .replace(/&aacute;/gi, 'á').replace(/&Aacute;/gi, 'Á')
    .replace(/&eacute;/gi, 'é').replace(/&Eacute;/gi, 'É')
    .replace(/&iacute;/gi, 'í').replace(/&Iacute;/gi, 'Í')
    .replace(/&oacute;/gi, 'ó').replace(/&Oacute;/gi, 'Ó')
    .replace(/&uacute;/gi, 'ú').replace(/&Uacute;/gi, 'Ú')
    .replace(/&ntilde;/gi, 'ñ').replace(/&Ntilde;/gi, 'Ñ')
    .replace(/&uuml;/gi, 'ü').replace(/&Uuml;/gi, 'Ü')
    .replace(/&iquest;/gi, '¿').replace(/&iexcl;/gi, '¡')
    .replace(/&ldquo;/gi, '“').replace(/&rdquo;/gi, '”')
    .replace(/&lsquo;/gi, '‘').replace(/&rsquo;/gi, '’')
    .replace(/&ndash;/gi, '–').replace(/&mdash;/gi, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');   // último para no interferir con los anteriores
}

export function stripTags(html) {
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

export async function fetchHtml(url, ua = UA) {
  const res = await fetch(url, { headers: { 'User-Agent': ua } });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.text();
}

/** "8 de julio de 2026" → "2026-07-08" (o null si no parsea) */
export function spanishDateToISO(str) {
  const m = String(str).match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const month = MONTH_TO_NUM[m[2].toLowerCase()];
  if (!month) return null;
  return `${m[3]}-${month}-${m[1].padStart(2, '0')}`;
}

export function extractTitleTag(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? decodeEntities(match[1].trim()) : null;
}
