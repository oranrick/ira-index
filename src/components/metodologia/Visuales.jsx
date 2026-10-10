// IRA · Metodología 2.0 · piezas visuales reutilizables de las páginas de parámetro:
// aparición al hacer scroll, iconos de trazo, línea de tiempo, barra de pesos, pestañas,
// filas de puntos y escala de solidez. Ninguna calcula P1: solo dibujan datos ya dados.
import { useEffect, useId, useRef, useState } from 'react';

/** Añade .is-visible cuando el bloque entra en pantalla (la animación vive en el CSS y
 *  se desactiva con prefers-reduced-motion). Sin IntersectionObserver, se ve directamente. */
export function Aparecer({ as: Etiqueta = 'div', className = '', children, ...resto }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px' });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);
  return (
    <Etiqueta ref={ref} className={`ira-met-aparecer${visible ? ' is-visible' : ''} ${className}`} {...resto}>
      {children}
    </Etiqueta>
  );
}

// ── Iconos de trazo (24 × 24, decorativos: siempre van con texto) ─────────────
const TRAZOS = {
  extraer: <><path d="M8 4H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h1" /><path d="M16 4h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-1" /><line x1="10" y1="12" x2="14" y2="12" /></>,
  revisar: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  clasificar: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="7.5" r="1.4" /></>,
  calcular: <path d="M18 5H6l6 7-6 7h12" />,
  alcance: <><circle cx="12" cy="12" r="9" opacity="0.5" /><circle cx="12" cy="12" r="3.2" /><circle cx="12" cy="3" r="1.2" /><circle cx="19.8" cy="16.5" r="1.2" /><circle cx="4.2" cy="16.5" r="1.2" /></>,
  interpelacion: <><path d="M4 5h16v10H10l-5 4v-4H4z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="12" x2="13" y2="12" /></>,
  permeabilidad: <><path d="M2 20h7V12a3 3 0 0 1 6 0v8h7" /><path d="M2 20V6h20v14" opacity="0.5" /><line x1="2" y1="10.5" x2="9" y2="10.5" opacity="0.5" /><line x1="15" y1="10.5" x2="22" y2="10.5" opacity="0.5" /></>,
  ia: <><rect x="5" y="5" width="14" height="14" rx="3" /><path d="M9 9h6v6H9z" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  senalar: <><path d="M4 7h11M4 12h16M4 17h9" /><path d="M14 15.5l2.5 5 1.2-2.4 2.4-1.2z" /></>,
  repositorio: <><path d="M6 3h11l3 3v15H6z" /><path d="M9 8h6M9 12h8M9 16h5" /></>,
  muro: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M12 9.7v4.6M6 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19" /></>,
  puerta: <><path d="M6 21V9a6 6 0 0 1 12 0v12" strokeDasharray="3 2.4" /><path d="M3 21h18" /><circle cx="15" cy="14" r="0.9" /></>,
  circulo: <circle cx="12" cy="12" r="8" />,
  interrogante: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.6" /><line x1="12" y1="17" x2="12" y2="17.1" /></>,
};

export function Icono({ nombre, tamano = 24, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={tamano} height={tamano} aria-hidden="true" className={`ira-met-icono ${className}`}>
      {TRAZOS[nombre]}
    </svg>
  );
}

/** Oír → sentir dónde me colocan → pensar. Ilustración de línea con las etiquetas en HTML. */
export function LineaTiempo({ pasos, eje }) {
  return (
    <Aparecer className="ira-met-tiempo">
      <svg viewBox="0 0 720 150" className="ira-met-tiempo__svg" aria-hidden="true">
        {/* 1 · la frase llega como onda */}
        <path className="ira-met-tiempo__onda" d="M40 70 q15 -34 30 0 t30 0 t30 0 t30 0 t30 0" />
        <path className="ira-met-tiempo__flecha" d="M206 70 h80 m-8 -6 l8 6 -8 6" />
        {/* 2 · el nosotros y un oyente colocado dentro o fuera */}
        <g className="ira-met-tiempo__centro">
          <circle cx="360" cy="70" r="58" className="ira-met-tiempo__anillo ira-met-tiempo__anillo--2" />
          <circle cx="360" cy="70" r="36" className="ira-met-tiempo__anillo ira-met-tiempo__anillo--1" />
          <circle cx="360" cy="70" r="15" className="ira-met-tiempo__punto" />
          <circle cx="398" cy="52" r="5" className="ira-met-tiempo__oyente" />
        </g>
        <path className="ira-met-tiempo__flecha ira-met-tiempo__flecha--2" d="M434 70 h80 m-8 -6 l8 6 -8 6" />
        {/* 3 · el argumento llega después */}
        <g className="ira-met-tiempo__razon">
          <line x1="548" y1="48" x2="672" y2="48" />
          <line x1="548" y1="70" x2="652" y2="70" />
          <line x1="548" y1="92" x2="628" y2="92" />
        </g>
        <path className="ira-met-tiempo__eje" d="M30 136 H690 m-8 -5 l8 5 -8 5" />
      </svg>
      <ol className="ira-met-tiempo__pasos">
        {pasos.map((p, i) => (
          <li key={p.titulo}>
            <span className="ira-met-tiempo__n ira-cifra" aria-hidden="true">{i + 1}</span>
            <span className="ira-met-tiempo__titulo">{p.titulo}</span>
            <span className="ira-met-tiempo__texto">{p.texto}</span>
          </li>
        ))}
      </ol>
      <p className="ira-met-tiempo__eje-rotulo" aria-hidden="true">{eje} →</p>
    </Aparecer>
  );
}

/** Pesos de los indicadores como barra apilada, con nombre y cifra en cada tramo. */
export function BarraPesos({ partes, etiqueta }) {
  return (
    <figure className="ira-met-pesos" aria-label={etiqueta}>
      <div className="ira-met-pesos__barra" aria-hidden="true">
        {partes.map((p) => (
          <span key={p.id} className={`ira-met-pesos__tramo ira-met-pesos__tramo--${p.id}`} style={{ flexGrow: p.peso }} />
        ))}
      </div>
      <ul className="ira-met-pesos__leyenda">
        {partes.map((p) => (
          <li key={p.id} style={{ flexGrow: p.peso }}>
            <span className="ira-met-pesos__cifra ira-cifra">{p.cifra}</span>
            <span className="ira-met-pesos__nombre">
              <Icono nombre={p.id} tamano={16} /> {p.nombre}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Pestañas accesibles (flechas, Inicio y Fin mueven el foco entre pestañas). */
export function Pestanas({ pestanas, etiqueta }) {
  const base = useId();
  const [activa, setActiva] = useState(0);
  const refs = useRef([]);
  const mover = (i) => {
    const n = (i + pestanas.length) % pestanas.length;
    setActiva(n);
    refs.current[n]?.focus();
  };
  const onKey = (e, i) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); mover(i + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); mover(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); mover(0); }
    else if (e.key === 'End') { e.preventDefault(); mover(pestanas.length - 1); }
  };
  return (
    <div className="ira-met-pestanas">
      <div role="tablist" aria-label={etiqueta} className="ira-met-pestanas__lista">
        {pestanas.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${base}-tab-${p.id}`}
            aria-selected={i === activa}
            aria-controls={`${base}-panel-${p.id}`}
            tabIndex={i === activa ? 0 : -1}
            className={`ira-met-pestanas__tab ira-met-pestanas__tab--${p.id}`}
            onClick={() => setActiva(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <Icono nombre={p.id} tamano={22} />
            <span className="ira-met-pestanas__nombre">{p.nombre}</span>
            <span className="ira-met-pestanas__peso ira-cifra">{p.peso}</span>
          </button>
        ))}
      </div>
      {pestanas.map((p, i) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`${base}-panel-${p.id}`}
          aria-labelledby={`${base}-tab-${p.id}`}
          hidden={i !== activa}
          tabIndex={0}
          className="ira-met-pestanas__panel"
        >
          {p.contenido}
        </div>
      ))}
    </div>
  );
}

/** Fila de n puntos (mínimos para puntuar). Decorativa: la cifra va al lado. */
export function Puntos({ n, variante = '' }) {
  return (
    <span className={`ira-met-puntos ${variante}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <span key={i} style={{ '--i': i }} />)}
    </span>
  );
}

/** Escala de solidez por nosotros clasificables, con los discursos de la ficha encima. */
export function EscalaSolidez({ tramos, marcas, maximo = 60, etiqueta }) {
  const pct = (v) => `${(Math.min(v, maximo) / maximo) * 100}%`;
  return (
    <figure className="ira-met-solidez">
      <figcaption className="ira-sr">{etiqueta}</figcaption>
      <div className="ira-met-solidez__pista">
        {tramos.map((t) => (
          <div key={t.id} className={`ira-met-solidez__tramo ira-met-solidez__tramo--${t.id}`} style={{ left: pct(t.desde), width: `calc(${pct(t.hasta)} - ${pct(t.desde)})` }}>
            <span className="ira-met-solidez__nombre">{t.nombre}</span>
            <span className="ira-met-solidez__rango ira-cifra">{t.rango}</span>
          </div>
        ))}
        {marcas.map((m, i) => (
          <div key={m.id} className={`ira-met-solidez__marca ira-met-solidez__marca--${i % 2 ? 'abajo' : 'arriba'}`} style={{ left: pct(m.valor) }}>
            <span className="ira-met-solidez__marca-texto">{m.nombre} <strong className="ira-cifra">{m.valor}</strong></span>
          </div>
        ))}
      </div>
      <ul className="ira-sr">
        {marcas.map((m) => <li key={m.id}>{m.nombre}: {m.valor} · {m.lectura}</li>)}
      </ul>
    </figure>
  );
}
