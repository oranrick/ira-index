// IRA · Metodología 2.0 · textos de las piezas interactivas de P1 (mapa de la frontera,
// cadena del argumento, mapa de la base teórica y la línea de la permeabilidad).
// Las frases de ejemplo y las marcas salen de research/manual/P1.md. Las explicaciones
// breves de «por qué» de cada ejemplo están pendientes de revisión del autor.
// La versión inglesa también está pendiente de revisión.

export const TEXTOS_PIEZAS_P1 = {
  es: {
    frontera: {
      intro: 'Elige una frase del manual y mira dónde coloca al otro: dentro del nosotros, en el umbral o detrás del muro.',
      etiqueta: 'Frases de ejemplo',
      periferia: 'periferia',
      nosotros: 'nosotros',
      elOtro: 'El otro',
      indicador: 'Indicador',
      efecto: 'Efecto',
      posiciones: {
        grupo: 'no aparece: nadie queda fuera',
        muro: 'detrás del muro',
        dentro: 'dentro del nosotros',
        umbral: 'en el umbral de la puerta',
        expulsion: 'fuera de la comunidad',
        excepcion: 'fuera por una conducta concreta',
      },
      ejemplos: [
        { codigo: 'G', tipo: 'incl', modo: 'grupo', corto: 'Grupo sin perdedor', frase: '«en este lugar somos 5.000 personas soñando un mundo mejor»', indicador: 'Alcance', efecto: 'Inclusivo: vale 10', porque: 'Habla a los propios sin invalidar a nadie, así que no levanta ningún muro.' },
        { codigo: 'GC · C1', tipo: 'cierre', modo: 'muro', corto: 'Contraposición', frase: '«la vergüenza para ellos; para nosotros el orgullo»', indicador: 'Alcance y permeabilidad', efecto: 'El nosotros vale 0 y suma un cierre', porque: 'El nosotros se construye frente a un otro identificable: «contra alguien» manda sobre el alcance.' },
        { codigo: 'A3', tipo: 'apertura', modo: 'dentro', corto: 'Pertenencia común con diferencia', frase: '«pensamos distinto, pero también son de aquí»', indicador: 'Permeabilidad', efecto: 'Suma una apertura', porque: 'Reconoce la diferencia y aun así coloca al otro dentro de la casa común.' },
        { codigo: 'A9', tipo: 'apertura', modo: 'umbral', corto: 'Inclusión condicionada', frase: '«los que rectifiquen serán bienvenidos»', indicador: 'Permeabilidad', efecto: 'Suma una apertura', porque: 'La puerta existe, aunque con condición: el otro queda en el umbral.' },
        { codigo: 'C4', tipo: 'cierre', modo: 'expulsion', corto: 'Expulsión de la comunidad', frase: '«no son el pueblo»', indicador: 'Permeabilidad', efecto: 'Suma un cierre', porque: 'Saca al otro de la comunidad: no solo está fuera, se le niega el derecho a estar dentro.' },
        { codigo: 'CP', tipo: 'excepcion', modo: 'excepcion', corto: 'Excepción democrática', frase: '«Rusia ha invadido nuestro país»', indicador: 'Permeabilidad', efecto: 'Se anota como CP y no resta', porque: 'Acto concreto y el Estado como actor: cumple las tres condiciones. El IRA no verifica la acusación y la ficha lo avisa.' },
      ],
    },

    cadena: {
      etiqueta: 'La cadena del argumento',
      conectores: ['y en esa primera respuesta…', 'por eso…', 'y además…'],
      anterior: 'Eslabón anterior',
      siguiente: 'Siguiente eslabón',
      reiniciar: 'Volver al inicio',
    },

    teoria: {
      ayuda: 'Pulsa un autor para ver qué aporta a la frontera.',
      referencias: 'Referencias',
      zonas: { cuerpo: 'Cuerpo', lenguaje: 'Lenguaje', politica: 'Política' },
      // Mismo orden que que.teoria en textosP1.js
      nodos: [
        { corto: 'Gallese', anios: '2001 · 2003', zona: 'cuerpo', disciplina: 'Neurociencia', refs: ['Gallese'] },
        { corto: 'Chilton', anios: '2004', zona: 'lenguaje', disciplina: 'Deixis', refs: ['Chilton'] },
        { corto: 'Van Dijk', anios: '1998 · 2006', zona: 'lenguaje', disciplina: 'Análisis crítico del discurso', refs: ['van Dijk'] },
        { corto: 'Mouffe', anios: '2005', zona: 'politica', disciplina: 'Agonismo', refs: ['Mouffe'] },
        { corto: 'Laclau', anios: '2005', zona: 'politica', disciplina: 'Populismo', refs: ['Laclau'] },
        { corto: 'Tajfel · Gaertner', anios: '1979 · 2000', zona: 'cuerpo', disciplina: 'Psicología social', refs: ['Tajfel', 'Gaertner'] },
      ],
    },

    linea: {
      titulo: 'La frontera, marca a marca',
      ayuda: 'Activa marcas: cada cierre hace la línea más maciza y cada apertura le abre un hueco por el que pasa la luz. La nota se recalcula al momento.',
      vaciar: 'Vaciar',
      vacia: 'Sin marcas todavía: no hay frontera que medir.',
      nosotros: 'nosotros',
      elOtro: 'el otro',
      cierres: 'Cierres',
      cierresNota: 'hacen la línea más maciza',
      aperturas: 'Aperturas',
      aperturasNota: 'le abren un hueco',
      permeabilidad: 'Permeabilidad',
      muro: 'Muro',
      puerta: 'Puerta',
      sinEventos: 'Sin eventos: la permeabilidad no se puntúa.',
      pocos: (n) => `${n} ${n === 1 ? 'evento' : 'eventos'}: por debajo del mínimo de 3, no se puntúa.`,
      puntua: (n) => `${n} eventos: puntúa.`,
      ultima: 'Última marca',
      referencia: 'Barcelona 2026: 1 apertura y 7 cierres = 2,00. Aquí cada marca cuenta una vez; en un discurso real cuenta cada repetición.',
    },
  },

  en: {
    frontera: {
      intro: 'Pick a sentence from the manual and see where it places the other: inside "us", on the threshold or behind the wall.',
      etiqueta: 'Example sentences',
      periferia: 'periphery',
      nosotros: 'us',
      elOtro: 'The other',
      indicador: 'Indicator',
      efecto: 'Effect',
      posiciones: {
        grupo: 'absent: nobody is left outside',
        muro: 'behind the wall',
        dentro: 'inside "us"',
        umbral: 'on the threshold',
        expulsion: 'outside the community',
        excepcion: 'outside because of a specific act',
      },
      ejemplos: [
        { codigo: 'G', tipo: 'incl', modo: 'grupo', corto: 'Group with no loser', frase: '«en este lugar somos 5.000 personas soñando un mundo mejor» (here we are 5,000 people dreaming of a better world)', indicador: 'Reach', efecto: 'Inclusive: worth 10', porque: 'It speaks to its own without invalidating anyone, so it builds no wall.' },
        { codigo: 'GC · C1', tipo: 'cierre', modo: 'muro', corto: 'Us/them contrast', frase: '«la vergüenza para ellos; para nosotros el orgullo» (shame for them; pride for us)', indicador: 'Reach and permeability', efecto: '"We" worth 0 and one closure', porque: '"Us" is built against an identifiable other: "against someone" overrides reach.' },
        { codigo: 'A3', tipo: 'apertura', modo: 'dentro', corto: 'Common belonging with difference', frase: '«pensamos distinto, pero también son de aquí» (we think differently, but they are from here too)', indicador: 'Permeability', efecto: 'One opening', porque: 'It acknowledges difference and still places the other inside the common house.' },
        { codigo: 'A9', tipo: 'apertura', modo: 'umbral', corto: 'Conditional inclusion', frase: '«los que rectifiquen serán bienvenidos» (those who change course will be welcome)', indicador: 'Permeability', efecto: 'One opening', porque: 'The door exists, with a condition: the other stays on the threshold.' },
        { codigo: 'C4', tipo: 'cierre', modo: 'expulsion', corto: 'Expulsion from the community', frase: '«no son el pueblo» (they are not the people)', indicador: 'Permeability', efecto: 'One closure', porque: 'It removes the other from the community: not only outside, but denied the right to be inside.' },
        { codigo: 'CP', tipo: 'excepcion', modo: 'excepcion', corto: 'Democratic exception', frase: '«Rusia ha invadido nuestro país» (Russia has invaded our country)', indicador: 'Permeability', efecto: 'Recorded as CP, does not subtract', porque: 'A specific act and the State as actor: it meets the three conditions. The IRA does not verify the accusation and the scorecard says so.' },
      ],
    },

    cadena: {
      etiqueta: 'The chain of the argument',
      conectores: ['and in that first response…', 'that is why…', 'and on top of that…'],
      anterior: 'Previous link',
      siguiente: 'Next link',
      reiniciar: 'Back to the start',
    },

    teoria: {
      ayuda: 'Tap an author to see what they bring to the boundary.',
      referencias: 'References',
      zonas: { cuerpo: 'Body', lenguaje: 'Language', politica: 'Politics' },
      nodos: [
        { corto: 'Gallese', anios: '2001 · 2003', zona: 'cuerpo', disciplina: 'Neuroscience', refs: ['Gallese'] },
        { corto: 'Chilton', anios: '2004', zona: 'lenguaje', disciplina: 'Deixis', refs: ['Chilton'] },
        { corto: 'Van Dijk', anios: '1998 · 2006', zona: 'lenguaje', disciplina: 'Critical discourse analysis', refs: ['van Dijk'] },
        { corto: 'Mouffe', anios: '2005', zona: 'politica', disciplina: 'Agonism', refs: ['Mouffe'] },
        { corto: 'Laclau', anios: '2005', zona: 'politica', disciplina: 'Populism', refs: ['Laclau'] },
        { corto: 'Tajfel · Gaertner', anios: '1979 · 2000', zona: 'cuerpo', disciplina: 'Social psychology', refs: ['Tajfel', 'Gaertner'] },
      ],
    },

    linea: {
      titulo: 'The boundary, mark by mark',
      ayuda: 'Switch marks on: every closure makes the line more solid and every opening cuts a gap that lets the light through. The score updates instantly.',
      vaciar: 'Clear',
      vacia: 'No marks yet: there is no boundary to measure.',
      nosotros: 'us',
      elOtro: 'the other',
      cierres: 'Closures',
      cierresNota: 'make the line more solid',
      aperturas: 'Openings',
      aperturasNota: 'cut a gap in it',
      permeabilidad: 'Permeability',
      muro: 'Wall',
      puerta: 'Door',
      sinEventos: 'No events: permeability is not scored.',
      pocos: (n) => `${n} ${n === 1 ? 'event' : 'events'}: below the minimum of 3, not scored.`,
      puntua: (n) => `${n} events: scored.`,
      ultima: 'Last mark',
      referencia: 'Barcelona 2026: 1 opening and 7 closures = 2.00. Here each mark counts once; in a real speech every repetition counts.',
    },
  },
};
