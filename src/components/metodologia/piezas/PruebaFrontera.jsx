// IRA · Metodología 2.0 · P1 · El mapa de la frontera (pieza interactiva).
// Seis frases del manual: al elegir una, el diagrama coloca al otro dentro del nosotros,
// en el umbral, detrás del muro o fuera de la comunidad.
import { useRef, useState } from 'react';

// Centro del punto «el otro» en % del diagrama (cuadrado)
const POSICION = {
  grupo: { x: '66%', y: '44%' },
  dentro: { x: '66%', y: '44%' },
  umbral: { x: '79.4%', y: '50%' },
  muro: { x: '88%', y: '24%' },
  excepcion: { x: '88%', y: '24%' },
  expulsion: { x: '93%', y: '9%' },
};

export default function PruebaFrontera({ t }) {
  const [activa, setActiva] = useState(1);
  const refs = useRef([]);
  const e = t.ejemplos[activa];
  const pos = POSICION[e.modo];

  const mover = (i) => {
    const n = (i + t.ejemplos.length) % t.ejemplos.length;
    setActiva(n);
    refs.current[n]?.focus();
  };
  const onKey = (ev, i) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); mover(i + 1); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); mover(i - 1); }
  };

  return (
    <div className="ira-pz-frontera">
      <p className="ira-met__texto">{t.intro}</p>
      <div className="ira-pz-banda ira-pz-frontera__rejilla">
        <div role="radiogroup" aria-label={t.etiqueta} className="ira-pz-frontera__frases">
          {t.ejemplos.map((x, i) => (
            <button
              key={x.codigo}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={i === activa}
              tabIndex={i === activa ? 0 : -1}
              onClick={() => setActiva(i)}
              onKeyDown={(ev) => onKey(ev, i)}
              className={`ira-pz-frontera__frase ira-pz--${x.tipo}${i === activa ? ' is-activa' : ''}`}
            >
              <span className="ira-pz-codigo ira-cifra">{x.codigo}</span>
              <span className="ira-pz-frontera__frase-texto">
                <span className="ira-pz-frontera__corto">{x.corto}</span>
                <span className="ira-pz-frontera__cita">{x.frase}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="ira-pz-frontera__lado">
          <div className={`ira-pz-mapa ira-pz-mapa--${e.modo}`} aria-hidden="true">
            <span className="ira-pz-mapa__periferia" />
            <span className="ira-pz-mapa__rotulo">{t.periferia}</span>
            <span className="ira-pz-mapa__anillo" />
            <span className="ira-pz-mapa__puerta" />
            <span className="ira-pz-mapa__halo" />
            <span className="ira-pz-mapa__centro" />
            <span className="ira-pz-mapa__nosotros">{t.nosotros}</span>
            <span className="ira-pz-mapa__otro" style={{ left: pos.x, top: pos.y }} />
          </div>
          <p className="ira-pz-frontera__posicion" aria-live="polite">
            {t.elOtro}: <strong>{t.posiciones[e.modo]}</strong>
          </p>
          <dl className="ira-pz-ficha">
            <div><dt>{t.indicador}</dt><dd>{e.indicador}</dd></div>
            <div><dt>{t.efecto}</dt><dd className={`ira-pz-efecto--${e.tipo}`}>{e.efecto}</dd></div>
            <p className="ira-pz-ficha__porque">{e.porque}</p>
          </dl>
        </div>
      </div>
    </div>
  );
}
