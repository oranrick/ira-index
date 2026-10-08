// IRA · polaridad de los fragmentos anotados (solo presentación)
// El análisis etiqueta cada fragmento con un tipo (BELICA, CUIDADO…). Aquí se agrupan
// en polarizante / empático para pintarlos con el halo rojo o salvia del diseño.
// FUTURO y SANITARIA son ambiguos por definición ("puede cohesionar o excluir"):
// se resuelven con la puntuación del parámetro al que pertenecen en ese discurso.

export const POLARIDAD_TIPO = {
  BELICA: 'polarizante',
  PRONOMINAL_EX: 'polarizante',
  DICOTOMIA: 'polarizante',
  MIEDO: 'polarizante',
  PRONOMINAL: 'empatico',
  CUIDADO: 'empatico',
  DISENSO: 'empatico',
  FUTURO: null,
  SANITARIA: null,
};

// Parámetro IRA (clave de la fórmula) al que se refiere cada tipo de anotación
export const PARAMETRO_TIPO = {
  BELICA: 'metafora',
  CUIDADO: 'metafora',
  SANITARIA: 'metafora',
  PRONOMINAL: 'pronominal',
  PRONOMINAL_EX: 'pronominal',
  DICOTOMIA: 'dicotomia',
  MIEDO: 'tono',
  DISENSO: 'disenso',
  FUTURO: 'vector',
};

const NOMBRE_A_CLAVE = {
  'Uso pronominal inclusivo': 'pronominal',
  'Tipo de metáfora dominante': 'metafora',
  'Carga dicotómica': 'dicotomia',
  'Tono emocional dominante': 'tono',
  'Reconocimiento del disenso': 'disenso',
  'Vector de acción': 'vector',
  'Coherencia afectiva': 'coherencia',
  'Proyección de futuro': 'proyeccion',
};

/**
 * Normaliza los parámetros de un discurso a { clave: puntuación }.
 * Acepta el array de speeches.js / rowToSpeech ([{ name, value }]) o el objeto de
 * daily_analyses ({ metafora: { score } }).
 */
export function puntuacionesPorClave(params) {
  if (!params) return {};
  if (Array.isArray(params)) {
    return Object.fromEntries(params
      .filter((p) => NOMBRE_A_CLAVE[p.name] && p.value != null)
      .map((p) => [NOMBRE_A_CLAVE[p.name], Number(p.value)]));
  }
  return Object.fromEntries(Object.entries(params)
    .filter(([, v]) => v && v.score != null)
    .map(([k, v]) => [k, Number(v.score)]));
}

/** Puntuación del parámetro al que pertenece el fragmento, o null. */
export function puntuacionFragmento(tipo, puntuaciones) {
  const clave = PARAMETRO_TIPO[tipo];
  const v = clave ? puntuaciones[clave] : null;
  return Number.isFinite(v) ? v : null;
}

/** 'polarizante' | 'empatico' | null */
export function polaridadFragmento(tipo, puntuaciones = {}) {
  const fija = POLARIDAD_TIPO[tipo];
  if (fija !== undefined && fija !== null) return fija;
  const v = puntuacionFragmento(tipo, puntuaciones);
  if (v == null) return null;
  return v < 5 ? 'polarizante' : 'empatico';
}
