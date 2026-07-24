// src/components/PatternsPage.jsx
// Página /patrones — visualiza los hallazgos de la auditoría metodológica
// (docs/auditoria-metodologia.md) sobre los datos vivos: corpus estático
// (src/data/speeches.js) + daily_analyses (Supabase).
// Secciones: distribución por parámetro · peso en el IRA · comparación
// lado a lado · evolución temporal. Filtros por figura y rango de fechas.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { supabase } from '../supabaseClient';
import { speeches } from '../data/speeches';

// ── Constantes de parámetros (fórmula vigente, 7 params — ver CLAUDE.md) ──
const KEYS = ['pronominal', 'metafora', 'dicotomia', 'tono', 'disenso', 'vector', 'coherencia'];
const WEIGHTS = { pronominal: 0.20, metafora: 0.20, dicotomia: 0.10, tono: 0.20, disenso: 0.20, vector: 0.05, coherencia: 0.05 };
const PARAM_COLORS = { pronominal: '#ff6600', metafora: '#e8a838', dicotomia: '#6ec6a0', tono: '#5ba8d4', disenso: '#a07cd4', vector: '#e05890', coherencia: '#50c8b4' };
const PARAM_LABEL = {
  es: { pronominal: 'Pronombres y vínculo', metafora: 'Marco metafórico', dicotomia: 'Polaridad moral', tono: 'Tono emocional', disenso: 'Apertura al disenso', vector: 'Llamada a la acción', coherencia: 'Engagement dialógico' },
  en: { pronominal: 'Pronouns & Bond', metafora: 'Metaphorical Frame', dicotomia: 'Moral Polarity', tono: 'Emotional Tone', disenso: 'Openness to Dissent', vector: 'Call to Action', coherencia: 'Dialogic Engagement' },
};
const NAME2KEY = {
  'Uso pronominal inclusivo': 'pronominal', 'Tipo de metáfora dominante': 'metafora',
  'Carga dicotómica': 'dicotomia', 'Tono emocional dominante': 'tono',
  'Reconocimiento del disenso': 'disenso', 'Vector de acción': 'vector', 'Coherencia afectiva': 'coherencia',
};
const ENTITY_COLORS = { sheinbaum: '#6ec6a0', milei: '#ff6600', sanchez: '#5ba8d4', cepeda: '#a07cd4', trump: '#e05890', petro: '#e8a838', ardern: '#50c8b4', mujica: '#c8a050', putin: '#e05252' };
const FALLBACK_COLORS = ['#ff8833', '#7fd4b0', '#78b8e0', '#b894e0', '#e878a8'];

const MONTHS_ES = { enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06', julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12' };
function spanishDateToISO(str) {
  const m = String(str || '').match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i);
  if (!m || !MONTHS_ES[m[2].toLowerCase()]) return null;
  return `${m[3]}-${MONTHS_ES[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`;
}

// ── Estadística ──
const mean = a => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const sd = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const quantile = (a, q) => { const s = [...a].sort((x, y) => x - y); const p = (s.length - 1) * q; const lo = Math.floor(p); return s[lo] + ((s[Math.ceil(p)] ?? s[lo]) - s[lo]) * (p - lo); };
function pearson(a, b) {
  if (a.length < 3) return 0;
  const ma = mean(a), mb = mean(b);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return da && db ? num / Math.sqrt(da * db) : 0;
}
const r2 = x => Math.round(x * 100) / 100;

const T = {
  es: {
    title: 'Patrones', subtitle: 'Radiografía estadística del corpus IRA: qué mide cada parámetro, cuánto pesa y cómo evoluciona.',
    back: '← Volver', all: 'Todas las figuras', from: 'Desde', to: 'Hasta', analyses: 'análisis',
    dist: 'Distribución por parámetro', distSub: 'Caja: cuartiles 25–75 · línea: mediana · punto: media · extremos: mín/máx',
    weight: 'Peso de cada parámetro en el IRA', weightSub: 'Peso nominal de la fórmula vs. contribución efectiva a la varianza del índice, y correlación de cada parámetro con el IRA final.',
    nominal: 'nominal', effective: 'efectivo', rIra: 'r con IRA',
    compare: 'Comparación entre figuras', compareSub: 'Perfil medio por parámetro. Selecciona 2–3 figuras.',
    timeline: 'Evolución temporal', timelineSub: 'Serie de análisis fechados por figura. La línea punteada separa niveles empático (≥7), mixto y polarizante (<4).',
    metric: 'Métrica', notEnough: 'Sin datos suficientes con los filtros actuales.', corpus: 'corpus', daily: 'diario',
    mean_: 'media', n: 'n',
  },
  en: {
    title: 'Patterns', subtitle: 'Statistical X-ray of the IRA corpus: what each parameter measures, how much it weighs, and how it evolves.',
    back: '← Back', all: 'All figures', from: 'From', to: 'To', analyses: 'analyses',
    dist: 'Distribution by parameter', distSub: 'Box: 25–75 quartiles · line: median · dot: mean · ends: min/max',
    weight: 'Weight of each parameter in the IRA', weightSub: 'Nominal formula weight vs. effective contribution to index variance, plus each parameter\'s correlation with the final IRA.',
    nominal: 'nominal', effective: 'effective', rIra: 'r with IRA',
    compare: 'Figure comparison', compareSub: 'Mean profile per parameter. Select 2–3 figures.',
    timeline: 'Timeline', timelineSub: 'Dated analyses per figure. Dotted lines separate empathic (≥7), mixed and polarizing (<4) levels.',
    metric: 'Metric', notEnough: 'Not enough data under current filters.', corpus: 'corpus', daily: 'daily',
    mean_: 'mean', n: 'n',
  },
};

const card = {
  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px', padding: '22px', marginBottom: '18px',
};
const h2 = { margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#fff', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em' };
const sub = { margin: '0 0 18px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 };
const accent = '#ff6600';
const accentA = a => `rgba(255,102,0,${a})`;

function chipStyle(active, color = accent) {
  return {
    padding: '6px 12px', borderRadius: '18px', fontSize: '10.5px', fontWeight: 700,
    fontFamily: "'DM Mono',monospace", letterSpacing: '0.05em', cursor: 'pointer',
    background: active ? `${color}26` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
    color: active ? color : 'rgba(255,255,255,0.55)', transition: 'all 0.15s ease',
  };
}

export default function PatternsPage({ lang = 'es' }) {
  const navigate = useNavigate();
  const t = T[lang] ?? T.es;
  const [dailyRows, setDailyRows] = useState([]);
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [compareSel, setCompareSel] = useState(['sheinbaum', 'milei', 'sanchez']);
  const [metric, setMetric] = useState('ira');
  // Diferir el montaje del chart un tick: ResponsiveContainer mide 0px si monta
  // antes de que el layout exista (mismo patrón que EntityDetailPage).
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMounted(true), 50); return () => clearTimeout(id); }, []);

  useEffect(() => {
    supabase.from('daily_analyses')
      .select('entity_id,entity_name,published_date,ira,params,title')
      .order('published_date', { ascending: true })
      .then(({ data }) => setDailyRows(Array.isArray(data) ? data : []));
  }, []);

  // Dataset unificado: corpus estático + análisis diarios
  const all = useMemo(() => {
    const out = [];
    for (const s of speeches) {
      const params = {};
      for (const p of s.params ?? []) { const k = NAME2KEY[p.name]; if (k) params[k] = p.value; }
      if (Object.keys(params).length !== 7) continue;
      out.push({ entity: s.entityId, entityName: s.entityName, date: spanishDateToISO(s.date), ira: s.iraScore, params, kind: 'corpus', title: s.title });
    }
    for (const r of dailyRows) {
      const params = {};
      for (const k of KEYS) { const v = r.params?.[k]?.score; if (typeof v === 'number') params[k] = v; }
      if (Object.keys(params).length !== 7) continue;
      out.push({ entity: r.entity_id, entityName: r.entity_name, date: r.published_date, ira: r.ira, params, kind: 'daily', title: r.title });
    }
    return out;
  }, [dailyRows]);

  const entities = useMemo(() => {
    const map = {};
    for (const x of all) if (!map[x.entity]) map[x.entity] = { id: x.entity, name: x.entityName, n: 0 };
    for (const x of all) map[x.entity].n++;
    return Object.values(map).sort((a, b) => b.n - a.n);
  }, [all]);

  const entColor = useMemo(() => {
    const m = {}; let i = 0;
    for (const e of entities) m[e.id] = ENTITY_COLORS[e.id] ?? FALLBACK_COLORS[i++ % FALLBACK_COLORS.length];
    return m;
  }, [entities]);

  const filtered = useMemo(() => all.filter(x =>
    (entityFilter === 'all' || x.entity === entityFilter) &&
    (!dateFrom || (x.date && x.date >= dateFrom)) &&
    (!dateTo || (x.date && x.date <= dateTo)),
  ), [all, entityFilter, dateFrom, dateTo]);

  const stats = useMemo(() => {
    if (filtered.length < 2) return null;
    const iras = filtered.map(x => x.ira);
    const perParam = {};
    for (const k of KEYS) {
      const v = filtered.map(x => x.params[k]);
      perParam[k] = {
        min: Math.min(...v), max: Math.max(...v), q25: quantile(v, 0.25), med: quantile(v, 0.5), q75: quantile(v, 0.75),
        mean: mean(v), sd: sd(v), r: pearson(v, iras), wsd: WEIGHTS[k] * sd(v),
      };
    }
    const totalWsd = KEYS.reduce((s, k) => s + perParam[k].wsd, 0);
    for (const k of KEYS) perParam[k].eff = totalWsd ? perParam[k].wsd / totalWsd : 0;
    return perParam;
  }, [filtered]);

  const compareData = useMemo(() => compareSel.map(id => {
    const xs = all.filter(x => x.entity === id);
    if (!xs.length) return null;
    return {
      id, name: xs[0].entityName, n: xs.length, ira: r2(mean(xs.map(x => x.ira))),
      params: Object.fromEntries(KEYS.map(k => [k, r2(mean(xs.map(x => x.params[k])))])),
    };
  }).filter(Boolean), [all, compareSel]);

  const timeline = useMemo(() => {
    // Con "Todas": solo series con ≥3 puntos fechados (las de 2 puntos convierten el chart en spaghetti)
    const sel = entityFilter === 'all' ? entities.filter(e => all.filter(x => x.entity === e.id && x.date).length >= 3).map(e => e.id) : [entityFilter];
    const dated = filtered.filter(x => x.date && sel.includes(x.entity));
    const dates = [...new Set(dated.map(x => x.date))].sort();
    const rows = dates.map(d => {
      const row = { date: d };
      for (const id of sel) {
        const hit = dated.find(x => x.entity === id && x.date === d);
        if (hit) row[id] = metric === 'ira' ? hit.ira : hit.params[metric];
      }
      return row;
    });
    return { rows, series: sel.filter(id => rows.some(r => r[id] != null)) };
  }, [filtered, entityFilter, entities, all, metric]);

  const dateInput = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '8px',
    color: '#fff', fontFamily: "'DM Mono',monospace", fontSize: '11px', padding: '6px 8px', colorScheme: 'dark',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e14', fontFamily: "'DM Mono',monospace", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-15%', width: '60vw', height: '60vh', borderRadius: '50%', background: `radial-gradient(ellipse at center, ${accentA(0.12)} 0%, transparent 68%)` }} />
        <div style={{ position: 'absolute', bottom: '-25%', left: '-12%', width: '55vw', height: '55vh', borderRadius: '50%', background: `radial-gradient(ellipse at center, ${accentA(0.07)} 0%, transparent 68%)` }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1060px', margin: '0 auto', padding: '26px 20px 60px' }}>
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
          style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', fontWeight: 700, color: accent, letterSpacing: '0.04em', border: `1.5px solid ${accentA(0.45)}`, borderRadius: '20px', padding: '5px 13px', background: accentA(0.08), cursor: 'pointer', marginBottom: '22px' }}>
          {t.back}
        </button>

        <h1 style={{ margin: '0 0 6px', fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em' }}>{t.title}</h1>
        <p style={{ margin: '0 0 24px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '560px' }}>{t.subtitle}</p>

        {/* ── Filtros ── */}
        <div style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', padding: '14px 18px' }}>
          <button style={chipStyle(entityFilter === 'all')} onClick={() => setEntityFilter('all')}>{t.all}</button>
          {entities.map(e => (
            <button key={e.id} style={chipStyle(entityFilter === e.id, entColor[e.id])} onClick={() => setEntityFilter(entityFilter === e.id ? 'all' : e.id)}>
              {e.name} · {e.n}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            {t.from} <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={dateInput} />
            {t.to} <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={dateInput} />
            <span style={{ color: accent, fontWeight: 700 }}>{filtered.length} {t.analyses}</span>
          </span>
        </div>

        {/* ── Distribución por parámetro ── */}
        <div style={card}>
          <h2 style={h2}>{t.dist}</h2>
          <p style={sub}>{t.distSub}</p>
          {!stats ? <p style={{ ...sub, margin: 0 }}>{t.notEnough}</p> : KEYS.map(k => {
            const s = stats[k], c = PARAM_COLORS[k];
            const pct = v => `${(v / 10) * 100}%`;
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '13px' }}>
                <div style={{ width: '158px', flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: c }}>{PARAM_LABEL[lang][k]}</span>
                  <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>{t.mean_} {r2(s.mean)} · sd {r2(s.sd)}</span>
                </div>
                <div style={{ flex: 1, position: 'relative', height: '26px' }}>
                  <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.07)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: pct(s.min), width: `calc(${pct(s.max)} - ${pct(s.min)})`, height: '2px', background: `${c}55` }} />
                  <div style={{ position: 'absolute', top: '5px', left: pct(s.q25), width: `calc(${pct(s.q75)} - ${pct(s.q25)})`, height: '16px', background: `${c}30`, border: `1px solid ${c}80`, borderRadius: '4px' }} />
                  <div style={{ position: 'absolute', top: '3px', left: pct(s.med), width: '2px', height: '20px', background: c, borderRadius: '1px' }} />
                  <div style={{ position: 'absolute', top: '9px', left: `calc(${pct(s.mean)} - 4px)`, width: '8px', height: '8px', background: '#fff', borderRadius: '50%', border: `2px solid ${c}` }} />
                </div>
                <div style={{ width: '30px', fontSize: '9px', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>0–10</div>
              </div>
            );
          })}
        </div>

        {/* ── Peso en el IRA ── */}
        <div style={card}>
          <h2 style={h2}>{t.weight}</h2>
          <p style={sub}>{t.weightSub}</p>
          {stats && KEYS.map(k => {
            const s = stats[k], c = PARAM_COLORS[k];
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '11px' }}>
                <div style={{ width: '158px', flexShrink: 0, textAlign: 'right', fontSize: '11px', fontWeight: 700, color: c }}>{PARAM_LABEL[lang][k]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${WEIGHTS[k] * 400}px`, maxWidth: '100%', height: '100%', background: `${c}66`, borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', width: '86px' }}>{t.nominal} {Math.round(WEIGHTS[k] * 100)}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.eff * 400}px`, maxWidth: '100%', height: '100%', background: c, borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', width: '86px' }}>{t.effective} {Math.round(s.eff * 100)}%</span>
                  </div>
                </div>
                <div style={{ width: '82px', flexShrink: 0, textAlign: 'right', fontSize: '10px', color: Math.abs(s.r) > 0.9 ? accent : 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
                  {t.rIra} {s.r.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Comparación entre figuras ── */}
        <div style={card}>
          <h2 style={h2}>{t.compare}</h2>
          <p style={sub}>{t.compareSub}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {entities.map(e => {
              const active = compareSel.includes(e.id);
              return (
                <button key={e.id} style={chipStyle(active, entColor[e.id])}
                  onClick={() => setCompareSel(sel => active ? sel.filter(x => x !== e.id) : sel.length >= 3 ? [...sel.slice(1), e.id] : [...sel, e.id])}>
                  {e.name}
                </button>
              );
            })}
          </div>
          {compareData.length >= 2 && (
            <>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {compareData.map(d => (
                  <div key={d.id} style={{ flex: '1 1 150px', background: `${entColor[d.id]}0d`, border: `1px solid ${entColor[d.id]}40`, borderRadius: '12px', padding: '12px 14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: entColor[d.id], fontFamily: "'Syne',sans-serif" }}>{d.name}</span>
                    <span style={{ display: 'block', fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{d.ira.toFixed(2)}</span>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>IRA · {t.n}={d.n}</span>
                  </div>
                ))}
              </div>
              {KEYS.map(k => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                  <div style={{ width: '158px', flexShrink: 0, textAlign: 'right', fontSize: '11px', fontWeight: 700, color: PARAM_COLORS[k] }}>{PARAM_LABEL[lang][k]}</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {compareData.map(d => (
                      <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '3.5px', overflow: 'hidden' }}>
                          <div style={{ width: `${(d.params[k] / 10) * 100}%`, height: '100%', background: `linear-gradient(90deg,${entColor[d.id]}88,${entColor[d.id]})`, borderRadius: '3.5px', transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ width: '32px', fontSize: '10px', fontWeight: 700, color: entColor[d.id] }}>{d.params[k].toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Evolución temporal ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={h2}>{t.timeline}</h2>
              <p style={sub}>{t.timelineSub}</p>
            </div>
            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
              {t.metric}{' '}
              <select value={metric} onChange={e => setMetric(e.target.value)}
                style={{ ...dateInput, cursor: 'pointer' }}>
                <option value="ira">IRA</option>
                {KEYS.map(k => <option key={k} value={k}>{PARAM_LABEL[lang][k]}</option>)}
              </select>
            </label>
          </div>
          {timeline.rows.length < 2 || timeline.series.length === 0 || !mounted ? (
            <p style={{ ...sub, margin: 0 }}>{t.notEnough}</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timeline.rows} margin={{ top: 8, right: 12, bottom: 4, left: -18 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'DM Mono' }} tickFormatter={d => d?.slice(5)} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'DM Mono' }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,10,16,0.95)', border: `1px solid ${accentA(0.45)}`, borderRadius: '10px', fontFamily: 'DM Mono', fontSize: '11px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                  formatter={(v, name) => [Number(v).toFixed(2), entities.find(e => e.id === name)?.name ?? name]}
                />
                <Legend formatter={id => <span style={{ color: entColor[id], fontSize: '10px', fontFamily: 'DM Mono' }}>{entities.find(e => e.id === id)?.name ?? id}</span>} />
                {[7, 4].map(y => (
                  <Line key={`ref${y}`} dataKey={() => y} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 5" dot={false} activeDot={false} legendType="none" isAnimationActive={false} />
                ))}
                {timeline.series.map(id => (
                  <Line key={id} type="monotone" dataKey={id} stroke={entColor[id]} strokeWidth={2}
                    dot={{ r: 3, fill: entColor[id], strokeWidth: 0 }} connectNulls isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
