import { useState, useCallback } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { colorPuntuacion as scoreColor, formatearPuntuacion } from "../lib/escala";
import BarraEscala from "./ui/BarraEscala.jsx";

const COLOR_A = "#DCB149";
const COLOR_B = "#22d3ee";


function CompareTooltip({ active, payload, nameA, nameB }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "var(--ira-elevada)", border: "1px solid var(--ira-linea-fuerte)",
      borderRadius: "8px", padding: "8px 12px", fontFamily: "var(--ira-font-texto)",
      pointerEvents: "none",
    }}>
      <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--ira-texto-3)", letterSpacing: "0.04em" }}>{d.label}</p>
      <p style={{ margin: "2px 0", fontSize: "14px" }}>
        <span style={{ color: COLOR_A }}>{nameA}</span>
        <span style={{ color: "var(--ira-texto-3)", margin: "0 6px" }}>—</span>
        <span style={{ color: COLOR_A, fontWeight: 700 }}>{Number(d.a).toFixed(1)}</span>
      </p>
      <p style={{ margin: "2px 0", fontSize: "14px" }}>
        <span style={{ color: COLOR_B }}>{nameB}</span>
        <span style={{ color: "var(--ira-texto-3)", margin: "0 6px" }}>—</span>
        <span style={{ color: COLOR_B, fontWeight: 700 }}>{Number(d.b).toFixed(1)}</span>
      </p>
    </div>
  );
}

function PoliticianSelector({ label, selected, onSelect, politicians, color, searchPlaceholder = "Buscar político..." }) {
  const [search, setSearch] = useState("");
  const [open, setOpen]   = useState(false);

  const filtered = politicians.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback((p) => {
    onSelect(p);
    setSearch("");
    setOpen(false);
  }, [onSelect]);

  return (
    <div style={{ position: "relative", flex: "1 1 200px" }}>
      <p style={{ margin: "0 0 8px", fontSize: "12px", letterSpacing: "0.14em", color: `${color}cc`, textTransform: "uppercase" }}>
        {label}
      </p>
      {selected && !open ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderRadius: "10px",
          background: `${color}12`, border: `1px solid ${color}45`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>{selected.flag}</span>
            <span style={{ fontSize: "13px", color: "var(--ira-nieve)", fontWeight: 600, fontFamily: "var(--ira-font-titulo)" }}>
              {selected.name}
            </span>
          </div>
          <button
            type="button"
            aria-label={`Quitar ${selected.name}`}
            onClick={() => { onSelect(null); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ira-texto-2)", fontSize: "20px", width: "44px", height: "44px", margin: "-10px -10px -10px 0", lineHeight: 1 }}
          >×</button>
        </div>
      ) : (
        <div onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
          <input
            className="ira-campo"
            aria-label={`${label}: ${searchPlaceholder}`}
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
            placeholder={searchPlaceholder}
          />
          {open && filtered.length > 0 && (
            <div style={{
              position: "absolute", zIndex: 200, width: "100%",
              marginTop: "4px", borderRadius: "10px", overflow: "hidden",
              border: "1px solid var(--ira-linea)", background: "var(--ira-elevada)",
            }}>
              {filtered.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  style={{
                    width: "100%", minHeight: "44px", padding: "9px 14px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "8px", textAlign: "left",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{ fontSize: "16px" }}>{p.flag}</span>
                  <span style={{ fontSize: "14px", color: "var(--ira-nieve)", fontFamily: "var(--ira-font-texto)" }}>{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Comparator({ politicians, paramsEs, paramShort, lang = "es", T = {} }) {
  const [entityA, setEntityA] = useState(null);
  const [entityB, setEntityB] = useState(null);

  const radarData = entityA && entityB
    ? paramsEs.map(p => ({
        param: paramShort[p.id],
        label: p.label,
        a: entityA.params[p.id],
        b: entityB.params[p.id],
      }))
    : null;

  const synthesis = radarData ? (() => {
    const diffs = paramsEs.map(p => ({
      label: p.label,
      diff: entityA.params[p.id] - entityB.params[p.id],
    }));
    const aWins   = diffs.filter(d => d.diff > 0).length;
    const bWins   = diffs.filter(d => d.diff < 0).length;
    const biggest = diffs.reduce((mx, d) => Math.abs(d.diff) > Math.abs(mx.diff) ? d : mx, diffs[0]);
    return { aWins, bWins, biggest };
  })() : null;

  const labelA = T.politicianA || "Político A";
  const labelB = T.politicianB || "Político B";
  const labelSelectTwo = T.selectTwo || "Selecciona dos políticos para comparar";
  const labelSynthesis = T.synthesis || "Síntesis";
  const labelSearch = T.searchPolitician || "Buscar político...";

  return (
    <div style={{ maxWidth: "540px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "28px" }}>
        <PoliticianSelector label={labelA} selected={entityA} onSelect={setEntityA} politicians={politicians} color={COLOR_A} searchPlaceholder={labelSearch} />
        <PoliticianSelector label={labelB} selected={entityB} onSelect={setEntityB} politicians={politicians} color={COLOR_B} searchPlaceholder={labelSearch} />
      </div>

      {entityA && entityB ? (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart
              data={radarData}
              margin={{ top: 12, right: 44, bottom: 12, left: 44 }}
            >
              <PolarGrid stroke="rgba(255,255,255,0.08)" gridType="polygon" />
              <PolarAngleAxis
                dataKey="param"
                tick={{ fill: "rgba(255,255,255,0.4)", fontFamily: "var(--ira-font-texto)", fontSize: 9.5 }}
              />
              <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
              <Tooltip
                content={(props) => <CompareTooltip {...props} nameA={entityA.name} nameB={entityB.name} />}
                cursor={false}
              />
              <Radar dataKey="a" stroke={COLOR_A} strokeWidth={1.5} fill={COLOR_A} fillOpacity={0.28}
                dot={{ r: 3, fill: COLOR_A, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: COLOR_A, stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
              />
              <Radar dataKey="b" stroke={COLOR_B} strokeWidth={1.5} fill={COLOR_B} fillOpacity={0.22}
                dot={{ r: 3, fill: COLOR_B, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: COLOR_B, stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "16px 0" }}>
            {[{ e: entityA, col: COLOR_A }, { e: entityB, col: COLOR_B }].map(({ e, col }) => (
              <div key={e.id} style={{
                flex: "1 1 180px", padding: "12px 16px", borderRadius: "12px",
                background: `${col}10`, border: `1px solid ${col}38`,
              }}>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: col }}>
                  {e.flag} {e.name}
                </p>
                <p style={{ margin: "0 0 10px", display: "flex", alignItems: "baseline", gap: "4px", fontFamily: "var(--ira-font-cifra)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <span style={{ fontSize: "36px", color: scoreColor(e.score) }}>{formatearPuntuacion(e.score, lang)}</span>
                  <span style={{ fontSize: "14px", color: "var(--ira-texto-3)", letterSpacing: 0 }}>/10</span>
                </p>
                <BarraEscala puntuacion={e.score} grosor={5} />
              </div>
            ))}
          </div>

          {synthesis && (
            <div style={{
              padding: "14px 16px", borderRadius: "12px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <p style={{ margin: "0 0 6px", fontSize: "12px", letterSpacing: "0.14em", color: "var(--ira-texto-3)", textTransform: "uppercase" }}>
                {labelSynthesis}
              </p>
              {lang === "en" ? (
                <p style={{ margin: 0, fontSize: "12px", color: "var(--ira-texto-2)", lineHeight: 1.7, fontFamily: "var(--ira-font-texto)" }}>
                  <span style={{ color: COLOR_A }}>{entityA.name}</span> outscores{" "}
                  <span style={{ color: COLOR_B }}>{entityB.name}</span> on{" "}
                  <span style={{ color: "var(--ira-nieve)", fontWeight: 700 }}>{synthesis.aWins}</span> of the 8 parameters;{" "}
                  <span style={{ color: COLOR_B }}>{entityB.name}</span> on{" "}
                  <span style={{ color: "var(--ira-nieve)", fontWeight: 700 }}>{synthesis.bWins}</span>.{" "}
                  The largest gap is in{" "}
                  <span style={{ color: "var(--ira-nieve)" }}>{synthesis.biggest.label}</span>{" "}
                  ({Math.abs(synthesis.biggest.diff).toFixed(1)} pts in favour of{" "}
                  <span style={{ color: synthesis.biggest.diff > 0 ? COLOR_A : COLOR_B }}>
                    {synthesis.biggest.diff > 0 ? entityA.name : entityB.name}
                  </span>).
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: "12px", color: "var(--ira-texto-2)", lineHeight: 1.7, fontFamily: "var(--ira-font-texto)" }}>
                  <span style={{ color: COLOR_A }}>{entityA.name}</span> supera a{" "}
                  <span style={{ color: COLOR_B }}>{entityB.name}</span> en{" "}
                  <span style={{ color: "var(--ira-nieve)", fontWeight: 700 }}>{synthesis.aWins}</span> de los 8 parámetros;{" "}
                  <span style={{ color: COLOR_B }}>{entityB.name}</span> en{" "}
                  <span style={{ color: "var(--ira-nieve)", fontWeight: 700 }}>{synthesis.bWins}</span>.{" "}
                  La mayor diferencia está en{" "}
                  <span style={{ color: "var(--ira-nieve)" }}>{synthesis.biggest.label}</span>{" "}
                  ({Math.abs(synthesis.biggest.diff).toFixed(1)} pts a favor de{" "}
                  <span style={{ color: synthesis.biggest.diff > 0 ? COLOR_A : COLOR_B }}>
                    {synthesis.biggest.diff > 0 ? entityA.name : entityB.name}
                  </span>).
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{
          height: "160px", display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.07)",
        }}>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--ira-texto-3)", fontFamily: "var(--ira-font-texto)" }}>
            {labelSelectTwo}
          </p>
        </div>
      )}
    </div>
  );
}
