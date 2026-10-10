// IRA · Metodología 2.0 · P1 · Base teórica como mapa conceptual.
// La frontera del nosotros en el centro y los autores alrededor, en tres zonas
// (cuerpo, lenguaje, política). Al elegir uno se abre su tarjeta con texto y referencias.
import { useState } from 'react';

// Centro de cada nodo en el lienzo de 520 × 520 (mismo orden que que.teoria)
const NODOS_XY = [
  [100, 167], // Gallese
  [260, 75], // Chilton
  [420, 167], // Van Dijk
  [420, 352], // Mouffe
  [260, 445], // Laclau
  [100, 352], // Tajfel · Gaertner
];

export default function MapaTeoria({ teoria, ui, referencias }) {
  const [activo, setActivo] = useState(0);
  const a = teoria[activo];
  const n = ui.nodos[activo];
  const refs = referencias.filter((r) => n.refs.some((clave) => r.startsWith(clave)));

  return (
    <div className="ira-pz-teoria">
      <p className="ira-met__nota">{ui.ayuda}</p>
      <div className="ira-pz-teoria__rejilla">
        <div className="ira-pz-teoria__mapa">
          <svg viewBox="0 0 520 520" className="ira-pz-teoria__lineas" aria-hidden="true">
            <circle cx="260" cy="260" r="185" className="ira-pz-teoria__orbita" />
            {NODOS_XY.map(([x, y], k) => (
              <line key={k} x1="260" y1="260" x2={x} y2={y} className={`ira-pz-teoria__linea ira-pz-zona--${ui.nodos[k].zona}${k === activo ? ' is-activa' : ''}`} />
            ))}
            <circle cx="260" cy="260" r="46" className="ira-pz-teoria__puerta" />
            <circle cx="260" cy="260" r="46" className="ira-pz-teoria__muro" transform="rotate(-62 260 260)" />
            <circle cx="260" cy="260" r="12" className="ira-pz-teoria__centro" />
          </svg>
          <span className="ira-pz-teoria__zona ira-pz-zona--cuerpo" style={{ left: '4%', top: '47%' }}>{ui.zonas.cuerpo}</span>
          <span className="ira-pz-teoria__zona ira-pz-zona--lenguaje" style={{ left: '76%', top: '5%' }}>{ui.zonas.lenguaje}</span>
          <span className="ira-pz-teoria__zona ira-pz-zona--politica" style={{ left: '77%', top: '92%' }}>{ui.zonas.politica}</span>
          {NODOS_XY.map(([x, y], k) => (
            <button
              key={ui.nodos[k].corto}
              type="button"
              aria-pressed={k === activo}
              onClick={() => setActivo(k)}
              className={`ira-pz-teoria__nodo ira-pz-zona--${ui.nodos[k].zona}${k === activo ? ' is-activo' : ''}`}
              style={{ left: `${(x / 520) * 100}%`, top: `${(y / 520) * 100}%` }}
            >
              <span className="ira-pz-teoria__nodo-nombre">{ui.nodos[k].corto}</span>
              <span className="ira-pz-teoria__nodo-anios ira-cifra">{ui.nodos[k].anios}</span>
            </button>
          ))}
        </div>

        <article key={activo} className={`ira-pz-teoria__tarjeta ira-pz-zona--${n.zona}`} aria-live="polite">
          <span className="ira-pz-teoria__chip">{ui.zonas[n.zona]} · {n.disciplina}</span>
          <h4 className="ira-pz-teoria__autor">{a.autor}</h4>
          <p className="ira-pz-teoria__texto">{a.texto}</p>
          {refs.length > 0 && (
            <div className="ira-pz-teoria__refs">
              <span>{ui.referencias}</span>
              {refs.map((r) => <p key={r}>{r}</p>)}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
