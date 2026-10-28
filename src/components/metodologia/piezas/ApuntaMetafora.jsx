// IRA · Metodología 2.0 · P2 · ¿Contra quién apunta? (pieza interactiva, SIMULACIÓN).
// Siete frases del manual: al elegir una, la flecha sale de la imagen (el dominio), un destello
// viaja por ella y golpea su blanco (alguien, algo o el nosotros); después los tres pasos de la
// regla se encienden uno tras otro y el resultado aparece al final, como en la cadena real.
import { useEffect, useRef, useState } from 'react';
import { Chispas, Mando, PistaTeclas, chispazo, tonoDe, traerEnTira, useDeslizar, useRecorrido, PistaDeslizar } from '../Juego.jsx';

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
  const [disparo, setDisparo] = useState(0); // tocar la diana vuelve a disparar
  const refs = useRef([]);
  const viaje = useRef(null);
  const brillo = useRef(null);
  const n = t.ejemplos.length;
  const e = t.ejemplos[activa];
  const r = resultados[e.resultado];
  const tono = tonoDe(e.resultado);

  // El destello sale cada vez que cambia la frase (SMIL: se arranca a mano)
  useEffect(() => {
    try { viaje.current?.beginElement?.(); brillo.current?.beginElement?.(); } catch { /* sin SMIL: la flecha basta */ }
  }, [activa, disparo]);

  // En móvil las frases van en una fila deslizable: la elegida se trae a la vista
  const elegir = (i, ev) => {
    const k = (i + n) % n;
    if (k !== activa) chispazo(ev ?? refs.current[k], t.ejemplos[k].resultado, 8);
    setActiva(k);
    traerEnTira(refs.current[k]);
  };
  const activaRef = useRef(activa);
  activaRef.current = activa;
  const elegirRef = useRef(elegir);
  elegirRef.current = elegir;
  const recorrido = useRecorrido(n, () => elegirRef.current(activaRef.current + 1), 3800);
  const mover = (i) => {
    recorrido.parar();
    elegir(i);
    refs.current[(i + n) % n]?.focus({ preventScroll: true });
  };
  const deslizar = useDeslizar((ev) => { recorrido.parar(); elegir(activa + 1, ev); }, (ev) => { recorrido.parar(); elegir(activa - 1, ev); });
  const onKey = (ev, i) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); mover(i + 1); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); mover(i - 1); }
  };
  const [bx, by] = BLANCO_XY[e.blanco];

  return (
    <div className={`ira-p2-apunta ira-juego-espera${recorrido.visto ? ' is-visto' : ''}`} ref={recorrido.ref}>
      <div className="ira-juego-cab">
        <p className="ira-met__texto">{t.intro}</p>
        <PistaTeclas />
      </div>
      <div className="ira-pz-banda ira-p2-apunta__rejilla">
        <div className="ira-p2-apunta__izq">
          <div role="radiogroup" aria-label={t.etiqueta} className="ira-p2-apunta__frases">
            {t.ejemplos.map((x, i) => (
              <button
                key={x.frase}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={i === activa}
                tabIndex={i === activa ? 0 : -1}
                onClick={(ev) => { recorrido.parar(); elegir(i, ev); }}
                onKeyDown={(ev) => onKey(ev, i)}
                className={`ira-p2-apunta__frase ira-juego-elige ira-juego--${tonoDe(x.resultado)} ira-p2--${x.resultado}${i === activa ? ' is-activa' : ''}`}
              >
                <span className="ira-p2-codigo ira-cifra">{x.dominio}</span>
                <span className="ira-p2-apunta__frase-texto">
                  <span className="ira-p2-apunta__corto">{x.nombreDominio}</span>
                  <span className="ira-p2-apunta__cita">{x.frase}</span>
                </span>
                {i === activa && <Chispas key={`c${activa}`} tono={x.resultado} semilla={x.frase} />}
              </button>
            ))}
          </div>
          <Mando i={activa} n={n} ir={elegir} recorrido={recorrido} tono={e.resultado} etiqueta={t.etiqueta}
            textos={{ anterior: 'Frase anterior', siguiente: 'Frase siguiente', recorrer: 'Recorrer las siete' }} />
        </div>

        <div className={`ira-p2-apunta__lado ira-p2--${e.resultado} ira-juego--${tono}`} {...deslizar}>
          <svg viewBox="0 0 420 300" onClick={(ev) => { chispazo(ev, e.resultado, 9); setDisparo((d) => d + 1); }} className={`ira-p2-diana ira-p2-diana--${e.resultado}`} role="img" aria-label={`${e.nombreDominio} → ${e.blancoTexto}: ${r.nombre}`}>
            <defs>
              <radialGradient id="ira-p2-bala">
                <stop offset="0" stopColor="#FCFDFF" />
                <stop offset="0.45" stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* la imagen: late como si cargara el disparo */}
            <circle cx={ORIGEN[0]} cy={ORIGEN[1]} r="52" className="ira-p2-diana__halo" />
            <g key={`img-${activa}-${disparo}`} className="ira-p2-diana__disparo">
              <circle cx={ORIGEN[0]} cy={ORIGEN[1]} r="38" className="ira-p2-diana__imagen" />
              <text x={ORIGEN[0]} y={ORIGEN[1] + 6} className="ira-p2-diana__codigo">{e.dominio}</text>
            </g>
            <text x={ORIGEN[0]} y={ORIGEN[1] + 72} className="ira-p2-diana__rotulo">{t.imagen}</text>

            {/* los tres blancos */}
            {Object.entries(BLANCO_XY).map(([id, [x, y]]) => (
              <g key={id} className={`ira-p2-diana__blanco ira-p2-diana__blanco--${id}${e.blanco === id ? ' is-blanco' : ''}`}>
                <g key={e.blanco === id ? `hit-${activa}-${disparo}` : id} className="ira-p2-diana__cuerpo" style={{ transformOrigin: `${x}px ${y}px` }}>
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
                </g>
                <text x={x} y={y + 47} className="ira-p2-diana__rotulo">{t.blancos[id]}</text>
              </g>
            ))}

            <path key={`f-${activa}-${disparo}`} d={flecha(e.blanco)} className="ira-p2-diana__flecha" />
            {/* la punta llega con el trazo (un marker saldría antes de tiempo) */}
            <path key={`punta-${activa}-${disparo}`} d={`M${bx - 41} ${by - 6.5} L${bx - 30} ${by} L${bx - 41} ${by + 6.5} Z`} className="ira-p2-diana__punta ira-p2-diana__punta--llega" style={{ transformOrigin: `${bx - 34}px ${by}px` }} />
            {/* el impacto: onda en el blanco al llegar */}
            <circle key={`onda-${activa}-${disparo}`} cx={bx} cy={by} r="30" className="ira-p2-diana__impacto" style={{ transformOrigin: `${bx}px ${by}px` }} />
            <circle r="7" className="ira-p2-diana__bala" fill="url(#ira-p2-bala)" opacity="0">
              <animateMotion ref={viaje} key={`m-${activa}`} begin="indefinite" dur="0.62s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.5 0 0.4 1" path={flecha(e.blanco)} />
              <animate ref={brillo} key={`o-${activa}`} attributeName="opacity" begin="indefinite" dur="0.62s" values="0;1;1;0" keyTimes="0;0.1;0.85;1" fill="freeze" />
            </circle>
          </svg>

          <PistaDeslizar />
          <ol key={`pasos-${activa}`} className="ira-p2-pasos">
            <li className="ira-p2-paso" style={{ '--k': 0 }}><span className="ira-p2-paso__n ira-cifra">1</span><span className="ira-p2-paso__q">{t.paso1}</span><Respuesta valor={e.p1} t={t} /></li>
            <li className="ira-p2-paso" style={{ '--k': 1 }}><span className="ira-p2-paso__n ira-cifra">2</span><span className="ira-p2-paso__q">{t.paso2}</span><Respuesta valor={e.p2} t={t} /></li>
            <li className="ira-p2-paso" style={{ '--k': 2 }}><span className="ira-p2-paso__n ira-cifra">3</span><span className="ira-p2-paso__q">{t.paso3}</span><Respuesta valor={e.p3} t={t} /></li>
          </ol>

          <div className="ira-p2-veredicto" aria-live="polite" key={`v-${activa}`}>
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
