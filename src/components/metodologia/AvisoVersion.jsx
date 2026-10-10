// IRA · Metodología 2.0 · aviso de versión (arriba del índice y de cada página de parámetro)
import { AVISO } from './textosComunes.js';

export default function AvisoVersion({ lang = 'es' }) {
  const t = AVISO[lang] ?? AVISO.es;
  return (
    <aside className="ira-met__aviso" aria-label={t.rotulo}>
      <p className="ira-met__aviso-rotulo">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="ira-icono-trazo">
          <circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.6" />
        </svg>
        {t.rotulo}
      </p>
      <p className="ira-met__aviso-texto">{t.texto}</p>
    </aside>
  );
}
