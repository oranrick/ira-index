// IRA · /metodologia — índice de la Metodología 2.0: aviso de versión, tres principios,
// tarjetas de parámetros (P1, P2, P3, P5 y P6 activas) y enlace a la carpeta research/ del repositorio.
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../App.jsx';
import AvisoVersion from './AvisoVersion.jsx';
import { Aparecer, Icono } from './Visuales.jsx';
import { NOTA_EN, PARAMETROS, REPO_RESEARCH } from './textosComunes.js';
import '../../styles/metodologia.css';
import '../../styles/metodologia-juego.css';
import '../../styles/identidad.css';

const TXT = {
  es: {
    rotulo: 'Metodología',
    titulo: 'Metodología 2.0',
    entradilla: 'El Índice de Resonancia Afectiva (IRA) mide, en una escala de 0 a 10, si el lenguaje de un discurso tiende a la polarización (0) o a la empatía (10). Se compone de varios parámetros, cada uno con su peso. En la versión 2.0 cambia la manera de puntuar: cada parámetro tiene un manual público, la IA clasifica lo que ocurre en el texto y la nota sale de una fórmula.',
    anterior: 'Cómo se calculaba antes: los siete parámetros de 2024',
    principiosTitulo: 'Tres principios',
    principios: [
      { titulo: 'La IA clasifica, las fórmulas calculan', texto: 'La IA no pone la nota: identifica y clasifica cada fenómeno con un manual público; la nota sale de una fórmula.' },
      { titulo: 'Cada punto se puede señalar en el texto', texto: 'Cada análisis tiene una ficha que muestra qué frases suman o restan y por qué.' },
      { titulo: 'Reproducible', texto: 'Manual, código y datos están en el repositorio público, con versiones fijadas.' },
    ],
    parametrosTitulo: 'Los parámetros',
    parametrosTexto: 'Cada parámetro se publica con su manual. P1, P2, P3, P5 y P6 están cerrados. P4, P7 y P8 conservan, de momento, su nombre actual. Solo P1 y P2 puntúan ya, en la campaña del 29-N.',
    proximamente: 'Próximamente',
    leer: 'Leer el método',
    researchTitulo: 'Manual, código y datos',
    researchTexto: 'La carpeta research/ del repositorio contiene los manuales de codificación, los scripts en Python, las tablas codificadas y las fichas de cada discurso.',
    researchEnlace: 'Ver la carpeta research/ en GitHub',
    nuevaPestana: '(se abre en una pestaña nueva)',
  },
  en: {
    rotulo: 'Methodology',
    titulo: 'Methodology 2.0',
    entradilla: 'The Affective Resonance Index (IRA, from its Spanish name) measures, on a scale from 0 to 10, whether the language of a speech leans towards polarization (0) or empathy (10). It is made up of several parameters, each with its own weight. Version 2.0 changes how scores are produced: every parameter has a public manual, AI classifies what happens in the text and the score comes from a formula.',
    anterior: 'How scores used to be calculated: the seven parameters of 2024',
    principiosTitulo: 'Three principles',
    principios: [
      { titulo: 'AI classifies, formulas calculate', texto: 'AI does not set the score: it identifies and classifies each phenomenon following a public manual, and the score comes from a formula.' },
      { titulo: 'Every point can be traced in the text', texto: 'Each analysis has a scorecard showing which sentences add or subtract, and why.' },
      { titulo: 'Reproducible', texto: 'Manual, code and data are in the public repository, with pinned versions.' },
    ],
    parametrosTitulo: 'The parameters',
    parametrosTexto: 'Each parameter is published with its manual. P1, P2, P3, P5 and P6 are closed. P4, P7 and P8 keep their current names for now. Only P1 and P2 score anything yet, in the 29-N coverage.',
    proximamente: 'Coming soon',
    leer: 'Read the method',
    researchTitulo: 'Manual, code and data',
    researchTexto: 'The research/ folder of the repository holds the coding manuals (in Spanish), the Python scripts, the coded tables and the scorecard of each speech.',
    researchEnlace: 'See the research/ folder on GitHub',
    nuevaPestana: '(opens in a new tab)',
  },
};

export default function MetodologiaIndice() {
  const { lang } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const parametros = PARAMETROS[lang] ?? PARAMETROS.es;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="main-container ira-met" style={{ maxWidth: 1080 }}>
      <AvisoVersion lang={lang} />
      {lang === 'en' && <p className="ira-met__nota ira-met__nota-en">{NOTA_EN}</p>}

      <header className="ira-met__cabecera">
        <p className="ira-met__rotulo">{t.rotulo}</p>
        <h1 className="ira-met__titulo">{t.titulo}</h1>
        <p className="ira-met__entradilla">{t.entradilla}</p>
        <p><Link to="/about#metodologia-2024" className="ira-met__enlace">{t.anterior}</Link></p>
      </header>

      <section className="ira-met__seccion" aria-labelledby="met-principios">
        <h2 id="met-principios" className="ira-met__h2">{t.principiosTitulo}</h2>
        <ol className="ira-met__principios">
          {t.principios.map((p, i) => (
            <Aparecer as="li" key={i} className="ira-met__principio" style={{ '--retardo': `${i * 90}ms` }}>
              <span className="ira-met__principio-cab">
                <span className="ira-met__principio-n ira-cifra" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <Icono nombre={['ia', 'senalar', 'repositorio'][i]} tamano={28} className="ira-met__principio-icono" />
              </span>
              <h3 className="ira-met__h3">{p.titulo}</h3>
              <p>{p.texto}</p>
            </Aparecer>
          ))}
        </ol>
      </section>

      <section className="ira-met__seccion" aria-labelledby="met-parametros">
        <h2 id="met-parametros" className="ira-met__h2">{t.parametrosTitulo}</h2>
        <p className="ira-met__texto">{t.parametrosTexto}</p>
        <ul className="ira-met__parametros">
          {/* Primero los que tienen manual; los pendientes juntos al final, en su propia fila */}
          {[...parametros.filter((x) => x.ruta), ...parametros.filter((x) => !x.ruta)].map((p) => (
            <li key={p.id}>
              {p.ruta ? (
                <Link to={p.ruta} className="ira-met__param ira-met__param--activo">
                  <span className="ira-met__param-cab">
                    <span className="ira-met__param-codigo ira-cifra">{p.codigo}</span>
                    <span className={`ira-met__param-estado ira-met__param-estado--activo${p.borrador ? ' ira-met__param-estado--borrador' : ''}`}>{p.estado}</span>
                  </span>
                  <span className="ira-met__param-nombre">{p.nombre}</span>
                  <span className="ira-met__param-def">{p.definicion}</span>
                  <span className="ira-met__param-cta">{t.leer}</span>
                </Link>
              ) : (
                <div className="ira-met__param ira-met__param--pronto">
                  <span className="ira-met__param-cab">
                    <span className="ira-met__param-codigo ira-cifra">{p.codigo}</span>
                    <span className="ira-met__param-estado">{t.proximamente}</span>
                  </span>
                  <span className="ira-met__param-nombre">{p.nombre}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="ira-met__seccion ira-met__research" aria-labelledby="met-research">
        <h2 id="met-research" className="ira-met__h2">{t.researchTitulo}</h2>
        <p className="ira-met__texto">{t.researchTexto}</p>
        <p>
          <a href={REPO_RESEARCH} target="_blank" rel="noopener noreferrer" className="ira-met__enlace">
            {t.researchEnlace}<span className="ira-sr"> {t.nuevaPestana}</span>
          </a>
        </p>
      </section>
    </div>
  );
}
