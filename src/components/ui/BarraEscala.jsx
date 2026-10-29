// IRA · la puntuación como traza corta: el ritmo de la línea dice la nota (serena y salvia
// cerca de 10, nerviosa y roja cerca de 0). Sustituye a la antigua barra de 11 segmentos.
// Decorativa: siempre va junto a la cifra, que es la que se anuncia.
import Traza from './Traza.jsx';

export default function BarraEscala({ puntuacion, grosor = 8 }) {
  const nota = puntuacion == null ? null : Number(puntuacion);
  return (
    <div className="ira-barra ira-barra--traza" aria-hidden="true">
      {nota == null
        ? <span className="ira-barra__vacia" />
        : <Traza notas={nota} semilla={`barra-${nota}`} alto={Math.max(22, grosor * 4)} grosor={Math.max(1.6, grosor / 3.5)} duracion={1000} periodo={[70, 10]} />}
    </div>
  );
}
