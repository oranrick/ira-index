import { useState, useEffect } from "react";

const PARAMS = [
  { id: "pronominal",   label: "Uso pronominal inclusivo",     desc: "Qué pronombres usa y con qué verbos los asocia." },
  { id: "metafora",     label: "Tipo de metáfora dominante",   desc: "¿El imaginario central construye comunidad o enemigo?" },
  { id: "dicotomia",    label: "Carga dicotómica",             desc: "Rigidez moral: ¿divide el mundo en buenos y malos?" },
  { id: "tono",         label: "Tono emocional dominante",     desc: "¿Qué emoción instala en quien lo recibe?" },
  { id: "disenso",      label: "Reconocimiento del disenso",   desc: "¿Valida la diferencia o la clausura?" },
  { id: "vector",       label: "Vector de acción",             desc: "¿Convoca a cooperar o a confrontar?" },
  { id: "coherencia",   label: "Coherencia afectiva",          desc: "¿Hay distancia entre lo que dice y lo que hace?" },
  { id: "proyeccion",   label: "Proyección de futuro",         desc: "¿Abre un horizonte compartido o lo clausura?" },
];

const PARAM_DETAILS = {
  pronominal: {
    detail: "Mide la frecuencia y el tipo de pronombres usados. 'Nosotros', 'nuestro' y 'juntos' construyen comunidad y responsabilidad compartida. El uso dominante de 'yo' señala ego-centralismo; 'ellos/los otros' como sujeto agente indica distancia o antagonismo estructural.",
    empatico: "«Nosotros vamos a enfrentar esto juntos. Lo que nos hicieron a todos nos obliga a responder unidos.»",
    polarizador: "«Yo lo resolví. Yo lo advertí. Ellos son los que destruyeron este país.»",
  },
  metafora: {
    detail: "Las metáforas estructuran la realidad política. Las de construcción ('tejer redes', 'cultivar') activan esquemas cognitivos de cooperación. Las bélicas o de contaminación ('limpiar la corrupción', 'extirpar el problema') activan esquemas de amenaza y exclusión.",
    empatico: "«La democracia es un jardín que todos debemos cuidar. Si lo abandonamos, se llena de maleza.»",
    polarizador: "«Estamos en guerra. El enemigo está dentro de nuestras instituciones y hay que extirparlo.»",
  },
  dicotomia: {
    detail: "Evalúa la rigidez moral del discurso: si divide el mundo en categorías absolutas de bien/mal, nosotros/ellos, patriotas/traidores. Alta dicotomía niega la ambigüedad, dificulta el diálogo y legitima la eliminación simbólica del adversario.",
    empatico: "«Entiendo que hay quienes no comparten esta visión. Sus preocupaciones también son legítimas y merecen escucharse.»",
    polarizador: "«O estás con nosotros o estás contra el pueblo. No hay grises, no hay término medio.»",
  },
  tono: {
    detail: "Identifica la emoción dominante que el discurso instala en quien lo recibe. Esperanza, orgullo compartido y gratitud favorecen la cohesión social. Miedo, ira y asco son más contagiosos a corto plazo pero erosionan la confianza institucional.",
    empatico: "«Siento una profunda esperanza cuando veo la resiliencia de nuestra gente. Hemos salido más fuertes de cada crisis.»",
    polarizador: "«Deberían tener miedo. Porque lo que viene, si no actuamos ahora, será peor de lo que imaginan.»",
  },
  disenso: {
    detail: "Mide la capacidad de reconocer y validar puntos de vista contrarios sin descalificarlos. Su presencia es señal de madurez democrática; su ausencia correlaciona con autoritarismo discursivo, aunque no necesariamente con autoritarismo institucional.",
    empatico: "«Hay personas que votan diferente a nosotros con razones respetables. Esta política también debe funcionar para ellas.»",
    polarizador: "«Los que se oponen solo pueden tener dos motivos: ignorancia o mala fe. No voy a perder el tiempo debatiendo con ellos.»",
  },
  vector: {
    detail: "Examina el tipo de acción que el discurso convoca. Los vectores cooperativos ('trabajemos juntos', 'construyamos') generan capital social. Los de confrontación ('derrotemos', 'paremos a') pueden ser legítimos pero tienen un coste cohesivo alto.",
    empatico: "«Los invito a que este proceso lo hagamos entre todos. La solución vendrá de cada comunidad, no de arriba.»",
    polarizador: "«Hay que salir a las calles a demostrarles quién tiene el poder. Que nos vean. Que tiemblen.»",
  },
  coherencia: {
    detail: "Analiza la distancia entre el contenido emocional del discurso y las acciones observables del hablante. Es el parámetro más difícil de medir porque requiere contexto extradiscursivo y seguimiento longitudinal.",
    empatico: "«He dicho siempre que la transparencia es innegociable, y hoy publico todos mis datos patrimoniales sin que nadie me lo exija.»",
    polarizador: "«Hablo de diálogo todos los días.» [Mientras bloquea sistemáticamente los canales de participación institucional.]",
  },
  proyeccion: {
    detail: "Evalúa el horizonte temporal del discurso. Los discursos empáticos construyen un futuro compartido con agencia colectiva. Los polarizadores se anclan en el pasado como agravio o en un presente de crisis permanente, sin ofrecer horizonte real.",
    empatico: "«Dentro de veinte años, cuando nuestros hijos pregunten qué hicimos aquí, quiero que podamos decirles que elegimos el entendimiento.»",
    polarizador: "«Siempre nos han hecho lo mismo. Y si no frenamos esto ahora, nos lo seguirán haciendo para siempre.»",
  },
};

const ENTITIES = [
  {
    id: "ardern", name: "Jacinda Ardern", category: "Político", country: "Nueva Zelanda", flag: "🇳🇿",
    score: 8.75,
    params: { pronominal:9.1, metafora:9.0, dicotomia:8.2, tono:9.0, disenso:8.8, vector:9.0, coherencia:8.9, proyeccion:8.0 },
    context: "Primera ministra de Nueva Zelanda (2017–2023). Analizado sobre respuesta a Christchurch (2019) y discurso ONU (2018).",
  },
  {
    id: "sheinbaum", name: "Claudia Sheinbaum", category: "Político", country: "México", flag: "🇲🇽",
    score: 7.92,
    params: { pronominal:8.1, metafora:8.0, dicotomia:7.5, tono:8.2, disenso:7.8, vector:8.0, coherencia:7.9, proyeccion:7.8 },
    context: "Presidenta de México (2024–). Analizado sobre discurso de victoria (2024) y respuesta a aranceles Trump (2025).",
  },
  {
    id: "petro", name: "Gustavo Petro", category: "Político", country: "Colombia", flag: "🇨🇴",
    score: 5.60,
    params: { pronominal:6.8, metafora:5.2, dicotomia:4.5, tono:6.0, disenso:5.1, vector:5.8, coherencia:5.2, proyeccion:6.2 },
    context: "Presidente de Colombia (2022–). IRA promedio sobre IX Cumbre CELAC (2025) y mitin Consulta Popular (2025).",
  },
  {
    id: "trump", name: "Donald Trump", category: "Político", country: "Estados Unidos", flag: "🇺🇸",
    score: 2.48,
    params: { pronominal:2.5, metafora:1.8, dicotomia:2.0, tono:2.1, disenso:1.5, vector:2.0, coherencia:2.8, proyeccion:3.1 },
    context: "Presidente de EEUU (2017–2021, 2024–). Analizado sobre discurso victoria 2024 y mitin 'We Will Never Concede' (2021).",
  },
  {
    id: "elpais", name: "El País", category: "Medio", country: "España", flag: "🇪🇸",
    score: 6.38,
    params: { pronominal:6.5, metafora:6.2, dicotomia:6.0, tono:6.8, disenso:6.1, vector:6.4, coherencia:6.3, proyeccion:6.5 },
    context: "Medio generalista español de referencia. Registro relativamente neutro con deslizamientos editoriales.",
  },
  {
    id: "rt", name: "RT (Russia Today)", category: "Medio", country: "Rusia / Global", flag: "🌐",
    score: 1.95,
    params: { pronominal:2.0, metafora:1.5, dicotomia:1.8, tono:1.6, disenso:1.2, vector:1.8, coherencia:2.1, proyeccion:2.5 },
    context: "Canal internacional ruso. Polarización estructural como objetivo editorial. El conflicto es el producto.",
  },
];

const PARAM_COLORS = ["#ff6600","#e8a838","#6ec6a0","#5ba8d4","#a07cd4","#e05890","#50c8b4","#c8a050"];

function scoreColor(s) {
  if (s >= 7) return "#6ec6a0";
  if (s >= 4.5) return "#e8a838";
  return "#e05252";
}

function ScoreRing({ score, size = 80, stroke = 5 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 10) * circ;
  const col = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      fontSize:"9px", letterSpacing:"0.12em", textTransform:"uppercase",
      color, border:`1px solid ${color}40`, padding:"2px 7px", borderRadius:"20px",
      fontFamily:"'DM Mono',monospace",
    }}>{label}</span>
  );
}

function catColor(cat) {
  return cat === "Político" ? "#ff6600" : cat === "Medio" ? "#5ba8d4" : "#6ec6a0";
}

function EntityCard({ entity, onClick }) {
  const [hov, setHov] = useState(false);
  const col = scoreColor(entity.score);
  return (
    <div onClick={() => onClick(entity)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius:"16px", padding:"20px", cursor:"pointer",
        transition:"all 0.25s ease", transform: hov ? "translateY(-3px)" : "none",
        backdropFilter:"blur(8px)",
      }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
        <div>
          <div style={{ marginBottom:"6px", display:"flex", gap:"6px", alignItems:"center" }}>
            <span style={{ fontSize:"16px" }}>{entity.flag}</span>
            <Badge label={entity.category} color={catColor(entity.category)} />
          </div>
          <h3 style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.02em" }}>
            {entity.name}
          </h3>
          <p style={{ margin:"2px 0 0", fontSize:"10px", color:"rgba(255,255,255,0.3)", letterSpacing:"0.04em" }}>{entity.country}</p>
        </div>
        <div style={{ position:"relative", flexShrink:0 }}>
          <ScoreRing score={entity.score} size={64} stroke={4} />
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
            <span style={{ fontSize:"14px", fontWeight:700, color:col, fontFamily:"'DM Mono',monospace" }}>
              {entity.score.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:"3px", marginBottom:"10px" }}>
        {PARAMS.map((p,i) => (
          <div key={i} style={{
            flex:1, height:"3px", borderRadius:"2px",
            background: PARAM_COLORS[i],
            opacity: 0.3 + (entity.params[p.id] / 10) * 0.7,
          }} />
        ))}
      </div>
      <p style={{ margin:0, fontSize:"10px", color:"rgba(255,255,255,0.25)", letterSpacing:"0.06em" }}>Ver análisis →</p>
    </div>
  );
}

function Detail({ entity, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);
  const col = scoreColor(entity.score);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:200,
      background:"rgba(8,8,12,0.88)", backdropFilter:"blur(20px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      opacity: mounted ? 1 : 0, transition:"opacity 0.3s ease", padding:"20px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#0e0e14", border:"1px solid rgba(255,255,255,0.09)",
        borderRadius:"20px", padding:"32px", maxWidth:"520px", width:"100%",
        maxHeight:"88vh", overflowY:"auto",
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
          <div>
            <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"8px" }}>
              <span style={{ fontSize:"20px" }}>{entity.flag}</span>
              <Badge label={entity.category} color={catColor(entity.category)} />
            </div>
            <h2 style={{ margin:"0 0 2px", fontSize:"24px", fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.03em" }}>
              {entity.name}
            </h2>
            <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.3)" }}>{entity.country}</p>
          </div>
          <div style={{ position:"relative" }}>
            <ScoreRing score={entity.score} size={88} stroke={5} />
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
              <span style={{ fontSize:"20px", fontWeight:800, color:col, fontFamily:"'DM Mono',monospace", display:"block" }}>
                {entity.score.toFixed(2)}
              </span>
              <span style={{ fontSize:"8px", color:"rgba(255,255,255,0.25)", letterSpacing:"0.08em" }}>IRA</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize:"11.5px", color:"rgba(255,255,255,0.4)", lineHeight:1.6, marginBottom:"24px", borderLeft:"2px solid rgba(255,102,0,0.4)", paddingLeft:"12px" }}>
          {entity.context}
        </p>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"20px" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:"16px" }}>
            8 Parámetros IRA
          </p>
          {PARAMS.map((p, i) => {
            const val = entity.params[p.id];
            const isOpen = expanded === p.id;
            const det = PARAM_DETAILS[p.id];
            return (
              <div key={i} style={{ marginBottom:"14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"5px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                    <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", letterSpacing:"0.04em" }}>{p.label}</span>
                    <button
                      onClick={() => setExpanded(isOpen ? null : p.id)}
                      style={{
                        background: isOpen ? "#ff6600" : "rgba(255,102,0,0.12)",
                        border: "1px solid rgba(255,102,0,0.55)",
                        borderRadius:"4px", padding:"2px 7px",
                        color: isOpen ? "#fff" : "#ff6600",
                        fontSize:"9px", cursor:"pointer", lineHeight:"1.5",
                        transition:"all 0.18s ease", fontFamily:"'DM Mono',monospace",
                        letterSpacing:"0.04em", fontWeight: isOpen ? 700 : 400,
                      }}
                    >{isOpen ? "▲" : "▼"}</button>
                  </div>
                  <span style={{ fontSize:"12px", fontWeight:700, color:PARAM_COLORS[i], fontFamily:"'DM Mono',monospace" }}>
                    {val.toFixed(1)}
                  </span>
                </div>
                <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"4px", height:"3px", overflow:"hidden" }}>
                  <div style={{
                    height:"100%", width:`${(val/10)*100}%`,
                    background:`linear-gradient(90deg,${PARAM_COLORS[i]}80,${PARAM_COLORS[i]})`,
                    borderRadius:"4px", transition:"width 0.8s ease",
                  }} />
                </div>
                <p style={{ margin:"4px 0 0", fontSize:"10.5px", color:"rgba(255,255,255,0.28)", lineHeight:1.5 }}>{p.desc}</p>
                {isOpen && (
                  <div style={{
                    marginTop:"10px",
                    background:"rgba(255,255,255,0.02)",
                    border:`1px solid ${PARAM_COLORS[i]}20`,
                    borderRadius:"10px", padding:"13px",
                  }}>
                    <p style={{ margin:"0 0 12px", fontSize:"11px", color:"rgba(255,255,255,0.48)", lineHeight:1.65 }}>
                      {det.detail}
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                      <div style={{ background:"rgba(110,198,160,0.06)", border:"1px solid rgba(110,198,160,0.18)", borderRadius:"8px", padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 5px", fontSize:"8px", letterSpacing:"0.14em", color:"#6ec6a0", textTransform:"uppercase" }}>Empático</p>
                        <p style={{ margin:0, fontSize:"10.5px", color:"rgba(255,255,255,0.42)", lineHeight:1.55, fontStyle:"italic", fontFamily:"Georgia,serif" }}>{det.empatico}</p>
                      </div>
                      <div style={{ background:"rgba(224,82,82,0.06)", border:"1px solid rgba(224,82,82,0.18)", borderRadius:"8px", padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 5px", fontSize:"8px", letterSpacing:"0.14em", color:"#e05252", textTransform:"uppercase" }}>Polarizador</p>
                        <p style={{ margin:0, fontSize:"10.5px", color:"rgba(255,255,255,0.42)", lineHeight:1.55, fontStyle:"italic", fontFamily:"Georgia,serif" }}>{det.polarizador}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={onClose} style={{
          marginTop:"20px", width:"100%", padding:"11px",
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"10px", color:"rgba(255,255,255,0.4)", fontSize:"11px",
          cursor:"pointer", letterSpacing:"0.08em",
        }}>Cerrar</button>
      </div>
    </div>
  );
}

function Analyzer() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Político");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!text.trim() || text.trim().length < 50) { setError("El texto es demasiado corto. Mínimo 50 caracteres."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ ...data, name: name || "Texto analizado", category });
    } catch(e) {
      setError(e.message || "Error al analizar. Intenta de nuevo.");
    }
    setLoading(false);
  }

  if (result) return <AnalysisResult result={result} onReset={() => setResult(null)} />;

  return (
    <div style={{ maxWidth:"640px", margin:"0 auto" }}>
      <div style={{ marginBottom:"20px" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:"6px" }}>
          Nombre / Fuente (opcional)
        </p>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="ej. Discurso de Milei, mayo 2025"
          style={{
            width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"10px", padding:"10px 14px", color:"#fff", fontSize:"13px",
            outline:"none", boxSizing:"border-box", fontFamily:"'DM Mono',monospace",
          }} />
      </div>
      <div style={{ marginBottom:"20px" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:"6px" }}>
          Categoría
        </p>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {["Político","Medio","Otro"].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding:"7px 14px", borderRadius:"20px",
              border: category===cat ? "1px solid rgba(255,102,0,0.6)" : "1px solid rgba(255,255,255,0.08)",
              background: category===cat ? "rgba(255,102,0,0.12)" : "transparent",
              color: category===cat ? "#ff6600" : "rgba(255,255,255,0.35)",
              fontSize:"10px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
              transition:"all 0.2s ease",
            }}>{cat}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:"20px" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:"6px" }}>
          Texto a analizar — español o inglés
        </p>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Pega aquí el discurso, artículo, declaración o texto que quieres medir..."
          rows={8}
          style={{
            width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"12px", padding:"14px", color:"rgba(255,255,255,0.8)", fontSize:"12.5px",
            outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6,
            fontFamily:"Georgia, serif",
          }} />
        <p style={{ margin:"6px 0 0", fontSize:"10px", color:"rgba(255,255,255,0.2)" }}>
          {text.length} caracteres
        </p>
      </div>
      {error && <p style={{ color:"#e05252", fontSize:"11px", marginBottom:"14px" }}>{error}</p>}
      <button onClick={analyze} disabled={loading} style={{
        width:"100%", padding:"14px",
        background: loading ? "rgba(255,102,0,0.1)" : "rgba(255,102,0,0.2)",
        border:"1px solid rgba(255,102,0,0.4)", borderRadius:"12px",
        color: loading ? "rgba(255,102,0,0.4)" : "#ff6600",
        fontSize:"12px", letterSpacing:"0.12em", textTransform:"uppercase",
        cursor: loading ? "not-allowed" : "pointer", transition:"all 0.2s ease",
        fontFamily:"'DM Mono',monospace",
      }}>
        {loading ? "Analizando..." : "Calcular IRA →"}
      </button>
    </div>
  );
}

function AnalysisResult({ result, onReset }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);
  const col = scoreColor(result.ira);
  return (
    <div style={{ maxWidth:"640px", margin:"0 auto", opacity: mounted?1:0, transition:"opacity 0.4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"20px", marginBottom:"28px",
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:"16px", padding:"20px" }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <ScoreRing score={result.ira} size={88} stroke={5} />
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
            <span style={{ fontSize:"20px", fontWeight:800, color:col, fontFamily:"'DM Mono',monospace", display:"block" }}>
              {result.ira.toFixed(2)}
            </span>
            <span style={{ fontSize:"8px", color:"rgba(255,255,255,0.25)", letterSpacing:"0.08em" }}>IRA</span>
          </div>
        </div>
        <div>
          <Badge label={result.category} color={catColor(result.category)} />
          <h3 style={{ margin:"6px 0 4px", fontSize:"20px", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif" }}>
            {result.name}
          </h3>
          <p style={{ margin:0, fontSize:"11.5px", color:"rgba(255,255,255,0.4)", lineHeight:1.55 }}>
            {result.summary}
          </p>
        </div>
      </div>
      {PARAMS.map((p, i) => {
        const val = result.params[p.id].score;
        const desc = result.params[p.id].desc;
        return (
          <div key={i} style={{ marginBottom:"14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
              <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>{p.label}</span>
              <span style={{ fontSize:"12px", fontWeight:700, color:PARAM_COLORS[i], fontFamily:"'DM Mono',monospace" }}>
                {val.toFixed(1)}
              </span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"4px", height:"3px", overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${(val/10)*100}%`,
                background:`linear-gradient(90deg,${PARAM_COLORS[i]}80,${PARAM_COLORS[i]})`,
                borderRadius:"4px", transition:"width 0.8s ease",
              }} />
            </div>
            <p style={{ margin:"4px 0 0", fontSize:"10.5px", color:"rgba(255,255,255,0.3)", lineHeight:1.5 }}>{desc}</p>
          </div>
        );
      })}
      <button onClick={onReset} style={{
        marginTop:"20px", width:"100%", padding:"11px",
        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:"10px", color:"rgba(255,255,255,0.4)", fontSize:"11px",
        cursor:"pointer", letterSpacing:"0.08em",
      }}>← Analizar otro texto</button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("explore");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const cats = ["Todos","Político","Medio"];
  const filtered = filter === "Todos" ? ENTITIES : ENTITIES.filter(e => e.category === filter);

  return (
    <div style={{ minHeight:"100vh", background:"#08080c", fontFamily:"'DM Mono',monospace", position:"relative", overflow:"hidden" }}>
      <div style={{
        position:"fixed", top:"-15%", left:"50%", transform:"translateX(-50%)",
        width:"700px", height:"500px",
        background:"radial-gradient(ellipse, rgba(255,102,0,0.06) 0%, transparent 70%)",
        pointerEvents:"none",
      }} />
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"48px 24px 80px" }}>
        <div style={{ marginBottom:"44px", opacity: mounted?1:0, transform: mounted?"none":"translateY(16px)", transition:"all 0.6s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#ff6600", boxShadow:"0 0 10px #ff6600" }} />
            <span style={{ fontSize:"9px", letterSpacing:"0.18em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>
              Índice de Resonancia Afectiva
            </span>
          </div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(28px,5vw,46px)", fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#fff", letterSpacing:"-0.04em", lineHeight:1.05 }}>
            IRA <span style={{ color:"rgba(255,255,255,0.12)", fontWeight:400 }}>/</span>{" "}
            <span style={{ color:"#ff6600" }}>Resonancia</span>
          </h1>
          <p style={{ margin:0, fontSize:"12px", color:"rgba(255,255,255,0.3)", lineHeight:1.65, maxWidth:"500px" }}>
            Medición del lenguaje empático y polarizador en políticos, medios y países. Escala 0–10. Analiza cualquier texto con IA.
          </p>
        </div>

        <div style={{ display:"flex", gap:"4px", marginBottom:"32px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", padding:"4px", width:"fit-content", opacity: mounted?1:0, transition:"opacity 0.5s ease 0.15s" }}>
          {[["explore","Explorar"],["analyze","Analizar texto"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding:"8px 18px", borderRadius:"9px",
              background: tab===id ? "rgba(255,102,0,0.18)" : "transparent",
              border: tab===id ? "1px solid rgba(255,102,0,0.4)" : "1px solid transparent",
              color: tab===id ? "#ff6600" : "rgba(255,255,255,0.35)",
              fontSize:"10px", letterSpacing:"0.1em", textTransform:"uppercase",
              cursor:"pointer", transition:"all 0.2s ease",
            }}>{label}</button>
          ))}
        </div>

        {tab === "explore" && (
          <>
            <div style={{ display:"flex", gap:"8px", marginBottom:"28px", flexWrap:"wrap", opacity: mounted?1:0, transition:"opacity 0.5s ease 0.2s" }}>
              {cats.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  padding:"6px 14px", borderRadius:"20px",
                  border: filter===cat ? "1px solid rgba(255,102,0,0.6)" : "1px solid rgba(255,255,255,0.08)",
                  background: filter===cat ? "rgba(255,102,0,0.12)" : "transparent",
                  color: filter===cat ? "#ff6600" : "rgba(255,255,255,0.3)",
                  fontSize:"9px", letterSpacing:"0.1em", textTransform:"uppercase",
                  cursor:"pointer", transition:"all 0.2s ease",
                }}>{cat}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"14px" }}>
              {filtered.map((entity, i) => (
                <div key={entity.id} style={{ opacity: mounted?1:0, transform: mounted?"none":"translateY(20px)", transition:`all 0.5s ease ${0.1+i*0.06}s` }}>
                  <EntityCard entity={entity} onClick={setSelected} />
                </div>
              ))}
            </div>
            <div style={{ marginTop:"40px", padding:"20px", background:"rgba(255,255,255,0.02)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ margin:0, fontSize:"10px", color:"rgba(255,255,255,0.18)", lineHeight:1.7, letterSpacing:"0.04em" }}>
                Datos basados en <em style={{ color:"rgba(255,255,255,0.3)" }}>El contagio de las palabras</em> (Grisales, UCM 2024). IRA — metodología en desarrollo.
              </p>
            </div>
          </>
        )}

        {tab === "analyze" && (
          <div style={{ opacity: mounted?1:0, transition:"opacity 0.4s ease 0.1s" }}>
            <div style={{ marginBottom:"28px" }}>
              <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:"6px" }}>Cómo funciona</p>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", lineHeight:1.65, margin:0, maxWidth:"520px" }}>
                Pega cualquier texto en español o inglés. La IA lo analizará contra los 8 parámetros del IRA y generará una puntuación y síntesis interpretativa.
              </p>
            </div>
            <Analyzer />
          </div>
        )}
      </div>
      {selected && <Detail entity={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
