// IRA · Campaña de las elecciones generales del 29 de noviembre de 2026 (29-N).
// Se mide solo con P1 (frontera del nosotros) y P2 (marco metafórico) de la Metodología 2.0.
// Cada análisis guarda la transcripción completa y su codificación para recalcularlo cuando
// cierre la 2.0 (P3 a P7).
//
// Criterio de candidaturas: las cuatro fuerzas más votadas en las generales de 2023
// (PP, PSOE, Vox y Sumar, hoy Frente Amplio). Misma cuota para todas.

export const CAMPANA = {
  id: '29n',
  votacion: '2026-11-29',
  inicio: '2026-11-13',
  fin: '2026-11-27',
  reflexion: '2026-11-28',
};

// Orden alfabético por apellido: ningún orden de mérito.
// Fotos: las cuatro con el mismo recorte cuadrado (la cara a la misma escala) y en blanco y
// negro por CSS, para que ninguna parezca más cercana o más oficial que otra.
// credito: fuente de la foto, cuando se sepa.
export const CANDIDATURAS = [
  { id: 'abascal', nombre: 'Santiago Abascal', formacion: 'Vox', entidad: null, foto: '/images/campana/abascal.jpg', credito: null },
  { id: 'colau', nombre: 'Ada Colau', formacion: 'Frente Amplio', entidad: null, foto: '/images/campana/colau.jpg', credito: null },
  { id: 'feijoo', nombre: 'Alberto Núñez Feijóo', formacion: 'Partido Popular', entidad: null, foto: '/images/campana/feijoo.jpg', credito: null },
  { id: 'sanchez-29n', nombre: 'Pedro Sánchez', formacion: 'PSOE', entidad: 'sanchez', foto: '/images/campana/sanchez.jpg', credito: null },
];

// Un registro por pieza analizada. Vacío hasta el primer mitin.
// { id, candidatura, tipo: 'mitin' | 'debate' | 'entrevista', fecha, lugar, titulo, fuente,
//   palabras, p1, p2, eventosP2: { e, p, n }, fragmentos: [{ frase, p1?, p2? }] }
export const PIEZAS = [];

export const REGLAS = {
  es: [
    { titulo: 'Misma cuota', texto: 'Un mitin por semana de cada candidatura, elegido con el mismo criterio: el acto central del fin de semana.' },
    { titulo: 'Misma pieza', texto: 'Mitin con mitin, debate con debate. Siempre la transcripción completa, nunca fragmentos sueltos.' },
    { titulo: 'Se publica todo', texto: 'Todo lo que se analiza se publica, cuadre o no con lo que se esperaba.' },
    { titulo: 'Método a la vista', texto: 'Cada ficha dice con qué versión de cada parámetro se calculó y enseña las frases que suman o restan.' },
  ],
};
