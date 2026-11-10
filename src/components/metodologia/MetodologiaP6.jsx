// IRA · /metodologia/p6 (Metodología 2.0, manual v0.1 cerrado). Contenido en textosP6.js.
import MetodologiaManual from './MetodologiaManual.jsx';
import { TEXTOS_P6 } from './textosP6.js';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P6.md';

export default function MetodologiaP6() {
  return (
    <MetodologiaManual
      textos={TEXTOS_P6}
      manualUrl={MANUAL_URL}
      anterior={{ ruta: '/metodologia/p5', es: '← P5 · La palabra del otro', en: '← P5 · The other’s word' }}
      siguiente={null}
    />
  );
}
