// IRA · /metodologia/p1 — P1 La frontera del nosotros (Metodología 2.0, manual v1.1).
// Todo el contenido sale de research/manual/P1.md (ver textosP1.js); las cifras salen de
// src/data/metodologia/p1.json. La página no calcula P1.
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppContext } from '../../App.jsx';
import AvisoVersion from './AvisoVersion.jsx';
import MarcadorPieza from './MarcadorPieza.jsx';
import { Aparecer, BarraPesos, EscalaSolidez, Icono, LineaTiempo, Pestanas, Puntos } from './Visuales.jsx';
import EtiquetaPuntuacion from '../ui/EtiquetaPuntuacion.jsx';
import { TEXTOS_P1 } from './textosP1.js';
import datosP1 from '../../data/metodologia/p1.json';
import '../../styles/metodologia.css';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P1.md';
const ICONOS_PASO = ['extraer', 'revisar', 'clasificar', 'calcular'];

const UI = {
  es: { navPie: 'Navegación entre parámetros', pieza: 'Pieza', nuevaPestana: '(se abre en una pestaña nueva)' },
  en: { navPie: 'Navigation between parameters', pieza: 'Piece', nuevaPestana: '(opens in a new tab)' },
};

function Seccion({ id, n, titulo, children, className = '' }) {
  return (
    <section id={id} className={`ira-met__seccion ira-met__seccion--p1 ${className}`} aria-labelledby={`${id}-titulo`}>
      <Aparecer className="ira-met__seccion-cab">
        <span className="ira-met__seccion-n ira-cifra" aria-hidden="true">{String(n).padStart(2, '0')}</span>
        <h2 id={`${id}-titulo`} className="ira-met__h2">{titulo}</h2>
      </Aparecer>
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
              {fila.map((celda, j) => <td key={j} data-rotulo={cabecera[j]}>{celda}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chevron() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-met__chevron"><polyline points="6 9 12 15 18 9" /></svg>;
}

function Acordeon({ titulo, children }) {
  return (
    <details className="ira-met__acordeon">
      <summary><span>{titulo}</span><Chevron /></summary>
      <div className="ira-met__acordeon-cuerpo">{children}</div>
    </details>
  );
}

function Formula({ children }) {
  return <p className="ira-met__formula-linea ira-cifra">{children}</p>;
}

function Destacado({ children, tono = 'oro' }) {
  return <Aparecer as="p" className={`ira-met__destacado ira-met__destacado--${tono}`}>{children}</Aparecer>;
}

function Valor({ valor, t, lang }) {
  if (valor == null) return <span className="ira-met__no-cuenta">{t.ind.noCuenta}</span>;
  return <EtiquetaPuntuacion puntuacion={Number(valor)} variante="punto" lang={lang} decimales={0} />;
}

// Índice lateral con la sección actual resaltada (y desplegable en pantallas estrechas)
function IndiceSecciones({ t }) {
  const [actual, setActual] = useState(t.secciones[0].id);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const obs = new IntersectionObserver((entradas) => {
      const vista = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vista) setActual(vista.target.id);
    }, { rootMargin: '-15% 0px -70% 0px' });
    t.secciones.forEach((s) => { const nodo = document.getElementById(s.id); if (nodo) obs.observe(nodo); });
    return () => obs.disconnect();
  }, [t]);
  const enlaces = (
    <ol className="ira-met__indice-lista">
      {t.secciones.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className={s.id === actual ? 'is-actual' : undefined} aria-current={s.id === actual ? 'location' : undefined}>
            <span className="ira-met__indice-n ira-cifra" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {s.titulo}
          </a>
        </li>
      ))}
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
          <summary><span>{t.indiceDesplegar}</span><Chevron /></summary>
          <div className="ira-met__acordeon-cuerpo">{enlaces}</div>
        </details>
      </nav>
    </>
  );
}

// ── Contenido de cada indicador (va dentro de las pestañas) ───────────────────
function PanelAlcance({ t, lang }) {
  const a = t.ind.alcance;
  return (
    <>
      <p className="ira-met__panel-mide">{a.queMide}</p>
      <p className="ira-met__nota"><strong>{t.ind.unidad}:</strong> {a.unidad}</p>
      <Tabla
        cabecera={[t.ind.codigo, t.ind.categoria, t.ind.valor, t.ind.ejemplos]}
        filas={a.codigos.map((c) => [
          <span key="c" className="ira-met__codigo ira-cifra">{c.codigo}</span>,
          c.categoria,
          <Valor key="v" valor={c.valor} t={t} lang={lang} />,
          c.ej,
        ])}
      />
      <Acordeon titulo={t.ind.reglas}>
        <ol className="ira-met__lista">{a.reglas.map((r) => <li key={r}>{r}</li>)}</ol>
      </Acordeon>
      <div className="ira-met__formula ira-met__formula--ind"><Formula>{a.formula}</Formula></div>
    </>
  );
}

function PanelInterpelacion({ t }) {
  const a = t.ind.interpelacion;
  return (
    <>
      <p className="ira-met__panel-mide">{a.queMide}</p>
      <p className="ira-met__nota"><strong>{t.ind.unidad}:</strong> {a.unidad}</p>
      <ul className="ira-met__dos">
        {a.codigos.map((c) => (
          <li key={c.codigo} className={`ira-met__dos-item ira-met__dos-item--${c.codigo === '2I' ? 'incl' : 'contra'}`}>
            <span className="ira-met__codigo ira-cifra">{c.codigo}</span>
            <span className="ira-met__dos-nombre">{c.categoria}</span>
            <span className="ira-met__dos-ej">{c.ej}</span>
          </li>
        ))}
      </ul>
      <p className="ira-met__regla">{a.regla}</p>
      <div className="ira-met__formula ira-met__formula--ind"><Formula>{a.formula}</Formula></div>
    </>
  );
}

function Marca({ codigo, nombre, ejemplo, tipo }) {
  return (
    <li className={`ira-met__marca ira-met__marca--${tipo}`}>
      <details>
        <summary>
          <span className="ira-met__codigo ira-cifra">{codigo}</span>
          <span className="ira-met__marca-nombre">{nombre}</span>
        </summary>
        <p className="ira-met__marca-ej">{ejemplo}</p>
      </details>
    </li>
  );
}

function PanelPermeabilidad({ t }) {
  const a = t.ind.permeabilidad;
  const zonaDe = (b) => (b.es === true ? 'si' : b.es === false ? 'no' : 'depende');
  return (
    <>
      <p className="ira-met__panel-mide">{a.queMide}</p>
      <p className="ira-met__nota"><strong>{t.ind.unidad}:</strong> {a.unidad}</p>

      <h4 className="ira-met__h4">{a.blancosTitulo}</h4>
      <div className="ira-met__blancos">
        {t.blancosZonas.map((z) => (
          <div key={z.id} className={`ira-met__zona ira-met__zona--${z.id}`}>
            <p className="ira-met__zona-titulo"><Icono nombre={z.icono} tamano={18} /> {z.nombre}</p>
            <ul>
              {a.blancos.filter((b) => zonaDe(b) === z.id).map((b) => (
                <li key={b.blanco}>
                  <span className="ira-met__zona-blanco">{b.blanco}</span>
                  <span className="ira-met__zona-ej">{b.ej}</span>
                  {b.frontera.length > 3 && <span className="ira-met__zona-nota">{b.frontera}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h4 className="ira-met__h4">{a.marcasTitulo}</h4>
      <p className="ira-met__nota">{a.marcasNota} {t.verEjemplo}</p>
      <div className="ira-met__tablero">
        <div className="ira-met__tablero-col">
          <p className="ira-met__tablero-titulo ira-met__tablero-titulo--muro"><Icono nombre="muro" tamano={22} /> {t.muroTitulo}</p>
          <ul className="ira-met__marcas-lista ira-met__marcas-lista--muro">
            {a.cierres.map(([c, nombre, e]) => <Marca key={c} codigo={c} nombre={nombre} ejemplo={e} tipo="cierre" />)}
          </ul>
        </div>
        <div className="ira-met__tablero-col">
          <p className="ira-met__tablero-titulo ira-met__tablero-titulo--puerta"><Icono nombre="puerta" tamano={22} /> {t.puertaTitulo}</p>
          <ul className="ira-met__marcas-lista ira-met__marcas-lista--puerta">
            {a.aperturas.map(([c, nombre, e]) => <Marca key={c} codigo={c} nombre={nombre} ejemplo={e} tipo="apertura" />)}
          </ul>
        </div>
      </div>

      <Acordeon titulo={a.dificilesTitulo}>
        <dl className="ira-met__marcas">
          {a.dificiles.map(([nombre, e]) => <div key={nombre}><dt>{nombre}</dt><dd>{e}</dd></div>)}
        </dl>
      </Acordeon>

      <div className="ira-met__formula ira-met__formula--ind"><Formula>{a.formula}</Formula></div>
      <p className="ira-met__nota">{a.formulaNombre}. {a.formulaNota}</p>
    </>
  );
}

export default function MetodologiaP1() {
  const { lang } = useContext(AppContext);
  const { hash } = useLocation();
  const t = TEXTOS_P1[lang] ?? TEXTOS_P1.es;
  const u = UI[lang] ?? UI.es;
  const numero = Object.fromEntries(t.secciones.map((s, i) => [s.id, i + 1]));
  const titulo = Object.fromEntries(t.secciones.map((s) => [s.id, s.titulo]));
  const pieza = (k) => `${u.pieza} ${k}`;
  const sec = (id) => ({ id, n: numero[id], titulo: titulo[id] });

  useEffect(() => {
    // Tras la restauración de scroll del navegador, para que el ancla gane
    const id = setTimeout(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(id);
    // solo al entrar en la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { alcance, interpelacion, permeabilidad } = t.ind;
  const pesos = [
    { id: 'alcance', nombre: t.pesos.alcance, peso: 50, cifra: alcance.peso },
    { id: 'permeabilidad', nombre: t.pesos.permeabilidad, peso: 28, cifra: permeabilidad.peso },
    { id: 'interpelacion', nombre: t.pesos.interpelacion, peso: 22, cifra: interpelacion.peso },
  ];
  const marcasSolidez = Object.values(datosP1.fichas).map((f) => ({
    id: f.id, nombre: t.solidez.discursos[f.id], valor: f.nosotros_clasificables, lectura: t.solidez.lecturas[f.id],
  }));
  const minimos = [[15, t.minimos.filas[0]], [3, t.minimos.filas[1]], [3, t.minimos.filas[2]]];

  return (
    <div className="main-container ira-met ira-met--p1" style={{ maxWidth: 1180 }}>
      <AvisoVersion lang={lang} />

      <Link to="/metodologia" className="ira-met__volver">{t.volverIndice}</Link>
      <header className="ira-met__cabecera ira-met__cabecera--p1">
        <div className="ira-met__cabecera-texto">
          <p className="ira-met__rotulo">{t.rotulo}</p>
          <h1 className="ira-met__titulo">{t.titulo}</h1>
          <p className="ira-met__frase">{t.frase}</p>
        </div>
        <svg viewBox="0 0 200 200" className="ira-met__emblema" aria-hidden="true">
          <circle cx="100" cy="100" r="92" className="ira-met__emblema-muro" />
          <circle cx="100" cy="100" r="64" className="ira-met__emblema-anillo ira-met__emblema-anillo--2" />
          <circle cx="100" cy="100" r="40" className="ira-met__emblema-anillo" />
          <circle cx="100" cy="100" r="20" className="ira-met__emblema-centro" />
        </svg>
      </header>

      <div className="ira-met__rejilla">
        <IndiceSecciones t={t} />

        <div className="ira-met__cuerpo">
          {/* En una frase: la fórmula y sus pesos */}
          <Seccion {...sec('en-una-frase')}>
            <Aparecer><BarraPesos partes={pesos} etiqueta={t.pesosEtiqueta} /></Aparecer>
            <div className="ira-met__formula" role="group" aria-label={t.ind.formula}>
              {t.formula.map((l) => <Formula key={l}>{l}</Formula>)}
            </div>
            <p className="ira-met__nota">{t.formulaNota}</p>
          </Seccion>

          {/* Por qué importa */}
          <Seccion {...sec('por-que-importa')} className="ira-met__seccion--banda">
            <p className="ira-met__entrada">{t.porque.entrada}</p>
            <LineaTiempo pasos={t.porque.tiempo} eje={t.porque.eje} />
            <ol className="ira-met__cadena">
              {t.porque.pasos.map((p, i) => (
                <Aparecer as="li" key={p.titulo} className="ira-met__eslabon" style={{ '--retardo': `${i * 90}ms` }}>
                  <span className="ira-met__eslabon-n ira-cifra" aria-hidden="true">{i + 1}</span>
                  <h3 className="ira-met__h3">{p.titulo}</h3>
                  <p className="ira-met__eslabon-texto">{p.texto}</p>
                  <p className="ira-met__eslabon-fuentes">{p.fuentes}</p>
                </Aparecer>
              ))}
            </ol>
            <Destacado tono="rojo">{t.porque.cita}</Destacado>
          </Seccion>

          {/* Pieza 1 */}
          <Seccion {...sec('mapa')}>
            <MarcadorPieza etiqueta={pieza(1)} texto={t.piezas.mapa} aviso={t.pieza} />
          </Seccion>

          {/* Qué mide y por qué */}
          <Seccion {...sec('que-mide')}>
            {t.que.intro.map((p) => <p key={p} className="ira-met__texto">{p}</p>)}
            <h3 className="ira-met__h3">{t.que.teoriaTitulo}</h3>
            <dl className="ira-met__teoria">
              {t.que.teoria.map((a, i) => (
                <Aparecer key={a.autor} style={{ '--retardo': `${(i % 2) * 90}ms` }}>
                  <dt>{a.autor}</dt>
                  <dd>{a.texto}</dd>
                </Aparecer>
              ))}
            </dl>
            <div className="ira-met__cautela">
              <p className="ira-met__cautela-titulo">{t.que.cautelaTitulo}</p>
              <p>{t.que.cautela}</p>
            </div>
          </Seccion>

          {/* Qué no mide */}
          <Seccion {...sec('que-no-mide')}>
            <ul className="ira-met__desvios">
              {t.noMide.filas.map((f, i) => (
                <Aparecer as="li" key={f.fenomeno} className="ira-met__desvio" style={{ '--retardo': `${(i % 3) * 70}ms` }}>
                  <span className="ira-met__desvio-fenomeno">{f.fenomeno}</span>
                  <span className="ira-met__desvio-flecha" aria-hidden="true">→</span>
                  <span className="ira-met__desvio-destino">
                    <span className="ira-sr">{t.noMide.cabecera[1]}: </span>
                    {f.destino.map((d) => <span key={d} className="ira-met__etiqueta-param ira-cifra">{d}</span>)}
                    {f.nota && <span className="ira-met__destino-nota">{f.nota}</span>}
                  </span>
                </Aparecer>
              ))}
            </ul>
            <Destacado>{t.noMide.regla}</Destacado>
          </Seccion>

          {/* Cómo se aplica */}
          <Seccion {...sec('como-se-aplica')}>
            <ol className="ira-met__pasos">
              {t.aplica.pasos.map((p, i) => (
                <Aparecer as="li" key={p.nombre} className={`ira-met__paso${i === 2 ? ' ira-met__paso--ia' : ''}`} style={{ '--retardo': `${i * 90}ms` }}>
                  <span className="ira-met__paso-cab">
                    <span className="ira-met__paso-n ira-cifra" aria-hidden="true">{i + 1}</span>
                    <Icono nombre={ICONOS_PASO[i]} tamano={26} className="ira-met__paso-icono" />
                  </span>
                  <h3 className="ira-met__h3">{p.nombre}</h3>
                  <p className="ira-met__paso-quien">{p.quien}</p>
                  <p className="ira-met__paso-texto">{p.texto}</p>
                </Aparecer>
              ))}
            </ol>
            <Destacado tono="salvia">{t.aplica.clave}</Destacado>
            <p className="ira-met__nota">{t.aplica.reproducibilidad}</p>
          </Seccion>

          {/* Pieza 2 */}
          <Seccion {...sec('discurso-anotado')}>
            <MarcadorPieza etiqueta={pieza(2)} texto={t.piezas.anotado} aviso={t.pieza} />
          </Seccion>

          {/* Los tres indicadores, en pestañas */}
          <Seccion {...sec('indicadores')}>
            <Pestanas
              etiqueta={t.pestanasEtiqueta}
              pestanas={[
                { id: 'alcance', nombre: alcance.nombre, peso: alcance.peso, contenido: <PanelAlcance t={t} lang={lang} /> },
                { id: 'interpelacion', nombre: interpelacion.nombre, peso: interpelacion.peso, contenido: <PanelInterpelacion t={t} /> },
                { id: 'permeabilidad', nombre: permeabilidad.nombre, peso: permeabilidad.peso, contenido: <PanelPermeabilidad t={t} /> },
              ]}
            />
          </Seccion>

          {/* Pieza 3 */}
          <Seccion {...sec('ficha')}>
            <MarcadorPieza etiqueta={pieza(3)} texto={t.piezas.ficha} aviso={t.pieza} />
          </Seccion>

          {/* Excepción democrática + Pieza 8 */}
          <Seccion {...sec('excepcion')}>
            <p className="ira-met__texto">{t.excepcion.intro}</p>
            <Destacado>{t.excepcion.verdad}</Destacado>
            <ol className="ira-met__controles">
              {t.excepcion.condiciones.map(([nombre, e], i) => (
                <Aparecer as="li" key={nombre} className="ira-met__control" style={{ '--retardo': `${i * 90}ms` }}>
                  <span className="ira-met__control-n ira-cifra" aria-hidden="true">{i + 1}</span>
                  <h3 className="ira-met__h3">{nombre}</h3>
                  <p>{e}</p>
                </Aparecer>
              ))}
            </ol>
            <div className="ira-met__resultados">
              <p className="ira-met__resultado ira-met__resultado--si"><span aria-hidden="true">✓</span> {t.resultados.si}</p>
              <p className="ira-met__resultado ira-met__resultado--no"><span aria-hidden="true">✕</span> {t.resultados.no}</p>
            </div>

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
              {t.excepcion.salvaguardas.map(([nombre, e], i) => (
                <li key={nombre}>
                  <Icono nombre={i === 0 ? 'senalar' : 'repositorio'} tamano={22} className="ira-met__salvaguarda-icono" />
                  <p className="ira-met__salvaguarda-nombre">{nombre}</p>
                  <p>{e}</p>
                </li>
              ))}
            </ul>
          </Seccion>

          {/* Pieza 7 */}
          <Seccion {...sec('cuenta-o-no')}>
            <MarcadorPieza etiqueta={pieza(7)} texto={t.piezas.juego} aviso={t.pieza} />
          </Seccion>

          {/* Mínimos y solidez */}
          <Seccion {...sec('minimos')}>
            <h3 className="ira-met__h3">{t.solidez.minimoTitulo}</h3>
            <ul className="ira-met__minimos">
              {minimos.map(([k, [ind, peso, texto]]) => (
                <Aparecer as="li" key={ind} className="ira-met__minimo">
                  <span className="ira-met__minimo-cab">
                    <span className="ira-met__minimo-ind">{ind}</span>
                    <span className="ira-met__peso ira-cifra">{peso}</span>
                  </span>
                  <Puntos n={k} />
                  <span className="ira-met__minimo-texto">{texto}</span>
                </Aparecer>
              ))}
            </ul>
            <h3 className="ira-met__h3">{t.solidez.titulo}</h3>
            <EscalaSolidez tramos={t.solidez.tramos} marcas={marcasSolidez} etiqueta={t.solidez.titulo} />
            <ul className="ira-met__lista">{t.minimos.notas.map((x) => <li key={x}>{x}</li>)}</ul>
          </Seccion>

          {/* Límites */}
          <Seccion {...sec('limites')}>
            <ol className="ira-met__limites">
              {t.limites.map(([nombre, e]) => (
                <li key={nombre}><p className="ira-met__limite-nombre">{nombre}</p><p>{e}</p></li>
              ))}
            </ol>
          </Seccion>

          {/* Registro de cambios */}
          <Seccion {...sec('cambios')}>
            {[t.cambios.v11, t.cambios.v1].map((v) => (
              <Acordeon key={v.titulo} titulo={`${v.titulo} · ${t.cambios.fecha}`}>
                <ul className="ira-met__lista">{v.decisiones.map((d) => <li key={d}>{d}</li>)}</ul>
              </Acordeon>
            ))}
          </Seccion>

          {/* Referencias */}
          <Seccion {...sec('referencias')}>
            <ul className="ira-met__referencias">{t.referencias.map((r) => <li key={r}>{r}</li>)}</ul>
            <p>
              <a href={MANUAL_URL} target="_blank" rel="noopener noreferrer" className="ira-met__enlace">
                {t.manual} →<span className="ira-sr"> {u.nuevaPestana}</span>
              </a>
            </p>
          </Seccion>

          <nav className="ira-met__pie-nav" aria-label={u.navPie}>
            <Link to="/metodologia" className="ira-boton ira-boton--secundario">{t.pie.volver}</Link>
            <span className="ira-met__siguiente" aria-disabled="true">{t.pie.siguiente}</span>
          </nav>
        </div>
      </div>
    </div>
  );
}
