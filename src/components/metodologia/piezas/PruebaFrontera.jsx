// IRA · Metodología 2.0 · P1 · El mapa de la frontera (pieza interactiva).
// Seis frases del manual: al elegir una, el diagrama coloca al otro dentro del nosotros,
// en el umbral, detrás del muro o fuera de la comunidad. La frontera es una membrana viva
// (Membrana.jsx): se abre y deja pasar, se endurece y hace rebotar, o escupe al otro.
// Se puede recorrer solo (Recorrer) o frase a frase con el mando o las flechas.
import { useRef, useState } from 'react';
import Membrana from './Membrana.jsx';
import { Chispas, Mando, PistaTeclas, chispazo, tonoDe, traerEnTira, useDeslizar, useRecorrido, PistaDeslizar } from '../Juego.jsx';

export default function PruebaFrontera({ t }) {
  const [activa, setActiva] = useState(1);
  const refs = useRef([]);
  const n = t.ejemplos.length;
  const e = t.ejemplos[activa];

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
          <Membrana modo={e.modo} etiquetas={{ periferia: t.periferia, nosotros: t.nosotros }} />
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
