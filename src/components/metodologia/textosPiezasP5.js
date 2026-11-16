// IRA · Metodología 2.0 · textos de las piezas propias de /metodologia/p5.
// Todo sale de research/manual/P5.md (v0.1): las frases son las de sus tablas de códigos y casos
// resueltos. Bloques es y en con la misma estructura; en inglés, «original» (“traducción”).

export const PIEZAS_P5 = {
  es: {
    emblema: 'La voz del otro llega al discurso y sale valorada, respondida o anulada',
    glifos: { Z: 'La voz se apaga', B: 'La voz sigue y recibe respuesta', V: 'La voz sigue y resuena' },

    voz: {
      titulo: 'Qué hace con la voz del otro',
      intro: 'Elige una frase. La voz de quien piensa distinto llega al discurso; a la derecha queda lo que el discurso hace con ella.',
      etiqueta: 'Frases de ejemplo',
      otro: 'el otro',
      discurso: 'el discurso',
      queda: 'lo que queda de su voz',
      paso1: '¿Hay voz ajena o una norma sobre el desacuerdo?',
      paso2: '¿Qué se hace con ella?',
      paso3: 'Subtipo',
      entradas: { voz: 'Voz ajena', norma: 'Norma' },
      familias: { V: 'Valorar', B: 'Rebatir', Z: 'Anular' },
      signos: { V: 'Empático', B: 'Neutro, vale 5', Z: 'Polariza' },
      mando: { recorrer: 'Recorrer las siete' },
      ejemplos: [
        { codigo: 'B', familia: 'B', entrada: 'voz', frase: '«Dicen que sube el paro; los datos dicen lo contrario»', subtipo: 'Cita y responde', escena: 'La voz sigue en pie y recibe una respuesta.', porque: 'Niega el contenido, no a quien lo dice. Rebatir no exige dar una razón.' },
        { codigo: 'V2', familia: 'V', entrada: 'voz', frase: '«En lo de la vivienda tienen razón»', subtipo: 'Concede un punto concreto', escena: 'La voz pasa y el discurso se suma a ella.', porque: 'Reconoce un acierto concreto atribuido al otro. La concesión de fórmula («es verdad que hay problemas, pero...») no cuenta.' },
        { codigo: 'V3', familia: 'V', entrada: 'voz', frase: '«Entiendo que les preocupa el coste; mi respuesta es...»', subtipo: 'Da la razón de ser antes de responder', escena: 'La voz pasa entera, y solo después llega la respuesta.', porque: 'Explica por qué el otro piensa así antes de contestarle.' },
        { codigo: 'V1', familia: 'V', entrada: 'norma', frase: '«Discrepar es legítimo»', subtipo: 'Valida el desacuerdo', escena: 'No cita a nadie: deja la puerta abierta a cualquier voz contraria.', porque: 'Legitima el desacuerdo. Legitimar a la persona («respeto a quien defiende otra opción») es P1.' },
        { codigo: 'Z2', familia: 'Z', entrada: 'voz', frase: '«No diga chorradas»', subtipo: 'Ridiculiza lo dicho sin responder', escena: 'Lo dicho se trata como si no dijera nada.', porque: 'Niega el sentido de lo dicho, no su contenido.' },
        { codigo: 'Z1', familia: 'Z', entrada: 'voz', frase: '«Lo dicen porque les pagan»', subtipo: 'Deslegitima por quién habla o por qué', escena: 'La respuesta no va a lo dicho: vuelve contra quien lo dijo.', porque: 'Usa el motivo de quien habla para no responder a lo que dijo.' },
        { codigo: 'Z3', familia: 'Z', entrada: 'norma', frase: '«Con esa gente no se habla»', subtipo: 'Niega la palabra', escena: 'La voz no llega a entrar.', porque: 'Es una norma que niega la palabra. «Que se callen» es una orden y va a P6.' },
      ],
    },

    anatomia: {
      etiqueta: 'Un evento de voz ajena, por partes',
      tramos: [
        { texto: 'Dicen que', parte: 'marca' },
        { texto: ' ' },
        { texto: 'sube el paro', parte: 'voz' },
        { texto: '; ' },
        { texto: 'los datos dicen lo contrario', parte: 'hace' },
      ],
      traduccion: null,
      partes: [
        ['marca', 'La marca', 'Un verbo de decir con sujeto ajeno avisa de que entra otra voz.'],
        ['voz', 'Lo que dice el otro', 'El contenido que se le atribuye.'],
        ['hace', 'Lo que el discurso hace con ello', 'Aquí lo niega: es rebatir (B).'],
      ],
      suma: ['oración', 'voz ajena', 'lo que se hace con ella'],
      total: '1 evento',
    },

    golpe: {
      etiqueta: 'Qué se ataca',
      ayuda: 'Elige dónde cae la respuesta.',
      rotulos: { persona: 'quien habla', motivo: 'por qué lo dice', sentido: 'que diga algo', contenido: 'que sea cierto' },
      tabla: 'Ver las cuatro en una tabla',
      opciones: [
        { id: 'contenido', nombre: 'El contenido', titulo: 'Se niega que sea cierto', ejemplos: '«eso es falso», «no es verdad», «es un bulo»', codigo: 'B', tono: 'neutra', resultado: 'Rebatir · neutro', nota: 'Lo dicho sigue en pie como algo que se puede discutir.' },
        { id: 'sentido', nombre: 'El sentido', titulo: 'Se niega que diga algo', ejemplos: '«chorradas», «tonterías», «ocurrencias», «cuentos»', codigo: 'Z2', tono: 'polariza', resultado: 'Anular · polariza', nota: 'Si no dice nada, no queda nada que responder.' },
        { id: 'motivo', nombre: 'El motivo', titulo: 'Se ataca por qué lo dice', ejemplos: '«es propaganda», «lo dicen porque les pagan»', codigo: 'Z1', tono: 'polariza', resultado: 'Anular · polariza', nota: 'Se usa a quien habla para no responder a lo que dijo.' },
        { id: 'persona', nombre: 'La persona', titulo: 'Se juzga a quien habla', ejemplos: '«mienten»', codigo: 'P3', tono: 'otro', resultado: 'Sale de P5', nota: 'El juicio sobre la persona lo mide P3, no P5.' },
      ],
    },

    balanza: {
      titulo: 'Prueba la fórmula',
      intro: 'Cambia cuántos eventos hay de cada tipo y mira cómo se mueve la nota.',
      nombres: { Z: 'Anular', B: 'Rebatir', V: 'Valorar' },
      menos: (n) => `Quitar un evento de ${n}`,
      mas: (n) => `Añadir un evento de ${n}`,
      presets: 'Los cuatro discursos del manual',
      eventos: (n) => (n === 1 ? '1 evento de voz ajena' : `${n} eventos de voz ajena`),
      sinPuntuar: 'No se puntúa',
      faltan: (n) => (n === 1 ? 'Falta 1 evento para el mínimo de 5.' : `Faltan ${n} eventos para el mínimo de 5.`),
      vacio: 'Sin voz ajena no hay nota: solo se puede ignorar lo que está presente.',
      solidez: { orientativa: 'Orientativa', solida: 'Sólida' },
      centro: 'solo rebatir',
      polos: ['polariza', 'empático'],
      dilucion: (x) => `Prueba de dilución: sin contar las réplicas, la misma fórmula daría ${x}.`,
      nota: 'La nota',
    },
  },

  en: {
    emblema: 'The other’s voice reaches the speech and comes out valued, answered or cancelled',
    glifos: { Z: 'The voice dies out', B: 'The voice stands and gets an answer', V: 'The voice stands and resonates' },

    voz: {
      titulo: 'What it does with the other’s voice',
      intro: 'Pick a sentence. The voice of someone who thinks differently reaches the speech; on the right is what the speech does with it.',
      etiqueta: 'Example sentences',
      otro: 'the other',
      discurso: 'the speech',
      queda: 'what is left of their voice',
      paso1: 'Is there another voice, or a norm about disagreement?',
      paso2: 'What is done with it?',
      paso3: 'Subtype',
      entradas: { voz: 'Another voice', norma: 'Norm' },
      familias: { V: 'Value', B: 'Rebut', Z: 'Cancel' },
      signos: { V: 'Empathetic', B: 'Neutral, worth 5', Z: 'Polarizing' },
      mando: { recorrer: 'Play all seven' },
      ejemplos: [
        { codigo: 'B', familia: 'B', entrada: 'voz', frase: '«Dicen que sube el paro; los datos dicen lo contrario» (“they say unemployment is rising; the data say the opposite”)', subtipo: 'Quotes and answers', escena: 'The voice stands and gets an answer.', porque: 'It denies the content, not the person saying it. Rebutting does not require giving a reason.' },
        { codigo: 'V2', familia: 'V', entrada: 'voz', frase: '«En lo de la vivienda tienen razón» (“on housing, they are right”)', subtipo: 'Concedes a specific point', escena: 'The voice goes through and the speech joins it.', porque: 'It recognizes a specific point attributed to the other. A token concession («es verdad que hay problemas, pero...», “true, there are problems, but...”) does not count.' },
        { codigo: 'V3', familia: 'V', entrada: 'voz', frase: '«Entiendo que les preocupa el coste; mi respuesta es...» (“I understand you are worried about the cost; my answer is...”)', subtipo: 'States the reason behind it before answering', escena: 'The voice goes through whole, and only then comes the answer.', porque: 'It explains why the other thinks that way before replying.' },
        { codigo: 'V1', familia: 'V', entrada: 'norma', frase: '«Discrepar es legítimo» (“disagreeing is legitimate”)', subtipo: 'Validates disagreement', escena: 'It quotes no one: it leaves the door open to any opposing voice.', porque: 'It legitimizes disagreement. Legitimizing the person («respeto a quien defiende otra opción», “I respect those who support another option”) is P1.' },
        { codigo: 'Z2', familia: 'Z', entrada: 'voz', frase: '«No diga chorradas» (“stop talking rubbish”)', subtipo: 'Ridicules what was said without answering', escena: 'What was said is treated as if it said nothing.', porque: 'It denies the meaning of what was said, not its content.' },
        { codigo: 'Z1', familia: 'Z', entrada: 'voz', frase: '«Lo dicen porque les pagan» (“they say it because they are paid to”)', subtipo: 'Delegitimizes because of who speaks or why', escena: 'The answer does not go to what was said: it turns back on whoever said it.', porque: 'It uses the speaker’s motive to avoid answering what they said.' },
        { codigo: 'Z3', familia: 'Z', entrada: 'norma', frase: '«Con esa gente no se habla» (“you do not talk to those people”)', subtipo: 'Denies the floor', escena: 'The voice never gets in.', porque: 'It is a norm that denies the floor. «Que se callen» (“let them shut up”) is an order and goes to P6.' },
      ],
    },

    anatomia: {
      etiqueta: 'One event of another voice, part by part',
      tramos: [
        { texto: 'Dicen que', parte: 'marca' },
        { texto: ' ' },
        { texto: 'sube el paro', parte: 'voz' },
        { texto: '; ' },
        { texto: 'los datos dicen lo contrario', parte: 'hace' },
      ],
      traduccion: '“They say unemployment is rising; the data say the opposite”',
      partes: [
        ['marca', 'The mark', 'A verb of saying with someone else as subject signals that another voice comes in.'],
        ['voz', 'What the other says', 'The content attributed to them.'],
        ['hace', 'What the speech does with it', 'Here it denies it: that is rebutting (B).'],
      ],
      suma: ['sentence', 'another voice', 'what is done with it'],
      total: '1 event',
    },

    golpe: {
      etiqueta: 'What is attacked',
      ayuda: 'Choose where the answer lands.',
      rotulos: { persona: 'who speaks', motivo: 'why they say it', sentido: 'that it says something', contenido: 'that it is true' },
      tabla: 'See all four in a table',
      opciones: [
        { id: 'contenido', nombre: 'The content', titulo: 'It is denied that it is true', ejemplos: '«eso es falso» (“that is false”), «no es verdad» (“it is not true”), «es un bulo» (“it is a hoax”)', codigo: 'B', tono: 'neutra', resultado: 'Rebut · neutral', nota: 'What was said still stands as something that can be discussed.' },
        { id: 'sentido', nombre: 'The meaning', titulo: 'It is denied that it says anything', ejemplos: '«chorradas», «tonterías», «ocurrencias», «cuentos» (“rubbish”, “nonsense”, “wild ideas”, “fairy tales”)', codigo: 'Z2', tono: 'polariza', resultado: 'Cancel · polarizing', nota: 'If it says nothing, there is nothing left to answer.' },
        { id: 'motivo', nombre: 'The motive', titulo: 'Why they say it is attacked', ejemplos: '«es propaganda» (“it is propaganda”), «lo dicen porque les pagan» (“they say it because they are paid to”)', codigo: 'Z1', tono: 'polariza', resultado: 'Cancel · polarizing', nota: 'The speaker is used to avoid answering what they said.' },
        { id: 'persona', nombre: 'The person', titulo: 'The speaker is judged', ejemplos: '«mienten» (“they lie”)', codigo: 'P3', tono: 'otro', resultado: 'Leaves P5', nota: 'Judgement about the person is measured by P3, not P5.' },
      ],
    },

    balanza: {
      titulo: 'Try the formula',
      intro: 'Change how many events there are of each type and watch the score move.',
      nombres: { Z: 'Cancel', B: 'Rebut', V: 'Value' },
      menos: (n) => `Remove one ${n} event`,
      mas: (n) => `Add one ${n} event`,
      presets: 'The four speeches in the manual',
      eventos: (n) => (n === 1 ? '1 event of another voice' : `${n} events of another voice`),
      sinPuntuar: 'Not scored',
      faltan: (n) => (n === 1 ? '1 more event needed to reach the minimum of 5.' : `${n} more events needed to reach the minimum of 5.`),
      vacio: 'With no other voice there is no score: you can only ignore what is present.',
      solidez: { orientativa: 'Indicative', solida: 'Solid' },
      centro: 'rebuttals only',
      polos: ['polarizing', 'empathetic'],
      dilucion: (x) => `Dilution test: leaving the rebuttals out, the same formula would give ${x}.`,
      nota: 'The score',
    },
  },
};
