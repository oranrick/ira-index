// IRA · Metodología 2.0 · textos compartidos por el índice y las páginas de parámetro.
// Español primero; la traducción al inglés está pendiente de revisión del autor.

export const REPO_RESEARCH = 'https://github.com/oranrick/ira-index/tree/main/research';

export const AVISO = {
  es: {
    rotulo: 'Metodología 2.0 · en desarrollo',
    texto: 'Estamos rediseñando el IRA parámetro a parámetro para que cada puntuación pueda explicarse frase a frase. Las puntuaciones que ves hoy en la web todavía se calculan con la versión anterior. Publicamos cada parámetro cuando su manual está cerrado.',
  },
  en: {
    rotulo: 'Methodology 2.0 · in development',
    texto: 'We are redesigning the IRA one parameter at a time so that every score can be explained sentence by sentence. The scores you see on the site today are still calculated with the previous version. We publish each parameter once its manual is closed.',
  },
};

// Índice de parámetros. Solo P1 tiene página; el resto conserva su nombre actual.
export const PARAMETROS = {
  es: [
    { id: 'p1', codigo: 'P1', nombre: 'La frontera del nosotros', definicion: 'Dónde traza el discurso la línea entre «nosotros» y «ellos», y si esa línea es un muro o una puerta.', ruta: '/metodologia/p1' },
    { id: 'p2', codigo: 'P2', nombre: 'Marco metafórico' },
    { id: 'p3', codigo: 'P3', nombre: 'Polaridad moral' },
    { id: 'p4', codigo: 'P4', nombre: 'Tono emocional' },
    { id: 'p5', codigo: 'P5', nombre: 'Apertura al disenso' },
    { id: 'p6', codigo: 'P6', nombre: 'Llamada a la acción' },
    { id: 'p7', codigo: 'P7', nombre: 'Engagement dialógico' },
    { id: 'p8', codigo: 'P8', nombre: 'Por definir' },
  ],
  en: [
    { id: 'p1', codigo: 'P1', nombre: 'The boundary of "us"', definicion: 'Where the speech draws the line between "us" and "them", and whether that line is a wall or a door.', ruta: '/metodologia/p1' },
    { id: 'p2', codigo: 'P2', nombre: 'Metaphorical frame' },
    { id: 'p3', codigo: 'P3', nombre: 'Moral polarity' },
    { id: 'p4', codigo: 'P4', nombre: 'Emotional tone' },
    { id: 'p5', codigo: 'P5', nombre: 'Openness to dissent' },
    { id: 'p6', codigo: 'P6', nombre: 'Call to action' },
    { id: 'p7', codigo: 'P7', nombre: 'Dialogic engagement' },
    { id: 'p8', codigo: 'P8', nombre: 'To be defined' },
  ],
};
