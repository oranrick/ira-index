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

// Índice de parámetros. P1 (manual cerrado) y P2 (borrador) tienen página; el resto conserva su nombre actual.
export const PARAMETROS = {
  es: [
    { id: 'p1', codigo: 'P1', nombre: 'La frontera del nosotros', definicion: 'Dónde traza el discurso la línea entre «nosotros» y «ellos», y si esa línea es un muro o una puerta.', ruta: '/metodologia/p1', estado: 'Manual v1.1' },
    { id: 'p2', codigo: 'P2', nombre: 'El marco metafórico', definicion: 'Con qué imágenes piensa el discurso el conflicto y contra quién apuntan: el dominio no decide, decide el blanco.', ruta: '/metodologia/p2', estado: 'Borrador v0.1 · en desarrollo', borrador: true },
    { id: 'p3', codigo: 'P3', nombre: 'Polaridad moral' },
    { id: 'p4', codigo: 'P4', nombre: 'Tono emocional' },
    { id: 'p5', codigo: 'P5', nombre: 'Apertura al disenso' },
    { id: 'p6', codigo: 'P6', nombre: 'Llamada a la acción' },
    { id: 'p7', codigo: 'P7', nombre: 'Coherencia afectiva' },
    { id: 'p8', codigo: 'P8', nombre: 'Por definir' },
  ],
  en: [
    { id: 'p1', codigo: 'P1', nombre: 'The boundary of “us”', definicion: 'Where the speech draws the line between “us” and “them”, and whether that line is a wall or a door.', ruta: '/metodologia/p1', estado: 'Manual v1.1' },
    { id: 'p2', codigo: 'P2', nombre: 'The metaphorical frame', definicion: 'Which images the speech uses to think about conflict, and who they are aimed at: the domain does not decide, the target does.', ruta: '/metodologia/p2', estado: 'Draft v0.1 · in development', borrador: true },
    { id: 'p3', codigo: 'P3', nombre: 'Moral polarity' },
    { id: 'p4', codigo: 'P4', nombre: 'Emotional tone' },
    { id: 'p5', codigo: 'P5', nombre: 'Openness to dissent' },
    { id: 'p6', codigo: 'P6', nombre: 'Call to action' },
    { id: 'p7', codigo: 'P7', nombre: 'Affective coherence' },
    { id: 'p8', codigo: 'P8', nombre: 'To be defined' },
  ],
};
