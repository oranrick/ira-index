// src/components/SpeechView.jsx
import { useState, useRef, useEffect } from 'react';
import { ANNOTATION_TYPES } from '../data/speeches';
import { colorPuntuacion, formatearPuntuacion } from '../lib/escala';
import { polaridadFragmento, puntuacionesPorClave } from '../lib/anotaciones';
import BarraEscala from './ui/BarraEscala.jsx';
import FilaParametro from './ui/FilaParametro.jsx';
import { fechaCorta } from '../lib/discursos';

// Colores de las dos familias de anotación (tokens.css)
const FAMILIA = {
  polarizante: { color: 'var(--ira-marca-polarizante)', linea: 'var(--ira-1)', fondo: 'rgba(190,40,26,0.18)', halo: 'var(--ira-halo-polarizante)', estrella: 'var(--ira-estrella-polarizante)' },
  empatico:    { color: 'var(--ira-marca-empatica)', linea: 'var(--ira-salvia)', fondo: 'rgba(141,170,126,0.18)', halo: 'var(--ira-halo-empatico)', estrella: 'var(--ira-estrella-empatica)' },
  neutro:      { color: 'var(--ira-nieve)', linea: 'var(--ira-oro)', fondo: 'rgba(220,177,73,0.14)', halo: 'none', estrella: 'var(--ira-oro)' },
};

const SPEECH_VIEW_TEXTS = {
  es: {
    back:                  "← Volver",
    annotatedFragment:     "FRAGMENTO ANOTADO",
    iraParams:             "PARÁMETROS IRA",
    clickFullAnalysis:     "Clic para análisis completo →",
    pinnedNoteTitle:       "Análisis del fragmento",
    translationLabel:      "Traducción al español",
    translationLabelEn:    "Traducción al inglés",
    seeTranslation:        "🌐 ver traducción",
    hideTranslation:       "✕ traducción",
    words:                 "palabras",
    lecturaLabel:          "PARÁMETRO R · LECTURA DEL AUTOR",
    paramViewTxt:          "ver ▾",
    paramCloseTxt:         "cerrar ▲",
    transcriptLoading:     "Cargando…",
    transcriptUnavailable: "Transcripción no disponible.",
    transcriptBtn:         "Ver transcripción completa ↗",
  },
  en: {
    back:                  "← Back",
    annotatedFragment:     "ANNOTATED FRAGMENT",
    iraParams:             "IRA PARAMETERS",
    clickFullAnalysis:     "Click for full analysis →",
    pinnedNoteTitle:       "Fragment analysis",
    translationLabel:      "Spanish translation",
    translationLabelEn:    "English translation",
    seeTranslation:        "🌐 see translation",
    hideTranslation:       "✕ translation",
    words:                 "words",
    lecturaLabel:          "PARAMETER R · AUTHOR'S READING",
    paramViewTxt:          "view ▾",
    paramCloseTxt:         "close ▲",
    transcriptLoading:     "Loading…",
    transcriptUnavailable: "Transcript unavailable.",
    transcriptBtn:         "Full transcript ↗",
  },
};

const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';

const IRA_COLOR = colorPuntuacion;

const PARAM_NAME_EN = {
  'Uso pronominal inclusivo':   'Inclusive Pronominal Use',
  'Tipo de metáfora dominante': 'Dominant Metaphor Type',
  'Carga dicotómica':           'Dichotomous Load',
  'Tono emocional dominante':   'Dominant Emotional Tone',
  'Reconocimiento del disenso': 'Recognition of Dissent',
  'Vector de acción':           'Action Vector',
  'Coherencia afectiva':        'Affective Coherence',
  'Proyección de futuro':       'Future Projection',
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
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [showTranslation, setShowTranslation] = useState(false);
  const containerRef = useRef(null);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const scoreColor = IRA_COLOR(speech.iraScore);
  const T = SPEECH_VIEW_TEXTS[lang] || SPEECH_VIEW_TEXTS.es;
  const puntuaciones = puntuacionesPorClave(speech.params);
  const familia = (tipo) => FAMILIA[polaridadFragmento(tipo, puntuaciones) ?? 'neutro'];
  const isEn = lang === 'en';
  const displayTitle   = (isEn && speech.titleEn)   || speech.title;
  const displayContext = (isEn && speech.contextEn)  || speech.context;
  const displayIraLabel = (isEn && speech.iraLabelEn) || speech.iraLabel;
  const displaySummary = (isEn && speech.summaryEn)  || speech.summary;

  const isEnglishSpeech = speech.speechLang === 'en';
  const isSpanishSpeech = speech.speechLang === 'es';
  const showTranslationToggle =
    (lang === 'es' && isEnglishSpeech) ||
    (lang === 'en' && isSpanishSpeech);
  const translationLabel = (lang === 'en' && isSpanishSpeech)
    ? T.translationLabelEn
    : T.translationLabel;
  const translationText = showTranslationToggle
    ? (speech.segments ?? []).map(s =>
        isEnglishSpeech
          ? (s.textEs ?? s.text)
          : (s.textEn ?? s.text)
      ).join('')
    : '';

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setPinnedAnnotation(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openTranscript = async () => {
    setTranscriptOpen(true);
    if (transcriptText) return;
    if (speech.transcript) {
      setTranscriptText(speech.transcript);
      return;
    }
    setTranscriptLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/analyses?select=text&speech_id=eq.${speech.id}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const rows = await res.json();
      setTranscriptText(rows?.[0]?.text ?? '');
    } catch {
      setTranscriptText('');
    } finally {
      setTranscriptLoading(false);
    }
  };

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
    setActiveAnnotation({ ...annotationType, note: segment.note, familia: familia(segment.type) });
  };

  const handleAnnotationClick = (e, segment) => {
    if (!segment.type) return;
    e.stopPropagation();
    const annotationType = ANNOTATION_TYPES[segment.type];
    setPinnedAnnotation({ ...annotationType, note: segment.note, familia: familia(segment.type) });
    setActiveAnnotation(null);
  };

  const annotationCounts = (speech.segments ?? [])
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
      <button type="button" onClick={onBack} className="ira-boton ira-boton--secundario ira-boton--compacto" style={{ marginBottom: '24px' }}>
        {T.back}
      </button>

      {/* Header */}
      <div style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.8rem' : '2rem' }}>
        <div style={styles.headerLeft}>
          <div style={styles.entityChip}>{speech.entityName}</div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '30px' : 'clamp(32px, 4vw, 48px)' }}>
            {displayTitle}
          </h1>
          <div style={styles.meta}>
            <span style={{ ...styles.metaItem, fontFamily: 'var(--ira-font-cifra)' }}>{fechaCorta(speech.date)}</span>
            {speech.duration && <><span style={styles.metaDot}>·</span><span style={styles.metaItem}>{speech.duration}</span></>}
            {!isMobile && (
              <>
                <span style={styles.metaDot}>·</span>
                <span style={styles.metaItem}>{speech.wordCount.toLocaleString()} {T.words}</span>
              </>
            )}
          </div>
          {!isMobile && <p style={styles.context}>{displayContext}</p>}
        </div>

        {/* Score */}
        <div style={{ ...styles.scoreBox, minWidth: isMobile ? 'auto' : '260px', alignSelf: isMobile ? 'stretch' : 'auto' }}>
          <span style={styles.scoreLabel}>{lang === 'en' ? 'IRA score' : 'Puntuación IRA'}</span>
          <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '6px', fontFamily: 'var(--ira-font-cifra)', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1 }}>
            <span style={{ fontSize: isMobile ? '48px' : '64px', color: scoreColor }}>{formatearPuntuacion(speech.iraScore, lang)}</span>
            <span style={{ fontSize: '20px', color: 'var(--ira-texto-3)', letterSpacing: 0 }}>/10</span>
          </p>
          <BarraEscala puntuacion={speech.iraScore} grosor={6} />
          <span style={styles.scoreClassification}>{displayIraLabel}</span>
        </div>
      </div>

      {/* Summary */}
      <div style={styles.summaryBox}>
        <p style={styles.summaryText}>{displaySummary}</p>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(annotationCounts).map(([typeKey, count]) => {
          const t = ANNOTATION_TYPES[typeKey];
          const f = familia(typeKey);
          return (
            <div key={typeKey} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: f.linea }} />
              <span style={{ ...styles.legendLabel, color: f.color }}>{t.label}</span>
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
                type="button"
                className="ira-chip"
                aria-pressed={showTranslation}
                onClick={() => setShowTranslation((v) => !v)}
              >
                {showTranslation ? T.hideTranslation : T.seeTranslation}
              </button>
            )}
          </div>
          <div style={{ ...styles.textBlock, fontSize: isMobile ? '16px' : '17px' }}>
            {(speech.segments ?? []).map((segment, i) => {
              if (!segment.type) {
                return <span key={i} style={styles.plainText}>{segment.text}</span>;
              }
              const at = ANNOTATION_TYPES[segment.type];
              const f = familia(segment.type);
              const isPinned = pinnedAnnotation?.note === segment.note;
              return (
                <span
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`${at.label}: ${segment.text}`}
                  aria-pressed={isPinned}
                  onMouseEnter={(e) => handleAnnotationHover(e, segment)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                  onFocus={(e) => handleAnnotationHover(e, segment)}
                  onBlur={() => setActiveAnnotation(null)}
                  onClick={(e) => handleAnnotationClick(e, segment)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAnnotationClick(e, segment); } }}
                  style={{
                    color: f.color,
                    textDecoration: 'underline',
                    textDecorationColor: f.linea,
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '4px',
                    background: isPinned ? f.fondo : 'transparent',
                    textShadow: isPinned ? f.halo : 'none',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    padding: '0 1px',
                    transition: 'background-color 0.15s',
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
              background: 'var(--ira-superficie)',
              border: '1px solid var(--ira-linea)',
              borderRadius: 'var(--ira-radio-l)',
              padding: '18px 20px',
            }}>
              <p style={{
                margin: '0 0 0.5rem',
                fontFamily: "var(--ira-font-texto)",
                fontSize: '13px',
                color: 'var(--ira-texto-2)',
              }}>{translationLabel}</p>
              <p style={{
                margin: 0,
                fontFamily: "var(--ira-font-texto)",
                fontSize: '16px',
                lineHeight: 1.8,
                color: "var(--ira-texto-2)",
                fontStyle: 'italic',
              }}>{translationText}</p>
            </div>
          )}

          {/* Ver transcripción completa */}
          <button type="button" style={{ ...styles.transcriptBtn, cursor: 'pointer' }} onClick={openTranscript}>
            {T.transcriptBtn}
          </button>

          {/* Tooltip — desktop only */}
          {activeAnnotation && !isMobile && (
            <div style={{ ...styles.tooltip, top: tooltipPos.top, left: tooltipPos.left }}>
              <div style={styles.tooltipHeader}>
                <span style={styles.tooltipIcon}>{activeAnnotation.icon}</span>
                <span style={{ ...styles.tooltipLabel, color: activeAnnotation.familia?.color }}>
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
              const hasNote = !!(param.note || param.noteEn);
              return (
                <FilaParametro
                  key={i}
                  etiqueta={(isEn && PARAM_NAME_EN[param.name]) || param.name}
                  puntuacion={param.value}
                  lang={lang}
                  abierto={open}
                  onToggle={hasNote ? () => setExpandedParam(open ? null : i) : undefined}
                >
                  <p style={{ ...styles.paramNote, margin: 0 }}>{(isEn && param.noteEn) || param.note}</p>
                </FilaParametro>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parámetro R */}
      {(speech.lecturaAutor || speech.lecturaAutorEn) && (
        <div style={styles.lecturaBox}>
          <p style={styles.sectionLabel}>{T.lecturaLabel}</p>
          <p style={styles.lecturaText}>
            {(isEn && speech.lecturaAutorEn) || speech.lecturaAutor}
          </p>
        </div>
      )}

      {/* Transcript modal */}
      {transcriptOpen && (
        <div style={styles.modalOverlay} onClick={() => setTranscriptOpen(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.modalSupertitle}>{speech.entityName}</p>
                <span style={styles.modalTitle}>{displayTitle}</span>
              </div>
              <button type="button" aria-label={lang === 'en' ? 'Close' : 'Cerrar'} style={styles.modalClose} onClick={() => setTranscriptOpen(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              {transcriptLoading ? (
                <span style={{ color: "var(--ira-texto-3)", fontSize: '0.75rem' }}>{T.transcriptLoading}</span>
              ) : transcriptText ? (
                transcriptText
                  .split(/\n\n+/)
                  .filter(p => p.trim())
                  .map((para, i) => (
                    <p key={i} style={styles.modalParagraph}>{para.trim()}</p>
                  ))
              ) : (
                <span style={{ color: "var(--ira-texto-3)", fontSize: '0.75rem' }}>{T.transcriptUnavailable}</span>
              )}
            </div>
          </div>
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
          <div style={{ ...styles.pinnedColorBar, background: pinnedAnnotation.familia?.linea }} />
          <button type="button" aria-label={lang === 'en' ? 'Close' : 'Cerrar'} onClick={() => setPinnedAnnotation(null)} style={styles.pinnedClose}>✕</button>
          <div style={styles.pinnedContent}>
            <div style={styles.pinnedTopRow}>
              <span style={styles.pinnedIcon}>{pinnedAnnotation.icon}</span>
              <div>
                <p style={{ ...styles.pinnedLabel, color: pinnedAnnotation.familia?.color }}>
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

const caja = {
  background: 'var(--ira-superficie)',
  border: '1px solid var(--ira-linea)',
  borderRadius: 'var(--ira-radio-l)',
};

const styles = {
  wrapper: { position: 'relative', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', marginBottom: '24px' },
  headerLeft: { flex: 1, minWidth: 0 },
  entityChip: {
    display: 'inline-block', marginBottom: '10px',
    fontSize: '14px', color: 'var(--ira-texto-2)',
  },
  title: {
    margin: '0 0 10px', fontFamily: 'var(--ira-font-titulo)', fontWeight: 500,
    color: 'var(--ira-nieve)', lineHeight: 1.1, letterSpacing: '-0.02em',
  },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '10px' },
  metaItem: { fontSize: '13px', color: 'var(--ira-texto-2)' },
  metaDot: { color: 'var(--ira-texto-3)' },
  context: { margin: 0, fontSize: '14px', color: 'var(--ira-texto-2)', lineHeight: 1.6, maxWidth: '560px' },
  scoreBox: { ...caja, display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 24px', flexShrink: 0 },
  scoreLabel: { fontSize: '13px', color: 'var(--ira-texto-2)' },
  scoreClassification: { fontSize: '13px', color: 'var(--ira-texto-cita)' },
  summaryBox: { ...caja, padding: '18px 20px', marginBottom: '20px' },
  summaryText: { margin: 0, fontSize: '16px', color: 'var(--ira-texto-cita)', lineHeight: 1.7 },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    border: '1px solid var(--ira-linea)', borderRadius: '99px', padding: '4px 12px',
  },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  legendLabel: { fontSize: '13px' },
  legendCount: { fontFamily: 'var(--ira-font-cifra)', fontSize: '12px', color: 'var(--ira-texto-3)' },
  mainLayout: { display: 'grid', gap: '24px', alignItems: 'start' },
  textColumn: { position: 'relative' },
  sectionLabel: { fontSize: '13px', fontWeight: 500, color: 'var(--ira-texto-2)', margin: '0 0 10px' },
  textBlock: { ...caja, lineHeight: 2, color: 'var(--ira-texto-cita)', padding: '24px 26px' },
  plainText: { color: 'var(--ira-texto-cita)', fontWeight: 400 },
  tooltip: {
    position: 'absolute', zIndex: 300, width: '280px', maxWidth: 'calc(100vw - 20px)', boxSizing: 'border-box',
    background: 'var(--ira-elevada)', border: '1px solid var(--ira-linea-fuerte)', borderRadius: '12px',
    padding: '12px 14px', boxShadow: '0 12px 32px rgba(0,0,0,0.5)', pointerEvents: 'none',
  },
  tooltipHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  tooltipIcon: { display: 'none' },
  tooltipLabel: { fontFamily: 'var(--ira-font-titulo)', fontSize: '15px', fontWeight: 500 },
  tooltipDesc: { margin: 0, fontSize: '13px', color: 'var(--ira-texto-cita)', lineHeight: 1.5 },
  tooltipHint: { margin: '8px 0 0', fontSize: '12px', color: 'var(--ira-oro)' },
  paramsColumn: {},
  paramsList: { ...caja, display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px' },
  paramItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  paramHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '32px' },
  paramName: { fontSize: '14px', color: 'var(--ira-texto-cita)' },
  paramBarTrack: { height: '4px', background: 'var(--ira-linea)', borderRadius: '2px', overflow: 'hidden', margin: '2px 0' },
  paramBarFill: { height: '100%', borderRadius: '2px', transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)' },
  paramNote: { margin: '6px 0 0', fontSize: '13px', color: 'var(--ira-texto-2)', lineHeight: 1.6 },
  pinnedPanel: {
    position: 'fixed', bottom: '20px', zIndex: 400, overflow: 'hidden', boxSizing: 'border-box',
    background: 'var(--ira-superficie)', border: '1px solid var(--ira-linea-fuerte)', borderRadius: 'var(--ira-radio-xl)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)', animation: 'slideUp 0.18s ease', maxWidth: 'calc(100vw - 2rem)',
  },
  pinnedColorBar: { height: '3px', width: '100%' },
  pinnedClose: {
    position: 'absolute', top: '8px', right: '8px', width: '44px', height: '44px', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1px solid var(--ira-linea-fuerte)', borderRadius: '10px',
    color: 'var(--ira-nieve)', cursor: 'pointer', fontSize: '14px', padding: 0,
  },
  pinnedContent: { padding: '16px 20px 20px' },
  pinnedTopRow: { display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', paddingRight: '48px' },
  pinnedIcon: { display: 'none' },
  pinnedLabel: { fontFamily: 'var(--ira-font-titulo)', fontSize: '18px', fontWeight: 500, margin: 0 },
  pinnedParam: { fontSize: '12px', color: 'var(--ira-texto-2)', margin: '2px 0 0' },
  pinnedDesc: { fontSize: '14px', color: 'var(--ira-texto-cita)', lineHeight: 1.6, margin: '0 0 8px' },
  pinnedDivider: { height: '1px', background: 'var(--ira-linea)', margin: '10px 0' },
  pinnedNoteTitle: { fontSize: '12px', color: 'var(--ira-texto-2)', margin: '0 0 4px' },
  pinnedNote: { fontSize: '14px', color: 'var(--ira-texto-cita)', lineHeight: 1.65, margin: 0 },
  lecturaBox: { ...caja, marginTop: '24px', padding: '20px 24px' },
  lecturaText: { margin: 0, fontSize: '16px', color: 'var(--ira-texto-cita)', lineHeight: 1.8, fontStyle: 'italic' },
  modalOverlay: {
    position: 'fixed', inset: 0, zIndex: 600, padding: '24px',
    background: 'rgba(4,20,20,0.72)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease',
  },
  modalBox: {
    ...caja, borderRadius: 'var(--ira-radio-xl)', width: '100%', maxWidth: '720px', maxHeight: '82vh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)', animation: 'slideUp 0.22s cubic-bezier(0.4,0,0.2,1)',
  },
  modalHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
    padding: '24px 24px 18px', borderBottom: '1px solid var(--ira-linea)', flexShrink: 0,
  },
  modalSupertitle: { margin: '0 0 4px', fontSize: '13px', color: 'var(--ira-oro)' },
  modalTitle: { fontFamily: 'var(--ira-font-titulo)', fontSize: '22px', fontWeight: 500, color: 'var(--ira-nieve)' },
  modalClose: {
    width: '44px', height: '44px', flexShrink: 0, padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1px solid var(--ira-linea-fuerte)', borderRadius: '10px',
    color: 'var(--ira-nieve)', cursor: 'pointer', fontSize: '14px',
  },
  modalBody: { overflowY: 'auto', padding: '28px', flex: 1 },
  modalParagraph: { margin: '0 0 18px', fontSize: '16px', color: 'var(--ira-texto-cita)', lineHeight: 1.75, textAlign: 'left' },
  transcriptBtn: {
    marginTop: '16px', display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 18px',
    background: 'transparent', border: '1px solid var(--ira-linea-fuerte)', borderRadius: '10px',
    color: 'var(--ira-nieve)', fontSize: '14px', fontWeight: 500,
  },
};
