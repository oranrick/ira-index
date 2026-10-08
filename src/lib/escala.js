// IRA · escala de 0 (polarizante) a 10 (empático)
// Regla de diseño: el color nunca aparece sin la cifra al lado.

export const ESCALA = [
  '#8F1C17', '#BE281A', '#CB4021', '#D7662A', '#E59236', '#EEA73D',
  '#F4BC41', '#DAB850', '#C1B360', '#A7AE6F', '#8DAA7E',
];

// Color de texto que cumple contraste sobre cada tono de la escala
export const TEXTO_SOBRE = [
  '#FCFDFF', '#FCFDFF', '#FCFDFF', '#041414', '#041414', '#041414',
  '#041414', '#041414', '#041414', '#041414', '#041414',
];

// Colores para series y categorías (parámetros, figuras). Fuera de la gama de
// la escala para que no se confundan con una puntuación.
export const CATEGORICOS = [
  '#7FA7D9', '#B39DDB', '#5FC4C9', '#E79BC1', '#9FB3C8', '#D7A6E6', '#D5DEDE', '#6F8FD0',
];

export function nivel(puntuacion) {
  const n = Math.round(Number(puntuacion));
  return Math.min(10, Math.max(0, Number.isFinite(n) ? n : 0));
}

/** Color de la escala para una puntuación (admite decimales). */
export function colorPuntuacion(puntuacion) {
  return ESCALA[nivel(puntuacion)];
}

/** Color de texto para poner encima de colorPuntuacion(puntuacion). */
export function textoSobrePuntuacion(puntuacion) {
  return TEXTO_SOBRE[nivel(puntuacion)];
}

/** 7.4 -> "7,4" en español, "7.4" en inglés (por defecto un decimal). */
export function formatearPuntuacion(puntuacion, lang = 'es', decimales = 1) {
  if (puntuacion == null || !Number.isFinite(Number(puntuacion))) return '—';
  const t = Number(puntuacion).toFixed(decimales);
  return lang === 'en' ? t : t.replace('.', ',');
}
