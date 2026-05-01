// src/components/SpeechView.jsx
import { useState, useRef, useEffect } from 'react';
import { ANNOTATION_TYPES } from '../data/speeches';

const IRA_COLOR = (score) => {
  if (score >= 7.5) return '#2ecc71';
  if (score >= 5) return '#f59e0b';
  return '#ff6600';
};

export function SpeechView({ speech, onBack }) {
  const [activeAnnotation, setActiveAnnotation] = useState(null); // { type, note, rect }
  const [pinnedAnnotation, setPinnedAnnotation] = useState(null); // clicked/pinned
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const scoreColor = IRA_COLOR(speech.iraScore);

  // Close pinned panel on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setPinnedAnnotation(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleAnnotationHover = (e, segment) => {
    if (!segment.type) return;
    const annotationType = ANNOTATION_TYPES[segment.type];
    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      top: rect.bottom - containerRect.top + 8,
      left: Math.min(
        rect.left - containerRect.left,
        containerRect.width - 280
      ),
    });
    setActiveAnnotation({ ...annotationType, note: segment.note });
  };

  const handleAnnotationClick = (e, segment) => {
    if (!segment.type) return;
    e.stopPropagation();
    const annotationType = ANNOTATION_TYPES[segment.type];
    setPinnedAnnotation({ ...annotationType, note: segment.note });
    setActiveAnnotation(null);
  };

  // Count annotations by type
  const annotationCounts = speech.segments
    .filter((s) => s.type)
    .reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {});

  return (
    <div style={styles.wrapper} onClick={() => setPinnedAnnotation(null)}>
      {/* Back button */}
      <button onClick={onBack} style={styles.backBtn}>
        ← Volver al perfil
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.entityChip}>{speech.entityName}</div>
          <h1 style={styles.title}>{speech.title}</h1>
          <div style={styles.meta}>
            <span style={styles.metaItem}>📅 {speech.date}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaItem}>⏱ {speech.duration}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaItem}>{speech.wordCount.toLocaleString()} palabras</span>
          </div>
          <p style={styles.context}>{speech.context}</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.scoreBox}>
            <span style={{ ...styles.scoreNumber, color: scoreColor }}>
              {speech.iraScore.toFixed(1)}
            </span>
            <span style={styles.scoreLabel}>IRA Score</span>
            <span style={{ ...styles.scoreClassification, color: scoreColor }}>
              {speech.iraLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={styles.summaryBox}>
        <span style={styles.summaryIcon}>🔍</span>
        <p style={styles.summaryText}>{speech.summary}</p>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendTitle}>Leyenda de anotaciones:</span>
        {Object.entries(annotationCounts).map(([typeKey, count]) => {
          const t = ANNOTATION_TYPES[typeKey];
          return (
            <div key={typeKey} style={styles.legendItem}>
              <span
                style={{
                  ...styles.legendDot,
                  background: t.color,
                }}
              />
              <span style={{ ...styles.legendLabel, color: t.color }}>
                {t.label}
              </span>
              <span style={styles.legendCount}>×{count}</span>
            </div>
          );
        })}
      </div>

      {/* Main layout: text + params */}
      <div style={styles.mainLayout}>
        {/* Annotated text */}
        <div style={styles.textColumn} ref={containerRef}>
          <h2 style={styles.sectionTitle}>Fragmento anotado</h2>
          <div style={styles.textBlock}>
            {speech.segments.map((segment, i) => {
              if (!segment.type) {
                return <span key={i} style={styles.plainText}>{segment.text}</span>;
              }
              const annotationType = ANNOTATION_TYPES[segment.type];
              return (
                <span
                  key={i}
                  onMouseEnter={(e) => handleAnnotationHover(e, segment)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                  onClick={(e) => handleAnnotationClick(e, segment)}
                  style={{
                    ...styles.annotatedSpan,
                    color: annotationType.color,
                    borderBottomColor: annotationType.color,
                    background:
                      pinnedAnnotation?.note === segment.note
                        ? annotationType.bg
                        : 'transparent',
                  }}
                  title=""
                >
                  {segment.text}
                </span>
              );
            })}
          </div>

          {/* Hover tooltip */}
          {activeAnnotation && (
            <div
              style={{
                ...styles.tooltip,
                top: tooltipPos.top,
                left: tooltipPos.left,
              }}
            >
              <div style={styles.tooltipHeader}>
                <span style={styles.tooltipIcon}>{activeAnnotation.icon}</span>
                <span style={{ ...styles.tooltipLabel, color: activeAnnotation.color }}>
                  {activeAnnotation.label}
                </span>
                <span style={styles.tooltipParam}>{activeAnnotation.param}</span>
              </div>
              <p style={styles.tooltipDesc}>{activeAnnotation.description}</p>
              <p style={styles.tooltipHint}>Clic para fijar el análisis →</p>
            </div>
          )}
        </div>

        {/* Params panel */}
        <div style={styles.paramsColumn}>
          <h2 style={styles.sectionTitle}>Parámetros IRA</h2>
          <div style={styles.paramsList}>
            {speech.params.map((param, i) => (
              <div key={i} style={styles.paramItem}>
                <div style={styles.paramHeader}>
                  <span style={styles.paramName}>{param.name}</span>
                  <span
                    style={{
                      ...styles.paramValue,
                      color: IRA_COLOR(param.value),
                    }}
                  >
                    {param.value.toFixed(1)}
                  </span>
                </div>
                <div style={styles.paramBarTrack}>
                  <div
                    style={{
                      ...styles.paramBarFill,
                      width: `${(param.value / 10) * 100}%`,
                      background: IRA_COLOR(param.value),
                    }}
                  />
                </div>
                <p style={styles.paramNote}>{param.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned annotation panel (side drawer style, fixed) */}
      {pinnedAnnotation && (
        <div
          style={styles.pinnedPanel}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setPinnedAnnotation(null)}
            style={styles.pinnedClose}
          >
            ✕
          </button>
          <div
            style={{
              ...styles.pinnedColorBar,
              background: pinnedAnnotation.color,
            }}
          />
          <div style={styles.pinnedContent}>
            <div style={styles.pinnedTopRow}>
              <span style={styles.pinnedIcon}>{pinnedAnnotation.icon}</span>
              <div>
                <p style={{ ...styles.pinnedLabel, color: pinnedAnnotation.color }}>
                  {pinnedAnnotation.label}
                </p>
                <p style={styles.pinnedParam}>{pinnedAnnotation.param}</p>
              </div>
            </div>
            <p style={styles.pinnedDesc}>{pinnedAnnotation.description}</p>
            <div style={styles.pinnedDivider} />
            <p style={styles.pinnedNoteTitle}>Análisis del fragmento</p>
            <p style={styles.pinnedNote}>{pinnedAnnotation.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem 1rem 4rem',
    minHeight: '100vh',
  },
  backBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.5)',
    borderRadius: '6px',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.75rem',
    marginBottom: '1.5rem',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    marginBottom: '1.2rem',
    flexWrap: 'wrap',
  },
  headerLeft: {
    flex: 1,
    minWidth: '260px',
  },
  entityChip: {
    display: 'inline-block',
    background: 'rgba(255,102,0,0.15)',
    color: '#ff6600',
    border: '1px solid rgba(255,102,0,0.3)',
    borderRadius: '4px',
    padding: '2px 10px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    marginBottom: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    margin: '0 0 0.5rem',
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.2,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    alignItems: 'center',
    marginBottom: '0.6rem',
  },
  metaItem: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.4)',
  },
  metaDot: {
    color: 'rgba(255,255,255,0.2)',
  },
  context: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.76rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
    maxWidth: '560px',
  },
  headerRight: {
    flexShrink: 0,
  },
  scoreBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    gap: '0.2rem',
    minWidth: '120px',
  },
  scoreNumber: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '2.8rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  scoreLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  scoreClassification: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  summaryBox: {
    display: 'flex',
    gap: '0.8rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderLeft: '3px solid #ff6600',
    borderRadius: '0 8px 8px 0',
    padding: '0.9rem 1rem',
    marginBottom: '1.2rem',
  },
  summaryIcon: {
    fontSize: '1rem',
    flexShrink: 0,
    marginTop: '2px',
  },
  summaryText: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.7,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '0.7rem 1rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
  },
  legendTitle: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.3)',
    marginRight: '0.3rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    fontWeight: 600,
  },
  legendCount: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.62rem',
    color: 'rgba(255,255,255,0.25)',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '1.5rem',
    alignItems: 'start',
  },
  textColumn: {
    position: 'relative',
  },
  paramsColumn: {
    position: 'sticky',
    top: '1rem',
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '0.8rem',
    margin: '0 0 0.8rem',
  },
  textBlock: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.05rem',
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.82)',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '1.5rem 1.8rem',
    position: 'relative',
  },
  plainText: {
    color: 'rgba(255,255,255,0.82)',
  },
  annotatedSpan: {
    borderBottom: '2px solid',
    cursor: 'pointer',
    borderRadius: '2px',
    padding: '1px 2px',
    transition: 'background 0.15s',
    fontWeight: 600,
  },
  tooltip: {
    position: 'absolute',
    zIndex: 100,
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    maxWidth: '280px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    pointerEvents: 'none',
  },
  tooltipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '0.4rem',
    flexWrap: 'wrap',
  },
  tooltipIcon: {
    fontSize: '0.9rem',
  },
  tooltipLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  tooltipParam: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.62rem',
    color: 'rgba(255,255,255,0.35)',
    marginLeft: 'auto',
  },
  tooltipDesc: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
  },
  tooltipHint: {
    margin: '0.5rem 0 0',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.62rem',
    color: 'rgba(255,102,0,0.6)',
  },
  paramsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '1rem',
  },
  paramItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  paramHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramName: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 600,
  },
  paramValue: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  paramBarTrack: {
    height: '3px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  paramBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.6s ease',
  },
  paramNote: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1.5,
  },
  // Pinned panel (fixed, bottom-right)
  pinnedPanel: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '320px',
    background: '#161616',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
    zIndex: 200,
    overflow: 'hidden',
    animation: 'slideUp 0.2s ease',
  },
  pinnedColorBar: {
    height: '4px',
    width: '100%',
  },
  pinnedClose: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '2px 6px',
    zIndex: 1,
  },
  pinnedContent: {
    padding: '0.9rem 1.1rem 1.1rem',
  },
  pinnedTopRow: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'flex-start',
    marginBottom: '0.6rem',
  },
  pinnedIcon: {
    fontSize: '1.4rem',
    marginTop: '2px',
  },
  pinnedLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 700,
    margin: 0,
  },
  pinnedParam: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.35)',
    margin: '0.1rem 0 0',
  },
  pinnedDesc: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.6,
    margin: '0 0 0.7rem',
  },
  pinnedDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '0.7rem 0',
  },
  pinnedNoteTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: '0 0 0.4rem',
  },
  pinnedNote: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.7,
    margin: 0,
  },
};
