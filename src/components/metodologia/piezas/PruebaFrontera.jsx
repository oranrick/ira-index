// IRA · Metodología 2.0 · P1 · El mapa de la frontera (pieza interactiva).
// Seis frases del manual: al elegir una, el diagrama coloca al otro dentro del nosotros,
// en el umbral, detrás del muro o fuera de la comunidad. El anillo son piezas que se juntan en
// muro o se apartan como un iris; el otro viaja hasta su sitio y deja una onda al llegar.
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

// Anillo del nosotros (SVG 100 × 100): 24 piezas sobre un círculo. Cerrado, las piezas se
// tocan y forman un muro; abierto, se apartan como un iris y dejan un hueco hacia la derecha
// (donde está el umbral). hueco = grados abiertos; lleno = qué parte de su tramo ocupa cada pieza.
const R = 29.4;
const C = 2 * Math.PI * R;
const N = 24;
const ANILLO = {
  grupo: { hueco: 0, lleno: 0.34, grosor: 1.1 },     // no hay frontera: halo suelto
  dentro: { hueco: 92, lleno: 0.62, grosor: 1.5 },   // la puerta abierta de par en par
  umbral: { hueco: 46, lleno: 0.62, grosor: 1.5 },   // entreabierta: el otro en el hueco
  muro: { hueco: 0, lleno: 0.965, grosor: 3.8 },     // piezas pegadas: un muro de ladrillos
  expulsion: { hueco: 0, lleno: 0.965, grosor: 3.8 },
  excepcion: { hueco: 0, lleno: 0.5, grosor: 2.4 },  // cerrado pero con juntas: muro por una conducta
};

function piezas(modo) {
  const { hueco, lleno } = ANILLO[modo];
  const tramo = (360 - hueco) / N;
  return Array.from({ length: N }, (_, i) => {
    const inicio = hueco / 2 + i * tramo + (tramo * (1 - lleno)) / 2;
    const medio = inicio + (tramo * lleno) / 2;
    const lejos = Math.min(medio, 360 - medio) / 180; // 0 junto al hueco, 1 al otro lado
    return { giro: inicio, largo: (tramo * lleno * C) / 360, retraso: Math.round(lejos * 260) };
  });
}

// Camino del otro hasta su sitio, cuando entra por la puerta
const SENDA = {
  dentro: 'M97 50 C 86 50, 78 50, 66 44',
  umbral: 'M97 50 L 80 50',
};

export default function PruebaFrontera({ t }) {
  const [activa, setActiva] = useState(1);
  const refs = useRef([]);
  const n = t.ejemplos.length;
  const e = t.ejemplos[activa];
  const pos = POSICION[e.modo];
  const anillo = ANILLO[e.modo];
  const segmentos = piezas(e.modo);

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
              <defs>
                <radialGradient id="ira-pz-luz">
                  <stop offset="0" stopColor="#D3E4C8" stopOpacity="0.55" />
                  <stop offset="0.45" stopColor="#8DAA7E" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#8DAA7E" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* luz que entra por el hueco de la puerta */}
              <ellipse cx={50 + R} cy="50" rx="11" ry={4 + anillo.hueco / 9} fill="url(#ira-pz-luz)" className="ira-pz-mapa__luz" style={{ opacity: anillo.hueco ? 1 : 0 }} />
              {/* la senda por la que entra el otro */}
              <path d={SENDA[e.modo] ?? 'M97 50 L 97 50'} className="ira-pz-mapa__senda" style={{ opacity: SENDA[e.modo] ? 1 : 0 }} />
              {/* el anillo: 24 piezas que se apartan como un iris o se juntan en muro */}
              <g className="ira-pz-mapa__aro">
                {segmentos.map((p, i) => (
                  <circle
                    key={i}
                    cx="50" cy="50" r={R}
                    className={`ira-pz-mapa__pieza${anillo.hueco && i === 0 ? ' is-hoja-abajo' : ''}${anillo.hueco && i === N - 1 ? ' is-hoja-arriba' : ''}`}
                    style={{
                      transform: `rotate(${p.giro}deg)`,
                      strokeDasharray: `${p.largo} ${C}`,
                      strokeWidth: anillo.grosor,
                      transitionDelay: `${p.retraso}ms`,
                    }}
                  />
                ))}
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
