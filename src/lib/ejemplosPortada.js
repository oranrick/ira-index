// IRA · ejemplos del panel de la portada, construidos con discursos ya analizados.
// Solo lectura: usa los fragmentos anotados (segments) y las puntuaciones de los
// parámetros que ya devuelve el análisis. No modifica datos ni llama a la API.
//
// Cada ejemplo: { id, pais, fecha, persona, discurso, puntuacion,
//                 fragmentos: [{ texto, polaridad, puntuacion }] }

import { fechaCorta, textoFragmento } from './discursos';
import { polaridadFragmento, puntuacionFragmento, puntuacionesPorClave } from './anotaciones';

const MAX_CARACTERES = 130;
// Un fragmento muy corto no basta para entender el ejemplo
const MIN_CARACTERES = 20;

/** Recorta un fragmento largo en un límite de palabra. */
function recortar(texto) {
  if (texto.length <= MAX_CARACTERES) return texto;
  let fin = texto.lastIndexOf(' ', MAX_CARACTERES);
  if (fin < 40) fin = MAX_CARACTERES;
  return texto.slice(0, fin) + '…';
}

/** Elige hasta 3 fragmentos, mezclando polarizantes y empáticos cuando los hay. */
export function construirFragmentos(segmentos, puntuaciones, lang = 'es') {
  const candidatos = (segmentos ?? [])
    .map((seg, orden) => {
      if (!seg?.type) return null;
      const texto = textoFragmento(seg, lang).trim();
      const polaridad = polaridadFragmento(seg.type, puntuaciones);
      const puntuacion = puntuacionFragmento(seg.type, puntuaciones);
      if (texto.length < MIN_CARACTERES || !polaridad || puntuacion == null) return null;
      // Solo fragmentos coherentes: los destellos no pueden contradecir la cifra
      if ((polaridad === 'polarizante') !== (puntuacion < 5)) return null;
      return { texto: recortar(texto), polaridad, puntuacion, orden };
    })
    .filter(Boolean)
    .filter((c, i, l) => l.findIndex((o) => o.texto === c.texto) === i)
    .sort((a, b) => a.orden - b.orden);

  const elegidos = [];
  for (const pol of ['polarizante', 'empatico']) {
    const f = candidatos.find((c) => c.polaridad === pol);
    if (f) elegidos.push(f);
  }
  for (const c of candidatos) {
    if (elegidos.length >= 3) break;
    if (!elegidos.includes(c)) elegidos.push(c);
  }
  return elegidos.slice(0, 3).sort((a, b) => a.orden - b.orden)
    .map(({ texto, polaridad, puntuacion }) => ({ texto, polaridad, puntuacion }));
}

/** Discurso del corpus (speeches.js, con la puntuación de la tabla analyses ya fusionada). */
export function ejemploDesdeCorpus(speech, entidad, lang = 'es') {
  const puntuaciones = puntuacionesPorClave(speech.params);
  return {
    id: speech.id,
    reciente: false,
    pais: entidad?.country ?? '',
    fecha: fechaCorta(speech.date),
    persona: speech.entityName,
    discurso: (lang === 'en' && speech.titleEn) || speech.title,
    puntuacion: speech.iraScore,
    fragmentos: construirFragmentos(speech.segments, puntuaciones, lang),
  };
}

/** Fila de daily_analyses (discursos que el cron analiza a diario). */
export function ejemploDesdeDiario(row, lang = 'es') {
  const puntuaciones = puntuacionesPorClave(row.params);
  return {
    id: `daily-${row.id}`,
    reciente: true,
    orden: row.published_date ?? '',
    pais: row.entity_country ?? '',
    fecha: fechaCorta(row.published_date),
    persona: row.entity_name,
    discurso: row.title ?? '',
    puntuacion: Number(row.ira),
    fragmentos: construirFragmentos(row.segments, puntuaciones, lang),
  };
}

/**
 * Elige 3 ejemplos que recorran la escala: el más empático, el más polarizante y,
 * entre medias, el discurso diario más reciente (o el más cercano a 5 si no hay).
 */
export function seleccionarEjemplos(pool) {
  const validos = pool.filter((e) => e.fragmentos.length >= 2 && Number.isFinite(e.puntuacion));
  if (validos.length <= 3) return validos;
  const porPuntuacion = [...validos].sort((a, b) => b.puntuacion - a.puntuacion);
  const alto = porPuntuacion[0];
  const bajo = porPuntuacion[porPuntuacion.length - 1];
  const resto = validos.filter((e) => e !== alto && e !== bajo);
  const recientes = resto.filter((e) => e.reciente).sort((a, b) => String(b.orden).localeCompare(String(a.orden)));
  const medio = recientes[0] ?? [...resto].sort((a, b) => Math.abs(a.puntuacion - 5) - Math.abs(b.puntuacion - 5))[0];
  return [alto, bajo, medio];
}
