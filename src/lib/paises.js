import { getSpeechesByEntity } from '../data/speeches';
import { fechaOrden } from './discursos';

// IRA · países: datos de presentación (nombre en world-atlas, bandera, cargo y mini resumen de cada político)
// Solo presentación. Los cargos y resúmenes están escritos a mano: revisar al cambiar un gobierno.
// País = promedio de la puntuación de las figuras analizadas de ese país.

// Clave = nombre del país tal como figura en ENTITIES (campo `country`)
export const PAISES = {
  'Uruguay':        { slug: 'uruguay',        atlas: 'Uruguay',                  iso: 'uy', en: 'Uruguay' },
  'Nueva Zelanda':  { slug: 'nueva-zelanda',  atlas: 'New Zealand',              iso: 'nz', en: 'New Zealand' },
  'México':         { slug: 'mexico',         atlas: 'Mexico',                   iso: 'mx', en: 'Mexico' },
  'Colombia':       { slug: 'colombia',       atlas: 'Colombia',                 iso: 'co', en: 'Colombia' },
  'España':         { slug: 'espana',         atlas: 'Spain',                    iso: 'es', en: 'Spain' },
  'Estados Unidos': { slug: 'estados-unidos', atlas: 'United States of America', iso: 'us', en: 'United States' },
  'Argentina':      { slug: 'argentina',      atlas: 'Argentina',                iso: 'ar', en: 'Argentina' },
  'Rusia':          { slug: 'rusia',          atlas: 'Russia',                   iso: 'ru', en: 'Russia' },
  'El Salvador':    { slug: 'el-salvador',    atlas: 'El Salvador',              iso: 'sv', en: 'El Salvador' },
  'Chile':          { slug: 'chile',          atlas: 'Chile',                    iso: 'cl', en: 'Chile' },
};

export const porSlug = (slug) => Object.entries(PAISES).map(([nombre, p]) => ({ nombre, ...p })).find((p) => p.slug === slug) ?? null;
export const urlBandera = (iso) => `/banderas/${iso}.svg`;

// Cargo (etiqueta corta) y mini resumen por figura. `id` = id en ENTITIES.
export const POLITICOS = {
  mujica: {
    rol: { es: 'Expresidente', en: 'Former president' },
    resumen: {
      es: 'Presidente de Uruguay entre 2010 y 2015, histórico dirigente del Frente Amplio. Falleció en mayo de 2025.',
      en: 'President of Uruguay from 2010 to 2015 and a historic Frente Amplio leader. He died in May 2025.',
    },
  },
  ardern: {
    rol: { es: 'Expremier', en: 'Former prime minister' },
    resumen: {
      es: 'Primera ministra de Nueva Zelanda entre 2017 y 2023, al frente del Partido Laborista.',
      en: 'Prime Minister of New Zealand from 2017 to 2023, leading the Labour Party.',
    },
  },
  sheinbaum: {
    rol: { es: 'Presidenta', en: 'President' },
    resumen: {
      es: 'Presidenta de México desde octubre de 2024. Antes fue jefa de Gobierno de Ciudad de México.',
      en: 'President of Mexico since October 2024. Previously head of government of Mexico City.',
    },
  },
  petro: {
    rol: { es: 'Expresidente', en: 'Former president' },
    resumen: {
      es: 'Presidente de Colombia entre 2022 y 2026. Antes fue senador y alcalde de Bogotá.',
      en: 'President of Colombia from 2022 to 2026. Previously a senator and mayor of Bogotá.',
    },
  },
  sanchez: {
    rol: { es: 'Presidente del Gobierno', en: 'Prime minister' },
    resumen: {
      es: 'Presidente del Gobierno de España desde 2018 y secretario general del PSOE.',
      en: 'Prime Minister of Spain since 2018 and secretary general of the PSOE.',
    },
  },
  trump: {
    rol: { es: 'Presidente', en: 'President' },
    resumen: {
      es: 'Presidente de Estados Unidos entre 2017 y 2021 y de nuevo desde 2025.',
      en: 'President of the United States from 2017 to 2021 and again since 2025.',
    },
  },
  putin: {
    rol: { es: 'Presidente', en: 'President' },
    resumen: {
      es: 'Presidente de Rusia desde 2012, tras haberlo sido entre 2000 y 2008 y ejercer como primer ministro.',
      en: 'President of Russia since 2012, after serving 2000 to 2008 and as prime minister.',
    },
  },
  milei: {
    rol: { es: 'Presidente', en: 'President' },
    resumen: { es: 'Presidente de Argentina desde diciembre de 2023. Antes fue diputado nacional.', en: 'President of Argentina since December 2023. Previously a national deputy.' },
  },
  rufian: {
    rol: { es: 'Diputado', en: 'Deputy' },
    resumen: { es: 'Diputado de ERC en el Congreso de los Diputados de España.', en: 'ERC deputy in the Spanish Congress of Deputies.' },
  },
  bukele: {
    rol: { es: 'Presidente', en: 'President' },
    resumen: { es: 'Presidente de El Salvador desde 2019, reelegido en 2024.', en: 'President of El Salvador since 2019, re-elected in 2024.' },
  },
  kast: {
    rol: { es: 'Presidente', en: 'President' },
    resumen: { es: 'Presidente de Chile desde marzo de 2026. Antes fue diputado y fundador del Partido Republicano.', en: 'President of Chile since March 2026. Previously a deputy and founder of the Republican Party.' },
  },
};

// Figuras con cargo relevante pero sin discursos analizados todavía (se muestran en gris, sin cifra)
export const PENDIENTES = {
  Colombia: [
    {
      id: 'de-la-espriella', name: 'Abelardo de la Espriella',
      rol: { es: 'Presidente', en: 'President' },
      resumen: { es: 'Presidente de Colombia desde el 7 de agosto de 2026.', en: 'President of Colombia since 7 August 2026.' },
    },
  ],
};

/** Etiqueta del nivel de un país (umbrales propuestos: <4, 4–7, ≥7) */
export function etiquetaNivel(puntuacion, lang = 'es') {
  const es = lang !== 'en';
  if (puntuacion == null) return es ? 'Sin datos' : 'No data';
  if (puntuacion < 4) return es ? 'Polarizante' : 'Polarizing';
  if (puntuacion < 7) return es ? 'Mixto' : 'Mixed';
  return es ? 'Empático' : 'Empathic';
}

/** Agrupa las entidades políticas por país y calcula el promedio. `puntuar(entidad)` devuelve su puntuación o null. */
export function agruparPorPais(entidades, puntuar) {
  const mapa = new Map();
  entidades.filter((e) => e.category === 'Político' && PAISES[e.country]).forEach((e) => {
    const p = PAISES[e.country];
    if (!mapa.has(p.slug)) mapa.set(p.slug, { nombre: e.country, ...p, figuras: [] });
    mapa.get(p.slug).figuras.push({ ...e, puntuacion: puntuar(e) });
  });
  return [...mapa.values()].map((pais) => {
    const valores = pais.figuras.map((f) => f.puntuacion).filter((v) => v != null);
    return { ...pais, puntuacion: valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null };
  });
}

/** Puntuación de una figura: la de la base de datos si está lista; si no, el promedio del corpus local. */
export function puntuacionFigura(entidad) {
  if (entidad.score != null) return entidad.score;
  const v = getSpeechesByEntity(entidad.id).map((s) => s.iraScore).filter((x) => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

/** Discursos del corpus de las figuras de un país, del más reciente al más antiguo (con la puntuación de la base de datos si hay). */
export function discursosDelPais(figuras, supabaseMap, mezclar) {
  return figuras
    .flatMap((f) => getSpeechesByEntity(f.id))
    .map((s) => (mezclar ? mezclar(s, supabaseMap?.[s.id]) : s))
    .sort((a, b) => fechaOrden(b.date) - fechaOrden(a.date));
}

/** Nombre de un país en el idioma de la interfaz (`pais` viene de agruparPorPais) */
export const nombrePais = (pais, lang = 'es') => (lang === 'en' && pais.en ? pais.en : pais.nombre);
