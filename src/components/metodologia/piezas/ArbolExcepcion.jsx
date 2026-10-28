// IRA · Metodología 2.0 · P1 · La excepción democrática, condición a condición (pieza interactiva).
// Las ocho frases del manual (tabla de la sección 6.3) se comprueban contra las tres condiciones.
// Como en el manual, no hay orden: se aplica si se cumplen las tres y, si falla cualquiera, es un
// cierre normal. Las marcas ✓/✕ y la razón salen de la misma tabla (textosP1 · excepcion.ejemplos).
// Si se cumplen las tres, la excepción puede retirarse con un desmentido documentado.
// «Tu frase» deja contestar las tres preguntas a mano con interruptores.
// Al elegir una frase, las condiciones se comprueban una tras otra (la línea se va llenando)
// y el resultado llega al final con su destello.
import { useEffect, useRef, useState } from 'react';
import { Chispas, Mando, PistaTeclas, Segmentado, chispazo, useRecorrido } from '../Juego.jsx';

function Veredicto({ ok }) {
  return <span className={`ira-pz-arbol__marca ira-pz-arbol__marca--${ok ? 'si' : 'no'}`} aria-hidden="true">{ok ? '✓' : '✕'}</span>;
}

const TONO_RESULTADO = { excepcion: 'oro', cierre: 'rojo', retirada: 'rojo' };

export default function ArbolExcepcion({ condiciones, ejemplos, ui }) {
  const casos = [
    ...ejemplos.map(([frase, , razon, marcas]) => ({ frase, razon, marcas })),
    { propia: true, frase: ui.propia },
  ];
  const [activa, setActiva] = useState(0);
  const [propias, setPropias] = useState([null, null, null]);
  const [desmentido, setDesmentido] = useState(false);
  const refs = useRef([]);
  const resultadoRef = useRef(null);
  const n = casos.length;

  const caso = casos[activa];
  const respuestas = caso.propia ? propias : caso.marcas;
  const falla = respuestas.some((r) => r === false);
  const cumple = respuestas.every((r) => r === true);
  const excepcion = cumple;
  const resultado = falla ? 'cierre' : !cumple ? null : desmentido ? 'retirada' : 'excepcion';

  // Destello del resultado cuando llega (en las frases del manual, al terminar la comprobación)
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) { primera.current = false; return undefined; }
    if (!resultado) return undefined;
    const id = setTimeout(() => chispazo(resultadoRef.current, TONO_RESULTADO[resultado], 10), caso.propia ? 120 : 1050);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, resultado]);

  const elegir = (i, ev) => {
    const k = (i + n) % n;
    if (k !== activa && ev) chispazo(ev, 'oro', 7);
    setActiva(k);
    setDesmentido(false);
    refs.current[k]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };
  // El recorrido salta «tu frase»: ahí decides tú
  const recorrido = useRecorrido(n - 1, () => { setActiva((a) => (a + 1) % (n - 1)); setDesmentido(false); }, 3600);
  const mover = (i) => {
    recorrido.parar();
    const k = (i + n) % n;
    elegir(k);
    refs.current[k]?.focus();
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
  const opcionesCumple = [
    { id: 'si', nombre: ui.cumple, tono: 'salvia' },
    { id: 'no', nombre: ui.noCumple, tono: 'rojo' },
  ];

  return (
    <div className={`ira-pz-arbol ira-juego-espera${recorrido.visto ? ' is-visto' : ''}`} ref={recorrido.ref}>
      <div className="ira-juego-cab">
        <p className="ira-met__texto">{ui.intro}</p>
        <PistaTeclas />
      </div>
      <div className="ira-pz-banda ira-pz-arbol__rejilla">
        <div className="ira-pz-arbol__izq">
          <div role="radiogroup" aria-label={ui.etiqueta} className="ira-pz-frontera__frases">
            {casos.map((c, i) => (
              <button
                key={c.frase}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={i === activa}
                tabIndex={i === activa ? 0 : -1}
                onClick={(ev) => { recorrido.parar(); elegir(i, ev); }}
                onKeyDown={(ev) => onKey(ev, i)}
                className={`ira-pz-frontera__frase ira-pz-arbol__frase ira-juego-elige ira-juego--oro${c.propia ? ' ira-pz-arbol__frase--propia' : ''}${i === activa ? ' is-activa' : ''}`}
              >
                <span className="ira-pz-frontera__cita">{c.frase}</span>
                {i === activa && <Chispas key={`c${activa}`} tono="oro" semilla={c.frase} cantidad={2} />}
              </button>
            ))}
          </div>
          <Mando i={activa} n={n} ir={(k) => elegir(k)} recorrido={recorrido} tono="oro" etiqueta={ui.etiqueta}
            textos={{ anterior: 'Frase anterior', siguiente: 'Frase siguiente', recorrer: 'Recorrer' }} />
        </div>

        <div className="ira-pz-arbol__lado">
          <p className="ira-pz-arbol__entrada">{caso.propia ? ui.propiaAyuda : ui.entrada}</p>
          <ol key={`nodos-${activa}`} className={`ira-pz-arbol__nodos${caso.propia ? ' is-propia' : ' is-comprobando'}`}>
            {condiciones.map(([nombre, texto], k) => (
              <li key={nombre} className={`ira-pz-arbol__nodo is-${estadoNodo(k)}`} style={{ '--k': k }}>
                <span className="ira-pz-arbol__n ira-cifra" aria-hidden="true">{k + 1}</span>
                <div className="ira-pz-arbol__cuerpo">
                  <p className="ira-pz-arbol__pregunta">{nombre}</p>
                  <p className="ira-pz-arbol__ayuda">{texto}</p>
                  {caso.propia ? (
                    <Segmentado
                      etiqueta={nombre}
                      opciones={opcionesCumple}
                      valor={propias[k] === null ? null : propias[k] ? 'si' : 'no'}
                      onCambio={(id) => responder(k, id === 'si')}
                    />
                  ) : (
                    <p className="ira-pz-arbol__razon"><Veredicto ok={respuestas[k]} /> {respuestas[k] ? ui.cumple : ui.noCumple}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div ref={resultadoRef} key={`res-${activa}-${resultado}`} className={`ira-pz-arbol__resultado is-${resultado ?? 'pendiente'}${caso.propia ? '' : ' is-tras-comprobar'}`} aria-live="polite">
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
              <Segmentado
                etiqueta={ui.desmentidoPregunta}
                opciones={[{ id: 'no', nombre: ui.desmentidoNo, tono: 'oro' }, { id: 'si', nombre: ui.desmentidoSi, tono: 'rojo' }]}
                valor={desmentido ? 'si' : 'no'}
                onCambio={(id) => setDesmentido(id === 'si')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
