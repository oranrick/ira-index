// src/components/SpeechCard.jsx
import { getSpeechesByEntity } from '../data/speeches';
import TarjetaDiscurso from './ui/TarjetaDiscurso.jsx';
import { fechaCorta, citaDestacada } from '../lib/discursos';

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

export function SpeechesSection({ entityId, speeches: speechesProp, onSelectSpeech, lang = 'es', fromTFG = false }) {
  const speeches = speechesProp ?? getSpeechesByEntity(entityId);
  if (!speeches.length) return null;
  const T = CARD_TEXTS[lang] || CARD_TEXTS.es;

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>{T.speechesTitle}</h3>
        <span style={styles.sectionBadge}>{speeches.length}</span>
      </div>
      {fromTFG && (
        <p style={styles.sectionDesc}>
          {T.speechesDesc} <em>El contagio de las palabras</em> (UCM, 2024)
        </p>
      )}
      <div className="speeches-grid">
        {speeches.map((speech) => (
          <SpeechCard key={speech.id} speech={speech} onClick={() => onSelectSpeech(speech.id)} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function SpeechCard({ speech, onClick, lang = 'es' }) {
  const T = CARD_TEXTS[lang] || CARD_TEXTS.es;
  const title = lang === 'en' && speech.titleEn ? speech.titleEn : speech.title;
  const extra = [
    speech.duration,
    speech.wordCount ? `${speech.wordCount.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} ${T.words}` : null,
  ].filter(Boolean).join(' · ');
  return (
    <TarjetaDiscurso
      compacta
      lang={lang}
      orador={title}
      cargo={speech.entityName}
      fecha={fechaCorta(speech.date)}
      cita={citaDestacada(speech, lang, 200)}
      puntuacion={speech.iraScore}
      pie={extra}
      onVerDesglose={onClick}
    />
  );
}

const styles = {
  section: {
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '1px solid var(--ira-linea)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  sectionTitle: {
    margin: 0,
    fontFamily: 'var(--ira-font-titulo)',
    fontSize: '22px',
    fontWeight: 500,
    color: 'var(--ira-nieve)',
    letterSpacing: '-0.01em',
  },
  sectionBadge: {
    border: '1px solid var(--ira-linea-fuerte)',
    color: 'var(--ira-texto-2)',
    borderRadius: '99px',
    padding: '2px 9px',
    fontSize: '12px',
    fontFamily: 'var(--ira-font-cifra)',
  },
  sectionDesc: {
    margin: '0 0 20px',
    color: 'var(--ira-texto-2)',
    fontSize: '13px',
    lineHeight: '20px',
  },
};
