// src/components/SpeechCard.jsx
import { useState } from 'react';
import { getSpeechesByEntity } from '../data/speeches';

const IRA_COLOR = (score) => {
  if (score >= 7.5) return '#2ecc71';
  if (score >= 5) return '#f59e0b';
  return '#ff6600';
};

const CARD_TEXTS = {
  es: {
    speechesTitle:   "Discursos analizados",
    speechesDesc:    "Fragmentos anotados del TFG",
    words:           "palabras",
    seeAnalysis:     "Ver análisis →",
    iraLabelEmp:     "Empático",
    iraLabelMix:     "Mixto",
    iraLabelPol:     "Polarizante",
  },
  en: {
    speechesTitle:   "Analyzed speeches",
    speechesDesc:    "Annotated fragments from the thesis",
    words:           "words",
    seeAnalysis:     "See analysis →",
    iraLabelEmp:     "Empathic",
    iraLabelMix:     "Mixed",
    iraLabelPol:     "Polarizing",
  },
};

export function SpeechesSection({ entityId, speeches: speechesProp, onSelectSpeech, lang = 'es' }) {
  const speeches = speechesProp ?? getSpeechesByEntity(entityId);
  if (!speeches.length) return null;
  const T = CARD_TEXTS[lang] || CARD_TEXTS.es;

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionIcon}>📄</span>
        <h3 style={styles.sectionTitle}>{T.speechesTitle}</h3>
        <span style={styles.sectionBadge}>{speeches.length}</span>
      </div>
      <p style={styles.sectionDesc}>
        {T.speechesDesc} <em>El contagio de las palabras</em> (UCM, 2024)
      </p>
      <div style={styles.grid}>
        {speeches.map((speech) => (
          <SpeechCard key={speech.id} speech={speech} onClick={() => onSelectSpeech(speech.id)} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function SpeechCard({ speech, onClick, lang = 'es' }) {
  const [hovered, setHovered] = useState(false);
  const scoreColor = IRA_COLOR(speech.iraScore);
  const T = CARD_TEXTS[lang] || CARD_TEXTS.es;

  const IRA_LABEL_SHORT = (score) => {
    if (score >= 7.5) return T.iraLabelEmp;
    if (score >= 5) return T.iraLabelMix;
    return T.iraLabelPol;
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        borderColor: hovered ? scoreColor : 'rgba(255,255,255,0.08)',
        background: hovered ? 'rgba(255,102,0,0.05)' : 'rgba(255,255,255,0.03)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Header row */}
      <div style={styles.cardHeader}>
        <div style={styles.cardMeta}>
          <span style={styles.cardDate}>{speech.date}</span>
          <span style={{ ...styles.cardClassBadge, color: scoreColor, borderColor: scoreColor }}>
            {IRA_LABEL_SHORT(speech.iraScore)}
          </span>
        </div>
        <div style={{ ...styles.iraScore, color: scoreColor }}>
          <span style={styles.iraNumber}>{speech.iraScore.toFixed(1)}</span>
          <span style={styles.iraMax}>/10</span>
        </div>
      </div>

      {/* Title */}
      <h4 style={styles.cardTitle}>{lang === 'en' && speech.titleEn ? speech.titleEn : speech.title}</h4>

      {/* Context */}
      <p style={styles.cardContext}>{speech.context}</p>

      {/* Footer */}
      <div style={styles.cardFooter}>
        <span style={styles.cardDuration}>⏱ {speech.duration}</span>
        <span style={styles.cardWords}>{speech.wordCount.toLocaleString()} {T.words}</span>
        <span style={{ ...styles.cardCta, color: hovered ? '#ff6600' : 'rgba(255,255,255,0.4)' }}>
          {T.seeAnalysis}
        </span>
      </div>

      {/* IRA bar */}
      <div style={styles.iraBarTrack}>
        <div
          style={{
            ...styles.iraBarFill,
            width: `${(speech.iraScore / 10) * 100}%`,
            background: scoreColor,
          }}
        />
      </div>
    </button>
  );
}

const styles = {
  section: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.4rem',
  },
  sectionIcon: {
    fontSize: '1.1rem',
  },
  sectionTitle: {
    margin: 0,
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em',
  },
  sectionBadge: {
    background: 'rgba(255,102,0,0.2)',
    color: '#ff6600',
    borderRadius: '99px',
    padding: '2px 8px',
    fontSize: '0.7rem',
    fontFamily: "'DM Mono', monospace",
    fontWeight: 600,
  },
  sectionDesc: {
    margin: '0 0 1.2rem',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.78rem',
    fontFamily: "'DM Mono', monospace",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '0.8rem',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '1rem 1.1rem 0.8rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  cardDate: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
  },
  cardClassBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    fontWeight: 600,
    border: '1px solid',
    borderRadius: '4px',
    padding: '1px 6px',
    width: 'fit-content',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  iraScore: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '1px',
  },
  iraNumber: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '1.4rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  iraMax: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.3)',
  },
  cardTitle: {
    margin: 0,
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.3,
  },
  cardContext: {
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginTop: '0.2rem',
  },
  cardDuration: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.3)',
  },
  cardWords: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.3)',
  },
  cardCta: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.68rem',
    marginLeft: 'auto',
    transition: 'color 0.2s',
  },
  iraBarTrack: {
    height: '2px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '0.2rem',
  },
  iraBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
};
