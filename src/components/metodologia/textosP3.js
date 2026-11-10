// IRA · Metodología 2.0 · textos de /metodologia/p3. Fuente: research/manual/P3.md (v0.1, cerrado el 9-nov-2026).
// Bloques es y en con la misma estructura. En inglés, los ejemplos van como «original» (“traducción”).
import { UI_MANUAL } from './textosComunes.js';

const SIGNOS = { D: 'polariza', A: 'neutra', R: 'empatica', N: 'neutra' };

const REFERENCIAS = [
  'Arendt, H. (1951). The origins of totalitarianism. [por verificar edición que se cite]',
  'Bar-Tal, D. (1989). Delegitimization: The extreme case of stereotyping and prejudice. En D. Bar-Tal et al. (Eds.), Stereotyping and prejudice: Changing conceptions. Springer. [por verificar datos de edición]',
  'Bar-Tal, D. (1990). Causes and consequences of delegitimization: Models of conflict and ethnocentrism. Journal of Social Issues, 46(1), 65-81.',
  'Bassignana, E., Basile, V., y Patti, V. (2018). Hurtlex: A multilingual lexicon of words to hurt. Proceedings of CLiC-it 2018.',
  'Blas Arroyo, J. L. (2001). "No diga chorradas..." La descortesía en el debate político cara a cara. Oralia, 4, 9-46.',
  'Coe, K., Kenski, K., y Rains, S. A. (2014). Online and uncivil? Patterns and determinants of incivility in newspaper website comments. Journal of Communication, 64(4), 658-679.',
  'Finkel, E. J., et al. (2020). Political sectarianism in America. Science, 370(6516), 533-536.',
  'Fuoli, M. (2018). A stepwise method for annotating APPRAISAL. Functions of Language, 25(2), 229-258.',
  'Gerchunoff, S. (2025). Un detalle siniestro en el uso de la palabra fascismo. Anagrama.',
  'Glick, P. (2005). Choice of scapegoats. En J. F. Dovidio, P. Glick y L. A. Rudman (Eds.), On the nature of prejudice: Fifty years after Allport (pp. 244-261). Blackwell.',
  'González Rodríguez, M. J. (2011). La expresión lingüística de la actitud en el género de opinión: el modelo de la valoración. RLA, 49(1).',
  'Grisales Ramírez, R. (2024). El contagio de las palabras: Metáforas, empatía y polarización en el discurso político contemporáneo. TFG, Universidad Complutense de Madrid.',
  'Husson et al. (2025). Broadening the study of morality in multiparty settings through a novel dictionary translation and validation. Political Psychology, 46, 487-510. [por verificar coautores]',
  'Jung, C. G. (1951). Aion; (1957). The undiscovered self. [por verificar edición que se cite]',
  'Kaplan, N. (2004). Nuevos desarrollos en el estudio de la evaluación en el lenguaje: la Teoría de la Valoración. Boletín de Lingüística, 16(22).',
  'Martin, J. R., y White, P. R. R. (2005). The language of evaluation: Appraisal in English. Palgrave Macmillan.',
  'Mouffe, C. (2005). On the political. Routledge.',
  'Muddiman, A. (2017). Personal and public levels of political incivility. International Journal of Communication, 11, 3182-3202.',
  'Rossini, P. (2022). Beyond incivility: Understanding patterns of uncivil and intolerant discourse in online political talk. Communication Research, 49(3), 399-425.',
  'Rothschild, Z. K., Landau, M. J., Sullivan, D., y Keefer, L. A. (2012). A dual-motive model of scapegoating. Journal of Personality and Social Psychology, 102(6), 1148-1163.',
];

export const TEXTOS_P3 = {
  es: {
    ui: UI_MANUAL.es,
    signos: SIGNOS,
    codigo: 'P3',
    rotulo: 'Metodología 2.0 · P3',
    estado: 'Manual v0.1 · cerrado el 9 de noviembre de 2026',
    titulo: 'El juicio sobre el otro',
    frase: 'Qué dice el discurso, en sentido literal, de las personas y grupos que no son el nosotros: si juzga lo que hacen o lo que son.',

    secciones: [
      { id: 'la-idea', titulo: 'La idea' },
      { id: 'que-mide', titulo: 'Qué mide y por qué' },
      { id: 'que-no-mide', titulo: 'Qué no mide' },
      { id: 'procedimiento', titulo: 'Cómo se codifica' },
      { id: 'unidad', titulo: 'La unidad' },
      { id: 'prueba', titulo: 'La prueba del ancla' },
      { id: 'codigos', titulo: 'Los códigos' },
      { id: 'lista', titulo: 'Etiquetas de estigma' },
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
      lema: ['Criticar no polariza.', 'Polariza convertir la crítica en identidad.'],
      texto: 'Pasar de «mintió» a «es un mentiroso», de «esa ley es injusta» a «son unos corruptos». El primer juicio deja al otro dentro de la conversación. El segundo lo define, y a quien se define como corrupto, traidor o fascista ya no hay nada que discutirle.',
      tres: [
        { codigo: 'D', nombre: 'Deslegitimación', texto: 'Juicio negativo sobre lo que el otro es. Polariza.' },
        { codigo: 'A', nombre: 'Crítica anclada', texto: 'Juicio negativo sobre un acto identificable. Es neutra.' },
        { codigo: 'R', nombre: 'Reconocimiento', texto: 'Juicio positivo sobre el otro. Es empático.' },
      ],
    },

    teoria: {
      items: [
        ['Unidad y signo', 'El sistema de Juicio de la Teoría de la Valoración (Martin y White, 2005) evalúa la conducta humana en dos regiones, estima social (normalidad, capacidad, tenacidad) y sanción social (veracidad, integridad), con signo positivo o negativo. De ahí salen la unidad de P3 y su polo empático.'],
        ['Códigos', 'Las estrategias de deslegitimación de Bar-Tal (1989, 1990): rasgos, exclusión, etiquetas políticas y comparación con un grupo deslegitimado. La quinta, la deshumanización, es figurada y pertenece a P2.'],
        ['Acto frente a esencia', 'La investigación separa la incivilidad de tono de la intolerancia que niega al otro respeto moral, y solo la segunda se asocia con daño democrático (Rossini, 2022; Muddiman, 2017). P3 no mide el tono. Mide si el juicio recae sobre un acto o sobre la persona.'],
        ['Lugar en el índice', 'El sectarismo político tiene tres ingredientes: ver al otro como ajeno, aversión y moralización (Finkel et al., 2020). P1 mide el primero, P4 el segundo y P3 el tercero. Por eso correlacionan sin ser redundantes.'],
        ['Chivo expiatorio', 'Atribuir una culpa desmedida por un resultado negativo a una persona o grupo (Rothschild et al., 2012). La proyección de la sombra (Jung) y la necesidad de un enemigo claro (Arendt) explican por qué se busca un culpable moral, pero no se codifican: no se pueden observar solo en el texto.'],
        ['Agonismo', 'Juzgar actos y no esencias es la forma literal de tratar al otro como adversario y no como enemigo (Mouffe, 2005).'],
      ],
      cautela: 'P3 no afirma nada sobre el cerebro de quien escucha. Es un indicador discursivo de una condición que la investigación asocia con la ruptura del reconocimiento mutuo.',
    },

    noMide: {
      filas: [
        ['Juicio figurado, deshumanización, caricatura', '«son ratas», «son una plaga»', 'P2'],
        ['Frontera, pertenencia y legitimidad', '«antiespañoles», «gobierno ilegítimo»', 'P1'],
        ['La interpelación en sí', 'el «os» de «que no os engañen»', 'P1'],
        ['Emoción nombrada', '«me dan asco», «tengo miedo»', 'P4'],
        ['Trato a los argumentos del otro', '«no diga chorradas», «en eso tiene razón»', 'P5'],
        ['Lo que se pide hacer', '«hay que echarlos»', 'P6'],
        ['Juicio sobre ideas, leyes o problemas', '«esa ley es injusta»', 'Neutro, sin evento'],
        ['La verdad de la acusación', '', 'IRA no la verifica'],
        ['El tono, la vulgaridad, el volumen', '', 'No se codifican'],
      ],
      reglas: [
        'Marca única, oración múltiple: cada marca va a un solo parámetro, pero una oración con dos marcas puede puntuar en dos. En «que no os engañen», «os» es P1 y «engañen» es P3. Si una misma marca cabe en dos parámetros, el orden es P2, P6, P5, P1, P4, P3, salvo que el manual ya haya resuelto el caso.',
        'Regla de lo literal: si el diccionario ya recoge el sentido evaluativo de la palabra, el juicio es literal y va a P3 («lacayo», «títere», «marioneta», «rendido» como sumiso). Si el sentido se construye con una imagen, va a P2.',
      ],
    },

    procedimiento: {
      pasos: [
        ['Extracción por código', ['Ser o estar + adjetivo o nombre del léxico de juicio.', 'Aposiciones y vocativos («esa banda de...», «señores corruptos»).', '«Como», «igual que», «lo mismo que» + nombre de grupo o régimen.', 'Generalizadores: «siempre», «nunca», «todos», «cada vez que».', 'Patrones de culpa: «por culpa de», «desde que llegaron», «los responsables de todo».']],
        ['Revisión humana', 'Se añaden los eventos que el código no vio y se quitan los falsos. El léxico (HurtLex, el diccionario de fundamentos morales en español y la lista de estigma) solo propone, nunca decide.'],
        ['Clasificación en tres pasos', ['¿Hay un juicio explícito sobre un blanco humano que no es el nosotros? Si no, no hay evento.', '¿Signo? Positivo: R. Negativo: pasa la prueba del ancla. Si la cumple, A; si no, D.', 'Subtipo (D1 a D6, R1 a R3). Es descriptivo.']],
        ['Cálculo por código', 'La IA o el codificador clasifican; la nota la pone la fórmula.'],
      ],
      nota: 'Se lee el discurso entero, incluido su tema. Si el blanco humano sale del contexto y no de la oración, el codificador anota el porqué en una línea.',
    },

    unidad: {
      definicion: 'El evento de juicio = oración + blanco humano + juicio explícito.',
      reglas: [
        'Una oración y un blanco dan un solo evento por signo, aunque acumule marcas («corruptos y traidores»). La ficha anota todos los subtipos.',
        'Si la misma oración trae un juicio negativo y uno positivo sobre el mismo blanco («es honrado, pero un inútil»), son dos eventos: un R y un D.',
        'Las repeticiones en oraciones distintas cuentan cada vez.',
        'Blanco humano: personas, grupos, colectivos políticos («la derecha», «el PP», «el Gobierno»), estructuras con nombre de personas («la casta», «las élites») e ideologías solo cuando se les da cuerpo o se extienden a sus portadores.',
        'No es blanco: el propio nosotros (el autoelogio es neutro), una idea, una ley, un problema.',
        'Solo juicio explícito. El juicio evocado por hechos narrados («se llevaron el dinero») se trata como acto.',
        'Las palabras citadas de otro («nos llamaron ratas») no son juicio del hablante.',
        'Ironía y pregunta retórica: solo si la intención es clara por el contexto. Si hay duda, no.',
      ],
    },

    prueba: {
      intro: 'Un juicio negativo es neutro (A) si cumple las tres condiciones. Si falla una, es D.',
      condiciones: [
        ['Acto o ámbito identificable', 'Se puede decir qué y cuándo, o se nombra una gestión concreta: una fecha, una ley, una votación, una declaración, una cifra, una decisión, una gestión nombrada.'],
        ['Agente acotado', 'Una persona, un gobierno, una dirección de partido. Nunca un pueblo, una etnia, una religión o unos votantes.'],
        ['Sin extensión', 'Sin «siempre», «todos», «son así», «todo».'],
      ],
      tabla: {
        cabecera: ['Anclado (A)', 'Sin ancla (D)'],
        filas: [
          ['«Ayer mintió sobre las cifras del paro»', '«Son unos mentirosos», «siempre mienten»'],
          ['«Es incapaz de resolver la vivienda»', '«Son unos inútiles»'],
          ['«El Gobierno es responsable de esta ley»', '«Todo es culpa del Gobierno»'],
          ['«Compraron esos votos con la amnistía»', '«Compran votos»'],
          ['«El gobierno de X está cometiendo un genocidio»', '«Los X son genocidas»'],
        ],
      },
      notas: [
        ['Sustituye a la excepción democrática', 'La excepción de P1 y P2 exige una conducta violenta o antidemocrática. La prueba del ancla vale para cualquier conducta. Una etiqueta acompañada de su ancla en la misma oración o en la contigua («los terroristas que pusieron la bomba», «ese delincuente», con la condena citada) es A.'],
        ['Si un verificador la desmiente, la nota no cambia', 'La ficha lo señala. En P1 la excepción democrática es un privilegio y se retira si la acusación se desmiente. Aquí el ancla es el criterio normal de forma: decide cómo se formula el juicio, no si es cierto.'],
      ],
    },

    codigos: {
      cabecera: ['Código', 'Qué es', 'Ejemplos', 'Signo'],
      filas: [
        ['D1', 'Rasgo de carácter o capacidad sin ancla, incluido el insulto lexicalizado', '«inútiles», «cobardes», «unas derechas lacayas», «títere», «rendida»', 'Polariza'],
        ['D2', 'Sanción moral sin ancla', '«corruptos», «traidores», «mentirosos», «ladrones»', 'Polariza'],
        ['D3', 'Etiqueta política de estigma (lista cerrada)', '«fascistas», «golpistas», «genocidas»', 'Polariza'],
        ['D4', 'Comparación con un grupo o régimen deslegitimado', '«como ETA», «igual que Maduro»', 'Polariza'],
        ['D5', 'Acusación sin ancla o generalizada', '«que no os engañen», «vienen a robar», «siempre mienten»', 'Polariza'],
        ['D6', 'Chivo expiatorio: resultado negativo + blanco humano + culpa total o desmedida', '«todo es culpa de ellos», «desde que llegaron no hay trabajo»', 'Polariza'],
        ['R1', 'Juicio positivo sobre alguien de fuera del nosotros', '«es una persona honrada», «ha trabajado mucho por esto»', 'Empático'],
        ['R2', 'Buena fe, o separar el acto de la persona', '«no dudo de su intención; critico la ley»', 'Empático'],
        ['R3', 'Negar un juicio moral, una etiqueta o un rasgo negativo', '«no son traidores», «no son corruptos»', 'Empático'],
        ['A', 'Crítica anclada', 'ver la prueba del ancla', 'Neutro, entra en la fórmula'],
        ['N', 'Otros neutros: juicio sobre ideas, etiqueta de posición, autoelogio, descortesía de estilo', '«la ultraderecha», «esa reforma es un error»', 'Neutro, no entra'],
      ],
      nota: 'Todos los D valen 1. Todos los R valen 1. El subtipo no cambia la nota.',
      reglasTitulo: 'Fronteras del polo empático',
      reglas: [
        ['Solo fuera del nosotros', 'El juicio positivo solo es R si el blanco está fuera del nosotros.'],
        ['Con contenido', 'R exige una evaluación con contenido. La cortesía de fórmula («con todo el respeto», «su señoría») no es R.'],
        ['Negar el juicio, no la frontera', 'Negar un juicio moral («no son traidores») es R3. Negar la frontera («no son enemigos») es P1.'],
        ['Lo que va a otros parámetros', 'Humanizar sin evaluar (su dolor, su familia) es P1. Reconocer un acierto o un argumento es P5.'],
      ],
    },

    lista: {
      intro: 'Las etiquetas que atan al otro a un régimen o a la violencia. La lista es simétrica (incluye etiquetas que se usan contra ambos lados), pública y cerrada: solo se amplía con una entrada en el registro de decisiones.',
      etiquetas: ['fascista, facha', 'nazi', 'franquista', 'estalinista', 'golpista', 'terrorista', 'filoetarra, proetarra', 'dictador, tirano', 'totalitario', 'genocida', 'neonazi', 'fachosfera'],
      reglas: [
        'Etiquetas de posición, neutras como designación: ultraderecha, extrema izquierda, comunista, socialcomunista, populista, independentista, sanchismo. Solo polarizan si llevan un juicio de esencia pegado.',
        '«Chavista» y «bolivariano» son autodesignaciones en América. Son neutras cuando designan al propio movimiento y D4 cuando se aplican a alguien de fuera para atarlo a ese régimen.',
        'Derivados y compuestos: cuentan solo si designan a personas y conservan el estigma («neonazi», «fachosfera»: sí; «antifascista», «posfranquismo»: no).',
        '«Fascista» es el caso central (Gerchunoff, 2025).',
      ],
    },

    formula: {
      linea: 'P3 = 10 × (R + 0,5·A + 1) / (R + A + D + 2)',
      leyenda: [['R', 'reconocimientos', 'empatica'], ['A', 'críticas ancladas (valen 5)', 'neutra'], ['D', 'deslegitimaciones', 'polariza']],
      explicacion: 'Es la regla de sucesión de Laplace con la crítica anclada en el valor neutro, 5. Con pocos eventos la nota se acerca a 5. P3 se aparta aquí de P2, donde los neutros no entran: en P2 la metáfora neutra no habla del otro; en P3 la crítica anclada sí, y es justo la alternativa a la deslegitimación.',
      tabla: {
        cabecera: ['Discurso', 'D', 'A', 'R', 'P3'],
        filas: [
          ['Ataca por esencias', '6', '2', '0', '2,00'],
          ['Ataca por actos, con un «fascistas»', '1', '20', '0', '4,78'],
          ['Critica por actos y reconoce al otro', '0', '8', '2', '5,83'],
          ['Solo reconoce', '0', '0', '5', '8,57'],
        ],
      },
      minimos: {
        titulo: 'Mínimos y solidez',
        filas: [['Menos de 5 juicios', 'No se puntúa'], ['De 5 a 9', 'Orientativa'], ['10 o más', 'Sólida']],
        nota: 'Se cuentan los juicios sobre el otro: D + A + R. Los umbrales son una hipótesis calibrable con el corpus.',
      },
    },

    ficha: {
      intro: 'Cada análisis publica:',
      items: [
        'Los recuentos de D (por subtipo), A, R y N, el cálculo, la nota y la solidez.',
        'La lista completa de eventos D, siempre, con la cita literal y el subtipo, aunque la nota salga alta.',
        'La lista de eventos R.',
        'La proporción de esencia, D / (D + A), y la densidad de D por mil palabras. Son datos descriptivos y no cambian la nota.',
        'El porcentaje de oraciones compartidas con otros parámetros, las ironías codificadas con su porqué y el género del discurso.',
        'Las críticas ancladas que un verificador IFCN haya desmentido, señaladas como tales.',
      ],
      aviso: 'El IRA no verifica las acusaciones. Una crítica anclada es neutra por cómo se formula, no porque sea cierta.',
    },

    casos: {
      cabecera: ['Caso', 'Resolución', 'Por qué'],
      filas: [
        ['«Unas derechas lacayas» (Sánchez, Barcelona)', 'D1', 'Insulto lexicalizado. Sale de P2', 'polariza'],
        ['«La derecha rendida a esos postulados reaccionarios» (Sánchez, Barcelona)', 'D1 + N', 'El diccionario recoge «rendido» como sumiso: juicio literal. «Reaccionarios» califica ideas', 'polariza'],
        ['«Que no os engañen» (Sánchez, Barcelona)', 'D5', 'Acusación de engaño sin acto identificable. La interpelación va a P1', 'polariza'],
        ['«Todo es culpa del Gobierno»', 'D6', 'El agente está acotado, pero «todo» es extensión', 'polariza'],
        ['«El Gobierno es responsable de esta ley»', 'A', 'Acto identificable, agente acotado', 'neutra'],
        ['«Es incapaz de resolver la vivienda»', 'A', 'Capacidad atada a una gestión', 'neutra'],
        ['«Son unos inútiles»', 'D1', 'Rasgo suelto', 'polariza'],
        ['«El gobierno de X está cometiendo un genocidio»', 'A', 'Conducta acotada', 'neutra'],
        ['«Los X son genocidas»', 'D3', 'Etiqueta sobre un grupo', 'polariza'],
        ['«Los chavistas ganaron la elección»', 'N', 'Designa al propio movimiento', 'neutra'],
        ['«Son unos bolivarianos», dicho de un partido ajeno', 'D4', 'Ata al blanco a un régimen', 'polariza'],
        ['«Traidores a España»', 'D2', 'Sanción moral. «Antiespañoles» niega la pertenencia y es P1', 'polariza'],
        ['«Gobierno ilegítimo»', 'P1', 'La legitimidad es pertenencia', 'otro'],
        ['«Ese delincuente», con la condena citada al lado', 'A', 'Etiqueta con su ancla', 'neutra'],
        ['«Los que les votan son unos ignorantes»', 'D1', 'Los votantes nunca son agente acotado', 'polariza'],
        ['«Vienen a robar»', 'D5', 'Generalización habitual sobre un grupo', 'polariza'],
        ['«Todos son iguales»', 'P1', 'Bloque homogéneo, sin juicio', 'otro'],
        ['«Todos son igual de corruptos»', 'P1 + D2', '«Todos» va a P1; «corruptos», a P3', 'polariza'],
        ['«No son traidores»', 'R3', 'Niega un juicio moral. «No son enemigos» niega la frontera: P1', 'empatica'],
        ['«Es honrado, pero un inútil»', 'R1 + D1', 'Dos signos sobre el mismo blanco', 'otro'],
        ['«Con todo el respeto, su señoría...»', 'Sin evento', 'Cortesía de fórmula, sin evaluación', 'otro'],
        ['«Nos llamaron ratas»', 'Sin evento', 'No es juicio del hablante', 'otro'],
        ['«No diga chorradas»', 'P5', 'Descalifica lo dicho, no a la persona', 'otro'],
        ['«Somos gente honrada»', 'N', 'Autoelogio', 'neutra'],
      ],
      desacuerdoTitulo: 'Dónde se espera más desacuerdo',
      desacuerdo: [
        'Qué cuenta como acto identificable. Se resuelve con la lista de anclas válidas.',
        'Colectivo humano o ideología. «La derecha», «el PP»: humano. «El socialismo», «el liberalismo»: ideología, salvo que se extienda a sus portadores.',
        'Subtipo D1 o D2. No afecta a la nota.',
      ],
    },

    limites: [
      ['Fiabilidad', 'Codificar juicio e incivilidad da acuerdos moderados incluso con codificadores entrenados (α de 0,61 a 0,73 en Coe et al., 2014). Por eso P3 solo codifica juicio explícito y decide con una regla binaria.'],
      ['Dilución', 'Muchas críticas ancladas diluyen un ataque a la esencia. La ficha lo compensa listando siempre cada evento D.'],
      ['Ironía', 'Solo se codifica la clara. Parte de la ironía real se pierde.'],
      ['Juicio evocado', 'Un discurso puede deslegitimar solo contando hechos. P3 no lo ve.'],
      ['La lista de estigma es una convención', 'Es pública y revisable, pero no es neutral por naturaleza.'],
      ['Género', 'La descortesía es la norma en la sesión de control y no en un discurso institucional. Se anota el género y solo se compara dentro del mismo.'],
      ['Polo empático escaso', 'Elogiar al adversario es raro. Pocas notas pasarán de 6.'],
      ['Solo español original', 'No se analizan traducciones.'],
    ],

    validacion: {
      cabecera: ['Prueba', 'Cómo'],
      filas: [
        ['Discursos de prueba', 'Recodificar Sánchez Barcelona 2026 y ONU 2024. Hipótesis: Barcelona por debajo de 5; ONU sin puntuar o cerca de 5.'],
        ['Dilución', 'Publicar P3 con esta fórmula y sin las críticas ancladas, junto a la proporción de esencia.'],
        ['Fiabilidad', 'Tres acuerdos por separado (Krippendorff): ¿hay evento?, signo y subtipo. Objetivo α ≥ 0,80 en los dos primeros; en subtipo basta 0,67. Humano frente a IA.'],
        ['Simetría de la lista', 'Prueba de cobertura: si aparecen etiquetas de estigma de un bloque que no están en la lista, la lista está sesgada.'],
        ['Independencia', 'Correlación de P3 con P1 y P2 dentro de un mismo orador, y casos donde discrepan.'],
      ],
    },

    pendiente: [
      ['Umbrales', 'Los mínimos de 5 y 10 juicios son provisionales hasta calibrar con el corpus.'],
      ['Clasificación por IA', 'Una llamada separada por parámetro y con el orador oculto, para evitar el efecto halo. Se decide con el índice.'],
    ],

    cambios: {
      titulo: 'Manual v0.1 · 9 y 10 de noviembre de 2026',
      decisiones: [
        'Corte acto frente a esencia. La descortesía de estilo es neutra.',
        'El chivo expiatorio es marca observable (D6). Jung y la proyección quedan como marco teórico.',
        'Los juicios de capacidad siguen el criterio del ancla: atados a una gestión, neutros; rasgo suelto, D1.',
        'Solo juicio explícito, más la generalización habitual sobre un grupo.',
        'Etiqueta política de estigma (Bar-Tal): lista cerrada, simétrica, pública y ampliable solo por registro.',
        'Juicio positivo sobre la persona, P3; sobre sus argumentos, P5; humanizar sin evaluar, P1.',
        'El autoelogio es neutro. El positivo solo cuenta si el blanco está fuera del nosotros.',
        'Fórmula con la crítica anclada en 5. La ficha lista siempre cada evento D.',
        '«Genocida» entra en la lista. «Chavista» y «bolivariano» salen: neutras como autodesignación, D4 si se aplican a alguien de fuera.',
        '«Rendida» es D1 por la regla de «lacayas»: el diccionario recoge el sentido y sale de P2.',
        'En P3 la prueba del ancla sustituye a la excepción democrática.',
        'Crítica anclada desmentida: la nota no cambia y la ficha lo señala.',
        'Negar la frontera es P1; negar un juicio moral es P3 (R3).',
        'Orden de prioridad completo entre parámetros: P2, P6, P5, P1, P4, P3. Los casos resueltos mandan sobre el orden.',
      ],
    },

    referencias: REFERENCIAS,
  },

  en: {
    ui: UI_MANUAL.en,
    signos: SIGNOS,
    codigo: 'P3',
    rotulo: 'Methodology 2.0 · P3',
    estado: 'Manual v0.1 · closed on 9 November 2026',
    titulo: 'Judging the other',
    frase: 'What the speech says, literally, about the people and groups outside “us”: whether it judges what they do or what they are.',

    secciones: [
      { id: 'la-idea', titulo: 'The idea' },
      { id: 'que-mide', titulo: 'What it measures and why' },
      { id: 'que-no-mide', titulo: 'What it does not measure' },
      { id: 'procedimiento', titulo: 'How it is coded' },
      { id: 'unidad', titulo: 'The unit' },
      { id: 'prueba', titulo: 'The anchor test' },
      { id: 'codigos', titulo: 'The codes' },
      { id: 'lista', titulo: 'Stigma labels' },
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
      lema: ['Criticizing does not polarize.', 'Turning criticism into identity does.'],
      texto: 'Going from «mintió» (“he lied”) to «es un mentiroso» (“he is a liar”), from «esa ley es injusta» (“that law is unfair”) to «son unos corruptos» (“they are crooks”). The first judgement keeps the other inside the conversation. The second defines them, and once someone has been defined as corrupt, a traitor or a fascist, there is nothing left to argue with them about.',
      tres: [
        { codigo: 'D', nombre: 'Delegitimization', texto: 'A negative judgement about what the other is. Polarizing.' },
        { codigo: 'A', nombre: 'Anchored criticism', texto: 'A negative judgement about an identifiable act. Neutral.' },
        { codigo: 'R', nombre: 'Recognition', texto: 'A positive judgement about the other. Empathetic.' },
      ],
    },

    teoria: {
      items: [
        ['Unit and sign', 'The Judgement system of Appraisal Theory (Martin and White, 2005) evaluates human behaviour in two regions, social esteem (normality, capacity, tenacity) and social sanction (veracity, propriety), with a positive or negative sign. P3’s unit and its empathetic pole come from there.'],
        ['Codes', 'Bar-Tal’s delegitimization strategies (1989, 1990): trait characterization, outcasting, political labels and comparison with a delegitimized group. The fifth, dehumanization, is figurative and belongs to P2.'],
        ['Act versus essence', 'Research separates incivility of tone from the intolerance that denies others moral respect, and only the latter is associated with democratic harm (Rossini, 2022; Muddiman, 2017). P3 does not measure tone. It measures whether the judgement falls on an act or on the person.'],
        ['Place in the index', 'Political sectarianism has three ingredients: othering, aversion and moralization (Finkel et al., 2020). P1 measures the first, P4 the second and P3 the third. That is why they correlate without being redundant.'],
        ['Scapegoating', 'Attributing excessive blame for a negative outcome to a person or group (Rothschild et al., 2012). Shadow projection (Jung) and the need for a clear enemy (Arendt) explain why a moral culprit is sought, but they are not coded: they cannot be observed in the text alone.'],
        ['Agonism', 'Judging acts rather than essences is the literal way of treating the other as an adversary rather than an enemy (Mouffe, 2005).'],
      ],
      cautela: 'P3 claims nothing about the listener’s brain. It is a discursive indicator of a condition that research associates with the breakdown of mutual recognition.',
    },

    noMide: {
      filas: [
        ['Figurative judgement, dehumanization, caricature', '«son ratas» (“they are rats”), «son una plaga» (“they are a plague”)', 'P2'],
        ['Boundary, belonging and legitimacy', '«antiespañoles» (“anti-Spanish”), «gobierno ilegítimo» (“illegitimate government”)', 'P1'],
        ['Direct address itself', 'the «os» (“you”) in «que no os engañen» (“don’t let them fool you”)', 'P1'],
        ['Named emotion', '«me dan asco» (“they disgust me”), «tengo miedo» (“I am afraid”)', 'P4'],
        ['How the other’s arguments are treated', '«no diga chorradas» (“stop talking rubbish”), «en eso tiene razón» (“you are right about that”)', 'P5'],
        ['What is called for', '«hay que echarlos» (“we have to throw them out”)', 'P6'],
        ['Judgement on ideas, laws or problems', '«esa ley es injusta» (“that law is unfair”)', 'Neutral, no event'],
        ['Whether the accusation is true', '', 'IRA does not verify it'],
        ['Tone, vulgarity, volume', '', 'Not coded'],
      ],
      reglas: [
        'Single mark, multiple sentence: each mark goes to one parameter only, but a sentence with two marks can score in two. In «que no os engañen», «os» is P1 and «engañen» (“fool”) is P3. If the same mark fits two parameters, the order is P2, P6, P5, P1, P4, P3, unless the manual has already resolved the case.',
        'The literal rule: if the dictionary already lists the evaluative sense of the word, the judgement is literal and goes to P3 («lacayo», “lackey”; «títere», “puppet”; «marioneta», “marionette”; «rendido», “surrendered”, in the sense of submissive). If the sense is built through an image, it goes to P2.',
      ],
    },

    procedimiento: {
      pasos: [
        ['Extraction by code', ['«Ser» or «estar» (“to be”) + an adjective or noun from the judgement lexicon.', 'Appositions and vocatives («esa banda de...», “that gang of...”; «señores corruptos», “corrupt gentlemen”).', '«Como», «igual que», «lo mismo que» (“like”, “the same as”) + the name of a group or regime.', 'Generalizers: «siempre», «nunca», «todos», «cada vez que» (“always”, “never”, “all”, “every time”).', 'Blame patterns: «por culpa de» (“because of”), «desde que llegaron» (“since they arrived”), «los responsables de todo» (“those responsible for everything”).']],
        ['Human review', 'Events the code missed are added and false ones removed. The lexicon (HurtLex, the Spanish moral foundations dictionary and the stigma list) only proposes; it never decides.'],
        ['Classification in three steps', ['Is there an explicit judgement about a human target that is not “us”? If not, there is no event.', 'Sign? Positive: R. Negative: apply the anchor test. If it passes, A; if not, D.', 'Subtype (D1 to D6, R1 to R3). Descriptive only.']],
        ['Calculation by code', 'AI or the coder classifies; the formula sets the score.'],
      ],
      nota: 'The whole speech is read, including its topic. If the human target comes from the context rather than the sentence, the coder notes why in one line.',
    },

    unidad: {
      definicion: 'The judgement event = sentence + human target + explicit judgement.',
      reglas: [
        'One sentence and one target give a single event per sign, even if it piles up marks («corruptos y traidores», “crooks and traitors”). The scorecard records every subtype.',
        'If the same sentence carries a negative and a positive judgement about the same target («es honrado, pero un inútil», “he is honest, but useless”), there are two events: an R and a D.',
        'Repetitions in different sentences count every time.',
        'Human target: people, groups, political collectives («la derecha», “the right”; «el PP»; «el Gobierno», “the Government”), structures named after people («la casta», “the caste”; «las élites», “the elites”) and ideologies only when they are embodied or extended to their holders.',
        'Not a target: “us” itself (self-praise is neutral), an idea, a law, a problem.',
        'Explicit judgement only. Judgement evoked by narrated facts («se llevaron el dinero», “they took the money”) is treated as an act.',
        'Words quoted from someone else («nos llamaron ratas», “they called us rats”) are not the speaker’s judgement.',
        'Irony and rhetorical questions: only when the intention is clear from context. If in doubt, no.',
      ],
    },

    prueba: {
      intro: 'A negative judgement is neutral (A) if it meets all three conditions. If it fails one, it is D.',
      condiciones: [
        ['Identifiable act or area', 'You can say what and when, or a specific record is named: a date, a law, a vote, a statement, a figure, a decision, a named area of government.'],
        ['Bounded agent', 'A person, a government, a party leadership. Never a people, an ethnic group, a religion or a set of voters.'],
        ['No extension', 'No «siempre» (“always”), «todos» (“all”), «son así» (“that is what they are like”), «todo» (“everything”).'],
      ],
      tabla: {
        cabecera: ['Anchored (A)', 'Unanchored (D)'],
        filas: [
          ['«Ayer mintió sobre las cifras del paro» (“Yesterday he lied about the unemployment figures”)', '«Son unos mentirosos» (“They are liars”), «siempre mienten» (“they always lie”)'],
          ['«Es incapaz de resolver la vivienda» (“He is unable to fix housing”)', '«Son unos inútiles» (“They are useless”)'],
          ['«El Gobierno es responsable de esta ley» (“The Government is responsible for this law”)', '«Todo es culpa del Gobierno» (“Everything is the Government’s fault”)'],
          ['«Compraron esos votos con la amnistía» (“They bought those votes with the amnesty”)', '«Compran votos» (“They buy votes”)'],
          ['«El gobierno de X está cometiendo un genocidio» (“X’s government is committing genocide”)', '«Los X son genocidas» (“The X are genocidal”)'],
        ],
      },
      notas: [
        ['It replaces the democratic exception', 'The exception in P1 and P2 requires violent or anti-democratic conduct. The anchor test applies to any conduct. A label accompanied by its anchor in the same or the next sentence («los terroristas que pusieron la bomba», “the terrorists who planted the bomb”; «ese delincuente», “that criminal”, with the conviction cited) is A.'],
        ['If a fact-checker refutes it, the score does not change', 'The scorecard flags it. In P1 the democratic exception is a privilege and is withdrawn if the accusation is refuted. Here the anchor is the normal criterion of form: it decides how the judgement is phrased, not whether it is true.'],
      ],
    },

    codigos: {
      cabecera: ['Code', 'What it is', 'Examples', 'Sign'],
      filas: [
        ['D1', 'Unanchored character or capacity trait, including lexicalized insults', '«inútiles» (“useless”), «cobardes» (“cowards”), «unas derechas lacayas» (“a lackey right wing”), «títere» (“puppet”), «rendida» (“surrendered”)', 'Polarizing'],
        ['D2', 'Unanchored moral sanction', '«corruptos» (“corrupt”), «traidores» (“traitors”), «mentirosos» (“liars”), «ladrones» (“thieves”)', 'Polarizing'],
        ['D3', 'Political stigma label (closed list)', '«fascistas», «golpistas» (“coup plotters”), «genocidas» (“genocidal”)', 'Polarizing'],
        ['D4', 'Comparison with a delegitimized group or regime', '«como ETA» (“like ETA”), «igual que Maduro» (“just like Maduro”)', 'Polarizing'],
        ['D5', 'Unanchored or generalized accusation', '«que no os engañen» (“don’t let them fool you”), «vienen a robar» (“they come to steal”), «siempre mienten» (“they always lie”)', 'Polarizing'],
        ['D6', 'Scapegoating: negative outcome + human target + total or excessive blame', '«todo es culpa de ellos» (“it is all their fault”), «desde que llegaron no hay trabajo» (“since they arrived there are no jobs”)', 'Polarizing'],
        ['R1', 'Positive judgement about someone outside “us”', '«es una persona honrada» (“she is an honest person”), «ha trabajado mucho por esto» (“he has worked hard for this”)', 'Empathetic'],
        ['R2', 'Good faith, or separating the act from the person', '«no dudo de su intención; critico la ley» (“I do not doubt your intention; I criticize the law”)', 'Empathetic'],
        ['R3', 'Denying a moral judgement, a label or a negative trait', '«no son traidores» (“they are not traitors”), «no son corruptos» (“they are not corrupt”)', 'Empathetic'],
        ['A', 'Anchored criticism', 'see the anchor test', 'Neutral, enters the formula'],
        ['N', 'Other neutral cases: judgement on ideas, position labels, self-praise, stylistic rudeness', '«la ultraderecha» (“the far right”), «esa reforma es un error» (“that reform is a mistake”)', 'Neutral, left out'],
      ],
      nota: 'Every D is worth 1. Every R is worth 1. The subtype does not change the score.',
      reglasTitulo: 'Boundaries of the empathetic pole',
      reglas: [
        ['Only outside “us”', 'A positive judgement is R only if the target is outside “us”.'],
        ['With content', 'R requires an evaluation with content. Formulaic courtesy («con todo el respeto», “with all due respect”; «su señoría», “your honour”) is not R.'],
        ['Denying the judgement, not the boundary', 'Denying a moral judgement («no son traidores», “they are not traitors”) is R3. Denying the boundary («no son enemigos», “they are not enemies”) is P1.'],
        ['What goes to other parameters', 'Humanizing without evaluating (their pain, their family) is P1. Acknowledging a point or an argument is P5.'],
      ],
    },

    lista: {
      intro: 'Labels that tie the other to a regime or to violence. The list is symmetrical (it includes labels used against both sides), public and closed: it is only extended with an entry in the decision log.',
      etiquetas: ['fascista, facha', 'nazi', 'franquista', 'estalinista', 'golpista', 'terrorista', 'filoetarra, proetarra', 'dictador, tirano', 'totalitario', 'genocida', 'neonazi', 'fachosfera'],
      reglas: [
        'Position labels, neutral as designations: ultraderecha (“far right”), extrema izquierda (“far left”), comunista, socialcomunista, populista, independentista (“pro-independence”), sanchismo. They only polarize when an essence judgement is attached.',
        '«Chavista» and «bolivariano» are self-designations in Latin America. They are neutral when they name the movement itself and D4 when applied to an outsider to tie them to that regime.',
        'Derivatives and compounds count only if they name people and keep the stigma («neonazi», «fachosfera», roughly “the fascist sphere”: yes; «antifascista», «posfranquismo», “post-Francoism”: no).',
        '«Fascista» is the central case (Gerchunoff, 2025).',
      ],
    },

    formula: {
      linea: 'P3 = 10 × (R + 0.5·A + 1) / (R + A + D + 2)',
      leyenda: [['R', 'recognitions', 'empatica'], ['A', 'anchored criticisms (worth 5)', 'neutra'], ['D', 'delegitimizations', 'polariza']],
      explicacion: 'It is Laplace’s rule of succession with anchored criticism at the neutral value, 5. With few events the score moves towards 5. Here P3 departs from P2, where neutral events are left out: in P2 a neutral metaphor says nothing about the other; in P3 anchored criticism does, and it is precisely the alternative to delegitimization.',
      tabla: {
        cabecera: ['Speech', 'D', 'A', 'R', 'P3'],
        filas: [
          ['Attacks essences', '6', '2', '0', '2.00'],
          ['Attacks acts, with one «fascistas»', '1', '20', '0', '4.78'],
          ['Criticizes acts and recognizes the other', '0', '8', '2', '5.83'],
          ['Only recognizes', '0', '0', '5', '8.57'],
        ],
      },
      minimos: {
        titulo: 'Minimums and robustness',
        filas: [['Fewer than 5 judgements', 'Not scored'], ['5 to 9', 'Indicative'], ['10 or more', 'Robust']],
        nota: 'Judgements about the other are counted: D + A + R. The thresholds are a hypothesis to be calibrated with the corpus.',
      },
    },

    ficha: {
      intro: 'Each analysis publishes:',
      items: [
        'The counts of D (by subtype), A, R and N, the calculation, the score and its robustness.',
        'The full list of D events, always, with the literal quote and the subtype, even when the score is high.',
        'The list of R events.',
        'The essence ratio, D / (D + A), and the density of D per thousand words. They are descriptive and do not change the score.',
        'The share of sentences shared with other parameters, the coded ironies with their reasons and the genre of the speech.',
        'Anchored criticisms refuted by an IFCN fact-checker, flagged as such.',
      ],
      aviso: 'IRA does not verify accusations. An anchored criticism is neutral because of how it is phrased, not because it is true.',
    },

    casos: {
      cabecera: ['Case', 'Resolution', 'Why'],
      filas: [
        ['«Unas derechas lacayas» (“a lackey right wing”; Sánchez, Barcelona)', 'D1', 'Lexicalized insult. Leaves P2', 'polariza'],
        ['«La derecha rendida a esos postulados reaccionarios» (“the right, surrendered to those reactionary tenets”; Sánchez, Barcelona)', 'D1 + N', 'The dictionary lists «rendido» as submissive: literal judgement. «Reaccionarios» qualifies ideas', 'polariza'],
        ['«Que no os engañen» (“don’t let them fool you”; Sánchez, Barcelona)', 'D5', 'Accusation of deceit with no identifiable act. The direct address goes to P1', 'polariza'],
        ['«Todo es culpa del Gobierno» (“everything is the Government’s fault”)', 'D6', 'The agent is bounded, but «todo» is extension', 'polariza'],
        ['«El Gobierno es responsable de esta ley» (“the Government is responsible for this law”)', 'A', 'Identifiable act, bounded agent', 'neutra'],
        ['«Es incapaz de resolver la vivienda» (“he is unable to fix housing”)', 'A', 'Capacity tied to a record', 'neutra'],
        ['«Son unos inútiles» (“they are useless”)', 'D1', 'Free-floating trait', 'polariza'],
        ['«El gobierno de X está cometiendo un genocidio» (“X’s government is committing genocide”)', 'A', 'Bounded conduct', 'neutra'],
        ['«Los X son genocidas» (“the X are genocidal”)', 'D3', 'Label applied to a group', 'polariza'],
        ['«Los chavistas ganaron la elección» (“the chavistas won the election”)', 'N', 'Names the movement itself', 'neutra'],
        ['«Son unos bolivarianos» (“they are bolivarians”), said of an unrelated party', 'D4', 'Ties the target to a regime', 'polariza'],
        ['«Traidores a España» (“traitors to Spain”)', 'D2', 'Moral sanction. «Antiespañoles» (“anti-Spanish”) denies belonging and is P1', 'polariza'],
        ['«Gobierno ilegítimo» (“illegitimate government”)', 'P1', 'Legitimacy is belonging', 'otro'],
        ['«Ese delincuente» (“that criminal”), with the conviction cited', 'A', 'Label with its anchor', 'neutra'],
        ['«Los que les votan son unos ignorantes» (“those who vote for them are ignorant”)', 'D1', 'Voters are never a bounded agent', 'polariza'],
        ['«Vienen a robar» (“they come to steal”)', 'D5', 'Habitual generalization about a group', 'polariza'],
        ['«Todos son iguales» (“they are all the same”)', 'P1', 'Homogeneous block, no judgement', 'otro'],
        ['«Todos son igual de corruptos» (“they are all equally corrupt”)', 'P1 + D2', '«Todos» goes to P1; «corruptos», to P3', 'polariza'],
        ['«No son traidores» (“they are not traitors”)', 'R3', 'Denies a moral judgement. «No son enemigos» (“they are not enemies”) denies the boundary: P1', 'empatica'],
        ['«Es honrado, pero un inútil» (“he is honest, but useless”)', 'R1 + D1', 'Two signs about the same target', 'otro'],
        ['«Con todo el respeto, su señoría...» (“With all due respect, your honour...”)', 'No event', 'Formulaic courtesy, no evaluation', 'otro'],
        ['«Nos llamaron ratas» (“they called us rats”)', 'No event', 'Not the speaker’s judgement', 'otro'],
        ['«No diga chorradas» (“stop talking rubbish”)', 'P5', 'Dismisses what was said, not the person', 'otro'],
        ['«Somos gente honrada» (“we are honest people”)', 'N', 'Self-praise', 'neutra'],
      ],
      desacuerdoTitulo: 'Where most disagreement is expected',
      desacuerdo: [
        'What counts as an identifiable act. Resolved with the list of valid anchors.',
        'Human collective or ideology. «La derecha» (“the right”), «el PP»: human. «El socialismo», «el liberalismo»: ideology, unless extended to its holders.',
        'Subtype D1 or D2. It does not affect the score.',
      ],
    },

    limites: [
      ['Reliability', 'Coding judgement and incivility yields moderate agreement even with trained coders (α from 0.61 to 0.73 in Coe et al., 2014). That is why P3 only codes explicit judgement and decides with a binary rule.'],
      ['Dilution', 'Many anchored criticisms dilute an attack on essence. The scorecard compensates by always listing every D event.'],
      ['Irony', 'Only clear irony is coded. Some real irony is lost.'],
      ['Evoked judgement', 'A speech can delegitimize just by recounting facts. P3 does not see it.'],
      ['The stigma list is a convention', 'It is public and revisable, but not neutral by nature.'],
      ['Genre', 'Rudeness is the norm in parliamentary question time and not in an institutional speech. The genre is recorded and comparisons are made only within the same genre.'],
      ['A thin empathetic pole', 'Praising the adversary is rare. Few scores will go above 6.'],
      ['Original Spanish only', 'Translations are not analysed.'],
    ],

    validacion: {
      cabecera: ['Test', 'How'],
      filas: [
        ['Test speeches', 'Recode Sánchez Barcelona 2026 and UN 2024. Hypothesis: Barcelona below 5; UN unscored or close to 5.'],
        ['Dilution', 'Publish P3 with this formula and without anchored criticisms, alongside the essence ratio.'],
        ['Reliability', 'Three separate agreements (Krippendorff): is there an event?, sign and subtype. Target α ≥ 0.80 for the first two; 0.67 is enough for subtype. Human versus AI.'],
        ['Symmetry of the list', 'Coverage test: if stigma labels from one bloc appear that are not on the list, the list is biased.'],
        ['Independence', 'Correlation of P3 with P1 and P2 within the same speaker, and cases where they diverge.'],
      ],
    },

    pendiente: [
      ['Thresholds', 'The minimums of 5 and 10 judgements are provisional until calibrated with the corpus.'],
      ['AI classification', 'A separate call per parameter with the speaker hidden, to avoid the halo effect. To be decided with the index.'],
    ],

    cambios: {
      titulo: 'Manual v0.1 · 9 and 10 November 2026',
      decisiones: [
        'Act versus essence. Stylistic rudeness is neutral.',
        'Scapegoating is an observable mark (D6). Jung and projection remain the theoretical frame.',
        'Capacity judgements follow the anchor criterion: tied to a record, neutral; free-floating trait, D1.',
        'Explicit judgement only, plus habitual generalization about a group.',
        'Political stigma label (Bar-Tal): a closed, symmetrical, public list, extended only through the log.',
        'Positive judgement about the person, P3; about their arguments, P5; humanizing without evaluating, P1.',
        'Self-praise is neutral. A positive judgement only counts if the target is outside “us”.',
        'Formula with anchored criticism at 5. The scorecard always lists every D event.',
        '«Genocida» joins the list. «Chavista» and «bolivariano» leave it: neutral as self-designations, D4 if applied to an outsider.',
        '«Rendida» (“surrendered”) is D1 under the «lacayas» rule: the dictionary lists the sense, so it leaves P2.',
        'In P3 the anchor test replaces the democratic exception.',
        'Refuted anchored criticism: the score does not change and the scorecard flags it.',
        'Denying the boundary is P1; denying a moral judgement is P3 (R3).',
        'Full priority order between parameters: P2, P6, P5, P1, P4, P3. Resolved cases take precedence over the order.',
      ],
    },

    referencias: REFERENCIAS,
  },
};
