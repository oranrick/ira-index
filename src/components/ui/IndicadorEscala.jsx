// IRA · indicador de escala como sintonía: una sola traza que va de nerviosa y roja (0) a
// serena y salvia (10), con los números debajo. Si hay puntuación, una aguja la señala.
// compacto: más baja y sin aguja grande. Mismo uso que antes en toda la web.
import { formatearPuntuacion } from '../../lib/escala';
import Traza, { colorTraza } from './Traza.jsx';

const TXT = {
  es: { pol: 'polariza', emp: 'acerca', escala: 'Escala de 0, polarizante, a 10, empático', actual: (p) => `Puntuación ${p} en una escala de 0, polarizante, a 10, empático` },
  en: { pol: 'polarizes', emp: 'connects', escala: 'Scale from 0, polarizing, to 10, empathic', actual: (p) => `Score ${p} on a scale from 0, polarizing, to 10, empathic` },
};

export default function IndicadorEscala({ puntuacion = null, compacto = false, etiquetas = true, lang = 'es', className = '' }) {
  const t = TXT[lang] ?? TXT.es;
  const hay = puntuacion != null && !Number.isNaN(Number(puntuacion));
  const pos = hay ? Math.max(0, Math.min(10, Number(puntuacion))) : null;
  return (
    <div
      className={`ira-indicador${compacto ? ' ira-indicador--compacto' : ''} ${className}`}
      role="img"
      aria-label={hay ? t.actual(formatearPuntuacion(puntuacion, lang)) : t.escala}
    >
      <div className="ira-indicador__pista">
        <Traza escala semilla="escala-ira" alto={compacto ? 40 : 58} grosor={compacto ? 1.8 : 2.2} duracion={1500} repetir periodo={compacto ? [90, 12] : [130, 16]} />
        {hay && (
          <span className="ira-indicador__aguja" style={{ left: `${(pos / 10) * 100}%`, '--c': colorTraza(pos) }} />
        )}
      </div>
      <div className="ira-indicador__numeros" aria-hidden="true">
        {Array.from({ length: 11 }, (_, i) => <span key={i} style={{ left: `${i * 10}%` }} className={hay && Math.round(pos) === i ? 'is-actual' : undefined}>{i}</span>)}
      </div>
      {etiquetas && (
        <div className="ira-indicador__extremos" aria-hidden="true">
          <span>{t.pol}</span><span>{t.emp}</span>
        </div>
      )}
    </div>
  );
}
