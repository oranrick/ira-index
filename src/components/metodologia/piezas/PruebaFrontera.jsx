// IRA · Metodología 2.0 · P1 · El mapa de la frontera (pieza interactiva).
// Seis frases del manual: al elegir una, el diagrama coloca al otro dentro del nosotros,
// en el umbral, detrás del muro o fuera de la comunidad. El anillo es un trazo que se
// cierra en muro o se abre en puerta; el otro viaja hasta su sitio y deja una onda al llegar.
// Se puede recorrer solo (Recorrer) o frase a frase con el mando o las flechas.
import { useRef, useState } from 'react';
import { Chispas, Mando, PistaTeclas, chispazo, tonoDe, traerEnTira, useDeslizar, useRecorrido, PistaDeslizar } from '../Juego.jsx';

// Centro del punto «el otro» en % del diagrama (cuadrado)
const POSICION = {
  grupo: { x: 50, y: 50 }, // se funde con el nosotros: nadie queda fuera
  dentro: { x: 66, y: 44 },
  umbral: { x: 79.4, y: 50 },
  muro: { x: 88, y: 24 },
  excepcion: { x: 86, y: 26 },
  expulsion: { x: 95, y: 7 },
};

// Anillo del nosotros (SVG 100 × 100): radio, hueco de la puerta y grosor por modo
const R = 29.4;
const C = 2 * Math.PI * R;
const ANILLO = {
  grupo: { hueco: 0, grosor: 1.2 },
  dentro: { hueco: 22, grosor: 1.2 },
  umbral: { hueco: 13, grosor: 1.2 },
  muro: { hueco: 0, grosor: 3.4 },
  expulsion: { hueco: 0, grosor: 3.4 },
  excepcion: { hueco: 0, grosor: 2.2 },
};

export default function PruebaFrontera({ t }) {
  const [activa, setActiva] = useState(1);
  const refs = useRef([]);
  const n = t.ejemplos.length;
  const e = t.ejemplos[activa];
  const pos = POSICION[e.modo];
  const anillo = ANILLO[e.modo];

  const activaRef = useRef(activa);
  activaRef.current = activa;
  const elegirRef = useRef(null);
  const elegir = (i, ev) => {
    const k = (i + n) % n;
    if (k !== activa) chispazo(ev ?? refs.current[k], t.ejemplos[k].tipo, 8);
    setActiva(k);
    // En móvil las frases van en tira: la elegida se trae a la vista sin mover la página
    traerEnTira(refs.current[k]);
  };
  elegirRef.current = elegir;
  const recorrido = useRecorrido(n, () => elegirRef.current(activaRef.current + 1), 3400);
  const mover = (i) => {
    recorrido.parar();
    elegir(i);
    refs.current[(i + n) % n]?.focus();
  };
  const deslizar = useDeslizar((ev) => { recorrido.parar(); elegir(activa + 1, ev); }, (ev) => { recorrido.parar(); elegir(activa - 1, ev); });
  const onKey = (ev, i) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); mover(i + 1); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); mover(i - 1); }
  };

  return (
    <div className={`ira-pz-frontera ira-juego-espera${recorrido.visto ? ' is-visto' : ''}`} ref={recorrido.ref}>
      <div className="ira-juego-cab">
        <p className="ira-met__texto">{t.intro}</p>
        <PistaTeclas />
      </div>
      <div className="ira-pz-banda ira-pz-frontera__rejilla">
        <div className="ira-pz-frontera__izq">
          <div role="radiogroup" aria-label={t.etiqueta} className="ira-pz-frontera__frases">
            {t.ejemplos.map((x, i) => (
              <button
                key={x.codigo}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={i === activa}
                tabIndex={i === activa ? 0 : -1}
                onClick={(ev) => { recorrido.parar(); elegir(i, ev); }}
                onKeyDown={(ev) => onKey(ev, i)}
                className={`ira-pz-frontera__frase ira-juego-elige ira-juego--${tonoDe(x.tipo)} ira-pz--${x.tipo}${i === activa ? ' is-activa' : ''}`}
              >
                <span className="ira-juego-barra" aria-hidden="true" />
                <span className="ira-pz-codigo ira-cifra">{x.codigo}</span>
                <span className="ira-pz-frontera__frase-texto">
                  <span className="ira-pz-frontera__corto">{x.corto}</span>
                  <span className="ira-pz-frontera__cita">{x.frase}</span>
                </span>
                {i === activa && <Chispas key={`c${activa}`} tono={x.tipo} semilla={x.frase} />}
              </button>
            ))}
          </div>
          <Mando i={activa} n={n} ir={elegir} recorrido={recorrido} tono={e.tipo} etiqueta={t.etiqueta}
            textos={{ anterior: 'Frase anterior', siguiente: 'Frase siguiente', recorrer: 'Recorrer las seis' }} />
        </div>

        <div className="ira-pz-frontera__lado" {...deslizar}>
          <div className={`ira-pz-mapa ira-pz-mapa--${e.modo} ira-juego--${tonoDe(e.tipo)}`} aria-hidden="true">
            <span className="ira-pz-mapa__periferia" />
            <span className="ira-pz-mapa__rotulo">{t.periferia}</span>
            <svg viewBox="0 0 100 100" className="ira-pz-mapa__lienzo">
              {/* el anillo: se cierra en muro, se abre en puerta (hueco a la derecha) */}
              <circle
                cx="50" cy="50" r={R}
                className="ira-pz-mapa__aro"
                style={{
                  strokeDasharray: `${C - anillo.hueco} ${anillo.hueco || 0.001}`,
                  strokeDashoffset: -anillo.hueco / 2,
                  strokeWidth: anillo.grosor,
                }}
              />
              {/* jambas de la puerta */}
              <g className="ira-pz-mapa__jambas" style={{ opacity: anillo.hueco ? 1 : 0 }}>
                {[-1, 1].map((s) => {
                  const ang = (s * anillo.hueco) / 2 / R;
                  const x = 50 + R * Math.cos(ang);
                  const y = 50 + R * Math.sin(ang);
                  return <line key={s} x1={x - 2.6} y1={y} x2={x + 2.6} y2={y} />;
                })}
              </g>
              {/* tres personas que giran dentro del nosotros */}
              <g className="ira-pz-mapa__orbita">
                <circle cx="50" cy="35.5" r="1.6" />
                <circle cx="62.6" cy="57.3" r="1.6" />
                <circle cx="37.4" cy="57.3" r="1.6" />
              </g>
            </svg>
            <span key={`golpe-${activa}`} className="ira-pz-mapa__golpe" />
            <span className="ira-pz-mapa__halo" />
            <span className="ira-pz-mapa__centro" />
            <span className="ira-pz-mapa__nosotros">{t.nosotros}</span>
            <span className="ira-pz-mapa__otro" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              <span key={`llega-${activa}`} className="ira-pz-mapa__llegada" />
            </span>
          </div>
          <PistaDeslizar />
          <p className="ira-pz-frontera__posicion" aria-live="polite">
            {t.elOtro}: <strong key={activa} className="ira-pz-frontera__donde">{t.posiciones[e.modo]}</strong>
          </p>
          <dl className={`ira-pz-ficha ira-juego--${tonoDe(e.tipo)}`} key={`f${activa}`}>
            <div><dt>{t.indicador}</dt><dd>{e.indicador}</dd></div>
            <div><dt>{t.efecto}</dt><dd className={`ira-pz-efecto--${e.tipo}`}>{e.efecto}</dd></div>
            <p className="ira-pz-ficha__porque">{e.porque}</p>
          </dl>
        </div>
      </div>
    </div>
  );
}
