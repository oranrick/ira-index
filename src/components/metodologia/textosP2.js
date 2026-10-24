// IRA · Metodología 2.0 · P2 El marco metafórico · textos de la página (SIMULACIÓN).
// Fuente: research/manual/P2.md (borrador v0.1). Aquí solo se resume y se adapta el tono:
// no se añaden reglas que no estén en el manual. Lo pendiente se marca como tal.

const REFERENCIAS = [
  'Charteris-Black, J. (2004). Corpus approaches to critical metaphor analysis. Palgrave Macmillan.',
  'Esposito, R. (2002). Immunitas: protezione e negazione della vita. Einaudi.',
  'Esposito, R. (2004). Bíos: biopolitica e filosofia. Einaudi.',
  'Gallese, V., y Lakoff, G. (2005). The brain\'s concepts: The role of the sensory-motor system in conceptual knowledge. Cognitive Neuropsychology, 22(3–4), 455–479.',
  'Klemperer, V. (1947). LTI: Notizbuch eines Philologen. Aufbau.',
  'Lakoff, G. (1996). Moral politics. University of Chicago Press.',
  'Lakoff, G., y Johnson, M. (1980). Metaphors we live by. University of Chicago Press.',
  'Mouffe, C. (2005). On the political. Routledge.',
  'Musolff, A. (2010). Metaphor, nation and the Holocaust: The concept of the body politic. Routledge.',
  'Sontag, S. (1978). Illness as metaphor. Farrar, Straus and Giroux.',
  'Steen, G. J., Dorst, A. G., Herrmann, J. B., Kaal, A. A., Krennmayr, T., y Pasma, T. (2010). A method for linguistic metaphor identification: From MIP to MIPVU. John Benjamins.',
  'Steen, G. J., Reijnierse, W. G., y Burgers, C. (2014). When do natural language metaphors influence reasoning? A follow-up study to Thibodeau and Boroditsky (2013). PLoS ONE, 9(12), e113536.',
  'Thibodeau, P. H., y Boroditsky, L. (2011). Metaphors we think with: The role of metaphor in reasoning. PLoS ONE, 6(2), e16782.',
];

export const TEXTOS_P2 = {
  es: {
    volverIndice: '← Metodología 2.0',
    rotulo: 'Parámetro 2 · borrador v0.1',
    titulo: 'El marco metafórico',
    frase: 'P2 mide con qué imágenes piensa el discurso el conflicto y contra quién apuntan.',
    lema: ['El dominio no decide.', 'Decide el blanco.'],
    indiceTitulo: 'En esta página',
    indiceDesplegar: 'Ir a una sección',
    enConstruccion: 'En construcción',

    secciones: [
      { id: 'la-idea', titulo: 'La idea' },
      { id: 'apunta', titulo: '¿Contra quién apunta?' },
      { id: 'dos-destinos', titulo: 'Misma imagen, dos destinos' },
      { id: 'por-que-importa', titulo: 'Por qué importa' },
      { id: 'que-mide', titulo: 'Base teórica' },
      { id: 'que-no-mide', titulo: 'Qué no mide P2' },
      { id: 'que-cuenta', titulo: 'Qué cuenta como metáfora' },
      { id: 'unidad', titulo: 'La unidad: el evento' },
      { id: 'dominios', titulo: 'Los dominios' },
      { id: 'regla', titulo: 'La regla, paso a paso' },
      { id: 'casos', titulo: 'Casos resueltos' },
      { id: 'pendiente', titulo: 'Lo que falta' },
      { id: 'cambios', titulo: 'Registro de decisiones' },
      { id: 'referencias', titulo: 'Referencias' },
    ],

    resultados: {
      polariza: { nombre: 'Polariza', texto: 'La imagen apunta a personas y les niega el lugar de rival legítimo.' },
      neutra: { nombre: 'Neutra', texto: 'La imagen apunta a un problema o a una meta, o trata al rival con reglas.' },
      empatica: { nombre: 'Empática', texto: 'La imagen acepta y une: no deja a nadie fuera y construye algo común.' },
    },

    // Pieza principal: ¿contra quién apunta?
    apunta: {
      intro: 'Elige una frase. La flecha sale de la imagen y llega a su blanco; los pasos de la regla deciden el resultado.',
      etiqueta: 'Frases de ejemplo',
      imagen: 'imagen',
      blancos: { alguien: 'alguien', algo: 'algo', nosotros: 'nosotros' },
      blancosNota: { alguien: 'personas o grupos', algo: 'problema, política o meta', nosotros: 'la comunidad, sin excluir' },
      paso1: '¿El blanco es humano?',
      paso2: '¿Conserva las reglas?',
      paso3: '¿Acepta y une?',
      atajo: 'ANI e INM contra personas: no hay paso 2',
      si: 'Sí', no: 'No', noAplica: 'No hace falta',
      dominio: 'Dominio',
      blanco: 'Blanco',
      ejemplos: [
        { dominio: 'GUE', nombreDominio: 'Guerra', frase: '«se comprometió a luchar por él [el porvenir]»', fuente: 'Sánchez, Barcelona 2026', blanco: 'algo', blancoTexto: 'Una meta', p1: false, p2: null, p3: false, resultado: 'neutra', porque: 'La imagen bélica apunta a algo deseado, no a alguien.' },
        { dominio: 'ENF', nombreDominio: 'Enfermedad', frase: '«la ira y el miedo son un virus que recorre nuestra sociedad»', blanco: 'algo', blancoTexto: 'Un problema', p1: false, p2: null, p3: false, resultado: 'neutra', porque: 'Diagnostica sin culpable humano. Diagnosticar no es polarizar.' },
        { dominio: 'DEP', nombreDominio: 'Deporte', frase: '«vamos a ganarle al PP en las urnas»', blanco: 'alguien', blancoTexto: 'Un partido', p1: true, p2: true, p3: false, resultado: 'neutra', porque: 'Apunta a personas, pero conserva las reglas: es un rival, no un enemigo.' },
        { dominio: 'GUE', nombreDominio: 'Guerra', frase: '«vamos a aplastar al PP»', blanco: 'alguien', blancoTexto: 'Un partido', p1: true, p2: false, p3: null, resultado: 'polariza', porque: 'Humillación: ya no se gana al rival, se le destruye.' },
        { dominio: 'ANI', nombreDominio: 'Animal y plaga', frase: '«son una plaga»', blanco: 'alguien', blancoTexto: 'Un grupo', p1: true, p2: 'atajo', p3: null, resultado: 'polariza', porque: 'Llamar plaga a alguien ya le niega ser rival legítimo. No hay forma respetuosa de decirlo.' },
        { dominio: 'CON', nombreDominio: 'Construcción', frase: '«vamos a tejer este país entre todos»', blanco: 'nosotros', blancoTexto: 'Todos', p1: false, p2: null, p3: true, resultado: 'empatica', porque: 'Une y no deja a nadie fuera. No hace falta nombrar al otro.' },
        { dominio: 'CUI', nombreDominio: 'Cuidado', frase: '«tendemos la mano también a quienes no nos votaron»', blanco: 'alguien', blancoTexto: 'Quienes no votaron', p1: true, p2: true, p3: true, resultado: 'empatica', porque: 'Apunta a personas, pero para traerlas dentro: acepta al otro y une.' },
      ],
    },

    // Misma imagen, dos destinos
    destinos: {
      intro: 'Con la rúbrica anterior, «luchar» o «virus» bajaban la nota por sí solos. Ahora la misma imagen puede acabar en sitios opuestos.',
      pares: [
        { dominio: 'GUE', nombre: 'Guerra', a: { frase: '«Esta es una batalla de ideas, y la vamos a ganar con mejores argumentos»', resultado: 'neutra', nota: 'no hay nadie al otro lado' }, b: { frase: '«Esta es una batalla de ideas contra quienes quieren destruir España»', resultado: 'polariza', nota: 'personas presentadas como amenaza' } },
        { dominio: 'ENF', nombre: 'Enfermedad', a: { frase: '«La ira y el miedo son un virus que recorre nuestra sociedad»', resultado: 'neutra', nota: 'el virus es un problema' }, b: { frase: '«…y quienes lo propagan son X»', resultado: 'polariza', nota: 'el virus tiene portadores humanos' } },
        { dominio: 'DEP', nombre: 'Deporte', a: { frase: '«Vamos a ganarle al PP en las urnas»', resultado: 'neutra', nota: 'conserva las reglas' }, b: { frase: '«Vamos a aplastar al PP»', resultado: 'polariza', nota: 'humillación' } },
      ],
    },

    porque: {
      entrada: 'La metáfora no adorna: decide qué problema vemos y qué solución nos parece obvia. Y las más eficaces son las que nadie nota.',
      experimento: {
        titulo: 'El mismo crimen, dos imágenes',
        texto: 'En un experimento clásico, describir el crimen como un virus o como una bestia cambió las soluciones que la gente prefería: prevenir y reformar, o perseguir y encerrar.',
        fuente: 'Thibodeau y Boroditsky, 2011',
        virus: { imagen: 'un virus', solucion: 'prevenir · reformar' },
        bestia: { imagen: 'una bestia', solucion: 'perseguir · encerrar' },
        problema: 'el crimen',
        cautela: 'La réplica de Steen, Reijnierse y Burgers (2014) encontró efectos más débiles. P2 no mide el efecto en la audiencia: mide la imagen que el discurso elige.',
      },
      pasos: [
        { titulo: 'La imagen estructura el pensamiento', texto: 'Pensamos un dominio abstracto (la política) con otro concreto (la guerra, el cuerpo, el camino).', fuentes: 'Lakoff y Johnson, 1980' },
        { titulo: 'Y lo hace sin que se note', texto: 'Las metáforas convencionales actúan antes de la reflexión: el lenguaje «piensa por ti».', fuentes: 'Klemperer, 1947' },
        { titulo: 'El peligro está en el blanco', texto: 'Cuando la imagen convierte a personas en infección o plaga, la comunidad se protege expulsándolas.', fuentes: 'Esposito, 2002 · Musolff, 2010' },
      ],
    },

    teoria: {
      intro: 'P2 se apoya en la lingüística cognitiva, en la historia de la lengua del odio y en la filosofía política de la inmunidad.',
      ui: {
        ayuda: 'Pulsa un autor para ver qué aporta al marco metafórico.',
        referencias: 'Referencias',
        zonas: { cuerpo: 'Cuerpo y mente', lenguaje: 'Lenguaje', politica: 'Política' },
        nodos: [
          { corto: 'Gallese · Lakoff', anios: '2005', zona: 'cuerpo', disciplina: 'Neurociencia y cognición', refs: ['Gallese, V., y Lakoff'] },
          { corto: 'Lakoff · Johnson', anios: '1980', zona: 'lenguaje', disciplina: 'Metáfora conceptual', refs: ['Lakoff, G., y Johnson', 'Lakoff, G. (1996)'] },
          { corto: 'Klemperer', anios: '1947', zona: 'lenguaje', disciplina: 'Filología', refs: ['Klemperer'] },
          { corto: 'Esposito', anios: '2002 · 2004', zona: 'politica', disciplina: 'Filosofía política', refs: ['Esposito'] },
          { corto: 'Musolff', anios: '2010', zona: 'politica', disciplina: 'Análisis crítico de la metáfora', refs: ['Musolff'] },
          { corto: 'Thibodeau · Boroditsky', anios: '2011', zona: 'cuerpo', disciplina: 'Psicología cognitiva', refs: ['Thibodeau', 'Steen, G. J., Reijnierse'] },
        ],
      },
      autores: [
        { autor: 'Gallese y Lakoff (2005)', texto: 'Los conceptos se apoyan en el sistema sensoriomotor: entender «agarrar» reutiliza parte de los circuitos con los que agarramos. Es el puente entre los dos pilares del IRA: la simulación encarnada y la metáfora conceptual.' },
        { autor: 'Lakoff y Johnson (1980); Lakoff (1996)', texto: 'Pensamos lo abstracto con lo concreto: la discusión como guerra, la vida como viaje. En política, la familia es el modelo moral de fondo: el padre estricto frente al padre que cuida.' },
        { autor: 'Klemperer (1947)', texto: 'El filólogo que anotó la lengua del III Reich. Las palabras repetidas actúan como dosis mínimas de veneno: se toman sin notarlo y, con el tiempo, hacen su efecto.' },
        { autor: 'Esposito (2002, 2004)', texto: 'El paradigma inmunitario: la comunidad se protege de lo que percibe como infección, y la protección puede volverse contra la propia vida. De ahí que INM («erradicar», «limpiar») sea el dominio más peligroso.' },
        { autor: 'Musolff (2010)', texto: 'Reconstruye el cuerpo político y la imagen del parásito, del organismo enfermo que debe expulsar lo ajeno. Une a Klemperer con Esposito.' },
        { autor: 'Thibodeau y Boroditsky (2011)', texto: 'La metáfora cambia el razonamiento: el crimen como virus o como bestia lleva a soluciones distintas. La réplica de Steen, Reijnierse y Burgers (2014) encontró efectos más débiles.' },
      ],
      otros: 'También: Sontag (la enfermedad como metáfora), Charteris-Black (análisis crítico de la metáfora), Steen et al. (el procedimiento MIPVU) y Mouffe (agonismo).',
      cautelaTitulo: 'Cautela',
      cautela: 'P2 no mide lo que cada oyente siente. Es un indicador de las imágenes que el discurso pone a su disposición y de hacia quién las dirige.',
    },

    noMide: {
      filas: [
        { fenomeno: 'Dónde se traza la línea nosotros/ellos', destino: ['P1'] },
        { fenomeno: 'Juicio moral literal («corruptos», «traidores»)', destino: ['P3'] },
        { fenomeno: 'Emociones movilizadas', destino: ['P4'] },
        { fenomeno: 'Lo que se pide hacer de verdad (votar, movilizarse, castigar)', destino: ['P6'], nota: 'la línea definitiva, al revisar P6' },
      ],
      reparto: [
        { frase: '«Son una plaga»', destino: 'P2', tipo: 'figurado' },
        { frase: '«Vamos a aplastarlos»', destino: 'P2', tipo: 'figurado' },
        { frase: '«Son unos corruptos»', destino: 'P3', tipo: 'literal' },
        { frase: '«Salgan a votar el domingo»', destino: 'P6', tipo: 'literal' },
      ],
      repartoTitulo: 'Cada frase cae en un solo sitio',
      figurado: 'figurado', literal: 'literal',
      regla: 'Lo figurado va a P2; lo literal, a los demás. Así P2 deja de moverse junto a P3 y P6.',
    },

    cuenta: {
      intro: 'Las metáforas van de vivas a muertas. P2 cuenta las vivas y las convencionales, porque las convencionales son justo las que actúan sin que nadie las note.',
      tramos: [
        { id: 'viva', nombre: 'Viva', ej: '«un tsunami de odio», «son una plaga»', nota: 'se nota, alguien la eligió', cuenta: true },
        { id: 'convencional', nombre: 'Convencional', ej: '«lucha contra el paro», «fractura social», «la derecha rendida»', nota: 'casi no se nota, pero la imagen sigue ahí', cuenta: true },
        { id: 'muerta', nombre: 'Muerta', ej: '«la pata de la mesa», «los precios suben»', nota: 'ya es la palabra normal', cuenta: false },
      ],
      cuentaSi: 'Cuenta', cuentaNo: 'No cuenta',
      eje: ['se nota', 'no se nota'],
      prueba: 'Cómo saber si está muerta: si el diccionario da ese sentido como normal y no se activa ninguna imagen de origen. Es la comparación del MIPVU entre el sentido básico de la palabra y el que tiene en la frase.',
      peso: 'Viva o convencional se anota en la ficha, pero no cambia el peso: todos los eventos valen 1.',
    },

    unidad: {
      definicion: ['una oración', 'un dominio', 'un blanco'],
      igual: '1 evento',
      ejemplos: [
        { frase: '«Es una batalla y no vamos a ceder ni una trinchera ante ellos»', eventos: 1, nota: 'muchas palabras bélicas, un mismo blanco' },
        { frase: '«Combatiremos la pobreza y a quienes la provocan»', eventos: 2, nota: 'un problema y unas personas' },
      ],
      repeticiones: 'Las repeticiones en oraciones distintas cuentan cada vez, como en P1: la insistencia es parte del efecto.',
      eventosRotulo: (n) => (n === 1 ? '1 evento' : `${n} eventos`),
    },

    dominios: {
      intro: 'Lista cerrada. El dominio no decide el resultado, pero sirve para describir el discurso y detectar los dos que nunca pueden ser respetuosos con una persona.',
      lista: [
        { codigo: 'GUE', nombre: 'Guerra y conflicto', ej: 'luchar, batalla, frente, trinchera, rendirse', icono: 'guerra' },
        { codigo: 'DEP', nombre: 'Deporte y competición', ej: 'ganar, remontar, equipo, partido', icono: 'deporte' },
        { codigo: 'ENF', nombre: 'Enfermedad y contagio', ej: 'virus, cáncer, contagio, infectar', icono: 'enfermedad' },
        { codigo: 'INM', nombre: 'Inmunidad y pureza', ej: 'erradicar, limpiar, blindar, purgar', icono: 'inmunidad', siempre: true },
        { codigo: 'ANI', nombre: 'Animal y plaga', ej: 'plaga, ratas, parásito, alimañas', icono: 'animal', siempre: true },
        { codigo: 'CAT', nombre: 'Catástrofe natural', ej: 'oleada, avalancha, tsunami, inundar', icono: 'catastrofe' },
        { codigo: 'REL', nombre: 'Religión', ej: 'cruzada, demonio, pecado, salvación', icono: 'religion' },
        { codigo: 'CON', nombre: 'Construcción', ej: 'construir, cimientos, puentes, tejer', icono: 'construccion' },
        { codigo: 'VIA', nombre: 'Viaje y camino', ej: 'caminar, rumbo, avanzar, horizonte', icono: 'viaje' },
        { codigo: 'FAM', nombre: 'Familia y casa', ej: 'hermanos, casa común, madre patria', icono: 'familia' },
        { codigo: 'CUI', nombre: 'Cuidado y cuerpo', ej: 'abrazar, sanar heridas, tender la mano', icono: 'cuidado' },
        { codigo: 'OTR', nombre: 'Otro', ej: 'si se repite, pasa a la lista', icono: 'otro' },
      ],
      siempre: 'Contra personas, siempre polariza',
      nota: 'ENF e INM van separados: «virus» diagnostica, «erradicar» expulsa. En Esposito, el peligro está en la reacción inmunitaria.',
    },

    regla: {
      blancosTitulo: 'Paso 0 · ¿A qué apunta la imagen?',
      blancosNota: 'La misma tipología que P1, más dos categorías propias de P2.',
      zonas: [
        { id: 'no', nombre: 'No humano', icono: 'circulo', items: [['Un problema', '«la pobreza», «la ira y el miedo»'], ['Una política', '«esta reforma»'], ['Una meta o el futuro', '«luchar por el porvenir»', true], ['El propio nosotros', '«sanar nuestras heridas»', true]] },
        { id: 'depende', nombre: 'Solo si se le da cuerpo', icono: 'interrogante', items: [['Una ideología', '«el neoliberalismo». Humano si se la presenta como agente hostil o se extiende a sus portadores']] },
        { id: 'si', nombre: 'Humano', icono: 'persona', items: [['Personas o grupos', '«ellos», «la derecha»'], ['Personas con nombre de estructura', '«la casta», «las élites»'], ['La casa común', '«los jueces», «las elecciones», si se las deslegitima']] },
      ],
      nuevo: 'nuevo en P2',
      arbolTitulo: 'Los tres pasos',
      p1: '¿El blanco es humano?',
      p2: '¿Conserva las reglas y reconoce al rival?',
      p3: '¿Acepta y une?',
      irA: 'paso',
      atajoTexto: 'contra personas no pasan por aquí: polarizan siempre.',
      senalesTitulo: 'Señales para el paso 2',
      conserva: { titulo: 'Conserva las reglas', items: ['«que gane el mejor»', '«aceptaremos el resultado»', '«les ganaremos en las urnas»'] },
      pierde: { titulo: 'Pierde las reglas', items: [['Humillación', '«aplastarlos», «no dejarles ni respirar»'], ['Árbitro deslegitimado', '«el árbitro está comprado»'], ['Lógica de hinchada', 'el rival como el equipo que se odia'], ['Deriva a guerra', '«esto ya no es un partido, es una guerra»']] },
      intensidad: 'Sin niveles de intensidad: «luchar contra ellos» pesa lo mismo que «son una plaga». Todos los eventos valen 1, como las marcas de P1.',
    },

    casos: {
      cabecera: ['Oración', 'Dominio', 'Blanco', 'Resultado'],
      filas: [
        ['«La ira y el miedo son un virus que recorre nuestra sociedad en su conjunto»', 'ENF', 'Problema', 'neutra'],
        ['«Se comprometió a luchar por él [el porvenir]» (Sánchez, Barcelona 2026)', 'GUE', 'Meta', 'neutra'],
        ['«Esta es una batalla de ideas, y la vamos a ganar con mejores argumentos»', 'GUE', 'Ideología sin cuerpo', 'neutra'],
        ['«Esta es una batalla de ideas contra quienes quieren destruir España»', 'GUE', 'Personas', 'polariza'],
        ['«Vamos a ganarle al PP en las urnas»', 'DEP', 'Personas', 'neutra'],
        ['«Vamos a aplastar al PP»', 'GUE', 'Personas', 'polariza'],
        ['«Vamos a tejer este país entre todos»', 'CON', 'Propio nosotros', 'empatica'],
        ['«Tendemos la mano también a quienes no nos votaron»', 'CUI', 'Personas, incluidas', 'empatica'],
      ],
      porResolverTitulo: 'Por resolver',
      porResolver: [
        '«Vamos a reconstruir lo que ellos han tratado de destruir» (Sánchez, Barcelona 2026): construcción para el nosotros, destrucción atribuida a «ellos».',
        '«La derecha rendida a…» (Sánchez, Barcelona 2026): convencional, bélica, blanco humano.',
      ],
    },

    pendiente: [
      ['Excepción democrática', '¿Se aplica como en P1? «Combatir a los terroristas» tiene blanco humano.'],
      ['Fórmula, mínimos y solidez', 'Cómo pasan los eventos a una nota de 0 a 10, y cuántos hacen falta.'],
      ['Cómo se aplica', 'El léxico de candidatos por dominio (código) y la adaptación del MIPVU (humano).'],
      ['Prueba real', 'Codificar los dos discursos de Sánchez ya transcritos.'],
      ['El discurso anotado y la ficha', 'Las piezas que en P1 enseñan un fragmento real y su cálculo.'],
    ],

    cambios: {
      titulo: 'Borrador v0.1 · 23 y 24 de octubre de 2026',
      decisiones: [
        'El núcleo de P2 es dominio por blanco: el dominio por sí solo no decide si la metáfora polariza.',
        'P2 usa la tipología de blancos de P1, más dos categorías propias: meta o futuro, y el propio nosotros.',
        'Una metáfora con blanco no humano es neutra: diagnosticar no es polarizar.',
        'Cuentan las metáforas vivas y las convencionales; las muertas no.',
        'Unidad: el evento metafórico (oración + dominio + blanco). Las repeticiones cuentan cada vez.',
        'Lista cerrada de 11 dominios más «Otro»; ENF e INM separados; REL incluido.',
        'Regla en dos pasos para todos los dominios: blanco humano y, si lo es, prueba de las reglas del juego.',
        'La metáfora agonista con blanco humano es neutra, no empática.',
        'ANI e INM contra personas siempre polarizan.',
        'Empática solo la metáfora que acepta y une, aunque no mencione al otro.',
        'Reparto con P3 y P6: lo figurado va a P2; lo literal, a los demás.',
        'Sin niveles de intensidad: todos los eventos valen 1.',
      ],
    },

    referencias: REFERENCIAS,
    referenciasNota: 'Referencias por verificar antes de publicar.',
    manual: 'Borrador del manual de P2 en el repositorio',
    pie: { volver: '← Volver al índice', anterior: '← P1 · La frontera del nosotros' },
  },
};
