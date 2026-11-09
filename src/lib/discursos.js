// IRA · utilidades de presentación para discursos (solo lectura de datos existentes)

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
  'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** "6 de noviembre de 2024" o "2024-11-06" -> "06/11/2024". Si no se reconoce, la deja igual. */
export function fechaCorta(fecha) {
  if (!fecha) return '';
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  const es = /^(\d{1,2}) de ([a-záéíóú]+) de (\d{4})$/i.exec(fecha.trim());
  if (es) {
    const m = MESES.indexOf(es[2].toLowerCase());
    if (m >= 0) return `${es[1].padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${es[3]}`;
  }
  return fecha;
}

/** Valor ordenable (aaaammdd) a partir de la fecha de un discurso; 0 si no se reconoce. */
export function fechaOrden(fecha) {
  const c = fechaCorta(fecha);
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(c);
  return m ? Number(`${m[3]}${m[2]}${m[1]}`) : 0;
}

/** Texto de un fragmento en el idioma de la interfaz cuando hay traducción. */
export function textoFragmento(seg, lang = 'es') {
  if (!seg) return '';
  if (lang === 'es' && seg.textEs) return seg.textEs;
  if (lang === 'en' && seg.textEn) return seg.textEn;
  return seg.text ?? '';
}

/**
 * Fragmento para mostrar: en inglés, si el original está en español, devuelve el original
 * y la traducción de referencia por separado (capa de lectura: la cita nunca se traduce en su sitio).
 */
export function fragmentoBilingue(seg, lang = 'es') {
  if (!seg) return { texto: '', traduccion: null };
  const original = seg.text ?? '';
  if (lang === 'en' && seg.textEn && seg.textEn.trim() !== original.trim()) return { texto: original, traduccion: seg.textEn };
  return { texto: textoFragmento(seg, lang), traduccion: null };
}

const limpiarCita = (t, max) => {
  t = (t ?? '').trim().replace(/^["“«]+|["”»]+$/g, '').trim();
  if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s.,;:]+$/, '') + '…';
  return t;
};

/** Como citaDestacada, pero con la traducción aparte: { cita, traduccion }. */
export function citaDestacadaBilingue(speech, lang = 'es', max = 220) {
  const seg = (speech?.segments ?? []).find((s) => s.type && (s.text ?? '').trim().length > 20);
  const { texto, traduccion } = fragmentoBilingue(seg, lang);
  if (!texto) return { cita: citaDestacada(speech, lang, max), traduccion: null };
  return { cita: limpiarCita(texto, max), traduccion: traduccion ? limpiarCita(traduccion, max) : null };
}

/** Primer fragmento anotado del discurso, para usarlo como cita de la tarjeta. */
export function citaDestacada(speech, lang = 'es', max = 220) {
  const seg = (speech?.segments ?? []).find((s) => s.type && (s.text ?? '').trim().length > 20);
  let t = seg ? textoFragmento(seg, lang) : '';
  if (!t) t = (lang === 'en' && speech?.summaryEn) ? speech.summaryEn : (speech?.summary ?? '');
  t = t.trim().replace(/^["“«]+|["”»]+$/g, '').trim();
  if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') + '…';
  return t;
}
