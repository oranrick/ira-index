// IRA · /metodologia/p3 (Metodología 2.0, manual v0.1 cerrado). Contenido en textosP3.js.
import MetodologiaManual from './MetodologiaManual.jsx';
import { TEXTOS_P3 } from './textosP3.js';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P3.md';

export default function MetodologiaP3() {
  return (
    <MetodologiaManual
      textos={TEXTOS_P3}
      manualUrl={MANUAL_URL}
      anterior={{ ruta: '/metodologia/p2', es: '← P2 · El marco metafórico', en: '← P2 · The metaphorical frame' }}
      siguiente={{ ruta: '/metodologia/p5', es: 'Siguiente: P5 · La palabra del otro', en: 'Next: P5 · The other’s word' }}
    />
  );
}
