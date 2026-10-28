// IRA · Metodología 2.0 · P1 · Base teórica como mapa conceptual.
// La frontera del nosotros en el centro y los autores alrededor, en tres zonas
// (cuerpo, lenguaje, política). Al elegir uno se abre su tarjeta con texto y referencias.
import { useState } from 'react';
import { Mando, chispazo, useDeslizar, useRecorrido } from '../Juego.jsx';

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
  const [activo, setActivoBase] = useState(0);
  const [encima, setEncima] = useState(null);
  const total = NODOS_XY.length;
  const setActivo = (k, ev) => {
    const n = (k + total) % total;
    if (n !== activo) chispazo(ev, ui.nodos[n].zona === 'cuerpo' ? 'salvia' : ui.nodos[n].zona === 'lenguaje' ? 'oro' : 'interpelacion', 8);
    setActivoBase(n);
  };
  const recorrido = useRecorrido(total, () => setActivoBase((a) => (a + 1) % total), 4200);
  const deslizar = useDeslizar((ev) => { recorrido.parar(); setActivo(activo + 1, ev); }, (ev) => { recorrido.parar(); setActivo(activo - 1, ev); });
  const a = teoria[activo];
  const n = ui.nodos[activo];
  const refs = referencias.filter((r) => n.refs.some((clave) => r.startsWith(clave)));

  return (
    <div className={`ira-pz-teoria ira-juego-espera${recorrido.visto ? ' is-visto' : ''}`} ref={recorrido.ref}>
      <div className="ira-juego-cab">
        <p className="ira-met__nota">{ui.ayuda}</p>
        <Mando i={activo} n={total} ir={(k) => setActivo(k)} recorrido={recorrido} tono={ui.nodos[activo].zona === 'cuerpo' ? 'salvia' : ui.nodos[activo].zona === 'lenguaje' ? 'oro' : 'interpelacion'}
          etiqueta="Autores" textos={{ anterior: 'Autor anterior', siguiente: 'Autor siguiente', recorrer: 'Recorrer' }} />
      </div>
      <div className="ira-pz-teoria__rejilla">
        <div className="ira-pz-teoria__mapa">
          <svg viewBox="0 0 520 520" className="ira-pz-teoria__lineas" aria-hidden="true">
            <circle cx="260" cy="260" r="185" className="ira-pz-teoria__orbita" />
            {NODOS_XY.map(([x, y], k) => (
              <line key={k} x1={x} y1={y} x2="260" y2="260" className={`ira-pz-teoria__linea ira-pz-zona--${ui.nodos[k].zona}${k === activo ? ' is-activa' : ''}${k === encima ? ' is-encima' : ''}`} />
            ))}
            {/* el flujo: del autor activo hacia la frontera */}
            <line key={`flujo-${activo}`} x1={NODOS_XY[activo][0]} y1={NODOS_XY[activo][1]} x2="260" y2="260" className={`ira-pz-teoria__flujo ira-pz-zona--${ui.nodos[activo].zona}`} />
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
              onClick={(ev) => { recorrido.parar(); setActivo(k, ev); }}
              onMouseEnter={() => setEncima(k)}
              onMouseLeave={() => setEncima(null)}
              className={`ira-pz-teoria__nodo ira-pz-zona--${ui.nodos[k].zona}${k === activo ? ' is-activo' : ''}`}
              style={{ left: `${(x / 520) * 100}%`, top: `${(y / 520) * 100}%`, '--k': k }}
            >
              <span className="ira-pz-teoria__nodo-nombre">{ui.nodos[k].corto}</span>
              <span className="ira-pz-teoria__nodo-anios ira-cifra">{ui.nodos[k].anios}</span>
            </button>
          ))}
        </div>

        <article key={activo} className={`ira-pz-teoria__tarjeta ira-pz-zona--${n.zona}`} aria-live="polite" {...deslizar}>
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
