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
// Se guardan los RECUENTOS, no las notas: las notas y sus márgenes los calcula src/lib/margen.js.
// La nota de campaña de cada candidatura junta los eventos de todas sus piezas (no promedia notas).
// {
//   id, candidatura, tipo: 'mitin' | 'debate', fecha: 'AAAA-MM-DD', lugar, titulo, fuente (URL de la
//   transcripción o del vídeo), palabras,
//   p1: { U, G, GC, I, C, A, Cp },   // P1 v1.1: alcance (U, G, GC), interpelación (I, C), permeabilidad (A, Cp)
//   p2: { E, P, N },                 // P2 v1.0: empáticas, que polarizan, neutras
//   frases: [{ texto, parametro: 'P1' | 'P2', signo: 'abre' | 'cierra' }],  // las que suman o restan
// }
// En un debate a cuatro se crea una pieza por candidatura, con solo sus intervenciones.
export const PIEZAS = [];

export const REGLAS = {
  es: [
    { titulo: 'Misma cuota', texto: 'El mitin central de cada fin de semana de cada candidatura y los debates en los que estén las cuatro. En un debate, cada candidatura se mide solo con sus intervenciones.' },
    { titulo: 'Misma pieza', texto: 'Mitin con mitin, debate con debate. Siempre la transcripción completa, nunca fragmentos sueltos.' },
    { titulo: 'Se publica todo', texto: 'Todo lo que se analiza se publica, cuadre o no con lo que se esperaba.' },
    { titulo: 'Método a la vista', texto: 'Cada ficha dice con qué versión de cada parámetro se calculó (P1 v1.1, P2 v1.0) y enseña las frases que suman o restan.' },
    { titulo: 'Cada número, con su margen', texto: 'Las notas van con el rango donde caen con 4 de cada 5 probabilidades. Si dos márgenes se solapan, no hay diferencia clara. Nadie se ordena de mayor a menor.' },
  ],
};
