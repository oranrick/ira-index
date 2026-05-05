// src/components/SpeechView.jsx
import { useState, useRef, useEffect } from 'react';
import { ANNOTATION_TYPES } from '../data/speeches';

const SPEECH_VIEW_TEXTS = {
  es: {
    back:             "← Volver",
    annotatedFragment:"FRAGMENTO ANOTADO",
    iraParams:        "PARÁMETROS IRA",
    clickFullAnalysis:"Clic para análisis completo →",
    pinnedNoteTitle:  "Análisis del fragmento",
    translationLabel: "Traducción al español",
    seeTranslation:   "🌐 ver traducción",
    hideTranslation:  "✕ traducción",
    words:            "palabras",
    lecturaLabel:     "PARÁMETRO R · LECTURA DEL AUTOR",
  },
  en: {
    back:             "← Back",
    annotatedFragment:"ANNOTATED FRAGMENT",
    iraParams:        "IRA PARAMETERS",
    clickFullAnalysis:"Click for full analysis →",
    pinnedNoteTitle:  "Fragment analysis",
    translationLabel: "Spanish translation",
    seeTranslation:   "🌐 see translation",
    hideTranslation:  "✕ translation",
    words:            "words",
    lecturaLabel:     "PARAMETER R · AUTHOR'S READING",
  },
};

const IRA_COLOR = (score) => {
  if (score >= 7.5) return '#2ecc71';
  if (score >= 5) return '#f59e0b';
  return '#ff6600';
};

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export function SpeechView({ speech, onBack, lang = 'es' }) {
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [pinnedAnnotation, setPinnedAnnotation] = useState(null);
  const [expandedParam, setExpandedParam] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [showTranslation, setShowTranslation] = useState(false);
  const containerRef = useRef(null);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const scoreColor = IRA_COLOR(speech.iraScore);
  const T = SPEECH_VIEW_TEXTS[lang] || SPEECH_VIEW_TEXTS.es;

  const isEnglishSpeech = speech.speechLang === 'en';
  const showTranslationToggle = lang === 'es' && isEnglishSpeech;
  const translationText = isEnglishSpeech
    ? speech.segments.map((s) => s.textEs != null ? s.textEs : s.text).join('')
    : '';

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setPinnedAnnotation(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleAnnotationHover = (e, segment) => {
    if (!segment.type || isMobile) return;
    const annotationType = ANNOTATION_TYPES[segment.type];
    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const TOOLTIP_W = 255;
    const MARGIN = 10;
    // ideal: align tooltip left edge with the word
    let left = rect.left - containerRect.left;
    // clamp so tooltip doesn't overflow viewport right edge
    const maxLeft = window.innerWidth - containerRect.left - TOOLTIP_W - MARGIN;
    left = Math.min(left, maxLeft);
    // clamp so tooltip doesn't overflow container left edge
    left = Math.max(0, left);
    setTooltipPos({ top: rect.bottom - containerRect.top + 8, left });
    setActiveAnnotation({ ...annotationType, note: segment.note });
  };

  const handleAnnotationClick = (e, segment) => {
    if (!segment.type) return;
    e.stopPropagation();
    const annotationType = ANNOTATION_TYPES[segment.type];
    setPinnedAnnotation({ ...annotationType, note: segment.note });
    setActiveAnnotation(null);
  };

  const annotationCounts = speech.segments
    .filter((s) => s.type)
    .reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {});

  return (
    <div
      style={{ ...styles.wrapper, padding: isMobile ? '1rem 0.9rem 5rem' : '1.5rem 1.5rem 4rem' }}
      onClick={() => setPinnedAnnotation(null)}
    >
      {/* Back */}
      <button onClick={onBack} style={styles.backBtn}>
        {T.back}
      </button>

      {/* Header */}
      <div style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.8rem' : '2rem' }}>
        <div style={styles.headerLeft}>
          <div style={styles.entityChip}>{speech.entityName}</div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '1.2rem' : 'clamp(1.3rem, 3vw, 1.8rem)' }}>
            {speech.title}
          </h1>
          <div style={styles.meta}>
            <span style={styles.metaItem}>📅 {speech.date}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaItem}>⏱ {speech.duration}</span>
            {!isMobile && (
              <>
                <span style={styles.metaDot}>·</span>
                <span style={styles.metaItem}>{speech.wordCount.toLocaleString()} {T.words}</span>
              </>
            )}
          </div>
          {!isMobile && <p style={styles.context}>{speech.context}</p>}
        </div>

        {/* Score */}
        <div style={{
          ...styles.scoreBox,
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center',
          padding: isMobile ? '0.5rem 0.9rem' : '1rem 1.4rem',
          alignSelf: isMobile ? 'flex-start' : 'auto',
        }}>
          <span style={{ ...styles.scoreNumber, fontSize: isMobile ? '1.9rem' : '2.6rem', color: scoreColor }}>
            {speech.iraScore.toFixed(1)}
          </span>
          {isMobile && <span style={styles.scoreSep}>/10</span>}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: isMobile ? 'flex-start' : 'center',
            marginLeft: isMobile ? '0.5rem' : 0,
          }}>
            <span style={styles.scoreLabel}>IRA Score</span>
            <span style={{ ...styles.scoreClassification, color: scoreColor }}>{speech.iraLabel}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={styles.summaryBox}>
        <p style={styles.summaryText}>{speech.summary}</p>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(annotationCounts).map(([typeKey, count]) => {
          const t = ANNOTATION_TYPES[typeKey];
          return (
            <div key={typeKey} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: t.color }} />
              <span style={{ ...styles.legendLabel, color: t.color }}>{t.label}</span>
              <span style={styles.legendCount}>×{count}</span>
            </div>
          );
        })}
      </div>

      {/* Main layout */}
      <div style={{ ...styles.mainLayout, gridTemplateColumns: isMobile ? '1fr' : '1fr 300px' }}>

        {/* Annotated text */}
        <div style={styles.textColumn} ref={containerRef}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ ...styles.sectionLabel, margin: 0 }}>{T.annotatedFragment}</p>
            {showTranslationToggle && (
              <button
                onClick={() => setShowTranslation((v) => !v)}
                style={{
                  background: showTranslation ? 'rgba(255,102,0,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${showTranslation ? 'rgba(255,102,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  color: showTranslation ? '#ff6600' : 'rgba(255,255,255,0.35)',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {showTranslation ? T.hideTranslation : T.seeTranslation}
              </button>
            )}
          </div>
          <div style={{ ...styles.textBlock, fontSize: isMobile ? '0.9rem' : '0.98rem' }}>
            {speech.segments.map((segment, i) => {
              if (!segment.type) {
                return <span key={i} style={styles.plainText}>{segment.text}</span>;
              }
              const at = ANNOTATION_TYPES[segment.type];
              const isPinned = pinnedAnnotation?.note === segment.note;
              return (
                <span
                  key={i}
                  onMouseEnter={(e) => handleAnnotationHover(e, segment)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                  onClick={(e) => handleAnnotationClick(e, segment)}
                  style={{
                    color: at.color,
                    borderBottom: `1.5px solid ${at.color}`,
                    opacity: isPinned ? 1 : 0.88,
                    background: isPinned ? at.bg : 'transparent',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    padding: '0 1px',
                    transition: 'all 0.15s',
                    fontWeight: 500,
                  }}
                >
                  {segment.text}
                </span>
              );
            })}
          </div>

          {/* Translation block */}
          {showTranslation && showTranslationToggle && (
            <div style={{
              marginTop: '0.8rem',
              background: 'rgba(255,102,0,0.04)',
              border: '1px solid rgba(255,102,0,0.15)',
              borderLeft: '2px solid rgba(255,102,0,0.4)',
              borderRadius: '0 8px 8px 0',
              padding: '1rem 1.2rem',
            }}>
              <p style={{
                margin: '0 0 0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                color: 'rgba(255,102,0,0.6)',
                textTransform: 'uppercase',
              }}>{T.translationLabel}</p>
              <p style={{
                margin: 0,
                fontFamily: 'Georgia, serif',
                fontSize: isMobile ? '0.85rem' : '0.92rem',
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.52)',
                fontStyle: 'italic',
              }}>{translationText}</p>
            </div>
          )}

          {/* Tooltip — desktop only */}
          {activeAnnotation && !isMobile && (
            <div style={{ ...styles.tooltip, top: tooltipPos.top, left: tooltipPos.left }}>
              <div style={styles.tooltipHeader}>
                <span style={styles.tooltipIcon}>{activeAnnotation.icon}</span>
                <span style={{ ...styles.tooltipLabel, color: activeAnnotation.color }}>
                  {activeAnnotation.label}
                </span>
              </div>
              <p style={styles.tooltipDesc}>{activeAnnotation.description}</p>
              <p style={styles.tooltipHint}>{T.clickFullAnalysis}</p>
            </div>
          )}
        </div>

        {/* Params */}
        <div style={{ ...styles.paramsColumn, position: isMobile ? 'static' : 'sticky', top: '1rem' }}>
          <p style={styles.sectionLabel}>{T.iraParams}</p>
          <div style={styles.paramsList}>
            {speech.params.map((param, i) => {
              const open = expandedParam === i;
              return (
                <div key={i} style={styles.paramItem}>
                  <div
                    style={{ ...styles.paramHeader, cursor: 'pointer' }}
                    onClick={() => setExpandedParam(open ? null : i)}
                  >
                    <span style={styles.paramName}>{param.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ ...styles.paramValue, color: IRA_COLOR(param.value) }}>
                        {param.value.toFixed(1)}
                      </span>
                      <span style={{
                        fontSize: '0.5rem',
                        color: 'rgba(255,255,255,0.2)',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        lineHeight: 1,
                      }}>▼</span>
                    </div>
                  </div>
                  <div style={styles.paramBarTrack}>
                    <div style={{
                      ...styles.paramBarFill,
                      width: `${(param.value / 10) * 100}%`,
                      background: IRA_COLOR(param.value),
                    }} />
                  </div>
                  {open && param.note && (
                    <p style={styles.paramNote}>{param.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parámetro R */}
      {speech.lecturaAutor && (
        <div style={styles.lecturaBox}>
          <p style={styles.sectionLabel}>{T.lecturaLabel}</p>
          <p style={styles.lecturaText}>{speech.lecturaAutor}</p>
        </div>
      )}

      {/* Pinned panel */}
      {pinnedAnnotation && (
        <div
          style={{
            ...styles.pinnedPanel,
            width: isMobile ? 'calc(100vw - 2rem)' : '320px',
            right: isMobile ? '1rem' : '1.5rem',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ ...styles.pinnedColorBar, background: pinnedAnnotation.color }} />
          <button onClick={() => setPinnedAnnotation(null)} style={styles.pinnedClose}>✕</button>
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
            <p style={styles.pinnedNoteTitle}>{T.pinnedNoteTitle}</p>
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
  },
  backBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.4)',
    borderRadius: '6px',
    padding: '0.35rem 0.8rem',
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    marginBottom: '1.2rem',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  headerLeft: { flex: 1 },
  entityChip: {
    display: 'inline-block',
    background: 'rgba(255,102,0,0.12)',
    color: '#ff6600',
    border: '1px solid rgba(255,102,0,0.25)',
    borderRadius: '4px',
    padding: '2px 8px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    margin: '0 0 0.4rem',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.2,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  metaItem: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.35)',
  },
  metaDot: { color: 'rgba(255,255,255,0.15)' },
  context: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.6,
    maxWidth: '520px',
  },
  scoreBox: {
    display: 'flex',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    flexShrink: 0,
  },
  scoreNumber: {
    fontFamily: "'DM Mono', monospace",
    fontWeight: 700,
    lineHeight: 1,
  },
  scoreSep: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-end',
    marginBottom: '3px',
  },
  scoreLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.58rem',
    color: 'rgba(255,255,255,0.25)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  scoreClassification: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.6rem',
    fontWeight: 600,
  },
  summaryBox: {
    background: 'rgba(255,255,255,0.02)',
    borderLeft: '2px solid #ff6600',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    borderRadius: '0 6px 6px 0',
  },
  summaryText: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.73rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.7,
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginBottom: '1.2rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '99px',
    padding: '3px 8px',
  },
  legendDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.62rem',
    fontWeight: 500,
  },
  legendCount: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.57rem',
    color: 'rgba(255,255,255,0.2)',
  },
  mainLayout: {
    display: 'grid',
    gap: '1.2rem',
    alignItems: 'start',
  },
  textColumn: { position: 'relative' },
  sectionLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.6rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: '0.14em',
    margin: '0 0 0.5rem',
  },
  textBlock: {
    fontFamily: "'DM Mono', monospace",
    lineHeight: 2,
    color: 'rgba(255,255,255,0.72)',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '1.3rem 1.4rem',
  },
  plainText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 400,
  },
  tooltip: {
    position: 'absolute',
    zIndex: 300,
    background: '#181818',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.65rem 0.85rem',
    width: '255px',
    maxWidth: 'calc(100vw - 20px)',
    boxShadow: '0 8px 28px rgba(0,0,0,0.6)',
    pointerEvents: 'none',
    boxSizing: 'border-box',
  },
  tooltipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    marginBottom: '0.3rem',
  },
  tooltipIcon: { fontSize: '0.82rem' },
  tooltipLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  tooltipDesc: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.67rem',
    color: 'rgba(255,255,255,0.48)',
    lineHeight: 1.5,
  },
  tooltipHint: {
    margin: '0.35rem 0 0',
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.58rem',
    color: 'rgba(255,102,0,0.45)',
  },
  paramsColumn: {},
  paramsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '0.9rem',
  },
  paramItem: { display: 'flex', flexDirection: 'column', gap: '0.18rem' },
  paramHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  paramName: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
  },
  paramValue: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  paramBarTrack: {
    height: '2px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  paramBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
  paramNote: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(255,255,255,0.26)',
    lineHeight: 1.5,
  },
  pinnedPanel: {
    position: 'fixed',
    bottom: '1.2rem',
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
    zIndex: 400,
    overflow: 'hidden',
    animation: 'slideUp 0.18s ease',
    maxWidth: 'calc(100vw - 2rem)',
    boxSizing: 'border-box',
  },
  pinnedColorBar: { height: '3px', width: '100%' },
  pinnedClose: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.22)',
    cursor: 'pointer',
    fontSize: '0.82rem',
    padding: '2px 5px',
    zIndex: 1,
  },
  pinnedContent: { padding: '0.75rem 1rem 1rem' },
  pinnedTopRow: { display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.45rem' },
  pinnedIcon: { fontSize: '1.1rem', marginTop: '2px' },
  pinnedLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 700,
    margin: 0,
  },
  pinnedParam: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.58rem',
    color: 'rgba(255,255,255,0.28)',
    margin: '0.1rem 0 0',
  },
  pinnedDesc: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.48)',
    lineHeight: 1.6,
    margin: '0 0 0.5rem',
  },
  pinnedDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    margin: '0.55rem 0',
  },
  pinnedNoteTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.58rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.22)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: '0 0 0.3rem',
  },
  pinnedNote: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 1.7,
    margin: 0,
  },
  lecturaBox: {
    marginTop: '1.5rem',
    background: 'rgba(255,102,0,0.03)',
    border: '1px solid rgba(255,102,0,0.12)',
    borderLeft: '2px solid rgba(255,102,0,0.4)',
    borderRadius: '0 8px 8px 0',
    padding: '1rem 1.2rem',
  },
  lecturaText: {
    margin: 0,
    fontFamily: 'Georgia, serif',
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.85,
    fontStyle: 'italic',
  },
};
