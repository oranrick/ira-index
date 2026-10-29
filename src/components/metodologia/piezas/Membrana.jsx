// IRA · Metodología 2.0 · P1 · La frontera como membrana viva.
// El nosotros es una membrana, no un aro: blanda y porosa cuando es puerta, dura y de
// ladrillo cuando es muro. Cada frase pone en marcha un pequeño guion:
//   puerta (dentro)  el otro se acerca, la membrana se abre, lo deja pasar y el grupo le hace sitio
//   umbral           la membrana se entreabre y el otro se queda en el hueco, esperando
//   muro             la membrana se endurece; el otro choca, la abolla y rebota fuera
//   expulsión        el otro era de dentro; la membrana lo escupe hasta la periferia y se sella
//   excepción        solo crece un escudo frente a la conducta; el resto sigue blando
//   grupo            no hay nadie fuera: la membrana respira y el nosotros brilla
// Tocar la membrana la hace vibrar y suelta destellos. Con «reducir movimiento» se dibuja
// directamente el estado final, sin bucle. Decorativo: el texto de la ficha lo explica.
import { useEffect, useId, useRef, useState } from 'react';
import { chispazo, quieto } from '../Juego.jsx';

const R = 29.4;                      // radio de la membrana (lienzo 100 × 100)
const PHI = -Math.PI / 6;            // dirección por la que llega el otro (arriba a la derecha)
const ORBITA = 14.5;                 // radio del grupo que gira dentro
const GIRO = (2 * Math.PI) / 18000;  // una vuelta cada 18 s
const PERIFERIA = 46.5;

const SALVIA = [141, 170, 126];
const ROJO = [190, 40, 26];
const BLANCO = [252, 253, 255];
const ROJO_CLARO = [232, 96, 74];
const ORO = [220, 177, 73];

const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
const lerp = (a, b, t) => a + (b - a) * t;
const punto = (d, a = PHI) => [50 + d * Math.cos(a), 50 + d * Math.sin(a)];
const dif = (a, b) => { let d = (a - b) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; return d; };

// Curvas de tiempo
const EASE = {
  lineal: (t) => t,
  suave: (t) => t * t * (3 - 2 * t),
  sale: (t) => 1 - (1 - t) ** 3,
  entra: (t) => t * t * t,
  rebota: (t) => { const c = 1.9; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; }, // se pasa y vuelve
  muelle: (t) => 1 - Math.cos(t * Math.PI * 3.2) * Math.exp(-5.2 * t),
};

const INICIAL = {
  od: 44, oa: 1, os: 1, oc: 0,          // el otro: distancia al centro, opacidad, escala, color (-1 rojo · 0 blanco · 1 salvia)
  une: 0,                                // 0 suelto · 1 girando con el grupo
  rojo: 0, grosor: 1.6, ladrillo: 0,     // la membrana: color, grosor y juntas de ladrillo
  hueco: 0, bulto: 0, temblor: 0.6,      // apertura (rad), abolladura junto al otro, vibración libre
  escudo: 0, halo: 0, peri: 0,           // escudo dorado, brillo del nosotros, periferia roja
};

const BLANDA = { rojo: 0, grosor: 1.6, ladrillo: 0, escudo: 0, peri: 0 };

// Guiones: pasos encadenados. Cada paso va del estado actual a «a» en «ms» con su curva.
// «chispa» lanza destellos donde está el otro al empezar el paso.
const GUIONES = {
  dentro: [
    { ms: 420, ease: 'sale', a: { ...BLANDA, od: R + 7, oa: 1, os: 1, oc: 0, une: 0, hueco: 0, bulto: 0, temblor: 0.5, halo: 0 } },
    { ms: 460, ease: 'rebota', a: { hueco: 1.2, bulto: 4.2, od: R + 1.5 } },
    { ms: 260, ease: 'suave', a: { od: R } },
    { ms: 520, ease: 'suave', a: { od: R - 9, oc: 1 }, chispa: 'salvia' },
    { ms: 420, ease: 'muelle', a: { hueco: 0, bulto: 0 } },
    { ms: 900, ease: 'suave', a: { une: 1, halo: 1, os: 0.58 }, onda: 'salvia' },
    { ms: 700, ease: 'suave', a: { halo: 0.35 } },
  ],
  umbral: [
    { ms: 420, ease: 'sale', a: { ...BLANDA, od: R + 8, oa: 1, os: 1, oc: 0, une: 0, hueco: 0, bulto: 0, temblor: 0.5, halo: 0 } },
    { ms: 520, ease: 'rebota', a: { hueco: 0.52, od: R + 0.5, oc: 0.35 }, chispa: 'oro' },
    { ms: 400, ease: 'suave', a: { bulto: -1.2 } },
  ],
  muro: [
    { ms: 420, ease: 'sale', a: { une: 0, od: 44, oa: 1, os: 1, oc: 0, hueco: 0, halo: 0, escudo: 0, peri: 0 } },
    { ms: 560, ease: 'suave', a: { rojo: 1, grosor: 3.8, ladrillo: 1, temblor: 0, bulto: 0 } },
    { ms: 360, ease: 'entra', a: { od: R + 4.2 } },
    { ms: 160, ease: 'sale', a: { bulto: -5, oc: -0.5 }, chispa: 'rojo', golpe: true },
    { ms: 640, ease: 'rebota', a: { od: 44, bulto: 0, oc: 0 } },
  ],
  expulsion: [
    { ms: 520, ease: 'suave', a: { ...BLANDA, une: 1, oa: 1, os: 1, oc: 1, hueco: 0, bulto: 0, temblor: 0.4, halo: 0.3 } },
    { ms: 380, ease: 'suave', a: { une: 0, od: R - 6, hueco: 0.7, rojo: 0.6, grosor: 2.4, oc: -0.4, halo: 0 } },
    { ms: 420, ease: 'sale', a: { od: PERIFERIA + 1, oc: -1, peri: 1, os: 0.85 }, chispa: 'rojo' },
    { ms: 380, ease: 'muelle', a: { hueco: 0, rojo: 1, grosor: 3.8, ladrillo: 1, temblor: 0 } },
  ],
  excepcion: [
    { ms: 420, ease: 'sale', a: { ...BLANDA, une: 0, od: R + 9.5, oa: 1, os: 1, oc: 0, hueco: 0, bulto: 0, temblor: 0.7, halo: 0 } },
    { ms: 560, ease: 'rebota', a: { escudo: 1, bulto: -1.6, od: R + 13 }, chispa: 'oro', golpe: true },
  ],
  grupo: [
    { ms: 520, ease: 'suave', a: { ...BLANDA, une: 0, hueco: 0, bulto: 0, oa: 0, os: 0.3, temblor: 1, od: 44, oc: 0 } },
    { ms: 800, ease: 'suave', a: { halo: 1 } },
  ],
};

// Estado final de un guion (para «reducir movimiento» y para el primer dibujo)
function final(modo, desde = INICIAL) {
  return GUIONES[modo].reduce((e, paso) => ({ ...e, ...paso.a }), { ...desde });
}

// Movimiento en reposo, encima del estado: pequeño y propio de cada modo
function reposo(modo, t) {
  const r = { od: 0, hueco: 0, bulto: 0, radio: 0 };
  if (modo === 'umbral') { r.od = Math.sin(t / 380) * 1.4; r.hueco = Math.sin(t / 380) * 0.05; }
  if (modo === 'grupo') r.radio = Math.sin(t / 700) * 1.1;
  if (modo === 'muro') {
    // cada 3,4 s el otro vuelve a tocar el muro y rebota
    const p = (t % 3400) / 3400;
    if (p < 0.16) { const k = Math.sin((p / 0.16) * Math.PI); r.od = -3.6 * k; r.bulto = -1.4 * Math.max(0, k - 0.6) * 2.5; }
  }
  if (modo === 'excepcion') r.od = Math.sin(t / 900) * 0.8;
  return r;
}

// vuelta: al cambiar, el otro vuelve a empezar desde fuera (para repetir el guion en bucle)
// rotulos: false en las versiones pequeñas (emblema, ilustraciones)
export default function Membrana({ modo, etiquetas = {}, vuelta = 0, rotulos = true, className = '' }) {
  const svg = useRef(null);
  const uid = useId().replace(/:/g, '');
  const ID = { dentro: `mem-dentro-${uid}`, luz: `mem-luz-${uid}`, difumina: `mem-dif-${uid}` };
  const estado = useRef(final(modo));
  const guion = useRef(null);
  const toques = useRef([]);
  const golpes = useRef([]);   // ondas que salen del punto de choque
  const ondas = useRef([]);    // ondas de bienvenida desde el centro
  const estela = useRef([]);   // últimas posiciones del otro, para dibujar su rastro
  const visible = useRef(true);
  const [, setCuadro] = useState(0);
  const reloj = useRef(0);

  // Al cambiar de modo, el guion arranca desde donde está todo ahora mismo
  const vueltaPrevia = useRef(vuelta);
  useEffect(() => {
    if (quieto()) { estado.current = final(modo, estado.current); setCuadro((c) => c + 1); return; }
    if (vuelta !== vueltaPrevia.current) {
      // nueva vuelta: el otro reaparece fuera, sin cruzar de vuelta por la membrana
      vueltaPrevia.current = vuelta;
      estado.current = { ...estado.current, une: 0, od: 46, oa: 0, os: 1, oc: 0 };
      estela.current = [];
    }
    guion.current = { pasos: GUIONES[modo], i: -1, t0: 0, desde: null };
  }, [modo, vuelta]);

  useEffect(() => {
    if (quieto()) return undefined;
    let id;
    const obs = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0 }) : null;
    if (obs && svg.current) obs.observe(svg.current);
    const bucle = (ahora) => {
      reloj.current = ahora;
      const g = guion.current;
      if (g) {
        if (g.i === -1 || ahora - g.t0 >= g.pasos[g.i].ms) {
          if (g.i >= 0) estado.current = { ...estado.current, ...g.pasos[g.i].a };
          g.i += 1;
          if (g.i >= g.pasos.length) guion.current = null;
          else {
            g.t0 = ahora; g.desde = { ...estado.current };
            const p = g.pasos[g.i];
            if (p.chispa) lanzar(p.chispa);
            if (p.golpe) golpes.current.push({ t0: ahora, tono: p.chispa });
            if (p.onda) ondas.current.push({ t0: ahora + 500, tono: p.onda });
          }
        }
        const gg = guion.current;
        if (gg) {
          const p = gg.pasos[gg.i];
          const u = EASE[p.ease](Math.min(1, (ahora - gg.t0) / p.ms));
          const e = { ...gg.desde };
          Object.entries(p.a).forEach(([k, v]) => { e[k] = lerp(gg.desde[k], v, u); });
          estado.current = e;
        }
      }
      toques.current = toques.current.filter((x) => ahora - x.t0 < 1400);
      golpes.current = golpes.current.filter((x) => ahora - x.t0 < 900);
      ondas.current = ondas.current.filter((x) => ahora - x.t0 < 1200);
      const [ex, ey] = posOtro(estado.current, ahora);
      const ult = estela.current[estela.current.length - 1];
      if (!ult || Math.hypot(ult[0] - ex, ult[1] - ey) > 0.6) estela.current.push([ex, ey, ahora]);
      estela.current = estela.current.filter((x) => ahora - x[2] < 420).slice(-14);
      if (visible.current && !document.hidden) setCuadro((c) => (c + 1) % 1e6);
      id = requestAnimationFrame(bucle);
    };
    id = requestAnimationFrame(bucle);
    return () => { cancelAnimationFrame(id); obs?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Destellos en la posición del otro (o en un punto del lienzo), en coordenadas de pantalla
  const aPantalla = (x, y) => {
    const m = svg.current?.getScreenCTM?.();
    if (!m) return null;
    return { clientX: m.a * x + m.c * y + m.e, clientY: m.b * x + m.d * y + m.f };
  };
  const lanzar = (tono, x, y) => {
    if (!visible.current) return;
    const e = estado.current;
    const [px, py] = x == null ? posOtro(e, reloj.current) : [x, y];
    const p = aPantalla(px, py);
    if (p) chispazo(p, tono, 9);
  };

  // Tocar la membrana: vibra donde la tocas y suelta destellos
  const tocar = (ev) => {
    const m = svg.current?.getScreenCTM?.();
    if (!m) return;
    const inv = m.inverse();
    const x = inv.a * ev.clientX + inv.c * ev.clientY + inv.e;
    const y = inv.b * ev.clientX + inv.d * ev.clientY + inv.f;
    const ang = Math.atan2(y - 50, x - 50);
    toques.current.push({ ang, t0: reloj.current || performance.now() });
    const e = estado.current;
    chispazo(ev, e.rojo > 0.5 ? 'rojo' : e.escudo > 0.5 ? 'oro' : 'salvia', 9);
  };

  const t = reloj.current || 0;
  const e = estado.current;
  const rep = quieto() ? { od: 0, hueco: 0, bulto: 0, radio: 0 } : reposo(modo, t);
  const hueco = Math.max(0, e.hueco + rep.hueco);
  const bulto = e.bulto + rep.bulto;

  // La membrana: una curva polar con vibración, abolladura y los toques
  const radio = (a) => {
    const d = dif(a, PHI);
    // la abolladura se ensancha con el hueco: con la puerta abierta, sus bordes se curvan hacia
    // fuera como unos brazos que reciben
    const sigma = 0.32 + hueco * 0.5;
    let r = R + rep.radio + bulto * Math.exp(-((d / sigma) ** 2));
    if (!quieto()) r += e.temblor * (0.6 * Math.sin(3 * a + t / 620) + 0.4 * Math.sin(5 * a - t / 900));
    toques.current.forEach((x) => {
      const s = (t - x.t0);
      const dd = dif(a, x.ang);
      r += 4.2 * Math.exp(-((dd / 0.36) ** 2)) * Math.exp(-s / 520) * Math.cos(s / 70) * (1 - e.ladrillo * 0.75);
    });
    return r;
  };
  const pasos = 140;
  const ini = PHI + hueco / 2;
  const fin = PHI + 2 * Math.PI - hueco / 2;
  let d = '';
  for (let k = 0; k <= pasos; k++) {
    const a = ini + ((fin - ini) * k) / pasos;
    const r = radio(a);
    d += `${k ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
  }
  if (hueco < 0.01) d += 'Z';
  const largo = (fin - ini) * R;
  const piezas = 26;
  const junta = 1.5 * e.ladrillo;
  const colorMembrana = mezcla(SALVIA, ROJO, e.rojo);
  const [ox, oy] = posOtro({ ...e, od: e.od + rep.od }, t);
  const colorOtro = e.oc >= 0 ? mezcla(BLANCO, [211, 228, 200], e.oc) : mezcla(BLANCO, ROJO_CLARO, -e.oc);

  // Grupo que gira dentro; si el otro se une, le hacen sitio (3 → 4 puestos)
  const plazas = 3 + e.une;
  const grupo = [0, 1, 2].map((i) => {
    const a = -Math.PI / 2 + t * GIRO + (i * 2 * Math.PI) / plazas;
    return [50 + ORBITA * Math.cos(a), 50 + ORBITA * Math.sin(a)];
  });

  // Escudo: arco dorado solo frente al otro
  const media = 0.5 * e.escudo;
  const re = R + 3.4;
  const escudo = e.escudo > 0.02
    ? `M${(50 + re * Math.cos(PHI - media)).toFixed(2)} ${(50 + re * Math.sin(PHI - media)).toFixed(2)} A${re} ${re} 0 0 1 ${(50 + re * Math.cos(PHI + media)).toFixed(2)} ${(50 + re * Math.sin(PHI + media)).toFixed(2)}`
    : null;

  return (
    <div className={`ira-pz-membrana ${className}`} aria-hidden="true">
      <svg ref={svg} viewBox="0 0 100 100" className="ira-pz-membrana__lienzo" onClick={tocar}>
        <defs>
          <radialGradient id={ID.dentro}>
            <stop offset="0" stopColor={rgb(SALVIA, 0.18 + 0.12 * e.halo)} />
            <stop offset="1" stopColor={rgb(SALVIA, 0)} />
          </radialGradient>
          <radialGradient id={ID.luz} gradientUnits="userSpaceOnUse" cx="50" cy="50" r={R + 17}>
            <stop offset={(R - 3) / (R + 17)} stopColor="rgba(211, 228, 200, 0.3)" />
            <stop offset="1" stopColor="rgba(141, 170, 126, 0)" />
          </radialGradient>
          <filter id={ID.difumina} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6" /></filter>
        </defs>
        {/* periferia */}
        <circle cx="50" cy="50" r={PERIFERIA} className="ira-pz-membrana__periferia"
          style={{ stroke: rgb(mezcla([42, 71, 71], ROJO, e.peri), 0.5 + 0.4 * e.peri) }} />
        {rotulos && <text x="50" y="7.6" className="ira-pz-membrana__rotulo">{etiquetas.periferia}</text>}
        {/* el interior del nosotros */}
        <circle cx="50" cy="50" r={R + 4} fill={`url(#${ID.dentro})`} />
        {/* luz que entra por el hueco */}
        {hueco > 0.04 && (() => {
          // un abanico de luz que sale por la puerta: el calor de dentro se asoma fuera
          const a1 = PHI - hueco / 2; const a2 = PHI + hueco / 2;
          const b1 = PHI - hueco / 2 - 0.22; const b2 = PHI + hueco / 2 + 0.22;
          const r1 = R - 3; const r2 = R + 17;
          const p = (r, a) => `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
          return <path d={`M${p(r1, a1)} L${p(r2, b1)} A${r2} ${r2} 0 0 1 ${p(r2, b2)} L${p(r1, a2)} Z`} fill={`url(#${ID.luz})`} filter={`url(#${ID.difumina})`} opacity={Math.min(1, hueco * 1.5)} />;
        })()}
        {/* la membrana */}
        <path
          d={d}
          className="ira-pz-membrana__borde"
          style={{
            stroke: rgb(colorMembrana),
            strokeWidth: e.grosor,
            strokeLinecap: e.ladrillo > 0.3 ? 'butt' : 'round',
            strokeDasharray: e.ladrillo > 0.02 ? `${(largo / piezas - junta).toFixed(2)} ${junta.toFixed(2)}` : 'none',
            filter: `drop-shadow(0 0 ${(1.2 + e.rojo * 1.6).toFixed(1)}px ${rgb(colorMembrana, 0.85)})`,
          }}
        />
        {escudo && <path d={escudo} className="ira-pz-membrana__escudo" style={{ strokeWidth: 3.2 * Math.min(1, e.escudo * 1.4) }} />}
        {/* el nosotros */}
        <circle cx="50" cy="50" r={9.5 + e.halo * 1.5} className="ira-pz-membrana__halo" style={{ opacity: 0.25 + e.halo * 0.35 }} />
        <circle cx="50" cy="50" r="6" className="ira-pz-membrana__centro"
          style={{ filter: `drop-shadow(0 0 ${(3 + e.halo * 5).toFixed(1)}px rgba(141, 170, 126, 0.9))` }} />
        {grupo.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.7" className="ira-pz-membrana__persona" />)}
        {rotulos && <text x="50" y="73" className="ira-pz-membrana__nosotros">{etiquetas.nosotros}</text>}
        {/* bienvenida: una onda sale del nosotros cuando el otro se une */}
        {ondas.current.map((o, i) => {
          const u = (t - o.t0) / 1200;
          if (u < 0) return null;
          return <circle key={`o${i}`} cx="50" cy="50" r={8 + u * (R - 6)} className="ira-pz-membrana__golpe"
            style={{ stroke: rgb([211, 228, 200], 0.8 * (1 - u)), strokeWidth: 1.6 * (1 - u) + 0.2 }} />;
        })}
        {/* rastro del otro cuando se mueve: una cola continua que se afina */}
        {e.oa > 0.2 && estela.current.slice(1).map(([x, y, t0], i) => {
          const [px, py] = estela.current[i];
          const vida = Math.max(0, 1 - (t - t0) / 420);
          return <line key={i} x1={px} y1={py} x2={x} y2={y} strokeLinecap="butt"
            style={{ stroke: rgb(colorOtro, 0.32 * vida * e.oa), strokeWidth: 3.6 * e.os * vida }} />;
        })}
        {/* onda de choque */}
        {golpes.current.map((g, i) => {
          const u = (t - g.t0) / 900;
          const [gx, gy] = punto(R + 1.5);
          return <circle key={`g${i}`} cx={gx} cy={gy} r={2 + u * 14} className="ira-pz-membrana__golpe"
            style={{ stroke: g.tono === 'oro' ? rgb(ORO, 1 - u) : rgb(ROJO_CLARO, 1 - u), strokeWidth: 1.4 * (1 - u) + 0.2 }} />;
        })}
        {/* vida en reposo: el otro llama a la puerta, el muro devuelve el golpe, el escudo brilla */}
        {!quieto() && !guion.current && (() => {
          if (modo === 'umbral') {
            const u = (t % 2400) / 1100;
            if (u > 1) return null;
            return <circle cx={ox} cy={oy} r={3 + u * 7} className="ira-pz-membrana__golpe"
              style={{ stroke: rgb(ORO, 0.75 * (1 - u)), strokeWidth: 0.9 * (1 - u) + 0.15 }} />;
          }
          if (modo === 'muro') {
            const u = ((t % 3400) - 280) / 700;
            if (u < 0 || u > 1) return null;
            const [gx, gy] = punto(R + 1.5);
            return <circle cx={gx} cy={gy} r={2 + u * 9} className="ira-pz-membrana__golpe"
              style={{ stroke: rgb(ROJO_CLARO, 0.8 * (1 - u)), strokeWidth: 1.1 * (1 - u) + 0.15 }} />;
          }
          if (modo === 'excepcion' && e.escudo > 0.9) {
            const u = (t % 2600) / 900;
            if (u > 1) return null;
            const a = PHI - 0.5 + u;
            const rr = R + 3.4;
            return <circle cx={50 + rr * Math.cos(a)} cy={50 + rr * Math.sin(a)} r="1.6" className="ira-pz-membrana__brillo"
              style={{ opacity: Math.sin(u * Math.PI) }} />;
          }
          return null;
        })()}
        {/* el otro */}
        <circle cx={ox} cy={oy} r={3.1 * e.os} opacity={e.oa}
          style={{ fill: rgb(colorOtro), filter: `drop-shadow(0 0 2.6px ${rgb(colorOtro, 0.9)})` }} />
      </svg>
    </div>
  );
}

// Posición del otro: suelto, a «od» del centro en la dirección PHI; unido, en su plaza del grupo
function posOtro(e, t) {
  const [sx, sy] = punto(e.od);
  if (e.une <= 0.001) return [sx, sy];
  const plazas = 3 + e.une;
  const a = -Math.PI / 2 + t * GIRO + (3 * 2 * Math.PI) / plazas;
  const gx = 50 + ORBITA * Math.cos(a);
  const gy = 50 + ORBITA * Math.sin(a);
  return [lerp(sx, gx, e.une), lerp(sy, gy, e.une)];
}
