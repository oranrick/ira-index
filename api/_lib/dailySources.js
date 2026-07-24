// api/_lib/dailySources.js
// Adaptadores de fuente para el cron diario consolidado (api/cron/daily-all.js).
// Cada adaptador expone { id, entity, category, findLatest() } donde findLatest
// devuelve el candidato más reciente { sourceUrl, title, publishedDate, text }
// o null si la fuente no tiene nada utilizable hoy.
//
// El dispatcher se encarga de dedup (source_url), longitud mínima, análisis IRA
// e inserción en daily_analyses — aquí solo vive lo específico de cada sitio.

import { decodeEntities, stripTags, fetchHtml, MONTHS_ES, spanishDateToISO, extractTitleTag } from './scrapeUtils.js';

// ─────────────────────────────────────────────
// MILEI — casarosada.gob.ar (índice HTML estático)
// ─────────────────────────────────────────────

const MILEI_LIST = 'https://www.casarosada.gob.ar/informacion/discursos';
const MILEI_BASE = 'https://www.casarosada.gob.ar';

function mileiExtractContent(html) {
  const containers = [
    /<div[^>]+class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div\s*>/i,
    /<div[^>]+class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/div\s*>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];
  for (const re of containers) {
    const m = html.match(re);
    if (m && m[1].length > 1000) return decodeEntities(stripTags(m[1]));
  }
  const full = decodeEntities(stripTags(html));
  const speechStart = /Buenos\s+d[íi]as|Buenas\s+tardes|Buenas\s+noches|Javier\s+Milei:|PRESIDENTE\s+DE\s+LA\s+NACI[ÓO]N/i;
  const idx = full.search(speechStart);
  if (idx > 50 && idx < full.length * 0.6) return full.slice(idx).trim();
  return full
    .replace(/^.*?Detalles\s*[-–—>]+\s*/i, '')
    .replace(/Compartilo en redes[\s\S]*?Tweet\s*[-–—>]+\s*/gi, '')
    .trim();
}

const milei = {
  id: 'milei',
  entity: { entity_id: 'milei', entity_name: 'Javier Milei', entity_country: 'Argentina', entity_flag: '🇦🇷' },
  category: 'Político',
  async findLatest() {
    const listHtml = await fetchHtml(MILEI_LIST);
    const match = listHtml.match(/<a[^>]*class="panel"[^>]*href="(\/informacion\/discursos\/[^"]+)"/);
    if (!match) throw new Error('No se encontró ningún discurso en el listado de Casa Rosada');
    const sourceUrl = `${MILEI_BASE}${match[1]}`;
    const detailHtml = await fetchHtml(sourceUrl);
    return {
      sourceUrl,
      title: extractTitleTag(detailHtml),
      publishedDate: spanishDateToISO(detailHtml),
      text: mileiExtractContent(detailHtml),
    };
  },
};

// ─────────────────────────────────────────────
// SHEINBAUM — gob.mx (URL construida desde la fecha; índice requiere JS)
// ─────────────────────────────────────────────

const SHEINBAUM_BASE = 'https://www.gob.mx';
const SHEINBAUM_SLUG = '/presidencia/articulos/version-estenografica-conferencia-de-prensa-de-la-presidenta-claudia-sheinbaum-pardo-del-';
const SHEINBAUM_LOOKBACK = 7;

function dateToISO(date) {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${date.getUTCFullYear()}-${mm}-${dd}`;
}

function sheinbaumExtractText(html) {
  const containers = [
    /<div[^>]+class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]+class="[^"]*content-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];
  for (const re of containers) {
    const m = html.match(re);
    if (m && m[1].length > 1000) return decodeEntities(stripTags(m[1]));
  }
  const full = decodeEntities(stripTags(html));
  const speechStart = /PRESIDENTA\s+DE\s+MÉ?XICO|PRESIDENTE\s+DE\s+MÉ?XICO|Muy\s+buenos\s|Buenos\s+d[íi]as|Buenas\s+tardes|Buenas\s+noches/i;
  const idx = full.search(speechStart);
  if (idx > 50 && idx < full.length * 0.6) return full.slice(idx).trim();
  return full;
}

const sheinbaum = {
  id: 'sheinbaum',
  entity: { entity_id: 'sheinbaum', entity_name: 'Claudia Sheinbaum', entity_country: 'México', entity_flag: '🇲🇽' },
  category: 'Político',
  async findLatest() {
    const now = new Date();
    for (let i = 0; i < SHEINBAUM_LOOKBACK; i++) {
      const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
      // El día NO lleva cero adelante en el slug (ej. "8-de-junio-de-2026")
      const slug = `${candidate.getUTCDate()}-de-${MONTHS_ES[candidate.getUTCMonth()]}-de-${candidate.getUTCFullYear()}`;
      const url = `${SHEINBAUM_BASE}${SHEINBAUM_SLUG}${slug}`;
      let html;
      try {
        html = await fetchHtml(url);
      } catch {
        continue; // 404 esperado en fines de semana/feriados
      }
      if (html.length > 2000) {
        return {
          sourceUrl: url,
          title: extractTitleTag(html)?.replace(/\s*\|\s*.*$/, '') ?? null,
          publishedDate: dateToISO(candidate),
          text: sheinbaumExtractText(html),
        };
      }
    }
    return null;
  },
};

// ─────────────────────────────────────────────
// SÁNCHEZ — lamoncloa.gob.es (índice de intervenciones, HTML estático,
// fecha YYYYMMDD en el slug, transcripciones completas)
// ─────────────────────────────────────────────

const SANCHEZ_INDEX = 'https://www.lamoncloa.gob.es/presidente/intervenciones/Paginas/index.aspx';
const SANCHEZ_BASE = 'https://www.lamoncloa.gob.es';

function sanchezExtractText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const full = decodeEntities(stripTags(m ? m[1] : html));
  // La transcripción empieza en el encabezado en mayúsculas o en el saludo
  const speechStart = /INTERVENCI[ÓO]N\s+DEL?\s+PRESIDENTE|DECLARACI[ÓO]N\s+DEL?\s+PRESIDENTE|COMPARECENCIA\s+DEL?\s+PRESIDENTE|Buenos\s+d[íi]as|Buenas\s+tardes|Buenas\s+noches/i;
  const idx = full.search(speechStart);
  if (idx > 20 && idx < full.length * 0.6) return full.slice(idx).trim();
  return full;
}

const sanchez = {
  id: 'sanchez',
  entity: { entity_id: 'sanchez', entity_name: 'Pedro Sánchez', entity_country: 'España', entity_flag: '🇪🇸' },
  category: 'Político',
  async findLatest() {
    const listHtml = await fetchHtml(SANCHEZ_INDEX);
    // Acepta slugs con y sin subcarpeta de año: /Paginas/2026/20260723-*.aspx y /Paginas/20260722-*.aspx
    const match = listHtml.match(/href="(\/presidente\/intervenciones\/Paginas\/(?:\d{4}\/)?(\d{8})[^"]*\.aspx)"/i);
    if (!match) throw new Error('No se encontró ninguna intervención en el índice de La Moncloa');
    const sourceUrl = `${SANCHEZ_BASE}${match[1]}`;
    const d = match[2]; // YYYYMMDD
    const detailHtml = await fetchHtml(sourceUrl);
    return {
      sourceUrl,
      title: extractTitleTag(detailHtml)
        ?.replace(/^La Moncloa\.\s*/i, '')
        .replace(/\s*\[[^\]]*\]\s*$/, '')
        .replace(/\s*\|\s*[\d/]+\s*$/, '') ?? null,
      publishedDate: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
      text: sanchezExtractText(detailHtml),
    };
  },
};

// ─────────────────────────────────────────────
// CEPEDA — presidenteivancepeda.com (sitio Next.js con SSR; índice /noticias)
// Solo se aceptan piezas en primera persona (mensajes, alocuciones,
// declaraciones): los comunicados de campaña en tercera persona no son
// discurso de Cepeda y contaminarían la serie diaria.
// ─────────────────────────────────────────────

const CEPEDA_BASE = 'https://www.presidenteivancepeda.com';
const CEPEDA_FIRST_PERSON_SLUG = /mensaje|alocucion|discurso|declaracion|palabras|intervencion/i;
const CEPEDA_MAX_CANDIDATES = 5;

function cepedaExtractText(html) {
  const full = decodeEntities(stripTags(html));
  // Los textos del sitio suelen abrir con la línea de datación "Bogotá, D de mes de YYYY."
  const idx = full.search(/[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+,\s+\d{1,2}\s+de\s+[a-záéíóúñ]+\s+de\s+\d{4}\./);
  if (idx > 50 && idx < full.length * 0.6) return full.slice(idx).trim();
  return full;
}

/** Heurística de primera persona: el texto habla Cepeda, no la campaña sobre él. */
function looksFirstPerson(slug, title, text) {
  if (CEPEDA_FIRST_PERSON_SLUG.test(slug) || CEPEDA_FIRST_PERSON_SLUG.test(title || '')) return true;
  const sample = (text || '').slice(0, 3000);
  const markers = sample.match(/\b(?:convoco|llamo|invito|propongo|reitero|advierto|denuncio|he decidido|quiero decirles|colombianas y colombianos|compatriotas)\b/gi) || [];
  return markers.length >= 2;
}

const cepeda = {
  id: 'cepeda',
  entity: { entity_id: 'cepeda', entity_name: 'Iván Cepeda', entity_country: 'Colombia', entity_flag: '🇨🇴' },
  category: 'Político',
  async findLatest() {
    const listHtml = await fetchHtml(`${CEPEDA_BASE}/noticias`);
    const slugs = [...new Set(
      [...listHtml.matchAll(/href="(?:https?:\/\/www\.presidenteivancepeda\.com)?(\/noticias\/[a-z0-9-]+)"/gi)].map(x => x[1]),
    )].slice(0, CEPEDA_MAX_CANDIDATES);

    for (const slug of slugs) {
      const sourceUrl = `${CEPEDA_BASE}${slug}`;
      let html;
      try {
        html = await fetchHtml(sourceUrl);
      } catch {
        continue;
      }
      const title = extractTitleTag(html)?.replace(/\s*—\s*Iván Cepeda.*$/i, '') ?? null;
      const text = cepedaExtractText(html);
      if (!looksFirstPerson(slug, title, text)) continue;
      return {
        sourceUrl,
        title,
        publishedDate: spanishDateToISO(text) ?? spanishDateToISO(slug.replace(/-/g, ' ')),
        text,
      };
    }
    return null; // sin piezas en primera persona — día sin discurso
  },
};

export const SOURCES = [milei, sheinbaum, sanchez, cepeda];
