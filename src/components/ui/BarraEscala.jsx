// IRA · barra de 11 segmentos: encendidos hasta la puntuación, el resto al 20 %.
// Decorativa: siempre va junto a la cifra, que es la que se anuncia.
import { ESCALA, nivel } from '../../lib/escala';

export default function BarraEscala({ puntuacion, grosor = 8 }) {
  const n = puntuacion == null ? -1 : nivel(puntuacion);
  return (
    <div className="ira-barra" aria-hidden="true">
      {ESCALA.map((c, i) => (
        <span key={i} style={{ background: c, height: grosor, borderRadius: grosor / 2, opacity: i <= n ? 1 : 0.2 }} />
      ))}
    </div>
  );
}
