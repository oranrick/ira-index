// src/components/DailyAnalysis.jsx
// Vista mínima "Análisis del día": muestra el discurso más reciente ingerido
// en daily_analyses (vía cron diario o /api/add-speech), sin tocar el corpus curado.

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const IRA_COLOR = (score) => {
  if (score >= 7) return '#6ec6a0';
  if (score >= 4.5) return '#e8a838';
  return '#e05252';
};

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

  if (loading) {
    return <div style={styles.wrap}><p style={styles.muted}>{T.loading}</p></div>;
  }
  if (!row) {
    return <div style={styles.wrap}><p style={styles.muted}>{T.empty}</p></div>;
  }

  const col = IRA_COLOR(row.ira);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>{T.title}</h2>
        <p style={styles.desc}>{T.desc}</p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTop}>
          <div style={styles.entity}>
            {row.entity_flag && <span style={styles.flag}>{row.entity_flag}</span>}
            <div>
              <div style={styles.entityName}>{row.entity_name}</div>
              <div style={styles.meta}>
                {row.published_date && <span>{row.published_date}</span>}
                <span style={styles.originBadge}>{row.origin === 'manual' ? T.manual : T.cron}</span>
              </div>
            </div>
          </div>
          <div style={{ ...styles.score, color: col }}>
            <span style={styles.scoreNumber}>{Number(row.ira).toFixed(1)}</span>
            <span style={styles.scoreMax}>/10</span>
          </div>
        </div>

        {row.title && <h3 style={styles.speechTitle}>{row.title}</h3>}

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
          <button style={styles.expandBtn} onClick={() => setExpanded(v => !v)}>
            {expanded ? T.collapse : T.expand}
          </button>
        </div>

        {expanded && <p style={styles.fullText}>{row.text}</p>}

        <div style={styles.iraBarTrack}>
          <div style={{ ...styles.iraBarFill, width: `${(row.ira / 10) * 100}%`, background: col }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '2rem 1.2rem',
  },
  header: {
    marginBottom: '1.4rem',
  },
  title: {
    margin: 0,
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fff',
  },
  desc: {
    margin: '0.4rem 0 0',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.45)',
  },
  muted: {
    fontFamily: "'DM Mono', monospace",
    color: 'rgba(255,255,255,0.4)',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1.4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entity: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'center',
  },
  flag: {
    fontSize: '1.6rem',
  },
  entityName: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    color: '#fff',
    fontSize: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '0.6rem',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '2px',
  },
  originBadge: {
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  score: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  scoreNumber: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '1.8rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreMax: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.3)',
  },
  speechTitle: {
    margin: 0,
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#fff',
  },
  summary: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.82rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.7)',
  },
  lectura: {
    borderLeft: '2px solid rgba(255,102,0,0.4)',
    paddingLeft: '0.8rem',
  },
  lecturaLabel: {
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#ff6600',
    marginBottom: '0.3rem',
  },
  lecturaText: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.8rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
  },
  expandBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  fullText: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.78rem',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.55)',
    whiteSpace: 'pre-wrap',
    maxHeight: '420px',
    overflowY: 'auto',
    margin: 0,
    padding: '0.8rem',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  iraBarTrack: {
    height: '3px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  iraBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
};
