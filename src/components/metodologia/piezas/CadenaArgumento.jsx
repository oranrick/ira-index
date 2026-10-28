// IRA · Metodología 2.0 · P1 · Por qué importa: la cadena del argumento.
// Los cuatro eslabones del manual unidos por conectores; el activo se abre en grande con
// su ilustración. La tesis final se enciende al llegar al último eslabón.
import { useRef, useState } from 'react';
import { chispazo, useAlVer } from '../Juego.jsx';

const COLOR = ['salvia', 'salvia', 'rojo', 'rojo'];
// Cinco ladrillos de 14 de alto entre y = 34 y y = 110
const LADRILLOS = [34, 49.5, 65, 80.5, 96];

// Onda horizontal de x0 a x1 (periodo p, amplitud amp) como trazado SVG
function onda(x0, x1, y, amp, p = 16) {
  const medios = Math.max(1, Math.round((x1 - x0) / (p / 2)));
  let d = `M${x0} ${y} q${p / 4} ${-amp} ${p / 2} 0`;
  for (let k = 1; k < medios; k++) d += ` t${p / 2} 0`;
  return d;
}

function Persona({ x, y, className }) {
  return (
    <g className={className}>
      <circle cx={x} cy={y - 9} r="6" />
      <path d={`M${x - 10} ${y + 11} Q${x - 10} ${y} ${x} ${y} Q${x + 10} ${y} ${x + 10} ${y + 11} Z`} />
    </g>
  );
}

function Ilustracion({ i, r }) {
  // 1 · Intuición → razonamiento: la frase recibe enseguida una valoración rápida (destello) y el
  // razonamiento llega después, partiendo de ella y teñido de su color. Sin anatomía: el manual no la nombra.
  if (i === 0) return (
    <svg viewBox="0 0 300 150" className="ira-pz-il ira-pz-il--0" role="img" aria-label={`${r.frase} → 1 ${r.intuicion} → 2 ${r.razonamiento}`}>
      <path d="M6 52 H70 V86 H26 L18 94 V86 H6 Z" className="ira-pz-il__burbuja ira-pz-il__burbuja--neutra" />
      <path d="M16 64 H60 M16 75 H48" className="ira-pz-il__razon" />
      <text x="38" y="114" textAnchor="middle" className="ira-pz-il__rotulo">{r.frase}</text>
      <path d="M74 69 H88" className="ira-pz-il__flecha" />
      <circle cx="106" cy="69" r="22" className="ira-pz-il__halo" />
      <circle cx="106" cy="69" r="12" className="ira-pz-il__intuicion" />
      <text x="106" y="30" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--oro"><tspan className="ira-pz-il__orden">1</tspan> {r.intuicion}</text>
      <path d="M130 69 H146" className="ira-pz-il__flecha ira-pz-il__flecha--tarde" />
      <rect x="150" y="60" width="36" height="18" rx="4" className="ira-pz-il__paso-razon" />
      <rect x="196" y="54" width="40" height="30" rx="4" className="ira-pz-il__paso-razon" />
      <rect x="246" y="46" width="46" height="46" rx="4" className="ira-pz-il__paso-razon" />
      <path d="M186 69 H196 M236 69 H246" className="ira-pz-il__guia" />
      <text x="292" y="114" textAnchor="end" className="ira-pz-il__rotulo"><tspan className="ira-pz-il__orden">2</tspan> {r.razonamiento}</text>
    </svg>
  );
  // 2 · Pesa la frontera: la resonancia es plena con «nosotros» y se apaga al cruzar hacia «ellos»
  if (i === 1) return (
    <svg viewBox="0 0 300 150" className="ira-pz-il ira-pz-il--1" role="img" aria-label={`${r.oyente}: ${r.nosotros} / ${r.frontera} / ${r.ellos}`}>
      <Persona x={30} y={78} className="ira-pz-il__persona ira-pz-il__persona--yo" />
      <text x="30" y="112" textAnchor="middle" className="ira-pz-il__rotulo">{r.oyente}</text>
      <path d="M44 70 C52 52 58 40 70 40 M44 86 C52 102 58 112 70 112" className="ira-pz-il__guia" />
      <path d={onda(70, 214, 40, 10)} className="ira-pz-il__onda" />
      <Persona x={238} y={44} className="ira-pz-il__persona" />
      <text x="238" y="74" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--fuerte">{r.nosotros}</text>
      <path d={onda(70, 134, 112, 10)} className="ira-pz-il__onda" />
      <path d={onda(134, 214, 112, 3)} className="ira-pz-il__onda ira-pz-il__onda--debil" />
      <path d="M142 90 V134" className="ira-pz-il__frontera" />
      <text x="142" y="146" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--rojo">{r.frontera}</text>
      <Persona x={238} y={116} className="ira-pz-il__persona ira-pz-il__persona--lejos" />
      <text x="238" y="146" textAnchor="middle" className="ira-pz-il__rotulo">{r.ellos}</text>
    </svg>
  );
  // 3 · Muro frente a puerta: el muro corta la resonancia; la puerta la deja pasar y crea un nosotros común
  if (i === 2) return (
    <svg viewBox="0 0 300 150" className="ira-pz-il ira-pz-il--2" role="img" aria-label={`${r.muro} / ${r.puerta}: ${r.comun}`}>
      <Persona x={20} y={72} className="ira-pz-il__persona ira-pz-il__persona--yo" />
      <path d={onda(32, 64, 70, 8)} className="ira-pz-il__onda ira-pz-il__onda--choca" />
      {/* el muro se levanta ladrillo a ladrillo, de abajo arriba */}
      {LADRILLOS.map((y, k) => (
        <rect key={`m${k}`} x="66" y={y} width="10" height="14" rx="1.5" className="ira-pz-il__ladrillo" style={{ '--k': LADRILLOS.length - 1 - k }} />
      ))}
      <Persona x={112} y={72} className="ira-pz-il__persona ira-pz-il__persona--lejos" />
      <text x="71" y="138" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--rojo">{r.muro}</text>
      <path d="M150 20 V130" className="ira-pz-il__separador" />
      <ellipse cx="226" cy="72" rx="68" ry="50" className="ira-pz-il__comun" />
      <text x="226" y="16" textAnchor="middle" className="ira-pz-il__rotulo">{r.comun}</text>
      <Persona x={180} y={72} className="ira-pz-il__persona ira-pz-il__persona--yo" />
      {/* la puerta: el mismo muro, pero sus ladrillos se apartan y dejan paso */}
      {LADRILLOS.map((y, k) => (
        <rect key={`p${k}`} x="221" y={y} width="10" height="14" rx="1.5"
          className={`ira-pz-il__ladrillo ira-pz-il__ladrillo--puerta ira-pz-il__ladrillo--${k < 2 ? 'arriba' : k > 2 ? 'abajo' : 'medio'}`} />
      ))}
      <path d={onda(192, 256, 70, 8)} className="ira-pz-il__onda ira-pz-il__onda--pasa" />
      <Persona x={272} y={72} className="ira-pz-il__persona ira-pz-il__persona--otro" />
      <text x="226" y="138" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--fuerte">{r.puerta}</text>
    </svg>
  );
  // 4 · El incentivo: el mensaje contra el exogrupo genera mucha más interacción
  return (
    <svg viewBox="0 0 300 150" className="ira-pz-il ira-pz-il--3" role="img" aria-label={`${r.sobreNosotros} < ${r.contraEllos} (${r.interaccion})`}>
      <path d="M8 18 H124 V48 H30 L22 56 V48 H8 Z" className="ira-pz-il__burbuja" />
      <text x="66" y="38" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--fuerte">{r.sobreNosotros}</text>
      <rect x="134" y="26" width="38" height="14" rx="3" className="ira-pz-il__barra ira-pz-il__barra--baja" />
      <path d="M8 74 H124 V104 H30 L22 112 V104 H8 Z" className="ira-pz-il__burbuja ira-pz-il__burbuja--rojo" />
      <text x="66" y="94" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--rojo">{r.contraEllos}</text>
      <rect x="134" y="82" width="156" height="14" rx="3" className="ira-pz-il__barra ira-pz-il__barra--alta" />
      <path d="M134 126 H286 M280 121 L287 126 L280 131" className="ira-pz-il__eje" />
      <text x="290" y="146" textAnchor="end" className="ira-pz-il__rotulo">{r.interaccion}</text>
    </svg>
  );
}

export default function CadenaArgumento({ pasos, cita, ui }) {
  const [i, setI] = useState(0);
  const [marco, visto] = useAlVer();
  const tesis = useRef(null);
  const toque = useRef(null);
  const ultimo = i === pasos.length - 1;
  const ir = (k, ev) => {
    const n = Math.max(0, Math.min(pasos.length - 1, k));
    if (n === i) return;
    if (ev) chispazo(ev, COLOR[n], 7);
    setI(n);
    // Al llegar al último eslabón, la tesis se enciende con su destello
    if (n === pasos.length - 1) setTimeout(() => chispazo(tesis.current, 'rojo', 12), 380);
  };
  const p = pasos[i];
  // Deslizar con el dedo sobre el panel también pasa de eslabón
  const empezar = (ev) => { toque.current = ev.clientX; };
  const soltar = (ev) => {
    if (toque.current == null) return;
    const dx = ev.clientX - toque.current;
    toque.current = null;
    if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
  };
  const onKey = (ev) => {
    if (ev.key === 'ArrowRight') { ev.preventDefault(); ir(i + 1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); ir(i - 1); }
  };

  return (
    <div ref={marco} className={`ira-pz-cadena ira-juego-espera${visto ? ' is-visto' : ''}`} onKeyDown={onKey}>
      <div className="ira-pz-cadena__rejilla">
        <ol className="ira-pz-cadena__rail" aria-label={ui.etiqueta}>
          {pasos.map((x, k) => (
            <li key={x.titulo}>
              <button
                type="button"
                aria-current={k === i ? 'step' : undefined}
                onClick={(ev) => ir(k, ev)}
                className={`ira-pz-cadena__nodo ira-juego-elige ira-pz-cadena__nodo--${COLOR[k]}${k === i ? ' is-activo' : ''}${k <= i ? ' is-visto' : ''}`}
              >
                <span className="ira-pz-cadena__n ira-cifra">{k + 1}</span>
                <span className="ira-pz-cadena__nodo-titulo">{x.titulo}</span>
              </button>
              {k < pasos.length - 1 && (
                <span className={`ira-pz-cadena__conector${k < i ? ' is-hecho' : ''}`}>
                  <span className="ira-pz-cadena__linea" aria-hidden="true" />
                  <span className="ira-pz-cadena__conector-texto">{ui.conectores[k]}</span>
                </span>
              )}
            </li>
          ))}
        </ol>

        <article key={i} className={`ira-pz-cadena__panel ira-pz-cadena__panel--${COLOR[i]}`} aria-live="polite"
          onPointerDown={empezar} onPointerUp={soltar} onPointerCancel={() => { toque.current = null; }}>
          <div className="ira-pz-cadena__cab">
            <span className="ira-pz-cadena__grande ira-cifra" aria-hidden="true">{i + 1}</span>
            <div className="ira-pz-cadena__ilustracion"><Ilustracion i={i} r={ui.ilustraciones} /></div>
          </div>
          <h3 className="ira-pz-cadena__titulo">{p.titulo}</h3>
          <p className="ira-pz-cadena__texto">{p.texto}</p>
          <p className="ira-pz-cadena__fuentes">{p.fuentes}</p>
          <div className="ira-pz-cadena__pie">
            <span className="ira-pz-cadena__puntos" aria-hidden="true">
              {pasos.map((x, k) => <span key={x.titulo} className={`${k === i ? 'is-activo' : ''}${k <= i ? ' is-visto' : ''}`} />)}
            </span>
            <span className="ira-pz-cadena__botones">
              <button type="button" className="ira-boton ira-boton--secundario ira-boton--icono" onClick={(ev) => ir(i - 1, ev)} disabled={i === 0} aria-label={ui.anterior}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-met__chevron"><polyline points="15 6 9 12 15 18" /></svg>
              </button>
              <button type="button" className={`ira-boton ira-boton--principal ira-boton--compacto ira-pz-cadena__siguiente${ultimo ? ' is-ultimo' : ''}`} onClick={(ev) => (ultimo ? (chispazo(ev, 'salvia', 7), setI(0)) : ir(i + 1, ev))}>
                {ultimo ? ui.reiniciar : ui.siguiente}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="ira-pz-cadena__flecha">
                  {ultimo ? <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
                </svg>
              </button>
            </span>
          </div>
        </article>
      </div>

      <p ref={tesis} className={`ira-met__destacado ira-met__destacado--rojo ira-pz-cadena__tesis${ultimo ? ' is-encendida' : ''}`}>{cita}</p>
    </div>
  );
}
