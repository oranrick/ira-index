import { useState, useEffect } from "react";
import { SpeechesSection } from "./components/SpeechCard";
import { SpeechView } from "./components/SpeechView";
import { getSpeechById } from "./data/speeches";

// ── Traducciones ─────────────────────────────────────────────────────────────

const TEXTS = {
  es: {
    subtitle:        "Medición del lenguaje empático y polarizador en políticos, medios y países. Escala 0–10. Analiza cualquier texto con IA.",
    btnWhat:         "¿QUÉ ES EL IRA?",
    tabExplore:      "Explorar",
    tabAnalyze:      "Analizar texto",
    filterAll:       "Todos",
    seeAnalysis:     "Ver análisis →",
    paramsTitle:     "8 Parámetros IRA",
    empatico:        "Empático",
    polarizador:     "Polarizador",
    close:           "Cerrar",
    howWorks:        "Cómo funciona",
    howWorksDesc:    "Pega cualquier texto en español o inglés. La IA lo analizará contra los 8 parámetros del IRA y generará una puntuación y síntesis interpretativa.",
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
    subtitle:        "Measuring empathic and polarizing language in politicians, media and countries. Scale 0–10. Analyze any text with AI.",
    btnWhat:         "WHAT IS THE IRA?",
    tabExplore:      "Explore",
    tabAnalyze:      "Analyze text",
    filterAll:       "All",
    seeAnalysis:     "See analysis →",
    paramsTitle:     "8 IRA Parameters",
    empatico:        "Empathic",
    polarizador:     "Polarizing",
    close:           "Close",
    howWorks:        "How it works",
    howWorksDesc:    "Paste any text in Spanish or English. The AI will analyze it against the 8 IRA parameters and generate a score and interpretive summary.",
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
    { id: "pronominal", label: "Uso pronominal inclusivo",   desc: "Qué pronombres usa y con qué verbos los asocia." },
    { id: "metafora",   label: "Tipo de metáfora dominante", desc: "¿El imaginario central construye comunidad o enemigo?" },
    { id: "dicotomia",  label: "Carga dicotómica",           desc: "Rigidez moral: ¿divide el mundo en buenos y malos?" },
    { id: "tono",       label: "Tono emocional dominante",   desc: "¿Qué emoción instala en quien lo recibe?" },
    { id: "disenso",    label: "Reconocimiento del disenso", desc: "¿Valida la diferencia o la clausura?" },
    { id: "vector",     label: "Vector de acción",           desc: "¿Convoca a cooperar o a confrontar?" },
    { id: "coherencia", label: "Coherencia afectiva",        desc: "¿Hay distancia entre lo que dice y lo que hace?" },
    { id: "proyeccion", label: "Proyección de futuro",       desc: "¿Abre un horizonte compartido o lo clausura?" },
  ],
  en: [
    { id: "pronominal", label: "Inclusive Pronominal Use",  desc: "Which pronouns are used and which verbs they're paired with." },
    { id: "metafora",   label: "Dominant Metaphor Type",    desc: "Does the central imagery build community or enemy?" },
    { id: "dicotomia",  label: "Dichotomous Load",          desc: "Moral rigidity: does it divide the world into good and bad?" },
    { id: "tono",       label: "Dominant Emotional Tone",   desc: "What emotion does it install in the receiver?" },
    { id: "disenso",    label: "Recognition of Dissent",    desc: "Does it validate difference or shut it down?" },
    { id: "vector",     label: "Action Vector",             desc: "Does it call for cooperation or confrontation?" },
    { id: "coherencia", label: "Affective Coherence",       desc: "Is there a gap between what is said and what is done?" },
    { id: "proyeccion", label: "Future Projection",         desc: "Does it open a shared horizon or close it?" },
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
    id: "ardern", name: "Jacinda Ardern", category: "Político", country: "Nueva Zelanda", flag: "🇳🇿",
    score: 8.75,
    params: { pronominal:9.1, metafora:9.0, dicotomia:8.2, tono:9.0, disenso:8.8, vector:9.0, coherencia:8.9, proyeccion:8.0 },
    context: "Primera ministra de Nueva Zelanda (2017–2023). Analizado sobre respuesta a Christchurch (2019) y discurso ONU (2018).",
    contextEn: "Prime Minister of New Zealand (2017–2023). Analyzed on Christchurch response (2019) and UN speech (2018).",
  },
  {
    id: "sheinbaum", name: "Claudia Sheinbaum", category: "Político", country: "México", flag: "🇲🇽",
    score: 7.92,
    params: { pronominal:8.1, metafora:8.0, dicotomia:7.5, tono:8.2, disenso:7.8, vector:8.0, coherencia:7.9, proyeccion:7.8 },
    context: "Presidenta de México (2024–). Analizado sobre discurso de victoria (2024) y respuesta a aranceles Trump (2025).",
    contextEn: "President of Mexico (2024–). Analyzed on victory speech (2024) and response to Trump tariffs (2025).",
  },
  {
    id: "petro", name: "Gustavo Petro", category: "Político", country: "Colombia", flag: "🇨🇴",
    score: 5.60,
    params: { pronominal:6.8, metafora:5.2, dicotomia:4.5, tono:6.0, disenso:5.1, vector:5.8, coherencia:5.2, proyeccion:6.2 },
    context: "Presidente de Colombia (2022–). IRA promedio sobre IX Cumbre CELAC (2025) y mitin Consulta Popular (2025).",
    contextEn: "President of Colombia (2022–). Average IRA on IX CELAC Summit (2025) and Popular Consultation rally (2025).",
  },
  {
    id: "trump", name: "Donald Trump", category: "Político", country: "Estados Unidos", flag: "🇺🇸",
    score: 2.48,
    params: { pronominal:2.5, metafora:1.8, dicotomia:2.0, tono:2.1, disenso:1.5, vector:2.0, coherencia:2.8, proyeccion:3.1 },
    context: "Presidente de EEUU (2017–2021, 2024–). Analizado sobre discurso victoria 2024 y mitin 'We Will Never Concede' (2021).",
    contextEn: "US President (2017–2021, 2024–). Analyzed on 2024 victory speech and 'We Will Never Concede' rally (2021).",
  },
  {
    id: "elpais", name: "El País", category: "Medio", country: "España", flag: "🇪🇸",
    score: 6.38,
    params: { pronominal:6.5, metafora:6.2, dicotomia:6.0, tono:6.8, disenso:6.1, vector:6.4, coherencia:6.3, proyeccion:6.5 },
    context: "Medio generalista español de referencia. Registro relativamente neutro con deslizamientos editoriales.",
    contextEn: "Leading Spanish general-interest outlet. Relatively neutral register with editorial leanings.",
  },
  {
    id: "rt", name: "RT (Russia Today)", category: "Medio", country: "Rusia / Global", flag: "🌐",
    score: 1.95,
    params: { pronominal:2.0, metafora:1.5, dicotomia:1.8, tono:1.6, disenso:1.2, vector:1.8, coherencia:2.1, proyeccion:2.5 },
    context: "Canal internacional ruso. Polarización estructural como objetivo editorial. El conflicto es el producto.",
    contextEn: "Russian international channel. Structural polarization as editorial goal. Conflict is the product.",
  },
];

const PARAM_COLORS = ["#ff6600","#e8a838","#6ec6a0","#5ba8d4","#a07cd4","#e05890","#50c8b4","#c8a050"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(s) {
  if (s >= 7) return "#6ec6a0";
  if (s >= 4.5) return "#e8a838";
  return "#e05252";
}

function catColor(cat) {
  return cat === "Político" ? "#ff6600" : cat === "Medio" ? "#5ba8d4" : "#6ec6a0";
}

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

function EntityCard({ entity, onClick, lang }) {
  const [hov, setHov] = useState(false);
  const col = scoreColor(entity.score);
  const T = TEXTS[lang];
  const catLabel = CAT_TRANS[lang][entity.category] || entity.category;
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
            <FlagEmoji emoji={entity.flag} size={18} />
            <Badge label={catLabel} color={catColor(entity.category)} />
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
      {(() => {
        const total = PARAMS_TRANS.es.reduce((s,p) => s + entity.params[p.id], 0);
        return (
          <div style={{ display:"flex", width:"100%", height:"5px", gap:"2px", marginBottom:"10px" }}>
            {PARAMS_TRANS.es.map((p,i) => (
              <div key={i} style={{
                width: `${(entity.params[p.id] / total) * 100}%`, height:"100%",
                background: PARAM_COLORS[i], borderRadius:"2px",
              }} />
            ))}
          </div>
        );
      })()}
      <p style={{ margin:0, fontSize:"10px", color:"rgba(255,255,255,0.25)", letterSpacing:"0.06em" }}>{T.seeAnalysis}</p>
    </div>
  );
}

function Detail({ entity, onClose, lang }) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);
  const activeSpeech = activeSpeechId ? getSpeechById(activeSpeechId) : null;
  const col = scoreColor(entity.score);
  const T = TEXTS[lang];
  const params = PARAMS_TRANS[lang];
  const details = PARAM_DETAILS_TRANS[lang];
  const catLabel = CAT_TRANS[lang][entity.category] || entity.category;
  const context = lang === "en" && entity.contextEn ? entity.contextEn : entity.context;
  return (<>
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
              <FlagEmoji emoji={entity.flag} size={22} />
              <Badge label={catLabel} color={catColor(entity.category)} />
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
          {context}
        </p>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"20px" }}>
          <p style={{ fontSize:"9px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:"16px" }}>
            {T.paramsTitle}
          </p>
          {params.map((p, i) => {
            const val = entity.params[p.id];
            const isOpen = expanded === p.id;
            const det = details[p.id];
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
                    {entity.quotes?.[p.id] && (
                      <p style={{
                        margin:"0 0 12px", padding:"0 0 0 10px",
                        borderLeft:`2px solid ${PARAM_COLORS[i]}`,
                        fontSize:"12px", fontStyle:"italic", fontFamily:"Georgia,serif",
                        color:"rgba(255,255,255,0.65)", lineHeight:1.55,
                      }}>«{entity.quotes[p.id]}»</p>
                    )}
                    {entity.paramTexts?.[p.id] && (
                      <div style={{
                        background:`rgba(255,102,0,0.05)`,
                        border:"1px solid rgba(255,102,0,0.2)",
                        borderRadius:"8px", padding:"10px 12px", marginBottom:"12px",
                      }}>
                        <p style={{ margin:"0 0 5px", fontSize:"8px", letterSpacing:"0.14em", color:"rgba(255,102,0,0.8)", textTransform:"uppercase" }}>Análisis</p>
                        <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.55)", lineHeight:1.65 }}>{entity.paramTexts[p.id]}</p>
                      </div>
                    )}
                    <p style={{ margin:"0 0 12px", fontSize:"11px", color:"rgba(255,255,255,0.48)", lineHeight:1.65 }}>
                      {det.detail}
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                      <div style={{ background:"rgba(110,198,160,0.06)", border:"1px solid rgba(110,198,160,0.18)", borderRadius:"8px", padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 5px", fontSize:"8px", letterSpacing:"0.14em", color:"#6ec6a0", textTransform:"uppercase" }}>{T.empatico}</p>
                        <p style={{ margin:0, fontSize:"10.5px", color:"rgba(255,255,255,0.42)", lineHeight:1.55, fontStyle:"italic", fontFamily:"Georgia,serif" }}>{det.empatico}</p>
                      </div>
                      <div style={{ background:"rgba(224,82,82,0.06)", border:"1px solid rgba(224,82,82,0.18)", borderRadius:"8px", padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 5px", fontSize:"8px", letterSpacing:"0.14em", color:"#e05252", textTransform:"uppercase" }}>{T.polarizador}</p>
                        <p style={{ margin:0, fontSize:"10.5px", color:"rgba(255,255,255,0.42)", lineHeight:1.55, fontStyle:"italic", fontFamily:"Georgia,serif" }}>{det.polarizador}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <SpeechesSection entityId={entity.id} onSelectSpeech={setActiveSpeechId} />
        <button onClick={onClose} style={{
          marginTop:"20px", width:"100%", padding:"11px",
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"10px", color:"rgba(255,255,255,0.4)", fontSize:"11px",
          cursor:"pointer", letterSpacing:"0.08em",
        }}>{T.close}</button>
      </div>
    </div>
    {activeSpeech && (
      <div style={{
        position:"fixed", inset:0, zIndex:250,
        background:"#08080c", overflowY:"auto",
      }}>
        <SpeechView speech={activeSpeech} onBack={() => setActiveSpeechId(null)} lang={lang} />
      </div>
    )}
  </>
  );
}

function IRAModal({ onClose, lang }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 20); }, []);
  const T = TEXTS[lang];
  const paramsInfo = IRA_PARAMS_INFO_TRANS[lang];
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:300,
      background:"rgba(8,8,12,0.92)", backdropFilter:"blur(20px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      opacity: mounted?1:0, transition:"opacity 0.3s ease", padding:"20px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#0e0e14", border:"1px solid rgba(255,255,255,0.09)",
        borderRadius:"20px", padding:"36px 32px", maxWidth:"580px", width:"100%",
        maxHeight:"88vh", overflowY:"auto",
        transform: mounted?"translateY(0)":"translateY(20px)",
        transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ marginBottom:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
            <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#ff6600", boxShadow:"0 0 8px #ff6600" }} />
            <span style={{ fontSize:"9px", letterSpacing:"0.18em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>{T.modalTag}</span>
          </div>
          <h2 style={{ margin:"0 0 16px", fontSize:"22px", fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.03em" }}>
            {T.modalTitle}
          </h2>
          <p style={{ margin:0, fontSize:"12.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>
            {T.modalIntro}
          </p>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"22px", marginBottom:"24px" }}>
          <p style={{ margin:"0 0 10px", fontSize:"9px", letterSpacing:"0.16em", color:"#ff6600", textTransform:"uppercase" }}>{T.modalWhatTitle}</p>
          <p style={{ margin:0, fontSize:"12.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>
            {T.modalWhatPre}
            <span style={{ color:"#e05252", fontWeight:600 }}>{T.modalWhatPol}</span>
            {", "}
            <span style={{ color:"#6ec6a0", fontWeight:600 }}>{T.modalWhatEmp}</span>
            {"."}
          </p>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"22px", marginBottom:"24px" }}>
          <p style={{ margin:"0 0 16px", fontSize:"9px", letterSpacing:"0.16em", color:"#ff6600", textTransform:"uppercase" }}>{T.modalParamsTitle}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {paramsInfo.map((p, i) => (
              <div key={i} style={{ borderLeft:`2px solid ${PARAM_COLORS[i]}50`, paddingLeft:"14px" }}>
                <p style={{ margin:"0 0 4px", fontSize:"11px", fontWeight:700, color:PARAM_COLORS[i], fontFamily:"'DM Mono',monospace", letterSpacing:"0.03em" }}>{p.name}</p>
                <p style={{ margin:0, fontSize:"11.5px", color:"rgba(255,255,255,0.38)", lineHeight:1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"22px", marginBottom:"28px" }}>
          <p style={{ margin:"0 0 10px", fontSize:"9px", letterSpacing:"0.16em", color:"#ff6600", textTransform:"uppercase" }}>{T.modalOriginTitle}</p>
          <p style={{ margin:0, fontSize:"12.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>
            {T.modalOriginPre}
            <em style={{ color:"rgba(255,255,255,0.65)" }}>{T.modalOriginBook}</em>
            {T.modalOriginPost}
          </p>
        </div>

        <button onClick={onClose} style={{
          width:"100%", padding:"12px",
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"10px", color:"rgba(255,255,255,0.4)", fontSize:"11px",
          cursor:"pointer", letterSpacing:"0.08em",
        }}>{T.close}</button>
      </div>
    </div>
  );
}

const WORD_LIMIT = 800;
function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

function Analyzer({ lang }) {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Político");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const T = TEXTS[lang];
  const wordCount = countWords(text);
  const overLimit = wordCount > WORD_LIMIT;

  async function analyze() {
    if (!text.trim() || text.trim().length < 50) { setError(T.errorShort); return; }
    if (overLimit) { setError(T.errorLong); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ ...data, name: name || T.defaultName, category });
    } catch(e) {
      setError(e.message || T.errorGeneral);
    }
    setLoading(false);
  }

  if (result) return <AnalysisResult result={result} onReset={() => setResult(null)} lang={lang} />;

  return (
    <div style={{ maxWidth:"640px", margin:"0 auto" }}>
      <div style={{ marginBottom:"20px" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:"6px" }}>
          {T.nameLabel}
        </p>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder={T.namePlaceholder}
          style={{
            width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"10px", padding:"10px 14px", color:"#fff", fontSize:"13px",
            outline:"none", boxSizing:"border-box", fontFamily:"'DM Mono',monospace",
          }} />
      </div>
      <div style={{ marginBottom:"20px" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:"6px" }}>
          {T.catLabel}
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
            }}>{CAT_TRANS[lang][cat]}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:"20px" }}>
        <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:"6px" }}>
          {T.textLabel}
        </p>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={T.textPlaceholder}
          rows={8}
          style={{
            width:"100%", background:"rgba(255,255,255,0.04)",
            border:`1px solid ${overLimit ? "rgba(224,82,82,0.5)" : "rgba(255,255,255,0.08)"}`,
            borderRadius:"12px", padding:"14px", color:"rgba(255,255,255,0.8)", fontSize:"13px",
            outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6,
            fontFamily:"'DM Mono',monospace",
          }} />
        <div style={{ display:"flex", justifyContent:"space-between", margin:"6px 0 0" }}>
          <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.15)" }}>
            {text.length} {T.chars}
          </span>
          <span style={{ fontSize:"10px", fontFamily:"'DM Mono',monospace",
            color: overLimit ? "#e05252" : wordCount > WORD_LIMIT * 0.85 ? "#e8a838" : "rgba(255,255,255,0.2)",
            fontWeight: overLimit ? 700 : 400,
          }}>
            {wordCount} / {WORD_LIMIT} {T.words}
          </span>
        </div>
      </div>
      {error && <p style={{ color:"#e05252", fontSize:"11px", marginBottom:"14px" }}>{error}</p>}
      <button onClick={analyze} disabled={loading || overLimit} style={{
        width:"100%", padding:"14px",
        background: overLimit ? "rgba(255,255,255,0.03)" : loading ? "rgba(255,102,0,0.1)" : "rgba(255,102,0,0.2)",
        border: overLimit ? "1px solid rgba(224,82,82,0.3)" : "1px solid rgba(255,102,0,0.4)",
        borderRadius:"12px",
        color: overLimit ? "#e05252" : loading ? "rgba(255,102,0,0.4)" : "#ff6600",
        fontSize:"12px", letterSpacing:"0.12em", textTransform:"uppercase",
        cursor: loading || overLimit ? "not-allowed" : "pointer", transition:"all 0.2s ease",
        fontFamily:"'DM Mono',monospace",
      }}>
        {overLimit ? T.wordLimitMsg : loading ? T.analyzing : T.calcBtn}
      </button>
    </div>
  );
}

function AnalysisResult({ result, onReset, lang }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);
  const col = scoreColor(result.ira);
  const T = TEXTS[lang];
  const params = PARAMS_TRANS[lang];
  const catLabel = CAT_TRANS[lang][result.category] || result.category;
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
          <Badge label={catLabel} color={catColor(result.category)} />
          <h3 style={{ margin:"6px 0 4px", fontSize:"20px", fontWeight:700, color:"#fff", fontFamily:"'Syne',sans-serif" }}>
            {result.name}
          </h3>
          <p style={{ margin:0, fontSize:"11.5px", color:"rgba(255,255,255,0.4)", lineHeight:1.55 }}>
            {result.summary}
          </p>
        </div>
      </div>
      {params.map((p, i) => {
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
      }}>{T.analyzeAnother}</button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("explore");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [showIRA, setShowIRA] = useState(false);
  const [lang, setLang] = useState("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const T = TEXTS[lang];
  const cats = ["Todos", "Político", "Medio"];
  const filtered = filter === "Todos" ? ENTITIES : ENTITIES.filter(e => e.category === filter);

  return (
    <div style={{ minHeight:"100vh", background:"#08080c", fontFamily:"'DM Mono',monospace", position:"relative", overflow:"hidden" }}>
      <div style={{
        position:"fixed", top:"-15%", left:"50%", transform:"translateX(-50%)",
        width:"700px", height:"500px",
        background:"radial-gradient(ellipse, rgba(255,102,0,0.06) 0%, transparent 70%)",
        pointerEvents:"none",
      }} />

      {/* Botón EN/ES */}
      <div style={{ position:"fixed", top:"20px", right:"24px", zIndex:400 }}>
        <button
          onClick={() => setLang(l => l === "es" ? "en" : "es")}
          style={{
            display:"flex", alignItems:"center", gap:"5px",
            padding:"7px 14px", borderRadius:"20px",
            background:"rgba(255,102,0,0.08)",
            border:"1px solid rgba(255,102,0,0.35)",
            color:"#ff6600", fontSize:"10px",
            letterSpacing:"0.18em", cursor:"pointer",
            fontFamily:"'DM Mono',monospace",
            fontWeight:700,
            transition:"all 0.2s ease",
            boxShadow:"0 0 12px rgba(255,102,0,0.12)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background="rgba(255,102,0,0.18)";
            e.currentTarget.style.borderColor="rgba(255,102,0,0.7)";
            e.currentTarget.style.boxShadow="0 0 20px rgba(255,102,0,0.3)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background="rgba(255,102,0,0.08)";
            e.currentTarget.style.borderColor="rgba(255,102,0,0.35)";
            e.currentTarget.style.boxShadow="0 0 12px rgba(255,102,0,0.12)";
          }}
        >
          <span style={{ opacity:0.45, fontSize:"9px" }}>{lang === "es" ? "ES" : "EN"}</span>
          <span style={{ color:"rgba(255,102,0,0.3)" }}>·</span>
          <span>{lang === "es" ? "EN" : "ES"}</span>
        </button>
      </div>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"48px 24px 80px" }}>
        <div style={{ marginBottom:"44px", opacity: mounted?1:0, transform: mounted?"none":"translateY(16px)", transition:"all 0.6s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#ff6600", boxShadow:"0 0 10px #ff6600" }} />
            <span style={{ fontSize:"9px", letterSpacing:"0.18em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>
              {T.headerTag}
            </span>
          </div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(28px,5vw,46px)", fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#fff", letterSpacing:"-0.04em", lineHeight:1.05 }}>
            IRA <span style={{ color:"rgba(255,255,255,0.12)", fontWeight:400 }}>/</span>{" "}
            <span style={{ color:"#ff6600" }}>Resonancia</span>
          </h1>
          <p style={{ margin:"0 0 20px", fontSize:"12px", color:"rgba(255,255,255,0.3)", lineHeight:1.65, maxWidth:"500px" }}>
            {T.subtitle}
          </p>
          <button onClick={() => setShowIRA(true)} style={{
            padding:"13px 28px", borderRadius:"12px",
            background:"#ff6600", border:"none",
            color:"#000", fontSize:"13px", fontWeight:700,
            letterSpacing:"0.04em", cursor:"pointer",
            fontFamily:"'DM Mono',monospace",
            boxShadow:"0 0 24px rgba(255,102,0,0.35)",
            transition:"all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background="#ff8533"; e.currentTarget.style.boxShadow="0 0 32px rgba(255,102,0,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#ff6600"; e.currentTarget.style.boxShadow="0 0 24px rgba(255,102,0,0.35)"; }}
          >{T.btnWhat}</button>
        </div>

        <div style={{ display:"flex", gap:"4px", marginBottom:"32px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", padding:"4px", width:"fit-content", opacity: mounted?1:0, transition:"opacity 0.5s ease 0.15s" }}>
          {[["explore", T.tabExplore],["analyze", T.tabAnalyze]].map(([id,label]) => (
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
                }}>{CAT_TRANS[lang][cat]}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"14px" }}>
              {filtered.map((entity, i) => (
                <div key={entity.id} style={{ opacity: mounted?1:0, transform: mounted?"none":"translateY(20px)", transition:`all 0.5s ease ${0.1+i*0.06}s` }}>
                  <EntityCard entity={entity} onClick={setSelected} lang={lang} />
                </div>
              ))}
            </div>
            <div style={{ marginTop:"40px", padding:"20px", background:"rgba(255,255,255,0.02)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ margin:0, fontSize:"10px", color:"rgba(255,255,255,0.18)", lineHeight:1.7, letterSpacing:"0.04em" }}>
                {T.footerBasedOn}{" "}
                <em style={{ color:"rgba(255,255,255,0.3)" }}>{T.footerText}</em>{" "}
                {T.footerSub}
              </p>
            </div>
          </>
        )}

        {tab === "analyze" && (
          <div style={{ opacity: mounted?1:0, transition:"opacity 0.4s ease 0.1s" }}>
            <div style={{ marginBottom:"28px" }}>
              <p style={{ fontSize:"10px", letterSpacing:"0.14em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:"6px" }}>{T.howWorks}</p>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", lineHeight:1.65, margin:0, maxWidth:"520px" }}>
                {T.howWorksDesc}
              </p>
            </div>
            <Analyzer lang={lang} />
          </div>
        )}
      </div>
      {selected && <Detail entity={selected} onClose={() => setSelected(null)} lang={lang} />}
      {showIRA && <IRAModal onClose={() => setShowIRA(false)} lang={lang} />}
    </div>
  );
}
