// IRA · Metodología 2.0 · página genérica de un parámetro con manual cerrado (P3, P5, P6).
// Todo el contenido sale de su textos*.js, que a su vez sale de research/manual/P*.md.
// Cada sección se pinta solo si su bloque existe; el orden lo marca t.secciones.
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppContext } from '../../App.jsx';
import AvisoVersion from './AvisoVersion.jsx';
import { NOTA_EN } from './textosComunes.js';
import { Aparecer } from './Visuales.jsx';
import '../../styles/metodologia.css';
import '../../styles/metodologia-p2.css';
import '../../styles/metodologia-manual.css';
import '../../styles/identidad.css';

const TONOS = ['polariza', 'neutra', 'empatica'];

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

function Pildora({ tono, children }) {
  return <span className={`ira-p2-pildora ira-p2--${tono}`}>{children}</span>;
}

function Tabla({ cabecera, filas, clase = '', render }) {
  return (
    <div className="ira-met__tabla-marco">
      <table className={`ira-met__tabla ira-man-tabla ${clase}`}>
        <thead><tr>{cabecera.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((celda, j) => (
                <td key={j} data-rotulo={cabecera[j]}>{render ? render(celda, j, fila) : celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
      <nav className="ira-met__indice ira-met__indice--ancho" aria-label={t.ui.indice}>
        <p className="ira-met__indice-titulo">{t.ui.indice}</p>
        {enlaces}
      </nav>
      <nav className="ira-met__indice ira-met__indice--movil" aria-label={t.ui.indice}>
        <details className="ira-met__acordeon">
          <summary><span>{t.ui.indiceDesplegar}</span><Chevron /></summary>
          <div className="ira-met__acordeon-cuerpo">{enlaces}</div>
        </details>
      </nav>
    </>
  );
}

/** Pinta un código con el color de su signo: la letra decide (tabla t.signos). */
function Codigo({ codigo, signos }) {
  const tono = signos[codigo] ?? signos[codigo.replace(/\d+$/, '')] ?? 'otro';
  return <Pildora tono={tono}>{codigo}</Pildora>;
}

// ── Secciones ─────────────────────────────────────────────────────────────────

const SECCIONES = {
  'la-idea': (t) => (
    <>
      <Aparecer as="p" className="ira-p2-lema">
        <span>{t.idea.lema[0]}</span>
        <span className="ira-p2-lema__fuerte">{t.idea.lema[1]}</span>
      </Aparecer>
      <p className="ira-met__texto">{t.idea.texto}</p>
      <ul className="ira-p2-tres">
        {t.idea.tres.map((x, i) => (
          <Aparecer as="li" key={x.codigo} className={`ira-p2-tres__item ira-p2--${TONOS[i]}`} style={{ '--retardo': `${i * 80}ms` }}>
            <span className="ira-man-tres__cab">
              <span className="ira-p2-tres__marca" aria-hidden="true" />
              <span className="ira-p2-codigo ira-cifra">{x.codigo}</span>
            </span>
            <span className="ira-p2-tres__nombre">{x.nombre}</span>
            <span className="ira-p2-tres__texto">{x.texto}</span>
          </Aparecer>
        ))}
      </ul>
    </>
  ),

  'que-mide': (t) => (
    <>
      <ul className="ira-man-teoria">
        {t.teoria.items.map(([titulo, texto], i) => (
          <Aparecer as="li" key={titulo} className="ira-man-teoria__item" style={{ '--retardo': `${(i % 2) * 70}ms` }}>
            <h3 className="ira-met__h3">{titulo}</h3>
            <p>{texto}</p>
          </Aparecer>
        ))}
      </ul>
      {t.teoria.nota && <p className="ira-met__nota">{t.teoria.nota}</p>}
      {t.teoria.cautela && (
        <div className="ira-met__cautela">
          <p className="ira-met__cautela-titulo">{t.ui.cautela}</p>
          <p>{t.teoria.cautela}</p>
        </div>
      )}
    </>
  ),

  'que-no-mide': (t) => (
    <>
      <ul className="ira-met__desvios">
        {t.noMide.filas.map(([fenomeno, ejemplo, destino], i) => (
          <Aparecer as="li" key={fenomeno} className="ira-met__desvio" style={{ '--retardo': `${(i % 2) * 70}ms` }}>
            <span className="ira-met__desvio-fenomeno">
              {fenomeno}
              {ejemplo && <span className="ira-man-ejemplo">{ejemplo}</span>}
            </span>
            <span className="ira-met__desvio-flecha" aria-hidden="true">→</span>
            <span className="ira-met__desvio-destino">
              {/^P\d/.test(destino)
                ? <span className="ira-met__etiqueta-param ira-cifra">{destino}</span>
                : <span className="ira-met__destino-nota">{destino}</span>}
            </span>
          </Aparecer>
        ))}
      </ul>
      {t.noMide.orden && (
        <>
          <h3 className="ira-met__h3">{t.noMide.orden.titulo}</h3>
          <p className="ira-met__texto">{t.noMide.orden.intro}</p>
          <ol className="ira-man-orden">
            {t.noMide.orden.pasos.map(([pregunta, p]) => (
              <li key={p}><span className="ira-man-orden__p">{pregunta}</span><span className="ira-met__etiqueta-param ira-cifra">{p}</span></li>
            ))}
          </ol>
        </>
      )}
      {t.noMide.reglas.map((r) => <p key={r} className="ira-p2-excepcion">{r}</p>)}
    </>
  ),

  procedimiento: (t) => (
    <>
      <ol className="ira-p2-eslabones ira-man-pasos">
        {t.procedimiento.pasos.map(([titulo, texto], i) => (
          <Aparecer as="li" key={titulo} className="ira-p2-eslabon" style={{ '--retardo': `${i * 90}ms` }}>
            <span className="ira-p2-eslabon__n ira-cifra" aria-hidden="true">{i + 1}</span>
            <h3 className="ira-met__h3">{titulo}</h3>
            {Array.isArray(texto)
              ? <ul className="ira-met__lista">{texto.map((x) => <li key={x}>{x}</li>)}</ul>
              : <p>{texto}</p>}
          </Aparecer>
        ))}
      </ol>
      {t.procedimiento.nota && <p className="ira-met__nota">{t.procedimiento.nota}</p>}
    </>
  ),

  unidad: (t) => (
    <>
      <p className="ira-man-definicion">{t.unidad.definicion}</p>
      <ul className="ira-met__lista">{t.unidad.reglas.map((x) => <li key={x}>{x}</li>)}</ul>
    </>
  ),

  prueba: (t) => (
    <>
      {t.prueba.intro && <p className="ira-met__texto">{t.prueba.intro}</p>}
      {t.prueba.condiciones && (
        <ol className="ira-man-condiciones">
          {t.prueba.condiciones.map(([titulo, texto], i) => (
            <Aparecer as="li" key={titulo} className="ira-man-condicion" style={{ '--retardo': `${i * 80}ms` }}>
              <span className="ira-man-condicion__n ira-cifra" aria-hidden="true">{i + 1}</span>
              <p className="ira-man-condicion__titulo">{titulo}</p>
              {texto && <p>{texto}</p>}
            </Aparecer>
          ))}
        </ol>
      )}
      {t.prueba.cierre && <p className="ira-met__destacado ira-met__destacado--oro">{t.prueba.cierre}</p>}
      {t.prueba.tabla && (
        <Tabla
          cabecera={t.prueba.tabla.cabecera}
          filas={t.prueba.tabla.filas}
          clase="ira-man-tabla--contraste"
          render={(c, j) => (t.prueba.tabla.codigos && j === t.prueba.tabla.cabecera.length - 1 ? <Codigo codigo={c} signos={t.signos} /> : c)}
        />
      )}
      {t.prueba.notas && t.prueba.notas.map(([titulo, texto]) => (
        <div key={titulo} className="ira-man-regla">
          <p className="ira-man-regla__titulo">{titulo}</p>
          <p>{texto}</p>
        </div>
      ))}
    </>
  ),

  codigos: (t) => (
    <>
      <Tabla
        cabecera={t.codigos.cabecera}
        filas={t.codigos.filas}
        clase="ira-man-tabla--codigos"
        render={(c, j, fila) => {
          if (j === 0) return <Codigo codigo={c} signos={t.signos} />;
          if (j === fila.length - 1) return <span className={`ira-man-signo ira-p2--${t.signos[fila[0]] ?? t.signos[fila[0].replace(/\d+$/, '')] ?? 'otro'}`}>{c}</span>;
          return c;
        }}
      />
      {t.codigos.nota && <p className="ira-met__nota">{t.codigos.nota}</p>}
      {t.codigos.reglas && (
        <>
          <h3 className="ira-met__h3">{t.codigos.reglasTitulo}</h3>
          {t.codigos.reglas.map(([titulo, texto]) => (
            <div key={titulo} className="ira-man-regla">
              <p className="ira-man-regla__titulo">{titulo}</p>
              <p>{texto}</p>
            </div>
          ))}
        </>
      )}
    </>
  ),

  lista: (t) => (
    <>
      <p className="ira-met__texto">{t.lista.intro}</p>
      <ul className="ira-man-etiquetas">{t.lista.etiquetas.map((e) => <li key={e} className="ira-cifra">{e}</li>)}</ul>
      <ul className="ira-met__lista">{t.lista.reglas.map((x) => <li key={x}>{x}</li>)}</ul>
    </>
  ),

  formula: (t) => (
    <>
      <div className="ira-met__formula"><p className="ira-met__formula-linea ira-cifra">{t.formula.linea}</p></div>
      <ul className="ira-p2-leyenda">
        {t.formula.leyenda.map(([k, v, tono]) => (
          <li key={k} className={`ira-p2--${tono}`}><span className="ira-p2-leyenda__k ira-cifra">{k}</span><span>{v}</span></li>
        ))}
      </ul>
      <p className="ira-met__texto">{t.formula.explicacion}</p>
      <Tabla cabecera={t.formula.tabla.cabecera} filas={t.formula.tabla.filas} clase="ira-man-tabla--cifras" />
      {t.formula.nota && <p className="ira-met__nota">{t.formula.nota}</p>}
      <h3 className="ira-met__h3">{t.formula.minimos.titulo}</h3>
      <ul className="ira-man-umbrales">
        {t.formula.minimos.filas.map(([n, r]) => (
          <li key={n}><span className="ira-man-umbrales__n ira-cifra">{n}</span><span>{r}</span></li>
        ))}
      </ul>
      <p className="ira-met__nota">{t.formula.minimos.nota}</p>
    </>
  ),

  ficha: (t) => (
    <>
      <p className="ira-met__texto">{t.ficha.intro}</p>
      <ul className="ira-met__lista">{t.ficha.items.map((x) => <li key={x}>{x}</li>)}</ul>
      {t.ficha.aviso && <p className="ira-met__destacado ira-met__destacado--salvia">{t.ficha.aviso}</p>}
    </>
  ),

  casos: (t) => (
    <>
      <div className="ira-met__tabla-marco">
        <table className="ira-met__tabla ira-man-tabla ira-man-casos">
          <thead><tr>{t.casos.cabecera.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {t.casos.filas.map(([caso, resolucion, porque, tono]) => (
              <tr key={caso}>
                <td data-rotulo={t.casos.cabecera[0]}>{caso}</td>
                <td data-rotulo={t.casos.cabecera[1]}><Pildora tono={tono}>{resolucion}</Pildora></td>
                <td data-rotulo={t.casos.cabecera[2]}>{porque}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Acordeon titulo={t.casos.desacuerdoTitulo}>
        <ul className="ira-met__lista">{t.casos.desacuerdo.map((x) => <li key={x}>{x}</li>)}</ul>
      </Acordeon>
    </>
  ),

  limites: (t) => (
    <ul className="ira-p2-pendiente">
      {t.limites.map(([n, e]) => (
        <li key={n} className="ira-p2-pendiente__item ira-man-limite"><p className="ira-p2-pendiente__nombre">{n}</p><p>{e}</p></li>
      ))}
    </ul>
  ),

  validacion: (t) => <Tabla cabecera={t.validacion.cabecera} filas={t.validacion.filas} />,

  pendiente: (t) => (
    <ul className="ira-p2-pendiente">
      {t.pendiente.map(([n, e]) => (
        <li key={n} className="ira-p2-pendiente__item">
          <span className="ira-p2-pendiente__estado ira-cifra">{t.ui.pendiente}</span>
          <p className="ira-p2-pendiente__nombre">{n}</p>
          <p>{e}</p>
        </li>
      ))}
    </ul>
  ),

  cambios: (t) => (
    <Acordeon titulo={t.cambios.titulo}>
      <ul className="ira-met__lista">{t.cambios.decisiones.map((d) => <li key={d}>{d}</li>)}</ul>
    </Acordeon>
  ),

  referencias: (t, manualUrl) => (
    <>
      <p className="ira-met__nota">{t.ui.referenciasNota}</p>
      <ul className="ira-met__referencias">{t.referencias.map((r) => <li key={r}>{r}</li>)}</ul>
      <p>
        <a href={manualUrl} target="_blank" rel="noopener noreferrer" className="ira-met__enlace">
          {t.ui.manual}<span className="ira-sr"> {t.ui.nuevaPestana}</span>
        </a>
      </p>
    </>
  ),
};

export default function MetodologiaManual({ textos, manualUrl, anterior, siguiente }) {
  const { hash } = useLocation();
  const { lang } = useContext(AppContext);
  const idioma = lang === 'en' ? 'en' : 'es';
  const t = textos[idioma];

  useEffect(() => {
    const id = setTimeout(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container ira-met ira-met--p1 ira-met--manual" style={{ maxWidth: 1180 }}>
      <AvisoVersion lang={idioma} />
      {idioma === 'en' && <p className="ira-met__nota ira-met__nota-en">{NOTA_EN}</p>}

      <Link to="/metodologia" className="ira-met__volver">{t.ui.volver}</Link>
      <header className="ira-met__cabecera ira-met__cabecera--p1">
        <div className="ira-met__cabecera-texto">
          <p className="ira-met__rotulo">{t.rotulo} <span className="ira-man-estado">{t.estado}</span></p>
          <h1 className="ira-met__titulo">{t.titulo}</h1>
          <p className="ira-met__frase">{t.frase}</p>
          <p className="ira-man-motor">{t.ui.motor}</p>
        </div>
        <svg viewBox="0 0 200 200" className="ira-met__emblema ira-man-emblema" aria-hidden="true">
          <line x1="40" y1="100" x2="160" y2="100" className="ira-man-emblema__eje" />
          <circle cx="40" cy="100" r="18" className="ira-man-emblema__p ira-p2--polariza" />
          <circle cx="100" cy="100" r="13" className="ira-man-emblema__p ira-p2--neutra" />
          <circle cx="160" cy="100" r="18" className="ira-man-emblema__p ira-p2--empatica" />
          <text x="100" y="152" textAnchor="middle" className="ira-man-emblema__codigo ira-cifra">{t.codigo}</text>
        </svg>
      </header>

      <div className="ira-met__rejilla">
        <IndiceSecciones t={t} />
        <div className="ira-met__cuerpo">
          {t.secciones.map((s, i) => (
            <Seccion key={s.id} id={s.id} n={i + 1} titulo={s.titulo} className={s.banda ? 'ira-met__seccion--banda' : ''}>
              {SECCIONES[s.id](t, manualUrl)}
            </Seccion>
          ))}

          <nav className="ira-met__pie-nav" aria-label={t.ui.navPie}>
            {anterior && <Link to={anterior.ruta} className="ira-boton ira-boton--secundario">{anterior[idioma]}</Link>}
            <Link to="/metodologia" className="ira-boton ira-boton--secundario">{t.ui.volverIndice}</Link>
            {siguiente && <Link to={siguiente.ruta} className="ira-boton ira-boton--principal">{siguiente[idioma]}</Link>}
          </nav>
        </div>
      </div>
    </div>
  );
}
