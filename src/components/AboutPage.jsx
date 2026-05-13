import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';

const PARAM_COLORS = ["#ff6600","#e8a838","#6ec6a0","#5ba8d4","#a07cd4","#e05890","#50c8b4","#c8a050"];

const AUTHORS = [
  {
    name: "Antonio Damasio",
    work: { es: "El error de Descartes (1994)", en: "Descartes' Error (1994)" },
    role: { es: "pronominal", en: "pronominal" },
    color: "#ff6600",
    contribution: {
      es: "Demostró que las emociones no son el ruido de la razón — son su substrato. Los pacientes con daño en las regiones límbicas no se vuelven más racionales: se vuelven incapaces de decidir. El IRA parte de esta premisa: medir el lenguaje emocional es medir la lógica profunda de un discurso.",
      en: "Demonstrated that emotions are not the noise of reason — they are its substrate. Patients with limbic damage do not become more rational: they become incapable of deciding. The IRA starts from this premise: measuring emotional language is measuring the deep logic of a discourse.",
    },
  },
  {
    name: "Vittorio Gallese",
    work: { es: "Neuronas espejo y simulación encarnada (2003–)", en: "Mirror Neurons and Embodied Simulation (2003–)" },
    color: "#e8a838",
    contribution: {
      es: "Sus investigaciones sobre neuronas espejo demostraron que la experiencia emocional se contagia neurológicamente: cuando escuchamos describir una emoción, activamos parcialmente las mismas redes que si la sintiéramos. El título del TFG —El contagio de las palabras— no es una metáfora: es una descripción literal del mecanismo que el IRA mide.",
      en: "His mirror neuron research demonstrated that emotional experience is neurologically contagious: when we hear an emotion described, we partially activate the same networks as if we felt it. The TFG's title — The Contagion of Words — is not a metaphor: it is a literal description of the mechanism the IRA measures.",
    },
  },
  {
    name: "George Lakoff",
    work: { es: "Metáforas de la vida cotidiana (1980) · No pienses en un elefante (2004)", en: "Metaphors We Live By (1980) · Don't Think of an Elephant (2004)" },
    color: "#6ec6a0",
    contribution: {
      es: "Las metáforas conceptuales no son adornos retóricos: estructuran cómo percibimos la realidad. \"Drenar el pantano\" o \"fronteras abiertas\" no son hipérboles — son marcos cognitivos que determinan qué preguntas nos parecen legítimas y cuáles no llegamos siquiera a formularnos. El parámetro de Metáfora Dominante del IRA es directamente lakoffiano.",
      en: "Conceptual metaphors are not rhetorical ornaments: they structure how we perceive reality. \"Drain the swamp\" or \"open borders\" are not hyperbole — they are cognitive frames that determine which questions seem legitimate and which we never even ask. The IRA's Dominant Metaphor parameter is directly Lakoffian.",
    },
  },
  {
    name: "Teun van Dijk",
    work: { es: "Análisis Crítico del Discurso (1993–)", en: "Critical Discourse Analysis (1993–)" },
    color: "#5ba8d4",
    contribution: {
      es: "El ACD parte de la premisa de que el discurso no es neutro: construye identidades, consolida jerarquías y naturaliza relaciones de poder. El IRA hereda esta tradición metodológica y la aplica a la dimensión afectiva: no analiza solo qué dice un discurso, sino qué tipo de sujeto político construye y qué emociones instala en quien lo recibe.",
      en: "CDA starts from the premise that discourse is not neutral: it constructs identities, consolidates hierarchies, and naturalizes power relations. The IRA inherits this methodological tradition and applies it to the affective dimension: it analyzes not only what a discourse says, but what kind of political subject it constructs and what emotions it installs in the receiver.",
    },
  },
  {
    name: "Eva Illouz",
    work: { es: "Capitalismo emocional (2007) · Intimidades congeladas (2007)", en: "Cold Intimacies (2007) · Saving the Modern Soul (2008)" },
    color: "#a07cd4",
    contribution: {
      es: "El mercado no solo produce bienes: produce emociones y formas de hablar sobre ellas. Los discursos políticos contemporáneos han aprendido el léxico terapéutico del self-help y el marketing emocional. Cuando un líder habla de \"sanar\" el país o de su \"autenticidad\", usa un vocabulario colonizado por la lógica del consumo. El IRA detecta esos deslizamientos.",
      en: "The market does not only produce goods: it produces emotions and ways of speaking about them. Contemporary political discourses have learned the therapeutic lexicon of self-help and emotional marketing. When a leader speaks of \"healing\" the country or their \"authenticity\", they use a vocabulary colonized by consumer logic. The IRA detects these slippages.",
    },
  },
  {
    name: "Roberto Esposito",
    work: { es: "Comunitas / Immunitas (1998 / 2002)", en: "Communitas / Immunitas (1998 / 2002)" },
    color: "#e05890",
    contribution: {
      es: "Toda comunidad política se define tanto por lo que incluye como por lo que excluye — y la exclusión no siempre es violenta: a menudo se construye con metáforas de contaminación, pureza o amenaza externa. El concepto de immunitas de Esposito ilumina por qué ciertos discursos necesitan un enemigo interior para cohesionar al grupo. El parámetro de Carga Dicotómica mide exactamente eso.",
      en: "Every political community defines itself as much by what it includes as by what it excludes — and exclusion is not always violent: it is often built with metaphors of contamination, purity, or external threat. Esposito's concept of immunitas illuminates why certain discourses need an internal enemy to hold the group together. The Dichotomous Load parameter measures exactly that.",
    },
  },
];

const PARAMS_BRIEF = [
  { es: "Uso pronominal inclusivo", en: "Inclusive Pronominal Use",   desc_es: "¿El «nosotros» integra o excluye?",           desc_en: "Does the 'we' integrate or exclude?" },
  { es: "Metáfora dominante",       en: "Dominant Metaphor",          desc_es: "¿El imaginario construye comunidad o enemigo?", desc_en: "Does the imagery build community or enemy?" },
  { es: "Carga dicotómica",         en: "Dichotomous Load",           desc_es: "¿Divide el mundo en buenos y malos?",          desc_en: "Does it divide the world into good and evil?" },
  { es: "Tono emocional",           en: "Emotional Tone",             desc_es: "¿Qué emoción instala en quien lo recibe?",     desc_en: "What emotion does it install in the receiver?" },
  { es: "Apertura al disenso",      en: "Openness to Dissent",        desc_es: "¿Valida la diferencia o la clausura?",         desc_en: "Does it validate difference or shut it down?" },
  { es: "Vector de acción",         en: "Action Vector",              desc_es: "¿Convoca a cooperar o a confrontar?",          desc_en: "Does it call for cooperation or confrontation?" },
  { es: "Coherencia afectiva",      en: "Affective Coherence",        desc_es: "¿Lo que dice y lo que hace retóricamente coinciden?", desc_en: "Does what it says match what it rhetorically does?" },
  { es: "Proyección de futuro",     en: "Future Projection",          desc_es: "¿Abre un horizonte compartido o lo clausura?", desc_en: "Does it open a shared horizon or close it?" },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const es = lang !== 'en';

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e14", fontFamily:"'DM Mono',monospace", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes b1ab { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(60px,-40px) scale(1.12); } }
        @keyframes b2ab { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(-50px,60px) scale(1.15); } }
      `}</style>

      {/* Fondo */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-15%", left:"10%", width:"60vw", height:"60vh", borderRadius:"50%",
          background:"radial-gradient(ellipse at center, rgba(255,102,0,0.1) 0%, rgba(255,102,0,0.04) 40%, transparent 68%)",
          animation:"b1ab 22s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"-20%", right:"-5%", width:"55vw", height:"55vh", borderRadius:"50%",
          background:"radial-gradient(ellipse at center, rgba(255,102,0,0.07) 0%, transparent 65%)",
          animation:"b2ab 30s ease-in-out infinite" }} />
      </div>

      {/* Back button */}
      <button onClick={() => navigate(-1)} className="top-nav-left" style={{
        fontFamily:"'DM Mono',monospace", fontSize:"11px", fontWeight:700,
        color:"#ff6600", letterSpacing:"0.04em",
        border:"1.5px solid rgba(255,102,0,0.45)",
        borderRadius:"20px", padding:"5px 13px",
        background:"rgba(255,102,0,0.08)", cursor:"pointer",
        transition:"background 0.2s",
      }}>{es ? "← Volver" : "← Back"}</button>

      {/* Contenido */}
      <div style={{ position:"relative", zIndex:1, maxWidth:"680px", margin:"0 auto", padding:"100px 24px 100px",
        opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"all 0.5s ease" }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom:"64px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
            <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#ff6600", boxShadow:"0 0 8px #ff6600" }} />
            <span style={{ fontSize:"9px", letterSpacing:"0.2em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>
              {es ? "Sobre el proyecto" : "About the project"}
            </span>
          </div>
          <h1 style={{ margin:"0 0 20px", fontSize:"clamp(26px,5vw,40px)", fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#fff", letterSpacing:"-0.04em", lineHeight:1.1 }}>
            {es ? <>Las palabras no solo<br/>describen la realidad.<br/><span style={{ color:"#ff6600" }}>La configuran.</span></>
                 : <>Words don't just describe<br/>reality.<br/><span style={{ color:"#ff6600" }}>They shape it.</span></>}
          </h1>
          <p style={{ margin:0, fontSize:"13px", color:"rgba(255,255,255,0.4)", lineHeight:1.8, maxWidth:"560px" }}>
            {es
              ? "El IRA es una herramienta de análisis lingüístico que mide la capacidad empática o polarizadora de un discurso. Nació de una pregunta que cualquier periodista que cubre política reconocerá."
              : "The IRA is a linguistic analysis tool that measures the empathic or polarizing capacity of a discourse. It was born from a question any political journalist will recognize."}
          </p>
        </div>

        {/* ── ORIGEN ── */}
        <section style={{ marginBottom:"56px" }}>
          <SectionLabel es={es} label_es="El origen" label_en="The origin" />
          <h2 style={h2Style}>
            {es ? "Una pregunta que nació en la redacción" : "A question born in the newsroom"}
          </h2>
          <Prose>
            {es
              ? "El fact-checking funciona para los hechos. Pero los discursos más peligrosos de nuestro tiempo no mienten sobre los hechos: construyen un mundo emocional que precede al argumento lógico. Activan el miedo, trazan trincheras, convocan a la tribu — y eso no se mide con una verificación de datos."
              : "Fact-checking works for facts. But the most dangerous discourses of our time don't lie about facts: they build an emotional world that precedes the logical argument. They activate fear, draw trenches, summon the tribe — and none of that is measured by a fact-check."}
          </Prose>
          <Prose>
            {es
              ? "En 2024, Ricardo Grisales Ramírez presentó en la Facultad de Periodismo de la Universidad Complutense de Madrid su Trabajo de Fin de Grado: «El contagio de las palabras: Metáforas, empatía y polarización en el discurso político contemporáneo». El trabajo analizaba cuatro líderes — Donald Trump, Gustavo Petro, Claudia Sheinbaum y Jacinda Ardern — aplicando el Análisis Crítico del Discurso desde una perspectiva emocional y retórica."
              : "In 2024, Ricardo Grisales Ramírez presented his Bachelor's Thesis at the School of Journalism at the Complutense University of Madrid: «The Contagion of Words: Metaphors, Empathy and Polarization in Contemporary Political Discourse». The thesis analyzed four leaders — Donald Trump, Gustavo Petro, Claudia Sheinbaum and Jacinda Ardern — applying Critical Discourse Analysis from an emotional and rhetorical perspective."}
          </Prose>
          <Prose>
            {es
              ? "De esa investigación emergió el Índice de Resonancia Afectiva: ocho parámetros para medir algo que el periodismo de datos convencional no captura — la arquitectura emocional del discurso político."
              : "From that research emerged the Affective Resonance Index: eight parameters to measure something that conventional data journalism doesn't capture — the emotional architecture of political discourse."}
          </Prose>
        </section>

        {/* ── POR QUÉ EL LENGUAJE IMPORTA ── */}
        <section style={{ marginBottom:"56px" }}>
          <SectionLabel es={es} label_es="El marco teórico" label_en="Theoretical framework" />
          <h2 style={h2Style}>
            {es ? "Antes de llegar al cerebro,\npasa por el cuerpo" : "Before it reaches the brain,\nit passes through the body"}
          </h2>
          <Prose>
            {es
              ? "El punto de partida del IRA es una premisa respaldada por la neurociencia contemporánea: antes de que cualquier estímulo llegue al razonamiento lógico, atraviesa el sistema límbico, donde se originan las emociones. Las emociones no son el ruido de la razón — son su substrato."
              : "The IRA's starting point is a premise supported by contemporary neuroscience: before any stimulus reaches logical reasoning, it passes through the limbic system, where emotions originate. Emotions are not the noise of reason — they are its substrate."}
          </Prose>
          <Prose>
            {es
              ? "El IRA no juzga si un discurso es verdadero o falso, bueno o malo. Mide si activa mecanismos de empatía y cohesión social — o si, por el contrario, refuerza la polarización afectiva: esa repulsión visceral que convierte al adversario político en enemigo irreconciliable."
              : "The IRA does not judge whether a discourse is true or false, good or bad. It measures whether it activates mechanisms of empathy and social cohesion — or whether, on the contrary, it reinforces affective polarization: that visceral repulsion that transforms the political adversary into an irreconcilable enemy."}
          </Prose>

          {/* Autores */}
          <div style={{ marginTop:"32px", display:"flex", flexDirection:"column", gap:"20px" }}>
            {AUTHORS.map((a, i) => (
              <div key={i} style={{ borderLeft:`2px solid ${a.color}`, paddingLeft:"18px" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:"10px", marginBottom:"6px", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"12px", fontWeight:700, color:a.color, fontFamily:"'Syne',sans-serif" }}>{a.name}</span>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.25)", fontStyle:"italic" }}>{es ? a.work.es : a.work.en}</span>
                </div>
                <p style={{ margin:0, fontSize:"11.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>
                  {es ? a.contribution.es : a.contribution.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LA BRECHA ── */}
        <section style={{ marginBottom:"56px" }}>
          <SectionLabel es={es} label_es="La brecha" label_en="The gap" />
          <h2 style={h2Style}>
            {es ? "Lo que el fact-checking no puede medir" : "What fact-checking cannot measure"}
          </h2>

          <div style={{ margin:"24px 0", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px" }}>
            {[
              { tool: "Fact-checking",           does: es ? "Verifica si un dato es correcto o falso" : "Verifies whether a claim is correct or false" },
              { tool: es?"Análisis de sentimiento":"Sentiment analysis", does: es ? "Detecta si un texto es 'positivo' o 'negativo'" : "Detects whether a text is 'positive' or 'negative'" },
              { tool: es?"Periodismo de datos":"Data journalism",  does: es ? "Cuantifica tendencias y frecuencias" : "Quantifies trends and frequencies" },
            ].map((t, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"10px", padding:"14px" }}>
                <p style={{ margin:"0 0 6px", fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{t.tool}</p>
                <p style={{ margin:0, fontSize:"10.5px", color:"rgba(255,255,255,0.3)", lineHeight:1.6 }}>{t.does}</p>
              </div>
            ))}
          </div>

          {/* Pull quote */}
          <blockquote style={{ margin:"28px 0", padding:"20px 24px", borderLeft:"3px solid #ff6600", background:"rgba(255,102,0,0.04)", borderRadius:"0 10px 10px 0" }}>
            <p style={{ margin:0, fontSize:"13px", fontStyle:"italic", fontFamily:"Georgia, serif", color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>
              {es
                ? "El IRA hace otra pregunta: ¿Qué tipo de sujeto político construye este discurso? ¿Convoca a una comunidad o excluye a un enemigo? ¿Activa la esperanza o el miedo? No es una herramienta de verdad o mentira — es una herramienta de arquitectura emocional."
                : "The IRA asks a different question: What kind of political subject does this discourse construct? Does it summon a community or exclude an enemy? Does it activate hope or fear? It is not a tool of truth or falsehood — it is a tool of emotional architecture."}
            </p>
          </blockquote>
        </section>

        {/* ── LOS 8 PARÁMETROS ── */}
        <section style={{ marginBottom:"56px" }}>
          <SectionLabel es={es} label_es="La metodología" label_en="The methodology" />
          <h2 style={h2Style}>
            {es ? "Ocho dimensiones de un discurso" : "Eight dimensions of a discourse"}
          </h2>
          <Prose>
            {es
              ? "La escala va de 0 a 10. Cero representa la máxima polarización afectiva; diez, la máxima resonancia empática. Cada puntuación final es el promedio ponderado de ocho parámetros, cada uno midiendo una dimensión distinta del discurso:"
              : "The scale runs from 0 to 10. Zero represents maximum affective polarization; ten, maximum empathic resonance. Each final score is the weighted average of eight parameters, each measuring a different dimension of the discourse:"}
          </Prose>
          <div style={{ marginTop:"20px", display:"flex", flexDirection:"column", gap:"10px" }}>
            {PARAMS_BRIEF.map((p, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"14px" }}>
                <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:PARAM_COLORS[i], flexShrink:0, marginTop:"7px" }} />
                <div>
                  <span style={{ fontSize:"11px", fontWeight:700, color:PARAM_COLORS[i], fontFamily:"'DM Mono',monospace" }}>
                    {es ? p.es : p.en}
                  </span>
                  <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginLeft:"8px" }}>
                    — {es ? p.desc_es : p.desc_en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── VISIÓN ── */}
        <section style={{ marginBottom:"56px" }}>
          <SectionLabel es={es} label_es="El proyecto hoy" label_en="The project today" />
          <h2 style={h2Style}>
            {es ? "Desde el amor y la ciencia dura" : "From love and hard science"}
          </h2>
          <Prose>
            {es
              ? "El IRA no está terminado. Ninguna metodología de análisis del discurso lo está — el lenguaje cambia más rápido que las herramientas para medirlo. Lo que hay aquí es el comienzo de algo: una forma de leer el mundo político que combine el rigor de la academia con la urgencia del periodismo."
              : "The IRA is not finished. No discourse analysis methodology ever is — language changes faster than the tools to measure it. What exists here is the beginning of something: a way of reading the political world that combines academic rigor with journalistic urgency."}
          </Prose>
          <Prose>
            {es
              ? "El índice sigue creciendo. Nuevos líderes, nuevos medios, nuevos corpus. La inteligencia artificial analiza en tiempo real cualquier texto que quieras medir. Y la investigación continúa — en todas las direcciones posibles."
              : "The index keeps growing. New leaders, new media, new corpora. Artificial intelligence analyzes in real time any text you want to measure. And the research continues — in every possible direction."}
          </Prose>

          {/* Firma */}
          <div style={{ marginTop:"40px", padding:"24px", background:"rgba(255,102,0,0.04)", border:"1px solid rgba(255,102,0,0.15)", borderRadius:"14px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#ff6600", boxShadow:"0 0 8px #ff6600" }} />
              <span style={{ fontSize:"9px", letterSpacing:"0.16em", color:"rgba(255,102,0,0.7)", textTransform:"uppercase" }}>Ricardo Grisales Ramírez</span>
            </div>
            <p style={{ margin:"0 0 10px", fontSize:"13px", fontStyle:"italic", fontFamily:"Georgia, serif", color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>
              {es
                ? "«Cambiar el mundo desde el amor y la ciencia dura.»"
                : "«Changing the world through love and hard science.»"}
            </p>
            <p style={{ margin:0, fontSize:"10px", color:"rgba(255,255,255,0.2)", lineHeight:1.6 }}>
              {es
                ? "Periodista. Graduado en Periodismo, Universidad Complutense de Madrid (2024). Creador del IRA — Índice de Resonancia Afectiva."
                : "Journalist. Degree in Journalism, Complutense University of Madrid (2024). Creator of the IRA — Affective Resonance Index."}
            </p>
            <a href="https://oranrick.com" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", marginTop:"10px", fontSize:"10px", color:"#ff6600", textDecoration:"none", letterSpacing:"0.06em" }}>
              oranrick.com →
            </a>
          </div>
        </section>

        {/* ── CTA ── */}
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          <button onClick={() => navigate('/politicos')} style={{
            padding:"12px 24px", borderRadius:"12px", background:"#ff6600", border:"none",
            color:"#000", fontSize:"12px", fontWeight:700, letterSpacing:"0.06em",
            cursor:"pointer", fontFamily:"'DM Mono',monospace", transition:"background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background="#ff8533"}
            onMouseLeave={e => e.currentTarget.style.background="#ff6600"}
          >{es ? "Explorar el índice →" : "Explore the index →"}</button>
          <button onClick={() => navigate('/analyze')} style={{
            padding:"12px 24px", borderRadius:"12px",
            background:"rgba(255,102,0,0.08)", border:"1px solid rgba(255,102,0,0.35)",
            color:"#ff6600", fontSize:"12px", fontWeight:700, letterSpacing:"0.06em",
            cursor:"pointer", fontFamily:"'DM Mono',monospace", transition:"all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,102,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,102,0,0.08)"; }}
          >{es ? "Analizar un texto →" : "Analyze a text →"}</button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ es, label_es, label_en }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
      <div style={{ width:"24px", height:"1px", background:"rgba(255,102,0,0.5)" }} />
      <span style={{ fontSize:"9px", letterSpacing:"0.18em", color:"rgba(255,102,0,0.6)", textTransform:"uppercase" }}>
        {es ? label_es : label_en}
      </span>
    </div>
  );
}

const h2Style = {
  margin:"0 0 20px",
  fontSize:"clamp(18px,3vw,24px)",
  fontWeight:800,
  fontFamily:"'Syne',sans-serif",
  color:"#fff",
  letterSpacing:"-0.02em",
  lineHeight:1.2,
  whiteSpace:"pre-line",
};

function Prose({ children }) {
  return (
    <p style={{ margin:"0 0 16px", fontSize:"12.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
      {children}
    </p>
  );
}
