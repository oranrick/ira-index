// IRA · /metodologia/p5 (Metodología 2.0, manual v0.1 cerrado). Contenido en textosP5.js.
import MetodologiaManual from './MetodologiaManual.jsx';
import { TEXTOS_P5 } from './textosP5.js';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P5.md';

export default function MetodologiaP5() {
  return (
    <MetodologiaManual
      textos={TEXTOS_P5}
      manualUrl={MANUAL_URL}
      anterior={{ ruta: '/metodologia/p3', es: '← P3 · El juicio sobre el otro', en: '← P3 · Judging the other' }}
      siguiente={{ ruta: '/metodologia/p6', es: 'Siguiente: P6 · Lo que pide hacer', en: 'Next: P6 · What it calls for' }}
    />
  );
}
