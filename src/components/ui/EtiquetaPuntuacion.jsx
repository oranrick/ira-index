// IRA · etiqueta de puntuación
// pastilla: fondo de la escala con la cifra encima · punto: punto de color de 10 px y la cifra
import { colorPuntuacion, textoSobrePuntuacion, formatearPuntuacion } from '../../lib/escala';

export default function EtiquetaPuntuacion({ puntuacion, variante = 'pastilla', lang = 'es', decimales = 1, className = '' }) {
  const texto = formatearPuntuacion(puntuacion, lang, decimales);
  const etiqueta = lang === 'en' ? `Score ${texto} out of 10` : `Puntuación ${texto} de 10`;
  if (puntuacion == null) return <span className={`ira-etiqueta ira-etiqueta--vacia ${className}`}>—</span>;
  if (variante === 'punto') {
    return (
      <span className={`ira-etiqueta ira-etiqueta--punto ${className}`} aria-label={etiqueta}>
        <span className="ira-etiqueta__punto" style={{ background: colorPuntuacion(puntuacion) }} aria-hidden="true" />
        <span aria-hidden="true">{texto}</span>
      </span>
    );
  }
  return (
    <span
      className={`ira-etiqueta ira-etiqueta--pastilla ${className}`}
      style={{ background: colorPuntuacion(puntuacion), color: textoSobrePuntuacion(puntuacion) }}
      aria-label={etiqueta}
    >
      <span aria-hidden="true">{texto}</span>
    </span>
  );
}
