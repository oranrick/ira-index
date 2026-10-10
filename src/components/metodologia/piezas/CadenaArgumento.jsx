// IRA · Metodología 2.0 · P1 · Por qué importa: la cadena del argumento.
// Los cuatro eslabones del manual unidos por conectores; el activo se abre en grande con
// su ilustración. La tesis final se enciende al llegar al último eslabón.
import { useState } from 'react';

const COLOR = ['salvia', 'salvia', 'rojo', 'rojo'];

function Ilustracion({ i }) {
  if (i === 0) return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <path d="M10 60 q12 -26 24 0 t24 0 t24 0 t24 0" className="ira-pz-il__onda" />
      <circle cx="136" cy="60" r="16" className="ira-pz-il__nosotros" />
      <circle cx="136" cy="60" r="28" className="ira-pz-il__anillo" />
      <path d="M180 44 H232 M180 60 H224 M180 76 H214" className="ira-pz-il__razon" />
    </svg>
  );
  if (i === 1) return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <circle cx="90" cy="60" r="44" className="ira-pz-il__anillo" />
      <circle cx="90" cy="60" r="14" className="ira-pz-il__nosotros" />
      <circle cx="114" cy="44" r="6" className="ira-pz-il__otro" />
      <path d="M104 62 L188 60" className="ira-pz-il__debil" />
      <circle cx="196" cy="60" r="6" className="ira-pz-il__otro ira-pz-il__otro--lejos" />
    </svg>
  );
  if (i === 2) return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <circle cx="110" cy="60" r="46" className="ira-pz-il__puerta" transform="rotate(-25 110 60)" />
      <circle cx="110" cy="60" r="14" className="ira-pz-il__nosotros" />
      <circle cx="150" cy="54" r="6" className="ira-pz-il__otro" />
      <path d="M206 56 L166 56" className="ira-pz-il__paso" />
    </svg>
  );
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <rect x="30" y="20" width="18" height="90" className="ira-pz-il__muro" />
      <path d="M30 42 H48 M30 64 H48 M30 86 H48" className="ira-pz-il__junta" />
      <rect x="90" y="84" width="22" height="26" rx="3" className="ira-pz-il__barra ira-pz-il__barra--1" />
      <rect x="124" y="64" width="22" height="46" rx="3" className="ira-pz-il__barra ira-pz-il__barra--2" />
      <rect x="158" y="40" width="22" height="70" rx="3" className="ira-pz-il__barra ira-pz-il__barra--3" />
      <rect x="192" y="14" width="22" height="96" rx="3" className="ira-pz-il__barra ira-pz-il__barra--4" />
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
            <div className="ira-pz-cadena__ilustracion"><Ilustracion i={i} /></div>
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
