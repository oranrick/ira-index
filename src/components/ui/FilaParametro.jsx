// IRA · fila de un parámetro: nombre, etiqueta de puntuación y barra en el color de la escala.
// Con onToggle, la cabecera es un botón que despliega el detalle (children).
import { useId } from 'react';
import { colorPuntuacion } from '../../lib/escala';
import EtiquetaPuntuacion from './EtiquetaPuntuacion.jsx';

export default function FilaParametro({ etiqueta, puntuacion, descripcion, lang = 'es', abierto = false, onToggle, children }) {
  const id = useId();
  const val = Number(puntuacion) || 0;
  const cabecera = (
    <>
      <span className="ira-param__nombre">{etiqueta}</span>
      <span className="ira-param__lado">
        <EtiquetaPuntuacion puntuacion={val} lang={lang} />
        {onToggle && (
          <svg className="ira-param__chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
            style={{ transform: abierto ? 'rotate(180deg)' : 'none' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </span>
    </>
  );
  return (
    <div className="ira-param">
      {onToggle ? (
        <button type="button" className="ira-param__cabecera ira-param__cabecera--boton" aria-expanded={abierto} aria-controls={id} onClick={onToggle}>
          {cabecera}
        </button>
      ) : (
        <div className="ira-param__cabecera">{cabecera}</div>
      )}
      <div className="ira-param__pista" aria-hidden="true">
        <div style={{ width: `${Math.min(100, Math.max(0, val * 10))}%`, background: colorPuntuacion(val) }} />
      </div>
      {descripcion && <p className="ira-param__desc">{descripcion}</p>}
      {onToggle && abierto && <div id={id} className="ira-param__detalle">{children}</div>}
    </div>
  );
}
