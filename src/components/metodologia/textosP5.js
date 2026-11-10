// IRA · Metodología 2.0 · textos de /metodologia/p5. Fuente: research/manual/P5.md (v0.1, cerrado el 10-nov-2026).
// Bloques es y en con la misma estructura. En inglés, los ejemplos van como «original» (“traducción”).
import { UI_MANUAL } from './textosComunes.js';

const SIGNOS = { V: 'empatica', B: 'neutra', Z: 'polariza' };

const REFERENCIAS = [
  'Aikin, S. F., y Casey, J. (2011). Straw men, weak men, and hollow men. Argumentation, 25(1), 87-105.',
  'Coe, K., Kenski, K., y Rains, S. A. (2014). Online and uncivil? Journal of Communication, 64(4), 658-679.',
  'Fuoli, M. (2018). A stepwise method for annotating APPRAISAL. Functions of Language, 25(2), 229-258.',
  'Gallucci, M. J. (2024). Polifonía y oralidad: el discurso referido en la entrevista sociolingüística en español. Editorial Universidad de Sevilla.',
  'Martin, J. R., y White, P. R. R. (2005). The language of evaluation: Appraisal in English, cap. 3. Palgrave Macmillan.',
  'Piñero Piñero, M. G. (2019). Algunos evidenciales del metadiscurso parlamentario español: la recontextualización de la voz del adversario. L’Harmattan. [por verificar obra colectiva y páginas]',
  'Reyes, G. (1993). Los procedimientos de cita: estilo directo y estilo indirecto. [por verificar editorial]',
  'Steenbergen, M. R., Bächtiger, A., Spörndli, M., y Steiner, J. (2003). Measuring political deliberation: A discourse quality index. Comparative European Politics, 1(1), 21-48.',
  'Steiner, J., Bächtiger, A., Spörndli, M., y Steenbergen, M. R. (2005). Deliberative politics in action. Cambridge University Press.',
  'van Eemeren, F. H., y Garssen, B. (2023). The pragma-dialectical approach to the fallacies revisited. Argumentation, 37(2), 167-180.',
  'van Eemeren, F. H., y Grootendorst, R. (2004). A systematic theory of argumentation: The pragma-dialectical approach. Cambridge University Press.',
];

export const TEXTOS_P5 = {
  es: {
    ui: UI_MANUAL.es,
    signos: SIGNOS,
    codigo: 'P5',
    rotulo: 'Metodología 2.0 · P5',
    estado: 'Manual v0.1 · cerrado el 10 de noviembre de 2026',
    titulo: 'La palabra del otro',
    frase: 'Qué hace el discurso con lo que dice quien piensa distinto: lo escucha, lo responde o lo anula.',

    secciones: [
      { id: 'la-idea', titulo: 'La idea' },
      { id: 'que-mide', titulo: 'Qué mide y por qué' },
      { id: 'que-no-mide', titulo: 'Qué no mide' },
      { id: 'procedimiento', titulo: 'Cómo se codifica' },
      { id: 'unidad', titulo: 'La unidad' },
      { id: 'prueba', titulo: 'Qué se ataca' },
      { id: 'codigos', titulo: 'Los códigos' },
      { id: 'formula', titulo: 'Fórmula y mínimos' },
      { id: 'ficha', titulo: 'La ficha' },
      { id: 'casos', titulo: 'Casos resueltos' },
      { id: 'limites', titulo: 'Límites' },
      { id: 'validacion', titulo: 'Validación' },
      { id: 'pendiente', titulo: 'Pendiente' },
      { id: 'cambios', titulo: 'Registro de decisiones' },
      { id: 'referencias', titulo: 'Referencias' },
    ],

    idea: {
      lema: ['Discrepar no polariza.', 'Polariza impedir que el otro tenga algo que decir.'],
      texto: 'P5 se fija en los momentos en que el discurso trae la voz de quien piensa distinto, y en lo que hace con ella.',
      tres: [
        { codigo: 'Z', nombre: 'Anular', texto: 'Deslegitimar la crítica, ridiculizarla o negar la palabra. Polariza.' },
        { codigo: 'B', nombre: 'Rebatir', texto: 'Citar lo que dice el otro y responder o negarlo. Es neutro.' },
        { codigo: 'V', nombre: 'Valorar', texto: 'Validar el desacuerdo, conceder un punto, dar la razón de ser de la posición contraria. Es empático.' },
      ],
    },

    teoria: {
      items: [
        ['Compromiso (Martin y White, 2005)', 'Un enunciado puede reconocer otras voces o ignorarlas. La negación («no es verdad que...») invoca la posición contraria al rechazarla: es dialógica. Por eso negar es rebatir y no anular. Las atribuciones («dicen que», «según») y las concesivas son las marcas de entrada de P5.'],
        ['Respeto a los contraargumentos (Steenbergen et al., 2003)', 'El Discourse Quality Index distingue entre ignorarlos, reconocerlos pero degradarlos, reconocerlos de forma neutra y valorarlos. Son los niveles de P5: sin evento, Z, B y V. Sus autores hallaron además que justificar bien no implica respetar al otro (Steiner et al., 2005): la calidad argumentativa es otra dimensión y queda fuera de P5.'],
        ['Regla de libertad (van Eemeren y Grootendorst, 2004)', 'Las partes no deben impedirse avanzar puntos de vista ni ponerlos en duda. El ad hominem y negarse a discutir son sus violaciones típicas. Una falacia es un movimiento que obstruye la resolución de una diferencia por sus méritos (van Eemeren y Garssen, 2023): es lo que P5 llama anular.'],
      ],
    },

    noMide: {
      filas: [
        ['Pedir que el otro calle', '«que se callen»', 'P6'],
        ['Juicio sobre la persona', '«mienten», «es un mentiroso»', 'P3'],
        ['Reconocer a la persona', '«es una persona honrada»', 'P3'],
        ['Legitimar a la persona como adversario', '«respeto a quien defiende otra opción»', 'P1'],
        ['Tratar lo dicho como ruido, en imagen', '«solo hacen ruido»', 'P2'],
        ['Nombrar lo que siente el otro', '«entiendo que tengáis miedo»', 'P4'],
        ['Citar a los propios', '«como dijo nuestro compañero»', 'No es voz ajena'],
        ['Posicionamiento sin voz ajena', '«como todos sabemos», «la verdad es que»', 'Sin evento'],
        ['La calidad de los argumentos propios', '', 'Candidata a P8'],
        ['Si el argumento del otro está bien representado', '', 'Ver límites'],
      ],
      reglas: [
        'Marca única, oración múltiple. Orden de prioridad: P2, P6, P5, P1, P4, P3. Solo se aplica cuando el manual no ha resuelto ya el caso.',
      ],
    },

    procedimiento: {
      pasos: [
        ['Extracción por código', ['Verbos de decir y pensar con sujeto ajeno («dicen», «afirman», «sostienen», «creen», «nos acusan de»).', 'Introductores («según», «para ellos»).', 'Concesivas («es verdad que», «tienen razón en», «reconozco que»).', 'Negaciones de un contenido atribuible («no es verdad que», «es falso que»).', 'Normas sobre el desacuerdo («discrepar es legítimo», «quien nos critica...», «con esa gente no se habla»).']],
        ['Revisión humana', 'El codificador añade a mano las citas sin marca: el condicional de rumor y el estilo indirecto libre.'],
        ['Clasificación en tres pasos', ['¿Hay una voz ajena, de quien piensa distinto, o una norma sobre el desacuerdo?', '¿Qué se hace con ella? Valorar, rebatir o anular.', 'Subtipo. Es descriptivo.']],
        ['Cálculo por código', 'La IA o el codificador clasifican; la nota la pone la fórmula.'],
      ],
    },

    unidad: {
      definicion: 'El evento de voz ajena = oración + referencia a lo que otro dice, piensa o critica + lo que el discurso hace con ello.',
      reglas: [
        'Si la cita va en una oración y la respuesta en la contigua, es un solo evento.',
        'Solo cuenta la voz de quien piensa distinto.',
        'Las repeticiones en oraciones distintas cuentan cada vez.',
        'Ironía: solo si la intención es clara por el contexto.',
      ],
    },

    prueba: {
      intro: 'La línea entre rebatir y anular depende de qué se ataca. Rebatir no exige dar una razón: exigirla obligaría a juzgar qué cuenta como razón.',
      tabla: {
        codigos: true,
        cabecera: ['Qué se ataca', 'Ejemplos', 'Código'],
        filas: [
          ['El contenido: se niega que sea cierto', '«eso es falso», «no es verdad», «es un bulo»', 'B'],
          ['El sentido: se niega que diga algo', '«chorradas», «tonterías», «ocurrencias», «cuentos»', 'Z2'],
          ['El motivo de quien habla', '«es propaganda», «lo dicen porque les pagan»', 'Z1'],
          ['La persona', '«mienten»', 'P3'],
        ],
      },
    },

    codigos: {
      cabecera: ['Código', 'Qué es', 'Ejemplo', 'Signo'],
      filas: [
        ['V1', 'Validar el desacuerdo o la opinión contraria', '«discrepar es legítimo», «podemos pensar distinto»', 'Empático'],
        ['V2', 'Conceder un punto concreto atribuido al otro', '«en lo de la vivienda tienen razón»', 'Empático'],
        ['V3', 'Dar la razón de ser de la posición contraria antes de responder', '«entiendo que les preocupa el coste; mi respuesta es...»', 'Empático'],
        ['B', 'Rebatir: citar al otro y responder o negar', '«dicen que sube el paro; los datos dicen lo contrario»', 'Neutro, vale 5'],
        ['Z1', 'Deslegitimar la crítica por quién la hace o por qué', '«los que nos critican son parte del problema», «lo dicen porque les pagan»', 'Polariza'],
        ['Z2', 'Ridiculizar lo dicho sin responder', '«no diga chorradas», «eso son ocurrencias»', 'Polariza'],
        ['Z3', 'Negar la palabra o negarse a discutir', '«con esa gente no se habla», «no merecen respuesta»', 'Polariza'],
      ],
      nota: 'Todos los Z valen 1. Todos los V valen 1.',
      reglasTitulo: 'Reglas',
      reglas: [
        ['La concesión de fórmula no es V2', '«Es verdad que hay problemas, pero...» no concede nada al otro. V2 exige un punto concreto atribuido al otro. Es la misma lógica que la cortesía de fórmula en P3.'],
        ['El «y tú más»', 'Si sustituye a la respuesta («ustedes no son quiénes para hablar de corrupción»), es Z1. Si acompaña a una respuesta al contenido, la respuesta es B.'],
        ['Z1 no es atacar a la persona', 'Eso es P3. Z1 es usar a la persona para no responder a lo que dijo. Exige una crítica o un dicho al que se alude.'],
        ['Excepción democrática para Z3', 'Negarse a debatir con quien justifica la violencia («no debatiré con quien no condena el terrorismo») es neutro si cumple las tres condiciones de P1. Se lista en la ficha.'],
      ],
    },

    formula: {
      linea: 'P5 = 10 × (V + 0,5·B + 1) / (V + B + Z + 2)',
      leyenda: [['V', 'valoraciones', 'empatica'], ['B', 'réplicas (valen 5)', 'neutra'], ['Z', 'anulaciones', 'polariza']],
      explicacion: 'La misma lógica que P3 y P6: rebatir es la alternativa a anular, y entra con el valor neutro, 5. El discurso que no trae nunca la voz del otro no se puntúa: solo se puede ignorar lo que está presente.',
      tabla: {
        cabecera: ['Discurso', 'Z', 'B', 'V', 'P5'],
        filas: [
          ['Anula', '4', '2', '0', '2,50'],
          ['Rebate, con un «chorradas»', '1', '10', '0', '4,62'],
          ['Solo rebate', '0', '6', '0', '5,00'],
          ['Rebate y concede', '0', '4', '3', '6,67'],
        ],
      },
      minimos: {
        titulo: 'Mínimos y solidez',
        filas: [['Menos de 5 eventos', 'No se puntúa'], ['De 5 a 9', 'Orientativa'], ['10 o más', 'Sólida']],
        nota: 'Se cuentan los eventos de voz ajena: V + B + Z. Umbrales provisionales.',
      },
    },

    ficha: {
      intro: 'Cada análisis publica:',
      items: [
        'Los recuentos de V, B y Z por subtipo, el cálculo, la nota y la solidez.',
        'La lista completa de eventos Z, siempre, con la cita literal.',
        'La lista de eventos V.',
        'La densidad de voz ajena por mil palabras y la proporción de enunciados monoglósicos, como datos descriptivos.',
        'Las atribuciones a fuentes no identificables («hay quien dice que...»), sin signo. Es la forma observable del «hombre hueco» (Aikin y Casey, 2011).',
        'La densidad de preguntas retóricas, sin signo.',
        'Las excepciones democráticas aplicadas, el porcentaje de oraciones compartidas y el género del discurso.',
      ],
    },

    casos: {
      cabecera: ['Caso', 'Resolución', 'Por qué'],
      filas: [
        ['«Discrepar es legítimo»', 'V1', 'Legitima el desacuerdo', 'empatica'],
        ['«Respeto a quien defiende otra opción»', 'P1', 'Legitima a la persona', 'otro'],
        ['«En eso tienen razón»', 'V2', 'Acierto del otro. «Es una persona honrada» es P3', 'empatica'],
        ['«Es verdad que hay problemas, pero...»', 'Sin evento', 'Concesión de fórmula', 'otro'],
        ['«Eso es falso», «es un bulo»', 'B', 'Niega el contenido', 'neutra'],
        ['«No diga chorradas»', 'Z2', 'Niega el sentido', 'polariza'],
        ['«Es propaganda»', 'Z1', 'Ataca el motivo', 'polariza'],
        ['«Mienten»', 'P3', 'Juzga a la persona', 'otro'],
        ['«Ustedes no son quiénes para hablar de corrupción»', 'Z1', '«Y tú más» que sustituye a la respuesta', 'polariza'],
        ['«Los que nos critican son parte del problema»', 'Z1', 'La crítica como culpa', 'polariza'],
        ['«Con esa gente no se habla»', 'Z3', 'Norma que niega la palabra. «Que se callen» es P6', 'polariza'],
        ['«No debatiré con quien no condena el terrorismo»', 'Neutro', 'Excepción democrática', 'neutra'],
        ['«Hay quien dice que queremos subir impuestos; es falso»', 'B', 'Y la fuente no identificable va a la ficha', 'neutra'],
      ],
      desacuerdoTitulo: 'Dónde se espera más desacuerdo',
      desacuerdo: [
        'Concesión real o de fórmula.',
        'Si el «y tú más» sustituye o acompaña a la respuesta.',
        'La cita sin marca.',
      ],
    },

    limites: [
      ['El hombre de paja no se puede codificar', 'Saber si el argumento del otro está deformado exige saber qué dijo de verdad, y eso está fuera del texto. Tampoco se ve si se elige su argumento más flojo.'],
      ['Fiabilidad', 'La anotación de Valoración rara vez reporta acuerdo entre codificadores (Fuoli, 2018). P5 usa solo sus rasgos más formales: atribución, negación y concesión.'],
      ['Adaptación del DQI', 'El DQI codifica la intervención entera de un parlamentario. P5 lo adapta al evento por oración.'],
      ['Sin puntuar a menudo', 'En un mitin hay poca voz ajena.'],
      ['Dilución', 'Muchas réplicas diluyen una anulación. La ficha lista siempre cada Z.'],
      ['Límite temporal (campaña del 29-N)', 'Hasta P1 v1.2, el reconocimiento de un acierto sigue en P1. P5 no se publica en campaña, así que no hay doble recuento.'],
      ['Género y lengua', 'El género se anota, sin ajuste. Solo español original.'],
    ],

    validacion: {
      cabecera: ['Prueba', 'Cómo'],
      filas: [
        ['Discursos de prueba', 'Recodificar Barcelona 2026 y ONU 2024, con la prueba de dilución (nota con y sin B).'],
        ['Fiabilidad', '¿Hay evento?, tipo (V, B, Z) y subtipo. Objetivo α ≥ 0,80 en los dos primeros.'],
        ['Género', 'Probar en una sesión de control o un debate, donde sí hay voz ajena.'],
        ['Independencia', 'Correlación con P3 dentro de un mismo orador. Es el par con más riesgo de solaparse.'],
      ],
    },

    pendiente: [
      ['Umbrales', 'Los mínimos de 5 y 10 eventos son provisionales hasta calibrar con el corpus.'],
    ],

    cambios: {
      titulo: 'Manual v0.1 · 9 y 10 de noviembre de 2026',
      decisiones: [
        'P5 es el trato a la palabra del otro. Recibirá de P1 (v1.2) el reconocimiento de un acierto.',
        'Rebatir es neutro y entra con valor 5.',
        'Línea por lo que se ataca: contenido, B; sentido, Z2; motivo, Z1; persona, P3. «Propaganda» es Z1.',
        'El discurso sin voz ajena no se puntúa. La ficha da la densidad de voz ajena y la proporción monoglósica.',
        'El hombre de paja es un límite. La ficha registra las fuentes no identificables.',
        'La concesión de fórmula no es V2.',
        '«Y tú más»: Z1 si sustituye a la respuesta; B si la acompaña.',
        'Excepción democrática para Z3, con las tres condiciones de P1.',
        'Legitimar a la persona es P1; legitimar el desacuerdo es P5 (V1).',
        'La calidad argumentativa queda fuera de P5, candidata a P8.',
      ],
    },

    referencias: REFERENCIAS,
  },

  en: {
    ui: UI_MANUAL.en,
    signos: SIGNOS,
    codigo: 'P5',
    rotulo: 'Methodology 2.0 · P5',
    estado: 'Manual v0.1 · closed on 10 November 2026',
    titulo: 'The other’s word',
    frase: 'What the speech does with what people who think differently say: it listens, it answers or it cancels.',

    secciones: [
      { id: 'la-idea', titulo: 'The idea' },
      { id: 'que-mide', titulo: 'What it measures and why' },
      { id: 'que-no-mide', titulo: 'What it does not measure' },
      { id: 'procedimiento', titulo: 'How it is coded' },
      { id: 'unidad', titulo: 'The unit' },
      { id: 'prueba', titulo: 'What is attacked' },
      { id: 'codigos', titulo: 'The codes' },
      { id: 'formula', titulo: 'Formula and minimums' },
      { id: 'ficha', titulo: 'The scorecard' },
      { id: 'casos', titulo: 'Resolved cases' },
      { id: 'limites', titulo: 'Limits' },
      { id: 'validacion', titulo: 'Validation' },
      { id: 'pendiente', titulo: 'Pending' },
      { id: 'cambios', titulo: 'Decision log' },
      { id: 'referencias', titulo: 'References' },
    ],

    idea: {
      lema: ['Disagreeing does not polarize.', 'Leaving the other nothing to say does.'],
      texto: 'P5 looks at the moments when the speech brings in the voice of someone who thinks differently, and at what it does with it.',
      tres: [
        { codigo: 'Z', nombre: 'Cancel', texto: 'Delegitimizing the criticism, ridiculing it or denying the floor. Polarizing.' },
        { codigo: 'B', nombre: 'Rebut', texto: 'Quoting what the other says and answering or denying it. Neutral.' },
        { codigo: 'V', nombre: 'Value', texto: 'Validating disagreement, conceding a point, stating the reason behind the opposing view. Empathetic.' },
      ],
    },

    teoria: {
      items: [
        ['Engagement (Martin and White, 2005)', 'An utterance can acknowledge other voices or ignore them. Negation («no es verdad que...», “it is not true that...”) invokes the opposing position by rejecting it: it is dialogic. That is why denying is rebutting, not cancelling. Attributions («dicen que», “they say that”; «según», “according to”) and concessives are P5’s entry marks.'],
        ['Respect for counterarguments (Steenbergen et al., 2003)', 'The Discourse Quality Index distinguishes between ignoring them, acknowledging but degrading them, acknowledging them neutrally and valuing them. These are P5’s levels: no event, Z, B and V. Its authors also found that justifying well does not imply respecting the other (Steiner et al., 2005): argument quality is a separate dimension and lies outside P5.'],
        ['The freedom rule (van Eemeren and Grootendorst, 2004)', 'Parties must not prevent each other from advancing standpoints or casting doubt on them. Ad hominem and refusing to discuss are its typical violations. A fallacy is a move that obstructs resolving a difference on its merits (van Eemeren and Garssen, 2023): that is what P5 calls cancelling.'],
      ],
    },

    noMide: {
      filas: [
        ['Asking the other to be silent', '«que se callen» (“let them shut up”)', 'P6'],
        ['Judgement about the person', '«mienten» (“they lie”), «es un mentiroso» (“he is a liar”)', 'P3'],
        ['Recognizing the person', '«es una persona honrada» (“she is an honest person”)', 'P3'],
        ['Legitimizing the person as an adversary', '«respeto a quien defiende otra opción» (“I respect those who support another option”)', 'P1'],
        ['Treating what was said as noise, through an image', '«solo hacen ruido» (“they just make noise”)', 'P2'],
        ['Naming what the other feels', '«entiendo que tengáis miedo» (“I understand you are afraid”)', 'P4'],
        ['Quoting one’s own side', '«como dijo nuestro compañero» (“as our colleague said”)', 'Not another’s voice'],
        ['Stance with no other voice', '«como todos sabemos» (“as we all know”), «la verdad es que» (“the truth is”)', 'No event'],
        ['The quality of one’s own arguments', '', 'Candidate for P8'],
        ['Whether the other’s argument is fairly represented', '', 'See limits'],
      ],
      reglas: [
        'Single mark, multiple sentence. Priority order: P2, P6, P5, P1, P4, P3. It only applies when the manual has not already resolved the case.',
      ],
    },

    procedimiento: {
      pasos: [
        ['Extraction by code', ['Verbs of saying and thinking with someone else as subject («dicen», «afirman», «sostienen», «creen», «nos acusan de»: “they say”, “claim”, “maintain”, “believe”, “accuse us of”).', 'Introducers («según», “according to”; «para ellos», “for them”).', 'Concessives («es verdad que», “it is true that”; «tienen razón en», “they are right about”; «reconozco que», “I admit that”).', 'Negations of attributable content («no es verdad que», «es falso que»: “it is not true / it is false that”).', 'Norms about disagreement («discrepar es legítimo», “disagreeing is legitimate”; «quien nos critica...», “whoever criticizes us...”; «con esa gente no se habla», “you do not talk to those people”).']],
        ['Human review', 'The coder adds unmarked quotations by hand: the reportative conditional and free indirect speech.'],
        ['Classification in three steps', ['Is there another voice, from someone who thinks differently, or a norm about disagreement?', 'What is done with it? Value, rebut or cancel.', 'Subtype. Descriptive only.']],
        ['Calculation by code', 'AI or the coder classifies; the formula sets the score.'],
      ],
    },

    unidad: {
      definicion: 'The other-voice event = sentence + reference to what someone else says, thinks or criticizes + what the speech does with it.',
      reglas: [
        'If the quote is in one sentence and the answer in the next, it is a single event.',
        'Only the voice of someone who thinks differently counts.',
        'Repetitions in different sentences count every time.',
        'Irony: only when the intention is clear from context.',
      ],
    },

    prueba: {
      intro: 'The line between rebutting and cancelling depends on what is attacked. Rebutting does not require giving a reason: requiring one would mean judging what counts as a reason.',
      tabla: {
        codigos: true,
        cabecera: ['What is attacked', 'Examples', 'Code'],
        filas: [
          ['The content: it is denied that it is true', '«eso es falso» (“that is false”), «no es verdad» (“it is not true”), «es un bulo» (“it is a hoax”)', 'B'],
          ['The meaning: it is denied that it says anything', '«chorradas», «tonterías», «ocurrencias», «cuentos» (“rubbish”, “nonsense”, “wild ideas”, “fairy tales”)', 'Z2'],
          ['The speaker’s motive', '«es propaganda» (“it is propaganda”), «lo dicen porque les pagan» (“they say it because they are paid to”)', 'Z1'],
          ['The person', '«mienten» (“they lie”)', 'P3'],
        ],
      },
    },

    codigos: {
      cabecera: ['Code', 'What it is', 'Example', 'Sign'],
      filas: [
        ['V1', 'Validating disagreement or the opposing opinion', '«discrepar es legítimo» (“disagreeing is legitimate”), «podemos pensar distinto» (“we can think differently”)', 'Empathetic'],
        ['V2', 'Conceding a specific point attributed to the other', '«en lo de la vivienda tienen razón» (“on housing, they are right”)', 'Empathetic'],
        ['V3', 'Stating the reason behind the opposing view before answering', '«entiendo que les preocupa el coste; mi respuesta es...» (“I understand you are worried about the cost; my answer is...”)', 'Empathetic'],
        ['B', 'Rebutting: quoting the other and answering or denying', '«dicen que sube el paro; los datos dicen lo contrario» (“they say unemployment is rising; the data say the opposite”)', 'Neutral, worth 5'],
        ['Z1', 'Delegitimizing the criticism because of who makes it or why', '«los que nos critican son parte del problema» (“those who criticize us are part of the problem”), «lo dicen porque les pagan» (“they say it because they are paid to”)', 'Polarizing'],
        ['Z2', 'Ridiculing what was said without answering', '«no diga chorradas» (“stop talking rubbish”), «eso son ocurrencias» (“those are just wild ideas”)', 'Polarizing'],
        ['Z3', 'Denying the floor or refusing to discuss', '«con esa gente no se habla» (“you do not talk to those people”), «no merecen respuesta» (“they do not deserve an answer”)', 'Polarizing'],
      ],
      nota: 'Every Z is worth 1. Every V is worth 1.',
      reglasTitulo: 'Rules',
      reglas: [
        ['A formulaic concession is not V2', '«Es verdad que hay problemas, pero...» (“It is true there are problems, but...”) concedes nothing to the other. V2 requires a specific point attributed to the other. Same logic as formulaic courtesy in P3.'],
        ['“What about you?” (tu quoque)', 'If it replaces the answer («ustedes no son quiénes para hablar de corrupción», “you are in no position to talk about corruption”), it is Z1. If it accompanies an answer to the content, the answer is B.'],
        ['Z1 is not attacking the person', 'That is P3. Z1 is using the person to avoid answering what they said. It requires a criticism or a statement being referred to.'],
        ['Democratic exception for Z3', 'Refusing to debate with someone who justifies violence («no debatiré con quien no condena el terrorismo», “I will not debate with anyone who does not condemn terrorism”) is neutral if it meets P1’s three conditions. It is listed on the scorecard.'],
      ],
    },

    formula: {
      linea: 'P5 = 10 × (V + 0.5·B + 1) / (V + B + Z + 2)',
      leyenda: [['V', 'valuings', 'empatica'], ['B', 'rebuttals (worth 5)', 'neutra'], ['Z', 'cancellations', 'polariza']],
      explicacion: 'The same logic as P3 and P6: rebutting is the alternative to cancelling, and it enters at the neutral value, 5. A speech that never brings in the other’s voice is not scored: you can only ignore what is present.',
      tabla: {
        cabecera: ['Speech', 'Z', 'B', 'V', 'P5'],
        filas: [
          ['Cancels', '4', '2', '0', '2.50'],
          ['Rebuts, with one «chorradas»', '1', '10', '0', '4.62'],
          ['Only rebuts', '0', '6', '0', '5.00'],
          ['Rebuts and concedes', '0', '4', '3', '6.67'],
        ],
      },
      minimos: {
        titulo: 'Minimums and robustness',
        filas: [['Fewer than 5 events', 'Not scored'], ['5 to 9', 'Indicative'], ['10 or more', 'Robust']],
        nota: 'Other-voice events are counted: V + B + Z. Provisional thresholds.',
      },
    },

    ficha: {
      intro: 'Each analysis publishes:',
      items: [
        'The counts of V, B and Z by subtype, the calculation, the score and its robustness.',
        'The full list of Z events, always, with the literal quote.',
        'The list of V events.',
        'The density of other voices per thousand words and the share of monoglossic statements, as descriptive data.',
        'Attributions to unidentifiable sources («hay quien dice que...», “some say that...”), unsigned. It is the observable form of the “hollow man” (Aikin and Casey, 2011).',
        'The density of rhetorical questions, unsigned.',
        'The democratic exceptions applied, the share of shared sentences and the genre of the speech.',
      ],
    },

    casos: {
      cabecera: ['Case', 'Resolution', 'Why'],
      filas: [
        ['«Discrepar es legítimo» (“disagreeing is legitimate”)', 'V1', 'Legitimizes disagreement', 'empatica'],
        ['«Respeto a quien defiende otra opción» (“I respect those who support another option”)', 'P1', 'Legitimizes the person', 'otro'],
        ['«En eso tienen razón» (“they are right about that”)', 'V2', 'The other’s point. «Es una persona honrada» (“she is an honest person”) is P3', 'empatica'],
        ['«Es verdad que hay problemas, pero...» (“it is true there are problems, but...”)', 'No event', 'Formulaic concession', 'otro'],
        ['«Eso es falso» (“that is false”), «es un bulo» (“it is a hoax”)', 'B', 'Denies the content', 'neutra'],
        ['«No diga chorradas» (“stop talking rubbish”)', 'Z2', 'Denies the meaning', 'polariza'],
        ['«Es propaganda» (“it is propaganda”)', 'Z1', 'Attacks the motive', 'polariza'],
        ['«Mienten» (“they lie”)', 'P3', 'Judges the person', 'otro'],
        ['«Ustedes no son quiénes para hablar de corrupción» (“you are in no position to talk about corruption”)', 'Z1', 'A “what about you?” that replaces the answer', 'polariza'],
        ['«Los que nos critican son parte del problema» (“those who criticize us are part of the problem”)', 'Z1', 'Criticism as guilt', 'polariza'],
        ['«Con esa gente no se habla» (“you do not talk to those people”)', 'Z3', 'A norm that denies the floor. «Que se callen» (“let them shut up”) is P6', 'polariza'],
        ['«No debatiré con quien no condena el terrorismo» (“I will not debate with anyone who does not condemn terrorism”)', 'Neutral', 'Democratic exception', 'neutra'],
        ['«Hay quien dice que queremos subir impuestos; es falso» (“some say we want to raise taxes; it is false”)', 'B', 'And the unidentifiable source goes on the scorecard', 'neutra'],
      ],
      desacuerdoTitulo: 'Where most disagreement is expected',
      desacuerdo: [
        'A real concession or a formulaic one.',
        'Whether the “what about you?” replaces or accompanies the answer.',
        'Unmarked quotation.',
      ],
    },

    limites: [
      ['The straw man cannot be coded', 'Knowing whether the other’s argument has been distorted requires knowing what they actually said, which lies outside the text. Nor can we see whether their weakest argument was picked.'],
      ['Reliability', 'Appraisal annotation rarely reports inter-coder agreement (Fuoli, 2018). P5 uses only its most formal features: attribution, negation and concession.'],
      ['Adapting the DQI', 'The DQI codes a parliamentarian’s whole intervention. P5 adapts it to the sentence-level event.'],
      ['Often unscored', 'A rally speech contains few other voices.'],
      ['Dilution', 'Many rebuttals dilute a cancellation. The scorecard always lists every Z.'],
      ['Time limit (29-N campaign)', 'Until P1 v1.2, acknowledging the other’s point stays in P1. P5 is not published during the campaign, so nothing is counted twice.'],
      ['Genre and language', 'The genre is recorded, with no adjustment. Original Spanish only.'],
    ],

    validacion: {
      cabecera: ['Test', 'How'],
      filas: [
        ['Test speeches', 'Recode Barcelona 2026 and UN 2024, with the dilution test (score with and without B).'],
        ['Reliability', 'Is there an event?, type (V, B, Z) and subtype. Target α ≥ 0.80 for the first two.'],
        ['Genre', 'Test on question time or a debate, where other voices do appear.'],
        ['Independence', 'Correlation with P3 within the same speaker. It is the pair most at risk of overlapping.'],
      ],
    },

    pendiente: [
      ['Thresholds', 'The minimums of 5 and 10 events are provisional until calibrated with the corpus.'],
    ],

    cambios: {
      titulo: 'Manual v0.1 · 9 and 10 November 2026',
      decisiones: [
        'P5 is how the other’s word is treated. It will take over acknowledging the other’s point from P1 (v1.2).',
        'Rebutting is neutral and enters at 5.',
        'The line is what is attacked: content, B; meaning, Z2; motive, Z1; person, P3. «Propaganda» is Z1.',
        'A speech with no other voices is not scored. The scorecard gives the density of other voices and the monoglossic share.',
        'The straw man is a limit. The scorecard records unidentifiable sources.',
        'A formulaic concession is not V2.',
        '“What about you?”: Z1 if it replaces the answer; B if it accompanies it.',
        'Democratic exception for Z3, with P1’s three conditions.',
        'Legitimizing the person is P1; legitimizing disagreement is P5 (V1).',
        'Argument quality lies outside P5, a candidate for P8.',
      ],
    },

    referencias: REFERENCIAS,
  },
};
