// IRA · la traza: cómo «suena» una puntuación.
// Con 10 es una onda lenta y amplia (salvia); con 0, rápida, quebrada y con picos (rojo).
// La misma traza dibuja la escala, cada discurso (una nota por frase o tramo) y cada político.
// Se «graba» de izquierda a derecha la primera vez que entra en pantalla y se repite al pasar
// el cursor si repetir = true. Con «reducir movimiento» se dibuja entera y quieta.
// Es decorativa: el componente que la usa siempre muestra la cifra al lado.
import { useEffect, useRef } from 'react';
import { ESCALA } from '../../lib/escala';

const quieto = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const RGB = ESCALA.map(hex);
export function colorTraza(s, alfa = 1) {
  const x = Math.max(0, Math.min(10, s)); const a = Math.floor(x); const b = Math.min(10, a + 1); const t = x - a;
  const c = RGB[a].map((v, i) => Math.round(v + (RGB[b][i] - v) * t));
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alfa})`;
}

// Ruido determinista y continuo (la misma semilla da siempre la misma traza)
function azar(semilla) {
  let h = 2166136261;
  for (const ch of String(semilla)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return h / 4294967296; };
}
function ruido(r, n = 512) {
  const v = Array.from({ length: n }, () => r() * 2 - 1);
  return (x) => {
    const i = Math.floor(x); const t = x - i; const s = t * t * (3 - 2 * t);
    return v[((i % n) + n) % n] * (1 - s) + v[(((i + 1) % n) + n) % n] * s;
  };
}
// Nota en cada punto, interpolada entre los centros de los tramos (sin escalones)
function notaEn(notas, x) {
  if (notas.length === 1) return notas[0];
  const p = x * notas.length - 0.5;
  const i = Math.max(0, Math.min(notas.length - 1, Math.floor(p)));
  const j = Math.min(notas.length - 1, i + 1);
  const t = Math.max(0, Math.min(1, p - i)); const s = t * t * (3 - 2 * t);
  return notas[i] * (1 - s) + notas[j] * s;
}

export function dibujarTraza(canvas, { notas = [5], escala = false, semilla = 'ira', hasta = 1, grosor = 2, periodo = [150, 18], base = true }) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth; const h = canvas.clientHeight;
  if (!w || !h) return;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  }
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  const rnd = azar(semilla); const fino = ruido(rnd); const lento = ruido(rnd);
  if (base) { c.strokeStyle = 'rgba(94, 116, 113, 0.3)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke(); }
  c.lineWidth = grosor; c.lineJoin = 'round'; c.lineCap = 'round';
  const amp = h / 2 - grosor - 1;
  let fase = rnd() * 6; let px = null; let py = null;
  const paso = 1.5;
  for (let X = 0; X <= w; X += paso) {
    const x = X / w;
    if (x > hasta) break;
    const nota = escala ? x * 10 : notaEn(notas, x);
    const tension = 1 - nota / 10;
    fase += (paso / (periodo[0] - tension * (periodo[0] - periodo[1]))) * Math.PI * 2;
    const onda = Math.sin(fase) * (0.62 + 0.38 * lento(X / 90));
    const quiebre = tension ** 1.4;
    const grano = fino(X / 3.2) * quiebre * 0.85;
    const pico = quiebre > 0.5 && fino(X / 7 + 50) > 0.72 ? (fino(X / 2 + 9) > 0 ? 1 : -1) * quiebre * 0.7 : 0;
    const y = h / 2 - Math.max(-1, Math.min(1, onda * (1 - quiebre * 0.35) + grano + pico)) * amp;
    if (px !== null) { c.strokeStyle = colorTraza(nota); c.beginPath(); c.moveTo(px, py); c.lineTo(X, y); c.stroke(); }
    px = X; py = y;
  }
}

/**
 * notas: una nota (número) o varias (una por frase o tramo); escala: de 0 a 10 a lo ancho.
 * alto: px; grosor: px; duracion: ms de la «grabación»; repetir: vuelve a grabar al pasar el cursor.
 * cabezal: muestra la línea de reproducción mientras graba; alTerminar: se llama al acabar.
 */
export default function Traza({
  notas, escala = false, semilla, alto = 56, grosor = 2, duracion = 1400, repetir = false,
  cabezal = false, alTerminar, vuelta = 0, className = '', periodo,
}) {
  const lienzo = useRef(null);
  const cab = useRef(null);
  const estado = useRef({ hasta: quieto() ? 1 : 0, raf: 0, visto: false });
  const lista = notas == null ? [5] : Array.isArray(notas) ? notas : [notas];
  const clave = `${escala}|${lista.join(',')}|${semilla}|${grosor}`;
  const opciones = useRef(null);
  opciones.current = { notas: lista, escala, semilla: semilla ?? clave, grosor, periodo: periodo ?? [150, 18] };
  const terminar = useRef(alTerminar);
  terminar.current = alTerminar;

  const pintar = () => {
    const e = estado.current;
    if (lienzo.current) dibujarTraza(lienzo.current, { ...opciones.current, hasta: e.hasta });
    if (cab.current) {
      cab.current.style.left = `${e.hasta * 100}%`;
      cab.current.style.opacity = cabezal && e.hasta > 0 && e.hasta < 1 ? '1' : '0';
    }
  };
  const grabar = (ms = duracion) => {
    const e = estado.current;
    cancelAnimationFrame(e.raf);
    if (quieto()) { e.hasta = 1; pintar(); terminar.current?.(); return; }
    const t0 = performance.now();
    const paso = (ahora) => {
      e.hasta = Math.min(1, (ahora - t0) / ms);
      pintar();
      if (e.hasta < 1) e.raf = requestAnimationFrame(paso); else terminar.current?.();
    };
    e.raf = requestAnimationFrame(paso);
  };

  // Primera grabación al entrar en pantalla
  useEffect(() => {
    const nodo = lienzo.current;
    pintar();
    if (!nodo) return undefined;
    if (typeof IntersectionObserver === 'undefined') { estado.current.hasta = 1; pintar(); return undefined; }
    const obs = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !estado.current.visto) { estado.current.visto = true; grabar(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(nodo);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => pintar()) : null;
    ro?.observe(nodo);
    return () => { obs.disconnect(); ro?.disconnect(); cancelAnimationFrame(estado.current.raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si cambian los datos (otro discurso, otro orden) o se pide otra vuelta, se graba de nuevo
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) { primera.current = false; return; }
    if (estado.current.visto) grabar(Math.min(duracion, 1100)); else pintar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, vuelta]);

  return (
    <span
      className={`ira-traza ${className}`}
      style={{ height: alto }}
      aria-hidden="true"
      onMouseEnter={repetir ? () => grabar(Math.min(duracion, 800)) : undefined}
    >
      <canvas ref={lienzo} />
      {cabezal && <span ref={cab} className="ira-traza__cabezal" />}
    </span>
  );
}
