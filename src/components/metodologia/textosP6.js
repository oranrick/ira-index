// IRA · Metodología 2.0 · textos de /metodologia/p6. Fuente: research/manual/P6.md (v0.1, cerrado el 10-nov-2026).
// Bloques es y en con la misma estructura. En inglés, los ejemplos van como «original» (“traducción”).
import { UI_MANUAL } from './textosComunes.js';

const SIGNOS = { C: 'empatica', R: 'neutra', X: 'polariza', N: 'neutra' };

const REFERENCIAS = [
  'Benesch, S., y Dangerous Speech Project. Dangerous speech: A practical guide. [por verificar año de la edición]',
  'Cap, P. (2013). Proximization: The pragmatics of symbolic distance crossing. John Benjamins.',
  'Cap, P. (2017). The language of fear: Communicating threat in public discourse. Palgrave.',
  'Dunmire, P. L. (2005). Preempting the future: Rhetoric and ideology of the future in political discourse. Discourse & Society, 16(4), 481-513.',
  'Dunmire, P. L. (2011). Projecting the future through political discourse: The case of the Bush Doctrine. John Benjamins.',
  'Levitsky, S., y Ziblatt, D. (2018). How democracies die. Crown.',
  'Lührmann, A., Medzihorsky, J., y Lindberg, S. I. (2021). Walking the talk: How to identify anti-pluralist parties (V-Dem Working Paper 2021:116). V-Dem Institute.',
  'Marín-Arrese, J. I. (2011). Effective vs. epistemic stance and subjectivity in political discourse: Legitimising strategies and mystification of responsibility. En C. Hart (Ed.), Critical discourse studies in context and cognition (pp. 193-223). John Benjamins.',
  'Marín-Arrese, J. I. (2021). Winds of war: Epistemic and effective control in political discourse on war. Cultura, Lenguaje y Representación, 26, 289-307.',
  'Searle, J. R. (1976). A classification of illocutionary acts. Language in Society, 5(1), 1-23.',
  'Steenbergen, M. R., Bächtiger, A., Spörndli, M., y Steiner, J. (2003). Measuring political deliberation: A discourse quality index. Comparative European Politics, 1(1), 21-48.',
  'Steiner, J., Bächtiger, A., Spörndli, M., y Steenbergen, M. R. (2005). Deliberative politics in action: Analysing parliamentary discourse. Cambridge University Press.',
  'Țigriș, S.-L. (2019). Actos de habla indirectos y modalización en el discurso político electoral. Editura Universității din București.',
  'V-Dem Institute (2022). Codebook Varieties of Party Identity and Organization (V-Party) v2.',
  '[Autor por verificar] (2018). La promesa atenuada en el discurso parlamentario español. Spanish in Context, 15(2), 177-197.',
];

export const TEXTOS_P6 = {
  es: {
    ui: UI_MANUAL.es,
    signos: SIGNOS,
    codigo: 'P6',
    rotulo: 'Metodología 2.0 · P6',
    estado: 'Manual v0.1 · cerrado el 10 de noviembre de 2026',
    titulo: 'Lo que pide hacer',
    frase: 'Qué acción pone el discurso sobre la mesa, sobre quién recae y si deja sitio al otro después.',

    secciones: [
      { id: 'la-idea', titulo: 'La idea' },
      { id: 'que-mide', titulo: 'Qué mide y por qué' },
      { id: 'que-no-mide', titulo: 'Qué no mide' },
      { id: 'procedimiento', titulo: 'Cómo se codifica' },
      { id: 'unidad', titulo: 'La unidad' },
      { id: 'prueba', titulo: 'La prueba del sujeto político' },
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
      lema: ['Un discurso no solo describe: pide y promete.', '¿La acción deja al otro seguir en el juego?'],
      texto: 'P6 se fija en las acciones que recaen sobre personas y les hace una sola pregunta: ¿conserva al otro como sujeto político? Es decir, si después el otro puede seguir compitiendo, hablando y estando.',
      tres: [
        { codigo: 'X', nombre: 'Excluyente', texto: 'Saca al otro del juego, o cierra la alternativa. Polariza.' },
        { codigo: 'R', nombre: 'Reglada', texto: 'Va contra alguien, pero dentro de las reglas. Es neutra.' },
        { codigo: 'C', nombre: 'Cooperativa', texto: 'Busca el acuerdo con el otro o frena la hostilidad. Es empática.' },
      ],
    },

    teoria: {
      items: [
        ['Unidad (Searle, 1976)', 'Los actos directivos (que el oyente haga algo) y compromisivos (que el hablante haga algo) comparten dirección de ajuste: buscan que el mundo cambie para encajar con lo dicho. Por eso P6 trata juntas la orden y la promesa.'],
        ['La prueba del sujeto político', 'Levitsky y Ziblatt (2018) proponen cuatro indicadores de comportamiento autoritario: rechazar las reglas del juego, negar la legitimidad del rival, tolerar la violencia y recortar las libertades del rival y de los medios. La categoría excluyente es la forma verbal del primero, el tercero y el cuarto; el segundo lo miden P1 y P3. El índice de antipluralismo de V-Party mide lo mismo en partidos (Lührmann et al., 2021). El criterio es simétrico: no depende de la ideología.'],
        ['El polo cooperativo', 'La dimensión «política constructiva» del Discourse Quality Index codifica la apelación al consenso y la propuesta mediadora, con fiabilidad de buena a excelente (Steenbergen et al., 2003). Cooperar es pedir acuerdo, pacto o mediación, no usar un verbo amable.'],
        ['La urgencia que polariza', 'Lo que legitima una acción drástica no es la prisa, sino presentar el futuro como único e inevitable (Cap, 2013; Dunmire, 2005, 2011). P6 solo recoge el cierre explícito de la alternativa.'],
        ['La violencia', 'Pedir violencia contra alguien es el extremo de la categoría excluyente y no admite excepción (Benesch, Dangerous Speech Project).'],
      ],
      nota: 'P6 es un instrumento propio de IRA. No existe otro que dé signo a las llamadas a la acción: los estudios de campaña codifican el tipo de llamada (votar, donar, compartir), no si excluye al otro.',
    },

    noMide: {
      filas: [
        ['Coerción figurada', '«vamos a aplastarlos», «barrerlos»', 'P2'],
        ['Declarar que el otro no pertenece', '«no son el pueblo»', 'P1'],
        ['Oponer dos grupos', '«o nosotros o ellos»', 'P1'],
        ['Norma sobre la palabra del otro, sin directiva', '«con esa gente no se habla»', 'P5'],
        ['Acusación con forma de deseo', '«que no os engañen»', 'P3'],
        ['El escenario de amenaza', '«si ganan, España desaparece»', 'P4'],
        ['Juicio sobre la persona', '«son unos corruptos»', 'P3'],
        ['La prisa sin cierre', '«hay que actuar ya»', 'Densidad en la ficha'],
        ['El riesgo real de la llamada', '', 'Ver límites'],
      ],
      orden: {
        titulo: 'Orden de prioridad entre parámetros',
        intro: 'Cuando una misma marca cabe en dos parámetros, gana la primera pregunta que se cumple. Solo se aplica cuando el manual no ha resuelto ya el caso: «traidores a España» sigue siendo P3 aunque P1 vaya antes.',
        pasos: [
          ['¿Es figurado?', 'P2'],
          ['¿Pide o promete una acción, o cierra la alternativa?', 'P6'],
          ['¿Su objeto es la palabra o el argumento del otro?', 'P5'],
          ['¿Traza frontera, pertenencia o legitimidad?', 'P1'],
          ['¿Nombra una emoción?', 'P4'],
          ['¿Juzga literalmente a una persona o grupo?', 'P3'],
        ],
      },
      reglas: [
        'La prueba de entrada: tiene que haber una acción concreta pedida o prometida. «Que dimita» pide una acción. «Que no os engañen» no pide nada a nadie: atribuye un acto al otro, y por eso es P3.',
      ],
    },

    procedimiento: {
      pasos: [
        ['Extracción por código', ['Imperativos y exhortativos («votad», «hagamos»).', 'Subjuntivo con «que» («que dimita», «que se vayan»).', 'Perífrasis deónticas, también impersonales y atenuadas: «hay que», «tenemos que», «debemos», «es necesario», «habría que», «no se puede permitir», «es hora de».', 'Compromisos: «vamos a», futuro de primera persona («los echaremos»), «se va a».', 'Marcas de cierre: «no hay alternativa», «solo hay un camino», «no hay plan B», «o... o...», «no hay nada que discutir».']],
        ['Revisión humana', 'Se añaden los eventos que el código no vio y se quitan los falsos. El inventario de postura efectiva de Marín-Arrese para el español sirve de lista de partida.'],
        ['Clasificación en tres pasos', ['¿Hay una acción pedida o prometida, o un cierre de alternativa?', '¿Sobre qué recae? Si es un problema, una política o el propio grupo sin blanco, es N.', 'Si recae sobre personas: ¿conserva al otro como sujeto político?']],
        ['Cálculo por código', 'La IA o el codificador clasifican; la nota la pone la fórmula.'],
      ],
      nota: 'Se lee el discurso entero, incluido su tema. Si el blanco humano o el fin de la acción salen del contexto y no de la oración, el codificador anota el porqué en una línea.',
    },

    unidad: {
      definicion: 'El evento de acción = oración + acción pedida o prometida + blanco.',
      reglas: [
        'Una oración, una acción y un blanco dan un evento. Las repeticiones en oraciones distintas cuentan cada vez.',
        'Entran lo que se pide a otros y lo que el nosotros se compromete a hacer.',
        'El compromiso condicionado («si gobernamos, derogaremos...») cuenta.',
        'Las directivas citadas de otro no son del hablante.',
        'La directiva indirecta o irónica («¿a qué espera para dimitir?») se codifica solo si la intención es clara por el contexto.',
      ],
    },

    prueba: {
      intro: 'Lista de comprobación, a partir de Levitsky y Ziblatt. La acción es excluyente si pide o promete alguna de estas cosas. Si no pide ninguna, y va contra alguien, es reglada.',
      condiciones: [
        ['Sacar al otro', 'Del país, de la comunidad o de la vida pública.'],
        ['Castigar sin procedimiento', 'Sin pasar por un procedimiento ni atarlo a un acto concreto.'],
        ['Quitarle la palabra', 'O recortar sus libertades o las de los medios.'],
        ['Romper las reglas del juego', 'Negarse a aceptar un resultado, suspender elecciones, cerrar una institución.'],
        ['Violencia fuera de la ley', 'Polariza siempre, aunque el blanco haya ejercido violencia.'],
      ],
      notas: [
        ['Castigos: la lógica del ancla de P3', '«A la cárcel», sin más, es excluyente. «Que responda ante la justicia por el caso X» o «que lo juzguen» es reglada: nombra un acto y deja la decisión a un procedimiento. Pedir la acción de la justicia o de la policía es reglada.'],
        ['«Ilegalizarlos»', 'Es excluyente, salvo la excepción democrática de P1 con sus tres condiciones (conducta concreta, agente acotado, sin extensión), que lo deja neutro.'],
        ['Recurrir no es romper', 'Impugnar un resultado por los cauces legales («lo recurriremos ante la Junta Electoral») es reglada. Romper es negarse a aceptarlo o saltarse las reglas.'],
        ['Medidas sobre un grupo', 'Si el grupo se define por una situación legal y se aplica un procedimiento («devolver a quien entre de forma irregular, con garantías»), es reglada; si se formula como política sin blanco («reforzaremos el control de fronteras»), es programa. Si el grupo se define por su origen o identidad («que se vayan los inmigrantes»), o la medida se extiende a todos («deportar a todos», «remigración»), es excluyente. Devolver a quien está en situación irregular es una política legal de gobiernos de todo signo: P6 marca la expulsión por lo que se es.'],
      ],
    },

    codigos: {
      cabecera: ['Código', 'Qué es', 'Ejemplos', 'Signo'],
      filas: [
        ['C1', 'Apelación al acuerdo con quien está fuera del nosotros', '«pongámonos de acuerdo», «busquemos un pacto», «les tiendo la mano»', 'Empática'],
        ['C2', 'Propuesta mediadora o alternativa', '«propongo que la ley incluya lo que pide la oposición»', 'Empática'],
        ['C3', 'Freno a la hostilidad', '«no respondamos al odio con odio», «no insultéis a nadie»', 'Empática'],
        ['R', 'Acción reglada contra alguien', '«ganémosles en las urnas», «que dimita», «que convoque elecciones», «que responda ante la justicia por X»', 'Neutra, vale 5'],
        ['X1', 'Expulsión o eliminación', '«que se vayan del país», «hay que ilegalizarlos»', 'Polariza'],
        ['X2', 'Castigo sin ancla', '«a la cárcel», «lo van a pagar»', 'Polariza'],
        ['X3', 'Silenciamiento y recorte de libertades', '«que se callen», «no les dejéis hablar», «hay que cerrar ese periódico»', 'Polariza'],
        ['X4', 'Ruptura de las reglas', '«no aceptaremos ese resultado»', 'Polariza'],
        ['X5', 'Violencia extrajudicial', '', 'Polariza siempre'],
        ['X6', 'Cierre de alternativa o futuro único', '«no hay alternativa», «solo hay un camino», «o nosotros o el caos», «no hay nada que discutir»', 'Polariza'],
        ['N', 'Programa', '«construyamos vivienda», «vamos a derogar esa ley»', 'Neutra, no entra'],
        ['N', 'Movilización propia sin blanco', '«id a votar», «que nadie se quede en casa», «llenemos las urnas»', 'Neutra, no entra'],
      ],
      nota: 'Todos los X valen 1. Todos los C valen 1. El subtipo no cambia la nota.',
      reglasTitulo: 'Fronteras del polo cooperativo',
      reglas: [
        ['Cooperar exige alcance', 'El acuerdo se pide con quien está fuera del nosotros o con todos («entre todos», «con quienes piensan distinto»). «Unámonos», dicho a los propios, es movilización.'],
        ['No contradice a P1 ni a P2', 'Cada parámetro mira una cosa distinta: P1 mide la frontera, P2 la imagen y P6 lo que la acción ofrece al otro. Pedir unidad a los tuyos no traza un muro ni usa una imagen hostil, pero tampoco le ofrece nada al otro.'],
        ['El fin manda', 'Una acción cooperativa con fin excluyente es excluyente («unámonos para echarlos del país»). La movilización con fin excluyente, también («votad para que se vayan de España»).'],
        ['Mantener la posición', '«No vamos a ceder ni un milímetro», sin blanco, es neutra.'],
      ],
    },

    formula: {
      linea: 'P6 = 10 × (C + 0,5·R + 1) / (C + R + X + 2)',
      leyenda: [['C', 'cooperativas', 'empatica'], ['R', 'regladas (valen 5)', 'neutra'], ['X', 'excluyentes', 'polariza']],
      explicacion: 'La misma lógica que P3: la acción reglada entra con el valor neutro, 5, porque es la alternativa a la excluyente. El programa y la movilización propia no entran, porque no recaen sobre el otro.',
      tabla: {
        cabecera: ['Discurso', 'X', 'R', 'C', 'P6'],
        filas: [
          ['Excluyente', '5', '2', '0', '2,22'],
          ['De oposición, con un «a la cárcel»', '1', '12', '0', '4,67'],
          ['Solo acciones regladas', '0', '6', '0', '5,00'],
          ['Cooperativo', '0', '3', '4', '7,22'],
        ],
      },
      minimos: {
        titulo: 'Mínimos y solidez',
        filas: [['Menos de 5 acciones', 'No se puntúa'], ['De 5 a 9', 'Orientativa'], ['10 o más', 'Sólida']],
        nota: 'Se cuentan las acciones sobre el otro: C + R + X. Umbrales provisionales, calibrables con el corpus.',
      },
    },

    ficha: {
      intro: 'Cada análisis publica:',
      items: [
        'Los recuentos de C, R, X (por subtipo) y N (programa y movilización, por separado), el cálculo, la nota y la solidez.',
        'La lista completa de eventos X, siempre, con la cita literal y el subtipo, aunque la nota salga alta.',
        'La lista de eventos C.',
        'La proporción excluyente, X / (X + R), y la densidad de X por mil palabras.',
        'La densidad de urgencia temporal («ya», «ahora», «urgente»), sin signo.',
        'Las excepciones democráticas aplicadas, con el aviso «el IRA no verifica estas acusaciones».',
        'El porcentaje de oraciones compartidas con otros parámetros y el género del discurso.',
      ],
    },

    casos: {
      cabecera: ['Caso', 'Resolución', 'Por qué'],
      filas: [
        ['«Que dimita»', 'R', 'Exigencia dentro de las reglas', 'neutra'],
        ['«Ganémosles en las urnas»', 'R', 'Competencia', 'neutra'],
        ['«A la cárcel»', 'X2', 'Castigo sin acto ni procedimiento', 'polariza'],
        ['«Que responda ante la justicia por el caso X»', 'R', 'Acto nombrado, decide un procedimiento', 'neutra'],
        ['«Hay que ilegalizarlos»', 'X1', 'Elimina al rival. Neutro solo con la excepción democrática', 'polariza'],
        ['«Que se vayan del país»', 'X1', 'Expulsión pedida. «No son el pueblo» es P1', 'polariza'],
        ['«Que se callen»', 'X3', 'Silenciamiento pedido. «Con esa gente no se habla» es P5', 'polariza'],
        ['«Que no os engañen»', 'P3', 'No pide una acción: atribuye una', 'otro'],
        ['«O nosotros o el caos»', 'X6', 'Futuro único. «O nosotros o ellos» es P1', 'polariza'],
        ['«Hay que actuar ya contra los incendios»', 'N', 'Prisa sin cierre, sobre un problema', 'neutra'],
        ['«Id a votar», «que nadie se quede en casa»', 'N', 'Movilización propia sin blanco', 'neutra'],
        ['«Votad para echarlos del país»', 'X1', 'Movilización con fin excluyente', 'polariza'],
        ['«Vamos a derogar esa ley», «vamos a derogar el sanchismo»', 'N', 'Recae sobre una política', 'neutra'],
        ['«Vamos a aplastarlos»', 'P2', 'Figurado', 'otro'],
        ['«Pongámonos de acuerdo con quienes piensan distinto»', 'C1', 'Apelación al acuerdo con el otro', 'empatica'],
        ['«No respondamos al odio con odio»', 'C3', 'Freno a la hostilidad', 'empatica'],
        ['«Unámonos», dicho a los propios', 'N', 'Unidad del propio grupo. No ofrece nada al otro', 'neutra'],
        ['«No pactaremos jamás con ellos»', 'R', 'El otro sigue compitiendo. No querer acordar no es silenciar', 'neutra'],
        ['«Hay que echarlos», sin complemento', 'Por contexto', 'Del gobierno y por los votos, R. Del país o de la vida pública, X1. En caso de duda, R, con nota', 'otro'],
        ['«Devolver a quien entre de forma irregular, con garantías»', 'R', 'Grupo definido por una situación legal, con procedimiento', 'neutra'],
        ['«Reforzaremos el control de fronteras»', 'N', 'Programa, sin blanco', 'neutra'],
        ['«Expulsar a quien cometa delitos graves, tras sentencia»', 'R', 'Conducta concreta y procedimiento', 'neutra'],
        ['«Que se vayan los inmigrantes»', 'X1', 'Grupo definido por su origen', 'polariza'],
        ['«Deportar a todos», «remigración»', 'X1', 'Medida extendida a todos', 'polariza'],
        ['«Lo van a pagar»', 'X2', 'Castigo sin ancla', 'polariza'],
        ['«Lo van a pagar en las urnas»', 'R', 'El castigo es el voto', 'neutra'],
        ['«Lo recurriremos ante la Junta Electoral»', 'R', 'Cauce legal', 'neutra'],
        ['«No aceptaremos ese resultado»', 'X4', 'Ruptura de las reglas', 'polariza'],
        ['«Es ahora o nunca», «es la última oportunidad»', 'N', 'Urgencia temporal. Va a la densidad de la ficha', 'neutra'],
      ],
      desacuerdoTitulo: 'Dónde se espera más desacuerdo',
      desacuerdo: [
        'El complemento omitido («echarlos», «a por ellos»). Se resuelve por contexto y, en caso de duda, R.',
        'El alcance de la cooperación: si «juntos» incluye al otro o solo a los propios.',
        'Programa o acción contra personas, cuando una política recae sobre un grupo (inmigración). Se aplica la lógica del ancla.',
      ],
    },

    limites: [
      ['Instrumento nuevo', 'No hay precedente que dé signo a las llamadas a la acción. La fiabilidad hay que medirla, aunque las decisiones son más observables que en P3.'],
      ['Forma, no riesgo', 'La peligrosidad de una llamada depende del orador, el público, el contexto y el medio (Benesch). P6 mide la forma de la llamada, no su riesgo real.'],
      ['Extensión de la teoría', 'Cap y Dunmire trabajan con discurso de guerra y seguridad nacional. Aplicarlos al mitin electoral es una extensión razonable, pero es una extensión.'],
      ['Polo cooperativo escaso', 'El DQI está pensado para el debate parlamentario. En un mitin las propuestas mediadoras son raras.'],
      ['Dilución', 'En un discurso de oposición, «que dimita» puede dominar y llevar casi cualquier nota a 5. La ficha lo compensa listando siempre cada evento X.'],
      ['La acción atenuada', 'En español la promesa suele ir en impersonal o condicional. El extractor puede perder parte.'],
      ['IRA no juzga la política', 'Una misma medida puede ser reglada o excluyente según cómo se formule. La nota no dice si la medida es buena.'],
      ['Límite temporal (campaña del 29-N)', 'Mientras P1 v1.1 siga congelado, la deshumanización figurada cuenta en P1 y en P2. Se corrige en P1 v1.2. Género anotado y solo español original.'],
    ],

    validacion: {
      cabecera: ['Prueba', 'Cómo'],
      filas: [
        ['Discursos de prueba', 'Recodificar Sánchez Barcelona 2026 y ONU 2024.'],
        ['Dilución', 'Publicar P6 con esta fórmula y sin las acciones regladas, junto a la proporción excluyente.'],
        ['Fiabilidad', 'Tres acuerdos por separado (Krippendorff): ¿hay evento?, tipo (C, R, X, N) y subtipo. Objetivo α ≥ 0,80 en los dos primeros; en subtipo basta 0,67. Humano frente a IA.'],
        ['Simetría', 'Comprobar con el corpus de campaña que la lista de comprobación recoge las formas excluyentes de todos los bloques.'],
        ['Validez externa', 'Comparar la proporción excluyente por partido con su valor de antipluralismo en V-Party.'],
        ['Independencia', 'Correlación de P6 con P1, P2 y P3 dentro de un mismo orador.'],
      ],
    },

    pendiente: [
      ['Umbrales', 'Los mínimos de 5 y 10 acciones son provisionales hasta calibrar con el corpus.'],
    ],

    cambios: {
      titulo: 'Manual v0.1 · 9 y 10 de noviembre de 2026',
      decisiones: [
        'La urgencia sin alternativa va a P6; el escenario apocalíptico, a P4.',
        'Unidad: directivos y compromisivos. Entran las formas impersonales y atenuadas y el subjuntivo con «que».',
        'Signo: prueba «¿conserva al otro como sujeto político?», con base en Levitsky y Ziblatt (2018) y V-Party.',
        'Castigos con la lógica del ancla de P3. «A la cárcel» polariza; «que responda ante la justicia por X» es reglada.',
        '«Ilegalizarlos» polariza, salvo la excepción democrática de P1, que lo deja neutro.',
        'Movilización propia sin blanco: neutra y fuera de la fórmula, salvo fin excluyente.',
        'La violencia extrajudicial polariza siempre. Pedir la acción de la justicia o la policía es reglada.',
        'Urgencia: solo polariza el cierre explícito de la alternativa o del debate, y el futuro único.',
        'Fórmula con la reglada en 5 y prueba de dilución.',
        '«Que se callen» es P6; «con esa gente no se habla» es P5. «Que se vayan del país» es P6; «no son el pueblo» es P1.',
        'Orden de prioridad de la marca única: P2, P6, P5, P1, P4, P3. Los casos resueltos mandan.',
        'X4, ruptura de las reglas. Recurrir un resultado por los cauces legales es R.',
        '«Unámonos», dicho a los propios, es movilización. Negarse a pactar es R.',
        'Medidas sobre un grupo: definido por situación legal y con procedimiento, R (o N si es programa); definido por origen o identidad, o extendido a todos, X1.',
        '«Lo van a pagar» es X2; «lo van a pagar en las urnas» es R.',
      ],
    },

    referencias: REFERENCIAS,
  },

  en: {
    ui: UI_MANUAL.en,
    signos: SIGNOS,
    codigo: 'P6',
    rotulo: 'Methodology 2.0 · P6',
    estado: 'Manual v0.1 · closed on 10 November 2026',
    titulo: 'What it calls for',
    frase: 'Which action the speech puts on the table, who it falls on and whether it leaves room for the other afterwards.',

    secciones: [
      { id: 'la-idea', titulo: 'The idea' },
      { id: 'que-mide', titulo: 'What it measures and why' },
      { id: 'que-no-mide', titulo: 'What it does not measure' },
      { id: 'procedimiento', titulo: 'How it is coded' },
      { id: 'unidad', titulo: 'The unit' },
      { id: 'prueba', titulo: 'The political-subject test' },
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
      lema: ['A speech does not only describe: it asks and promises.', 'Does the action let the other stay in the game?'],
      texto: 'P6 looks at actions that fall on people and asks them a single question: does it keep the other as a political subject? That is, whether afterwards the other can still compete, speak and be there.',
      tres: [
        { codigo: 'X', nombre: 'Exclusionary', texto: 'Takes the other out of the game, or closes off the alternative. Polarizing.' },
        { codigo: 'R', nombre: 'Rule-bound', texto: 'Aimed at someone, but within the rules. Neutral.' },
        { codigo: 'C', nombre: 'Cooperative', texto: 'Seeks agreement with the other or curbs hostility. Empathetic.' },
      ],
    },

    teoria: {
      items: [
        ['Unit (Searle, 1976)', 'Directives (the hearer is to do something) and commissives (the speaker will do something) share a direction of fit: they seek to change the world to match what is said. That is why P6 treats orders and promises together.'],
        ['The political-subject test', 'Levitsky and Ziblatt (2018) propose four indicators of authoritarian behaviour: rejecting the rules of the game, denying the rival’s legitimacy, tolerating violence and curtailing the civil liberties of rivals and the media. The exclusionary category is the verbal form of the first, third and fourth; the second is measured by P1 and P3. V-Party’s anti-pluralism index measures the same in parties (Lührmann et al., 2021). The criterion is symmetrical: it does not depend on ideology.'],
        ['The cooperative pole', 'The “constructive politics” dimension of the Discourse Quality Index codes appeals to consensus and mediating proposals, with good to excellent reliability (Steenbergen et al., 2003). Cooperating means asking for agreement, a pact or mediation, not using a friendly verb.'],
        ['Urgency that polarizes', 'What legitimizes drastic action is not haste but presenting the future as single and inevitable (Cap, 2013; Dunmire, 2005, 2011). P6 only picks up the explicit closing-off of alternatives.'],
        ['Violence', 'Calling for violence against someone is the extreme of the exclusionary category and admits no exception (Benesch, Dangerous Speech Project).'],
      ],
      nota: 'P6 is IRA’s own instrument. No other one gives a sign to calls to action: campaign studies code the type of call (vote, donate, share), not whether it excludes the other.',
    },

    noMide: {
      filas: [
        ['Figurative coercion', '«vamos a aplastarlos» (“we are going to crush them”), «barrerlos» (“sweep them away”)', 'P2'],
        ['Declaring that the other does not belong', '«no son el pueblo» (“they are not the people”)', 'P1'],
        ['Setting two groups against each other', '«o nosotros o ellos» (“either us or them”)', 'P1'],
        ['A norm about the other’s word, with no directive', '«con esa gente no se habla» (“you do not talk to those people”)', 'P5'],
        ['An accusation shaped as a wish', '«que no os engañen» (“don’t let them fool you”)', 'P3'],
        ['The threat scenario', '«si ganan, España desaparece» (“if they win, Spain disappears”)', 'P4'],
        ['Judgement about the person', '«son unos corruptos» (“they are crooks”)', 'P3'],
        ['Haste without closure', '«hay que actuar ya» (“we must act now”)', 'Density on the scorecard'],
        ['The real risk of the call', '', 'See limits'],
      ],
      orden: {
        titulo: 'Priority order between parameters',
        intro: 'When the same mark fits two parameters, the first question that is met wins. It only applies when the manual has not already resolved the case: «traidores a España» (“traitors to Spain”) stays in P3 even though P1 comes first.',
        pasos: [
          ['Is it figurative?', 'P2'],
          ['Does it ask for or promise an action, or close off the alternative?', 'P6'],
          ['Is its object the other’s word or argument?', 'P5'],
          ['Does it draw a boundary, belonging or legitimacy?', 'P1'],
          ['Does it name an emotion?', 'P4'],
          ['Does it literally judge a person or group?', 'P3'],
        ],
      },
      reglas: [
        'The entry test: there has to be a specific action asked for or promised. «Que dimita» (“let him resign”) asks for an action. «Que no os engañen» (“don’t let them fool you”) asks nothing of anyone: it attributes an act to the other, which is why it is P3.',
      ],
    },

    procedimiento: {
      pasos: [
        ['Extraction by code', ['Imperatives and exhortatives («votad», “vote”; «hagamos», “let us do”).', 'Subjunctive with «que» («que dimita», “let him resign”; «que se vayan», “let them leave”).', 'Deontic periphrases, including impersonal and hedged ones: «hay que», «tenemos que», «debemos», «es necesario», «habría que», «no se puede permitir», «es hora de» (“we must”, “we have to”, “it is necessary”, “we should”, “it cannot be allowed”, “it is time to”).', 'Commitments: «vamos a» (“we are going to”), first-person future («los echaremos», “we will throw them out”), «se va a».', 'Closure marks: «no hay alternativa», «solo hay un camino», «no hay plan B», «o... o...», «no hay nada que discutir» (“there is no alternative”, “there is only one way”, “there is no plan B”, “either... or...”, “there is nothing to discuss”).']],
        ['Human review', 'Events the code missed are added and false ones removed. Marín-Arrese’s inventory of effective stance for Spanish is the starting list.'],
        ['Classification in three steps', ['Is there an action asked for or promised, or a closing-off of alternatives?', 'What does it fall on? If it is a problem, a policy or one’s own group with no target, it is N.', 'If it falls on people: does it keep the other as a political subject?']],
        ['Calculation by code', 'AI or the coder classifies; the formula sets the score.'],
      ],
      nota: 'The whole speech is read, including its topic. If the human target or the purpose of the action comes from the context rather than the sentence, the coder notes why in one line.',
    },

    unidad: {
      definicion: 'The action event = sentence + action asked for or promised + target.',
      reglas: [
        'One sentence, one action and one target give one event. Repetitions in different sentences count every time.',
        'Both what is asked of others and what “we” commit to doing count.',
        'Conditional commitments («si gobernamos, derogaremos...», “if we govern, we will repeal...”) count.',
        'Directives quoted from someone else are not the speaker’s.',
        'Indirect or ironic directives («¿a qué espera para dimitir?», “what is he waiting for to resign?”) are coded only when the intention is clear from context.',
      ],
    },

    prueba: {
      intro: 'A checklist based on Levitsky and Ziblatt. The action is exclusionary if it asks for or promises any of these. If it asks for none of them, and is aimed at someone, it is rule-bound.',
      condiciones: [
        ['Removing the other', 'From the country, the community or public life.'],
        ['Punishment without procedure', 'Without going through a procedure or tying it to a specific act.'],
        ['Taking away their voice', 'Or curtailing their liberties or those of the media.'],
        ['Breaking the rules of the game', 'Refusing to accept a result, suspending elections, shutting down an institution.'],
        ['Violence outside the law', 'Always polarizing, even if the target has used violence.'],
      ],
      notas: [
        ['Punishments: P3’s anchor logic', '«A la cárcel» (“to jail”), on its own, is exclusionary. «Que responda ante la justicia por el caso X» (“let him answer to the courts for case X”) or «que lo juzguen» (“let him be tried”) is rule-bound: it names an act and leaves the decision to a procedure. Calling on the courts or the police to act is rule-bound.'],
        ['«Ilegalizarlos» (“outlaw them”)', 'Exclusionary, unless P1’s democratic exception applies with its three conditions (specific conduct, bounded agent, no extension), which makes it neutral.'],
        ['Appealing is not breaking', 'Challenging a result through legal channels («lo recurriremos ante la Junta Electoral», “we will appeal to the Electoral Board”) is rule-bound. Breaking means refusing to accept it or bypassing the rules.'],
        ['Measures on a group', 'If the group is defined by a legal situation and a procedure applies («devolver a quien entre de forma irregular, con garantías», “return those who enter irregularly, with safeguards”), it is rule-bound; if it is phrased as a policy with no target («reforzaremos el control de fronteras», “we will strengthen border control”), it is a programme. If the group is defined by origin or identity («que se vayan los inmigrantes», “immigrants should leave”), or the measure extends to everyone («deportar a todos», “deport them all”; «remigración», “remigration”), it is exclusionary. Returning people in an irregular situation is a legal policy of governments of every stripe: P6 marks expulsion for who someone is.'],
      ],
    },

    codigos: {
      cabecera: ['Code', 'What it is', 'Examples', 'Sign'],
      filas: [
        ['C1', 'Appeal for agreement with those outside “us”', '«pongámonos de acuerdo» (“let us agree”), «busquemos un pacto» (“let us seek a pact”), «les tiendo la mano» (“I hold out my hand to you”)', 'Empathetic'],
        ['C2', 'Mediating or alternative proposal', '«propongo que la ley incluya lo que pide la oposición» (“I propose the law include what the opposition is asking for”)', 'Empathetic'],
        ['C3', 'Curbing hostility', '«no respondamos al odio con odio» (“let us not answer hatred with hatred”), «no insultéis a nadie» (“do not insult anyone”)', 'Empathetic'],
        ['R', 'Rule-bound action against someone', '«ganémosles en las urnas» (“let us beat them at the polls”), «que dimita» (“let him resign”), «que convoque elecciones» (“let him call elections”), «que responda ante la justicia por X» (“let him answer to the courts for X”)', 'Neutral, worth 5'],
        ['X1', 'Expulsion or elimination', '«que se vayan del país» (“let them leave the country”), «hay que ilegalizarlos» (“they must be outlawed”)', 'Polarizing'],
        ['X2', 'Unanchored punishment', '«a la cárcel» (“to jail”), «lo van a pagar» (“they are going to pay for it”)', 'Polarizing'],
        ['X3', 'Silencing and curtailing liberties', '«que se callen» (“let them shut up”), «no les dejéis hablar» (“do not let them speak”), «hay que cerrar ese periódico» (“that newspaper must be shut down”)', 'Polarizing'],
        ['X4', 'Breaking the rules', '«no aceptaremos ese resultado» (“we will not accept that result”)', 'Polarizing'],
        ['X5', 'Extrajudicial violence', '', 'Always polarizing'],
        ['X6', 'Closing off alternatives or a single future', '«no hay alternativa» (“there is no alternative”), «solo hay un camino» (“there is only one way”), «o nosotros o el caos» (“us or chaos”), «no hay nada que discutir» (“there is nothing to discuss”)', 'Polarizing'],
        ['N', 'Programme', '«construyamos vivienda» (“let us build housing”), «vamos a derogar esa ley» (“we are going to repeal that law”)', 'Neutral, left out'],
        ['N', 'Mobilizing one’s own side with no target', '«id a votar» (“go and vote”), «que nadie se quede en casa» (“let no one stay at home”), «llenemos las urnas» (“let us fill the ballot boxes”)', 'Neutral, left out'],
      ],
      nota: 'Every X is worth 1. Every C is worth 1. The subtype does not change the score.',
      reglasTitulo: 'Boundaries of the cooperative pole',
      reglas: [
        ['Cooperation needs reach', 'Agreement is sought with those outside “us” or with everyone («entre todos», “all together”; «con quienes piensan distinto», “with those who think differently”). «Unámonos» (“let us unite”), said to one’s own side, is mobilization.'],
        ['It does not contradict P1 or P2', 'Each parameter looks at something different: P1 measures the boundary, P2 the image and P6 what the action offers the other. Asking your own side for unity builds no wall and uses no hostile image, but it offers the other nothing either.'],
        ['The purpose decides', 'A cooperative action with an exclusionary purpose is exclusionary («unámonos para echarlos del país», “let us unite to throw them out of the country”). So is mobilization with an exclusionary purpose («votad para que se vayan de España», “vote so that they leave Spain”).'],
        ['Holding one’s position', '«No vamos a ceder ni un milímetro» (“we will not give an inch”), with no target, is neutral.'],
      ],
    },

    formula: {
      linea: 'P6 = 10 × (C + 0.5·R + 1) / (C + R + X + 2)',
      leyenda: [['C', 'cooperative', 'empatica'], ['R', 'rule-bound (worth 5)', 'neutra'], ['X', 'exclusionary', 'polariza']],
      explicacion: 'The same logic as P3: rule-bound action enters at the neutral value, 5, because it is the alternative to exclusion. Programmes and mobilizing one’s own side are left out, because they do not fall on the other.',
      tabla: {
        cabecera: ['Speech', 'X', 'R', 'C', 'P6'],
        filas: [
          ['Exclusionary', '5', '2', '0', '2.22'],
          ['Opposition, with one «a la cárcel»', '1', '12', '0', '4.67'],
          ['Rule-bound actions only', '0', '6', '0', '5.00'],
          ['Cooperative', '0', '3', '4', '7.22'],
        ],
      },
      minimos: {
        titulo: 'Minimums and robustness',
        filas: [['Fewer than 5 actions', 'Not scored'], ['5 to 9', 'Indicative'], ['10 or more', 'Robust']],
        nota: 'Actions on the other are counted: C + R + X. Provisional thresholds, to be calibrated with the corpus.',
      },
    },

    ficha: {
      intro: 'Each analysis publishes:',
      items: [
        'The counts of C, R, X (by subtype) and N (programme and mobilization, separately), the calculation, the score and its robustness.',
        'The full list of X events, always, with the literal quote and the subtype, even when the score is high.',
        'The list of C events.',
        'The exclusionary ratio, X / (X + R), and the density of X per thousand words.',
        'The density of temporal urgency («ya», «ahora», «urgente»: “now”, “right now”, “urgent”), unsigned.',
        'The democratic exceptions applied, with the notice “IRA does not verify these accusations”.',
        'The share of sentences shared with other parameters and the genre of the speech.',
      ],
    },

    casos: {
      cabecera: ['Case', 'Resolution', 'Why'],
      filas: [
        ['«Que dimita» (“let him resign”)', 'R', 'A demand within the rules', 'neutra'],
        ['«Ganémosles en las urnas» (“let us beat them at the polls”)', 'R', 'Competition', 'neutra'],
        ['«A la cárcel» (“to jail”)', 'X2', 'Punishment with no act or procedure', 'polariza'],
        ['«Que responda ante la justicia por el caso X» (“let him answer to the courts for case X”)', 'R', 'Named act, a procedure decides', 'neutra'],
        ['«Hay que ilegalizarlos» (“they must be outlawed”)', 'X1', 'Eliminates the rival. Neutral only with the democratic exception', 'polariza'],
        ['«Que se vayan del país» (“let them leave the country”)', 'X1', 'Expulsion called for. «No son el pueblo» (“they are not the people”) is P1', 'polariza'],
        ['«Que se callen» (“let them shut up”)', 'X3', 'Silencing called for. «Con esa gente no se habla» (“you do not talk to those people”) is P5', 'polariza'],
        ['«Que no os engañen» (“don’t let them fool you”)', 'P3', 'It does not ask for an action: it attributes one', 'otro'],
        ['«O nosotros o el caos» (“us or chaos”)', 'X6', 'Single future. «O nosotros o ellos» (“either us or them”) is P1', 'polariza'],
        ['«Hay que actuar ya contra los incendios» (“we must act now against the fires”)', 'N', 'Haste without closure, on a problem', 'neutra'],
        ['«Id a votar» (“go and vote”), «que nadie se quede en casa» (“let no one stay at home”)', 'N', 'Mobilizing one’s own side with no target', 'neutra'],
        ['«Votad para echarlos del país» (“vote to throw them out of the country”)', 'X1', 'Mobilization with an exclusionary purpose', 'polariza'],
        ['«Vamos a derogar esa ley» (“we are going to repeal that law”), «vamos a derogar el sanchismo» (“we are going to repeal sanchismo”)', 'N', 'Falls on a policy', 'neutra'],
        ['«Vamos a aplastarlos» (“we are going to crush them”)', 'P2', 'Figurative', 'otro'],
        ['«Pongámonos de acuerdo con quienes piensan distinto» (“let us agree with those who think differently”)', 'C1', 'Appeal for agreement with the other', 'empatica'],
        ['«No respondamos al odio con odio» (“let us not answer hatred with hatred”)', 'C3', 'Curbing hostility', 'empatica'],
        ['«Unámonos» (“let us unite”), said to one’s own side', 'N', 'Unity of one’s own group. It offers the other nothing', 'neutra'],
        ['«No pactaremos jamás con ellos» (“we will never make a pact with them”)', 'R', 'The other keeps competing. Not wanting an agreement is not silencing', 'neutra'],
        ['«Hay que echarlos» (“we have to throw them out”), with no complement', 'By context', 'Out of government, by votes: R. Out of the country or public life: X1. If in doubt, R, with a note', 'otro'],
        ['«Devolver a quien entre de forma irregular, con garantías» (“return those who enter irregularly, with safeguards”)', 'R', 'Group defined by a legal situation, with a procedure', 'neutra'],
        ['«Reforzaremos el control de fronteras» (“we will strengthen border control”)', 'N', 'Programme, no target', 'neutra'],
        ['«Expulsar a quien cometa delitos graves, tras sentencia» (“expel those who commit serious crimes, after a conviction”)', 'R', 'Specific conduct and procedure', 'neutra'],
        ['«Que se vayan los inmigrantes» (“immigrants should leave”)', 'X1', 'Group defined by origin', 'polariza'],
        ['«Deportar a todos» (“deport them all”), «remigración» (“remigration”)', 'X1', 'Measure extended to everyone', 'polariza'],
        ['«Lo van a pagar» (“they are going to pay for it”)', 'X2', 'Unanchored punishment', 'polariza'],
        ['«Lo van a pagar en las urnas» (“they will pay for it at the polls”)', 'R', 'The punishment is the vote', 'neutra'],
        ['«Lo recurriremos ante la Junta Electoral» (“we will appeal to the Electoral Board”)', 'R', 'Legal channel', 'neutra'],
        ['«No aceptaremos ese resultado» (“we will not accept that result”)', 'X4', 'Breaking the rules', 'polariza'],
        ['«Es ahora o nunca» (“it is now or never”), «es la última oportunidad» (“it is the last chance”)', 'N', 'Temporal urgency. It goes to the density on the scorecard', 'neutra'],
      ],
      desacuerdoTitulo: 'Where most disagreement is expected',
      desacuerdo: [
        'The omitted complement («echarlos», “throw them out”; «a por ellos», “go get them”). Resolved by context and, if in doubt, R.',
        'The reach of cooperation: whether «juntos» (“together”) includes the other or only one’s own side.',
        'Programme or action against people, when a policy falls on a group (immigration). The anchor logic applies.',
      ],
    },

    limites: [
      ['A new instrument', 'There is no precedent for giving a sign to calls to action. Reliability has to be measured, although the decisions are more observable than in P3.'],
      ['Form, not risk', 'How dangerous a call is depends on the speaker, the audience, the context and the medium (Benesch). P6 measures the form of the call, not its real risk.'],
      ['Stretching the theory', 'Cap and Dunmire work with war and national security discourse. Applying them to election rallies is a reasonable extension, but it is an extension.'],
      ['A thin cooperative pole', 'The DQI was designed for parliamentary debate. At a rally, mediating proposals are rare.'],
      ['Dilution', 'In an opposition speech, «que dimita» (“let him resign”) can dominate and pull almost any score towards 5. The scorecard compensates by always listing every X event.'],
      ['Hedged action', 'In Spanish, promises are often impersonal or conditional. The extractor may miss some.'],
      ['IRA does not judge the policy', 'The same measure can be rule-bound or exclusionary depending on how it is phrased. The score does not say whether the measure is good.'],
      ['Time limit (29-N campaign)', 'While P1 v1.1 remains frozen, figurative dehumanization counts in both P1 and P2. This is fixed in P1 v1.2. Genre recorded; original Spanish only.'],
    ],

    validacion: {
      cabecera: ['Test', 'How'],
      filas: [
        ['Test speeches', 'Recode Sánchez Barcelona 2026 and UN 2024.'],
        ['Dilution', 'Publish P6 with this formula and without rule-bound actions, alongside the exclusionary ratio.'],
        ['Reliability', 'Three separate agreements (Krippendorff): is there an event?, type (C, R, X, N) and subtype. Target α ≥ 0.80 for the first two; 0.67 is enough for subtype. Human versus AI.'],
        ['Symmetry', 'Check against the campaign corpus that the checklist catches the exclusionary forms of every bloc.'],
        ['External validity', 'Compare each party’s exclusionary ratio with its V-Party anti-pluralism score.'],
        ['Independence', 'Correlation of P6 with P1, P2 and P3 within the same speaker.'],
      ],
    },

    pendiente: [
      ['Thresholds', 'The minimums of 5 and 10 actions are provisional until calibrated with the corpus.'],
    ],

    cambios: {
      titulo: 'Manual v0.1 · 9 and 10 November 2026',
      decisiones: [
        'Urgency without alternatives goes to P6; the apocalyptic scenario, to P4.',
        'Unit: directives and commissives. Impersonal and hedged forms and the subjunctive with «que» are included.',
        'Sign: the test “does it keep the other as a political subject?”, based on Levitsky and Ziblatt (2018) and V-Party.',
        'Punishments follow P3’s anchor logic. «A la cárcel» (“to jail”) polarizes; «que responda ante la justicia por X» (“let him answer to the courts for X”) is rule-bound.',
        '«Ilegalizarlos» (“outlaw them”) polarizes, unless P1’s democratic exception makes it neutral.',
        'Mobilizing one’s own side with no target: neutral and left out of the formula, unless the purpose is exclusionary.',
        'Extrajudicial violence always polarizes. Calling on the courts or the police to act is rule-bound.',
        'Urgency: only the explicit closing-off of alternatives or debate, and the single future, polarize.',
        'Formula with rule-bound action at 5, plus a dilution test.',
        '«Que se callen» (“let them shut up”) is P6; «con esa gente no se habla» (“you do not talk to those people”) is P5. «Que se vayan del país» (“let them leave the country”) is P6; «no son el pueblo» (“they are not the people”) is P1.',
        'Priority order for a single mark: P2, P6, P5, P1, P4, P3. Resolved cases take precedence.',
        'X4, breaking the rules. Appealing a result through legal channels is R.',
        '«Unámonos» (“let us unite”), said to one’s own side, is mobilization. Refusing to make a pact is R.',
        'Measures on a group: defined by a legal situation and with a procedure, R (or N if a programme); defined by origin or identity, or extended to everyone, X1.',
        '«Lo van a pagar» (“they are going to pay for it”) is X2; «lo van a pagar en las urnas» (“they will pay for it at the polls”) is R.',
      ],
    },

    referencias: REFERENCIAS,
  },
};
