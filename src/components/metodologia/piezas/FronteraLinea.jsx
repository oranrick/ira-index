// IRA · Metodología 2.0 · P1 · Permeabilidad: la frontera como una sola línea.
// Entre el nosotros y el otro hay una línea vertical. Cada cierre activado la hace más
// maciza; cada apertura le abre un hueco por el que pasa la luz. La permeabilidad se
// recalcula con la regla de sucesión de Laplace: 10 × (A + 1) / (A + C + 2).
import { useEffect, useRef, useState } from 'react';
import { ESCALA, colorCifra, formatearPuntuacion, nivel } from '../../../lib/escala';
import { NumeroAnimado, chispazo } from '../Juego.jsx';

const INICIAL = ['C1', 'A3', 'C5'];

export default function FronteraLinea({ cierres, aperturas, ui, lang }) {
  const [sel, setSel] = useState(INICIAL);
  const [ultima, setUltima] = useState('C5');

  const todas = Object.fromEntries([...cierres, ...aperturas].map((m) => [m[0], m]));
  const toggle = (codigo, ev) => {
    const quita = sel.includes(codigo);
    if (!quita) chispazo(ev, codigo.startsWith('C') ? 'rojo' : 'salvia', 8);
    setSel((s) => (s.includes(codigo) ? s.filter((c) => c !== codigo) : [...s, codigo]));
    setUltima(codigo);
  };
  // Al azar: entre 3 y 6 marcas sueltas, para jugar con la fórmula
  const azar = (ev) => {
    const todosCod = [...cierres, ...aperturas].map((m) => m[0]);
    const k = 3 + Math.floor(Math.random() * 4);
    const mezcla = [...todosCod].sort(() => Math.random() - 0.5).slice(0, k);
    chispazo(ev, 'oro', 10);
    setSel(mezcla);
    setUltima(mezcla[mezcla.length - 1]);
  };

  const C = sel.filter((c) => c.startsWith('C')).length;
  const A = sel.length - C;
  const n = A + C;
  const perm = (10 * (A + 1)) / (A + C + 2);
  const puntua = n >= 3;
  const idx = nivel(perm);
  const estado = n === 0 ? ui.sinEventos : puntua ? ui.puntua(n) : ui.pocos(n);
  const u = todas[ultima] ?? todas.C5;
  // Con permeabilidad alta (y suficientes eventos) el otro cruza la línea y pasa a ser de dentro
  const cruza = puntua && perm >= 7.5;
  const otroX = n === 0 ? 88 : cruza ? 32 : 88 - perm * 3.2;
  const otroRef = useRef(null);
  const cruzaba = useRef(cruza);
  useEffect(() => {
    if (cruza !== cruzaba.current) {
      cruzaba.current = cruza;
      // al cruzar, destellos donde aterriza (cuando termina el viaje)
      const id = setTimeout(() => chispazo(otroRef.current?.firstChild, cruza ? 'salvia' : 'rojo', 10), cruza ? 650 : 50);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [cruza]);

  const chip = (m, tipo) => {
    const on = sel.includes(m[0]);
    return (
      <button
        key={m[0]}
        type="button"
        aria-pressed={on}
        onClick={(ev) => toggle(m[0], ev)}
        className={`ira-pz-linea__chip ira-pz--${tipo}${on ? ' is-on' : ''}`}
      >
        <span className="ira-pz-linea__chip-marca" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14">{on ? <polyline points="5 12.5 10 17 19 7" /> : <><line x1="12" y1="6" x2="12" y2="18" /><line x1="6" y1="12" x2="18" y2="12" /></>}</svg>
        </span>
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
        <span className="ira-pz-linea__acciones">
          <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto ira-pz-linea__azar" onClick={azar}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-pz-linea__dado"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="9" cy="9" r="1.3" /><circle cx="15" cy="15" r="1.3" /><circle cx="15" cy="9" r="1.3" /><circle cx="9" cy="15" r="1.3" /><circle cx="12" cy="12" r="1.3" /></svg>
            Al azar
          </button>
          <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto" onClick={() => setSel([])} disabled={n === 0}>{ui.vaciar}</button>
        </span>
      </div>

      <div className="ira-pz-linea__rejilla">
        <div className="ira-pz-linea__escena" aria-hidden="true" style={{ '--grosor': `${6 + C * 2}px` }}>
          <span className="ira-pz-linea__nosotros"><span className="ira-pz-linea__punto" />{ui.nosotros}</span>
          <span ref={otroRef} className={`ira-pz-linea__otro${cruza ? ' is-dentro' : ''}`} style={{ left: `${otroX}%`, opacity: n === 0 ? 0.4 : 1 }}><span className="ira-pz-linea__punto" />{ui.elOtro}</span>
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
            {n === 0 ? 'n/p' : <NumeroAnimado className="ira-pz-linea__num" valor={perm} formato={(v) => formatearPuntuacion(v, lang, 2)} />}<span>/10</span>
          </p>
          <span className="ira-pz-linea__escala" aria-hidden="true">
            {ESCALA.map((c, i) => <span key={c} className={n !== 0 && i <= idx ? 'is-on' : ''} style={{ background: c, opacity: n === 0 ? 0.15 : i <= idx ? 1 : 0.18, '--i': i }} />)}
          </span>
          <span className="ira-pz-linea__extremos" aria-hidden="true"><span>{ui.muro}</span><span>{ui.puerta}</span></span>
          <p className="ira-pz-linea__formula ira-cifra">10 × (A + 1) / (A + C + 2)<br /><span>= 10 × (<b key={`a${A}`} className="ira-pz-linea__var">{A}</b> + 1) / (<b key={`a2${A}`} className="ira-pz-linea__var">{A}</b> + <b key={`c${C}`} className="ira-pz-linea__var ira-pz-linea__var--c">{C}</b> + 2)</span></p>
          <p key={estado} className={`ira-pz-linea__estado${puntua ? ' is-puntua' : ''}`} aria-live="polite">{estado}</p>
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
