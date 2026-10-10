// IRA · /metodologia/p1 — P1 La frontera del nosotros (Metodología 2.0, manual v1.1).
// Todo el contenido sale de research/manual/P1.md (ver textosP1.js); las cifras de las
// piezas salen de src/data/metodologia/p1.json. La página no calcula P1.
import { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppContext } from '../../App.jsx';
import AvisoVersion from './AvisoVersion.jsx';
import MarcadorPieza from './MarcadorPieza.jsx';
import EtiquetaPuntuacion from '../ui/EtiquetaPuntuacion.jsx';
import { TEXTOS_P1 } from './textosP1.js';
import '../../styles/metodologia.css';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P1.md';

const UI = {
  es: { navPie: 'Navegación entre parámetros', pieza: 'Pieza', nuevaPestana: '(se abre en una pestaña nueva)' },
  en: { navPie: 'Navigation between parameters', pieza: 'Piece', nuevaPestana: '(opens in a new tab)' },
};

function Seccion({ id, titulo, children }) {
  return (
    <section id={id} className="ira-met__seccion ira-met__seccion--p1" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="ira-met__h2">{titulo}</h2>
      {children}
    </section>
  );
}

// Tabla que en móvil se apila en tarjetas (cada celda lleva su rótulo de columna)
function Tabla({ cabecera, filas, className = '' }) {
  return (
    <div className={`ira-met__tabla-marco ${className}`}>
      <table className="ira-met__tabla">
        <thead><tr>{cabecera.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((celda, j) => (
                <td key={j} data-rotulo={cabecera[j]}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Acordeon({ titulo, children, abierto = false }) {
  return (
    <details className="ira-met__acordeon" open={abierto}>
      <summary>
        <span>{titulo}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-met__chevron"><polyline points="6 9 12 15 18 9" /></svg>
      </summary>
      <div className="ira-met__acordeon-cuerpo">{children}</div>
    </details>
  );
}

function Formula({ children }) {
  return <p className="ira-met__formula-linea ira-cifra">{children}</p>;
}

function Valor({ valor, t, lang }) {
  if (valor == null) return <span className="ira-met__no-cuenta">{t.ind.noCuenta}</span>;
  return <EtiquetaPuntuacion puntuacion={Number(valor)} variante="punto" lang={lang} decimales={0} />;
}

function Destinos({ destino, nota }) {
  return (
    <span className="ira-met__destinos">
      {destino.map((d) => <span key={d} className="ira-met__etiqueta-param ira-cifra">{d}</span>)}
      {nota && <span className="ira-met__destino-nota">{nota}</span>}
    </span>
  );
}

function IndiceSecciones({ t }) {
  const enlaces = (
    <ol className="ira-met__indice-lista">
      {t.secciones.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.titulo}</a></li>)}
    </ol>
  );
  return (
    <>
      <nav className="ira-met__indice ira-met__indice--ancho" aria-label={t.indiceTitulo}>
        <p className="ira-met__indice-titulo">{t.indiceTitulo}</p>
        {enlaces}
      </nav>
      <nav className="ira-met__indice ira-met__indice--movil" aria-label={t.indiceTitulo}>
        <details className="ira-met__acordeon">
          <summary>
            <span>{t.indiceDesplegar}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-met__chevron"><polyline points="6 9 12 15 18 9" /></svg>
          </summary>
          <div className="ira-met__acordeon-cuerpo">{enlaces}</div>
        </details>
      </nav>
    </>
  );
}

export default function MetodologiaP1() {
  const { lang } = useContext(AppContext);
  const { hash } = useLocation();
  const t = TEXTOS_P1[lang] ?? TEXTOS_P1.es;
  const u = UI[lang] ?? UI.es;
  const titulo = Object.fromEntries(t.secciones.map((s) => [s.id, s.titulo]));
  const pieza = (n) => `${u.pieza} ${n}`;

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
    // solo al entrar en la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { alcance, interpelacion, permeabilidad } = t.ind;

  return (
    <div className="main-container ira-met ira-met--p1" style={{ maxWidth: 1180 }}>
      <AvisoVersion lang={lang} />

      <Link to="/metodologia" className="ira-met__volver">{t.volverIndice}</Link>
      <header className="ira-met__cabecera">
        <p className="ira-met__rotulo">{t.rotulo}</p>
        <h1 className="ira-met__titulo">{t.titulo}</h1>
      </header>

      <div className="ira-met__rejilla">
        <IndiceSecciones t={t} />

        <div className="ira-met__cuerpo">
          {/* 1 · En una frase */}
          <Seccion id="en-una-frase" titulo={titulo['en-una-frase']}>
            <p className="ira-met__frase">{t.frase}</p>
            <div className="ira-met__formula" role="group" aria-label={t.ind.formula}>
              {t.formula.map((l) => <Formula key={l}>{l}</Formula>)}
            </div>
            <p className="ira-met__nota">{t.formulaNota}</p>
          </Seccion>

          {/* 2 · Pieza 1 */}
          <Seccion id="mapa" titulo={titulo.mapa}>
            <MarcadorPieza etiqueta={pieza(1)} texto={t.piezas.mapa} aviso={t.pieza} />
          </Seccion>

          {/* 3 · Qué mide y por qué */}
          <Seccion id="que-mide" titulo={titulo['que-mide']}>
            {t.que.intro.map((p) => <p key={p} className="ira-met__texto">{p}</p>)}
            <h3 className="ira-met__h3">{t.que.teoriaTitulo}</h3>
            <dl className="ira-met__teoria">
              {t.que.teoria.map((a) => (
                <div key={a.autor}>
                  <dt>{a.autor}</dt>
                  <dd>{a.texto}</dd>
                </div>
              ))}
            </dl>
            <div className="ira-met__cautela">
              <p className="ira-met__cautela-titulo">{t.que.cautelaTitulo}</p>
              <p>{t.que.cautela}</p>
            </div>
          </Seccion>

          {/* 4 · Qué no mide */}
          <Seccion id="que-no-mide" titulo={titulo['que-no-mide']}>
            <Tabla
              cabecera={t.noMide.cabecera}
              filas={t.noMide.filas.map((f) => [f.fenomeno, <Destinos key="d" destino={f.destino} nota={f.nota} />])}
            />
            <p className="ira-met__regla">{t.noMide.regla}</p>
          </Seccion>

          {/* 5 · Cómo se aplica */}
          <Seccion id="como-se-aplica" titulo={titulo['como-se-aplica']}>
            <ol className="ira-met__pasos">
              {t.aplica.pasos.map((p, i) => (
                <li key={p.nombre} className="ira-met__paso">
                  <span className="ira-met__paso-n ira-cifra" aria-hidden="true">{i + 1}</span>
                  <h3 className="ira-met__h3">{p.nombre}</h3>
                  <p className="ira-met__paso-quien">{p.quien}</p>
                  <p className="ira-met__paso-texto">{p.texto}</p>
                </li>
              ))}
            </ol>
            <p className="ira-met__clave">{t.aplica.clave}</p>
            <p className="ira-met__nota">{t.aplica.reproducibilidad}</p>
          </Seccion>

          {/* 6 · Pieza 2 */}
          <Seccion id="discurso-anotado" titulo={titulo['discurso-anotado']}>
            <MarcadorPieza etiqueta={pieza(2)} texto={t.piezas.anotado} aviso={t.pieza} />
          </Seccion>

          {/* 7 · Los tres indicadores */}
          <Seccion id="indicadores" titulo={titulo.indicadores}>
            <article className="ira-met__indicador" aria-labelledby="ind-alcance">
              <h3 id="ind-alcance" className="ira-met__indicador-titulo">
                <span>{alcance.nombre}</span> <span className="ira-met__peso ira-cifra">{alcance.peso}</span>
              </h3>
              <p className="ira-met__texto"><strong>{t.ind.queMide}:</strong> {alcance.queMide}</p>
              <p className="ira-met__texto"><strong>{t.ind.unidad}:</strong> {alcance.unidad}</p>
              <Tabla
                cabecera={[t.ind.codigo, t.ind.categoria, t.ind.valor, t.ind.ejemplos]}
                filas={alcance.codigos.map((c) => [
                  <span key="c" className="ira-met__codigo ira-cifra">{c.codigo}</span>,
                  c.categoria,
                  <Valor key="v" valor={c.valor} t={t} lang={lang} />,
                  c.ej,
                ])}
              />
              <Acordeon titulo={t.ind.reglas}>
                <ol className="ira-met__lista">{alcance.reglas.map((r) => <li key={r}>{r}</li>)}</ol>
              </Acordeon>
              <div className="ira-met__formula ira-met__formula--ind">
                <Formula>{alcance.formula}</Formula>
              </div>
            </article>

            <article className="ira-met__indicador" aria-labelledby="ind-interpelacion">
              <h3 id="ind-interpelacion" className="ira-met__indicador-titulo">
                <span>{interpelacion.nombre}</span> <span className="ira-met__peso ira-cifra">{interpelacion.peso}</span>
              </h3>
              <p className="ira-met__texto"><strong>{t.ind.queMide}:</strong> {interpelacion.queMide}</p>
              <p className="ira-met__texto"><strong>{t.ind.unidad}:</strong> {interpelacion.unidad}</p>
              <Tabla
                cabecera={[t.ind.codigo, t.ind.categoria, t.ind.ejemplos]}
                filas={interpelacion.codigos.map((c) => [
                  <span key="c" className="ira-met__codigo ira-cifra">{c.codigo}</span>, c.categoria, c.ej,
                ])}
              />
              <p className="ira-met__regla">{interpelacion.regla}</p>
              <div className="ira-met__formula ira-met__formula--ind">
                <Formula>{interpelacion.formula}</Formula>
              </div>
            </article>

            <article className="ira-met__indicador" aria-labelledby="ind-permeabilidad">
              <h3 id="ind-permeabilidad" className="ira-met__indicador-titulo">
                <span>{permeabilidad.nombre}</span> <span className="ira-met__peso ira-cifra">{permeabilidad.peso}</span>
              </h3>
              <p className="ira-met__texto"><strong>{t.ind.queMide}:</strong> {permeabilidad.queMide}</p>
              <p className="ira-met__texto"><strong>{t.ind.unidad}:</strong> {permeabilidad.unidad}</p>

              <h4 className="ira-met__h4">{permeabilidad.blancosTitulo}</h4>
              <Tabla
                cabecera={permeabilidad.blancosCabecera}
                filas={permeabilidad.blancos.map((b) => [b.blanco, b.ej, b.frontera])}
              />

              <h4 className="ira-met__h4">{permeabilidad.marcasTitulo}</h4>
              <p className="ira-met__nota">{permeabilidad.marcasNota}</p>
              <Acordeon titulo={permeabilidad.cierresTitulo}>
                <dl className="ira-met__marcas">
                  {permeabilidad.cierres.map(([c, n, e]) => (
                    <div key={c}><dt><span className="ira-met__codigo ira-met__codigo--cierre ira-cifra">{c}</span> {n}</dt><dd>{e}</dd></div>
                  ))}
                </dl>
              </Acordeon>
              <Acordeon titulo={permeabilidad.aperturasTitulo}>
                <dl className="ira-met__marcas">
                  {permeabilidad.aperturas.map(([c, n, e]) => (
                    <div key={c}><dt><span className="ira-met__codigo ira-met__codigo--apertura ira-cifra">{c}</span> {n}</dt><dd>{e}</dd></div>
                  ))}
                </dl>
              </Acordeon>
              <Acordeon titulo={permeabilidad.dificilesTitulo}>
                <dl className="ira-met__marcas">
                  {permeabilidad.dificiles.map(([n, e]) => <div key={n}><dt>{n}</dt><dd>{e}</dd></div>)}
                </dl>
              </Acordeon>

              <div className="ira-met__formula ira-met__formula--ind">
                <Formula>{permeabilidad.formula}</Formula>
              </div>
              <p className="ira-met__nota">{permeabilidad.formulaNombre}. {permeabilidad.formulaNota}</p>
            </article>
          </Seccion>

          {/* 8 · Pieza 3 */}
          <Seccion id="ficha" titulo={titulo.ficha}>
            <MarcadorPieza etiqueta={pieza(3)} texto={t.piezas.ficha} aviso={t.pieza} />
          </Seccion>

          {/* 9 · Excepción democrática + Pieza 8 */}
          <Seccion id="excepcion" titulo={titulo.excepcion}>
            <p className="ira-met__texto">{t.excepcion.intro}</p>
            <p className="ira-met__texto"><strong>{t.excepcion.verdad}</strong></p>
            <ol className="ira-met__condiciones">
              {t.excepcion.condiciones.map(([n, e]) => (
                <li key={n}><span className="ira-met__condicion-nombre">{n}.</span> {e}</li>
              ))}
            </ol>
            <p className="ira-met__texto">{t.excepcion.falla}</p>

            <MarcadorPieza etiqueta={pieza(8)} texto={t.piezas.arbol} aviso={t.pieza}>
              <Tabla
                className="ira-met__tabla-marco--dentro"
                cabecera={t.excepcion.ejemplosCabecera}
                filas={t.excepcion.ejemplos.map(([frase, si, razon]) => [
                  frase,
                  <span key="r" className={`ira-met__veredicto ira-met__veredicto--${si ? 'si' : 'no'}`}>
                    <span aria-hidden="true">{si ? '✓' : '✕'}</span> {si ? t.excepcion.si : t.excepcion.no}: {razon}
                  </span>,
                ])}
              />
            </MarcadorPieza>

            <h3 className="ira-met__h3">{t.excepcion.salvaguardasTitulo}</h3>
            <ul className="ira-met__salvaguardas">
              {t.excepcion.salvaguardas.map(([n, e]) => (
                <li key={n}><p className="ira-met__salvaguarda-nombre">{n}</p><p>{e}</p></li>
              ))}
            </ul>
          </Seccion>

          {/* 10 · Pieza 7 */}
          <Seccion id="cuenta-o-no" titulo={titulo['cuenta-o-no']}>
            <MarcadorPieza etiqueta={pieza(7)} texto={t.piezas.juego} aviso={t.pieza} />
          </Seccion>

          {/* 11 · Mínimos y solidez */}
          <Seccion id="minimos" titulo={titulo.minimos}>
            <Tabla cabecera={t.minimos.cabecera} filas={t.minimos.filas} />
            <ul className="ira-met__lista">{t.minimos.notas.map((n) => <li key={n}>{n}</li>)}</ul>
          </Seccion>

          {/* 12 · Límites */}
          <Seccion id="limites" titulo={titulo.limites}>
            <ol className="ira-met__limites">
              {t.limites.map(([n, e]) => (
                <li key={n}><p className="ira-met__limite-nombre">{n}</p><p>{e}</p></li>
              ))}
            </ol>
          </Seccion>

          {/* 13 · Registro de cambios */}
          <Seccion id="cambios" titulo={titulo.cambios}>
            {[t.cambios.v11, t.cambios.v1].map((v) => (
              <Acordeon key={v.titulo} titulo={`${v.titulo} · ${t.cambios.fecha}`}>
                <ul className="ira-met__lista">{v.decisiones.map((d) => <li key={d}>{d}</li>)}</ul>
              </Acordeon>
            ))}
          </Seccion>

          {/* 14 · Referencias */}
          <Seccion id="referencias" titulo={titulo.referencias}>
            <ul className="ira-met__referencias">{t.referencias.map((r) => <li key={r}>{r}</li>)}</ul>
            <p>
              <a href={MANUAL_URL} target="_blank" rel="noopener noreferrer" className="ira-met__enlace">
                {t.manual} →<span className="ira-sr"> {u.nuevaPestana}</span>
              </a>
            </p>
          </Seccion>

          {/* 15 · Pie de navegación */}
          <nav className="ira-met__pie-nav" aria-label={u.navPie}>
            <Link to="/metodologia" className="ira-boton ira-boton--secundario">{t.pie.volver}</Link>
            <span className="ira-met__siguiente" aria-disabled="true">{t.pie.siguiente}</span>
          </nav>
        </div>
      </div>
    </div>
  );
}
