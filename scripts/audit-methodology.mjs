// scripts/audit-methodology.mjs
// Auditoría estadística de los 7 parámetros IRA sobre todos los análisis
// disponibles: corpus estático (src/data/speeches.js) + daily_analyses (Supabase).
// Uso: node --env-file=.env.local scripts/audit-methodology.mjs
// Salida: JSON por stdout con distribución, correlaciones y contribuciones.

import { readFileSync } from 'fs';

const KEYS = ['pronominal', 'metafora', 'dicotomia', 'tono', 'disenso', 'vector', 'coherencia'];
const WEIGHTS = { pronominal: 0.20, metafora: 0.20, dicotomia: 0.10, tono: 0.20, disenso: 0.20, vector: 0.05, coherencia: 0.05 };
const NAME2KEY = {
  'Uso pronominal inclusivo': 'pronominal',
  'Tipo de metáfora dominante': 'metafora',
  'Carga dicotómica': 'dicotomia',
  'Tono emocional dominante': 'tono',
  'Reconocimiento del disenso': 'disenso',
  'Vector de acción': 'vector',
  'Coherencia afectiva': 'coherencia',
};

// ── 1. Corpus estático ──────────────────────────────────────────────
function loadStatic() {
  const m = readFileSync(new URL('../src/data/speeches.js', import.meta.url), 'utf8');
  const body = m.slice(m.indexOf('export const speeches'));
  const idxs = [...body.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(x => ({ id: x[1], pos: x.index }));
  const out = [];
  for (let i = 0; i < idxs.length; i++) {
    const chunk = body.slice(idxs[i].pos, idxs[i + 1] ? idxs[i + 1].pos : undefined);
    const entity = chunk.match(/entityId:\s*'([a-z]+)'/)?.[1];
    const ira = parseFloat(chunk.match(/iraScore:\s*([0-9.]+)/)?.[1]);
    const category = /entityId:\s*'(?:elpais|rt|telemundo|foxnews|publico)'/.test(chunk) ? 'medio' : 'politico';
    const params = {};
    for (const pm of chunk.matchAll(/name:\s*'([^']+)',\s*value:\s*([0-9.]+)/g)) {
      const key = NAME2KEY[pm[1]];
      if (key) params[key] = parseFloat(pm[2]);
    }
    if (!entity || isNaN(ira) || Object.keys(params).length !== 7) continue;
    out.push({ id: idxs[i].id, entity, category, ira, params, source: 'static' });
  }
  return out;
}

// ── 1b. Overrides desde `analyses` (re-análisis con la metodología vigente) ──
// La app prefiere estos valores sobre speeches.js (supabaseMap en App.jsx);
// la auditoría debe reflejar lo que el producto muestra.
async function loadAnalysesOverrides() {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/analyses?select=speech_id,ira,params&speech_id=not.is.null`,
    { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } },
  );
  const rows = await res.json();
  const map = {};
  for (const r of rows) {
    const params = Object.fromEntries(KEYS.map(k => [k, r.params[k]?.score ?? null]));
    if (KEYS.every(k => typeof params[k] === 'number')) map[r.speech_id] = { ira: r.ira, params };
  }
  return map;
}

// ── 2. daily_analyses ───────────────────────────────────────────────
async function loadDaily() {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/daily_analyses?select=entity_id,published_date,ira,params&order=published_date.asc`,
    { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } },
  );
  const rows = await res.json();
  return rows.map(r => ({
    id: `${r.entity_id}-${r.published_date}`,
    entity: r.entity_id,
    category: 'politico',
    ira: r.ira,
    params: Object.fromEntries(KEYS.map(k => [k, r.params[k]?.score ?? null])),
    source: 'daily',
  })).filter(r => KEYS.every(k => typeof r.params[k] === 'number'));
}

// ── 3. Estadística ──────────────────────────────────────────────────
const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const quantile = (a, q) => { const s = [...a].sort((x, y) => x - y); const p = (s.length - 1) * q; const lo = Math.floor(p); return s[lo] + (s[Math.ceil(p)] - s[lo]) * (p - lo); };
function pearson(a, b) {
  const ma = mean(a), mb = mean(b);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return num / Math.sqrt(da * db);
}
const r2 = x => Math.round(x * 100) / 100;
const r3 = x => Math.round(x * 1000) / 1000;

async function main() {
  const overrides = await loadAnalysesOverrides();
  const statics = loadStatic().map(s => overrides[s.id]
    ? { ...s, ira: overrides[s.id].ira, params: overrides[s.id].params, source: 'static-db' }
    : s);
  const all = [...statics, ...await loadDaily()];
  const result = {
    n_total: all.length,
    n_static: all.filter(x => x.source.startsWith('static')).length,
    n_static_db_override: all.filter(x => x.source === 'static-db').length,
    n_daily: all.filter(x => x.source === 'daily').length,
  };

  // Distribución por parámetro
  result.distribucion = {};
  for (const k of KEYS) {
    const v = all.map(x => x.params[k]);
    result.distribucion[k] = {
      media: r2(mean(v)), sd: r2(sd(v)), min: Math.min(...v), max: Math.max(...v),
      q25: r2(quantile(v, 0.25)), mediana: r2(quantile(v, 0.5)), q75: r2(quantile(v, 0.75)),
      cv: r3(sd(v) / mean(v)),
    };
  }

  // Matriz de correlación entre parámetros
  result.correlacion = {};
  for (const a of KEYS) {
    result.correlacion[a] = {};
    for (const b of KEYS) {
      result.correlacion[a][b] = r3(pearson(all.map(x => x.params[a]), all.map(x => x.params[b])));
    }
  }

  // Correlación de cada parámetro con el IRA final + contribución efectiva
  const iras = all.map(x => x.ira);
  result.contribucion = {};
  for (const k of KEYS) {
    const v = all.map(x => x.params[k]);
    result.contribucion[k] = {
      peso_nominal: WEIGHTS[k],
      r_con_ira: r3(pearson(v, iras)),
      peso_x_sd: r3(WEIGHTS[k] * sd(v)),            // aporte a la varianza del IRA
    };
  }
  const totalPxSd = Object.values(result.contribucion).reduce((s, c) => s + c.peso_x_sd, 0);
  for (const k of KEYS) result.contribucion[k].peso_efectivo = r3(result.contribucion[k].peso_x_sd / totalPxSd);

  // Correlación media inter-parámetro (redundancia global) y alpha de Cronbach
  const rs = [];
  for (let i = 0; i < KEYS.length; i++) for (let j = i + 1; j < KEYS.length; j++) rs.push(result.correlacion[KEYS[i]][KEYS[j]]);
  result.redundancia = { r_media_interparam: r3(mean(rs)), r_min: Math.min(...rs), r_max: Math.max(...rs) };
  const kN = KEYS.length, rBar = mean(rs);
  result.redundancia.alpha_cronbach = r3((kN * rBar) / (1 + (kN - 1) * rBar));

  // Por figura (n≥3) y por categoría
  result.por_figura = {};
  const byEnt = {};
  for (const x of all) (byEnt[x.entity] = byEnt[x.entity] || []).push(x);
  for (const [ent, xs] of Object.entries(byEnt)) {
    const f = { n: xs.length, ira_media: r2(mean(xs.map(x => x.ira))) };
    if (xs.length >= 3) {
      f.ira_sd = r2(sd(xs.map(x => x.ira)));
      f.params_media = Object.fromEntries(KEYS.map(k => [k, r2(mean(xs.map(x => x.params[k])))]));
    }
    result.por_figura[ent] = f;
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
