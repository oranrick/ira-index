// IRA · /metodologia — índice de la Metodología 2.0: aviso de versión, tres principios,
// tarjetas de parámetros (P1 y P2 activas) y enlace a la carpeta research/ del repositorio.
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../App.jsx';
import AvisoVersion from './AvisoVersion.jsx';
import { Aparecer, Icono } from './Visuales.jsx';
import { PARAMETROS, REPO_RESEARCH, SOLO_ES } from './textosComunes.js';
import '../../styles/metodologia.css';
import '../../styles/metodologia-juego.css';

const TXT = {
  es: {
    rotulo: 'Metodología',
    titulo: 'Metodología 2.0',
    entradilla: 'El Índice de Resonancia Afectiva (IRA) mide, en una escala de 0 a 10, si el lenguaje de un discurso tiende a la polarización (0) o a la empatía (10). Se compone de varios parámetros, cada uno con su peso. En la versión 2.0 cambia la manera de puntuar: cada parámetro tiene un manual público, la IA clasifica lo que ocurre en el texto y la nota sale de una fórmula.',
    anterior: 'Sobre el proyecto y la metodología actual',
    principiosTitulo: 'Tres principios',
    principios: [
      { titulo: 'La IA clasifica, las fórmulas calculan', texto: 'La IA no pone la nota: identifica y clasifica cada fenómeno con un manual público; la nota sale de una fórmula.' },
      { titulo: 'Cada punto se puede señalar en el texto', texto: 'Cada análisis tiene una ficha que muestra qué frases suman o restan y por qué.' },
      { titulo: 'Reproducible', texto: 'Manual, código y datos están en el repositorio público, con versiones fijadas.' },
    ],
    parametrosTitulo: 'Los parámetros',
    parametrosTexto: 'Cada parámetro se publica con su manual. P1 está cerrado; P2 es un borrador en desarrollo y puede cambiar. Los demás conservan, de momento, su nombre actual.',
    proximamente: 'Próximamente',
    leer: 'Leer el método',
    researchTitulo: 'Manual, código y datos',
    researchTexto: 'La carpeta research/ del repositorio contiene los manuales de codificación, los scripts en Python, las tablas codificadas y las fichas de cada discurso.',
    researchEnlace: 'Ver la carpeta research/ en GitHub',
    nuevaPestana: '(se abre en una pestaña nueva)',
  },
};

export default function MetodologiaIndice() {
  const { lang } = useContext(AppContext);
  // La sección solo está en español: los códigos y ejemplos de P1 dependen de la gramática española
  const t = TXT.es;
  const parametros = PARAMETROS.es;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="main-container ira-met" style={{ maxWidth: 1080 }}>
      {lang === 'en' && <p className="ira-met__nota" lang="en">{SOLO_ES}</p>}
      <AvisoVersion lang="es" />

      <header className="ira-met__cabecera">
        <p className="ira-met__rotulo">{t.rotulo}</p>
        <h1 className="ira-met__titulo">{t.titulo}</h1>
        <p className="ira-met__entradilla">{t.entradilla}</p>
        <p><Link to="/about" className="ira-met__enlace">{t.anterior} →</Link></p>
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
          {parametros.map((p) => (
            <li key={p.id}>
              {p.ruta ? (
                <Link to={p.ruta} className="ira-met__param ira-met__param--activo">
                  <span className="ira-met__param-cab">
                    <span className="ira-met__param-codigo ira-cifra">{p.codigo}</span>
                    <span className={`ira-met__param-estado ira-met__param-estado--activo${p.borrador ? ' ira-met__param-estado--borrador' : ''}`}>{p.estado}</span>
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
