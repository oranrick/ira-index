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

/** Primer fragmento anotado del discurso, para usarlo como cita de la tarjeta. */
export function citaDestacada(speech, lang = 'es', max = 220) {
  const seg = (speech?.segments ?? []).find((s) => s.type && (s.text ?? '').trim().length > 20);
  let t = seg ? textoFragmento(seg, lang) : '';
  if (!t) t = (lang === 'en' && speech?.summaryEn) ? speech.summaryEn : (speech?.summary ?? '');
  t = t.trim().replace(/^["“«]+|["”»]+$/g, '').trim();
  if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') + '…';
  return t;
}
