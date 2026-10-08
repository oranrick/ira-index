// IRA · ventana a pantalla completa con el desglose de un discurso.
// (La antigua página /discursos se unió a la ficha de cada político: /entity/:id.)
import { useRef } from 'react';
import { SpeechView } from './SpeechView.jsx';
import { useAtraparFoco } from './ui/Ventana.jsx';

export function Superposicion({ speech, lang, onCerrar }) {
  const ref = useRef(null);
  useAtraparFoco(true, ref, onCerrar);
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={speech.title} tabIndex={-1}
      style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'var(--ira-noche)', overflowY: 'auto', outline: 'none' }}>
      <SpeechView speech={speech} onBack={onCerrar} lang={lang} />
    </div>
  );
}
