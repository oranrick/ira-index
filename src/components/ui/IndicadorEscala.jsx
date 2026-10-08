// IRA · indicador de escala: 11 casillas con su número dentro.
// La actual se eleva 4 px con anillo blanco. compacto: casillas de 30 px sin elevación.
import { ESCALA, TEXTO_SOBRE, nivel, formatearPuntuacion } from '../../lib/escala';

const TXT = {
  es: { pol: 'Polarizante', emp: 'Empático', escala: 'Escala de 0, polarizante, a 10, empático', actual: (p) => `Puntuación ${p} en una escala de 0, polarizante, a 10, empático` },
  en: { pol: 'Polarizing', emp: 'Empathic', escala: 'Scale from 0, polarizing, to 10, empathic', actual: (p) => `Score ${p} on a scale from 0, polarizing, to 10, empathic` },
};

export default function IndicadorEscala({ puntuacion = null, compacto = false, etiquetas = true, lang = 'es', className = '' }) {
  const t = TXT[lang] ?? TXT.es;
  const actual = puntuacion == null ? -1 : nivel(puntuacion);
  return (
    <div
      className={`ira-indicador${compacto ? ' ira-indicador--compacto' : ''} ${className}`}
      role="img"
      aria-label={actual >= 0 ? t.actual(formatearPuntuacion(puntuacion, lang)) : t.escala}
    >
      <div className="ira-indicador__casillas" aria-hidden="true">
        {ESCALA.map((c, i) => (
          <span key={i} className={i === actual ? 'is-actual' : undefined} style={{ background: c, color: TEXTO_SOBRE[i] }}>{i}</span>
        ))}
      </div>
      {etiquetas && (
        <div className="ira-indicador__extremos" aria-hidden="true">
          <span>{t.pol}</span><span>{t.emp}</span>
        </div>
      )}
    </div>
  );
}
