import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const scoreColor = s => s >= 7 ? '#6ec6a0' : s >= 4.5 ? '#e8a838' : '#e05252';
const scoreLabel = (s, es) => s >= 7 ? (es?'Empático':'Empathic') : s >= 4.5 ? (es?'Mixto':'Mixed') : (es?'Polarizante':'Polarizing');

// ─── A · QUIZ ─────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    quote: { es: "«Luchamos con toda nuestra fuerza y si no luchas con toda tu fuerza, ya no vas a tener país.»", en: "«We fight like hell and if you don't fight like hell, you're not going to have a country anymore.»" },
    options: ["Donald Trump","Gustavo Petro","Claudia Sheinbaum","Pedro Sánchez"],
    answer: "Donald Trump", entityId:"trump", score:2.48,
    why: { es:"Lenguaje bélico con urgencia apocalíptica. El país como bien que se pierde si no se combate.", en:"Martial language with apocalyptic urgency. The country as something lost if you don't fight." },
  },
  {
    quote: { es: "«No pronunciaré su nombre. Es un terrorista. Pero no recibirá el regalo de la fama.»", en: "«I will not speak his name. He is a terrorist. But he will not be given the gift of fame.»" },
    options: ["Jacinda Ardern","Claudia Sheinbaum","Donald Trump","José Mujica"],
    answer: "Jacinda Ardern", entityId:"ardern", score:8.75,
    why: { es:"Empatía radical con las víctimas: negarle protagonismo al agresor es un acto de cuidado.", en:"Radical empathy for victims: denying the aggressor fame is itself an act of care." },
  },
  {
    quote: { es: "«Lo imposible cuesta un poco más. Derrotados son solo aquellos que bajan los brazos.»", en: "«The impossible just costs a little more. Defeated are only those who give up.»" },
    options: ["José Mujica","Gustavo Petro","Pedro Sánchez","Donald Trump"],
    answer: "José Mujica", entityId:"mujica", score:8.93,
    why: { es:"Esperanza sobria sin utopía. El futuro como posibilidad alcanzable, no como promesa vacía.", en:"Sober hope without utopia. The future as achievable possibility, not empty promise." },
  },
  {
    quote: { es: "«No llego sola, llegamos todas. Después de 503 años, por primera vez llegamos las mujeres.»", en: "«I do not arrive alone — we all arrive. After 503 years, for the first time we women have arrived.»" },
    options: ["Claudia Sheinbaum","Jacinda Ardern","Pedro Sánchez","Gustavo Petro"],
    answer: "Claudia Sheinbaum", entityId:"sheinbaum", score:7.92,
    why: { es:"El «nosotros» extiende el sujeto político a toda la historia de las mujeres en 10 palabras.", en:"The 'we' extends the political subject to all of women's history in 10 words." },
  },
  {
    quote: { es: "«La vergüenza cambia de bando. La vergüenza para ellos; para nosotros el orgullo.»", en: "«Shame changes sides. Shame for them; for us, pride.»" },
    options: ["Pedro Sánchez","Gustavo Petro","Donald Trump","José Mujica"],
    answer: "Pedro Sánchez", entityId:"sanchez", score:5.97,
    why: { es:"Inversión simbólica del estigma: convierte el insulto en medalla. Alta dicotomía, alta retórica.", en:"Symbolic inversion of stigma: turns the insult into a medal. High dichotomy, high rhetoric." },
  },
  {
    quote: { es: "«Nos han robado no solo recursos: nos han robado la posibilidad de soñar.»", en: "«They have robbed us not only of resources: they have robbed us of the possibility of dreaming.»" },
    options: ["Gustavo Petro","Donald Trump","Jacinda Ardern","Pedro Sánchez"],
    answer: "Gustavo Petro", entityId:"petro", score:5.60,
    why: { es:"El robo como metáfora total: escala del dato material al horizonte existencial. Potente y dicotómico.", en:"Theft as a total metaphor: from the material datum to the existential horizon. Powerful and dichotomous." },
  },
];

function QuizSection({ lang, accent, accentA }) {
  const navigate = useNavigate();
  const es = lang !== 'en';
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUIZ.length));
  const [selected, setSelected] = useState(null);
  const q = QUIZ[idx];

  const next = () => {
    setSelected(null);
    setIdx(i => (i + 1) % QUIZ.length);
  };

  const col = selected ? scoreColor(q.score) : 'rgba(255,255,255,0.06)';

  return (
    <div style={{ marginBottom:"40px" }}>
      <p style={{ margin:"0 0 14px", fontSize:"9px", letterSpacing:"0.18em", color:accent, textTransform:"uppercase" }}>
        {es ? "¿Quién lo dijo?" : "Who said it?"}
      </p>

      <div style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${col}`,
        borderRadius:"14px", padding:"20px", transition:"border-color 0.4s" }}>
        <p style={{ margin:"0 0 20px", fontSize:"14px", fontStyle:"italic", fontFamily:"Georgia,serif",
          color:"rgba(255,255,255,0.75)", lineHeight:1.55 }}>
          {es ? q.quote.es : q.quote.en}
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom: selected ? "20px" : 0 }}>
          {q.options.map(opt => {
            const isCorrect = opt === q.answer;
            const isSelected = opt === selected;
            let bg = "rgba(255,255,255,0.03)";
            let border = "rgba(255,255,255,0.08)";
            let color = "rgba(255,255,255,0.55)";
            if (selected) {
              if (isCorrect) { bg="rgba(110,198,160,0.1)"; border="#6ec6a0"; color="#6ec6a0"; }
              else if (isSelected) { bg="rgba(224,82,82,0.1)"; border="#e05252"; color="#e05252"; }
              else { color="rgba(255,255,255,0.2)"; }
            }
            return (
              <button key={opt} disabled={!!selected} onClick={() => setSelected(opt)} style={{
                padding:"10px 14px", borderRadius:"10px", border:`1px solid ${border}`,
                background:bg, color, fontSize:"11px", fontFamily:"'DM Mono',monospace",
                cursor:selected?"default":"pointer", transition:"all 0.2s", textAlign:"left",
              }}>{opt}</button>
            );
          })}
        </div>

        {selected && (
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px", flexWrap:"wrap", gap:"8px" }}>
              <span style={{ fontSize:"11px", color:scoreColor(q.score), fontWeight:700, fontFamily:"'DM Mono',monospace" }}>
                IRA {q.score.toFixed(2)} — {scoreLabel(q.score, es)}
              </span>
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={() => navigate(`/entity/${q.entityId}`)} style={{
                  padding:"5px 12px", borderRadius:"20px", background:accentA(0.12),
                  border:`1px solid ${accentA(0.4)}`, color:accent, fontSize:"10px",
                  cursor:"pointer", fontFamily:"'DM Mono',monospace",
                }}>{es?"Ver análisis →":"See analysis →"}</button>
                <button onClick={next} style={{
                  padding:"5px 12px", borderRadius:"20px", background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)", fontSize:"10px",
                  cursor:"pointer", fontFamily:"'DM Mono',monospace",
                }}>{es?"Otra →":"Next →"}</button>
              </div>
            </div>
            <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>
              {es ? q.why.es : q.why.en}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── B · ESPECTRO ─────────────────────────────────────────────────────────────
function SpectrumSection({ entities, lang, accent }) {
  const navigate = useNavigate();
  const es = lang !== 'en';
  const [hoverId, setHoverId] = useState(null);
  const containerRef = useRef(null);

  const sorted = [...entities].filter(e => e.score != null).sort((a,b) => a.score - b.score);

  return (
    <div style={{ marginBottom:"40px" }}>
      <p style={{ margin:"0 0 14px", fontSize:"9px", letterSpacing:"0.18em", color:accent, textTransform:"uppercase" }}>
        {es ? "El espectro IRA — corpus completo" : "The IRA spectrum — full corpus"}
      </p>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:"14px", padding:"28px 24px 20px" }}>

        {/* Barra gradiente */}
        <div style={{ position:"relative", marginBottom:"32px" }} ref={containerRef}>
          <div style={{ height:"4px", borderRadius:"4px",
            background:"linear-gradient(90deg,#e05252,#e8a838 45%,#6ec6a0)" }} />

          {/* Dots */}
          {sorted.map(e => {
            const pct = (e.score / 10) * 100;
            const col = scoreColor(e.score);
            const isHov = hoverId === e.id;
            return (
              <div key={e.id}
                onMouseEnter={() => setHoverId(e.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => navigate(`/entity/${e.id}`)}
                style={{
                  position:"absolute", top:"-8px", left:`${pct}%`,
                  transform:"translateX(-50%)",
                  width: isHov ? 20 : 14, height: isHov ? 20 : 14,
                  borderRadius:"50%", background:col,
                  border: isHov ? "2px solid #fff" : "2px solid #0e0e14",
                  cursor:"pointer", transition:"all 0.18s ease", zIndex: isHov ? 10 : 1,
                  boxShadow: isHov ? `0 0 12px ${col}` : "none",
                }}
              >
                {isHov && (
                  <div style={{
                    position:"absolute", bottom:"calc(100% + 8px)", left:"50%",
                    transform:"translateX(-50%)",
                    background:"#0e0e14", border:`1px solid ${col}40`,
                    borderRadius:"8px", padding:"8px 10px", whiteSpace:"nowrap",
                    pointerEvents:"none", zIndex:20,
                    boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
                  }}>
                    <p style={{ margin:"0 0 2px", fontSize:"11px", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif" }}>{e.name}</p>
                    <p style={{ margin:0, fontSize:"10px", color:col, fontFamily:"'DM Mono',monospace" }}>
                      IRA {e.score?.toFixed(2)} — {scoreLabel(e.score, es)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Labels extremos */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"10px" }}>
            <span style={{ fontSize:"9px", color:"#e05252", fontFamily:"'DM Mono',monospace" }}>
              0 — {es?"Polarizante":"Polarizing"}
            </span>
            <span style={{ fontSize:"9px", color:"#6ec6a0", fontFamily:"'DM Mono',monospace" }}>
              10 — {es?"Empático":"Empathic"}
            </span>
          </div>
        </div>

        {/* Lista compacta ordenada */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
          {sorted.map(e => (
            <button key={e.id} onClick={() => navigate(`/entity/${e.id}`)}
              onMouseEnter={() => setHoverId(e.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                padding:"4px 10px", borderRadius:"20px", cursor:"pointer",
                background: hoverId===e.id ? `${scoreColor(e.score)}18` : "rgba(255,255,255,0.03)",
                border:`1px solid ${hoverId===e.id ? scoreColor(e.score)+'55' : 'rgba(255,255,255,0.07)'}`,
                color: hoverId===e.id ? scoreColor(e.score) : "rgba(255,255,255,0.4)",
                fontSize:"10px", fontFamily:"'DM Mono',monospace",
                transition:"all 0.15s ease",
              }}>
              {e.name} <span style={{ opacity:0.6 }}>{e.score?.toFixed(1)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── C · MINI ANALIZADOR ──────────────────────────────────────────────────────
const PROMPTS = {
  es: [
    "«Hay que echarlos a todos. Este país ya no tiene solución.»",
    "«Entiendo que hay quienes no comparten esta visión. Sus dudas también son legítimas.»",
    "«O estás con nosotros o estás contra el pueblo.»",
    "«Trabajemos juntos — aunque no pensemos igual.»",
  ],
  en: [
    "«We have to get rid of all of them. This country has no solution.»",
    "«I understand some don't share this vision. Their concerns are also legitimate.»",
    "«Either you're with us or you're against the people.»",
    "«Let's work together — even if we don't think alike.»",
  ],
};

function MiniAnalyzer({ lang, accent, accentA }) {
  const es = lang !== 'en';
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const examples = PROMPTS[es ? 'es' : 'en'];

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i+1) % examples.length), 3000);
    return () => clearInterval(t);
  }, [es]);

  async function analyze() {
    if (!text.trim() || text.trim().length < 8) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch('/api/quick-analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!data.error) setResult(data);
    } catch {}
    setLoading(false);
  }

  const col = result ? scoreColor(result.score) : accent;

  return (
    <div style={{ marginBottom:"8px" }}>
      <p style={{ margin:"0 0 14px", fontSize:"9px", letterSpacing:"0.18em", color:accent, textTransform:"uppercase" }}>
        {es ? "Mide una frase" : "Measure a phrase"}
      </p>

      <div style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${result ? col+'40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius:"14px", padding:"20px", transition:"border-color 0.4s" }}>

        {/* Hint rotatorio */}
        <p style={{ margin:"0 0 10px", fontSize:"9.5px", color:"rgba(255,255,255,0.2)", fontStyle:"italic",
          transition:"opacity 0.3s", lineHeight:1.5 }}>
          {es ? "ej." : "e.g."}{" "}{examples[tipIdx]}
        </p>

        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setResult(null); }}
          placeholder={es ? "Escribe o pega una frase política..." : "Write or paste a political phrase..."}
          maxLength={400}
          rows={2}
          onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); analyze(); } }}
          style={{
            width:"100%", background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px",
            padding:"10px 14px", color:"rgba(255,255,255,0.8)", fontSize:"12px",
            outline:"none", resize:"none", boxSizing:"border-box",
            fontFamily:"'DM Mono',monospace", lineHeight:1.5,
          }}
        />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"10px" }}>
          <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.18)" }}>
            {text.length}/400 · {es?"Enter para analizar":"Enter to analyze"}
          </span>
          <button onClick={analyze} disabled={loading || text.trim().length < 8} style={{
            padding:"7px 18px", borderRadius:"20px", background:accentA(0.15),
            border:`1px solid ${accentA(0.45)}`, color:accent,
            fontSize:"10px", letterSpacing:"0.08em", cursor: loading || text.trim().length < 8 ? "not-allowed" : "pointer",
            fontFamily:"'DM Mono',monospace", fontWeight:700, transition:"all 0.2s",
            opacity: loading || text.trim().length < 8 ? 0.5 : 1,
          }}>
            {loading ? (es?"Analizando...":"Analyzing...") : (es?"Calcular IRA →":"Calculate IRA →")}
          </button>
        </div>

        {result && (
          <div style={{ marginTop:"16px", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"16px",
            display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
              <span style={{ fontSize:"32px", fontWeight:800, color:col, fontFamily:"'DM Mono',monospace", lineHeight:1 }}>
                {result.score?.toFixed(1)}
              </span>
              <span style={{ fontSize:"9px", color:col, letterSpacing:"0.1em", marginTop:"2px" }}>
                {result.label || scoreLabel(result.score, es)}
              </span>
            </div>
            <p style={{ margin:0, flex:1, fontSize:"11.5px", color:"rgba(255,255,255,0.5)", lineHeight:1.6, fontStyle:"italic" }}>
              {result.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────
export default function IndexInteractive({ entities, lang, accent, accentA }) {
  const es = lang !== 'en';

  return (
    <div style={{ marginTop:"48px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px" }}>
        <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.06)" }} />
        <span style={{ fontSize:"9px", letterSpacing:"0.16em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase", whiteSpace:"nowrap" }}>
          {es ? "Explora e interactúa" : "Explore & interact"}
        </span>
        <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.06)" }} />
      </div>

      <SpectrumSection entities={entities} lang={lang} accent={accent} />
      <QuizSection lang={lang} accent={accent} accentA={accentA} />
      <MiniAnalyzer lang={lang} accent={accent} accentA={accentA} />
    </div>
  );
}
