// IRA · Metodología 2.0 · P1 · La excepción democrática, condición a condición (pieza interactiva).
// Las ocho frases del manual (tabla de la sección 6.3) se comprueban contra las tres condiciones.
// Como en el manual, no hay orden: se aplica si se cumplen las tres y, si falla cualquiera, es un
// cierre normal. Las marcas ✓/✕ y la razón salen de la misma tabla (textosP1 · excepcion.ejemplos).
// Si se cumplen las tres, la excepción puede retirarse con un desmentido documentado.
// «Tu frase» deja contestar las tres preguntas a mano.
import { useRef, useState } from 'react';

function Veredicto({ ok }) {
  return <span className={`ira-pz-arbol__marca ira-pz-arbol__marca--${ok ? 'si' : 'no'}`} aria-hidden="true">{ok ? '✓' : '✕'}</span>;
}

export default function ArbolExcepcion({ condiciones, ejemplos, ui }) {
  const casos = [
    ...ejemplos.map(([frase, , razon, marcas]) => ({ frase, razon, marcas })),
    { propia: true, frase: ui.propia },
  ];
  const [activa, setActiva] = useState(0);
  const [propias, setPropias] = useState([null, null, null]);
  const [desmentido, setDesmentido] = useState(false);
  const refs = useRef([]);

  const caso = casos[activa];
  const respuestas = caso.propia ? propias : caso.marcas;
  const falla = respuestas.some((r) => r === false);
  const cumple = respuestas.every((r) => r === true);
  const excepcion = cumple;
  const resultado = falla ? 'cierre' : !cumple ? null : desmentido ? 'retirada' : 'excepcion';

  const elegir = (i) => {
    setActiva(i);
    setDesmentido(false);
    refs.current[i]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };
  const mover = (i) => {
    const n = (i + casos.length) % casos.length;
    elegir(n);
    refs.current[n]?.focus();
  };
  const onKey = (ev, i) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); mover(i + 1); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); mover(i - 1); }
  };
  const responder = (k, valor) => {
    setDesmentido(false);
    setPropias((p) => p.map((r, j) => (j === k ? valor : r)));
  };
  const estadoNodo = (k) => (respuestas[k] === null ? 'actual' : respuestas[k] ? 'si' : 'no');

  return (
    <div className="ira-pz-arbol">
      <p className="ira-met__texto">{ui.intro}</p>
      <div className="ira-pz-banda ira-pz-arbol__rejilla">
        <div role="radiogroup" aria-label={ui.etiqueta} className="ira-pz-frontera__frases">
          {casos.map((c, i) => (
            <button
              key={c.frase}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={i === activa}
              tabIndex={i === activa ? 0 : -1}
              onClick={() => elegir(i)}
              onKeyDown={(ev) => onKey(ev, i)}
              className={`ira-pz-frontera__frase ira-pz-arbol__frase${c.propia ? ' ira-pz-arbol__frase--propia' : ''}${i === activa ? ' is-activa' : ''}`}
            >
              <span className="ira-pz-frontera__cita">{c.frase}</span>
            </button>
          ))}
        </div>

        <div className="ira-pz-arbol__lado">
          <p className="ira-pz-arbol__entrada">{caso.propia ? ui.propiaAyuda : ui.entrada}</p>
          <ol className="ira-pz-arbol__nodos">
            {condiciones.map(([nombre, texto], k) => (
              <li key={nombre} className={`ira-pz-arbol__nodo is-${estadoNodo(k)}`}>
                <span className="ira-pz-arbol__n ira-cifra" aria-hidden="true">{k + 1}</span>
                <div className="ira-pz-arbol__cuerpo">
                  <p className="ira-pz-arbol__pregunta">{nombre}</p>
                  <p className="ira-pz-arbol__ayuda">{texto}</p>
                  {caso.propia ? (
                    <span className="ira-pz-arbol__botones" role="group" aria-label={nombre}>
                      {[true, false].map((v) => (
                        <button key={String(v)} type="button" aria-pressed={propias[k] === v} onClick={() => responder(k, v)}
                          className={`ira-pz-arbol__opcion ira-pz-arbol__opcion--${v ? 'si' : 'no'}${propias[k] === v ? ' is-on' : ''}`}>
                          {v ? ui.cumple : ui.noCumple}
                        </button>
                      ))}
                    </span>
                  ) : (
                    <p className="ira-pz-arbol__razon"><Veredicto ok={respuestas[k]} /> {respuestas[k] ? ui.cumple : ui.noCumple}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className={`ira-pz-arbol__resultado is-${resultado ?? 'pendiente'}`} aria-live="polite">
            {resultado ? (
              <>
                <p className="ira-pz-arbol__resultado-titulo">{ui.resultado[resultado].titulo}</p>
                {!caso.propia && <p className="ira-pz-arbol__manual"><span>{ui.segunManual}</span> {caso.razon}</p>}
                <dl className="ira-pz-arbol__efectos">
                  <div><dt>{ui.permeabilidad}</dt><dd>{ui.resultado[resultado].permeabilidad}</dd></div>
                  <div><dt>{ui.alcance}</dt><dd>{ui.resultado[resultado].alcance}</dd></div>
                </dl>
              </>
            ) : (
              <p className="ira-pz-arbol__resultado-titulo">{ui.pendiente}</p>
            )}
          </div>

          {excepcion && (
            <div className="ira-pz-arbol__salvaguarda">
              <p>{ui.desmentidoPregunta}</p>
              <span className="ira-pz-arbol__botones" role="group" aria-label={ui.desmentidoPregunta}>
                {[false, true].map((v) => (
                  <button key={String(v)} type="button" aria-pressed={desmentido === v} onClick={() => setDesmentido(v)}
                    className={`ira-pz-arbol__opcion ira-pz-arbol__opcion--${v ? 'no' : 'si'}${desmentido === v ? ' is-on' : ''}`}>
                    {v ? ui.desmentidoSi : ui.desmentidoNo}
                  </button>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
