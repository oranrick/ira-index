// IRA · /metodologia/p2 — P2 El marco metafórico (Metodología 2.0, borrador v0.1). SIMULACIÓN.
// Todo el contenido sale de research/manual/P2.md (ver textosP2.js). P2 aún no tiene fórmula:
// la página explica la regla y deja marcado lo pendiente.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AvisoVersion from './AvisoVersion.jsx';
import { Aparecer, Icono } from './Visuales.jsx';
import { Chispas, CifraAlVer, Segmentado, chispazo, tonoDe } from './Juego.jsx';
import { TEXTOS_P2 } from './textosP2.js';
import ApuntaMetafora from './piezas/ApuntaMetafora.jsx';
import MapaTeoria from './piezas/MapaTeoria.jsx';
import '../../styles/metodologia.css';
import '../../styles/metodologia-piezas.css';
import '../../styles/metodologia-p2.css';
import '../../styles/metodologia-juego.css';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P2.md';
const TONO_TITULO = 'oro';

// Iconos de trazo de los dominios (24 × 24, decorativos)
const TRAZOS_P2 = {
  guerra: <><path d="M4 20L16 8" /><path d="M14 6l4-2-2 4" /><path d="M20 20L8 8" /><path d="M10 6L6 4l2 4" /><path d="M6.5 15.5l2 2M17.5 15.5l-2 2" /></>,
  deporte: <><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" /><path d="M12 14v4M8 20h8" /></>,
  enfermedad: <><circle cx="12" cy="12" r="5" /><path d="M12 7V3M12 21v-4M7 12H3M21 12h-4M8.5 8.5L6 6M18 18l-2.5-2.5M15.5 8.5L18 6M6 18l2.5-2.5" /><circle cx="12" cy="3" r="0.8" /><circle cx="12" cy="21" r="0.8" /><circle cx="3" cy="12" r="0.8" /><circle cx="21" cy="12" r="0.8" /></>,
  inmunidad: <><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" /><path d="M8.5 12h7" /></>,
  animal: <><circle cx="7" cy="9" r="1.8" /><circle cx="11" cy="6" r="1.8" /><circle cx="15.5" cy="6.5" r="1.8" /><circle cx="18.5" cy="10.5" r="1.8" /><path d="M8 17c0-3 2-5.5 5-5.5s4.5 2.5 4.5 4.5c0 2-1.5 3-3 3-1.3 0-2-.6-3.2-.6S9.5 19 8.8 19C8.3 19 8 18 8 17z" /></>,
  catastrofe: <><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M6 11c0-4 3-7 7-7 2 0 3.5 1 4 2.5-1.5-.5-3.5 0-4.5 1.5S11 11 12 12" /></>,
  religion: <><path d="M12 3c2 3 4.5 4.8 4.5 8.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.5C7.5 7.8 10 6 12 3z" /><path d="M12 16v5M9 21h6" /></>,
  construccion: <><path d="M3 18h18" /><path d="M5 18v-4a7 7 0 0 1 14 0v4" /><path d="M9 18v-3a3 3 0 0 1 6 0v3" /><path d="M5 11h14" opacity="0.5" /></>,
  viaje: <><path d="M5 20c0-4 4-4 4-8s-4-4-4-8" strokeDasharray="2.4 2.4" /><circle cx="17" cy="7" r="2.5" /><path d="M17 9.5V20" /></>,
  familia: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></>,
  cuidado: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></>,
  otro: <><circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" /></>,
  persona: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></>,
};

function IconoP2({ nombre, tamano = 22, className = '' }) {
  if (!TRAZOS_P2[nombre]) return <Icono nombre={nombre} tamano={tamano} className={className} />;
  return (
    <svg viewBox="0 0 24 24" width={tamano} height={tamano} aria-hidden="true" className={`ira-met-icono ${className}`}>
      {TRAZOS_P2[nombre]}
    </svg>
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

function Destacado({ children, tono = 'oro' }) {
  return (
    <Aparecer as="p" className={`ira-met__destacado ira-met__destacado--${tono}`}>
      {children}
      <Chispas tono={tono} semilla={String(children)} cantidad={3} />
    </Aparecer>
  );
}

function Pildora({ resultado, t }) {
  return <span className={`ira-p2-pildora ira-p2--${resultado}`}>{t.resultados[resultado].nombre}</span>;
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

// ── Piezas de la página ───────────────────────────────────────────────────────

/** Misma imagen, dos destinos: una horquilla por dominio. En «Adivinar», el veredicto de cada
 *  rama queda tapado hasta que lo destapas: primero piensas tú, luego miras. */
function DosDestinos({ d, t }) {
  const [modo, setModo] = useState('ver');
  const [vistos, setVistos] = useState({});
  const [encima, setEncima] = useState({});
  const adivinar = modo === 'adivinar';
  const destapar = (clave, resultado, ev) => {
    if (!adivinar || vistos[clave]) return;
    chispazo(ev, resultado, 9);
    setVistos((v) => ({ ...v, [clave]: true }));
  };
  return (
    <>
      <div className="ira-p2-destinos__modo">
        <Segmentado
          etiqueta="Cómo ver los ejemplos"
          opciones={[{ id: 'ver', nombre: 'Ver todo', tono: 'oro' }, { id: 'adivinar', nombre: 'Adivinar primero', tono: 'oro' }]}
          valor={modo}
          onCambio={(m) => { setModo(m); setVistos({}); }}
        />
        {adivinar && <span className="ira-p2-destinos__pista">Toca cada frase para destapar su resultado.</span>}
      </div>
      <ul className={`ira-p2-destinos${adivinar ? ' is-adivinar' : ''}`}>
        {d.pares.map((p, i) => (
          <Aparecer as="li" key={p.dominio} className="ira-p2-destino" style={{ '--retardo': `${i * 90}ms` }}>
            <div className="ira-p2-destino__origen">
              <span className="ira-p2-codigo ira-cifra">{p.dominio}</span>
              <span className="ira-p2-destino__nombre">{p.nombre}</span>
            </div>
            <svg viewBox="0 0 80 160" preserveAspectRatio="none" className={`ira-p2-destino__horquilla${encima[i] ? ` is-${encima[i]}` : ''}`} aria-hidden="true">
              <path d="M0 80 C40 80, 40 40, 80 40" className="ira-p2-horquilla--neutra" />
              <path d="M0 80 C40 80, 40 120, 80 120" className="ira-p2-horquilla--polariza" />
              <circle r="3.2" className="ira-p2-horquilla__viajero ira-p2-horquilla__viajero--a">
                <animateMotion dur="2.6s" repeatCount="indefinite" path="M0 80 C40 80, 40 40, 80 40" begin={`${i * 0.4}s`} />
              </circle>
              <circle r="3.2" className="ira-p2-horquilla__viajero ira-p2-horquilla__viajero--b">
                <animateMotion dur="1.5s" repeatCount="indefinite" path="M0 80 C40 80, 40 120, 80 120" begin={`${0.3 + i * 0.4}s`} />
              </circle>
              <circle cx="0" cy="80" r="5" className="ira-p2-horquilla__nudo" />
            </svg>
            <div className="ira-p2-destino__ramas">
              {[['a', p.a], ['b', p.b]].map(([lado, x]) => {
                const clave = `${i}-${lado}`;
                const tapado = adivinar && !vistos[clave];
                const Etiqueta = adivinar ? 'button' : 'div';
                return (
                  <Etiqueta
                    key={x.frase}
                    {...(adivinar ? { type: 'button', 'aria-expanded': !tapado, onClick: (ev) => destapar(clave, x.resultado, ev) } : {})}
                    onMouseEnter={() => setEncima((e) => ({ ...e, [i]: lado }))}
                    onMouseLeave={() => setEncima((e) => ({ ...e, [i]: null }))}
                    className={`ira-p2-destino__rama ira-p2--${x.resultado}${tapado ? ' is-tapada' : ''}${adivinar && !tapado ? ' is-destapada' : ''}`}
                  >
                    <p className="ira-p2-destino__frase">{x.frase}</p>
                    <p className="ira-p2-destino__pie">
                      {tapado ? (
                        <span className="ira-p2-destino__tapa"><span aria-hidden="true">?</span> ¿Neutra o polariza?</span>
                      ) : (
                        <><Pildora resultado={x.resultado} t={t} /> <span>{x.nota}</span></>
                      )}
                    </p>
                  </Etiqueta>
                );
              })}
            </div>
          </Aparecer>
        ))}
      </ul>
    </>
  );
}

/** El experimento: el mismo problema con dos imágenes lleva a dos soluciones.
 *  Se elige la imagen con el interruptor y el camino hacia su solución se enciende. */
function Experimento({ x }) {
  const [imagen, setImagen] = useState('virus');
  return (
    <Aparecer className={`ira-p2-exp is-${imagen}`}>
      <div className="ira-p2-exp__cab">
        <p className="ira-p2-exp__titulo">{x.titulo}</p>
        <Segmentado
          etiqueta="Imagen del crimen"
          opciones={[{ id: 'virus', nombre: `es ${x.virus.imagen}`, tono: 'salvia' }, { id: 'bestia', nombre: `es ${x.bestia.imagen}`, tono: 'rojo' }]}
          valor={imagen}
          onCambio={setImagen}
        />
      </div>
      <div className="ira-p2-exp__lienzo">
        <div className="ira-p2-exp__problema"><span key={imagen}>{x.problema}</span></div>
        <div className="ira-p2-exp__carriles">
          {[['virus', x.virus], ['bestia', x.bestia]].map(([id, c], i) => (
            <button
              type="button"
              key={c.imagen}
              aria-pressed={imagen === id}
              onClick={(ev) => { if (imagen !== id) chispazo(ev, id === 'virus' ? 'salvia' : 'rojo', 8); setImagen(id); }}
              className={`ira-p2-exp__carril ira-p2-exp__carril--${i ? 'b' : 'a'}${imagen === id ? ' is-elegido' : ''}`}
            >
              <span className="ira-p2-exp__conector" aria-hidden="true" />
              <span className="ira-p2-exp__imagen">es <strong>{c.imagen}</strong></span>
              <span className="ira-p2-exp__flecha" aria-hidden="true">→</span>
              <span key={imagen === id ? `s-${imagen}` : id} className="ira-p2-exp__solucion ira-cifra">{c.solucion}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="ira-p2-exp__texto">{x.texto} <span className="ira-p2-exp__fuente">{x.fuente}</span></p>
      <p className="ira-met__nota">{x.cautela}</p>
    </Aparecer>
  );
}

/** Escala viva → convencional → muerta. Un marcador recorre la pista y se posa en el tramo elegido. */
function EscalaViva({ c }) {
  const [sel, setSel] = useState(0);
  const refs = useRef([]);
  const elegir = (k, ev) => {
    const n = (k + c.tramos.length) % c.tramos.length;
    if (n !== sel) chispazo(ev ?? refs.current[n], c.tramos[n].cuenta ? 'oro' : 'neutra', 7);
    setSel(n);
  };
  const onKey = (ev, k) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { ev.preventDefault(); elegir(k + 1); refs.current[(k + 1) % c.tramos.length]?.focus(); }
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') { ev.preventDefault(); elegir(k - 1); refs.current[(k - 1 + c.tramos.length) % c.tramos.length]?.focus(); }
  };
  return (
    <div className="ira-p2-viva" style={{ '--sel': sel, '--n': c.tramos.length }}>
      <div className="ira-p2-viva__pista" aria-hidden="true">
        <span>{c.eje[0]}</span><span>{c.eje[1]}</span>
        <span className={`ira-p2-viva__marcador is-${c.tramos[sel].id}`} />
      </div>
      <ol className="ira-p2-viva__tramos" role="radiogroup" aria-label="Grados de la metáfora">
        {c.tramos.map((tr, k) => (
          <Aparecer as="li" key={tr.id} className={`ira-p2-viva__tramo ira-p2-viva__tramo--${tr.id}${k === sel ? ' is-elegido' : ''}`}>
            <button
              type="button"
              ref={(el) => { refs.current[k] = el; }}
              role="radio"
              aria-checked={k === sel}
              tabIndex={k === sel ? 0 : -1}
              onClick={(ev) => elegir(k, ev)}
              onKeyDown={(ev) => onKey(ev, k)}
              className="ira-p2-viva__boton"
            >
              <span className="ira-p2-viva__nombre">{tr.nombre}</span>
              <span className="ira-p2-viva__ej">{tr.ej}</span>
              <span className="ira-p2-viva__nota">{tr.nota}</span>
              <span className={`ira-p2-viva__cuenta ira-p2-viva__cuenta--${tr.cuenta ? 'si' : 'no'}`}>
                <span aria-hidden="true">{tr.cuenta ? '✓' : '✕'}</span> {tr.cuenta ? c.cuentaSi : c.cuentaNo}
              </span>
            </button>
          </Aparecer>
        ))}
      </ol>
    </div>
  );
}

/** La unidad: oración + dominio + blanco = 1 evento, con dos ejemplos. */
function Unidad({ u }) {
  return (
    <>
      <Aparecer className="ira-p2-ecuacion" role="group" aria-label={`${u.definicion.join(' + ')} = ${u.igual}`}>
        {u.definicion.map((d, i) => (
          <span key={d} className="ira-p2-ecuacion__parte" style={{ '--k': i }}>
            {i > 0 && <span className="ira-p2-ecuacion__op ira-cifra" aria-hidden="true">+</span>}
            <span className="ira-p2-ecuacion__caja">{d}</span>
          </span>
        ))}
        <span className="ira-p2-ecuacion__op ira-p2-ecuacion__igual ira-cifra" aria-hidden="true">=</span>
        <span className="ira-p2-ecuacion__caja ira-p2-ecuacion__caja--total ira-cifra">{u.igual}</span>
      </Aparecer>
      <ul className="ira-p2-unidad">
        {u.ejemplos.map((x) => (
          <li key={x.frase} className="ira-p2-unidad__ej">
            <span className="ira-p2-unidad__n ira-cifra" aria-hidden="true">{x.eventos}</span>
            <span className="ira-p2-unidad__cuerpo">
              <span className="ira-p2-unidad__frase">{x.frase}</span>
              <span className="ira-p2-unidad__nota"><strong className="ira-cifra">{u.eventosRotulo(x.eventos)}</strong> · {x.nota}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="ira-met__nota">{u.repeticiones}</p>
    </>
  );
}

/** Rejilla de dominios. */
function Dominios({ d }) {
  return (
    <>
      <ul className="ira-p2-dominios">
        {d.lista.map((x, i) => (
          <Aparecer as="li" key={x.codigo} className={`ira-p2-dominio ira-p2-dominio--${x.icono}${x.siempre ? ' ira-p2-dominio--siempre' : ''}${x.codigo === 'OTR' ? ' ira-p2-dominio--otro' : ''}`} style={{ '--retardo': `${(i % 4) * 60}ms` }}>
            <span className="ira-p2-dominio__cab">
              <IconoP2 nombre={x.icono} tamano={22} className="ira-p2-dominio__icono" />
              <span className="ira-p2-codigo ira-cifra">{x.codigo}</span>
            </span>
            <span className="ira-p2-dominio__nombre">{x.nombre}</span>
            <span className="ira-p2-dominio__ej">{x.ej}</span>
            {x.siempre && <span className="ira-p2-dominio__aviso">{d.siempre}</span>}
          </Aparecer>
        ))}
      </ul>
      <p className="ira-met__nota">{d.nota}</p>
    </>
  );
}

/** Paso 0: los blancos en tres zonas. */
function Blancos({ r }) {
  return (
    <>
      <h3 className="ira-met__h3">{r.blancosTitulo}</h3>
      <p className="ira-met__nota">{r.blancosNota}</p>
      <div className="ira-met__blancos ira-p2-blancos">
        {r.zonas.map((z) => (
          <div key={z.id} className={`ira-met__zona ira-met__zona--${z.id}`}>
            <p className="ira-met__zona-titulo"><IconoP2 nombre={z.icono} tamano={18} /> {z.nombre}</p>
            <ul>
              {z.items.map(([b, ej, nuevo]) => (
                <li key={b}>
                  <span className="ira-met__zona-blanco">{b}{nuevo && <span className="ira-p2-nuevo">{r.nuevo}</span>}</span>
                  <span className="ira-met__zona-ej">{ej}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

/** Los tres pasos como recorrido vertical con salidas. Las salidas son botones: se juega la regla
 *  eligiendo Sí o No en cada paso; una ficha baja por la línea hasta el resultado. */
function Recorrido({ r, t }) {
  const [nodo, setNodo] = useState(1);
  const [final, setFinal] = useState(null);
  const [camino, setCamino] = useState([1]);
  const [elegidas, setElegidas] = useState({}); // paso → respuesta elegida, para dejar el rastro
  const refs = useRef({});
  const lista = useRef(null);
  const [fichaTop, setFichaTop] = useState(18);
  // La ficha se coloca a la altura del número del paso en el que estás
  useLayoutEffect(() => {
    const medir = () => {
      const li = lista.current?.querySelectorAll('.ira-p2-nodo')[nodo - 1];
      if (li) setFichaTop(li.offsetTop + 9);
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [nodo]);
  const ir = (destino, tono, ev, texto) => {
    setElegidas((e) => ({ ...e, [nodo]: texto }));
    if (typeof destino === 'number') {
      setNodo(destino);
      setCamino((c) => [...c, destino]);
      chispazo(ev, 'oro', 6);
      setTimeout(() => refs.current[destino]?.focus({ preventScroll: true }), 50);
    } else {
      setFinal(destino);
      chispazo(ev, tono, 11);
    }
  };
  const reiniciar = (ev) => { setNodo(1); setFinal(null); setCamino([1]); setElegidas({}); chispazo(ev, 'oro', 6); };
  const salida = (n, texto, destino, tono, nombre) => {
    const activo = nodo === n && !final;
    const elegida = elegidas[n] === texto && camino.includes(n);
    return (
      <button
        type="button"
        ref={(el) => { if (texto === t.apunta.no) refs.current[n] = el; }}
        disabled={!activo}
        onClick={(ev) => ir(destino, tono, ev, texto)}
        className={`ira-p2-salida ira-p2-salida--${tono}${elegida ? ' is-elegida' : ''}`}
      >
        <span className="ira-p2-salida__resp">{texto}</span>
        <span className="ira-p2-salida__flecha" aria-hidden="true">→</span>
        <span className="ira-p2-salida__destino">{nombre}</span>
      </button>
    );
  };
  const estado = (n) => (nodo === n && !final ? ' is-actual' : camino.includes(n) ? ' is-pasado' : ' is-pendiente');
  return (
    <>
      <div className="ira-juego-cab">
        <h3 className="ira-met__h3">{r.arbolTitulo}</h3>
        <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto ira-p2-recorrido__otra" onClick={reiniciar} disabled={nodo === 1 && !final}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>
          Empezar de nuevo
        </button>
      </div>
      <p className="ira-met__nota ira-p2-recorrido__ayuda" aria-live="polite">
        {final ? 'Ese es el resultado de la regla para tu metáfora.' : 'Piensa en una metáfora y responde: el botón activo es el paso en el que estás.'}
      </p>
      <ol ref={lista} className={`ira-p2-recorrido is-en-${final ? 'final' : nodo}`}>
        <li className={`ira-p2-recorrido__ficha${final ? ` is-${final}` : ''}`} style={{ top: fichaTop }} aria-hidden="true" />
        <Aparecer as="li" className={`ira-p2-nodo${estado(1)}`}>
          <span className="ira-p2-nodo__n ira-cifra" aria-hidden="true">1</span>
          <p className="ira-p2-nodo__q">{r.p1}</p>
          <div className="ira-p2-nodo__salidas">
            {salida(1, t.apunta.no, 3, 'sigue', `${r.irA} 3`)}
            {salida(1, t.apunta.si, 2, 'sigue', `${r.irA} 2`)}
          </div>
        </Aparecer>
        <Aparecer as="li" className={`ira-p2-nodo${estado(2)}`}>
          <span className="ira-p2-nodo__n ira-cifra" aria-hidden="true">2</span>
          <p className="ira-p2-nodo__q">{r.p2}</p>
          <p className="ira-p2-nodo__atajo"><span className="ira-cifra">ANI · INM</span> {r.atajoTexto}</p>
          <div className="ira-p2-nodo__salidas">
            {salida(2, t.apunta.no, 'polariza', 'polariza', t.resultados.polariza.nombre)}
            {salida(2, t.apunta.si, 3, 'sigue', `${r.irA} 3`)}
          </div>
        </Aparecer>
        <Aparecer as="li" className={`ira-p2-nodo${estado(3)}`}>
          <span className="ira-p2-nodo__n ira-cifra" aria-hidden="true">3</span>
          <p className="ira-p2-nodo__q">{r.p3}</p>
          <div className="ira-p2-nodo__salidas">
            {salida(3, t.apunta.no, 'neutra', 'neutra', t.resultados.neutra.nombre)}
            {salida(3, t.apunta.si, 'empatica', 'empatica', t.resultados.empatica.nombre)}
          </div>
        </Aparecer>
      </ol>
      {final && (
        <p key={final} className={`ira-p2-recorrido__final ira-p2--${final}`} role="status">
          <span className="ira-p2-pildora">{t.resultados[final].nombre}</span>
          <span>{t.resultados[final].texto}</span>
        </p>
      )}

      <h3 className="ira-met__h3">{r.senalesTitulo}</h3>
      <div className="ira-p2-senales">
        <div className="ira-p2-senales__col ira-p2-senales__col--conserva">
          <p className="ira-p2-senales__titulo">{r.conserva.titulo}</p>
          <ul>{r.conserva.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="ira-p2-senales__col ira-p2-senales__col--pierde">
          <p className="ira-p2-senales__titulo">{r.pierde.titulo}</p>
          <dl>{r.pierde.items.map(([n, ej]) => <div key={n}><dt>{n}</dt><dd>{ej}</dd></div>)}</dl>
        </div>
      </div>
      <p className="ira-met__nota">{r.intensidad}</p>
    </>
  );
}

export default function MetodologiaP2() {
  const { hash } = useLocation();
  const t = TEXTOS_P2.es;
  const numero = Object.fromEntries(t.secciones.map((s, i) => [s.id, i + 1]));
  const titulo = Object.fromEntries(t.secciones.map((s) => [s.id, s.titulo]));
  const sec = (id) => ({ id, n: numero[id], titulo: titulo[id] });

  useEffect(() => {
    const id = setTimeout(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container ira-met ira-met--p1 ira-met--p2" style={{ maxWidth: 1180 }}>
      <AvisoVersion lang="es" />

      <Link to="/metodologia" className="ira-met__volver">{t.volverIndice}</Link>
      <header className="ira-met__cabecera ira-met__cabecera--p1">
        <div className="ira-met__cabecera-texto">
          <p className="ira-met__rotulo">{t.rotulo} <span className="ira-p2-borrador">{t.enConstruccion}</span></p>
          <h1 className="ira-met__titulo"><span className="ira-juego-titulo">{t.titulo}<Chispas tono={TONO_TITULO} semilla={t.titulo} cantidad={4} tamano={[9, 15]} /></span></h1>
          <p className="ira-met__frase">{t.frase}</p>
        </div>
        <svg viewBox="0 0 200 200" className="ira-met__emblema ira-p2-emblema ira-juego-emblema" aria-hidden="true"
          onClick={(ev) => chispazo(ev, 'rojo', 12)}>
          <circle cx="132" cy="68" r="56" className="ira-p2-emblema__aro ira-p2-emblema__aro--2" />
          <circle cx="132" cy="68" r="34" className="ira-p2-emblema__aro" />
          <circle cx="132" cy="68" r="13" className="ira-p2-emblema__centro" />
          <path d="M34 166 C 46 112, 82 84, 112 76" className="ira-p2-emblema__flecha" />
          <path d="M101 70 L114 75.5 L104 85" className="ira-p2-emblema__flecha" />
          <circle cx="34" cy="166" r="16" className="ira-p2-emblema__origen" />
        </svg>
      </header>

      <div className="ira-met__rejilla">
        <IndiceSecciones t={t} />

        <div className="ira-met__cuerpo">
          {/* La idea */}
          <Seccion {...sec('la-idea')}>
            <Aparecer as="p" className="ira-p2-lema">
              <span>{t.lema[0]}</span>
              <span className="ira-p2-lema__fuerte">{t.lema[1]}</span>
            </Aparecer>
            <ul className="ira-p2-tres">
              {['polariza', 'neutra', 'empatica'].map((k, i) => (
                <Aparecer as="li" key={k} className={`ira-p2-tres__item ira-p2--${k}`} style={{ '--retardo': `${i * 80}ms` }}>
                  <span className="ira-p2-tres__marca" aria-hidden="true" />
                  <span className="ira-p2-tres__nombre">{t.resultados[k].nombre}</span>
                  <span className="ira-p2-tres__texto">{t.resultados[k].texto}</span>
                </Aparecer>
              ))}
            </ul>
          </Seccion>

          {/* Pieza principal */}
          <Seccion {...sec('apunta')}>
            <ApuntaMetafora t={t.apunta} resultados={t.resultados} />
          </Seccion>

          {/* Misma imagen, dos destinos */}
          <Seccion {...sec('dos-destinos')}>
            <p className="ira-met__texto">{t.destinos.intro}</p>
            <DosDestinos d={t.destinos} t={t} />
          </Seccion>

          {/* Por qué importa */}
          <Seccion {...sec('por-que-importa')} className="ira-met__seccion--banda">
            <figure className="ira-p2-cita">
              <Chispas tono="oro" semilla={t.porque.entrada} cantidad={3} />
              <blockquote className="ira-met__entrada">{t.porque.entrada}</blockquote>
              <figcaption>{t.porque.entradaFuente}</figcaption>
            </figure>
            <Experimento x={t.porque.experimento} />
            <ol className="ira-p2-eslabones">
              {t.porque.pasos.map((p, i) => (
                <Aparecer as="li" key={p.titulo} className="ira-p2-eslabon" style={{ '--retardo': `${i * 90}ms` }}>
                  <span className="ira-p2-eslabon__n ira-cifra" aria-hidden="true">{i + 1}</span>
                  <h3 className="ira-met__h3">{p.titulo}</h3>
                  <p>{p.texto}</p>
                  <p className="ira-p2-eslabon__fuente">{p.fuentes}</p>
                </Aparecer>
              ))}
            </ol>
          </Seccion>

          {/* Base teórica */}
          <Seccion {...sec('que-mide')}>
            <p className="ira-met__texto">{t.teoria.intro}</p>
            <MapaTeoria teoria={t.teoria.autores} ui={t.teoria.ui} referencias={t.referencias} />
            <p className="ira-met__nota">{t.teoria.otros}</p>
            <div className="ira-met__cautela">
              <p className="ira-met__cautela-titulo">{t.teoria.cautelaTitulo}</p>
              <p>{t.teoria.cautela}</p>
            </div>
          </Seccion>

          {/* Qué no mide */}
          <Seccion {...sec('que-no-mide')}>
            <ul className="ira-met__desvios">
              {t.noMide.filas.map((f, i) => (
                <Aparecer as="li" key={f.fenomeno} className="ira-met__desvio" style={{ '--retardo': `${(i % 2) * 70}ms` }}>
                  <span className="ira-met__desvio-fenomeno">{f.fenomeno}</span>
                  <span className="ira-met__desvio-flecha" aria-hidden="true">→</span>
                  <span className="ira-met__desvio-destino">
                    {f.destino.map((d) => <span key={d} className="ira-met__etiqueta-param ira-cifra">{d}</span>)}
                    {f.nota && <span className="ira-met__destino-nota">{f.nota}</span>}
                  </span>
                </Aparecer>
              ))}
            </ul>
            <h3 className="ira-met__h3">{t.noMide.repartoTitulo}</h3>
            <div className="ira-p2-reparto">
              {['P2', 'P3', 'P6'].map((p) => (
                <div key={p} className={`ira-p2-reparto__caja${p === 'P2' ? ' ira-p2-reparto__caja--p2' : ''}`}>
                  <p className="ira-p2-reparto__cab">
                    <span className="ira-met__etiqueta-param ira-cifra">{p}</span>
                    <span className="ira-p2-reparto__tipo">{p === 'P2' ? t.noMide.figurado : t.noMide.literal}</span>
                  </p>
                  <ul>{t.noMide.reparto.filter((x) => x.destino === p).map((x) => <li key={x.frase}>{x.frase}</li>)}</ul>
                </div>
              ))}
            </div>
            <Destacado>{t.noMide.regla}</Destacado>
          </Seccion>

          {/* Qué cuenta como metáfora */}
          <Seccion {...sec('que-cuenta')}>
            <p className="ira-met__texto">{t.cuenta.intro}</p>
            <EscalaViva c={t.cuenta} />
            <p className="ira-met__nota">{t.cuenta.prueba}</p>
            <p className="ira-met__nota">{t.cuenta.peso}</p>
          </Seccion>

          {/* Unidad */}
          <Seccion {...sec('unidad')}>
            <Unidad u={t.unidad} />
          </Seccion>

          {/* Dominios */}
          <Seccion {...sec('dominios')}>
            <p className="ira-met__texto">{t.dominios.intro}</p>
            <Dominios d={t.dominios} />
          </Seccion>

          {/* La regla */}
          <Seccion {...sec('regla')}>
            <Blancos r={t.regla} />
            <Recorrido r={t.regla} t={t} />
          </Seccion>

          {/* Fórmula */}
          <Seccion {...sec('formula')}>
            <div className="ira-met__formula">{t.formula.lineas.map((l) => <p key={l} className="ira-met__formula-linea ira-cifra">{l}</p>)}</div>
            <ul className="ira-p2-leyenda">
              {t.formula.leyenda.map(([k, v]) => (
                <li key={k} className={`ira-p2--${k === 'E' ? 'empatica' : k === 'P' ? 'polariza' : 'neutra'}`}>
                  <span className="ira-p2-leyenda__k ira-cifra">{k}</span><span>{v}</span>
                </li>
              ))}
            </ul>
            <ul className="ira-met__lista">{t.formula.notas.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="ira-p2-excepcion">{t.formula.excepcion}</p>
          </Seccion>

          {/* Casos */}
          <Seccion {...sec('casos')}>
            <div className="ira-met__tabla-marco">
              <table className="ira-met__tabla ira-p2-casos">
                <thead><tr>{t.casos.cabecera.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>
                  {t.casos.filas.map(([frase, dom, blanco, res]) => (
                    <tr key={frase}>
                      <td data-rotulo={t.casos.cabecera[0]}>{frase}</td>
                      <td data-rotulo={t.casos.cabecera[1]}><span className="ira-p2-codigo ira-cifra">{dom}</span></td>
                      <td data-rotulo={t.casos.cabecera[2]}>{blanco}</td>
                      <td data-rotulo={t.casos.cabecera[3]}><Pildora resultado={res} t={t} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Acordeon titulo={t.casos.porResolverTitulo}>
              <ul className="ira-met__lista">{t.casos.porResolver.map((x) => <li key={x}>{x}</li>)}</ul>
            </Acordeon>
          </Seccion>

          {/* Primera prueba */}
          <Seccion {...sec('prueba')}>
            <p className="ira-met__texto">{t.prueba.intro}</p>
            <div className="ira-pz-banda ira-p2-prueba">
              <div className="ira-p2-prueba__nota">
                <p className="ira-p2-prueba__cifra ira-cifra" aria-label={t.prueba.nota}>
                  <CifraAlVer valor={Number(t.prueba.nota.replace(',', '.'))} formato={(v) => v.toFixed(2).replace('.', ',')} />
                </p>
                <p className="ira-p2-prueba__solidez">P2 · {t.prueba.solidez}</p>
                <p className="ira-p2-prueba__calculo ira-cifra">{t.prueba.calculo}</p>
                <ul className="ira-p2-prueba__cifras">
                  {t.prueba.cifras.map(([n, k], i) => (
                    <li key={k} className={`ira-p2--${['empatica', 'polariza', 'neutra'][i]}`}><strong className="ira-cifra"><CifraAlVer valor={Number(n)} /></strong> {k}</li>
                  ))}
                </ul>
              </div>
              <div className="ira-p2-prueba__listas">
                {[['polarizan', 'polariza'], ['empaticas', 'empatica']].map(([k, tono]) => (
                  <div key={k} className={`ira-p2-prueba__lista ira-p2--${tono}`}>
                    <p className="ira-p2-prueba__titulo">{t.prueba[`${k}Titulo`]}</p>
                    <ul>
                      {t.prueba[k].map(([o, d, f]) => (
                        <li key={o + f}><span className="ira-p2-prueba__o ira-cifra">{o}</span><span className="ira-p2-codigo ira-cifra">{d}</span><span className="ira-p2-prueba__f">{f}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <p className="ira-met__nota">{t.prueba.descriptivo}</p>
            <Destacado tono="salvia">{t.prueba.p1}</Destacado>
            <p className="ira-p2-excepcion">{t.prueba.onu}</p>
            <h3 className="ira-met__h3">{t.prueba.dudasTitulo}</h3>
            <ul className="ira-p2-pendiente">
              {t.prueba.dudas.map(([n, e]) => (
                <li key={n} className="ira-p2-pendiente__item"><p className="ira-p2-pendiente__nombre">{n}</p><p>{e}</p></li>
              ))}
            </ul>
          </Seccion>

          {/* Pendiente */}
          <Seccion {...sec('pendiente')}>
            <ul className="ira-p2-pendiente">
              {t.pendiente.map(([n, e]) => (
                <li key={n} className="ira-p2-pendiente__item">
                  <span className="ira-p2-pendiente__estado ira-cifra">{t.enConstruccion}</span>
                  <p className="ira-p2-pendiente__nombre">{n}</p>
                  <p>{e}</p>
                </li>
              ))}
            </ul>
          </Seccion>

          {/* Registro */}
          <Seccion {...sec('cambios')}>
            <Acordeon titulo={t.cambios.titulo}>
              <ul className="ira-met__lista">{t.cambios.decisiones.map((d) => <li key={d}>{d}</li>)}</ul>
            </Acordeon>
          </Seccion>

          {/* Referencias */}
          <Seccion {...sec('referencias')}>
            <p className="ira-met__nota">{t.referenciasNota}</p>
            <ul className="ira-met__referencias">{t.referencias.map((r) => <li key={r}>{r}</li>)}</ul>
            <p><a href={MANUAL_URL} target="_blank" rel="noopener noreferrer" className="ira-met__enlace">{t.manual} →</a></p>
          </Seccion>

          <nav className="ira-met__pie-nav" aria-label="Navegación entre parámetros">
            <Link to="/metodologia/p1" className="ira-boton ira-boton--secundario">{t.pie.anterior}</Link>
            <Link to="/metodologia" className="ira-boton ira-boton--secundario">{t.pie.volver}</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
