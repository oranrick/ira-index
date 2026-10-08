// IRA · logo (variante Señal)
// El SVG vive en public/brand/. conNombre añade "Índice de Resonancia Afectiva"
// a continuación, alineado a la izquierda.
import { Link } from 'react-router-dom';

export default function IraLogo({ altura = 32, conNombre = false, to = '/', nombre = 'Índice de Resonancia Afectiva', etiqueta }) {
  return (
    <Link
      to={to}
      className="ira-logo"
      aria-label={etiqueta ?? (conNombre ? `ira, ${nombre}, inicio` : 'ira, inicio')}
    >
      {/* El SVG incluye las ondas por encima de la i, por eso es más alto que las letras */}
      <img src="/brand/ira-logo-sobre-oscuro.svg" alt="" width={Math.round(altura * 1.38)} height={Math.round(altura * 1.09)} style={{ height: altura * 1.09, width: 'auto', display: 'block' }} />
      {conNombre && (
        <span className="ira-logo__nombre" style={{ paddingBottom: altura * 0.02 }}>{nombre}</span>
      )}
    </Link>
  );
}
