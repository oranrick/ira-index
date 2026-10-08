import { useState, useEffect, useRef, lazy, Suspense, createContext, useContext } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import AboutPage from './components/AboutPage.jsx';
import IndexInteractive from './components/IndexInteractive.jsx';
import WorldMap from './components/WorldMap.jsx';
import { SpeechesSection } from "./components/SpeechCard";
import { SpeechView } from "./components/SpeechView";
import { getSpeechById, getSpeechesByEntity } from "./data/speeches";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./supabaseClient";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Destellos from "./components/Destellos.jsx";
import { useAtraparFoco } from "./components/ui/Ventana.jsx";
import EtiquetaPuntuacion from "./components/ui/EtiquetaPuntuacion.jsx";
import IndicadorEscala from "./components/ui/IndicadorEscala.jsx";
import BarraEscala from "./components/ui/BarraEscala.jsx";
import TarjetaDiscurso from "./components/ui/TarjetaDiscurso.jsx";
import FilaParametro from "./components/ui/FilaParametro.jsx";
import { colorPuntuacion, colorCifra, formatearPuntuacion, CATEGORICOS } from "./lib/escala";

const Comparator   = lazy(() => import("./components/Comparator"));
const RadarSection = lazy(() => import("./components/RadarSection"));
const AuthModal    = lazy(() => import("./components/AuthModal").then(m => ({ default: m.AuthModal })));
const DailyAnalysis = lazy(() => import("./components/DailyAnalysis"));
const PatternsPage = lazy(() => import("./components/PatternsPage"));
const Portada = lazy(() => import("./components/Portada.jsx"));
const DiscursosFigura = lazy(() => import("./components/DiscursosPage.jsx"));
const PaisPage = lazy(() => import("./components/PaisPage.jsx"));

const AccentContext = createContext({
  accent: '#DCB149',
  accentA: (a) => `rgba(220,177,73,${a})`,
  mode: 'politico',
});

export const AppContext = createContext({
  lang: 'es', setLang: () => {},
  supabaseMap: {}, supabaseReady: false,
  enrichedEntities: [],
  requireAuth: () => {}, openLogin: () => {}, openRegister: () => {},
  user: null, profile: null, signOut: () => {},
});

// ── Traducciones ─────────────────────────────────────────────────────────────

const TEXTS = {
  es: {
    subtitle:        "Medición del lenguaje empático y polarizador en políticos y medios. Escala 0–10. Analiza cualquier texto con IA.",
    subtitleMedios:  "Medición del lenguaje empático y polarizador en medios y cabeceras periodísticas. Escala 0–10. Analiza cualquier texto con IA.",
    namePlaceholderMedios: "ej. Editorial El País, 12 mayo 2025",
    textPlaceholderMedios: "Pega aquí el artículo, editorial, columna o texto periodístico que quieres medir...",
    modeTogglePolitico: "Político",
    modeToggleMedios:   "Medios",
    btnWhat:         "¿Qué es el IRA?",
    tabExplore:      "Explorar",
    tabAnalyze:      "Analizar texto",
    tabCompare:      "Comparar",
    filterAll:       "Todos",
    seeAnalysis:     "Ver análisis →",
    paramsTitle:     "7 Parámetros IRA",
    empatico:        "Empático",
    polarizador:     "Polarizador",
    close:           "Cerrar",
    howWorks:        "Cómo funciona",
    howWorksDesc:    "Pega cualquier texto en español o inglés. La IA lo analizará contra los 7 parámetros del IRA y generará una puntuación y síntesis interpretativa.",
    nameLabel:       "Nombre / Fuente (opcional)",
    namePlaceholder: "ej. Discurso de Milei, mayo 2025",
    catLabel:        "Categoría",
    textLabel:       "Texto a analizar — español o inglés",
    textPlaceholder: "Pega aquí el discurso, artículo, declaración o texto que quieres medir...",
    chars:           "caracteres",
    words:           "palabras",
    wordLimitMsg:    "Límite de 800 palabras alcanzado",
    errorShort:      "El texto es demasiado corto. Mínimo 50 caracteres.",
    errorLong:       "El texto supera el límite de 800 palabras.",
    errorGeneral:    "Error al analizar. Intenta de nuevo.",
    analyzing:       "Analizando...",
    calcBtn:         "Calcular IRA →",
    analyzeAnother:  "← Analizar otro texto",
    defaultName:     "Texto analizado",
    catPolitico:     "Político",
    catMedio:        "Medio",
    catOtro:         "Otro",
    headerTag:       "Índice de Resonancia Afectiva",
    footerBasedOn:   "Datos basados en",
    footerText:      "El contagio de las palabras",
    footerSub:       "(Grisales, UCM 2024). IRA — metodología en desarrollo.",
    loading:         "Cargando...",
    synthesis:       "Síntesis",
    politicianA:     "Político A",
    politicianB:     "Político B",
    selectTwo:       "Selecciona dos políticos para comparar",
    searchPolitician:"Buscar político...",
    annotatedFragment:"FRAGMENTO ANOTADO",
    iraParams:       "PARÁMETROS IRA",
    analysisLabel:   "Análisis",
    clickFullAnalysis:"Clic para análisis completo →",
    translationLabel:"Traducción al español",
    seeTranslation:  "🌐 ver traducción",
    hideTranslation: "✕ traducción",
    back:            "← Volver",
    shareImage:      "Compartir imagen",
    copyLink:        "Copiar link",
    linkCopied:      "¡Link copiado!",
    generating:      "Generando...",
    lecturaAutorLabel: "Lectura del autor",
    lecturaAutorBadge: "· no computa en la nota",
    analyzeInSite:   "Analiza tu propio texto →",
    pinnedNoteTitle: "Análisis del fragmento",
    speechesTitle:   "Discursos analizados",
    speechesDesc:    "Fragmentos anotados del TFG",
    words:           "palabras",
    seeAnalysisCard: "Ver análisis →",
    iraLabelEmp:     "Empático",
    iraLabelMix:     "Mixto",
    iraLabelPol:     "Polarizante",
    modalTag:        "Metodología",
    modalTitle:      "Índice de Resonancia Afectiva",
    modalIntro:      "El IRA es una herramienta de análisis lingüístico que mide la capacidad empática o polarizadora de un discurso político, mediático o institucional. Parte de una premisa respaldada por la neurociencia: antes de llegar al razonamiento lógico, todo estímulo atraviesa el sistema límbico, donde se originan las emociones. Las palabras no solo describen la realidad — la configuran. Una metáfora, un pronombre, un tono afectivo pueden construir comunidad o trincheras simbólicas.",
    modalWhatTitle:  "¿Qué mide?",
    modalWhatPre:    "El IRA evalúa si un discurso activa mecanismos de empatía y cohesión social o, por el contrario, refuerza la polarización afectiva — esa repulsión visceral que convierte al adversario en enemigo irreconciliable. La escala va de 0 a 10: ",
    modalWhatPol:    "0 representa la máxima polarización",
    modalWhatEmp:    "10 la máxima resonancia empática",
    modalParamsTitle:"Los 8 parámetros",
    modalOriginTitle:"Origen académico",
    modalOriginPre:  "El IRA surge de la investigación ",
    modalOriginBook: "«El contagio de las palabras: Metáforas, empatía y polarización en el discurso político contemporáneo»",
    modalOriginPost: ", de Ricardo Grisales Ramírez, Trabajo Fin de Grado en Periodismo, Universidad Complutense de Madrid, junio de 2024. La metodología analiza discursos de Donald Trump, Gustavo Petro, Claudia Sheinbaum y Jacinda Ardern aplicando el Análisis Crítico del Discurso desde una perspectiva emocional y retórica.",
  },
  en: {
    subtitle:        "Measuring empathic and polarizing language in politicians and media. Scale 0–10. Analyze any text with AI.",
    subtitleMedios:  "Measuring empathic and polarizing language in media outlets and news organizations. Scale 0–10. Analyze any text with AI.",
    namePlaceholderMedios: "e.g. Guardian editorial, May 2025",
    textPlaceholderMedios: "Paste the article, editorial, column or journalistic text you want to measure...",
    modeTogglePolitico: "Political",
    modeToggleMedios:   "Media",
    btnWhat:         "What is the IRA?",
    tabExplore:      "Explore",
    tabAnalyze:      "Analyze text",
    tabCompare:      "Compare",
    filterAll:       "All",
    seeAnalysis:     "See analysis →",
    paramsTitle:     "7 IRA Parameters",
    empatico:        "Empathic",
    polarizador:     "Polarizing",
    close:           "Close",
    howWorks:        "How it works",
    howWorksDesc:    "Paste any text in Spanish or English. The AI will analyze it against the 7 IRA parameters and generate a score and interpretive summary.",
    nameLabel:       "Name / Source (optional)",
    namePlaceholder: "e.g. Trump speech, January 2021",
    catLabel:        "Category",
    textLabel:       "Text to analyze — Spanish or English",
    textPlaceholder: "Paste the speech, article, statement or text you want to measure...",
    chars:           "characters",
    words:           "words",
    wordLimitMsg:    "800-word limit reached",
    errorShort:      "Text is too short. Minimum 50 characters.",
    errorLong:       "Text exceeds the 800-word limit.",
    errorGeneral:    "Analysis error. Please try again.",
    analyzing:       "Analyzing...",
    calcBtn:         "Calculate IRA →",
    analyzeAnother:  "← Analyze another text",
    defaultName:     "Analyzed text",
    catPolitico:     "Politician",
    catMedio:        "Media",
    catOtro:         "Other",
    headerTag:       "Affective Resonance Index",
    footerBasedOn:   "Data based on",
    footerText:      "The contagion of words",
    footerSub:       "(Grisales, UCM 2024). IRA — methodology under development.",
    loading:         "Loading...",
    synthesis:       "Synthesis",
    politicianA:     "Politician A",
    politicianB:     "Politician B",
    selectTwo:       "Select two politicians to compare",
    searchPolitician:"Search politician...",
    annotatedFragment:"ANNOTATED FRAGMENT",
    iraParams:       "IRA PARAMETERS",
    analysisLabel:   "Analysis",
    clickFullAnalysis:"Click for full analysis →",
    translationLabel:"Spanish translation",
    seeTranslation:  "🌐 see translation",
    hideTranslation: "✕ translation",
    back:            "← Back",
    shareImage:      "Share image",
    copyLink:        "Copy link",
    linkCopied:      "Link copied!",
    generating:      "Generating...",
    lecturaAutorLabel: "Author's reading",
    lecturaAutorBadge: "· does not count toward the score",
    analyzeInSite:   "Analyze your own text →",
    pinnedNoteTitle: "Fragment analysis",
    speechesTitle:   "Analyzed speeches",
    speechesDesc:    "Annotated fragments from the thesis",
    words:           "words",
    seeAnalysisCard: "See analysis →",
    iraLabelEmp:     "Empathic",
    iraLabelMix:     "Mixed",
    iraLabelPol:     "Polarizing",
    modalTag:        "Methodology",
    modalTitle:      "Affective Resonance Index",
    modalIntro:      "The IRA is a linguistic analysis tool that measures the empathic or polarizing capacity of a political, media or institutional discourse. It starts from a premise supported by neuroscience: before reaching logical reasoning, every stimulus passes through the limbic system, where emotions originate. Words don't just describe reality — they shape it. A metaphor, a pronoun, an affective tone can build community or symbolic trenches.",
    modalWhatTitle:  "What does it measure?",
    modalWhatPre:    "The IRA evaluates whether a discourse activates mechanisms of empathy and social cohesion or, on the contrary, reinforces affective polarization — that visceral repulsion that turns the adversary into an irreconcilable enemy. The scale goes from 0 to 10: ",
    modalWhatPol:    "0 represents maximum polarization",
    modalWhatEmp:    "10 maximum empathic resonance",
    modalParamsTitle:"The 8 parameters",
    modalOriginTitle:"Academic origin",
    modalOriginPre:  "The IRA emerges from the research ",
    modalOriginBook: "«The contagion of words: Metaphors, empathy and polarization in contemporary political discourse»",
    modalOriginPost: ", by Ricardo Grisales Ramírez, Bachelor's Thesis in Journalism, Complutense University of Madrid, June 2024. The methodology analyzes discourses by Donald Trump, Gustavo Petro, Claudia Sheinbaum and Jacinda Ardern applying Critical Discourse Analysis from an emotional and rhetorical perspective.",
  },
};

const CAT_TRANS = {
  es: { Todos: "Todos", Político: "Político", Medio: "Medio", Otro: "Otro" },
  en: { Todos: "All",   Político: "Politician", Medio: "Media", Otro: "Other" },
};

// ── Parámetros con traducciones ───────────────────────────────────────────────

const PARAMS_TRANS = {
  es: [
    { id: "pronominal", label: "Pronombres y vínculo",   desc: "Qué pronombres usa y con qué verbos los asocia." },
    { id: "metafora",   label: "Marco metafórico",      desc: "¿El imaginario central construye comunidad o enemigo?" },
    { id: "dicotomia",  label: "Polaridad moral",       desc: "Rigidez moral: ¿divide el mundo en buenos y malos?" },
    { id: "tono",       label: "Tono emocional",        desc: "¿Qué emoción instala en quien lo recibe?" },
    { id: "disenso",    label: "Apertura al disenso",   desc: "¿Valida la diferencia o la clausura?" },
    { id: "vector",     label: "Llamada a la acción",   desc: "¿Convoca a cooperar o a confrontar?" },
    { id: "coherencia", label: "Engagement dialógico",  desc: "¿Hay distancia entre lo que dice y lo que hace?" },
    // P8 (proyeccion) eliminado de la fórmula — retirado de la UI por decisión
    // del autor (jul 2026). La prosa curada de las fichas se conserva en
    // paramTexts.proyeccion por si se diseña un P8 nuevo.
  ],
  en: [
    { id: "pronominal", label: "Pronouns & Bond",        desc: "Which pronouns are used and which verbs they're paired with." },
    { id: "metafora",   label: "Metaphorical Frame",     desc: "Does the central imagery build community or enemy?" },
    { id: "dicotomia",  label: "Moral Polarity",         desc: "Moral rigidity: does it divide the world into good and bad?" },
    { id: "tono",       label: "Emotional Tone",         desc: "What emotion does it install in the receiver?" },
    { id: "disenso",    label: "Openness to Dissent",    desc: "Does it validate difference or shut it down?" },
    { id: "vector",     label: "Call to Action",         desc: "Does it call for cooperation or confrontation?" },
    { id: "coherencia", label: "Dialogic Engagement",    desc: "Is there a gap between what is said and what is done?" },
  ],
};

const PARAM_DETAILS_TRANS = {
  es: {
    pronominal: {
      detail:      "Mide la frecuencia y el tipo de pronombres usados. 'Nosotros', 'nuestro' y 'juntos' construyen comunidad y responsabilidad compartida. El uso dominante de 'yo' señala ego-centralismo; 'ellos/los otros' como sujeto agente indica distancia o antagonismo estructural.",
      empatico:    "«Nosotros vamos a enfrentar esto juntos. Lo que nos hicieron a todos nos obliga a responder unidos.»",
      polarizador: "«Yo lo resolví. Yo lo advertí. Ellos son los que destruyeron este país.»",
    },
    metafora: {
      detail:      "Las metáforas estructuran la realidad política. Las de construcción ('tejer redes', 'cultivar') activan esquemas cognitivos de cooperación. Las bélicas o de contaminación ('limpiar la corrupción', 'extirpar el problema') activan esquemas de amenaza y exclusión.",
      empatico:    "«La democracia es un jardín que todos debemos cuidar. Si lo abandonamos, se llena de maleza.»",
      polarizador: "«Estamos en guerra. El enemigo está dentro de nuestras instituciones y hay que extirparlo.»",
    },
    dicotomia: {
      detail:      "Evalúa la rigidez moral del discurso: si divide el mundo en categorías absolutas de bien/mal, nosotros/ellos, patriotas/traidores. Alta dicotomía niega la ambigüedad, dificulta el diálogo y legitima la eliminación simbólica del adversario.",
      empatico:    "«Entiendo que hay quienes no comparten esta visión. Sus preocupaciones también son legítimas y merecen escucharse.»",
      polarizador: "«O estás con nosotros o estás contra el pueblo. No hay grises, no hay término medio.»",
    },
    tono: {
      detail:      "Identifica la emoción dominante que el discurso instala en quien lo recibe. Esperanza, orgullo compartido y gratitud favorecen la cohesión social. Miedo, ira y asco son más contagiosos a corto plazo pero erosionan la confianza institucional.",
      empatico:    "«Siento una profunda esperanza cuando veo la resiliencia de nuestra gente. Hemos salido más fuertes de cada crisis.»",
      polarizador: "«Deberían tener miedo. Porque lo que viene, si no actuamos ahora, será peor de lo que imaginan.»",
    },
    disenso: {
      detail:      "Mide la capacidad de reconocer y validar puntos de vista contrarios sin descalificarlos. Su presencia es señal de madurez democrática; su ausencia correlaciona con autoritarismo discursivo, aunque no necesariamente con autoritarismo institucional.",
      empatico:    "«Hay personas que votan diferente a nosotros con razones respetables. Esta política también debe funcionar para ellas.»",
      polarizador: "«Los que se oponen solo pueden tener dos motivos: ignorancia o mala fe. No voy a perder el tiempo debatiendo con ellos.»",
    },
    vector: {
      detail:      "Examina el tipo de acción que el discurso convoca. Los vectores cooperativos ('trabajemos juntos', 'construyamos') generan capital social. Los de confrontación ('derrotemos', 'paremos a') pueden ser legítimos pero tienen un coste cohesivo alto.",
      empatico:    "«Los invito a que este proceso lo hagamos entre todos. La solución vendrá de cada comunidad, no de arriba.»",
      polarizador: "«Hay que salir a las calles a demostrarles quién tiene el poder. Que nos vean. Que tiemblen.»",
    },
    coherencia: {
      detail:      "Analiza la distancia entre el contenido emocional del discurso y las acciones observables del hablante. Es el parámetro más difícil de medir porque requiere contexto extradiscursivo y seguimiento longitudinal.",
      empatico:    "«He dicho siempre que la transparencia es innegociable, y hoy publico todos mis datos patrimoniales sin que nadie me lo exija.»",
      polarizador: "«Hablo de diálogo todos los días.» [Mientras bloquea sistemáticamente los canales de participación institucional.]",
    },
    proyeccion: {
      detail:      "Evalúa el horizonte temporal del discurso. Los discursos empáticos construyen un futuro compartido con agencia colectiva. Los polarizadores se anclan en el pasado como agravio o en un presente de crisis permanente, sin ofrecer horizonte real.",
      empatico:    "«Dentro de veinte años, cuando nuestros hijos pregunten qué hicimos aquí, quiero que podamos decirles que elegimos el entendimiento.»",
      polarizador: "«Siempre nos han hecho lo mismo. Y si no frenamos esto ahora, nos lo seguirán haciendo para siempre.»",
    },
  },
  en: {
    pronominal: {
      detail:      "Measures the frequency and type of pronouns used. 'We', 'our' and 'together' build community and shared responsibility. Dominant use of 'I' signals ego-centrism; 'they/the others' as the active subject indicates distance or structural antagonism.",
      empatico:    "«We are going to face this together. What they did to all of us obliges us to respond united.»",
      polarizador: "«I solved it. I warned about it. They are the ones who destroyed this country.»",
    },
    metafora: {
      detail:      "Metaphors structure political reality. Construction metaphors ('weaving networks', 'cultivating') activate cognitive schemas of cooperation. War or contamination metaphors ('clean up corruption', 'extirpate the problem') activate threat and exclusion schemas.",
      empatico:    "«Democracy is a garden we all must tend. If we abandon it, it fills with weeds.»",
      polarizador: "«We are at war. The enemy is inside our institutions and must be extirpated.»",
    },
    dicotomia: {
      detail:      "Evaluates the moral rigidity of the discourse: whether it divides the world into absolute categories of good/evil, us/them, patriots/traitors. High dichotomy denies ambiguity, hinders dialogue, and legitimizes the symbolic elimination of the adversary.",
      empatico:    "«I understand there are those who don't share this vision. Their concerns are also legitimate and deserve to be heard.»",
      polarizador: "«Either you're with us or you're against the people. There are no grays, no middle ground.»",
    },
    tono: {
      detail:      "Identifies the dominant emotion the discourse installs in its receiver. Hope, shared pride and gratitude favor social cohesion. Fear, anger and disgust are more contagious in the short term but erode institutional trust.",
      empatico:    "«I feel deep hope when I see the resilience of our people. We have come out stronger from every crisis.»",
      polarizador: "«They should be afraid. Because what's coming, if we don't act now, will be worse than they imagine.»",
    },
    disenso: {
      detail:      "Measures the capacity to recognize and validate opposing viewpoints without dismissing them. Its presence signals democratic maturity; its absence correlates with discursive authoritarianism, though not necessarily institutional authoritarianism.",
      empatico:    "«There are people who vote differently from us with respectable reasons. This policy must also work for them.»",
      polarizador: "«Those who oppose can only have two motives: ignorance or bad faith. I won't waste time debating with them.»",
    },
    vector: {
      detail:      "Examines the type of action the discourse calls for. Cooperative vectors ('let's work together', 'let's build') generate social capital. Confrontational ones ('defeat', 'stop them') may be legitimate but carry a high cohesive cost.",
      empatico:    "«I invite you to make this process together. The solution will come from each community, not from above.»",
      polarizador: "«We must take to the streets to show them who holds the power. Let them see us. Let them tremble.»",
    },
    coherencia: {
      detail:      "Analyzes the gap between the emotional content of the discourse and the speaker's observable actions. It is the hardest parameter to measure because it requires extra-discursive context and longitudinal tracking.",
      empatico:    "«I have always said transparency is non-negotiable, and today I publish all my financial data without anyone requiring it.»",
      polarizador: "«I talk about dialogue every day.» [While systematically blocking institutional channels of participation.]",
    },
    proyeccion: {
      detail:      "Evaluates the temporal horizon of the discourse. Empathic discourses build a shared future with collective agency. Polarizing ones anchor in the past as grievance or in a permanent crisis present, offering no real horizon.",
      empatico:    "«Twenty years from now, when our children ask what we did here, I want us to be able to say we chose understanding.»",
      polarizador: "«They have always done this to us. And if we don't stop it now, they will keep doing it to us forever.»",
    },
  },
};

const IRA_PARAMS_INFO_TRANS = {
  es: [
    { name: "Uso pronominal inclusivo",   desc: "Analiza qué pronombres usa el discurso y con qué verbos los asocia. Un 'nosotros' vinculado a verbos de cuidado construye comunidad; vinculado a verbos de combate, construye trincheras." },
    { name: "Tipo de metáfora dominante", desc: "Las metáforas no son adornos: estructuran cómo percibimos la realidad. Las metáforas de cuidado, reparación y construcción activan empatía; las bélicas y de contagio activan miedo y exclusión." },
    { name: "Carga dicotómica",           desc: "Mide la rigidez moral del discurso. Cuanto más divide el mundo en buenos y malos, patriotas y traidores, puros y corruptos, más polariza y menos espacio deja para el matiz." },
    { name: "Tono emocional dominante",   desc: "¿Qué emoción instala el discurso en quien lo recibe? La compasión y la esperanza cohesionan; el miedo y la indignación sin salida fragmentan." },
    { name: "Reconocimiento del disenso", desc: "El parámetro que mejor distingue empatía real de empatía performativa. ¿El discurso valida la diferencia o la clausura? ¿Puede existir un 'nosotros' que incluya al que piensa distinto?" },
    { name: "Vector de acción",           desc: "¿El discurso convoca a cooperar o a confrontar? Un imperativo inclusivo ('construyamos juntos') activa lógicas distintas a un imperativo hostil ('hay que derrotarlos')." },
    { name: "Coherencia afectiva",        desc: "El parámetro más original del IRA. Mide la distancia entre lo que el discurso dice y lo que hace retóricamente. Detecta el 'barniz de ternura': discursos que usan metáforas de cuidado pero cuya función real es polarizar." },
    { name: "Proyección de futuro",       desc: "¿El discurso abre un horizonte compartido o lo clausura? Un futuro inclusivo y posible cohesiona; un futuro apocalíptico o utópico sin ruta concreta fragmenta." },
  ],
  en: [
    { name: "Inclusive Pronominal Use",  desc: "Analyzes which pronouns the discourse uses and which verbs they're paired with. A 'we' linked to verbs of care builds community; linked to combat verbs, it builds trenches." },
    { name: "Dominant Metaphor Type",    desc: "Metaphors are not ornaments: they structure how we perceive reality. Metaphors of care, repair and construction activate empathy; war and contagion metaphors activate fear and exclusion." },
    { name: "Dichotomous Load",          desc: "Measures the moral rigidity of the discourse. The more it divides the world into good and evil, patriots and traitors, pure and corrupt, the more it polarizes and the less room it leaves for nuance." },
    { name: "Dominant Emotional Tone",   desc: "What emotion does the discourse install in its receiver? Compassion and hope bind; fear and outrage without resolution fragment." },
    { name: "Recognition of Dissent",    desc: "The parameter that best distinguishes real empathy from performative empathy. Does the discourse validate difference or shut it down? Can there be a 'we' that includes those who think differently?" },
    { name: "Action Vector",             desc: "Does the discourse call for cooperation or confrontation? An inclusive imperative ('let's build together') activates different logics from a hostile one ('we must defeat them')." },
    { name: "Affective Coherence",       desc: "The most original IRA parameter. Measures the gap between what the discourse says and what it does rhetorically. Detects the 'veneer of tenderness': discourses that use care metaphors but whose real function is to polarize." },
    { name: "Future Projection",         desc: "Does the discourse open a shared horizon or close it? An inclusive and achievable future binds; an apocalyptic or utopian future without a concrete path fragments." },
  ],
};

// ── Datos ─────────────────────────────────────────────────────────────────────

const ENTITIES = [
  {
    id: "mujica", name: "José Mujica", category: "Político", country: "Uruguay", flag: "🇺🇾",
    photo: "/images/mujica.jpg",
    photoCredit: "Ricardo Stuckert / PR",
    score: 8.93,
    params: { pronominal:9.2, metafora:9.0, dicotomia:6.8, tono:9.1, disenso:8.5, vector:8.8, coherencia:9.3, proyeccion:8.9 },
    context: "Presidente de Uruguay (2010–2015). Analizado sobre discurso de despedida y homenaje final.",
    contextEn: "President of Uruguay (2010–2015). Analyzed on farewell speech and final tribute.",
    paramTexts: {
      pronominal: "El discurso está construido casi enteramente en primera persona plural y segunda persona directa. No hay un \"ellos\" enemigo — cuando aparece la tercera persona es descriptiva, nunca demonizadora. El \"nosotros\" convoca a toda la humanidad, no a un bando.",
      metafora:   "Las metáforas son existenciales y vinculares: el disco duro social del ser humano, la vida como camino, el fuego interior, el pequeño aliento rodando en las colinas. Son metáforas de herencia y transmisión, no de combate.",
      dicotomia:  "Hay una dicotomía presente pero no rígida: ricos/pobres, mayoría/minoría, vida enajenada/vida con sentido. La nombra con claridad pero no la convierte en odio — es una invitación ética más que una trinchera moral.",
      tono:       "Esperanza sobria y amor a la vida. El tono no es eufórico ni alarmista — es el de un viejo que habla con ternura y urgencia a los jóvenes. La indignación ante la injusticia siempre está enmarcada en una lógica de cuidado colectivo, no de ira.",
      disenso:    "Mujica se presenta como imperfecto (\"me faltó velocidad\", \"no soy ningún fenómeno\"), reconoce las contradicciones de la civilización y valida la duda y el tropiezo. No construye una verdad única e incuestionable — propone, no impone.",
      vector:     "El llamado a la acción es cooperativo y existencial: \"luchen por la felicidad\", \"dale contenido a la vida\". No convoca a enfrentarse a nadie — convoca a construirse a uno mismo y a los demás. Los imperativos son de cuidado, no de confrontación.",
      coherencia: "Uno de los discursos más coherentes afectivamente. No hay disonancia entre lo que dice y cómo lo dice. La vulnerabilidad es real, la filosofía es consistente de principio a fin, y el tono no cambia para manipular.",
      proyeccion: "El futuro no es utópico ni apocalíptico — es \"un pequeño aliento rodando en las colinas\", la esperanza que se transmite de generación en generación. \"Lo imposible cuesta un poco más\" sintetiza su proyección: alcanzable, humana, sin paraísos prometidos.",
    },
    paramTextsEn: {
      pronominal: "The speech is constructed almost entirely in inclusive first-person plural and direct second person. There is no 'them' as enemy — when the third person appears it is descriptive, never demonizing. The 'we' summons all of humanity, not a faction.",
      metafora:   "The metaphors are existential and relational: the social hard drive of the human being, life as a journey, the inner fire, the small breath rolling through the hills. They are metaphors of inheritance and transmission, not of combat.",
      dicotomia:  "A dichotomy is present but not rigid: rich/poor, majority/minority, alienated life/life with meaning. He names it clearly but does not turn it into hatred — it is an ethical invitation rather than a moral trench.",
      tono:       "Sober hope and love for life. The tone is neither euphoric nor alarmist — it is that of an old man who speaks with tenderness and urgency to the young. Indignation at injustice is always framed within a logic of collective care, not anger.",
      disenso:    "Mujica presents himself as imperfect ('I lacked speed', 'I am no phenomenon'), acknowledges the contradictions of civilization, and validates doubt and stumbling. He does not construct a single, unquestionable truth — he proposes, he does not impose.",
      vector:     "The call to action is cooperative and existential: 'fight for happiness', 'give life content'. He does not summon anyone to confront others — he summons people to build themselves and one another. The imperatives are of care, not confrontation.",
      coherencia: "One of the most affectively coherent speeches. There is no dissonance between what he says and how he says it. The vulnerability is real, the philosophy is consistent from beginning to end, and the tone does not shift to manipulate.",
      proyeccion: "The future is neither utopian nor apocalyptic — it is 'a small breath rolling through the hills', the hope transmitted from generation to generation. 'The impossible costs a little more' encapsulates his projection: attainable, human, with no promised paradise.",
    },
    quotes: {
      pronominal: "Nos corresponde cuidarnos, luchamos en política",
      metafora:   "un pequeño aliento rodando en las colinas",
      dicotomia:  "estás con la mayoría o con la minoría",
      tono:       "tengo una especie de fuego adentro",
      disenso:    "me faltó velocidad, no soy ningún fenómeno",
      vector:     "lo imposible cuesta un poco más",
      coherencia: "soy un paisano medio atravesao",
      proyeccion: "derrotados son solo aquellos que bajan los brazos",
    },
  },
  {
    id: "ardern", name: "Jacinda Ardern", breakName: true, category: "Político", country: "Nueva Zelanda", flag: "🇳🇿",
    photo: "/images/ardern.jpg",
    photoCredit: "Gobierno de Nueva Zelanda",
    score: 8.75,
    params: { pronominal:9.1, metafora:9.0, dicotomia:8.2, tono:9.0, disenso:8.8, vector:9.0, coherencia:8.9, proyeccion:8.0 },
    context: "Primera ministra de Nueva Zelanda (2017–2023). Analizado sobre respuesta a Christchurch (2019) y discurso ONU (2018).",
    contextEn: "Prime Minister of New Zealand (2017–2023). Analyzed on Christchurch response (2019) and UN speech (2018).",
  },
  {
    id: "sheinbaum", name: "Claudia Sheinbaum", category: "Político", country: "México", flag: "🇲🇽",
    photo: "/images/sheinbaum.jpg",
    photoCredit: "Eneas De Troya / Flickr",
    score: 7.92,
    params: { pronominal:8.1, metafora:8.0, dicotomia:7.5, tono:8.2, disenso:7.8, vector:8.0, coherencia:7.9, proyeccion:7.8 },
    context: "Presidenta de México (2024–). Analizado sobre discurso de victoria (2024) y respuesta a aranceles Trump (2025).",
    contextEn: "President of Mexico (2024–). Analyzed on victory speech (2024) and response to Trump tariffs (2025).",
    paramTexts: {
      pronominal: "El discurso está construido casi enteramente en primera persona plural inclusivo. La frase central \"No llego sola, llegamos todas\" extiende el sujeto político más allá de ella misma hacia todas las mujeres de la historia. El \"nosotros\" no excluye: \"aunque muchas mexicanas y mexicanos no coincidan plenamente con nuestro proyecto, habremos de caminar en paz y en armonía\".",
      metafora:   "Las metáforas son históricas y vinculares: México como nación que \"tejió textiles con manos de mujeres artesanas que entrelazan con el alma\". La llegada al poder como continuidad de una lucha colectiva, no como conquista individual.",
      dicotomia:  "Hay una distinción implícita entre el proyecto transformador y el pasado, pero no se nombran enemigos. El adversario político existe pero no se convoca emocionalmente. \"Somos demócratas y por convicción nunca haríamos un gobierno autoritario ni represor\".",
      tono:       "Esperanza histórica y orgullo colectivo. El tono es sobrio y festivo a la vez. La emoción no es euforia sino dignidad: \"después de al menos 503 años, por primera vez llegamos las mujeres a conducir los destinos de nuestra hermosa Nación\".",
      disenso:    "Explícitamente reconoce a quienes no votaron por ella y los incluye: \"aunque muchas mexicanas y mexicanos no coincidan plenamente con nuestro proyecto, habremos de caminar en paz y en armonía para seguir construyendo un México justo y más próspero\".",
      vector:     "El llamado a la acción es cooperativo y de continuidad: construir, ampliar, garantizar, defender. No hay exhortaciones confrontacionales. \"Continuaremos con una política exterior basada en nuestros principios constitucionales de no intervención, cooperación internacional para el desarrollo\".",
      coherencia: "El discurso respira desde un único registro: dignidad histórica femenina y proyecto colectivo. No hay saltos de tono ni disonancias. La emoción personal y el programa político se integran de forma consistente.",
      proyeccion: "El futuro es concreto y alcanzable: \"Garantizaremos las libertades de expresión, de prensa, de reunión\", \"Promoveremos la soberanía energética, las energías renovables y el desarrollo científico\". No hay utopía ni apocalipsis — hay programa.",
    },
    paramTextsEn: {
      pronominal: "The speech is constructed almost entirely in inclusive first-person plural. The central phrase 'I do not arrive alone — we all arrive together' extends the political subject beyond herself to encompass all women throughout history. The 'we' does not exclude: 'even if many Mexicans do not fully share our project, we shall walk together in peace and harmony'.",
      metafora:   "The metaphors are historical and relational: Mexico as a nation that 'wove textiles with the hands of artisan women who interweave with the soul'. The ascent to power as the continuation of a collective struggle, not as an individual conquest.",
      dicotomia:  "There is an implicit distinction between the transformative project and the past, but no enemies are named. The political adversary exists but is not emotionally summoned. 'We are democrats and by conviction would never form an authoritarian or repressive government'.",
      tono:       "Historical hope and collective pride. The tone is simultaneously sober and celebratory. The emotion is not euphoria but dignity: 'after at least 503 years, for the first time we women have arrived to guide the destiny of our beautiful Nation'.",
      disenso:    "She explicitly acknowledges those who did not vote for her and includes them: 'even if many Mexicans do not fully share our project, we shall walk together in peace and harmony to keep building a just and more prosperous Mexico'.",
      vector:     "The call to action is cooperative and oriented toward continuity: to build, expand, guarantee, defend. There are no confrontational exhortations. 'We will continue with a foreign policy grounded in our constitutional principles of non-intervention and international cooperation for development'.",
      coherencia: "The speech breathes from a single register: historical feminine dignity and collective project. There are no tonal shifts or dissonances. Personal emotion and political program are integrated in a consistent manner.",
      proyeccion: "The future is concrete and attainable: 'We will guarantee freedoms of expression, press, and assembly'; 'We will promote energy sovereignty, renewable energy and scientific development'. There is no utopia, no apocalypse — there is a program.",
    },
  },
  {
    id: "petro", name: "Gustavo Petro", category: "Político", country: "Colombia", flag: "🇨🇴",
    photo: "/images/petro.jpg",
    photoCredit: "Departamento Nacional de Planeación, Colombia",
    score: 5.60,
    params: { pronominal:6.8, metafora:5.2, dicotomia:4.5, tono:6.0, disenso:5.1, vector:5.8, coherencia:5.2, proyeccion:6.2 },
    context: "Presidente de Colombia (2022–). IRA promedio sobre IX Cumbre CELAC (2025) y mitin Consulta Popular (2025).",
    contextEn: "President of Colombia (2022–). Average IRA on IX CELAC Summit (2025) and Popular Consultation rally (2025).",
    paramTexts: {
      pronominal: "El \"nosotros\" aparece pero con tensión: convoca a la integración regional (\"somos pueblos que se ayudan\") pero también construye una frontera implícita frente al norte global. No hay un \"ellos\" personalizado, pero sí estructural.",
      metafora:   "Mezcla metáforas vinculares (\"faro de democracia, paz, libertad y vida\", \"el corazón del mundo\") con metáforas de urgencia y peligro (\"vampiros de la salud\", \"sálvese quien pueda\", \"nave milagrosa\"). Las constructivas existen pero compiten con las de amenaza.",
      dicotomia:  "Hay dicotomías claras: Sur/Norte, integración/colonialismo, vida/capitalismo fósil. Son más estructurales que personalistas, pero marcan un campo de batalla simbólico sostenido a lo largo del discurso.",
      tono:       "Oscila entre la esperanza integradora y la alarma climática y geopolítica. \"Estamos en peligro\" como telón de fondo constante. La indignación está presente pero no domina completamente sobre la propuesta.",
      disenso:    "Reconoce que \"hablamos mucho de unirnos pero lo hacemos poco\", lo cual es autocrítico hacia el bloque. Sin embargo, no valida voces disidentes dentro de la CELAC ni abre espacio real a la contradicción interna.",
      vector:     "Los llamados a la acción son concretos y cooperativos: red eléctrica americana, soberanía alimentaria, agencia de medicinas. \"De la retórica tenemos que pasar a la realidad.\" El vector apunta a construcción colectiva más que a confrontación.",
      coherencia: "La tensión entre el Petro esperanzador (\"faro de luz\") y el Petro apocalíptico (\"el mundo de hoy es un mundo de peligro para la vida\") genera cierta disonancia. El discurso no respira desde un solo registro emocional.",
      proyeccion: "El futuro es ambicioso pero con sombra: \"cooperar o perecer\". La CELAC como faro es una imagen potente, pero está enmarcada por la urgencia del colapso. Esperanza condicionada a la acción inmediata.",
    },
    paramTextsEn: {
      pronominal: "The 'we' appears but with tension: it invokes regional integration ('we are peoples who help one another') while simultaneously constructing an implicit boundary against the global North. There is no personalized 'them', but a structural one.",
      metafora:   "He mixes relational metaphors ('beacon of democracy, peace, freedom and life', 'the heart of the world') with metaphors of urgency and danger ('health vampires', 'every man for himself', 'miraculous vessel'). The constructive ones exist but compete with those of threat.",
      dicotomia:  "Clear dichotomies are present: South/North, integration/colonialism, life/fossil capitalism. They are more structural than personalist, but they delineate a sustained symbolic battlefield throughout the speech.",
      tono:       "He oscillates between integrative hope and climatic and geopolitical alarm. 'We are in danger' functions as a constant backdrop. Indignation is present but does not completely dominate over the policy proposal.",
      disenso:    "He acknowledges that 'we talk much about unity but act on it little', which is self-critical toward the bloc. However, he does not validate dissident voices within CELAC nor does he genuinely open space for internal contradiction.",
      vector:     "The calls to action are concrete and cooperative: an American power grid, food sovereignty, a medicines agency. 'From rhetoric we must move to reality.' The vector points toward collective construction rather than confrontation.",
      coherencia: "The tension between the hopeful Petro ('beacon of light') and the apocalyptic Petro ('the world today is a world of danger to life') generates a degree of dissonance. The speech does not breathe from a single emotional register.",
      proyeccion: "The future is ambitious but shadowed: 'cooperate or perish'. CELAC as a beacon is a powerful image, but it is framed by the urgency of collapse. Hope is conditional upon immediate action.",
    },
  },
  {
    id: "sanchez", name: "Pedro Sánchez", category: "Político", country: "España", flag: "🇪🇸",
    photo: "/images/sanchez.jpg",
    photoCredit: "Pool Moncloa",
    score: 5.97,
    params: { pronominal:6.5, metafora:6.0, dicotomia:4.8, tono:6.8, disenso:4.3, vector:6.5, coherencia:6.3, proyeccion:7.3 },
    context: "Presidente del Gobierno de España (2018–). IRA promedio sobre discurso ante la 79.ª Asamblea General de la ONU (2024) y la Cumbre Progresista Internacional de Barcelona (2026).",
    contextEn: "Prime Minister of Spain (2018–). Average IRA across speech before the 79th UN General Assembly (2024) and the International Progressive Summit in Barcelona (2026).",
    paramTexts: {
      pronominal: "El uso pronominal varía significativamente según el registro. En la ONU el «nosotros» se expande hasta los 8.000 millones de habitantes del planeta; en Barcelona se estrecha al «nosotros los progresistas», con un «ellos» persistente y activo. El parámetro revela a un orador que adapta el perímetro del sujeto colectivo al auditorio: diplomático-universal ante la comunidad internacional, tribal-militante ante aliados políticos.",
      metafora:   "Las metáforas oscilan entre dos registros según el contexto. En lo multilateral: «levantó pieza a pieza de las cenizas», «luz al final del túnel», metáforas de construcción compartida. En lo movilizador: «doblándoles el brazo», «la ortodoxia neoliberal murió», «la vergüenza cambia de bando». El blanco de las metáforas bélicas son siempre estructuras —élites, regímenes— nunca personas anónimas.",
      dicotomia:  "El parámetro más variable del corpus. En la ONU la dicotomía es moderada y estructural; en Barcelona alcanza su máxima expresión: «la vergüenza para ellos; para nosotros el orgullo». El promedio (4.8) refleja una tensión real entre el agonismo que practica en contextos de movilización y el multilateralismo que proclama en foros diplomáticos.",
      tono:       "El tono es empático y esperanzador en ambos discursos, aunque con distinta base emocional. En la ONU: esperanza racional respaldada en datos, indignación ante injusticias concretas. En Barcelona: orgullo colectivo como emoción movilizadora, rechazo explícito al pesimismo. En ninguno de los dos registros domina el miedo ni el asco como combustible principal.",
      disenso:    "El parámetro más asimétrico entre ambos discursos. En la ONU reconoce los errores propios de la democracia y la necesidad de autocrítica. En Barcelona cierra completamente el espacio al adversario: «Se acabó», «solo odio, eslóganes vacíos». El promedio (4.3) sugiere que la apertura al disenso es contextual: opera en foros deliberativos, desaparece ante aliados en contextos de movilización.",
      vector:     "En la ONU los vectores son cooperativos y multilaterales: «Apostemos», «Hagámoslo», «Invito». En Barcelona coexisten la convocatoria cooperativa hacia dentro («trabajemos juntos») y la confrontación asertiva hacia fuera («doblándoles el brazo», «las ponemos en su sitio»). El vector es solidario hacia los aliados y contencioso hacia las élites económicas.",
      coherencia: "La coherencia como valor explícito es el eje del discurso ONU («decir lo mismo en Ucrania, en Gaza y en cualquier otro lugar»). En Barcelona el registro es igualmente consistente, aunque en clave de celebración militante. En conjunto, el corpus Sánchez tiene alta coherencia intradiscursiva; la tensión aparece entre discursos, no dentro de ellos.",
      proyeccion: "El futuro es positivo y colectivo en ambos registros. En la ONU: modalizado y respaldado en datos («apostemos», «podríamos»). En Barcelona: más determinista y fundacional («vamos a lograrlo», «en Barcelona empezó todo»). La agencia colectiva siempre es explícita; el horizonte nunca es apocalíptico.",
    },
    paramTextsEn: {
      pronominal: "Pronominal usage varies significantly by register. At the UN the 'we' expands to 8 billion inhabitants of the planet; in Barcelona it narrows to 'we progressives', with a persistent and active 'them'. The parameter reveals a speaker who adapts the collective subject's perimeter to his audience: diplomatic-universal before the international community, tribal-militant before political allies.",
      metafora:   "Metaphors oscillate between two registers depending on context. In the multilateral register: 'built piece by piece from the ashes', 'light at the end of the tunnel', shared construction metaphors. In the mobilising register: 'twisting their arm', 'neoliberal orthodoxy died', 'shame changes sides'. The targets of the martial metaphors are always structures — elites, regimes — never anonymous individuals.",
      dicotomia:  "The most variable parameter in the corpus. At the UN the dichotomy is moderate and structural; in Barcelona it reaches its maximum expression: 'shame for them; pride for us'. The average (4.8) reflects a real tension between the agonism practised in mobilising contexts and the multilateralism proclaimed in diplomatic forums.",
      tono:       "The tone is empathic and hopeful in both speeches, though with different emotional bases. At the UN: rational hope backed by data, indignation at concrete injustices. In Barcelona: collective pride as the mobilising emotion, explicit rejection of pessimism. In neither register do fear or disgust dominate as the primary fuel.",
      disenso:    "The most asymmetric parameter between the two speeches. At the UN he acknowledges democracy's own errors and the need for self-criticism. In Barcelona he completely closes the space to the adversary: 'It's over', 'only hatred, empty slogans'. The average (4.3) suggests that openness to dissent is contextual: it operates in deliberative forums, disappearing before allies in mobilising contexts.",
      vector:     "At the UN the vectors are cooperative and multilateral: 'Let us bet', 'Let us do it', 'I invite'. In Barcelona, cooperative calls inward coexist with assertive confrontation outward ('twisting the arm of those who believe they are untouchable', 'we put them in their place'). The vector is solidary toward allies and contentious toward economic elites.",
      coherencia: "Coherence as an explicit value is the axis of the UN speech ('saying the same thing in Ukraine, in Gaza, and everywhere else'). In Barcelona the register is equally consistent, though in a key of militant celebration. Overall, the Sánchez corpus has high intradiscursive coherence; the tension appears between speeches, not within them.",
      proyeccion: "The future is positive and collective in both registers. At the UN: modalised and data-backed ('let us bet', 'we could'). In Barcelona: more deterministic and foundational ('we are going to achieve it', 'in Barcelona it all began'). Collective agency is always explicit; the horizon is never apocalyptic.",
    },
    quotes: {
      pronominal: "el futuro nos ha reclamado, y vosotros y vosotras habéis sabido acudir",
      metafora:   "levantar un escudo que proteja las instituciones democráticas",
      dicotomia:  "La vergüenza para ellos; para nosotros el orgullo",
      tono:       "mirando al horizonte sin miedo y con esperanza",
      disenso:    "es necesario reconocer errores, trabajar por su regeneración interna",
      vector:     "apostemos por la refundación del multilateralismo",
      coherencia: "decir lo mismo en Ucrania, en Gaza y en cualquier otro lugar",
      proyeccion: "el futuro es una conquista relativamente reciente para la humanidad",
    },
  },
  {
    id: "trump", name: "Donald Trump", category: "Político", country: "Estados Unidos", flag: "🇺🇸",
    photo: "/images/trump.jpg",
    photoCredit: "Dominio público / Casa Blanca",
    score: 2.48,
    params: { pronominal:2.5, metafora:1.8, dicotomia:2.0, tono:2.1, disenso:1.5, vector:2.0, coherencia:2.8, proyeccion:3.1 },
    context: "Presidente de EEUU (2017–2021, 2024–). Analizado sobre discurso victoria 2024 y mitin 'We Will Never Concede' (2021).",
    contextEn: "US President (2017–2021, 2024–). Analyzed on 2024 victory speech and 'We Will Never Concede' rally (2021).",
  },
  {
    id: "milei", name: "Javier Milei", category: "Político", country: "Argentina", flag: "🇦🇷",
    photo: "/images/milei.jpg",
    photoCredit: "Presidencia de la República Argentina",
    score: null,   // sin corpus propio todavía (los análisis del cron se borraron en oct-2026)
    params: { pronominal:2.5, metafora:2.0, dicotomia:1.5, tono:2.5, disenso:1.5, vector:2.0, coherencia:2.5, proyeccion:3.0 },
    context: "Presidente de Argentina (2023–). Corpus en construcción a partir de discursos de casarosada.gob.ar.",
    contextEn: "President of Argentina (2023–). Corpus under construction from casarosada.gob.ar speeches.",
  },
  {
    id: "putin", name: "Vladimir Putin", category: "Político", country: "Rusia", flag: "🇷🇺",
    photo: "https://www.google.com/s2/favicons?domain=kremlin.ru&sz=128",
    photoCredit: "kremlin.ru / CC BY 4.0",
    score: 1.58,
    params: { pronominal:1.5, metafora:1.5, dicotomia:1.5, tono:2.0, disenso:1.0, vector:1.5, coherencia:2.0, proyeccion:1.5 },
    context: "Presidente de Rusia (2000–2008, 2012–). Analizado sobre su declaración del 21 nov. 2024 tras el primer uso en combate del misil Oreshnik. Fuente: kremlin.ru (traducción oficial, CC BY 4.0).",
    contextEn: "President of Russia (2000–2008, 2012–). Analyzed on his Nov 21, 2024 statement following the first combat use of the Oreshnik missile. Source: kremlin.ru (official translation, CC BY 4.0).",
  },
  {
    id: "rufian", name: "Gabriel Rufián", category: "Político", country: "España", flag: "🇪🇸",
    photo: "https://www.google.com/s2/favicons?domain=congreso.es&sz=128",
    score: null,
    params: { pronominal:6.0, metafora:5.5, dicotomia:4.5, tono:6.5, disenso:5.0, vector:6.0, coherencia:6.0, proyeccion:6.5 },
    context: "Portavoz de Esquerra Republicana de Catalunya (ERC) en el Congreso de los Diputados. Reconocido por discursos cargados de emotividad y agudeza retórica. Corpus en construcción a partir de intervenciones parlamentarias.",
    contextEn: "Spokesperson for Esquerra Republicana de Catalunya (ERC) in the Congress of Deputies. Known for emotionally charged and rhetorically sharp speeches. Corpus under construction from parliamentary interventions.",
  },
  {
    id: "bukele", name: "Nayib Bukele", category: "Político", country: "El Salvador", flag: "🇸🇻",
    photo: "https://www.google.com/s2/favicons?domain=presidencia.gob.sv&sz=128",
    score: null,
    params: { pronominal:4.0, metafora:4.0, dicotomia:3.5, tono:4.5, disenso:3.0, vector:4.5, coherencia:4.5, proyeccion:5.0 },
    context: "Presidente de El Salvador (2019–). Populismo tecnocrático y seguridad como marca política. Corpus en construcción a partir de presidencia.gob.sv.",
    contextEn: "President of El Salvador (2019–). Technocratic populism and security as political brand. Corpus under construction from presidencia.gob.sv.",
  },
  {
    id: "kast", name: "José Antonio Kast", category: "Político", country: "Chile", flag: "🇨🇱",
    photo: "https://www.google.com/s2/favicons?domain=camara.cl&sz=128",
    score: null,
    params: { pronominal:2.5, metafora:2.5, dicotomia:2.0, tono:2.5, disenso:2.0, vector:2.5, coherencia:3.0, proyeccion:3.0 },
    context: "Diputado y fundador del Partido Republicano de Chile. Candidato presidencial 2021. Derecha radical chilena. Corpus en construcción.",
    contextEn: "Member of Parliament and founder of Chile's Republican Party. 2021 presidential candidate. Chilean far-right. Corpus under construction.",
  },
  {
    id: "elpais", name: "El País", category: "Medio", country: "España / Colombia", flag: "🇪🇸",
    photo: "https://www.google.com/s2/favicons?domain=elpais.com&sz=128",
    score: 6.22,
    params: { pronominal:5.5, metafora:7.0, dicotomia:5.3, tono:6.5, disenso:6.3, vector:5.5, coherencia:7.5, proyeccion:6.3 },
    context: "Diario hispanohablante de referencia. Análisis basado en columnas de El País (Cali). Registro de realismo crítico: posicionamiento democrático explícito, metáforas históricas ricas, apertura argumental real.",
    contextEn: "Reference Spanish-language newspaper. Analysis based on El País (Cali) columns. Critical realism register: explicit democratic positioning, rich historical metaphors, genuine argumentative openness.",
    paramTexts: {
      pronominal: "El País opera principalmente en tercera persona analítica. No hay un 'nosotros' tribal: la comunidad implícita es el observador comprometido con las normas democráticas internacionales. Cuando aparece el 'nosotros' latinoamericano, es regional y no exclusivo. El adversario político existe pero no se convoca emocionalmente.",
      metafora: "Las metáforas históricas son el rasgo más notable del corpus de El País: Churchill/Chamberlain como arquetipo de liderazgo, 'patio trasero' para el imperialismo, 'collar de gobiernos' como geometría de control. Son metáforas que desnudan la lógica del poder sin necesitar adjetivarla directamente. Alta calidad retórica.",
      dicotomia: "La dicotomía es estructural (democracia/autoritarismo, firmeza/apaciguamiento) pero nunca maniquea. El texto reconoce la complejidad antes de tomar posición. 'Tanto pesadilla como oportunidad' es el gesto más representativo: la apertura dialéctica como marca de estilo.",
      tono: "Preocupación intelectual sostenida. El registro es el del analista frustrado, no del activista alarmado. La ironía domina sobre el miedo. El tono de El País es el de la lucidez crítica: diagnostica con rigor sin perder la ecuanimidad.",
      disenso: "Alta apertura argumental: las columnas citan voces críticas (Walt, Bolopion), articulan los argumentos contrarios antes de rebatirlos, y reconocen la complejidad geopolítica. 'Colombia, irrelevante tras décadas de ser el aliado confiable' es un ejemplo de autocrítica regional que pocas cabeceras se permiten.",
      vector: "Los vectores de acción son epistémicos, no movilizadores: 'apaciguar a dictadores puede salir más caro', 'los más astutos aprovecharán el momento'. El texto convoca a la lucidez estratégica y al pragmatismo inteligente, no a la confrontación.",
      coherencia: "El rasgo más alto de El País: la coherencia afectiva. La analogía Chamberlain/Churchill y la metáfora del patio trasero se mantienen perfectamente de principio a fin. Sin saltos de tono, sin disonancias entre diagnóstico y estilo. Son los textos más coherentes afectivamente del corpus de medios.",
      proyeccion: "Futuro contingente con agencia colectiva posible. 'El futuro geopolítico mundial depende de que esta realidad cambie', 'tal vez realmente quiera acabar con el narcotráfico'. El condicional como forma retórica de la esperanza responsable: no utopía, no apocalipsis — advertencia con salida.",
    },
    paramTextsEn: {
      pronominal: "El País operates primarily in analytical third person. There is no tribal 'we': the implicit community is the observer committed to international democratic norms. When the Latin American 'we' appears, it is regional and non-exclusive. The political adversary exists but is not emotionally summoned.",
      metafora: "Historical metaphors are the most notable feature of El País's corpus: Churchill/Chamberlain as leadership archetype, 'backyard' for imperialism, 'necklace of governments' as geometry of control. These are metaphors that expose the logic of power without directly adjectives it. High rhetorical quality.",
      dicotomia: "Dichotomy is structural (democracy/authoritarianism, resolve/appeasement) but never Manichaean. The text acknowledges complexity before taking a position. 'Both nightmare and opportunity' is the most representative gesture: dialectical openness as a stylistic mark.",
      tono: "Sustained intellectual concern. The register is that of a frustrated analyst, not an alarmed activist. Irony dominates over fear. El País's tone is that of critical lucidity: rigorous diagnosis without losing equanimity.",
      disenso: "High argumentative openness: the columns cite critical voices (Walt, Bolopion), articulate opposing arguments before rebutting them, and acknowledge geopolitical complexity. 'Colombia, irrelevant after decades of being the reliable ally' is an example of regional self-criticism few outlets allow themselves.",
      vector: "Action vectors are epistemic, not mobilizing: 'appeasing dictators may cost more', 'the savviest will capitalize on the moment'. The text calls for strategic lucidity and intelligent pragmatism, not confrontation.",
      coherencia: "El País's highest-scoring trait: affective coherence. The Chamberlain/Churchill analogy and the backyard metaphor are maintained perfectly throughout. No tonal shifts, no dissonance between diagnosis and style. These are the most affectively coherent texts in the media corpus.",
      proyeccion: "Contingent future with possible collective agency. 'The world's geopolitical future depends on this reality changing', 'perhaps he really does want to end drug trafficking.' The conditional as the rhetorical form of responsible hope: no utopia, no apocalypse — warning with an exit.",
    },
  },
  {
    id: "rt", name: "RT (Russia Today)", category: "Medio", country: "Rusia / Global", flag: "🌐",
    photo: "https://www.google.com/s2/favicons?domain=rt.com&sz=128",
    score: 3.56,
    params: { pronominal:2.8, metafora:3.3, dicotomia:2.8, tono:3.3, disenso:3.3, vector:3.3, coherencia:5.8, proyeccion:4.3 },
    context: "Canal internacional ruso. Análisis basado en columnas del Valdai Club (Lukyanov, Timofeev). Polarización sofisticada: no propaganda cruda sino realpolitik pro-rusa presentada como análisis objetivo.",
    contextEn: "Russian international channel. Analysis based on Valdai Club columns (Lukyanov, Timofeev). Sophisticated polarization: not crude propaganda but pro-Russian realpolitik presented as objective analysis.",
    paramTexts: {
      pronominal: "El sujeto tácito es siempre Rusia como actor racional. 'Our near abroad', 'from Moscow's point of view' — el pronombre posesivo convierte el territorio soberano de otros países en espacio estratégico ruso. La alteridad (Occidente, Ucrania) es sistémica, no deshumanizante, pero su perspectiva nunca se valida.",
      metafora: "Las metáforas del poder territorial y arquitectónico dominan: 'esfera de influencia', 'patio trasero', 'reconstruido desde abajo'. La más reveladora es la financiera: Ucrania como 'activo con pérdidas' en la cartera geopolítica de EE.UU. Frío vocabulario de mercados aplicado a una guerra con miles de muertos.",
      dicotomia: "Occidente/mundo multipolar; normas/poder real; 'viejo paradigma'/'nueva realidad'. La dicotomía es epistemológica antes que moral: quienes siguen creyendo en las instituciones internacionales son ingenuos; los que actúan desde el poder son realistas. La superioridad intelectual implícita.",
      tono: "Desapego analítico con satisfacción latente ante el declive occidental. No hay indignación ni urgencia: hay la serenidad del que cree que la historia le da la razón. El tono Valdai: inteligencia sin empatía. La frialdad clínica como registro.",
      disenso: "El disenso existe como concesión estratégica: 'un mundo organizado en esferas de influencia no puede ser estable'. Pero se enmarca como hecho técnico inevitable, no como problema ético. La perspectiva ucraniana o europea no se valida como posición legítima — solo se describe como 'viejo paradigma'.",
      vector: "El vector apunta al fortalecimiento de la esfera de influencia rusa. La acción geopolítica asertiva se presenta como pragmatismo racional. 'Moscú debe aprender a operar dentro de un marco competitivo' — el imperialismo como adaptación lógica al nuevo orden.",
      coherencia: "Alta coherencia interna: el marco Valdai (realismo geopolítico pro-ruso) se mantiene consistente de principio a fin. Sin disonancia entre el análisis del mundo y el posicionamiento implícito de Rusia como actor legítimo. La coherencia es la del realismo calculado.",
      proyeccion: "'Una fase cualitativamente nueva comenzará' para Rusia tras Ucrania. El futuro implica victoria rusa y gestión regional competitiva. No hay horizonte compartido para Ucrania ni para el orden liberal — solo para Rusia en su nuevo papel de potencia regional consolidada.",
    },
    paramTextsEn: {
      pronominal: "The tacit subject is always Russia as a rational actor. 'Our near abroad', 'from Moscow's point of view' — the possessive pronoun converts the sovereign territory of other nations into Russian strategic space. Alterity (the West, Ukraine) is systemic, not dehumanizing, but its perspective is never validated.",
      metafora: "Territorial and architectural power metaphors dominate: 'sphere of influence', 'backyard', 'rebuilt from the ground up'. The most revealing is the financial one: Ukraine as a 'loss-making asset' in the US geopolitical portfolio. Cold market vocabulary applied to a war with thousands of dead.",
      dicotomia: "West/multipolar world; norms/real power; 'old paradigm'/'new reality'. The dichotomy is epistemological rather than moral: those who still believe in international institutions are naive; those who act from power are realists. Implicit intellectual superiority.",
      tono: "Analytical detachment with latent satisfaction at Western decline. No indignation or urgency: there is the serenity of one who believes history is proving him right. The Valdai tone: intelligence without empathy. Clinical coldness as the register.",
      disenso: "Dissent exists as a strategic concession: 'a world organized around spheres of influence cannot be stable'. But it is framed as an inevitable technical fact, not an ethical problem. The Ukrainian or European perspective is not validated as a legitimate position — only described as the 'old paradigm'.",
      vector: "The vector points to strengthening the Russian sphere of influence. Assertive geopolitical action is presented as rational pragmatism. 'Moscow must learn to operate within a competitive framework' — imperialism as logical adaptation to the new order.",
      coherencia: "High internal coherence: the Valdai framework (pro-Russian geopolitical realism) is maintained consistently throughout. No dissonance between world analysis and Russia's implicit positioning as a legitimate actor. Coherence is that of calculated realism.",
      proyeccion: "'A qualitatively new phase will begin' for Russia after Ukraine. The future implies Russian victory and competitive regional management. No shared horizon for Ukraine or the liberal order — only for Russia in its new role as a consolidated regional power.",
    },
  },
  {
    id: "telemundo", name: "Telemundo", category: "Medio", country: "EE.UU.", flag: "🇺🇸",
    photo: "https://www.google.com/s2/favicons?domain=telemundo.com&sz=128",
    score: 6.29,
    params: { pronominal:6.3, metafora:6.5, dicotomia:4.8, tono:6.3, disenso:7.0, vector:6.0, coherencia:7.5, proyeccion:6.0 },
    context: "Cadena de televisión en español de EE.UU. Periodismo de acompañamiento a la comunidad latina: la crónica humana como eje, el dato institucional como contexto.",
    contextEn: "US Spanish-language television network. Accompaniment journalism for the Latino community: the human chronicle as axis, institutional data as context.",
    paramTexts: {
      pronominal: "El 'nosotros' de Telemundo es la familia inmigrante. 'Hemos vivido mi familia y yo' construye una comunidad de dolor compartido que incluye al lector sin nombrarlo. La voz directa del testimoniante —José Contreras, su hermana Emily— humaniza antes de politizar.",
      metafora: "Las metáforas de Telemundo son metáforas de pertenencia y despojo: 'corazón roto', 'quitarme esa esperanza', 'país que apenas recordaba'. El hogar y la memoria como territorio emocional. Son metáforas de cuidado invertidas: lo que debería proteger (el Estado) es lo que arranca.",
      dicotomia: "La tensión es individuo/sistema, no nosotros/ellos. El villano no está personalizado: es la burocracia que actúa de forma arbitraria. La dicotomía es entre humanidad y procedimiento. Este encuadre evita la polarización identitaria mientras documenta el agravio.",
      tono: "Acompañamiento empático sin activismo declarado. La emoción es del testigo, no del editorial. El tono de Telemundo es el de la presencia solidaria: la crónica como forma de estar junto al que sufre. Baby Mateo como símbolo de esperanza.",
      disenso: "El rasgo más alto de Telemundo: la pluralidad de voces. Portavoz oficial + disidentes internos del DHS + datos de ICE vs. metas de la Casa Blanca + senadores + grupos de advocacy. El disenso institucional (funcionarios vs. Casa Blanca) hace el reportaje más creíble que si solo incluye víctimas.",
      vector: "El vector de Telemundo es la visibilidad: hacer público el agravio es el acto político implícito. No prescribe acción directa — documenta la brecha entre promesa y realidad. La accountability opera a través del conocimiento compartido con la comunidad.",
      coherencia: "Alta coherencia como periodismo de acompañamiento. El tono no cambia ni se contamina con la opinión. La selección de hechos construye una narrativa coherente de disfunción y humanidad sin adjetivar. El género y la misión editorial son perfectamente consistentes.",
      proyeccion: "Futuro anclado en la esperanza concreta de la reunión familiar, pero con la incertidumbre sistémica de los tiempos de procesamiento y los 261 beneficiarios DACA detenidos. La esperanza es posible pero no garantizada: el futuro depende de que el sistema corrija.",
    },
    paramTextsEn: {
      pronominal: "Telemundo's 'we' is the immigrant family. 'My family and I have lived through this' builds a community of shared pain that includes the reader without naming them. The direct voice of the witness — José Contreras, his sister Emily — humanizes before politicizing.",
      metafora: "Telemundo's metaphors are those of belonging and dispossession: 'broken heart', 'take away my hope', 'a country I barely remembered'. Home and memory as emotional territory. These are inverted care metaphors: what should protect (the State) is what tears away.",
      dicotomia: "The tension is individual/system, not us/them. The villain is not personalized: it is the bureaucracy acting arbitrarily. The dichotomy is between humanity and procedure. This frame avoids identity polarization while documenting the grievance.",
      tono: "Empathic accompaniment without declared activism. The emotion belongs to the witness, not the editorial. Telemundo's tone is that of solidarity presence: the chronicle as a form of standing beside the one who suffers. Baby Mateo as a symbol of hope.",
      disenso: "Telemundo's highest-scoring trait: plurality of voices. Official spokesperson + DHS internal dissidents + ICE data vs. White House targets + senators + advocacy groups. Institutional dissent (officials vs. White House) makes the report more credible than if it only included victims.",
      vector: "Telemundo's vector is visibility: making the grievance public is the implicit political act. It does not prescribe direct action — it documents the gap between promise and reality. Accountability operates through knowledge shared with the community.",
      coherencia: "High coherence as accompaniment journalism. The tone does not shift or become contaminated by opinion. The selection of facts builds a coherent narrative of dysfunction and humanity without adjectives. Genre and editorial mission are perfectly consistent.",
      proyeccion: "Future anchored in the concrete hope of family reunion, but with the systemic uncertainty of processing times and 261 detained DACA beneficiaries. Hope is possible but not guaranteed: the future depends on the system self-correcting.",
    },
  },
  {
    id: "foxnews", name: "Fox News", category: "Medio", country: "EE.UU.", flag: "🇺🇸",
    photo: "https://www.google.com/s2/favicons?domain=foxnews.com&sz=128",
    score: 3.94,
    params: { pronominal:3.8, metafora:3.0, dicotomia:3.0, tono:4.3, disenso:4.0, vector:3.8, coherencia:5.3, proyeccion:4.5 },
    context: "Cadena de televisión y medio digital conservador de EE.UU. Encuadra la migración como amenaza de seguridad nacional. El 'nosotros americano' como comunidad protegida frente al flujo externo.",
    contextEn: "US conservative television network and digital outlet. Frames migration as a national security threat. The 'American we' as a protected community against external flow.",
    paramTexts: {
      pronominal: "'American workers', 'American communities', 'protecting Americans': el 'nosotros' de Fox News es exclusivamente los nativos. Los migrantes son el objeto de la política, no sujetos del texto. Su perspectiva no existe. El pronombre excluyente opera en el silencio de las voces ausentes.",
      metafora: "La metáfora más reveladora del corpus Fox: la burbuja financiera (dot-com, housing) aplicada a 60 años de migración humana. Convierte la vida de millones de personas en especulación económica irracional. No hay insultos — hay frío vocabulario de mercados, que es la deshumanización más sofisticada.",
      dicotomia: "Migración = amenaza de seguridad; enforcement = corrección necesaria; 'era de la migración masiva' = aberración que debe cerrarse. La dicotomía es temporal (pasado permisivo/futuro equilibrado) y estratégica (amenaza interna/seguridad nacional). Más gestora que identitaria.",
      tono: "Triunfalismo contenido en la columna de opinión; aprobación moderada en el análisis político. El tono de Fox es el del analista conservador que ve confirmadas sus predicciones. No miedo — satisfacción. La emoción está en la selección de los ejemplos (el afgano que disparó), no en el lenguaje explícito.",
      disenso: "La apertura al disenso es selectiva: Plitsas y Harding en el análisis político, datos de Pew y Brookings (solo la parte favorable) en la columna. Las voces críticas son reales pero se enmarcan como preocupaciones residuales. El balance existe como señal de credibilidad, no como apertura genuina.",
      vector: "El vector de Fox es la validación de la agenda enforcement: la NSS Trump es la respuesta racional a amenazas reales; el declive migratorio es una corrección largamente esperada. La acción implícita: continuar, no corregir. El presente enforcement como dirección correcta.",
      coherencia: "Coherencia alta internamente: el marco de seguridad nacional conservador se mantiene en ambos textos. Sin disonancias intraartículo. La tensión aparece entre el análisis de noticias (con voces críticas incluidas) y la columna de opinión (sin ellas): distintos niveles de balance según el género.",
      proyeccion: "'Un retorno al equilibrio sostenible': el futuro de Fox es restaurador, no constructivo. Volver a antes de 1965, recuperar la seguridad perdida, proteger lo que se tiene. El horizonte es el pasado reconstruido. No hay proyecto compartido con los migrantes — hay proyecto americano sin ellos.",
    },
    paramTextsEn: {
      pronominal: "'American workers', 'American communities', 'protecting Americans': Fox News's 'we' is exclusively native-born. Migrants are the object of policy, not subjects of the text. Their perspective does not exist. The exclusionary pronoun operates in the silence of absent voices.",
      metafora: "The most revealing metaphor in the Fox corpus: the financial bubble (dot-com, housing) applied to 60 years of human migration. It converts the lives of millions of people into irrational economic speculation. No insults — just cold market vocabulary, which is the most sophisticated dehumanization.",
      dicotomia: "Migration = security threat; enforcement = necessary correction; 'era of mass migration' = aberration that must close. The dichotomy is temporal (permissive past/balanced future) and strategic (internal threat/national security). More managerial than identity-based.",
      tono: "Contained triumphalism in the opinion column; moderate approval in political analysis. Fox's tone is that of the conservative analyst who sees predictions confirmed. Not fear — satisfaction. Emotion is in the selection of examples (the Afghan who shot), not in explicit language.",
      disenso: "Openness to dissent is selective: Plitsas and Harding in political analysis, Pew and Brookings data (only the favorable part) in the column. Critical voices are real but framed as residual concerns. Balance exists as a credibility signal, not as genuine openness.",
      vector: "Fox's vector is the validation of the enforcement agenda: Trump's NSS is the rational response to real threats; the migration decline is a long-overdue correction. Implicit action: continue, not correct. Present enforcement as the right direction.",
      coherencia: "High coherence internally: the conservative national security frame is maintained across both texts. No intra-article dissonances. Tension appears between news analysis (with critical voices included) and opinion column (without): different levels of balance depending on genre.",
      proyeccion: "'A return to sustainable equilibrium': Fox's future is restorative, not constructive. Return to before 1965, recover lost security, protect what is owned. The horizon is the reconstructed past. No shared project with migrants — there is an American project without them.",
    },
  },
  {
    id: "publico", name: "Público", category: "Medio", country: "España", flag: "🇪🇸",
    photo: "https://www.google.com/s2/favicons?domain=publico.es&sz=128",
    score: 6.69,
    params: { pronominal:6.8, metafora:6.8, dicotomia:5.3, tono:6.8, disenso:7.5, vector:6.5, coherencia:7.3, proyeccion:6.8 },
    context: "Diario digital progresista español. Análisis basado en cobertura de Trump 2026. Marco de derechos humanos y rendición de cuentas democrática. Periodismo de presencia: el dato como argumento, la voz como autoridad.",
    contextEn: "Spanish progressive digital newspaper. Analysis based on Trump 2026 coverage. Human rights and democratic accountability frame. Journalism of presence: data as argument, voice as authority.",
    paramTexts: {
      pronominal: "La comunidad de referencia de Público es la democracia internacional, no la identidad española. No hay 'nosotros' nacional — hay el sujeto universal de los derechos humanos. Las víctimas (36 muertos bajo ICE, José Contreras) se humanizan individualmente sin convertirse en abstracción.",
      metafora: "'Amplio ataque contra pilares de la democracia' — metáfora arquitectónica de la democracia como edificio que puede demolerse desde dentro. 'Tierra firme en suelo resbaladizo' — erosión de la base de poder desde el propio electorado. Las metáforas de Público son estructurales y visuales, sin ornamento.",
      dicotomia: "Democracia vs. autoritarismo, pero enmarcado en derechos jurídicos concretos: 'tiene autoridad pero no derecho a negar debido proceso'. La distinción legal evita la dicotomía identitaria y eleva el debate. Público reconoce los 'antecedentes coloniales' de las propias democracias — autocrítica del marco.",
      tono: "Preocupación moral sostenida sin alarma. El tono es técnico-ético: documenta sin sensacionalizar. La temperatura constante es la de la preocupación documentada. La emoción está en los datos (36 muertes, tiempos de procesamiento de 183 días), no en los adjetivos.",
      disenso: "El rasgo más alto de Público: la pluralidad genuina. Incluye la autocrítica de las propias democracias ('antecedentes de crímenes coloniales'), el 19% de votantes de Trump disidentes de las deportaciones, y la distinción legal entre autoridad y derecho. El disenso existe dentro del propio marco democrático.",
      vector: "Público convoca a la rendición de cuentas a través del conocimiento compartido. El vector no es la movilización callejera sino la exigencia de cumplimiento del Estado de derecho. 'La desescalada en Minnesota responde a la necesidad de contener la caída' — la opinión pública como mecanismo democrático.",
      coherencia: "Marco de derechos humanos consistente de principio a fin. Sin saltos entre indignación y análisis frío. La temperatura es constante: la de la preocupación documentada. La fuente (HRW) y el medio (Público) comparten el mismo registro ético, lo que genera una coherencia natural.",
      proyeccion: "Futuro contingente con agencia ciudadana explícita. 'La desescalada en Minnesota' como prueba de que la opinión pública puede torcer la política. El optimismo democrático de Público está basado en evidencia, no en esperanza abstracta. El futuro cambia si los ciudadanos actúan.",
    },
    paramTextsEn: {
      pronominal: "Público's reference community is international democracy, not Spanish identity. No national 'we' — there is the universal subject of human rights. Victims (36 dead in ICE custody, José Contreras) are humanized individually without becoming abstraction.",
      metafora: "'Sweeping assault on the pillars of democracy' — architectural metaphor of democracy as a building demolishable from within. 'Solid ground becomes slippery' — erosion of power base from within the electorate itself. Público's metaphors are structural and visual, without ornamentation.",
      dicotomia: "Democracy vs. authoritarianism, but framed in concrete legal rights: 'has authority but no right to deny due process'. The legal distinction avoids identity dichotomy and elevates the debate. Público acknowledges democracies' own 'colonial track records' — self-criticism of the framework.",
      tono: "Sustained moral concern without alarm. The tone is technical-ethical: documents without sensationalizing. The constant temperature is that of documented concern. Emotion is in the data (36 deaths, 183-day processing times), not in adjectives.",
      disenso: "Público's highest trait: genuine plurality. Includes self-criticism of democracies themselves ('track records of colonial crimes'), the 19% of Trump voters dissenting from deportations, and the legal distinction between authority and right. Dissent exists within the democratic framework itself.",
      vector: "Público calls for accountability through shared knowledge. The vector is not street mobilization but the demand for rule-of-law compliance. 'De-escalation in Minnesota responds to the need to contain the fall' — public opinion as a democratic mechanism.",
      coherencia: "Consistent human rights framework throughout. No shifts between indignation and cold analysis. The temperature is constant: that of documented concern. The source (HRW) and the outlet (Público) share the same ethical register, generating natural coherence.",
      proyeccion: "Contingent future with explicit citizen agency. 'De-escalation in Minnesota' as proof that public opinion can bend policy. Público's democratic optimism is based on evidence, not abstract hope. The future changes if citizens act.",
    },
  },
];

const PARAM_COLORS = CATEGORICOS;

const PARAM_SHORT = {
  pronominal: 'Pronominal',
  metafora:   'Metáfora',
  dicotomia:  'Dicotomía',
  tono:       'Tono',
  disenso:    'Disenso',
  vector:     'Vector',
  coherencia: 'Coherencia',
  proyeccion: 'Proyección',
};

const PARAM_SHORT_EN = {
  pronominal: 'Pronominal',
  metafora:   'Metaphor',
  dicotomia:  'Dichotomy',
  tono:       'Tone',
  disenso:    'Dissent',
  vector:     'Vector',
  coherencia: 'Coherence',
  proyeccion: 'Projection',
};

// Orden de parámetros de un RESULTADO de análisis (fórmula vigente, sin P8).
// Los share-links antiguos con 8 scores siguen decodificando bien: el orden se
// conserva y el octavo valor simplemente se ignora.
const PARAMS_ORDER = ['pronominal','metafora','dicotomia','tono','disenso','vector','coherencia'];

function encodeShareResult(result) {
  const scores = PARAMS_ORDER.map(id => result.params[id]?.score ?? 0);
  const compact = [result.name, result.category, result.ira, result.iraLabel, result.summary, ...scores];
  try { return btoa(encodeURIComponent(JSON.stringify(compact))); } catch { return null; }
}

function decodeShareResult(encoded) {
  try {
    const arr = JSON.parse(decodeURIComponent(atob(encoded)));
    const [name, category, ira, iraLabel, summary, ...scores] = arr;
    const params = {};
    PARAMS_ORDER.forEach((id, i) => { params[id] = { score: scores[i] ?? 0, desc: '' }; });
    return { name, category, ira, iraLabel, summary, params };
  } catch { return null; }
}

function drawRadar(canvas, result, accent = '#DCB149') {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = Math.min(cx, cy) - 28;
  const N = PARAMS_ORDER.length;
  ctx.clearRect(0, 0, W, H);
  // grid rings
  for (let lvl = 1; lvl <= 5; lvl++) {
    const r = (R * lvl) / 5;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const a = (Math.PI * 2 * i) / N - Math.PI / 2;
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // axis spokes
  for (let i = 0; i < N; i++) {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // data polygon
  ctx.beginPath();
  PARAMS_ORDER.forEach((id, i) => {
    const val = result.params[id]?.score ?? 0;
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (R * val) / 10;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = accent === '#DCB149' ? 'rgba(220,177,73,0.38)' : 'rgba(220,177,73,0.38)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // labels
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const labels = PARAMS_ORDER.map(id => PARAM_SHORT[id]);
  labels.forEach((lbl, i) => {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = R + 18;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(lbl, cx + r * Math.cos(a), cy + r * Math.sin(a));
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const scoreColor = colorPuntuacion;

// ── Componentes ───────────────────────────────────────────────────────────────

function FlagEmoji({ emoji, size = 18 }) {
  const codepoints = [...emoji]
    .map(c => c.codePointAt(0).toString(16))
    .filter(cp => cp !== "fe0f")
    .join("-");
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoints}.svg`}
      alt={emoji}
      style={{ width: size, height: size, verticalAlign: "middle", display: "inline-block" }}
    />
  );
}

function Badge({ label }) {
  return (
    <span style={{
      fontSize:"12px", lineHeight:"18px", color:"var(--ira-texto-2)",
      border:"1px solid var(--ira-linea-fuerte)", padding:"1px 8px", borderRadius:"99px",
    }}>{label}</span>
  );
}

function EntityCard({ entity, lang }) {
  const T = TEXTS[lang];
  const catLabel = CAT_TRANS[lang][entity.category] || entity.category;
  const hasScore = entity.score != null;
  return (
    <Link to={entity.category === 'Político' ? `/politicos?figura=${entity.id}` : `/entity/${entity.id}`} className="ira-figura">
      <div className="ira-figura__cabecera">
        {entity.photo && <img src={entity.photo} alt="" className="ira-figura__foto" />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom:"8px", display:"flex", gap:"8px", alignItems:"center" }}>
            <FlagEmoji emoji={entity.flag} size={18} />
            <Badge label={catLabel} />
          </div>
          <h3 className="ira-figura__nombre">{entity.name}</h3>
          <p className="ira-figura__pais">{entity.country}</p>
        </div>
      </div>
      <div className="ira-figura__puntuacion">
        <p className="ira-figura__cifra">
          <span style={{ color: hasScore ? colorCifra(entity.score) : "var(--ira-texto-3)" }}>
            {formatearPuntuacion(entity.score, lang)}
          </span>
          <span className="ira-figura__max">/10</span>
        </p>
        <BarraEscala puntuacion={hasScore ? entity.score : null} grosor={6} />
      </div>
      <span className="ira-figura__cta">{T.seeAnalysis}</span>
    </Link>
  );
}

function RadarTooltip({ active, payload }) {
  const { accent, accentA } = useContext(AccentContext);
  if (!active || !payload?.length) return null;
  const { label, value } = payload[0].payload;
  return (
    <div style={{
      background: "rgba(10,10,16,0.94)", border: `1px solid ${accentA(0.45)}`,
      borderRadius: "8px", padding: "7px 12px",
      fontFamily: "var(--ira-font-texto)", pointerEvents: "none",
    }}>
      <span style={{ color: "var(--ira-texto-2)", fontSize: "13px" }}>{label}</span>
      <span style={{ color: accent, fontSize: "12px", fontWeight: 700, marginLeft: "8px" }}>
        — {Number(value).toFixed(1)}
      </span>
    </div>
  );
}

const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';

const PARAM_KEY_MAP = {
  'Uso pronominal inclusivo':   'pronominal',
  'Tipo de metáfora dominante': 'metafora',
  'Carga dicotómica':           'dicotomia',
  'Tono emocional dominante':   'tono',
  'Reconocimiento del disenso': 'disenso',
  'Vector de acción':           'vector',
  'Coherencia afectiva':        'coherencia',
  'Proyección de futuro':       'proyeccion',
};

// Inversa de PARAM_KEY_MAP — para reconstruir el array de params desde una fila de daily_analyses
const REVERSE_PARAM_MAP = {
  pronominal: 'Uso pronominal inclusivo',
  metafora:   'Tipo de metáfora dominante',
  dicotomia:  'Carga dicotómica',
  tono:       'Tono emocional dominante',
  disenso:    'Reconocimiento del disenso',
  vector:     'Vector de acción',
  coherencia: 'Coherencia afectiva',
  proyeccion: 'Proyección de futuro',
};

const MONTHS_ES_ROW = ['enero','febrero','marzo','abril','mayo','junio',
                       'julio','agosto','septiembre','octubre','noviembre','diciembre'];

/** Convierte una fila de daily_analyses al shape que esperan SpeechCard / SpeechView */
export function rowToSpeech(row) {
  let dateStr = row.published_date ?? '';
  if (row.published_date) {
    const d = new Date(row.published_date + 'T00:00:00Z');
    dateStr = `${d.getUTCDate()} de ${MONTHS_ES_ROW[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
  }
  const domain = (() => {
    try { return new URL(row.source_url).hostname.replace(/^www\./, ''); } catch { return ''; }
  })();
  const wc  = row.text ? row.text.split(/\s+/).filter(Boolean).length : 0;
  const ira = row.ira ?? 0;
  const iraLabel   = ira >= 7.5 ? 'Empático'  : ira >= 5 ? 'Mixto'  : 'Polarizante';
  const iraLabelEn = ira >= 7.5 ? 'Empathic'  : ira >= 5 ? 'Mixed'  : 'Polarizing';
  // Solo los parámetros presentes en la fila: las filas nuevas ya no traen P8
  // (proyeccion) y no deben renderizar una barra en 0.0.
  const params = Object.entries(REVERSE_PARAM_MAP)
    .filter(([key]) => row.params?.[key] != null)
    .map(([key, name]) => {
      const p = row.params[key];
      return { name, value: p.score ?? 0, quote: p.quote ?? null, note: p.desc ?? '' };
    });
  return {
    id:           `daily-${row.id}`,
    entityId:     row.entity_id,
    entityName:   row.entity_name,
    title:        row.title ?? 'Conferencia de prensa',
    date:         dateStr,
    context:      domain ? `Fuente: ${domain}` : '',
    wordCount:    wc,
    duration:     null,
    iraScore:     ira,
    iraLabel,
    iraLabelEn,
    summary:      row.summary ?? '',
    lecturaAutor: row.lectura_autor ?? '',
    params,
    segments:     row.segments ?? [],
    transcript:   row.text ?? '',
  };
}

export function mergeSpeech(speech, row) {
  if (!speech) return null;
  if (!row) return speech;
  return {
    ...speech,
    iraScore:      row.ira              ?? speech.iraScore,
    summary:       row.summary          ?? speech.summary,
    lecturaAutor:  row.lectura_autor    ?? speech.lecturaAutor,
    lecturaAutorEn: row.lectura_autor_en ?? speech.lecturaAutorEn,
    params: speech.params.map(p => {
      const sup = row.params?.[PARAM_KEY_MAP[p.name]];
      return {
        ...p,
        value: sup?.score ?? p.value,
        note:  sup?.desc  ?? p.note,
      };
    }),
  };
}

// Vista de un discurso a pantalla completa sobre la ficha (Escape o "Volver" la cierran)
function SuperposicionDiscurso({ speech, lang, onCerrar }) {
  const ref = useRef(null);
  useAtraparFoco(true, ref, onCerrar);
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={speech.title} tabIndex={-1} style={{
      position:"fixed", inset:0, zIndex:250, outline:"none",
      background:"var(--ira-noche)", overflowY:"auto",
    }}>
      <SpeechView speech={speech} onBack={onCerrar} lang={lang} />
    </div>
  );
}

function EntityDetailPage() {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { lang, supabaseMap } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const [dailySpeeches, setDailySpeeches] = useState([]);

  const entity = ENTITIES.find(e => e.id === entityId);
  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);

  useEffect(() => {
    if (!entityId) return;
    fetch(
      `${SUPABASE_URL}/rest/v1/daily_analyses?entity_id=eq.${entityId}&order=published_date.desc&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(rows => { if (Array.isArray(rows)) setDailySpeeches(rows.map(rowToSpeech)); })
      .catch(() => {});
  }, [entityId]);

  if (!entity) return <Navigate to="/" replace />;

  const accent = entity.category === 'Medio' ? '#DCB149' : '#DCB149';
  const accentA = (a) => entity.category === 'Medio' ? `rgba(220,177,73,${a})` : `rgba(220,177,73,${a})`;

  const activeSpeech = activeSpeechId
    ? (mergeSpeech(getSpeechById(activeSpeechId), supabaseMap[activeSpeechId])
       ?? dailySpeeches.find(s => s.id === activeSpeechId))
    : null;

  // IRA dinámico: promedio de todos los discursos disponibles (diarios + corpus)
  const curatedScores = getSpeechesByEntity(entity.id).map(s => {
    const merged = mergeSpeech(s, supabaseMap[s.id]);
    return merged?.iraScore ?? s.iraScore;
  }).filter(v => typeof v === 'number');
  const dailyScores = dailySpeeches.map(s => s.iraScore).filter(v => typeof v === 'number');
  const allScores = [...dailyScores, ...curatedScores];
  const liveScore = allScores.length > 0
    ? allScores.reduce((sum, v) => sum + v, 0) / allScores.length
    : (entity.score ?? 0);

  const T = TEXTS[lang];
  const params = PARAMS_TRANS[lang];
  const details = PARAM_DETAILS_TRANS[lang];
  const catLabel = CAT_TRANS[lang][entity.category] || entity.category;
  const context = lang === "en" && entity.contextEn ? entity.contextEn : entity.context;
  return (
    <AccentContext.Provider value={{ accent, accentA, mode: entity.category === 'Medio' ? 'medios' : 'politico' }}>
    <div style={{ fontFamily:"var(--ira-font-texto)", position:"relative", overflow:"hidden" }}>
      <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
        className="ira-volver ira-boton ira-boton--secundario ira-boton--compacto"
        type="button"
        >{T.back}</button>
      <div style={{ position:"relative", zIndex:1 }}>
      <div className="detail-page" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(20px)",
        transition:"all 0.4s ease",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
          <div>
            <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"8px" }}>
              <FlagEmoji emoji={entity.flag} size={22} />
              <Badge label={catLabel} />
            </div>
            <h1 style={{ margin:"0 0 4px", fontSize:"clamp(32px,6vw,44px)", fontWeight:500, lineHeight:1.05, color:"var(--ira-nieve)", fontFamily:"var(--ira-font-titulo)", letterSpacing:"-0.02em" }}>
              {entity.name}
            </h1>
            <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)" }}>{entity.country}</p>
          </div>
          <p className="ira-figura__cifra" style={{ flexDirection:"column", alignItems:"flex-end", gap:"6px" }}>
            <span style={{ display:"flex", alignItems:"baseline", gap:"6px" }}>
              <span style={{ fontSize:"56px", color:scoreColor(liveScore) }}>{formatearPuntuacion(liveScore, lang)}</span>
              <span className="ira-figura__max" style={{ fontSize:"18px" }}>/10</span>
            </span>
            <span style={{ fontFamily:"var(--ira-font-texto)", fontSize:"12px", letterSpacing:0, color:"var(--ira-texto-3)" }}>IRA</span>
          </p>
        </div>
        <IndicadorEscala puntuacion={liveScore} lang={lang} className="ira-ficha__indicador" />
        {entity.photo && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            <img src={entity.photo} alt={entity.name} style={{
              width: 100, height: 100, borderRadius: "50%", objectFit: "cover",
              objectPosition: "center top", border: `3px solid ${accent}`,
              boxShadow: `0 0 16px ${accentA(0.35)}`,
            }} />
            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--ira-texto-3)", letterSpacing: "0.05em" }}>
              {entity.photoCredit}
            </p>
          </div>
        )}
        <p style={{ fontSize:"14px", color:"var(--ira-texto-3)", lineHeight:1.6, marginBottom:"24px", borderLeft:`2px solid ${accentA(0.4)}`, paddingLeft:"12px" }}>
          {context}
        </p>
        <div style={{ marginBottom:"24px" }}>
          <Suspense fallback={null}>
            <RadarSection
              data={PARAMS_TRANS.es.map(p => ({ param: (lang === "en" ? PARAM_SHORT_EN : PARAM_SHORT)[p.id], label: p.label, value: entity.params[p.id] }))}
              colors={[accent]}
              CustomTooltip={RadarTooltip}
            />
          </Suspense>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"20px" }}>
          <p style={{ fontSize:"12px", letterSpacing:"0.14em", color:"var(--ira-texto-3)", textTransform:"uppercase", marginBottom:"16px" }}>
            {T.paramsTitle}
          </p>
          {params.map((p, i) => {
            const val = entity.params[p.id];
            const isOpen = expanded === p.id;
            const det = details[p.id];
            return (
              <FilaParametro
                key={p.id}
                etiqueta={p.label}
                puntuacion={val}
                descripcion={p.desc}
                lang={lang}
                abierto={isOpen}
                onToggle={() => setExpanded(isOpen ? null : p.id)}
              >
                    {entity.quotes?.[p.id] && (
                      <p style={{
                        margin:"0 0 12px", padding:"0 0 0 10px",
                        borderLeft:"2px solid var(--ira-linea-fuerte)",
                        fontSize:"14px", fontStyle:"italic", fontFamily:"var(--ira-font-texto)",
                        color:"var(--ira-texto-2)", lineHeight:1.55,
                      }}>«{entity.quotes[p.id]}»</p>
                    )}
                    {(lang === "en" ? entity.paramTextsEn?.[p.id] : entity.paramTexts?.[p.id]) && (
                      <div style={{
                        background: accentA(0.05),
                        border: `1px solid ${accentA(0.2)}`,
                        borderRadius:"8px", padding:"10px 12px", marginBottom:"12px",
                      }}>
                        <p style={{ margin:"0 0 5px", fontSize:"12px", letterSpacing:"0.14em", color: accentA(0.8), textTransform:"uppercase" }}>{T.analysisLabel}</p>
                        <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.65 }}>{lang === "en" ? entity.paramTextsEn[p.id] : entity.paramTexts[p.id]}</p>
                      </div>
                    )}
                    <p style={{ margin:"0 0 12px", fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.65 }}>
                      {det.detail}
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                      <div style={{ background:"rgba(141,170,126,0.08)", border:"1px solid rgba(141,170,126,0.3)", borderRadius:"8px", padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 5px", fontSize:"12px", letterSpacing:"0.14em", color:"var(--ira-salvia)", textTransform:"uppercase" }}>{T.empatico}</p>
                        <p style={{ margin:0, fontSize:"13px", color:"var(--ira-texto-3)", lineHeight:1.55, fontStyle:"italic", fontFamily:"var(--ira-font-texto)" }}>{det.empatico}</p>
                      </div>
                      <div style={{ background:"rgba(190,40,26,0.08)", border:"1px solid rgba(190,40,26,0.35)", borderRadius:"8px", padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 5px", fontSize:"12px", letterSpacing:"0.14em", color:"var(--ira-estrella-polarizante)", textTransform:"uppercase" }}>{T.polarizador}</p>
                        <p style={{ margin:0, fontSize:"13px", color:"var(--ira-texto-3)", lineHeight:1.55, fontStyle:"italic", fontFamily:"var(--ira-font-texto)" }}>{det.polarizador}</p>
                      </div>
                    </div>
              </FilaParametro>
            );
          })}
        </div>
        <SpeechesSection
          entityId={entity.id}
          speeches={[
            ...dailySpeeches,
            ...getSpeechesByEntity(entity.id).map(s => mergeSpeech(s, supabaseMap[s.id])),
          ]}
          onSelectSpeech={setActiveSpeechId}
          lang={lang}
          fromTFG={['trump','petro','sheinbaum','ardern'].includes(entity.id)}
        />
      </div>{/* fin detail-page */}
      </div>{/* fin zIndex:1 */}
      {activeSpeech && (
        <SuperposicionDiscurso speech={activeSpeech} lang={lang} onCerrar={() => setActiveSpeechId(null)} />
      )}
    </div>{/* fin page */}
    </AccentContext.Provider>
  );
}

function IRAModal({ onClose, lang }) {
  const { accent } = useContext(AccentContext);
  const [mounted, setMounted] = useState(false);
  const ventanaRef = useRef(null);
  useAtraparFoco(true, ventanaRef, onClose);
  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);
  const T = TEXTS[lang];
  const paramsInfo = IRA_PARAMS_INFO_TRANS[lang];
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:300,
      background:"rgba(4,20,20,0.92)", backdropFilter:"blur(20px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      opacity: mounted?1:0, transition:"opacity 0.3s ease", padding:"20px",
    }}>
      <div ref={ventanaRef} role="dialog" aria-modal="true" aria-labelledby="ira-modal-que-es" tabIndex={-1}
        onClick={e => e.stopPropagation()} style={{
        background:"var(--ira-superficie)", border:"1px solid var(--ira-linea)", outline:"none",
        borderRadius:"var(--ira-radio-xl)", padding:"36px 32px", maxWidth:"580px", width:"100%",
        maxHeight:"88vh", overflowY:"auto",
        transform: mounted?"translateY(0)":"translateY(20px)",
        transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ marginBottom:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
            <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:accent, boxShadow:`0 0 8px ${accent}` }} />
            <span style={{ fontSize:"12px", letterSpacing:"0.18em", color:"var(--ira-texto-3)", textTransform:"uppercase" }}>{T.modalTag}</span>
          </div>
          <h2 id="ira-modal-que-es" style={{ margin:"0 0 16px", fontSize:"30px", fontWeight:500, lineHeight:1.15, color:"var(--ira-nieve)", fontFamily:"var(--ira-font-titulo)", letterSpacing:"-0.02em" }}>
            {T.modalTitle}
          </h2>
          <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.75 }}>
            {T.modalIntro}
          </p>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"22px", marginBottom:"24px" }}>
          <p style={{ margin:"0 0 10px", fontSize:"12px", letterSpacing:"0.16em", color:accent, textTransform:"uppercase" }}>{T.modalWhatTitle}</p>
          <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.75 }}>
            {T.modalWhatPre}
            <span style={{ color:"var(--ira-estrella-polarizante)", fontWeight:600 }}>{T.modalWhatPol}</span>
            {", "}
            <span style={{ color:"var(--ira-salvia)", fontWeight:600 }}>{T.modalWhatEmp}</span>
            {"."}
          </p>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"22px", marginBottom:"24px" }}>
          <p style={{ margin:"0 0 16px", fontSize:"12px", letterSpacing:"0.16em", color:accent, textTransform:"uppercase" }}>{T.modalParamsTitle}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {paramsInfo.map((p, i) => (
              <div key={i} style={{ borderLeft:`2px solid ${PARAM_COLORS[i]}50`, paddingLeft:"14px" }}>
                <p style={{ margin:"0 0 4px", fontSize:"14px", fontWeight:700, color:PARAM_COLORS[i], fontFamily:"var(--ira-font-texto)", letterSpacing:"0.03em" }}>{p.name}</p>
                <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-3)", lineHeight:1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"22px", marginBottom:"28px" }}>
          <p style={{ margin:"0 0 10px", fontSize:"12px", letterSpacing:"0.16em", color:accent, textTransform:"uppercase" }}>{T.modalOriginTitle}</p>
          <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.75 }}>
            {T.modalOriginPre}
            <em style={{ color:"var(--ira-texto-2)" }}>{T.modalOriginBook}</em>
            {T.modalOriginPost}
          </p>
        </div>

        <button type="button" onClick={onClose} className="ira-boton ira-boton--secundario" style={{ width:"100%" }}>{T.close}</button>
      </div>
    </div>
  );
}

const WORD_LIMIT = 800;
function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

function HistoryCard({ row, lang }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(row.created_at).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { day:"numeric", month:"short", year:"numeric" });
  const params = PARAMS_TRANS[lang];
  return (
    <div
      style={{
        borderRadius:"var(--ira-radio-l)",
        background:"var(--ira-superficie)",
        border:`1px solid ${expanded ? "var(--ira-linea-fuerte)" : "var(--ira-linea)"}`,
        overflow:"hidden", transition:"border-color 0.2s",
      }}
    >
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded(e => !e)}
        style={{ display:"flex", alignItems:"center", gap:"14px", padding:"12px 16px", width:"100%", minHeight:"56px",
          background:"none", border:"none", color:"inherit", font:"inherit", textAlign:"left", cursor:"pointer" }}>
        <EtiquetaPuntuacion puntuacion={row.ira_score} lang={lang} />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:"0 0 2px", fontSize:"15px", fontWeight:500, color:"var(--ira-nieve)", fontFamily:"var(--ira-font-titulo)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {row.name}
          </p>
          <p style={{ margin:0, fontSize:"12px", color:"var(--ira-texto-2)", fontFamily:"var(--ira-font-texto)" }}>
            {CAT_TRANS[lang][row.category] || row.category} · {date}
          </p>
        </div>
        <span style={{
          fontSize:"13px", color:"var(--ira-texto-3)", flexShrink:0,
          display:"block", transition:"transform 0.2s",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }} aria-hidden="true">▾</span>
      </button>
      {expanded && (
        <div style={{ padding:"0 16px 16px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          {row.summary && (
            <p style={{ margin:"14px 0 14px", fontSize:"14px", color:"var(--ira-texto-3)", lineHeight:1.65 }}>
              {row.summary}
            </p>
          )}
          {row.params && params.filter(p => row.params[p.id] != null).map((p) => (
            <FilaParametro key={p.id} etiqueta={p.label} puntuacion={+(row.params[p.id]?.score ?? 0)} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

function Analyzer({ lang }) {
  const { mode } = useContext(AccentContext);
  const { openLogin, openRegister, requireAuth } = useContext(AppContext);
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [category, setCategory] = useState(() => mode === 'medios' ? "Medio" : "Político");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const share = p.get('share');
    return share ? decodeShareResult(share) : null;
  });
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const T = TEXTS[lang];
  const wordCount = countWords(text);
  const overLimit = !isAdmin && wordCount > WORD_LIMIT;

  const fetchHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_analyses')
      .select('id,name,category,ira_score,summary,params,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) console.error('[user_analyses] select error:', error);
    if (data) setHistory(data);
  };

  useEffect(() => { fetchHistory(); }, [user]);

  async function analyze() {
    if (!text.trim() || text.trim().length < 50) { setError(T.errorShort); return; }
    if (overLimit) { setError(T.errorLong); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      // El endpoint exige sesión: enviar el access token del usuario
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ text, name: name || T.defaultName, category, context: context.trim() || undefined }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok && !ct.includes("json")) {
        throw new Error(`Error del servidor (${res.status}). Intenta de nuevo.`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const resultData = { ...data, name: name || T.defaultName, category };
      setResult(resultData);
      if (user) {
        supabase.from('user_analyses').insert({
          user_id: user.id,
          name: resultData.name,
          category: resultData.category,
          ira_score: resultData.ira,
          summary: resultData.summary,
          params: resultData.params,
        }).then(({ error }) => {
          if (error) console.error('[user_analyses] insert error:', error);
          fetchHistory();
        });
      }
    } catch(e) {
      setError(e.message || T.errorGeneral);
    }
    setLoading(false);
  }

  if (result) return <AnalysisResult result={result} onReset={() => setResult(null)} lang={lang} />;

  const submit = () => { if (user) analyze(); else requireAuth(analyze); };

  return (
    <div style={{ maxWidth:"640px", margin:"0 auto" }}>
      {!user && (
        <div className="ira-aviso">
          <p style={{ margin:0 }}>
            {lang === "en"
              ? <>{"Analyzing a text requires an account. "}<button type="button" className="ira-enlace-boton" onClick={openRegister}>Create an account</button>{" or "}<button type="button" className="ira-enlace-boton" onClick={openLogin}>sign in</button>{"."}</>
              : <>{"Para analizar un texto necesitas una cuenta. "}<button type="button" className="ira-enlace-boton" onClick={openRegister}>Crea una cuenta</button>{" o "}<button type="button" className="ira-enlace-boton" onClick={openLogin}>inicia sesión</button>{"."}</>
            }
          </p>
        </div>
      )}
      <div className="ira-grupo">
        <label htmlFor="ira-an-nombre" className="ira-rotulo">{T.nameLabel}</label>
        <input id="ira-an-nombre" className="ira-campo" value={name} onChange={e => setName(e.target.value)}
          placeholder={mode === 'medios' ? T.namePlaceholderMedios : T.namePlaceholder} />
      </div>
      <div className="ira-grupo">
        <label htmlFor="ira-an-contexto" className="ira-rotulo">{lang === 'en' ? "Context (optional)" : "Contexto (opcional)"}</label>
        <input id="ira-an-contexto" className="ira-campo" value={context} onChange={e => setContext(e.target.value)}
          aria-describedby="ira-an-contexto-ayuda"
          placeholder={lang === 'en'
            ? "e.g. Campaign rally, 50,000 attendees, 3 days before election"
            : "ej. Mitin electoral, 50.000 asistentes, 3 días antes de las elecciones"} />
        <p id="ira-an-contexto-ayuda" className="ira-ayuda">
          {lang === 'en'
            ? "Who spoke, to whom, when and where. Improves accuracy (Van Dijk, 2008)."
            : "Quién habló, ante quién, cuándo y dónde. Mejora la precisión del análisis (Van Dijk, 2008)."}
        </p>
      </div>
      <fieldset className="ira-grupo" style={{ border:"none", padding:0, margin:"0 0 20px" }}>
        <legend className="ira-rotulo">{T.catLabel}</legend>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {["Político","Medio","Otro"].map(cat => (
            <button type="button" key={cat} onClick={() => setCategory(cat)} aria-pressed={category===cat} className="ira-chip">
              {CAT_TRANS[lang][cat]}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="ira-grupo">
        <label htmlFor="ira-an-texto" className="ira-rotulo">{T.textLabel}</label>
        <textarea id="ira-an-texto" className="ira-campo" value={text} onChange={e => setText(e.target.value)}
          placeholder={mode === 'medios' ? T.textPlaceholderMedios : T.textPlaceholder}
          rows={8} aria-invalid={overLimit || undefined} aria-describedby="ira-an-cuenta"
          style={{ resize:"vertical", lineHeight:1.6, borderColor: overLimit ? "var(--ira-1)" : undefined }} />
        <div id="ira-an-cuenta" style={{ display:"flex", justifyContent:"space-between", margin:"6px 0 0", fontSize:"12px", color:"var(--ira-texto-3)" }}>
          <span>{text.length} {T.chars}</span>
          <span style={{ fontFamily:"var(--ira-font-cifra)",
            color: overLimit ? "var(--ira-estrella-polarizante)" : !isAdmin && wordCount > WORD_LIMIT * 0.85 ? "var(--ira-oro)" : "var(--ira-texto-3)",
            fontWeight: overLimit ? 500 : 400,
          }}>
            {isAdmin ? `${wordCount} ${T.words}` : `${wordCount} / ${WORD_LIMIT} ${T.words}`}
          </span>
        </div>
      </div>
      {error && <p role="alert" style={{ color:"var(--ira-estrella-polarizante)", fontSize:"14px", margin:"0 0 14px" }}>{error}</p>}
      <button type="button" onClick={submit} disabled={loading || overLimit} className="ira-boton ira-boton--principal" style={{ width:"100%" }}>
        {overLimit ? T.wordLimitMsg : loading ? T.analyzing : T.calcBtn}
      </button>

      {user && (
        <div style={{ marginTop:"40px" }}>
          <h3 style={{ margin:"0 0 14px", fontSize:"20px", fontWeight:500, fontFamily:"var(--ira-font-titulo)", color:"var(--ira-nieve)" }}>
            {lang === "es" ? "Mis últimos análisis" : "My recent analyses"}
          </h3>
          {history.length === 0 ? (
            <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", textAlign:"center", padding:"24px 0" }}>
              {lang === "es" ? "Tus análisis aparecerán aquí" : "Your analyses will appear here"}
            </p>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {history.map(row => <HistoryCard key={row.id} row={row} lang={lang} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ShareCard({ result, cardRef }) {
  const { accent } = useContext(AccentContext);
  const canvasRef = useRef(null);
  const col = scoreColor(result.ira);
  useEffect(() => {
    if (canvasRef.current) drawRadar(canvasRef.current, result, accent);
  }, [result, accent]);
  return (
    <div ref={cardRef} style={{
      position:'fixed', left:'-9999px', top:0,
      width:'480px', background:'var(--ira-noche)',
      padding:'28px 32px 24px', boxSizing:'border-box',
      fontFamily:"var(--ira-font-texto)", color:"var(--ira-nieve)",
      border:'1px solid var(--ira-linea)', borderRadius:'18px',
    }}>
      {/* header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'22px' }}>
        <img src="/brand/ira-logo-sobre-oscuro.svg" alt="ira" style={{ height:'30px', width:'auto', display:'block' }} />
        <span style={{ color:"var(--ira-texto-2)", fontSize:'14px' }}>Índice de Resonancia Afectiva</span>
      </div>
      {/* score + name */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'20px', marginBottom:'14px' }}>
        <div style={{ minWidth:0 }}>
          <p style={{ margin:'0 0 4px', fontSize:'12px', color:"var(--ira-texto-2)" }}>{result.category}</p>
          <p style={{ margin:0, fontSize:'22px', fontWeight:500, color:"var(--ira-nieve)", fontFamily:"var(--ira-font-titulo)", lineHeight:1.15 }}>{result.name}</p>
        </div>
        <p style={{ margin:0, display:'flex', alignItems:'baseline', gap:'4px', fontFamily:"var(--ira-font-cifra)", fontWeight:500, letterSpacing:'-0.04em', lineHeight:1 }}>
          <span style={{ fontSize:'48px', color:col }}>{formatearPuntuacion(result.ira)}</span>
          <span style={{ fontSize:'16px', color:"var(--ira-texto-3)", letterSpacing:0 }}>/10</span>
        </p>
      </div>
      <div style={{ marginBottom:'18px' }}><BarraEscala puntuacion={result.ira} grosor={6} /></div>
      {/* radar canvas */}
      <canvas ref={canvasRef} width={416} height={200} style={{ width:'100%', display:'block' }} />
      {/* summary */}
      <p style={{ margin:'14px 0 0', fontSize:'12px', color:"var(--ira-texto-cita)", lineHeight:1.6 }}>
        {result.summary}
      </p>
      {/* footer */}
      <div style={{ marginTop:'16px', paddingTop:'12px', borderTop:'1px solid var(--ira-linea)', display:'flex', justifyContent:'space-between', fontSize:'14px', color:"var(--ira-texto-3)" }}>
        <span>0 Polarizante · Empático 10</span>
        <span>ira-index.vercel.app</span>
      </div>
    </div>
  );
}

function AnalysisResult({ result, onReset, lang }) {
  const { accent, accentA } = useContext(AccentContext);
  const [mounted, setMounted] = useState(false);
  const [copying, setCopying] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);
  const col = scoreColor(result.ira);
  const T = TEXTS[lang];
  const params = PARAMS_TRANS[lang];
  const catLabel = CAT_TRANS[lang][result.category] || result.category;

  async function handleShareImage() {
    if (sharing) return;
    setSharing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#041414', scale: 2, logging: false,
        useCORS: true, allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `ira-${result.name.replace(/\s+/g,'-').slice(0,30)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch(e) { console.error(e); }
    setSharing(false);
  }

  function handleCopyLink() {
    const encoded = encodeShareResult(result);
    if (!encoded) return;
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }
  return (
    <div style={{ maxWidth:"640px", margin:"0 auto", opacity: mounted?1:0, transition:"opacity 0.4s ease" }}>
      <div style={{ marginBottom:"28px" }}>
        <TarjetaDiscurso orador={result.name} cargo={catLabel} puntuacion={result.ira} lang={lang} pie={result.summary} />
      </div>
      {params.filter(p => result.params[p.id] != null).map((p) => (
        <FilaParametro key={p.id} etiqueta={p.label} puntuacion={+(result.params[p.id]?.score ?? 0)}
          descripcion={result.params[p.id]?.desc ?? ''} lang={lang} />
      ))}
      {/* Comparación con el corpus */}
      {result.comparacion && (
        <div style={{ marginTop:"20px", padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"10px" }}>
          <p style={{ margin:"0 0 5px", fontSize:"12px", fontWeight:700, letterSpacing:"0.14em", color:"var(--ira-texto-3)", textTransform:"uppercase" }}>
            {lang === 'en' ? "Corpus comparison" : "Comparación con el corpus"}
          </p>
          <p style={{ margin:0, fontSize:"14px", color:"var(--ira-texto-2)", lineHeight:1.6, fontStyle:"italic" }}>
            {result.comparacion}
          </p>
        </div>
      )}
      {/* Lectura del autor */}
      {result.lecturaAutor && (
        <div style={{ marginTop:"24px" }}>
          <div style={{ height:"1px", background:"rgba(255,255,255,0.07)", marginBottom:"18px" }} />
          <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginBottom:"10px" }}>
            <span style={{
              fontFamily:"var(--ira-font-texto)", fontSize:"12px", fontWeight:600,
              color: accentA(0.7), letterSpacing:"0.14em", textTransform:"uppercase",
            }}>{T.lecturaAutorLabel}</span>
            <span style={{
              fontFamily:"var(--ira-font-texto)", fontSize:"12px",
              color:"var(--ira-texto-3)", letterSpacing:"0.06em",
            }}>{T.lecturaAutorBadge}</span>
          </div>
          <p style={{
            margin:0, fontFamily:"var(--ira-font-texto)",
            fontSize:"12px", lineHeight:1.8,
            color:"var(--ira-texto-2)", fontStyle:"italic",
          }}>{result.lecturaAutor}</p>
        </div>
      )}
      {/* Share buttons */}
      <div style={{ display:"flex", gap:"10px", marginTop:"24px", flexWrap:"wrap" }}>
        <button type="button" onClick={handleShareImage} disabled={sharing} className="ira-boton ira-boton--secundario" style={{ flex:"1 1 200px" }}>
          {sharing ? T.generating : T.shareImage}
        </button>
        <button type="button" onClick={handleCopyLink} className="ira-boton ira-boton--secundario" style={{ flex:"1 1 200px" }} aria-live="polite">
          {copied ? `✓ ${T.linkCopied}` : T.copyLink}
        </button>
      </div>
      <button type="button" onClick={onReset} className="ira-boton ira-boton--principal" style={{ marginTop:"10px", width:"100%" }}>{T.analyzeAnother}</button>
      <ShareCard result={result} cardRef={cardRef} />
    </div>
  );
}

// ── Toast confirmación email ──────────────────────────────────────────────────

function ConfirmedToast({ lang, onDone }) {
  const { accent, accentA } = useContext(AccentContext);
  const [visible, setVisible] = useState(true);
  const msg = lang === "en"
    ? "Account created successfully. Welcome to IRA."
    : "Cuenta creada con éxito. Bienvenido/a al IRA.";

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 4000);
    const remove = setTimeout(onDone, 4500);
    return () => { clearTimeout(hide); clearTimeout(remove); };
  }, []);

  return (
    <div role="status" style={{
      position: "fixed", bottom: "28px", left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease",
      pointerEvents: "none",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "var(--ira-superficie)",
        border: `1px solid ${accentA(0.45)}`,
        borderRadius: "12px",
        padding: "12px 20px",
        boxShadow: `0 0 24px ${accentA(0.2)}`,
      }}>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "var(--ira-salvia)", flexShrink: 0,
        }} />
        <span style={{
          fontSize: "14px", color: "var(--ira-nieve)",
          fontFamily: "var(--ira-font-texto)",
          whiteSpace: "nowrap",
        }}>{msg}</span>
      </div>
    </div>
  );
}

// ── WelcomeModal ─────────────────────────────────────────────────────────────

function WelcomeModal({ lang, onClose }) {
  const { accentA } = useContext(AccentContext);
  const [mounted, setMounted] = useState(false);
  const ventanaRef = useRef(null);
  useAtraparFoco(true, ventanaRef, onClose);
  useEffect(() => { setTimeout(() => setMounted(true), 30); }, []);
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:600,
      background:"rgba(4,20,20,0.85)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px",
      opacity: mounted ? 1 : 0, transition:"opacity 0.35s ease",
    }}>
      <div ref={ventanaRef} role="dialog" aria-modal="true" aria-labelledby="ira-bienvenida" tabIndex={-1} style={{
        background:"var(--ira-superficie)", outline:"none",
        border:"1px solid var(--ira-linea)",
        borderRadius:"var(--ira-radio-xl)",
        padding:"36px 32px 28px",
        maxWidth:"400px", width:"100%",
        boxShadow:`0 0 60px ${accentA(0.08)}`,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition:"transform 0.35s ease",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
          <span style={{ fontSize:"13px", color:"var(--ira-oro)" }}>
            {lang === "es" ? "Bienvenido/a al IRA" : "Welcome to IRA"}
          </span>
        </div>
        <h2 id="ira-bienvenida" style={{ margin:"0 0 14px", fontSize:"30px", fontWeight:500, color:"var(--ira-nieve)", fontFamily:"var(--ira-font-titulo)", letterSpacing:"-0.02em", lineHeight:1.15 }}>
          {lang === "es" ? "Las palabras tienen peso." : "Words carry weight."}
        </h2>
        <p style={{ margin:"0 0 28px", fontSize:"16px", color:"var(--ira-texto-cita)", lineHeight:1.7 }}>
          {lang === "es"
            ? "Aquí puedes explorar cómo hablan los políticos y los medios, o pegar cualquier texto y medirlo tú mismo."
            : "Explore how politicians and media speak, or paste any text and measure it yourself."}
        </p>
        <button type="button" onClick={onClose} className="ira-boton ira-boton--principal" style={{ width:"100%" }}>
          {lang === "es" ? "Empezar a explorar →" : "Start exploring →"}
        </button>
        <p style={{ margin:"16px 0 0", fontSize:"13px", color:"var(--ira-texto-2)", textAlign:"right", fontStyle:"italic" }}>
          — Rick Grisales, creador del IRA
        </p>
      </div>
    </div>
  );
}

// ── MainView ─────────────────────────────────────────────────────────────────

// /discursos se unió a Clasificación: /discursos?figura=ID → /politicos?figura=ID
function RedirigirDiscursos() {
  const { search } = useLocation();
  return <Navigate to={`/politicos${search}`} replace />;
}

function MainView({ mode = 'politico', tab = 'explore' }) {
  const navigate = useNavigate();
  const { lang, setLang, enrichedEntities, requireAuth, openLogin, user, profile, signOut, hasDaily } = useContext(AppContext);
  const [showIRA, setShowIRA] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [searchParams] = useSearchParams();
  // Clasificación > político: sus discursos (antes página /discursos)
  const figura = mode === 'politico' && tab === 'explore' ? searchParams.get('figura') : null;

  const accent = mode === 'medios' ? '#DCB149' : '#DCB149';
  const accentA = (a) => mode === 'medios' ? `rgba(220,177,73,${a})` : `rgba(220,177,73,${a})`;

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const T = TEXTS[lang];
  const filtered = enrichedEntities.filter(e => e.category === (mode === 'medios' ? 'Medio' : 'Político'));
  const displayEntities = sortOrder === 'desc'
    ? [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : sortOrder === 'asc'
    ? [...filtered].sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    : filtered;

  return (
    <AccentContext.Provider value={{ accent, accentA, mode }}>
    <div style={{ fontFamily:"var(--ira-font-texto)", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes wcPulse { 0%,100% { opacity:1; box-shadow:0 0 8px ${accent}; } 50% { opacity:0.5; box-shadow:0 0 16px ${accent}; } }
        @keyframes aboutPulse { 0%,100% { box-shadow:0 0 18px rgba(220,60,160,0.22), inset 0 0 12px rgba(220,60,160,0.06); } 50% { box-shadow:0 0 28px rgba(220,60,160,0.38), inset 0 0 16px rgba(220,60,160,0.1); } }
      `}</style>


      <div style={{ position:"relative", zIndex:1 }}>

      {figura ? (
        <Suspense fallback={null}><DiscursosFigura figuraId={figura} /></Suspense>
      ) : (
      <div className="main-container">
        <div className="ira-cabecera" style={{ opacity:mounted?1:0, transition:"opacity 0.5s ease" }}>
          <h1 className="ira-cabecera__titulo">
            {lang==='en' ? 'Leaderboard' : 'Clasificación'}
          </h1>
          <p className="ira-cabecera__texto">
            {mode === 'medios' ? T.subtitleMedios : T.subtitle}
          </p>
          <div className="ira-cabecera__acciones">
            <button type="button" className="ira-boton ira-boton--principal" onClick={() => setShowIRA(true)}>{T.btnWhat}</button>
            <Link to="/about" className="ira-boton ira-boton--secundario">{lang === 'en' ? "Methodology" : "Metodología"}</Link>
          </div>
          <p className="ira-cabecera__extra">
            {lang === 'en' ? 'Also: ' : 'También: '}
            {hasDaily && <><Link to="/analisis-del-dia">{lang === 'en' ? 'Daily analysis' : 'Análisis del día'}</Link>{' · '}</>}
            <Link to="/patrones">{lang === 'en' ? 'Patterns' : 'Patrones'}</Link>
          </p>
        </div>

        {/* ── Casos de uso ── */}
        <div style={{ marginBottom:"40px", opacity:mounted?1:0, transition:"opacity 0.6s ease 0.25s" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"12px" }}>
            {[
              {
                role: lang==='en' ? "Journalists" : "Periodistas",
                desc: lang==='en'
                  ? "Compare two candidates on the same topic. Detect whether an editorial activates fear frames before publishing."
                  : "Compara el lenguaje de dos candidatos en el mismo tema. Detecta si un editorial activa marcos de miedo antes de publicarlo.",
              },
              {
                role: lang==='en' ? "Researchers" : "Investigadores/as",
                desc: lang==='en'
                  ? "Quantify a leader's polarizing language across their mandate. Reproducible, citable methodology."
                  : "Cuantifica la evolución del lenguaje polarizador de un líder a lo largo de su mandato. Metodología reproducible y citable.",
              },
              {
                role: lang==='en' ? "Communicators" : "Comunicadores/as",
                desc: lang==='en'
                  ? "Audit your own message before publishing. Does your communication build community or symbolic trenches?"
                  : "Audita tu propio mensaje antes de publicarlo. ¿Tu comunicación construye comunidad o trincheras simbólicas?",
              },
            ].map((c, i) => (
              <div key={i} className="ira-caso">
                <p className="ira-caso__rol">{c.role}</p>
                <p className="ira-caso__texto">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <nav className="ira-segmentos" aria-label={lang==='en' ? 'Sections' : 'Secciones'} style={{ opacity:mounted?1:0, transition:"opacity 0.5s ease 0.15s" }}>
          {[
            ["explore", T.tabExplore, mode === 'medios' ? '/medios' : '/politicos'],
            ["analyze", T.tabAnalyze, '/analyze'],
            ["compare", T.tabCompare, '/compare'],
          ].map(([id, label, path]) => (
            <Link key={id} to={path} className={'ira-segmentos__opcion' + (tab===id ? ' is-activa' : '')} aria-current={tab===id ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>

        {tab === "explore" && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px 24px', marginBottom:'20px', flexWrap:'wrap' }}>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }} role="group" aria-label={lang==='en' ? 'Category' : 'Categoría'}>
                {[
                  ['politico', lang==='en'?'Politicians':'Políticos', '/politicos'],
                  ['medios',   lang==='en'?'Media':'Medios',          '/medios'],
                ].map(([id, label, path]) => (
                  <Link key={id} to={path} className={'ira-chip' + (mode===id ? ' is-activa' : '')} aria-current={mode===id ? 'page' : undefined}>{label}</Link>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }} role="group" aria-labelledby="ira-ordenar">
                <span id="ira-ordenar" style={{ fontSize:'13px', color:"var(--ira-texto-2)" }}>
                  {lang==='en' ? 'Sort' : 'Ordenar'}
                </span>
                {[
                  ['default', lang==='en' ? 'Default' : 'Por defecto'],
                  ['desc',    lang==='en' ? 'Most empathic' : 'Más empático'],
                  ['asc',     lang==='en' ? 'Most polarizing'  : 'Más polarizante'],
                ].map(([id, label]) => (
                  <button type="button" key={id} onClick={() => setSortOrder(id)} aria-pressed={sortOrder===id} className="ira-chip">{label}</button>
                ))}
              </div>
            </div>

            <div className="entity-grid">
              {displayEntities.map((entity, i) => (
                <div key={entity.id} style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(20px)", transition:`all 0.5s ease ${0.1+i*0.06}s` }}>
                  <EntityCard entity={entity} lang={lang} />
                </div>
              ))}
            </div>

            {/* Mapa mundial + sección interactiva */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'20px', marginTop:'8px' }}>
              <WorldMap entities={displayEntities} lang={lang} accent={accent} />
            </div>

            <IndexInteractive entities={filtered} lang={lang} accent={accent} accentA={accentA} />

            <p style={{ margin:"40px 0 0", fontSize:"13px", color:"var(--ira-texto-3)", lineHeight:1.6 }}>
              {T.footerBasedOn}{" "}<em>{T.footerText}</em>{" "}{T.footerSub}
            </p>
          </>
        )}

        {tab === "analyze" && (
          <div style={{ opacity:mounted?1:0, transition:"opacity 0.4s ease 0.1s" }}>
            <div style={{ marginBottom:"28px" }}>
              <h2 style={{ fontSize:"22px", fontWeight:500, fontFamily:"var(--ira-font-titulo)", margin:"0 0 6px", color:"var(--ira-nieve)" }}>{T.howWorks}</h2>
              <p style={{ fontSize:"15px", color:"var(--ira-texto-2)", lineHeight:1.6, margin:0, maxWidth:"560px" }}>{T.howWorksDesc}</p>
            </div>
            <Analyzer lang={lang} />
          </div>
        )}

        {tab === "compare" && (
          <div style={{ opacity:mounted?1:0, transition:"opacity 0.4s ease 0.1s" }}>
            <Suspense fallback={
              <div style={{ height:"160px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:"14px", color:"var(--ira-texto-3)", fontFamily:"var(--ira-font-texto)" }}>{T.loading}</span>
              </div>
            }>
              <Comparator
                politicians={enrichedEntities.filter(e => e.category === "Político")}
                paramsEs={PARAMS_TRANS.es}
                paramShort={lang === "en" ? PARAM_SHORT_EN : PARAM_SHORT}
                lang={lang}
                T={T}
              />
            </Suspense>
          </div>
        )}
      </div>
      )}
      </div>{/* fin z-index:1 */}

      {showIRA && <IRAModal onClose={() => setShowIRA(false)} lang={lang} />}
    </div>
    </AccentContext.Provider>
  );
}

// ── Análisis del día ────────────────────────────────────────────────────────

function DailyAnalysisPage() {
  const { lang } = useContext(AppContext);
  return (
    <Suspense fallback={null}>
      <DailyAnalysis lang={lang} />
    </Suspense>
  );
}

function PatternsPageRoute() {
  const { lang } = useContext(AppContext);
  return (
    <Suspense fallback={null}>
      <PatternsPage lang={lang} />
    </Suspense>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, profile, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [authDefaultMode, setAuthDefaultMode] = useState('register');
  const [confirmedToast, setConfirmedToast] = useState(() =>
    sessionStorage.getItem('ira-email-confirmed') === '1'
      ? (sessionStorage.removeItem('ira-email-confirmed'), true)
      : false
  );
  const [showWelcome, setShowWelcome] = useState(false);
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('ira-lang');
    if (saved === 'es' || saved === 'en') return saved;
    return navigator.language?.startsWith('es') ? 'es' : 'en';
  });
  const [supabaseMap, setSupabaseMap] = useState({});
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [dailyEntityScores, setDailyEntityScores] = useState({});

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/analyses?select=speech_id,ira,params,summary,lectura_autor,lectura_autor_en`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      .then(r => r.json())
      .then(rows => {
        if (Array.isArray(rows)) {
          const map = {};
          rows.forEach(r => { if (r.speech_id) map[r.speech_id] = r; });
          setSupabaseMap(map);
        }
      })
      .catch(() => {})
      .finally(() => setSupabaseReady(true));
  }, []);

  // Fetch IRA scores de daily_analyses para actualizar el score de cada entidad en tiempo real
  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/daily_analyses?select=entity_id,ira`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then(r => r.json())
      .then(rows => {
        if (!Array.isArray(rows)) return;
        const map = {};
        rows.forEach(r => {
          if (!r.entity_id || r.ira == null) return;
          if (!map[r.entity_id]) map[r.entity_id] = [];
          map[r.entity_id].push(r.ira);
        });
        setDailyEntityScores(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user && !localStorage.getItem('ira-welcomed')) setShowWelcome(true);
  }, [user]);

  // Solo figuras con algún discurso analizado (corpus o diario): las fichas
  // "en construcción" no se muestran hasta que tengan su primer análisis.
  const enrichedEntities = ENTITIES.filter(entity =>
    getSpeechesByEntity(entity.id).length > 0 || (dailyEntityScores[entity.id]?.length ?? 0) > 0
  ).map(entity => {
    if (!supabaseReady) return { ...entity, score: null };
    const curatedIras = getSpeechesByEntity(entity.id)
      .map(s => supabaseMap[s.id]?.ira)
      .filter(v => v != null);
    const dailyIras = dailyEntityScores[entity.id] ?? [];
    const allIras = [...dailyIras, ...curatedIras];
    if (allIras.length === 0) return entity;
    const avg = Math.round((allIras.reduce((a, b) => a + b, 0) / allIras.length) * 100) / 100;
    return { ...entity, score: avg };
  });

  const requireAuth = (action) => {
    if (user) { action(); return; }
    setPendingAction(() => action);
    setAuthDefaultMode('register');
    setShowAuth(true);
  };

  const openLogin = () => {
    setAuthDefaultMode('login');
    setShowAuth(true);
  };

  const openRegister = () => {
    setAuthDefaultMode('register');
    setShowAuth(true);
  };

  return (
    <AppContext.Provider value={{ lang, setLang, supabaseMap, supabaseReady, enrichedEntities, hasDaily: Object.keys(dailyEntityScores).length > 0, requireAuth, openLogin, openRegister, user, profile, signOut }}>
      <Destellos cantidad={typeof window !== "undefined" && window.innerWidth < 600 ? 50 : 90} />
      <div className="ira-app">
      <a href="#contenido" className="ira-saltar">{lang === "en" ? "Skip to content" : "Saltar al contenido"}</a>
      <Nav />
      <main id="contenido" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<Suspense fallback={null}><Portada /></Suspense>} />
        <Route path="/discursos" element={<RedirigirDiscursos />} />
        <Route path="/pais/:slug" element={<Suspense fallback={null}><PaisPage /></Suspense>} />
        <Route path="/politicos" element={<MainView mode="politico" tab="explore" />} />
        <Route path="/medios" element={<MainView mode="medios" tab="explore" />} />
        <Route path="/analyze" element={<MainView mode="politico" tab="analyze" />} />
        <Route path="/compare" element={<MainView mode="politico" tab="compare" />} />
        <Route path="/entity/:entityId" element={<EntityDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/analisis-del-dia" element={<DailyAnalysisPage />} />
        <Route path="/patrones" element={<PatternsPageRoute />} />
        <Route path="*" element={<Navigate to="/politicos" replace />} />
      </Routes>
      </main>
      <Footer />
      </div>
      {showAuth && (
        <Suspense fallback={null}>
          <AuthModal
            lang={lang}
            defaultMode={authDefaultMode}
            onClose={() => { setShowAuth(false); setPendingAction(null); }}
            onSuccess={() => { setShowAuth(false); pendingAction?.(); setPendingAction(null); }}
          />
        </Suspense>
      )}
      {confirmedToast && <ConfirmedToast lang={lang} onDone={() => setConfirmedToast(false)} />}
      {showWelcome && (
        <WelcomeModal lang={lang} onClose={() => { localStorage.setItem('ira-welcomed','true'); setShowWelcome(false); }} />
      )}
    </AppContext.Provider>
  );

}
