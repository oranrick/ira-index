import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';

const PARAM_COLORS = ["#ff6600","#e8a838","#6ec6a0","#5ba8d4","#a07cd4","#e05890","#50c8b4","#c8a050"];

const AUTHORS = [
  {
    name: "Antonio Damasio",
    work: { es: "El error de Descartes (1994)", en: "Descartes' Error (1994)" },
    color: "#ff6600",
    contribution: {
      es: "Las emociones no son el ruido de la razón — son su substrato. Pacientes con daño límbico no se vuelven más racionales: se vuelven incapaces de decidir.",
      en: "Emotions are not the noise of reason — they are its substrate. Patients with limbic damage don't become more rational: they become incapable of deciding.",
    },
  },
  {
    name: "Vittorio Gallese",
    work: { es: "Neuronas espejo (2003–)", en: "Mirror Neurons (2003–)" },
    color: "#e8a838",
    contribution: {
      es: "Cuando escuchamos describir una emoción, activamos parcialmente las mismas redes que si la sintiéramos. El contagio de las palabras no es metáfora: es neurociencia.",
      en: "When we hear an emotion described, we partially activate the same networks as if we felt it. The contagion of words is not a metaphor: it is neuroscience.",
    },
  },
  {
    name: "George Lakoff",
    work: { es: "Metáforas de la vida cotidiana (1980)", en: "Metaphors We Live By (1980)" },
    color: "#6ec6a0",
    contribution: {
      es: "Las metáforas conceptuales no son adornos: estructuran cómo percibimos la realidad. «Drenar el pantano» no es hipérbole — es un marco cognitivo que determina qué preguntas nos parecen posibles.",
      en: "Conceptual metaphors are not ornaments: they structure how we perceive reality. «Drain the swamp» is not hyperbole — it's a cognitive frame that determines which questions seem possible.",
    },
  },
  {
    name: "Teun van Dijk",
    work: { es: "Análisis Crítico del Discurso (1993–)", en: "Critical Discourse Analysis (1993–)" },
    color: "#5ba8d4",
    contribution: {
      es: "El discurso no es neutro: construye identidades, consolida jerarquías y naturaliza el poder. El IRA hereda esta tradición y la aplica a la dimensión afectiva.",
      en: "Discourse is not neutral: it constructs identities, consolidates hierarchies, and naturalizes power. The IRA inherits this tradition and applies it to the affective dimension.",
    },
  },
  {
    name: "Eva Illouz",
    work: { es: "Capitalismo emocional (2007)", en: "Cold Intimacies (2007)" },
    color: "#a07cd4",
    contribution: {
      es: "El mercado no solo produce bienes: produce emociones. Los discursos políticos han colonizado el léxico terapéutico. El IRA detecta esos deslizamientos.",
      en: "The market doesn't only produce goods: it produces emotions. Political discourses have colonized therapeutic lexicon. The IRA detects those slippages.",
    },
  },
  {
    name: "Roberto Esposito",
    work: { es: "Communitas / Immunitas (1998 / 2002)", en: "Communitas / Immunitas (1998 / 2002)" },
    color: "#e05890",
    contribution: {
      es: "Toda comunidad política se define por lo que excluye. La exclusión se construye con metáforas de contaminación y pureza. El parámetro de Carga Dicotómica mide exactamente eso.",
      en: "Every political community defines itself by what it excludes. Exclusion is built with metaphors of contamination and purity. The Dichotomous Load parameter measures exactly that.",
    },
  },
];

const PARAMS_BRIEF = [
  { es: "Pronombres y vínculo",  en: "Pronouns & Bond",       desc_es: "¿El «nosotros» integra o excluye?",              desc_en: "Does the 'we' integrate or exclude?" },
  { es: "Marco metafórico",      en: "Metaphorical Frame",     desc_es: "¿Construye comunidad o enemigo?",                desc_en: "Does it build community or enemy?" },
  { es: "Polaridad moral",       en: "Moral Polarity",         desc_es: "¿Divide el mundo en buenos y malos?",            desc_en: "Does it divide the world into good and evil?" },
  { es: "Tono emocional",        en: "Emotional Tone",         desc_es: "¿Qué emoción instala en el receptor?",           desc_en: "What emotion does it install in the receiver?" },
  { es: "Apertura al disenso",   en: "Openness to Dissent",    desc_es: "¿Valida la diferencia o la clausura?",           desc_en: "Does it validate difference or shut it down?" },
  { es: "Llamada a la acción",   en: "Call to Action",         desc_es: "¿Convoca a cooperar o a confrontar?",            desc_en: "Does it call for cooperation or confrontation?" },
  { es: "Engagement dialógico",  en: "Dialogic Engagement",    desc_es: "¿Lo que dice coincide con lo que hace?",         desc_en: "Does what it says match what it does rhetorically?" },
  // P8 (Horizonte de futuro) eliminado de la fórmula — retirado por decisión del autor (jul 2026)
];

export default function AboutPage() {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const es = lang !== 'en';

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e14", fontFamily:"'DM Mono',monospace", overflowX:"hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,-30px) scale(1.1);} }
        @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-30px,40px) scale(1.08);} }
        .about-fade { opacity:0; animation: fadeUp 0.7s ease forwards; }
      `}</style>

      {/* Blobs */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-10%", left:"5%", width:"55vw", height:"55vh", borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,102,0,0.08) 0%, transparent 65%)", animation:"blobA 20s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"-15%", right:"-5%", width:"50vw", height:"50vh", borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(220,60,160,0.06) 0%, transparent 65%)", animation:"blobB 26s ease-in-out infinite" }} />
      </div>

      {/* Back */}
      <button onClick={() => navigate(-1)} className="top-nav-left" style={{
        fontFamily:"'DM Mono',monospace", fontSize:"11px", fontWeight:700,
        color:"#ff6600", letterSpacing:"0.04em", border:"1.5px solid rgba(255,102,0,0.4)",
        borderRadius:"20px", padding:"5px 13px", background:"rgba(255,102,0,0.07)", cursor:"pointer",
      }}>{es ? "← Volver" : "← Back"}</button>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── HERO — título dramático ── */}
        <div style={{ maxWidth:"900px", margin:"0 auto", padding:"120px 24px 80px",
          opacity:mounted?1:0, transform:mounted?"none":"translateY(20px)", transition:"all 0.6s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"24px" }}>
            <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#ff6600", boxShadow:"0 0 8px #ff6600" }} />
            <span style={{ fontSize:"9px", letterSpacing:"0.22em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>
              {es ? "Sobre el proyecto" : "About the project"}
            </span>
          </div>

          {/* Frase grande partido en líneas */}
          <div style={{ marginBottom:"60px" }}>
            <p style={{ margin:0, fontSize:"clamp(36px,7vw,72px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
              color:"rgba(255,255,255,0.08)", lineHeight:1, letterSpacing:"-0.04em" }}>
              {es ? "Las palabras" : "Words don't"}
            </p>
            <p style={{ margin:0, fontSize:"clamp(36px,7vw,72px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
              color:"rgba(255,255,255,0.25)", lineHeight:1, letterSpacing:"-0.04em" }}>
              {es ? "no solo describen" : "just describe"}
            </p>
            <p style={{ margin:0, fontSize:"clamp(36px,7vw,72px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
              color:"#fff", lineHeight:1, letterSpacing:"-0.04em" }}>
              {es ? "la realidad." : "reality."}
            </p>
            <p style={{ margin:0, fontSize:"clamp(36px,7vw,72px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
              color:"#ff6600", lineHeight:1, letterSpacing:"-0.04em" }}>
              {es ? "La configuran." : "They shape it."}
            </p>
          </div>

          {/* Stats strip */}
          <div style={{ display:"flex", gap:"0", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {[
              { num:"7",    label: es?"parámetros":"parameters" },
              { num:"0—10", label: es?"escala IRA":"IRA scale" },
              { num:"6",    label: es?"autores clave":"key authors" },
              { num:"2024", label: es?"UCM Madrid":"UCM Madrid" },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, padding:"20px 0", textAlign:"center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <p style={{ margin:0, fontSize:"clamp(22px,4vw,36px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
                  color:"#ff6600", letterSpacing:"-0.02em" }}>{s.num}</p>
                <p style={{ margin:"4px 0 0", fontSize:"9px", color:"rgba(255,255,255,0.2)", letterSpacing:"0.12em", textTransform:"uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ORIGEN ── */}
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 24px 80px" }}>

          <Label es={es} es_text="El origen" en_text="The origin" />

          {/* Pull quote dramático */}
          <blockquote style={{ margin:"0 0 40px", padding:"0 0 0 20px",
            borderLeft:"3px solid rgba(224,82,82,0.6)" }}>
            <p style={{ margin:0, fontSize:"clamp(18px,3vw,24px)", fontWeight:700, fontFamily:"'Syne',sans-serif",
              color:"rgba(224,82,82,0.85)", lineHeight:1.3, letterSpacing:"-0.01em" }}>
              {es ? "«Yo mataría a toda esa gente.»" : "«I would kill all those people.»"}
            </p>
            <p style={{ margin:"10px 0 0", fontSize:"11px", color:"rgba(255,255,255,0.25)", fontStyle:"italic" }}>
              {es ? "— Frase escuchada demasiadas veces. Origen del IRA." : "— A phrase heard too many times. The origin of the IRA."}
            </p>
          </blockquote>

          <Prose es={es}
            es="La pregunta que dio origen al IRA no nació en una biblioteca. Nació de escuchar, una y otra vez, a personas decir cosas así — refiriéndose a políticos, a votantes del bando contrario, a desconocidos. No como amenaza real, sino como expresión cotidiana de un odio que se había normalizado hasta volverse invisible."
            en="The question that gave rise to the IRA was not born in a library. It was born from hearing, again and again, people say things like that — referring to politicians, to voters on the other side, to strangers. Not as a real threat, but as an everyday expression of a hatred so normalized it had turned invisible."
          />
          <Prose es={es}
            es="¿De dónde viene tanta ira? La respuesta que fue tomando forma es esta: somos una sociedad herida. Y las heridas se infectan cuando el lenguaje las toca todos los días — con metáforas de guerra, con enemigos fabricados, con miedo dosificado como combustible electoral."
            en="Where does all this rage come from? The answer that took shape is this: we are a wounded society. And wounds become infected when language touches them every day — with war metaphors, manufactured enemies, fear dispensed as electoral fuel."
          />
          <Prose es={es}
            es="Si la empatía tiene una base biológica — las neuronas espejo, el sistema límbico, la inteligencia emocional como capacidad entrenable — entonces la polarización también la tiene. Y si el odio se contagia a través del lenguaje, la empatía también puede contagiarse. Esa intuición es el fundamento del IRA."
            en="If empathy has a biological basis — mirror neurons, the limbic system, emotional intelligence as a trainable capacity — then polarization has one too. And if hatred spreads through language, empathy can spread through language too. That intuition is the foundation of the IRA."
          />

          {/* TFG callout */}
          <div style={{ margin:"32px 0 0", padding:"20px 22px", background:"rgba(255,102,0,0.05)",
            border:"1px solid rgba(255,102,0,0.15)", borderRadius:"14px" }}>
            <p style={{ margin:"0 0 6px", fontSize:"9px", letterSpacing:"0.14em", color:"rgba(255,102,0,0.6)", textTransform:"uppercase" }}>
              {es ? "Trabajo de Fin de Grado" : "Bachelor's Thesis"}
            </p>
            <p style={{ margin:0, fontSize:"13px", fontWeight:700, fontFamily:"'Syne',sans-serif", color:"#fff", lineHeight:1.35 }}>
              {es ? "«El contagio de las palabras: Metáforas, empatía y polarización en el discurso político contemporáneo»"
                  : "«The Contagion of Words: Metaphors, Empathy and Polarization in Contemporary Political Discourse»"}
            </p>
            <p style={{ margin:"8px 0 0", fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>
              Ricardo Grisales Ramírez · UCM Periodismo · 2024
            </p>
          </div>
        </div>

        {/* ── MARCO TEÓRICO ── */}
        <div style={{ background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"80px 24px" }}>
          <div style={{ maxWidth:"900px", margin:"0 auto" }}>
            <Label es={es} es_text="El marco teórico" en_text="Theoretical framework" />
            <h2 style={{ margin:"0 0 12px", fontSize:"clamp(22px,4vw,36px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
              color:"#fff", letterSpacing:"-0.03em", lineHeight:1.15 }}>
              {es ? "Antes de llegar al cerebro,\npasa por el cuerpo" : "Before it reaches the brain,\nit passes through the body"}
            </h2>
            <p style={{ margin:"0 0 48px", fontSize:"12px", color:"rgba(255,255,255,0.35)", maxWidth:"520px", lineHeight:1.7 }}>
              {es ? "Seis autores que explican por qué las palabras no son neutras — y por qué medirlas importa."
                  : "Six authors that explain why words are not neutral — and why measuring them matters."}
            </p>

            {/* Grid de autores */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"16px" }}>
              {AUTHORS.map((a, i) => (
                <div key={i} style={{
                  background:`${a.color}08`,
                  border:`1px solid ${a.color}22`,
                  borderRadius:"14px", padding:"20px",
                  transition:"border-color 0.2s, background 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`${a.color}55`; e.currentTarget.style.background=`${a.color}12`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=`${a.color}22`; e.currentTarget.style.background=`${a.color}08`; }}
                >
                  <p style={{ margin:"0 0 4px", fontSize:"15px", fontWeight:800, fontFamily:"'Syne',sans-serif", color:a.color }}>
                    {a.name}
                  </p>
                  <p style={{ margin:"0 0 12px", fontSize:"9.5px", color:"rgba(255,255,255,0.25)", fontStyle:"italic" }}>
                    {es ? a.work.es : a.work.en}
                  </p>
                  <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
                    {es ? a.contribution.es : a.contribution.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LA BRECHA ── */}
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"80px 24px" }}>
          <Label es={es} es_text="La brecha" en_text="The gap" />

          {/* Pull quote central */}
          <div style={{ margin:"0 0 40px", textAlign:"center" }}>
            <p style={{ margin:0, fontSize:"clamp(14px,2.5vw,20px)", fontStyle:"italic", fontFamily:"Georgia, serif",
              color:"rgba(255,255,255,0.6)", lineHeight:1.6, maxWidth:"520px", marginInline:"auto" }}>
              {es ? "«No es una herramienta de verdad o mentira. Es una herramienta de arquitectura emocional.»"
                  : "«It is not a tool of truth or falsehood. It is a tool of emotional architecture.»"}
            </p>
          </div>

          {/* Tres herramientas que no son el IRA */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"32px" }}>
            {[
              { tool:"Fact-checking",    does: es?"Verifica hechos":"Verifies facts",             limit: es?"No mide el marco":"Doesn't measure the frame" },
              { tool: es?"Análisis de sentimiento":"Sentiment analysis", does: es?"Positivo / negativo":"Positive / negative", limit: es?"No mide a quién se dirige":"Doesn't measure the target" },
              { tool: es?"Periodismo de datos":"Data journalism",  does: es?"Cuantifica tendencias":"Quantifies trends", limit: es?"No mide el contagio":"Doesn't measure contagion" },
            ].map((t, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:"10px", padding:"14px 12px" }}>
                <p style={{ margin:"0 0 6px", fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.tool}</p>
                <p style={{ margin:"0 0 8px", fontSize:"11px", color:"rgba(255,255,255,0.6)" }}>{t.does}</p>
                <p style={{ margin:0, fontSize:"10px", color:"rgba(224,82,82,0.6)", fontStyle:"italic" }}>↳ {t.limit}</p>
              </div>
            ))}
          </div>

          <Prose es={es}
            es="El IRA hace otra pregunta: ¿Qué tipo de sujeto político construye este discurso? ¿Convoca a una comunidad o excluye a un enemigo? ¿Activa la esperanza o el miedo? ¿Es coherente lo que dice con lo que hace retóricamente?"
            en="The IRA asks a different question: What kind of political subject does this discourse construct? Does it summon a community or exclude an enemy? Does it activate hope or fear? Does what it says match what it rhetorically does?"
          />
        </div>

        {/* ── 8 PARÁMETROS ── */}
        <div style={{ background:"rgba(255,255,255,0.015)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"80px 24px" }}>
          <div style={{ maxWidth:"900px", margin:"0 auto" }}>
            <Label es={es} es_text="La metodología" en_text="The methodology" />
            <div style={{ display:"flex", alignItems:"baseline", gap:"16px", marginBottom:"40px", flexWrap:"wrap" }}>
              <h2 style={{ margin:0, fontSize:"clamp(22px,4vw,36px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
                color:"#fff", letterSpacing:"-0.03em" }}>
                {es ? "7 dimensiones." : "7 dimensions."}
              </h2>
              <span style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:800, fontFamily:"'Syne',sans-serif",
                color:"rgba(255,255,255,0.15)", letterSpacing:"-0.03em" }}>
                {es ? "Una puntuación." : "One score."}
              </span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"12px" }}>
              {PARAMS_BRIEF.map((p, i) => (
                <div key={i} style={{ padding:"16px", borderRadius:"12px",
                  background:"rgba(255,255,255,0.02)", border:`1px solid ${PARAM_COLORS[i]}22`,
                  borderLeft:`3px solid ${PARAM_COLORS[i]}` }}>
                  <p style={{ margin:"0 0 6px", fontSize:"12px", fontWeight:700, color:PARAM_COLORS[i], fontFamily:"'Syne',sans-serif" }}>
                    {es ? p.es : p.en}
                  </p>
                  <p style={{ margin:0, fontSize:"10.5px", color:"rgba(255,255,255,0.35)", lineHeight:1.55 }}>
                    {es ? p.desc_es : p.desc_en}
                  </p>
                </div>
              ))}
            </div>

            {/* Escala visual */}
            <div style={{ marginTop:"40px", display:"flex", alignItems:"center", gap:"12px" }}>
              <span style={{ fontSize:"10px", color:"#e05252", fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>
                0 — {es?"Máx. polarización":"Max. polarization"}
              </span>
              <div style={{ flex:1, height:"4px", borderRadius:"4px",
                background:"linear-gradient(90deg, #e05252, #e8a838 50%, #6ec6a0)" }} />
              <span style={{ fontSize:"10px", color:"#6ec6a0", fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>
                10 — {es?"Máx. empatía":"Max. empathy"}
              </span>
            </div>
          </div>
        </div>

        {/* ── VISIÓN ── */}
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"80px 24px 120px" }}>
          <Label es={es} es_text="El proyecto hoy" en_text="The project today" />

          <Prose es={es}
            es="El IRA no está terminado. Ninguna metodología de análisis del discurso lo está — el lenguaje cambia más rápido que las herramientas para medirlo. Lo que hay aquí es el comienzo de algo: una forma de leer el mundo político que combine el rigor de la academia con la urgencia del periodismo."
            en="The IRA is not finished. No discourse analysis methodology ever is — language changes faster than the tools to measure it. What exists here is the beginning of something: a way of reading the political world that combines academic rigor with journalistic urgency."
          />
          <Prose es={es}
            es="El índice sigue creciendo. Nuevos líderes, nuevos medios, nuevos corpus. La inteligencia artificial analiza en tiempo real cualquier texto que quieras medir. Y la investigación continúa — en todas las direcciones posibles."
            en="The index keeps growing. New leaders, new media, new corpora. Artificial intelligence analyzes in real time any text you want to measure. And the research continues — in every possible direction."
          />

          {/* Firma */}
          <div style={{ marginTop:"48px", padding:"28px", background:"rgba(255,102,0,0.04)",
            border:"1px solid rgba(255,102,0,0.15)", borderRadius:"16px" }}>
            <p style={{ margin:"0 0 16px", fontSize:"clamp(16px,3vw,22px)", fontStyle:"italic",
              fontFamily:"Georgia, serif", color:"rgba(255,255,255,0.7)", lineHeight:1.45 }}>
              {es ? "«Cambiar el mundo desde el amor y la ciencia dura.»"
                  : "«Changing the world through love and hard science.»"}
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ width:"1px", height:"32px", background:"rgba(255,102,0,0.4)" }} />
              <div>
                <p style={{ margin:"0 0 2px", fontSize:"11px", fontWeight:700, color:"rgba(255,102,0,0.8)", letterSpacing:"0.06em" }}>
                  Ricardo Grisales Ramírez
                </p>
                <p style={{ margin:0, fontSize:"10px", color:"rgba(255,255,255,0.25)" }}>
                  {es ? "Periodista · UCM 2024 · Creador del IRA" : "Journalist · UCM 2024 · Creator of the IRA"}
                </p>
              </div>
            </div>
            <a href="https://oranrick.com" target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block", marginTop:"14px", fontSize:"10px", color:"rgba(255,102,0,0.6)", textDecoration:"none", letterSpacing:"0.06em" }}
              onMouseEnter={e => e.currentTarget.style.color="#ff6600"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(255,102,0,0.6)"}
            >oranrick.com →</a>
          </div>

          {/* CTAs */}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"32px" }}>
            <button onClick={() => navigate('/politicos')} style={{
              padding:"12px 24px", borderRadius:"12px", background:"#ff6600", border:"none",
              color:"#000", fontSize:"12px", fontWeight:700, letterSpacing:"0.06em",
              cursor:"pointer", fontFamily:"'DM Mono',monospace", transition:"background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="#ff8533"}
              onMouseLeave={e => e.currentTarget.style.background="#ff6600"}
            >{es ? "Explorar el índice →" : "Explore the index →"}</button>
            <button onClick={() => navigate('/analyze')} style={{
              padding:"12px 24px", borderRadius:"12px",
              background:"rgba(255,102,0,0.08)", border:"1px solid rgba(255,102,0,0.3)",
              color:"#ff6600", fontSize:"12px", fontWeight:700, letterSpacing:"0.06em",
              cursor:"pointer", fontFamily:"'DM Mono',monospace", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,102,0,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,102,0,0.08)"}
            >{es ? "Analizar un texto →" : "Analyze a text →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ es, es_text, en_text }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
      <div style={{ width:"28px", height:"1px", background:"rgba(255,102,0,0.5)" }} />
      <span style={{ fontSize:"9px", letterSpacing:"0.2em", color:"rgba(255,102,0,0.55)", textTransform:"uppercase" }}>
        {es ? es_text : en_text}
      </span>
    </div>
  );
}

function Prose({ es, es: _es, en, children }) {
  const text = _es ? es : en;
  return (
    <p style={{ margin:"0 0 18px", fontSize:"12.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
      {text || children}
    </p>
  );
}
