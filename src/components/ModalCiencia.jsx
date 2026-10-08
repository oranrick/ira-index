// IRA · ventanas de las ciencias de la portada: neurociencia, lingüística y psicoanálisis
import { Link } from 'react-router-dom';
import Ventana, { BotonCerrar } from './ui/Ventana.jsx';
import Estrella from './ui/Estrella.jsx';

// tono: 'empatico' | 'polarizante' | 'neutro' (color del punto de cada observación)
export const CIENCIAS = {
  es: {
    neuro: {
      ciencia: 'Neurociencia',
      titulo: 'Cómo resuena un discurso en quien lo escucha',
      cuerpo: 'Comprender a otra persona es, en parte, simularla: al escuchar, recreamos de forma encarnada sus emociones e intenciones. Desde la teoría de la variedad intersubjetiva de Vittorio Gallese, IRA entiende que un discurso empático amplía ese espacio compartido entre quien habla y quien escucha, y que uno polarizante lo estrecha hasta dividirlo en un nosotros y un ellos.',
      observa: [
        ['empatico', 'Lenguaje que invita a ponerse en el lugar del otro (empático)'],
        ['polarizante', 'Apelaciones al miedo, la amenaza o la deshumanización (polarizante)'],
        ['neutro', 'Cuánto espacio deja el discurso para que el oyente se reconozca'],
      ],
      autores: 'Referencia: Gallese.',
    },
    ling: {
      ciencia: 'Lingüística',
      titulo: 'Las palabras como marcos',
      cuerpo: 'Las metáforas no adornan el discurso: organizan cómo pensamos la política. Con la teoría de la metáfora conceptual de George Lakoff y el análisis crítico del discurso de Teun van Dijk, IRA estudia cómo un discurso construye grupos, a quién legitima y a quién deja fuera.',
      observa: [
        ['polarizante', 'Metáforas bélicas o sanitarias aplicadas a personas o rivales (polarizante)'],
        ['polarizante', 'Dicotomías del tipo nosotros contra ellos (polarizante)'],
        ['empatico', 'Pronombres y fórmulas que incluyen a quien piensa distinto (empático)'],
      ],
      autores: 'Referencias: Lakoff, Van Dijk.',
    },
    // Borrador pendiente de revisar por Rick (especificación del rediseño).
    // Faltan los autores de referencia: cuando estén, rellenar `autores`.
    psico: {
      ciencia: 'Psicoanálisis',
      titulo: 'Lo que el discurso moviliza por debajo',
      cuerpo: 'El discurso político no solo informa: moviliza deseos, miedos e identificaciones. La mirada psicoanalítica atiende a cómo se construye la figura del enemigo, a cómo se proyecta el malestar sobre otro y a si quien habla ofrece contención o alimenta la angustia de su audiencia.',
      observa: [
        ['polarizante', 'Construcción de un enemigo sobre el que se proyecta el malestar (polarizante)'],
        ['empatico', 'Gestos de contención, reconocimiento y reparación (empático)'],
        ['neutro', 'Identificaciones que el discurso propone al oyente'],
      ],
      autores: null,
    },
    enIra: 'en IRA',
    observaTitulo: 'Qué observa IRA',
    verMetodologia: 'Ver la metodología',
    cerrar: 'Cerrar',
  },
  en: {
    neuro: {
      ciencia: 'Neuroscience',
      titulo: 'How a speech resonates in those who hear it',
      cuerpo: 'Understanding another person is, in part, simulating them: when we listen, we recreate their emotions and intentions in an embodied way. Drawing on Vittorio Gallese’s theory of the intersubjective manifold, IRA holds that an empathic speech widens that shared space between speaker and listener, and that a polarizing one narrows it until it splits into an us and a them.',
      observa: [
        ['empatico', 'Language that invites us to put ourselves in another’s place (empathic)'],
        ['polarizante', 'Appeals to fear, threat or dehumanization (polarizing)'],
        ['neutro', 'How much room the speech leaves for listeners to recognize themselves'],
      ],
      autores: 'Reference: Gallese.',
    },
    ling: {
      ciencia: 'Linguistics',
      titulo: 'Words as frames',
      cuerpo: 'Metaphors do not decorate speech: they organize how we think about politics. With George Lakoff’s conceptual metaphor theory and Teun van Dijk’s critical discourse analysis, IRA studies how a speech builds groups, whom it legitimizes and whom it leaves out.',
      observa: [
        ['polarizante', 'War or disease metaphors applied to people or rivals (polarizing)'],
        ['polarizante', 'Us-versus-them dichotomies (polarizing)'],
        ['empatico', 'Pronouns and phrasings that include those who think differently (empathic)'],
      ],
      autores: 'References: Lakoff, Van Dijk.',
    },
    psico: {
      ciencia: 'Psychoanalysis',
      titulo: 'What a speech stirs beneath the surface',
      cuerpo: 'Political speech does not only inform: it stirs desires, fears and identifications. The psychoanalytic lens looks at how the figure of the enemy is built, how discontent is projected onto someone else, and whether the speaker offers containment or feeds the anxiety of their audience.',
      observa: [
        ['polarizante', 'Building an enemy onto whom discontent is projected (polarizing)'],
        ['empatico', 'Gestures of containment, recognition and repair (empathic)'],
        ['neutro', 'The identifications the speech offers its listeners'],
      ],
      autores: null,
    },
    enIra: 'in IRA',
    observaTitulo: 'What IRA looks at',
    verMetodologia: 'See the methodology',
    cerrar: 'Close',
  },
};

const PUNTO = { empatico: 'var(--ira-salvia)', polarizante: 'var(--ira-1)', neutro: 'var(--ira-oro)' };

export default function ModalCiencia({ ciencia, lang = 'es', onCerrar }) {
  const t = CIENCIAS[lang] ?? CIENCIAS.es;
  const m = ciencia ? t[ciencia] : null;
  return (
    <Ventana abierta={!!m} onCerrar={onCerrar} tituloId="ira-ciencia-titulo">
      {m && (
        <>
          <div className="ira-ventana__cabecera">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="ira-ventana__antetitulo">
                <Estrella color="var(--ira-oro)" />{m.ciencia} {t.enIra}
              </span>
              <h2 id="ira-ciencia-titulo" className="ira-ventana__titulo">{m.titulo}</h2>
            </div>
            <BotonCerrar onClick={onCerrar} etiqueta={t.cerrar} />
          </div>
          <p className="ira-ventana__cuerpo">{m.cuerpo}</p>
          <div className="ira-ventana__caja">
            <h3 className="ira-ventana__caja-titulo">{t.observaTitulo}</h3>
            <ul>
              {m.observa.map(([tono, texto]) => (
                <li key={texto}><span className="ira-ventana__punto" style={{ background: PUNTO[tono] }} aria-hidden="true" />{texto}</li>
              ))}
            </ul>
          </div>
          <div className="ira-ventana__pie">
            <span>{m.autores ?? ''}</span>
            <Link to="/about" onClick={onCerrar} className="ira-ventana__enlace">{t.verMetodologia}</Link>
          </div>
        </>
      )}
    </Ventana>
  );
}
