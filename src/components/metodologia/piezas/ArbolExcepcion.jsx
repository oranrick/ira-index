// IRA · Metodología 2.0 · P1 · El árbol de la excepción democrática (pieza interactiva).
// Las ocho frases del manual (sección 6.3) recorren las tres condiciones en orden; en cuanto
// una falla, el árbol termina en cierre normal. Si se cumplen las tres, la excepción puede
// retirarse con un desmentido documentado. «Tu frase» deja contestar las tres preguntas a mano.
import { useRef, useState } from 'react';

function Veredicto({ ok }) {
  return <span className={`ira-pz-arbol__marca ira-pz-arbol__marca--${ok ? 'si' : 'no'}`} aria-hidden="true">{ok ? '✓' : '✕'}</span>;
}

export default function ArbolExcepcion({ condiciones, ejemplos, ui }) {
  const casos = [...ejemplos.map(([frase, , razon], i) => ({ frase, razon, ...ui.casos[i] })), { propia: true, frase: ui.propia }];
  const [activa, setActiva] = useState(0);
  const [propias, setPropias] = useState([null, null, null]);
  const [desmentido, setDesmentido] = useState(false);
  const refs = useRef([]);

  const caso = casos[activa];
  const respuestas = caso.propia ? propias : caso.pasos.map((p) => p[0]);
  const fallo = respuestas.findIndex((r) => r === false);
  const pendiente = respuestas.findIndex((r) => r === null);
  const completo = fallo !== -1 || pendiente === -1;
  const excepcion = completo && fallo === -1;
  const retirada = excepcion && desmentido;

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
    // Cambiar una respuesta deja sin contestar las preguntas que vienen después
    setPropias((p) => p.map((r, j) => (j === k ? valor : j > k ? null : r)));
  };

  const estadoNodo = (k) => {
    if (fallo !== -1 && k > fallo) return 'saltado';
    if (respuestas[k] === null) return k === pendiente ? 'actual' : 'saltado';
    return respuestas[k] ? 'si' : 'no';
  };

  const resultado = !completo ? null : retirada ? 'retirada' : excepcion ? 'excepcion' : 'cierre';

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
            {condiciones.map(([nombre, texto], k) => {
              const estado = estadoNodo(k);
              return (
                <li key={nombre} className={`ira-pz-arbol__nodo is-${estado}`}>
                  <span className="ira-pz-arbol__n ira-cifra" aria-hidden="true">{k + 1}</span>
                  <div className="ira-pz-arbol__cuerpo">
                    <p className="ira-pz-arbol__pregunta">{ui.preguntas[k]}</p>
                    <p className="ira-pz-arbol__ayuda">{texto}</p>
                    {caso.propia ? (
                      estado !== 'saltado' && (
                        <span className="ira-pz-arbol__botones" role="group" aria-label={ui.preguntas[k]}>
                          {[true, false].map((v) => (
                            <button key={String(v)} type="button" aria-pressed={propias[k] === v} onClick={() => responder(k, v)}
                              className={`ira-pz-arbol__opcion ira-pz-arbol__opcion--${v ? 'si' : 'no'}${propias[k] === v ? ' is-on' : ''}`}>
                              {v ? ui.si : ui.no}
                            </button>
                          ))}
                        </span>
                      )
                    ) : estado === 'saltado' ? (
                      <p className="ira-pz-arbol__razon ira-pz-arbol__razon--saltado">{ui.saltado}</p>
                    ) : (
                      <p className="ira-pz-arbol__razon"><Veredicto ok={respuestas[k]} /> {caso.pasos[k][1]}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={`ira-pz-arbol__resultado is-${resultado ?? 'pendiente'}`} aria-live="polite">
            {resultado ? (
              <>
                <p className="ira-pz-arbol__resultado-titulo">{ui.resultado[resultado].titulo}</p>
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

          {!caso.propia && caso.nota && <p className="ira-met__nota">{caso.nota}</p>}
        </div>
      </div>
    </div>
  );
}
