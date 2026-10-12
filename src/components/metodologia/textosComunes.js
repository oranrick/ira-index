// IRA · Metodología 2.0 · textos compartidos por el índice y las páginas de parámetro.
// Solo en español: los códigos y ejemplos de cada parámetro dependen de la gramática española
// (pronombres, desinencias, clíticos) y no tienen el mismo sentido traducidos.

// Única frase en inglés de la sección: se muestra si la web está en inglés.
export const SOLO_ES = 'This section is only available in Spanish: its codes and examples depend on Spanish grammar (pronouns, verb endings, clitics) and do not carry the same meaning in translation.';

export const REPO_RESEARCH = 'https://github.com/oranrick/ira-index/tree/main/research';

export const AVISO = {
  es: {
    rotulo: 'Metodología 2.0 · en desarrollo',
    texto: 'Estamos rediseñando el IRA parámetro a parámetro para que cada puntuación pueda explicarse frase a frase. Las puntuaciones que ves hoy en la web todavía se calculan con la versión anterior. Publicamos cada parámetro cuando su manual está cerrado.',
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
};
