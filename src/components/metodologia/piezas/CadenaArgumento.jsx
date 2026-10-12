// IRA · Metodología 2.0 · P1 · Por qué importa: la cadena del argumento.
// Los cuatro eslabones del manual unidos por conectores; el activo se abre en grande con
// su ilustración. La tesis final se enciende al llegar al último eslabón.
import { useState } from 'react';

const COLOR = ['salvia', 'salvia', 'rojo', 'rojo'];

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
    <svg viewBox="0 0 300 150" role="img" aria-label={`${r.frase} → 1 ${r.intuicion} → 2 ${r.razonamiento}`}>
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
    <svg viewBox="0 0 300 150" role="img" aria-label={`${r.oyente}: ${r.nosotros} / ${r.frontera} / ${r.ellos}`}>
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
    <svg viewBox="0 0 300 150" role="img" aria-label={`${r.muro} / ${r.puerta}: ${r.comun}`}>
      <Persona x={20} y={72} className="ira-pz-il__persona ira-pz-il__persona--yo" />
      <path d={onda(32, 64, 70, 8)} className="ira-pz-il__onda" />
      <rect x="66" y="34" width="10" height="76" rx="2" className="ira-pz-il__muro" />
      <Persona x={112} y={72} className="ira-pz-il__persona ira-pz-il__persona--lejos" />
      <text x="71" y="138" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--rojo">{r.muro}</text>
      <path d="M150 20 V130" className="ira-pz-il__separador" />
      <ellipse cx="226" cy="72" rx="68" ry="50" className="ira-pz-il__comun" />
      <text x="226" y="16" textAnchor="middle" className="ira-pz-il__rotulo">{r.comun}</text>
      <Persona x={180} y={72} className="ira-pz-il__persona ira-pz-il__persona--yo" />
      <rect x="221" y="34" width="10" height="24" rx="2" className="ira-pz-il__muro" />
      <rect x="221" y="86" width="10" height="24" rx="2" className="ira-pz-il__muro" />
      <path d={onda(192, 256, 70, 8)} className="ira-pz-il__onda" />
      <Persona x={272} y={72} className="ira-pz-il__persona" />
      <text x="226" y="138" textAnchor="middle" className="ira-pz-il__rotulo ira-pz-il__rotulo--fuerte">{r.puerta}</text>
    </svg>
  );
  // 4 · El incentivo: el mensaje contra el exogrupo genera mucha más interacción
  return (
    <svg viewBox="0 0 300 150" role="img" aria-label={`${r.sobreNosotros} < ${r.contraEllos} (${r.interaccion})`}>
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
  const ultimo = i === pasos.length - 1;
  const ir = (k) => setI(Math.max(0, Math.min(pasos.length - 1, k)));
  const p = pasos[i];

  return (
    <div className="ira-pz-cadena">
      <div className="ira-pz-cadena__rejilla">
        <ol className="ira-pz-cadena__rail" aria-label={ui.etiqueta}>
          {pasos.map((x, k) => (
            <li key={x.titulo}>
              <button
                type="button"
                aria-current={k === i ? 'step' : undefined}
                onClick={() => ir(k)}
                className={`ira-pz-cadena__nodo ira-pz-cadena__nodo--${COLOR[k]}${k === i ? ' is-activo' : ''}${k <= i ? ' is-visto' : ''}`}
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

        <article key={i} className={`ira-pz-cadena__panel ira-pz-cadena__panel--${COLOR[i]}`} aria-live="polite">
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
              <button type="button" className="ira-boton ira-boton--secundario ira-boton--icono" onClick={() => ir(i - 1)} disabled={i === 0} aria-label={ui.anterior}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-met__chevron"><polyline points="15 6 9 12 15 18" /></svg>
              </button>
              <button type="button" className="ira-boton ira-boton--principal ira-boton--compacto" onClick={() => (ultimo ? setI(0) : ir(i + 1))}>
                {ultimo ? ui.reiniciar : ui.siguiente}
              </button>
            </span>
          </div>
        </article>
      </div>

      <p className={`ira-met__destacado ira-met__destacado--rojo ira-pz-cadena__tesis${ultimo ? ' is-encendida' : ''}`}>{cita}</p>
    </div>
  );
}
