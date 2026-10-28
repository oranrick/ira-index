// IRA · Metodología 2.0 · P1 · El discurso anotado (pieza interactiva).
// Fragmento de Barcelona 2026 (oraciones 38-54) tal como sale de research/: cada referencia a
// personas está localizada en su oración con su código, y cada evento de frontera con su marca.
// Al tocar una referencia o un evento se abre su ficha. Los nombres de los códigos y las reglas
// que se citan salen de textosP1 (copia web del manual): la pieza no añade reglas propias.
import { useRef, useState } from 'react';
import { Mando, chispazo, tonoDe, useRecorrido } from '../Juego.jsx';

// Regla del manual que decide cada código (índices de textosP1 · ind.alcance.reglas)
const REGLA_ALCANCE = { GC: 0, G: 2 };

function partir(texto, referencias) {
  const trozos = [];
  let cursor = 0;
  [...referencias].filter((r) => r.inicio != null).sort((a, b) => a.inicio - b.inicio).forEach((r) => {
    if (r.inicio > cursor) trozos.push({ texto: texto.slice(cursor, r.inicio) });
    trozos.push({ texto: texto.slice(r.inicio, r.fin), ref: r });
    cursor = r.fin;
  });
  if (cursor < texto.length) trozos.push({ texto: texto.slice(cursor) });
  return trozos;
}

export default function DiscursoAnotado({ fragmento, t, ui }) {
  const alcance = t.ind.alcance;
  const interpelacion = t.ind.interpelacion;
  const permeabilidad = t.ind.permeabilidad;
  const filaCodigo = (c) => alcance.codigos.find((x) => x.codigo === c) ?? interpelacion.codigos.find((x) => x.codigo === c);
  const marca = (c) => [...permeabilidad.cierres, ...permeabilidad.aperturas].find((m) => m[0] === c);
  const dificil = permeabilidad.dificiles[ui.dificil.indice];

  const inicial = (() => {
    const o = fragmento.oraciones.find((x) => x.oracion === ui.inicial.oracion);
    return { tipo: 'ref', oracion: o.oracion, n: o.referencias.find((r) => r.forma === ui.inicial.forma)?.n };
  })();
  const [sel, setSelBase] = useState(inicial);
  const esSel = (tipo, oracion, id) => sel.tipo === tipo && sel.oracion === oracion && (id === undefined || sel.n === id || sel.k === id);
  const botones = useRef({});

  // Todas las marcas en orden de lectura, para recorrerlas con el mando
  const orden = [];
  fragmento.oraciones.forEach((o) => {
    [...o.referencias].filter((r) => r.inicio != null).sort((a, b) => a.inicio - b.inicio)
      .forEach((r) => orden.push({ tipo: 'ref', oracion: o.oracion, n: r.n, tono: r.grupo }));
    o.eventos.forEach((e, k) => orden.push({ tipo: 'evento', oracion: o.oracion, k, tono: e.tipo === 'C' ? 'rojo' : 'salvia' }));
    if (o.oracion === ui.dificil.oracion) orden.push({ tipo: 'dificil', oracion: o.oracion, tono: 'oro' });
  });
  const clave = (x) => `${x.tipo}-${x.oracion}-${x.n ?? x.k ?? ''}`;
  const pos = Math.max(0, orden.findIndex((x) => clave(x) === clave(sel)));
  const setSel = (x, ev) => {
    if (clave(x) !== clave(sel)) chispazo(ev ?? botones.current[clave(x)], tonoDe(x.tono ?? 'oro'), 7);
    setSelBase(x);
  };
  const ir = (k) => {
    const x = orden[(k + orden.length) % orden.length];
    setSel(x);
    botones.current[clave(x)]?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  };
  const recorrido = useRecorrido(orden.length, () => {
    setSelBase((s) => {
      const i = orden.findIndex((x) => clave(x) === clave(s));
      return orden[(i + 1) % orden.length];
    });
  }, 2600);
  const manual = (x, ev) => { recorrido.parar(); setSel(x, ev); };

  const parrafos = [];
  fragmento.oraciones.forEach((o) => {
    const ultimo = parrafos[parrafos.length - 1];
    if (ultimo && ultimo.n === o.parrafo) ultimo.oraciones.push(o);
    else parrafos.push({ n: o.parrafo, oraciones: [o] });
  });

  const oracionSel = fragmento.oraciones.find((o) => o.oracion === sel.oracion);
  let ficha = null;
  if (sel.tipo === 'ref') {
    const r = oracionSel.referencias.find((x) => x.n === sel.n);
    const fila = filaCodigo(r.codigo);
    const indicador = r.indicador === 'alcance' ? alcance.nombre : r.indicador === 'interpelacion' ? interpelacion.nombre : null;
    const esRegla = REGLA_ALCANCE[r.codigo] != null || r.indicador === 'interpelacion';
    const regla = REGLA_ALCANCE[r.codigo] != null ? alcance.reglas[REGLA_ALCANCE[r.codigo]]
      : r.indicador === 'interpelacion' ? interpelacion.regla : fila?.ej;
    ficha = {
      grupo: r.grupo,
      titulo: <><span className="ira-pz-anot__forma">«{r.forma}»</span> <span className="ira-pz-anot__codigo ira-cifra">{r.codigo}</span></>,
      categoria: fila?.categoria,
      filas: [[ui.indicador, indicador ? `${indicador} · ${ui.vale(r.valor)}` : t.ind.noCuenta]],
      regla,
      reglaEtiqueta: esRegla ? ui.reglaManual : ui.segunManual,
      nota: r.nota,
    };
  } else if (sel.tipo === 'evento') {
    const e = oracionSel.eventos[sel.k];
    const m = marca(e.codigo);
    ficha = {
      grupo: e.tipo === 'C' ? 'contra' : 'inclusivo',
      titulo: <><span className="ira-pz-anot__codigo ira-cifra">{e.codigo}</span> {m?.[1] ?? e.marca}</>,
      categoria: ui.evento,
      filas: [[permeabilidad.nombre, e.tipo === 'C' ? ui.sumaCierre : ui.sumaApertura], [ui.blanco, ui.blancos?.[e.blanco] ?? e.blanco]],
      regla: m?.[2],
      reglaEtiqueta: ui.ejemploManual,
      nota: e.nota,
    };
  } else {
    ficha = { grupo: 'tenue', titulo: dificil[0], categoria: ui.casoDificil, filas: [[permeabilidad.nombre, ui.sinEvento]], regla: dificil[1], reglaEtiqueta: ui.reglaManual };
  }

  const r = fragmento.recuento.por_codigo;
  const ev = fragmento.recuento.eventos;
  const resumen = [
    [alcance.nombre, ui.resumenAlcance((r.U ?? 0) + (r.G ?? 0), r.GC ?? 0)],
    [interpelacion.nombre, ui.resumenInterpelacion(r['2I'] ?? 0, r['2C'] ?? 0)],
    [permeabilidad.nombre, ui.resumenPermeabilidad(ev.A ?? 0, ev.C ?? 0)],
  ];

  return (
    <div className="ira-pz-anot">
      <p className="ira-met__texto">{ui.intro}</p>
      <ul className="ira-pz-anot__leyenda" aria-label={ui.leyenda}>
        {ui.grupos.map(([g, nombre]) => <li key={g} className={`ira-pz-anot__clave ira-pz-anot--${g}`}>{nombre}</li>)}
        <li className="ira-pz-anot__clave ira-pz-anot__clave--evento">{ui.leyendaEvento}</li>
      </ul>

      <div className={`ira-pz-anot__mando ira-juego-espera${recorrido.visto ? ' is-visto' : ''}`} ref={recorrido.ref}>
        <Mando i={pos} n={orden.length} ir={ir} recorrido={recorrido} tono={sel.tipo === 'dificil' ? 'oro' : ficha.grupo}
          etiqueta="Marcas del fragmento" textos={{ anterior: 'Marca anterior', siguiente: 'Marca siguiente', recorrer: 'Leer marca a marca' }} />
      </div>
      <div className="ira-pz-banda ira-pz-anot__rejilla">
        <div className="ira-pz-anot__texto" lang="es">
          {ui.aviso && <p className="ira-met__nota ira-pz-anot__aviso" lang={ui.lang}>{ui.aviso}</p>}
          {parrafos.map((p) => (
            <p key={p.n} className="ira-pz-anot__parrafo">
              {p.oraciones.map((o) => (
                <span key={o.oracion} className="ira-pz-anot__oracion">
                  {partir(o.texto, o.referencias).map((tr, i) => (tr.ref ? (
                    <button key={i} type="button" aria-pressed={esSel('ref', o.oracion, tr.ref.n)}
                      ref={(el) => { botones.current[`ref-${o.oracion}-${tr.ref.n}`] = el; }}
                      onClick={(ev) => manual({ tipo: 'ref', oracion: o.oracion, n: tr.ref.n, tono: tr.ref.grupo }, ev)}
                      className={`ira-pz-anot__ref ira-pz-anot--${tr.ref.grupo}${esSel('ref', o.oracion, tr.ref.n) ? ' is-activa' : ''}`}>
                      {tr.texto}<sup className="ira-cifra">{tr.ref.codigo}</sup>
                    </button>
                  ) : <span key={i}>{tr.texto}</span>))}
                  {o.eventos.map((e, k) => (
                    <button key={`e${k}`} type="button" aria-pressed={esSel('evento', o.oracion, k)}
                      ref={(el) => { botones.current[`evento-${o.oracion}-${k}`] = el; }}
                      onClick={(ev) => manual({ tipo: 'evento', oracion: o.oracion, k, tono: e.tipo === 'C' ? 'rojo' : 'salvia' }, ev)}
                      className={`ira-pz-anot__evento ira-pz-anot__evento--${e.tipo}${esSel('evento', o.oracion, k) ? ' is-activa' : ''}`}
                      aria-label={`${ui.evento} ${e.codigo}`}>
                      <span className="ira-cifra">{e.codigo}</span>
                    </button>
                  ))}
                  {o.oracion === ui.dificil.oracion && (
                    <button type="button" aria-pressed={sel.tipo === 'dificil'}
                      ref={(el) => { botones.current[`dificil-${o.oracion}-`] = el; }}
                      onClick={(ev) => manual({ tipo: 'dificil', oracion: o.oracion, tono: 'oro' }, ev)}
                      className={`ira-pz-anot__evento ira-pz-anot__evento--dificil${sel.tipo === 'dificil' ? ' is-activa' : ''}`} lang={ui.lang}>
                      {ui.casoDificil}
                    </button>
                  )}
                  {' '}
                </span>
              ))}
            </p>
          ))}
          <p className="ira-pz-anot__fuente" lang={ui.lang}>{ui.fuente}</p>
        </div>

        <aside className={`ira-pz-anot__ficha ira-pz-anot--${ficha.grupo}`} aria-live="polite" key={`${sel.tipo}-${sel.oracion}-${sel.n ?? sel.k ?? ''}`}>
          <p className="ira-pz-anot__ficha-cat">{ficha.categoria}</p>
          <p className="ira-pz-anot__ficha-titulo">{ficha.titulo}</p>
          <dl className="ira-pz-anot__filas">
            {ficha.filas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="ira-pz-anot__oracion-sel" lang="es">«{oracionSel.texto}»</p>
          {ficha.regla && <p className="ira-pz-anot__regla"><span>{ficha.reglaEtiqueta}</span> {ficha.regla}</p>}
          {ficha.nota && <p className="ira-pz-anot__nota"><span>{ui.notaCodificador}</span> <span lang="es">{ficha.nota}</span></p>}
        </aside>
      </div>

      <div className="ira-pz-anot__resumen">
        <p className="ira-pz-anot__resumen-titulo">{ui.resumenTitulo}</p>
        <dl>{resumen.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <p className="ira-met__nota">{ui.resumenNota}</p>
      </div>
    </div>
  );
}
