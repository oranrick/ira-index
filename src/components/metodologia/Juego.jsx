// IRA · Metodología 2.0 · piezas de juego compartidas por P1 y P2.
// Chispazos (destellos de cuatro puntas que saltan al elegir algo, los mismos de la portada),
// chispas que titilan alrededor de lo elegido, recorrido automático con barra de progreso,
// cifras que cuentan hasta su valor y control segmentado con pastilla deslizante.
// Todo el movimiento se apaga con prefers-reduced-motion. Nada de esto calcula IRA.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Estrella from '../ui/Estrella.jsx';

export const quieto = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Colores de los destellos: [relleno, brillo] (los de la portada, más oro y neutro)
export const TONOS = {
  salvia: ['#B9D2AC', '#8DAA7E'],
  rojo: ['#E8604A', '#BE281A'],
  oro: ['#F4CF7A', '#DCB149'],
  neutra: ['#D5DEDE', '#7C8F8F'],
  alcance: ['#A9C6EC', '#7FA7D9'],
  interpelacion: ['#CDBDEB', '#B39DDB'],
  permeabilidad: ['#9EDFE2', '#5FC4C9'],
};

// Traduce los nombres de tono que usan las piezas a un tono de destello
export function tonoDe(clave) {
  if (!clave) return 'oro';
  if (TONOS[clave]) return clave;
  if (/^(incl|inclusivo|apertura|empatica|si|dentro|umbral|grupo)$/.test(clave)) return 'salvia';
  if (/^(cierre|contra|polariza|no|muro|expulsion|retirada)$/.test(clave)) return 'rojo';
  if (/^(neutra|tenue|situacional)$/.test(clave)) return 'neutra';
  return 'oro';
}

const PUNTA = 'M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z';

/** Lanza un estallido de destellos desde un punto (evento de puntero) o desde el centro de un nodo. */
export function chispazo(origen, tono = 'oro', cantidad = 9) {
  if (typeof document === 'undefined' || quieto()) return;
  let x; let y;
  if (origen && 'clientX' in origen && (origen.clientX || origen.clientY)) { x = origen.clientX; y = origen.clientY; }
  else {
    const nodo = origen?.currentTarget ?? origen?.target ?? origen;
    const r = nodo?.getBoundingClientRect?.();
    if (!r) return;
    x = r.left + r.width / 2; y = r.top + r.height / 2;
  }
  const [relleno, brillo] = TONOS[tonoDe(tono)];
  const capa = document.createElement('div');
  capa.className = 'ira-chispazo';
  capa.setAttribute('aria-hidden', 'true');
  capa.style.left = `${x}px`;
  capa.style.top = `${y}px`;
  const giro = Math.random() * Math.PI * 2;
  for (let k = 0; k < cantidad; k++) {
    const ang = giro + (k / cantidad) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 26 + Math.random() * 34;
    const tam = 7 + Math.random() * 8;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', String(tam));
    s.setAttribute('height', String(tam));
    s.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
    s.style.setProperty('--giro', `${(Math.random() - 0.5) * 180}deg`);
    s.style.animationDelay = `${Math.random() * 60}ms`;
    s.style.fill = relleno;
    s.style.filter = `drop-shadow(0 0 4px ${brillo})`;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', PUNTA);
    s.appendChild(p);
    capa.appendChild(s);
  }
  // un anillo que se abre, como las ondas del fondo
  const onda = document.createElement('span');
  onda.className = 'ira-chispazo__onda';
  onda.style.borderColor = brillo;
  capa.appendChild(onda);
  document.body.appendChild(capa);
  setTimeout(() => capa.remove(), 950);
}

/** Destellos que titilan alrededor de un bloque (el padre debe tener position: relative).
 *  Posiciones fijas para cada «semilla», repartidas por los bordes, como en la portada. */
export function Chispas({ tono = 'oro', semilla = '', cantidad = 3, tamano = [7, 12] }) {
  let h = 2166136261;
  const s = String(semilla) || 'ira';
  for (let k = 0; k < s.length; k++) h = Math.imul(h ^ s.charCodeAt(k), 16777619) >>> 0;
  const azar = () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return h / 4294967296; };
  const [relleno, brillo] = TONOS[tonoDe(tono)];
  const bordes = ['arriba', 'derecha', 'abajo', 'izquierda'];
  return (
    <span className="ira-chispas" aria-hidden="true">
      {Array.from({ length: cantidad }, (_, k) => {
        const borde = bordes[(k + Math.floor(azar() * 4)) % 4];
        const a = Math.round(8 + azar() * 84);
        const pos = borde === 'arriba' ? { left: `${a}%`, top: '-6px' }
          : borde === 'abajo' ? { left: `${a}%`, top: 'calc(100% - 5px)' }
            : borde === 'izquierda' ? { left: '-6px', top: `${a}%` }
              : { left: 'calc(100% - 5px)', top: `${a}%` };
        const t = Math.round(tamano[0] + azar() * (tamano[1] - tamano[0]));
        return (
          <Estrella key={k} color={relleno} brillo={brillo} titila tamano={t} className="ira-chispas__una"
            style={{ ...pos, animationDelay: `${(-azar() * 2.4).toFixed(2)}s` }} />
        );
      })}
    </span>
  );
}

/** Cifra que cuenta desde su valor anterior hasta el nuevo. */
export function NumeroAnimado({ valor, formato = (v) => String(Math.round(v)), duracion = 650, className = '', style }) {
  const [mostrado, setMostrado] = useState(valor);
  const desde = useRef(valor);
  useEffect(() => {
    if (quieto() || typeof valor !== 'number' || typeof desde.current !== 'number') { setMostrado(valor); desde.current = valor; return undefined; }
    const v0 = desde.current;
    const t0 = performance.now();
    let id;
    const paso = (t) => {
      const u = Math.min(1, (t - t0) / duracion);
      const e = 1 - (1 - u) ** 3;
      setMostrado(v0 + (valor - v0) * e);
      if (u < 1) id = requestAnimationFrame(paso);
      else desde.current = valor;
    };
    id = requestAnimationFrame(paso);
    return () => { cancelAnimationFrame(id); desde.current = valor; };
  }, [valor, duracion]);
  return <span className={className} style={style}>{typeof mostrado === 'number' ? formato(mostrado) : mostrado}</span>;
}

/** Cuenta desde 0 cuando el bloque entra en pantalla. */
export function CifraAlVer({ valor, formato, className = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(quieto() ? valor : 0);
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') { setV(valor); return undefined; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(valor); obs.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [valor]);
  return <span ref={ref}><NumeroAnimado valor={v} formato={formato} className={className} duracion={1100} /></span>;
}

/** Recorrido automático por los ejemplos de una pieza. Se pausa fuera de pantalla y con la
 *  pestaña oculta; cualquier elección manual lo detiene. */
export function useRecorrido(n, avanzar, ms = 3600) {
  const [jugando, setJugando] = useState(false);
  const [vuelta, setVuelta] = useState(0); // reinicia la barra de progreso en cada paso
  const [visto, setVisto] = useState(false); // primera vez a la vista: arrancan las entradas
  const ref = useRef(null);
  const visible = useRef(true);
  const avanzarRef = useRef(avanzar);
  avanzarRef.current = avanzar;

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') { setVisto(true); return undefined; }
    const obs = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) setVisto(true);
      else setJugando(false);
    }, { threshold: 0.15 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!jugando || n < 2) return undefined;
    const id = setTimeout(() => {
      if (document.hidden || !visible.current) { setJugando(false); return; }
      avanzarRef.current();
      setVuelta((v) => v + 1);
    }, ms);
    return () => clearTimeout(id);
  }, [jugando, vuelta, n, ms]);

  // Al pulsar «Recorrer» se avanza ya, para que el botón responda al momento
  const alternar = useCallback(() => {
    if (!jugando) { avanzarRef.current(); setVuelta((v) => v + 1); }
    setJugando(!jugando);
  }, [jugando]);
  const parar = useCallback(() => setJugando(false), []);
  return { jugando, alternar, parar, vuelta, ref, ms, visto };
}

function IcoFlecha({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-juego__ico">
      {dir === 'izq' ? <polyline points="15 6 9 12 15 18" /> : <polyline points="9 6 15 12 9 18" />}
    </svg>
  );
}

/** Mando del recorrido: anterior · reproducir/pausa · siguiente, con puntos y contador. */
export function Mando({ i, n, ir, recorrido, tono = 'oro', etiqueta = 'Ejemplos', textos = {} }) {
  const tx = { anterior: 'Anterior', siguiente: 'Siguiente', recorrer: 'Recorrer', pausa: 'Pausa', ir: (k) => `Ir al ${k}`, ...textos };
  const manual = (k) => { recorrido?.parar(); ir(k); };
  return (
    <div className={`ira-juego-mando ira-juego--${tonoDe(tono)}`} role="group" aria-label={etiqueta}>
      <button type="button" className="ira-juego-mando__boton" onClick={() => manual(i - 1)} aria-label={tx.anterior}><IcoFlecha dir="izq" /></button>
      {recorrido && (
        <button type="button" className={`ira-juego-mando__play${recorrido.jugando ? ' is-jugando' : ''}`} onClick={recorrido.alternar} aria-pressed={recorrido.jugando}>
          <span className="ira-juego-mando__play-ico" aria-hidden="true">
            {recorrido.jugando
              ? <svg viewBox="0 0 24 24" width="14" height="14"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              : <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 4.5v15l12.5-7.5z" /></svg>}
          </span>
          <span>{recorrido.jugando ? tx.pausa : tx.recorrer}</span>
          {recorrido.jugando && <span key={recorrido.vuelta} className="ira-juego-mando__progreso" style={{ animationDuration: `${recorrido.ms}ms` }} aria-hidden="true" />}
        </button>
      )}
      <button type="button" className="ira-juego-mando__boton" onClick={() => manual(i + 1)} aria-label={tx.siguiente}><IcoFlecha dir="der" /></button>
      {n <= 9 ? (
        <span className="ira-juego-mando__puntos" aria-hidden="true">
          {Array.from({ length: n }, (_, k) => (
            <span key={k} className={k === i ? 'is-activo' : k < i ? 'is-visto' : ''} />
          ))}
        </span>
      ) : (
        <span className="ira-juego-mando__pista" aria-hidden="true"><span style={{ width: `${((i + 1) / n) * 100}%` }} /></span>
      )}
      <span className="ira-juego-mando__cuenta ira-cifra" aria-live="off">{i + 1}<span>/{n}</span></span>
    </div>
  );
}

/** Control segmentado con pastilla deslizante (radiogroup accesible). */
export function Segmentado({ opciones, valor, onCambio, etiqueta, className = '' }) {
  const refs = useRef([]);
  const caja = useRef(null);
  const [pastilla, setPastilla] = useState(null);
  const idx = opciones.findIndex((o) => o.id === valor); // -1: aún sin elegir

  const medir = useCallback(() => {
    if (idx < 0) { setPastilla(null); return; }
    const b = refs.current[idx];
    if (!b || !caja.current) return;
    setPastilla({ left: b.offsetLeft, width: b.offsetWidth, top: b.offsetTop, height: b.offsetHeight });
  }, [idx]);
  useLayoutEffect(medir, [medir, opciones.length]);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !caja.current) return undefined;
    const ro = new ResizeObserver(medir);
    ro.observe(caja.current);
    return () => ro.disconnect();
  }, [medir]);

  const elegir = (k, ev) => {
    const o = opciones[(k + opciones.length) % opciones.length];
    if (o.id !== valor) chispazo(ev ?? refs.current[(k + opciones.length) % opciones.length], o.tono, 7);
    onCambio(o.id);
  };
  const onKey = (ev, k) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { ev.preventDefault(); elegir(k + 1); refs.current[(k + 1) % opciones.length]?.focus(); }
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') { ev.preventDefault(); elegir(k - 1); refs.current[(k - 1 + opciones.length) % opciones.length]?.focus(); }
  };
  const actual = idx >= 0 ? opciones[idx] : null;
  return (
    <div ref={caja} role="radiogroup" aria-label={etiqueta} className={`ira-juego-seg ira-juego--${tonoDe(actual?.tono)}${actual ? '' : ' is-vacio'} ${className}`}>
      {pastilla && <span className="ira-juego-seg__pastilla" style={pastilla} aria-hidden="true" />}
      {opciones.map((o, k) => (
        <button
          key={o.id}
          ref={(el) => { refs.current[k] = el; }}
          type="button"
          role="radio"
          aria-checked={o.id === valor}
          tabIndex={o.id === valor || (idx < 0 && k === 0) ? 0 : -1}
          onClick={(ev) => elegir(k, ev)}
          onKeyDown={(ev) => onKey(ev, k)}
          className={`ira-juego-seg__opcion ira-juego--${tonoDe(o.tono)}${o.id === valor ? ' is-on' : ''}`}
        >
          {o.contenido ?? o.nombre}
        </button>
      ))}
    </div>
  );
}

/** Pista de teclado discreta (solo en pantallas con puntero fino). */
export function PistaTeclas({ texto = 'También con las flechas del teclado' }) {
  return (
    <p className="ira-juego-pista" aria-hidden="true">
      <kbd>↑</kbd><kbd>↓</kbd> <span>{texto}</span>
    </p>
  );
}

/** [ref, visto]: visto pasa a true la primera vez que el bloque entra en pantalla
 *  (para que las animaciones de entrada no se gasten fuera de la vista). */
export function useAlVer(margen = '0px 0px -15% 0px') {
  const ref = useRef(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') { setVisto(true); return undefined; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisto(true); obs.disconnect(); } }, { rootMargin: margen });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [margen]);
  return [ref, visto];
}
