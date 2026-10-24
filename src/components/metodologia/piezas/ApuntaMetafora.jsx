// IRA · Metodología 2.0 · P2 · ¿Contra quién apunta? (pieza interactiva, SIMULACIÓN).
// Siete frases del manual: al elegir una, la flecha sale de la imagen (el dominio) y llega a su
// blanco (alguien, algo o el nosotros); los tres pasos de la regla dan el resultado.
import { useRef, useState } from 'react';

// Centro de cada blanco en el lienzo de 420 × 300
const BLANCO_XY = { alguien: [342, 62], algo: [342, 150], nosotros: [342, 238] };
const ORIGEN = [86, 150];

function flecha(blanco) {
  const [x1, y1] = BLANCO_XY[blanco];
  const [x0, y0] = ORIGEN;
  const fin = x1 - 40; // se detiene antes del blanco
  const cx = (x0 + fin) / 2;
  return `M${x0 + 38} ${y0} C${cx} ${y0}, ${cx} ${y1}, ${fin} ${y1}`;
}

function Respuesta({ valor, t }) {
  if (valor === true) return <span className="ira-p2-paso__resp ira-p2-paso__resp--si">{t.si}</span>;
  if (valor === false) return <span className="ira-p2-paso__resp ira-p2-paso__resp--no">{t.no}</span>;
  if (valor === 'atajo') return <span className="ira-p2-paso__resp ira-p2-paso__resp--atajo">{t.atajo}</span>;
  return <span className="ira-p2-paso__resp ira-p2-paso__resp--na">{t.noAplica}</span>;
}

export default function ApuntaMetafora({ t, resultados }) {
  const [activa, setActiva] = useState(0);
  const refs = useRef([]);
  const e = t.ejemplos[activa];
  const r = resultados[e.resultado];

  // En móvil las frases van en una fila deslizable: la elegida se trae a la vista
  const elegir = (n) => {
    setActiva(n);
    refs.current[n]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };
  const mover = (i) => {
    const n = (i + t.ejemplos.length) % t.ejemplos.length;
    elegir(n);
    refs.current[n]?.focus({ preventScroll: true });
  };
  const onKey = (ev, i) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); mover(i + 1); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); mover(i - 1); }
  };

  return (
    <div className="ira-p2-apunta">
      <p className="ira-met__texto">{t.intro}</p>
      <div className="ira-pz-banda ira-p2-apunta__rejilla">
        <div role="radiogroup" aria-label={t.etiqueta} className="ira-p2-apunta__frases">
          {t.ejemplos.map((x, i) => (
            <button
              key={x.frase}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={i === activa}
              tabIndex={i === activa ? 0 : -1}
              onClick={() => elegir(i)}
              onKeyDown={(ev) => onKey(ev, i)}
              className={`ira-p2-apunta__frase ira-p2--${x.resultado}${i === activa ? ' is-activa' : ''}`}
            >
              <span className="ira-p2-codigo ira-cifra">{x.dominio}</span>
              <span className="ira-p2-apunta__frase-texto">
                <span className="ira-p2-apunta__corto">{x.nombreDominio}</span>
                <span className="ira-p2-apunta__cita">{x.frase}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={`ira-p2-apunta__lado ira-p2--${e.resultado}`}>
          <svg viewBox="0 0 420 300" className="ira-p2-diana" role="img" aria-label={`${e.nombreDominio} → ${e.blancoTexto}: ${r.nombre}`}>
            <defs>
              <marker id="ira-p2-punta" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="ira-p2-diana__punta" />
              </marker>
            </defs>
            {/* la imagen */}
            <circle cx={ORIGEN[0]} cy={ORIGEN[1]} r="52" className="ira-p2-diana__halo" />
            <circle cx={ORIGEN[0]} cy={ORIGEN[1]} r="38" className="ira-p2-diana__imagen" />
            <text x={ORIGEN[0]} y={ORIGEN[1] + 6} className="ira-p2-diana__codigo">{e.dominio}</text>
            <text x={ORIGEN[0]} y={ORIGEN[1] + 72} className="ira-p2-diana__rotulo">{t.imagen}</text>

            {/* los tres blancos */}
            {Object.entries(BLANCO_XY).map(([id, [x, y]]) => (
              <g key={id} className={`ira-p2-diana__blanco ira-p2-diana__blanco--${id}${e.blanco === id ? ' is-blanco' : ''}`}>
                <circle cx={x} cy={y} r="30" className="ira-p2-diana__aro" />
                {id === 'alguien' && (
                  <g className="ira-p2-diana__icono">
                    <circle cx={x} cy={y - 7} r="6.5" />
                    <path d={`M${x - 12} ${y + 15} Q${x - 12} ${y + 2} ${x} ${y + 2} Q${x + 12} ${y + 2} ${x + 12} ${y + 15}`} />
                  </g>
                )}
                {id === 'algo' && <rect x={x - 9} y={y - 9} width="18" height="18" rx="2" transform={`rotate(45 ${x} ${y})`} className="ira-p2-diana__icono" />}
                {id === 'nosotros' && (
                  <g className="ira-p2-diana__icono">
                    <circle cx={x} cy={y} r="15" />
                    <circle cx={x} cy={y} r="6" className="ira-p2-diana__lleno" />
                  </g>
                )}
                <text x={x} y={y + 47} className="ira-p2-diana__rotulo">{t.blancos[id]}</text>
              </g>
            ))}

            <path key={activa} d={flecha(e.blanco)} className="ira-p2-diana__flecha" markerEnd="url(#ira-p2-punta)" />
          </svg>

          <ol className="ira-p2-pasos">
            <li className="ira-p2-paso"><span className="ira-p2-paso__n ira-cifra">1</span><span className="ira-p2-paso__q">{t.paso1}</span><Respuesta valor={e.p1} t={t} /></li>
            <li className="ira-p2-paso"><span className="ira-p2-paso__n ira-cifra">2</span><span className="ira-p2-paso__q">{t.paso2}</span><Respuesta valor={e.p2} t={t} /></li>
            <li className="ira-p2-paso"><span className="ira-p2-paso__n ira-cifra">3</span><span className="ira-p2-paso__q">{t.paso3}</span><Respuesta valor={e.p3} t={t} /></li>
          </ol>

          <div className="ira-p2-veredicto" aria-live="polite">
            <p className="ira-p2-veredicto__fila">
              <span className="ira-p2-veredicto__dato"><span>{t.dominio}</span> {e.nombreDominio}</span>
              <span className="ira-p2-veredicto__dato"><span>{t.blanco}</span> {e.blancoTexto}</span>
            </p>
            <p className="ira-p2-veredicto__resultado"><span className="ira-p2-pildora">{r.nombre}</span></p>
            <p className="ira-p2-veredicto__porque">{e.porque}{e.fuente && <span className="ira-p2-veredicto__fuente"> · {e.fuente}</span>}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
