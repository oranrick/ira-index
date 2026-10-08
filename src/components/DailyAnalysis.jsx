// src/components/DailyAnalysis.jsx
// Vista mínima "Análisis del día": muestra el discurso más reciente ingerido
// en daily_analyses (vía cron diario o /api/add-speech), sin tocar el corpus curado.

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaDiscurso from './ui/TarjetaDiscurso.jsx';
import { fechaCorta, citaDestacada } from '../lib/discursos';

const TEXTS = {
  es: {
    title: 'Análisis del día',
    desc: 'El discurso más reciente detectado automáticamente, analizado con el motor IRA.',
    loading: 'Cargando...',
    empty: 'Todavía no hay ningún discurso analizado.',
    source: 'Ver fuente original →',
    expand: 'Ver texto completo',
    collapse: 'Ocultar texto',
    lecturaAutor: 'Lectura del autor',
    manual: 'Añadido manualmente',
    cron: 'Detectado automáticamente',
  },
  en: {
    title: 'Daily analysis',
    desc: 'The most recently detected speech, analyzed with the IRA engine.',
    loading: 'Loading...',
    empty: 'No speech has been analyzed yet.',
    source: 'View original source →',
    expand: 'Show full text',
    collapse: 'Hide text',
    lecturaAutor: "Author's reading",
    manual: 'Added manually',
    cron: 'Automatically detected',
  },
};

export default function DailyAnalysis({ lang = 'es' }) {
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const T = TEXTS[lang] || TEXTS.es;

  useEffect(() => {
    supabase
      .from('daily_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setRow(data?.[0] ?? null);
        setLoading(false);
      });
  }, []);

  const cabecera = (
    <div className="ira-cabecera" style={{ marginBottom: '32px' }}>
      <h1 className="ira-cabecera__titulo">{T.title}</h1>
      <p className="ira-cabecera__texto">{T.desc}</p>
    </div>
  );

  if (loading) {
    return <div style={styles.wrap}>{cabecera}<p style={styles.muted} role="status">{T.loading}</p></div>;
  }
  if (!row) {
    return <div style={styles.wrap}>{cabecera}<p style={styles.muted}>{T.empty}</p></div>;
  }

  return (
    <div style={styles.wrap}>
      {cabecera}

      <TarjetaDiscurso
        lang={lang}
        orador={row.entity_name}
        cargo={row.title}
        fecha={fechaCorta(row.published_date)}
        cita={citaDestacada({ segments: row.segments, summary: row.summary }, lang, 260)}
        puntuacion={Number(row.ira)}
        pie={row.origin === 'manual' ? T.manual : T.cron}
      />

      {row.summary && <p style={styles.summary}>{row.summary}</p>}

      {row.lectura_autor && (
        <div style={styles.lectura}>
          <span style={styles.lecturaLabel}>{T.lecturaAutor}</span>
          <p style={styles.lecturaText}>{row.lectura_autor}</p>
        </div>
      )}

      <div style={styles.footer}>
        {row.source_url && (
          <a href={row.source_url} target="_blank" rel="noreferrer" style={styles.link}>{T.source}</a>
        )}
        <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
          {expanded ? T.collapse : T.expand}
        </button>
      </div>

      {expanded && <p style={styles.fullText}>{row.text}</p>}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '760px', margin: '0 auto', padding: '24px 24px 64px' },
  muted: { color: 'var(--ira-texto-2)', fontSize: '15px' },
  summary: { margin: '28px 0 0', fontSize: '17px', lineHeight: '28px', color: 'var(--ira-texto-cita)' },
  lectura: {
    marginTop: '24px', padding: '20px 24px',
    background: 'var(--ira-superficie)', border: '1px solid var(--ira-linea)', borderRadius: 'var(--ira-radio-l)',
  },
  lecturaLabel: { display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--ira-oro)' },
  lecturaText: { margin: 0, fontSize: '16px', lineHeight: 1.75, color: 'var(--ira-texto-cita)', fontStyle: 'italic' },
  footer: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '24px' },
  link: { fontSize: '15px', fontWeight: 500, textUnderlineOffset: '4px', padding: '12px 0' },
  fullText: {
    marginTop: '20px', padding: '24px', whiteSpace: 'pre-wrap',
    background: 'var(--ira-superficie)', border: '1px solid var(--ira-linea)', borderRadius: 'var(--ira-radio-l)',
    fontSize: '16px', lineHeight: 1.75, color: 'var(--ira-texto-cita)',
  },
};
