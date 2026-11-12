// IRA · Metodología 2.0 · textos compartidos por el índice y las páginas de parámetro.
// Bilingüe: el inglés es una capa de lectura. Los códigos se aplican siempre al texto original en
// español (pronombres, desinencias, clíticos); en inglés los ejemplos se dejan en español con una
// traducción de referencia al lado.

// Aviso que abre cada página de la sección cuando la web está en inglés.
export const NOTA_EN = 'IRA analyses speeches in their original Spanish. Examples are kept in Spanish and followed by a reference translation. Some features the codes rely on do not survive translation: Spanish often drops the subject pronoun (the “we” lives in the verb ending, as in «queremos», “we want”), distinguishes informal «vosotros» from formal «ustedes» (both “you” in English) and marks gender («nosotras»).';

export const REPO_RESEARCH = 'https://github.com/oranrick/ira-index/tree/main/research';

export const AVISO = {
  es: {
    rotulo: 'Metodología 2.0 · en desarrollo',
    texto: 'Estamos rediseñando IRA parámetro a parámetro para que cada puntuación pueda explicarse frase a frase. Las notas del archivo se calcularon con la metodología de 2024; la campaña del 29-N se mide solo con P1 y P2. Los parámetros en desarrollo se publican como borrador y pueden cambiar.',
  },
  en: {
    rotulo: 'Methodology 2.0 · in development',
    texto: 'We are redesigning IRA parameter by parameter so that every score can be explained sentence by sentence. The scores in the archive were calculated with the 2024 methodology; coverage of Spain’s 29 November general election (29-N) uses only P1 and P2. Parameters in development are published as drafts and may change.',
  },
};

// Textos de los controles de las piezas (mandos de recorrido, pistas)
export const UI_JUEGO = {
  es: {
    anterior: 'Anterior', siguiente: 'Siguiente', recorrer: 'Recorrer', pausa: 'Pausa', ir: (k) => `Ir al ${k}`, ejemplos: 'Ejemplos',
    teclas: 'También con las flechas del teclado',
    deslizar: 'Desliza el diagrama para cambiar de frase',
  },
  en: {
    anterior: 'Previous', siguiente: 'Next', recorrer: 'Play through', pausa: 'Pause', ir: (k) => `Go to ${k}`, ejemplos: 'Examples',
    teclas: 'You can also use the arrow keys',
    deslizar: 'Swipe the diagram to change sentence',
  },
};

// Índice de parámetros. P1, P2, P3, P5 y P6 (manuales cerrados) tienen página; el resto conserva su nombre actual.
export const PARAMETROS = {
  es: [
    { id: 'p1', codigo: 'P1', nombre: 'La frontera del nosotros', definicion: 'Dónde traza el discurso la línea entre «nosotros» y «ellos», y si esa línea es un muro o una puerta.', ruta: '/metodologia/p1', estado: 'Manual v1.1' },
    { id: 'p2', codigo: 'P2', nombre: 'El marco metafórico', definicion: 'Con qué imágenes piensa el discurso el conflicto y contra quién apuntan: el dominio no decide, decide el blanco.', ruta: '/metodologia/p2', estado: 'Manual v1.0' },
    { id: 'p3', codigo: 'P3', nombre: 'El juicio sobre el otro', definicion: 'Qué dice el discurso, en sentido literal, de quienes no son el nosotros: si juzga lo que hacen o lo que son.', ruta: '/metodologia/p3', estado: 'Manual v0.1' },
    { id: 'p4', codigo: 'P4', nombre: 'Tono emocional' },
    { id: 'p5', codigo: 'P5', nombre: 'La palabra del otro', definicion: 'Qué hace el discurso con lo que dice quien piensa distinto: lo escucha, lo responde o lo anula.', ruta: '/metodologia/p5', estado: 'Manual v0.1' },
    { id: 'p6', codigo: 'P6', nombre: 'Lo que pide hacer', definicion: 'Qué acción pone el discurso sobre la mesa, sobre quién recae y si deja sitio al otro después.', ruta: '/metodologia/p6', estado: 'Manual v0.1' },
    { id: 'p7', codigo: 'P7', nombre: 'Coherencia afectiva' },
    { id: 'p8', codigo: 'P8', nombre: 'Por definir' },
  ],
  en: [
    { id: 'p1', codigo: 'P1', nombre: 'The boundary of “us”', definicion: 'Where the speech draws the line between “us” and “them”, and whether that line is a wall or a door.', ruta: '/metodologia/p1', estado: 'Manual v1.1' },
    { id: 'p2', codigo: 'P2', nombre: 'The metaphorical frame', definicion: 'Which images the speech uses to think about conflict, and who they are aimed at: the domain does not decide, the target does.', ruta: '/metodologia/p2', estado: 'Manual v1.0' },
    { id: 'p3', codigo: 'P3', nombre: 'Judging the other', definicion: 'What the speech says, literally, about those outside “us”: whether it judges what they do or what they are.', ruta: '/metodologia/p3', estado: 'Manual v0.1' },
    { id: 'p4', codigo: 'P4', nombre: 'Emotional tone' },
    { id: 'p5', codigo: 'P5', nombre: 'The other’s word', definicion: 'What the speech does with what people who think differently say: it listens, it answers or it cancels.', ruta: '/metodologia/p5', estado: 'Manual v0.1' },
    { id: 'p6', codigo: 'P6', nombre: 'What it calls for', definicion: 'Which action the speech puts on the table, who it falls on and whether it leaves room for the other afterwards.', ruta: '/metodologia/p6', estado: 'Manual v0.1' },
    { id: 'p7', codigo: 'P7', nombre: 'Affective coherence' },
    { id: 'p8', codigo: 'P8', nombre: 'To be defined' },
  ],
};

// Textos fijos de las páginas de manual cerrado (P3, P5, P6: MetodologiaManual.jsx)
export const UI_MANUAL = {
  es: {
    volver: '← Metodología 2.0',
    volverIndice: 'Volver al índice',
    indice: 'En esta página',
    indiceDesplegar: 'Índice de la página',
    navPie: 'Navegación entre parámetros',
    cautela: 'Cautela',
    pendiente: 'Pendiente',
    motor: 'Manual cerrado. Todavía no puntúa en la web: el archivo usa el método de 2024 y la campaña del 29-N mide solo P1 y P2.',
    referenciasNota: 'Tomadas del dossier de literatura verificada. Las marcadas [por verificar] no están confirmadas del todo.',
    manual: 'Leer el manual completo en GitHub',
    nuevaPestana: '(se abre en una pestaña nueva)',
  },
  en: {
    volver: '← Methodology 2.0',
    volverIndice: 'Back to the index',
    indice: 'On this page',
    indiceDesplegar: 'Page contents',
    navPie: 'Navigation between parameters',
    cautela: 'Caution',
    pendiente: 'Pending',
    motor: 'Closed manual. It does not score anything on the site yet: the archive uses the 2024 method and 29-N coverage measures only P1 and P2.',
    referenciasNota: 'Taken from the verified literature dossier. Entries marked [to be verified] are not fully confirmed.',
    manual: 'Read the full manual on GitHub (in Spanish)',
    nuevaPestana: '(opens in a new tab)',
  },
};
