// IRA · Metodología 2.0 · P1 · Permeabilidad: la frontera como una sola línea.
// Entre el nosotros y el otro hay una línea vertical. Cada cierre activado la hace más
// maciza; cada apertura le abre un hueco por el que pasa la luz. La permeabilidad se
// recalcula con la regla de sucesión de Laplace: 10 × (A + 1) / (A + C + 2).
import { useState } from 'react';
import { ESCALA, colorCifra, formatearPuntuacion, nivel } from '../../../lib/escala';

const INICIAL = ['C1', 'A3', 'C5'];

export default function FronteraLinea({ cierres, aperturas, ui, lang }) {
  const [sel, setSel] = useState(INICIAL);
  const [ultima, setUltima] = useState('C5');

  const todas = Object.fromEntries([...cierres, ...aperturas].map((m) => [m[0], m]));
  const toggle = (codigo) => {
    setSel((s) => (s.includes(codigo) ? s.filter((c) => c !== codigo) : [...s, codigo]));
    setUltima(codigo);
  };

  const C = sel.filter((c) => c.startsWith('C')).length;
  const A = sel.length - C;
  const n = A + C;
  const perm = (10 * (A + 1)) / (A + C + 2);
  const puntua = n >= 3;
  const idx = nivel(perm);
  const estado = n === 0 ? ui.sinEventos : puntua ? ui.puntua(n) : ui.pocos(n);
  const u = todas[ultima] ?? todas.C5;
  const otroX = n === 0 ? 88 : 88 - perm * 2.6;

  const chip = (m, tipo) => {
    const on = sel.includes(m[0]);
    return (
      <button
        key={m[0]}
        type="button"
        aria-pressed={on}
        onClick={() => toggle(m[0])}
        className={`ira-pz-linea__chip ira-pz--${tipo}${on ? ' is-on' : ''}`}
      >
        <span className="ira-cifra">{m[0]}</span>
        <span>{m[1]}</span>
      </button>
    );
  };

  return (
    <div className="ira-pz-banda ira-pz-linea">
      <div className="ira-pz-linea__cab">
        <div>
          <h4 className="ira-pz-linea__titulo">{ui.titulo}</h4>
          <p className="ira-met__nota">{ui.ayuda}</p>
        </div>
        <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto" onClick={() => setSel([])}>{ui.vaciar}</button>
      </div>

      <div className="ira-pz-linea__rejilla">
        <div className="ira-pz-linea__escena" aria-hidden="true" style={{ '--grosor': `${6 + C * 2}px` }}>
          <span className="ira-pz-linea__nosotros"><span className="ira-pz-linea__punto" />{ui.nosotros}</span>
          <span className="ira-pz-linea__otro" style={{ left: `${otroX}%`, opacity: n === 0 ? 0.4 : 1 }}><span className="ira-pz-linea__punto" />{ui.elOtro}</span>
          <div className="ira-pz-linea__frontera">
            {n === 0 && <span className="ira-pz-linea__vacia" />}
            {sel.map((c) => (c.startsWith('C') ? (
              <span key={c} className="ira-pz-linea__tramo ira-pz-linea__tramo--muro"><span className="ira-pz-linea__cod ira-cifra">{c}</span></span>
            ) : (
              <span key={c} className="ira-pz-linea__tramo ira-pz-linea__tramo--puerta"><span className="ira-pz-linea__haz" /><span className="ira-pz-linea__cod ira-cifra">{c}</span></span>
            )))}
          </div>
          {n === 0 && <span className="ira-pz-linea__vacia-texto">{ui.vacia}</span>}
        </div>

        <div className="ira-pz-linea__lectura">
          <span className="ira-pz-linea__rotulo">{ui.permeabilidad}</span>
          <p className="ira-pz-linea__cifra ira-cifra" style={{ color: n === 0 ? 'var(--ira-texto-3)' : puntua ? colorCifra(perm) : 'var(--ira-texto-2)' }}>
            {n === 0 ? 'n/p' : formatearPuntuacion(perm, lang, 2)}<span>/10</span>
          </p>
          <span className="ira-pz-linea__escala" aria-hidden="true">
            {ESCALA.map((c, i) => <span key={c} style={{ background: c, opacity: n === 0 ? 0.15 : i <= idx ? 1 : 0.18 }} />)}
          </span>
          <span className="ira-pz-linea__extremos" aria-hidden="true"><span>{ui.muro}</span><span>{ui.puerta}</span></span>
          <p className="ira-pz-linea__formula ira-cifra">10 × (A + 1) / (A + C + 2)<br /><span>= 10 × ({A} + 1) / ({A} + {C} + 2)</span></p>
          <p className={`ira-pz-linea__estado${puntua ? ' is-puntua' : ''}`} aria-live="polite">{estado}</p>
        </div>
      </div>

      <div className="ira-pz-linea__marcas">
        <fieldset>
          <legend><span className="ira-pz-linea__leyenda ira-pz--cierre">{ui.cierres}</span> {ui.cierresNota}</legend>
          <div className="ira-pz-linea__chips">{cierres.map((m) => chip(m, 'cierre'))}</div>
        </fieldset>
        <fieldset>
          <legend><span className="ira-pz-linea__leyenda ira-pz--apertura">{ui.aperturas}</span> {ui.aperturasNota}</legend>
          <div className="ira-pz-linea__chips">{aperturas.map((m) => chip(m, 'apertura'))}</div>
        </fieldset>
      </div>

      <div className="ira-pz-linea__pie">
        <p className="ira-pz-linea__ultima">
          <span className="ira-pz-linea__rotulo">{ui.ultima}</span>
          <span className={`ira-cifra ira-pz--${u[0].startsWith('C') ? 'cierre' : 'apertura'}`}>{u[0]}</span>
          <strong>{u[1]}</strong>
          <em>{u[2]}</em>
        </p>
        <p className="ira-met__nota">{ui.referencia}</p>
      </div>
    </div>
  );
}
