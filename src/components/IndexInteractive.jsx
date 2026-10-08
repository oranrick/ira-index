import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { colorPuntuacion as scoreColor, formatearPuntuacion } from '../lib/escala';
import EtiquetaPuntuacion from './ui/EtiquetaPuntuacion.jsx';
import IndicadorEscala from './ui/IndicadorEscala.jsx';
const scoreLabel = (s, es) => s >= 7 ? (es?'Empático':'Empathic') : s >= 4.5 ? (es?'Mixto':'Mixed') : (es?'Polarizante':'Polarizing');

// ─── A · QUIZ ─────────────────────────────────────────────────────────────────
const QUIZ_RAW = [
  {
    quote: { es: "«Luchamos con toda nuestra fuerza y si no luchas con toda tu fuerza, ya no vas a tener país.»", en: "«We fight like hell and if you don't fight like hell, you're not going to have a country anymore.»" },
    options: ["Donald Trump","Gustavo Petro","Pedro Sánchez","José Mujica"],
    answer: "Donald Trump", entityId:"trump", score:2.48,
    why: { es:"Lenguaje bélico con urgencia apocalíptica. El país como bien que se pierde si no se combate.", en:"Martial language with apocalyptic urgency. The country as something lost if you don't fight." },
  },
  {
    quote: { es: "«Nunca concederemos. No concedes cuando hay un robo de por medio.»", en: "«We will never concede. You don't concede when there's theft involved.»" },
    options: ["Donald Trump","Jair Bolsonaro","Pedro Sánchez","Gustavo Petro"],
    answer: "Donald Trump", entityId:"trump", score:1.20,
    why: { es:"La concesión democrática reencuadrada como complicidad con el crimen. La derrota electoral como robo. IRA 1.2.", en:"Democratic concession reframed as complicity with crime. Electoral defeat as theft. IRA 1.2." },
  },
  {
    quote: { es: "«No pronunciaré su nombre. Es un terrorista. Pero no recibirá el regalo de la fama.»", en: "«I will not speak his name. He is a terrorist. But he will not be given the gift of fame.»" },
    options: ["Jacinda Ardern","Claudia Sheinbaum","Hillary Clinton","Angela Merkel"],
    answer: "Jacinda Ardern", entityId:"ardern", score:8.75,
    why: { es:"Empatía radical con las víctimas: negarle protagonismo al agresor es un acto de cuidado.", en:"Radical empathy for victims: denying the aggressor fame is itself an act of care." },
  },
  {
    quote: { es: "«No somos el último gobierno que hará esto. No somos las últimas personas que se enfrentarán a esto.»", en: "«We are not the last government that will face this. We will not be the last people to do so.»" },
    options: ["Jacinda Ardern","Claudia Sheinbaum","Kamala Harris","Michelle Obama"],
    answer: "Jacinda Ardern", entityId:"ardern", score:8.75,
    why: { es:"Horizonte colectivo intergeneracional: el problema se proyecta hacia un «nosotros» que trasciende el mandato.", en:"Intergenerational collective horizon: the problem is projected toward a 'we' that transcends the term." },
  },
  {
    quote: { es: "«Lo imposible cuesta un poco más. Derrotados son solo aquellos que bajan los brazos.»", en: "«The impossible just costs a little more. Defeated are only those who give up.»" },
    options: ["José Mujica","Gustavo Petro","Pedro Sánchez","Donald Trump"],
    answer: "José Mujica", entityId:"mujica", score:8.93,
    why: { es:"Esperanza sobria sin utopía. El futuro como posibilidad alcanzable, no como promesa vacía.", en:"Sober hope without utopia. The future as achievable possibility, not empty promise." },
  },
  {
    quote: { es: "«Me faltó velocidad. No soy ningún fenómeno. La historia dirá lo que corresponda.»", en: "«I lacked speed. I am no phenomenon. History will render its proper judgment.»" },
    options: ["José Mujica","Pedro Sánchez","Gustavo Petro","Jacinda Ardern"],
    answer: "José Mujica", entityId:"mujica", score:8.93,
    why: { es:"Reconocimiento del error en primera persona. Quien admite sus límites no necesita defensa retórica.", en:"First-person acknowledgment of failure. Whoever admits their limits needs no rhetorical defense." },
  },
  {
    quote: { es: "«No llego sola, llegamos todas. Después de 503 años, por primera vez llegamos las mujeres.»", en: "«I do not arrive alone — we all arrive. After 503 years, for the first time we women have arrived.»" },
    options: ["Claudia Sheinbaum","Jacinda Ardern","Kamala Harris","Michelle Obama"],
    answer: "Claudia Sheinbaum", entityId:"sheinbaum", score:7.92,
    why: { es:"El «nosotros» extiende el sujeto político a toda la historia de las mujeres en 10 palabras.", en:"The 'we' extends the political subject to all of women's history in 10 words." },
  },
  {
    quote: { es: "«Aunque muchas mexicanas y mexicanos no coincidan con nuestro proyecto, habremos de caminar en paz y en armonía.»", en: "«Even if many Mexicans don't fully share our project, we shall walk in peace and harmony.»" },
    options: ["Claudia Sheinbaum","Pedro Sánchez","Jacinda Ardern","Gustavo Petro"],
    answer: "Claudia Sheinbaum", entityId:"sheinbaum", score:7.92,
    why: { es:"Incluye explícitamente a quienes no votaron por ella. Uno de los gestos de apertura al disenso más claros del corpus.", en:"Explicitly includes those who didn't vote for her. One of the clearest openness-to-dissent gestures in the corpus." },
  },
  {
    quote: { es: "«La vergüenza cambia de bando. La vergüenza para ellos; para nosotros el orgullo.»", en: "«Shame changes sides. Shame for them; for us, pride.»" },
    options: ["Pedro Sánchez","Gustavo Petro","Donald Trump","José Mujica"],
    answer: "Pedro Sánchez", entityId:"sanchez", score:5.97,
    why: { es:"Inversión simbólica del estigma: convierte el insulto en medalla. Alta dicotomía, alta retórica.", en:"Symbolic inversion of stigma: turns the insult into a medal. High dichotomy, high rhetoric." },
  },
  {
    quote: { es: "«Decir lo mismo en Ucrania, en Gaza y en cualquier otro lugar. Eso es coherencia.»", en: "«Saying the same thing in Ukraine, in Gaza, and everywhere else. That is coherence.»" },
    options: ["Pedro Sánchez","Gustavo Petro","Jacinda Ardern","José Mujica"],
    answer: "Pedro Sánchez", entityId:"sanchez", score:5.97,
    why: { es:"La coherencia como valor explícito y eje del discurso. Construye autoridad mediante la promesa de consistencia verificable.", en:"Coherence as an explicit value and axis of the speech. Builds authority through the promise of verifiable consistency." },
  },
  {
    quote: { es: "«Nos han robado no solo recursos: nos han robado la posibilidad de soñar.»", en: "«They have robbed us not only of resources: they have robbed us of the possibility of dreaming.»" },
    options: ["Gustavo Petro","Pedro Sánchez","José Mujica","Donald Trump"],
    answer: "Gustavo Petro", entityId:"petro", score:5.60,
    why: { es:"El robo como metáfora total: del dato material al horizonte existencial. Potente y estructuralmente dicotómico.", en:"Theft as a total metaphor: from the material to the existential horizon. Powerful and structurally dichotomous." },
  },
  {
    quote: { es: "«Cooperar o perecer. Esa es la única disyuntiva que nos deja el siglo XXI.»", en: "«Cooperate or perish. That is the only dilemma the 21st century leaves us.»" },
    options: ["Gustavo Petro","José Mujica","Pedro Sánchez","Jacinda Ardern"],
    answer: "Gustavo Petro", entityId:"petro", score:5.60,
    why: { es:"Futuro de esperanza condicionada: la cooperación como única salida, pero enmarcada en la urgencia del colapso.", en:"Future of conditional hope: cooperation as the only exit, but framed within the urgency of collapse." },
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function QuizSection({ lang, accent, accentA }) {
  const navigate = useNavigate();
  const es = lang !== 'en';
  const [questions] = useState(() => shuffle(QUIZ_RAW));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const q = questions[idx];

  const next = () => {
    setSelected(null);
    setIdx(i => (i + 1) % questions.length);
  };

  const col = 'var(--ira-linea)';

  return (
    <div style={{ marginBottom:"40px" }}>
      <h3 className="ira-seccion__titulo">
        {es ? "¿Quién lo dijo?" : "Who said it?"}
      </h3>

      <div className="ira-panel">
        <p style={{ margin:"0 0 20px", fontSize:"20px", lineHeight:"32px", color:"var(--ira-texto-cita)" }}>
          {es ? q.quote.es : q.quote.en}
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom: selected ? "20px" : 0 }}>
          {q.options.map(opt => {
            const isCorrect = opt === q.answer;
            const isSelected = opt === selected;
            let bg = "transparent";
            let border = "var(--ira-linea-fuerte)";
            let color = "var(--ira-nieve)";
            if (selected) {
              if (isCorrect) { bg="rgba(141,170,126,0.14)"; border="var(--ira-salvia)"; color="var(--ira-marca-empatica)"; }
              else if (isSelected) { bg="rgba(190,40,26,0.14)"; border="var(--ira-1)"; color="var(--ira-marca-polarizante)"; }
              else { color="var(--ira-texto-3)"; }
            }
            return (
              <button type="button" key={opt} disabled={!!selected} onClick={() => setSelected(opt)} style={{
                minHeight:"48px", padding:"10px 14px", borderRadius:"10px", border:`1px solid ${border}`,
                background:bg, color, fontSize:"15px", fontFamily:"var(--ira-font-texto)",
                cursor:selected?"default":"pointer", transition:"all 0.2s", textAlign:"left",
              }}>{opt}</button>
            );
          })}
        </div>

        {selected && (
          <div aria-live="polite" style={{ borderTop:"1px solid var(--ira-linea)", paddingTop:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px", flexWrap:"wrap", gap:"8px" }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"var(--ira-texto-cita)" }}>
                <EtiquetaPuntuacion puntuacion={q.score} lang={es ? 'es' : 'en'} /> {scoreLabel(q.score, es)}
              </span>
              <div style={{ display:"flex", gap:"8px" }}>
                <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto" onClick={() => navigate(`/entity/${q.entityId}`)}>{es?"Ver análisis":"See analysis"}</button>
                <button type="button" className="ira-boton ira-boton--principal ira-boton--compacto" onClick={next}>{es?"Otra frase":"Next quote"}</button>
              </div>
            </div>
            <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.6 }}>
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
      <h3 className="ira-seccion__titulo">
        {es ? "El espectro IRA — corpus completo" : "The IRA spectrum — full corpus"}
      </h3>

      <div className="ira-panel" style={{ padding:"28px 24px 20px" }}>

        {/* Eje: escala con sus cifras; las figuras se marcan encima */}
        <div style={{ position:"relative", marginBottom:"28px", paddingTop:"26px" }} ref={containerRef}>

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
                aria-hidden="true"
                style={{
                  position:"absolute", top: isHov ? "0px" : "3px", left:`calc(${pct}% * 0.91 + 4.5%)`,
                  transform:"translateX(-50%)",
                  width: isHov ? 18 : 12, height: isHov ? 18 : 12,
                  borderRadius:"50%", background:"var(--ira-nieve)",
                  border: isHov ? "2px solid var(--ira-oro)" : "2px solid var(--ira-noche)",
                  cursor:"pointer", transition:"all 0.18s ease", zIndex: isHov ? 10 : 1,
                }}
              >
                {isHov && (
                  <div style={{
                    position:"absolute", bottom:"calc(100% + 8px)", left:"50%",
                    transform:"translateX(-50%)",
                    background:"var(--ira-elevada)", border:"1px solid var(--ira-linea-fuerte)",
                    borderRadius:"8px", padding:"8px 10px", whiteSpace:"nowrap",
                    pointerEvents:"none", zIndex:20,
                    boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
                  }}>
                    <p style={{ margin:"0 0 6px", fontSize:"14px", fontWeight:500, color:"var(--ira-nieve)", fontFamily:"var(--ira-font-titulo)" }}>{e.name}</p>
                    <p style={{ margin:0, display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"var(--ira-texto-cita)" }}>
                      <EtiquetaPuntuacion puntuacion={e.score} lang={es ? 'es' : 'en'} /> {scoreLabel(e.score, es)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <IndicadorEscala compacto lang={es ? 'es' : 'en'} />
        </div>

        {/* Lista compacta ordenada */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
          {sorted.map(e => (
            <button type="button" key={e.id} onClick={() => navigate(`/entity/${e.id}`)}
              onMouseEnter={() => setHoverId(e.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(e.id)}
              onBlur={() => setHoverId(null)}
              className="ira-chip" style={{ gap:"10px" }}>
              {e.name} <EtiquetaPuntuacion puntuacion={e.score} variante="punto" lang={es ? 'es' : 'en'} />
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
      <h3 className="ira-seccion__titulo">
        {es ? "Mide una frase" : "Measure a phrase"}
      </h3>

      <div className="ira-panel">

        {/* Hint rotatorio */}
        <p id="ira-mini-ej" style={{ margin:"0 0 10px", fontSize:"14px", color:"var(--ira-texto-2)", fontStyle:"italic", lineHeight:1.5 }}>
          {es ? "ej." : "e.g."}{" "}{examples[tipIdx]}
        </p>

        <label htmlFor="ira-mini-texto" className="ira-sr">{es ? "Frase política" : "Political phrase"}</label>
        <textarea
          id="ira-mini-texto" className="ira-campo" aria-describedby="ira-mini-ej"
          value={text}
          onChange={e => { setText(e.target.value); setResult(null); }}
          placeholder={es ? "Escribe o pega una frase política..." : "Write or paste a political phrase..."}
          maxLength={400}
          rows={2}
          onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); analyze(); } }}
          style={{ resize:"none" }}
        />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"10px" }}>
          <span style={{ fontSize:"12px", color:"var(--ira-texto-3)" }}>
            {text.length}/400 · {es?"Enter para analizar":"Enter to analyze"}
          </span>
          <button type="button" className="ira-boton ira-boton--principal ira-boton--compacto" onClick={analyze} disabled={loading || text.trim().length < 8}>
            {loading ? (es?"Analizando...":"Analyzing...") : (es?"Calcular IRA":"Calculate IRA")}
          </button>
        </div>

        {result && (
          <ResultBlock result={result} es={es} col={col} accentA={accentA} />
        )}
      </div>
    </div>
  );
}

// ─── RESULT BLOCK ─────────────────────────────────────────────────────────────
function ResultBlock({ result, es, col, accentA }) {
  const [open, setOpen] = useState(false);
  return (
    <div aria-live="polite" style={{ marginTop:"16px", borderTop:"1px solid var(--ira-linea)", paddingTop:"16px",
      display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", flexShrink:0, minWidth:"90px" }}>
        <span style={{ display:"flex", alignItems:"baseline", gap:"4px", fontFamily:"var(--ira-font-cifra)", fontWeight:500, letterSpacing:"-0.04em", lineHeight:1 }}>
          <span style={{ fontSize:"40px", color:col }}>{formatearPuntuacion(result.score, es ? 'es' : 'en')}</span>
          <span style={{ fontSize:"14px", color:"var(--ira-texto-3)", letterSpacing:0 }}>/10</span>
        </span>
        <span style={{ fontSize:"13px", color:"var(--ira-texto-cita)", marginTop:"6px" }}>
          {result.label || (result.score >= 7 ? (es?"Empático":"Empathic") : result.score >= 4.5 ? "Mixto" : (es?"Polarizante":"Polarizing"))}
        </span>
      </div>
      <div style={{ flex:1 }}>
        <button type="button" aria-expanded={open} className="ira-boton ira-boton--secundario ira-boton--compacto" onClick={() => setOpen(o => !o)}>
          {open ? (es?"Cerrar ▲":"Close ▲") : (es?"¿Por qué? ▾":"Why? ▾")}
        </button>
        {open && result.reason && (
          <p style={{ margin:"10px 0 0", fontSize:"14px", color:"var(--ira-texto-2)",
            lineHeight:1.65, fontStyle:"italic" }}>
            {result.reason}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── D · SLIDER DE PARÁMETROS ─────────────────────────────────────────────────

const SLIDER_PARAMS = {
  es: [
    {
      id: "pronominal",
      label: "Pronombres y vínculo",
      examples: [
        "«Ellos son la escoria de este país. Nosotros somos los únicos verdaderos.»",
        "«Esa gente no es como nosotros. Nunca lo será.»",
        "«Yo lo hice todo. Ellos solo pusieron obstáculos.»",
        "«Nosotros ganamos. Los que votaron distinto tendrán que aceptarlo.»",
        "«Hay quienes no comparten nuestro camino. Eso complica las cosas.»",
        "«Tenemos diferencias, pero seguimos siendo ciudadanos del mismo país.»",
        "«Podemos no estar de acuerdo y aun así trabajar en lo que nos une.»",
        "«Juntos podemos más que separados, aunque pensemos diferente.»",
        "«Nuestro 'nosotros' incluye también a quienes hoy votan distinto.»",
        "«Lo que nos une es más grande que lo que nos separa. Caminemos.»",
        "«Caminemos juntos. Lo que te pase a ti me pasa a mí.»",
      ],
    },
    {
      id: "metafora",
      label: "Marco metafórico",
      examples: [
        "«Esta plaga ideológica está destruyendo el tejido de la nación.»",
        "«El enemigo está dentro. Hay que extirparlo antes de que se extienda.»",
        "«Estamos en guerra. O ganamos o lo perdemos todo.»",
        "«El país es una fortaleza asediada. Hay que levantar los muros.»",
        "«El camino está lleno de obstáculos que otros pusieron a propósito.»",
        "«Navegamos aguas difíciles, pero el rumbo puede corregirse.»",
        "«Hay fisuras en el edificio, pero los cimientos siguen en pie.»",
        "«Estamos construyendo algo nuevo. No siempre es fácil, pero avanza.»",
        "«La democracia es un tejido que entre todos zurcimos cuando se rompe.»",
        "«Cultivamos un jardín común. Cada voz es una semilla necesaria.»",
        "«La democracia es un jardín que cuidamos juntos, con paciencia y amor.»",
      ],
    },
    {
      id: "dicotomia",
      label: "Polaridad moral",
      examples: [
        "«Ellos son el mal absoluto. No hay nada que entender ni negociar.»",
        "«Son traidores. La historia los juzgará como merecen.»",
        "«O estás con el pueblo o estás en su contra. No hay grises.»",
        "«Los que nos critican tienen motivos oscuros. No hay buena fe en ellos.»",
        "«Hay quienes están equivocados, aunque quizás no por mala intención.»",
        "«Tenemos posiciones opuestas, pero ambas parten de preocupaciones reales.»",
        "«Entiendo que hay razones para pensar distinto, aunque no las comparta.»",
        "«El adversario tiene argumentos que merecen escucharse antes de rebatirse.»",
        "«Puedo estar en desacuerdo contigo y reconocer que actúas de buena fe.»",
        "«El conflicto no es entre buenos y malos, sino entre visiones distintas del bien.»",
        "«Quien piensa distinto no es mi enemigo. Es mi interlocutor necesario.»",
      ],
    },
    {
      id: "tono",
      label: "Tono emocional",
      examples: [
        "«Deberían tener miedo. Lo que les espera si no actuamos será devastador.»",
        "«Esto es una vergüenza. El asco que siento no tiene palabras.»",
        "«Estamos al borde del abismo. Si no reaccionamos ahora, todo se perderá.»",
        "«La indignación es lo único racional ante lo que estamos viviendo.»",
        "«Hay razones para preocuparse, aunque no para perder la cabeza.»",
        "«Las cosas no están bien, pero tampoco es el fin del mundo.»",
        "«Hay motivos de preocupación y también de esperanza. Ambos son reales.»",
        "«Confío en que podemos superar esto si lo enfrentamos juntos.»",
        "«Siento esperanza real cuando veo la resiliencia de nuestra gente.»",
        "«La compasión y la determinación pueden coexistir. Eso es lo que siento.»",
        "«Siento genuina esperanza. No como retórica — como convicción profunda.»",
      ],
    },
    {
      id: "disenso",
      label: "Apertura al disenso",
      examples: [
        "«Los que nos critican son parte del problema. No los escucharé.»",
        "«Quienes disienten están infiltrados o mal informados. No hay debate posible.»",
        "«No voy a perder el tiempo con quienes actúan de mala fe.»",
        "«Puedo escuchar críticas, pero solo las que son de verdad, no las interesadas.»",
        "«Hay voces críticas que merecen alguna atención, aunque son pocas.»",
        "«El desacuerdo existe y no lo voy a negar, aunque no lo comparta.»",
        "«Escucho las críticas y respondo con argumentos, no con descalificaciones.»",
        "«El disenso me obliga a afinar mis propias ideas. Es valioso tenerlo.»",
        "«Podemos pensar distinto y seguir construyendo juntos sin problema.»",
        "«La diferencia de opinión es el motor de la democracia, no su amenaza.»",
        "«El disenso no es traición. Es la forma más honesta de participar.»",
      ],
    },
    {
      id: "vector",
      label: "Llamada a la acción",
      examples: [
        "«Hay que echarlos. Que tiemblen quienes nos traicionaron.»",
        "«Salid a las calles. Que nos vean y que sientan quién tiene el poder.»",
        "«Hay que pararlos como sea. No podemos permitirnos dudar.»",
        "«Movilizaos. No podemos dejar que esto siga ni un día más.»",
        "«Tenemos que actuar, aunque aún no tengamos claro exactamente cómo.»",
        "«Hay que hacer algo. Qué exactamente, lo decidimos entre todos.»",
        "«Os invito a sumarse a un proceso que todavía estamos construyendo.»",
        "«Trabajemos en lo que nos une. Las soluciones vendrán de cada comunidad.»",
        "«La acción más poderosa empieza por escucharse. Después, actuamos.»",
        "«Construyamos juntos. Cada voz cuenta, también la que no coincide con la mía.»",
        "«Cuidemos esto entre todos. No desde arriba — desde cada uno de nosotros.»",
      ],
    },
    {
      id: "coherencia",
      label: "Engagement dialógico",
      examples: [
        "«Te escucho... pero quienes te engañaron son nuestros verdaderos enemigos.»",
        "«Entiendo tu preocupación. Por eso hay que acabar con ellos de una vez.»",
        "«Hablamos de diálogo, sí. Pero solo con quienes realmente quieren dialogar.»",
        "«La apertura tiene un límite. No dialogamos con la mala fe organizada.»",
        "«Intento ser coherente, aunque a veces el discurso no acompaña a los hechos.»",
        "«Lo que digo y lo que hago no siempre coinciden del todo. Trabajo en ello.»",
        "«Trato de que mi discurso y mis acciones vayan en la misma dirección.»",
        "«No uso palabras empáticas para llegar a conclusiones excluyentes.»",
        "«La coherencia entre lo que digo y lo que hago no es negociable para mí.»",
        "«Mi apertura al diálogo no es retórica. La demuestro con hechos concretos.»",
        "«Lo que digo es lo que hago. La autenticidad no es un recurso retórico.»",
      ],
    },
  ],
  en: [
    {
      id: "pronominal",
      label: "Pronouns & Bond",
      examples: [
        "«They are the scum of this country. We are the only real ones.»",
        "«Those people are not like us. They never will be.»",
        "«I did everything. They only put up obstacles.»",
        "«We won. Those who voted differently will have to accept it.»",
        "«Some don't share our path. That complicates things.»",
        "«We have differences, but we are still citizens of the same country.»",
        "«We can disagree and still work together on what we share.»",
        "«Together we can do more than apart, even if we think differently.»",
        "«Our 'we' includes even those who vote differently today.»",
        "«What unites us is greater than what divides us. Let's walk forward.»",
        "«Let's walk together. What happens to you happens to me.»",
      ],
    },
    {
      id: "metafora",
      label: "Metaphorical Frame",
      examples: [
        "«This ideological plague is destroying the fabric of our nation.»",
        "«The enemy is within. We must extirpate it before it spreads.»",
        "«We are at war. Either we win or we lose everything.»",
        "«The country is a besieged fortress. We must raise the walls.»",
        "«The road is full of obstacles others deliberately placed in the way.»",
        "«We're navigating rough waters, but the course can be corrected.»",
        "«There are cracks in the building, but the foundations still hold.»",
        "«We're building something new. It's not always easy, but it's moving forward.»",
        "«Democracy is a fabric we mend together whenever it tears.»",
        "«We tend a common garden. Every voice is a necessary seed.»",
        "«Democracy is a garden we care for together, with patience and love.»",
      ],
    },
    {
      id: "dicotomia",
      label: "Moral Polarity",
      examples: [
        "«They are absolute evil. There is nothing to understand or negotiate.»",
        "«They are traitors. History will judge them as they deserve.»",
        "«Either you're with the people or you're against them. No gray areas.»",
        "«Those who criticize us have dark motives. There is no good faith in them.»",
        "«Some are wrong, though perhaps not out of malicious intent.»",
        "«We hold opposing positions, but both stem from genuine concerns.»",
        "«I understand there are reasons to think differently, even if I don't share them.»",
        "«The adversary has arguments worth hearing before being rebutted.»",
        "«I can disagree with you and still recognize you act in good faith.»",
        "«The conflict isn't between good and evil, but between different visions of the good.»",
        "«Those who think differently are not my enemies. They are my necessary interlocutors.»",
      ],
    },
    {
      id: "tono",
      label: "Emotional Tone",
      examples: [
        "«They should be afraid. What awaits us if we don't act will be devastating.»",
        "«This is a disgrace. The disgust I feel has no words.»",
        "«We are on the edge of the abyss. If we don't react now, everything will be lost.»",
        "«Outrage is the only rational response to what we are living through.»",
        "«There are reasons to worry, though not to lose our heads.»",
        "«Things aren't good, but it's not the end of the world either.»",
        "«There are reasons for concern and also for hope. Both are real.»",
        "«I trust we can overcome this if we face it together.»",
        "«I feel real hope when I see the resilience of our people.»",
        "«Compassion and determination can coexist. That is what I feel.»",
        "«I feel genuine hope. Not as rhetoric — as deep conviction.»",
      ],
    },
    {
      id: "disenso",
      label: "Openness to Dissent",
      examples: [
        "«Those who criticize us are part of the problem. I won't listen to them.»",
        "«Dissenters are infiltrated or misinformed. There is no possible debate.»",
        "«I won't waste time with those who act in bad faith.»",
        "«I can hear real criticism — but not the kind driven by self-interest.»",
        "«Some critical voices deserve attention, though very few.»",
        "«Disagreement exists and I won't deny it, even if I don't share it.»",
        "«I listen to criticism and respond with arguments, not dismissal.»",
        "«Dissent forces me to sharpen my own thinking. It has value.»",
        "«We can think differently and keep building together without a problem.»",
        "«Difference of opinion is the engine of democracy, not its threat.»",
        "«Dissent is not betrayal. It's the most honest way to participate.»",
      ],
    },
    {
      id: "vector",
      label: "Call to Action",
      examples: [
        "«We need to throw them out. Let those who betrayed us tremble.»",
        "«Take to the streets. Let them see us and feel who holds the power.»",
        "«We have to stop them by any means. We can't afford to hesitate.»",
        "«Mobilize. We can't let this continue a single day longer.»",
        "«We need to act, though we don't yet know exactly how.»",
        "«Something has to be done. What exactly, we'll decide together.»",
        "«I invite you to join a process we are still building together.»",
        "«Let's work on what unites us. Solutions will come from each community.»",
        "«The most powerful action starts with listening. Then we act.»",
        "«Let's build together. Every voice counts, including those that differ from mine.»",
        "«Let's take care of this together. Not from above — from each one of us.»",
      ],
    },
    {
      id: "coherencia",
      label: "Dialogic Engagement",
      examples: [
        "«I hear you... but those who deceived you are our real enemies.»",
        "«I understand your concern. That's why we need to finish them off.»",
        "«We talk about dialogue, yes. But only with those who genuinely want it.»",
        "«Openness has a limit. We don't dialogue with organized bad faith.»",
        "«I try to be coherent, though sometimes my discourse doesn't match my actions.»",
        "«What I say and what I do don't always fully align. I'm working on it.»",
        "«I try to keep my discourse and my actions pointing in the same direction.»",
        "«I don't use empathic language to arrive at exclusionary conclusions.»",
        "«Coherence between what I say and what I do is non-negotiable for me.»",
        "«My openness to dialogue isn't rhetorical. I demonstrate it with concrete facts.»",
        "«What I say is what I do. Authenticity is not a rhetorical device.»",
      ],
    },
  ],
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const sliderColor = scoreColor;

function exampleIndex(val) {
  return Math.min(10, Math.max(0, Math.round(val)));
}

function ParameterSliderSection({ lang, accent, accentA }) {
  const es = lang !== 'en';
  const [val, setVal] = useState(5);
  const [prevVal, setPrevVal] = useState(5);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef(null);

  const params = es ? SLIDER_PARAMS.es : SLIDER_PARAMS.en;
  const col = sliderColor(val);
  const exIdx = exampleIndex(val);
  const prevExIdx = exampleIndex(prevVal);

  function handleChange(e) {
    const newVal = parseFloat(e.target.value);
    if (exampleIndex(newVal) !== exampleIndex(val)) {
      setPrevVal(val);
      setFading(true);
      clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setFading(false), 300);
    }
    setVal(newVal);
  }

  const iraLabel = val >= 7 ? (es ? "Empático" : "Empathic")
    : val >= 4.5 ? (es ? "Mixto" : "Mixed")
    : (es ? "Polarizante" : "Polarizing");

  return (
    <div style={{ marginBottom:"40px" }}>
      <h3 className="ira-seccion__titulo">
        {es ? "Así suena el discurso a cada nivel" : "This is what discourse sounds like at each level"}
      </h3>

      <div className="ira-panel">

        {/* Puntuación elegida + escala */}
        <div style={{ marginBottom:"28px", display:"flex", flexDirection:"column", gap:"16px" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:"12px", flexWrap:"wrap" }}>
            <span style={{ display:"flex", alignItems:"baseline", gap:"4px", fontFamily:"var(--ira-font-cifra)", fontWeight:500, letterSpacing:"-0.04em", lineHeight:1 }}>
              <span style={{ fontSize:"48px", color:col, transition:"color 0.3s" }}>{formatearPuntuacion(val, es ? 'es' : 'en')}</span>
              <span style={{ fontSize:"16px", color:"var(--ira-texto-3)", letterSpacing:0 }}>/10</span>
            </span>
            <span style={{ fontSize:"15px", color:"var(--ira-texto-cita)" }}>{iraLabel}</span>
          </div>
          <IndicadorEscala puntuacion={val} lang={es ? 'es' : 'en'} etiquetas={false} />
          <label htmlFor="ira-rango-nivel" className="ira-sr">{es ? "Nivel de la escala" : "Scale level"}</label>
          <input
            id="ira-rango-nivel" className="ira-rango"
            type="range" min={0} max={10} step={0.1}
            value={val}
            onChange={handleChange}
            aria-valuetext={`${formatearPuntuacion(val, es ? 'es' : 'en')} — ${iraLabel}`}
          />
          <div className="ira-indicador__extremos" aria-hidden="true">
            <span>0 · {es ? "Polarizante" : "Polarizing"}</span><span>{es ? "Empático" : "Empathic"} · 10</span>
          </div>
        </div>

        {/* Parámetros */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"10px" }}>
          {params.map((p, i) => (
            <div key={p.id} style={{
              background:"var(--ira-noche)", borderRadius:"12px",
              padding:"16px", border:"1px solid var(--ira-linea)",
            }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"var(--ira-texto-2)" }}>
                {p.label}
              </p>
              <p style={{
                margin:0, fontSize:"15px",
                lineHeight:1.6,
                color:"var(--ira-texto-cita)",
                opacity: fading ? 0.3 : 1,
                transition:"opacity 0.25s",
              }}>
                {p.examples[exIdx]}
              </p>
            </div>
          ))}
        </div>

        <p style={{ margin:"16px 0 0", fontSize:"13px", color:"var(--ira-texto-2)", lineHeight:1.5, textAlign:"center" }}>
          {es
            ? "Los ejemplos son ilustrativos. Un registro distinto por cada punto entero de la escala."
            : "Examples are illustrative. A distinct register for each integer point on the scale."}
        </p>
      </div>
    </div>
  );
}

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────
export default function IndexInteractive({ entities, lang, accent, accentA }) {
  const es = lang !== 'en';

  return (
    <div style={{ marginTop:"48px" }}>
      <h2 style={{ margin:"0 0 28px", paddingTop:"40px", borderTop:"1px solid var(--ira-linea)", fontFamily:"var(--ira-font-titulo)", fontWeight:500, fontSize:"32px", letterSpacing:"-0.02em" }}>
        {es ? "Explora e interactúa" : "Explore & interact"}
      </h2>

      <SpectrumSection entities={entities} lang={lang} accent={accent} />
      <ParameterSliderSection lang={lang} accent={accent} accentA={accentA} />
      <QuizSection lang={lang} accent={accent} accentA={accentA} />
      <MiniAnalyzer lang={lang} accent={accent} accentA={accentA} />
    </div>
  );
}
