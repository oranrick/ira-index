// IRA · Metodología 2.0 · cálculo de P1 y P2 con su margen, a partir de los recuentos.
// La IA o el codificador clasifican; este código pone la nota. Fuente: research/manual/P1.md (v1.1)
// y research/manual/P2.md (v1.0). El margen es el intervalo central del 80 %: el rango donde cae
// la nota con 4 de cada 5 probabilidades. Si dos márgenes se solapan, no hay diferencia clara.

export const NIVEL_MARGEN = 0.8;

// ── Beta con parámetros enteros: la CDF es la cola de una binomial (exacta) ───────────────
function logComb(n, k) {
  let s = 0;
  for (let i = 1; i <= k; i += 1) s += Math.log(n - k + i) - Math.log(i);
  return s;
}

function betaCdf(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const n = a + b - 1;
  let s = 0;
  for (let j = a; j <= n; j += 1) s += Math.exp(logComb(n, j) + j * Math.log(x) + (n - j) * Math.log(1 - x));
  return s;
}

export function betaCuantil(q, a, b) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 60; i += 1) {
    const m = (lo + hi) / 2;
    if (betaCdf(m, a, b) < q) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}

// ── Muestreo con semilla, para el margen de P1 (que mezcla tres indicadores) ──────────────
function rng(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(r) {
  const u = Math.max(r(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

// Marsaglia y Tsang (a ≥ 1, que siempre se cumple aquí: k + 1)
function gamma(a, r) {
  const d = a - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x; let v;
    do { x = normal(r); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    const u = r();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function beta(a, b, r) {
  const x = gamma(a, r);
  return x / (x + gamma(b, r));
}

function cuantil(ordenados, q) {
  const i = (ordenados.length - 1) * q;
  const lo = Math.floor(i);
  return ordenados[lo] + (ordenados[Math.ceil(i)] - ordenados[lo]) * (i - lo);
}

// ── P2 ────────────────────────────────────────────────────────────────────────────────────
// p2 = { E, P, N }: empáticas, que polarizan, neutras (las neutras no entran en la nota)
export const P2_MINIMO = 3;
export const P2_SOLIDA = 6;

export function calcularP2({ E = 0, P = 0, N = 0 } = {}) {
  const conSigno = E + P;
  const base = { E, P, N, conSigno, eventos: E + P + N };
  if (conSigno < P2_MINIMO) return { ...base, nota: null, solidez: 'sin' };
  const cola = (1 - NIVEL_MARGEN) / 2;
  return {
    ...base,
    nota: (10 * (E + 1)) / (E + P + 2),
    margen: [10 * betaCuantil(cola, E + 1, P + 1), 10 * betaCuantil(1 - cola, E + 1, P + 1)],
    solidez: conSigno >= P2_SOLIDA ? 'solida' : 'orientativa',
  };
}

// ── P1 ────────────────────────────────────────────────────────────────────────────────────
// p1 = { U, G, GC, I, C, A, Cp }
//   alcance: U universales, G de grupo sin perdedor, GC de grupo con perdedor
//   interpelación: I menciones de 2.ª persona inclusivas (2I del manual), C contra alguien (2C)
//   permeabilidad: A aperturas, Cp cierres
const PESOS = { alcance: 0.5, permeabilidad: 0.28, interpelacion: 0.22 };
const MINIMOS = { alcance: 15, permeabilidad: 3, interpelacion: 3 };

export function calcularP1({ U = 0, G = 0, GC = 0, I = 0, C = 0, A = 0, Cp = 0 } = {}, semilla = 7) {
  const ind = {
    alcance: { k: U + G, n: U + G + GC, cuenta: U + G + GC, nota: (k, n) => (10 * k) / n, prior: 0 },
    interpelacion: { k: I, n: I + C, cuenta: I + C, nota: (k, n) => (10 * k) / n, prior: 0 },
    permeabilidad: { k: A, n: A + Cp, cuenta: A + Cp, nota: (k, n) => (10 * (k + 1)) / (n + 2), prior: 1 },
  };
  const activos = Object.keys(ind).filter((k) => ind[k].cuenta >= MINIMOS[k]);
  const puntua = activos.includes('alcance') || activos.includes('permeabilidad');
  const base = { activos, nosotros: U + G + GC, frontera: A + Cp };
  if (!puntua) return { ...base, nota: null, solidez: 'sin' };

  const suma = activos.reduce((s, k) => s + PESOS[k], 0);
  const peso = Object.fromEntries(activos.map((k) => [k, PESOS[k] / suma]));
  const nota = activos.reduce((s, k) => s + peso[k] * ind[k].nota(ind[k].k, ind[k].n), 0);

  // Margen: cada proporción con su beta (uniforme de partida), mezcladas con los mismos pesos
  const r = rng(semilla);
  const muestras = [];
  for (let i = 0; i < 4000; i += 1) {
    let v = 0;
    activos.forEach((k) => { v += peso[k] * 10 * beta(ind[k].k + 1, ind[k].n - ind[k].k + 1, r); });
    muestras.push(v);
  }
  muestras.sort((a, b) => a - b);
  const cola = (1 - NIVEL_MARGEN) / 2;

  let solidez;
  if (activos.includes('alcance')) solidez = base.nosotros > 40 ? 'solida' : 'orientativa';
  else solidez = base.frontera >= 6 ? 'solida' : 'orientativa';

  return { ...base, nota, margen: [cuantil(muestras, cola), cuantil(muestras, 1 - cola)], solidez };
}

// ── Sumar piezas: la nota de campaña junta los eventos, no promedia notas ─────────────────
export function sumarRecuentos(lista) {
  return lista.reduce((acc, x) => {
    Object.entries(x ?? {}).forEach(([k, v]) => { acc[k] = (acc[k] ?? 0) + v; });
    return acc;
  }, {});
}

export function seSolapan(a, b) {
  if (!a?.margen || !b?.margen) return true;
  return a.margen[0] <= b.margen[1] && b.margen[0] <= a.margen[1];
}
