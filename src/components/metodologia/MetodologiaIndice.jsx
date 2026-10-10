// IRA · /metodologia — índice de la Metodología 2.0: aviso de versión, tres principios,
// tarjetas de parámetros (solo P1 activa) y enlace a la carpeta research/ del repositorio.
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../App.jsx';
import AvisoVersion from './AvisoVersion.jsx';
import { PARAMETROS, REPO_RESEARCH } from './textosComunes.js';
import '../../styles/metodologia.css';

const TXT = {
  es: {
    rotulo: 'Metodología',
    titulo: 'Metodología 2.0',
    entradilla: 'El Índice de Resonancia Afectiva (IRA) mide, en una escala de 0 a 10, si el lenguaje de un discurso tiende a la polarización (0) o a la empatía (10). Se compone de varios parámetros, cada uno con su peso. En la versión 2.0 cambia la manera de puntuar: cada parámetro tiene un manual público, la IA clasifica lo que ocurre en el texto y la nota sale de una fórmula.',
    principiosTitulo: 'Tres principios',
    principios: [
      { titulo: 'La IA clasifica, las fórmulas calculan', texto: 'La IA no pone la nota: identifica y clasifica cada fenómeno con un manual público; la nota sale de una fórmula.' },
      { titulo: 'Cada punto se puede señalar en el texto', texto: 'Cada análisis tiene una ficha que muestra qué frases suman o restan y por qué.' },
      { titulo: 'Reproducible', texto: 'Manual, código y datos están en el repositorio público, con versiones fijadas.' },
    ],
    parametrosTitulo: 'Los parámetros',
    parametrosTexto: 'Publicamos cada parámetro cuando su manual está cerrado. Los demás conservan, de momento, su nombre actual.',
    proximamente: 'Próximamente',
    disponible: 'Manual v1.1',
    leer: 'Leer el método',
    researchTitulo: 'Manual, código y datos',
    researchTexto: 'La carpeta research/ del repositorio contiene los manuales de codificación, los scripts en Python, las tablas codificadas y las fichas de cada discurso.',
    researchEnlace: 'Ver la carpeta research/ en GitHub',
    nuevaPestana: '(se abre en una pestaña nueva)',
  },
  en: {
    rotulo: 'Methodology',
    titulo: 'Methodology 2.0',
    entradilla: 'The Affective Resonance Index (IRA) measures, on a scale from 0 to 10, whether the language of a speech leans towards polarisation (0) or empathy (10). It is made up of several parameters, each with its own weight. Version 2.0 changes how scores are produced: each parameter has a public manual, the AI classifies what happens in the text, and the score comes from a formula.',
    principiosTitulo: 'Three principles',
    principios: [
      { titulo: 'The AI classifies, the formulas calculate', texto: 'The AI does not give the score: it identifies and classifies each phenomenon using a public manual; the score comes from a formula.' },
      { titulo: 'Every point can be traced in the text', texto: 'Every analysis has a scorecard showing which sentences add or subtract, and why.' },
      { titulo: 'Reproducible', texto: 'Manual, code and data are in the public repository, with pinned versions.' },
    ],
    parametrosTitulo: 'The parameters',
    parametrosTexto: 'We publish each parameter once its manual is closed. The others keep their current names for now.',
    proximamente: 'Coming soon',
    disponible: 'Manual v1.1',
    leer: 'Read the method',
    researchTitulo: 'Manual, code and data',
    researchTexto: 'The research/ folder in the repository holds the coding manuals, the Python scripts, the coded tables and the scorecard for each speech.',
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

      <header className="ira-met__cabecera">
        <p className="ira-met__rotulo">{t.rotulo}</p>
        <h1 className="ira-met__titulo">{t.titulo}</h1>
        <p className="ira-met__entradilla">{t.entradilla}</p>
      </header>

      <section className="ira-met__seccion" aria-labelledby="met-principios">
        <h2 id="met-principios" className="ira-met__h2">{t.principiosTitulo}</h2>
        <ol className="ira-met__principios">
          {t.principios.map((p, i) => (
            <li key={i} className="ira-met__principio">
              <span className="ira-met__principio-n ira-cifra" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ira-met__h3">{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ira-met__seccion" aria-labelledby="met-parametros">
        <h2 id="met-parametros" className="ira-met__h2">{t.parametrosTitulo}</h2>
        <p className="ira-met__texto">{t.parametrosTexto}</p>
        <ul className="ira-met__parametros">
          {parametros.map((p) => (
            <li key={p.id}>
              {p.ruta ? (
                <Link to={p.ruta} className="ira-met__param ira-met__param--activo">
                  <span className="ira-met__param-cab">
                    <span className="ira-met__param-codigo ira-cifra">{p.codigo}</span>
                    <span className="ira-met__param-estado ira-met__param-estado--activo">{t.disponible}</span>
                  </span>
                  <span className="ira-met__param-nombre">{p.nombre}</span>
                  <span className="ira-met__param-def">{p.definicion}</span>
                  <span className="ira-met__param-cta">{t.leer} →</span>
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
            {t.researchEnlace} →<span className="ira-sr"> {t.nuevaPestana}</span>
          </a>
        </p>
      </section>
    </div>
  );
}
