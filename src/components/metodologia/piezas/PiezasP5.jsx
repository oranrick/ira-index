// IRA · Metodología 2.0 · P5 · piezas propias de «La palabra del otro».
// La imagen de todo el parámetro es una voz dibujada como onda: llega al discurso por la izquierda
// y a la derecha queda lo que el discurso hace con ella (resuena, recibe respuesta o se apaga).
// Gramática de color: la voz del otro va en claro; la voz del propio discurso, en oro; el resultado
// toma el color de su signo. Ninguna pieza calcula IRA salvo la balanza, que aplica la fórmula del
// manual (research/manual/P5.md, 4.4) a los recuentos que el lector elige.
import { useMemo, useRef, useState } from 'react';
import { colorCifra, ESCALA } from '../../../lib/escala.js';
import { Chispas, Mando, NumeroAnimado, PistaDeslizar, PistaTeclas, chispazo, tonoDe, traerEnTira, useAlVer, useDeslizar, useRecorrido } from '../Juego.jsx';

const TONO = { V: 'empatica', B: 'neutra', Z: 'polariza' };

// ── Ondas ─────────────────────────────────────────────────────────────────────

/** Onda senoidal entre x0 y x1. amp: número o función de x. La fase es continua en todo el lienzo
 *  (origen), así dos tramos contiguos empalman sin salto. */
function onda(x0, x1, amp, { y = 0, periodo = 50, fase = 0, origen = 0, paso = 3 } = {}) {
  const n = Math.max(1, Math.round(Math.abs(x1 - x0) / paso));
  let d = '';
  for (let i = 0; i <= n; i += 1) {
    const x = x0 + ((x1 - x0) * i) / n;
    const a = typeof amp === 'function' ? amp(x) : amp;
    const yy = y - a * Math.sin(((x - origen) / periodo) * 2 * Math.PI + fase);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
}

/** Garabato sin periodo: lo dicho tratado como si no dijera nada. Determinista. */
function garabato(x0, x1, y, amp0) {
  let s = 7;
  const azar = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  let d = `M${x0} ${y}`;
  let signo = 1;
  for (let x = x0 + 6; x <= x1; x += 5 + azar() * 6) {
    const u = (x - x0) / (x1 - x0);
    const a = amp0 * (1 - u) ** 1.3 * (0.35 + azar() * 0.9);
    d += `L${x.toFixed(1)} ${(y - signo * a).toFixed(1)}`;
    signo = -signo;
  }
  return `${d}L${x1} ${y}`;
}

// ── Emblema de cabecera ───────────────────────────────────────────────────────

export function EmblemaP5({ codigo, titulo }) {
  const entra = onda(12, 92, 15, { y: 100, periodo: 40, origen: 12 });
  const sale = [
    ['empatica', onda(124, 190, (x) => 9 + ((x - 124) / 66) * 7, { y: 52, periodo: 33, origen: 124 })],
    ['neutra', onda(124, 190, 10, { y: 100, periodo: 33, origen: 124 })],
    ['polariza', onda(124, 190, (x) => 10 * Math.max(0, 1 - (x - 124) / 40) ** 1.5, { y: 148, periodo: 33, origen: 124 })],
  ];
  return (
    <svg viewBox="0 0 200 200" className="ira-met__emblema ira-p5-emblema" role="img" aria-label={titulo}>
      <path d={entra} className="ira-p5-emblema__entra" />
      <path d={entra} pathLength="100" className="ira-p5-emblema__pulso" />
      <line x1="100" y1="34" x2="100" y2="80" className="ira-p5-emblema__puerta" />
      <line x1="100" y1="120" x2="100" y2="166" className="ira-p5-emblema__puerta" />
      {sale.map(([tono, d], i) => (
        <g key={tono} className={`ira-p2--${tono}`}>
          <path d={`M100 100 C112 100, 110 ${52 + i * 48}, 124 ${52 + i * 48}`} className="ira-p5-emblema__ramal" />
          <path d={d} className="ira-p5-emblema__sale" />
          <path d={d} pathLength="100" className="ira-p5-emblema__pulso ira-p5-emblema__pulso--sale" style={{ '--k': i }} />
        </g>
      ))}
      <text x="100" y="194" textAnchor="middle" className="ira-p5-emblema__codigo ira-cifra">{codigo}</text>
    </svg>
  );
}

// ── Glifos de «La idea» ───────────────────────────────────────────────────────

/** La misma voz en tres finales: se apaga (Z), recibe respuesta (B) o resuena (V). */
export function GlifoVoz({ tipo, titulo }) {
  const base = { y: 20, periodo: 30, origen: 4 };
  const entra = onda(4, 52, 9, base);
  return (
    <svg viewBox="0 0 150 40" className={`ira-p5-glifo ira-p5-glifo--${tipo}`} role="img" aria-label={titulo}>
      <path d={entra} className="ira-p5-glifo__entra" />
      <line x1="56" y1="6" x2="56" y2="34" className="ira-p5-glifo__puerta" />
      {tipo === 'Z' && (
        <>
          <path d={onda(60, 100, (x) => 9 * Math.max(0, 1 - (x - 60) / 34) ** 1.4, base)} className="ira-p5-glifo__sale" />
          <line x1="100" y1="20" x2="146" y2="20" className="ira-p5-glifo__plano" />
        </>
      )}
      {tipo === 'B' && (
        <>
          <path d={onda(60, 146, 9, base)} className="ira-p5-glifo__sale" />
          <path d={onda(146, 76, 7, { ...base, fase: Math.PI })} className="ira-p5-glifo__propia" />
        </>
      )}
      {tipo === 'V' && (
        <>
          <path d={onda(60, 146, (x) => 9 + ((x - 60) / 86) * 5, base)} className="ira-p5-glifo__sale" />
          <path d={onda(70, 146, (x) => 4 + ((x - 70) / 76) * 5, { ...base, fase: 0.5 })} className="ira-p5-glifo__propia" />
        </>
      )}
    </svg>
  );
}

// ── Pieza principal: qué hace el discurso con la voz del otro ────────────────

const Y = 100; // línea de base de la voz
const X_OTRO = 38;
const X0 = 62; // la voz sale de quien habla
const XP = 220; // el discurso (la puerta)
const X1 = 404;
const AMP = 20;
const BASE = { y: Y, periodo: 50, origen: X0 };

/** Lo que se dibuja a la derecha de la puerta para cada código. */
function escena(codigo) {
  const entra = onda(X0, codigo === 'Z3' ? XP - 7 : XP, AMP, BASE);
  switch (codigo) {
    case 'B': return {
      entra,
      sale: onda(XP, X1, AMP, BASE),
      propia: onda(XP + 14, X1, 15, { ...BASE, fase: Math.PI }),
      paso: onda(X0, X1, AMP, BASE),
    };
    case 'V2': {
      const crece = (x) => (x < XP ? AMP : AMP + ((x - XP) / (X1 - XP)) * 9);
      return {
        entra,
        sale: onda(XP, X1, crece, BASE),
        propia: onda(XP + 18, X1, (x) => 6 + ((x - XP) / (X1 - XP)) * 12, { ...BASE, fase: 0.55 }),
        paso: onda(X0, X1, crece, BASE),
      };
    }
    case 'V3': return {
      entra,
      sale: onda(XP, X1, AMP, BASE),
      propia: onda(X1 - 88, X1, 11, { ...BASE, fase: Math.PI }),
      espera: true,
      paso: onda(X0, X1, AMP, BASE),
    };
    case 'V1': {
      const crece = (x) => (x < XP ? AMP : AMP + ((x - XP) / (X1 - XP)) * 6);
      return { entra, sale: onda(XP, X1, crece, BASE), paso: onda(X0, X1, crece, BASE), abierta: true };
    }
    case 'Z2': return { entra, ruido: garabato(XP, X1 - 24, Y, 30), paso: entra };
    case 'Z1': return {
      entra,
      sale: onda(XP, XP + 104, (x) => AMP * Math.max(0, 1 - (x - XP) / 100) ** 1.6, BASE),
      vuelta: `M${XP - 6} 42 C${XP - 52} -10, ${X_OTRO + 58} -8, ${X_OTRO + 7} ${Y - 26}`,
      paso: entra,
    };
    default: return { entra, paso: entra, cerrada: true }; // Z3
  }
}

function Respuesta({ children, tono }) {
  return <span className={`ira-p2-paso__resp ira-p5-resp${tono ? ` ira-p5-resp--${tono}` : ''}`}>{children}</span>;
}

export function VozAjena({ t }) {
  const [activa, setActiva] = useState(0);
  const [vuelta, setVuelta] = useState(0); // tocar el dibujo repite la escena
  const refs = useRef([]);
  const n = t.ejemplos.length;
  const e = t.ejemplos[activa];
  const tono = TONO[e.familia];
  const esc = useMemo(() => escena(e.codigo), [e.codigo]);

  const elegir = (i, ev) => {
    const k = (i + n) % n;
    if (k !== activa) chispazo(ev ?? refs.current[k], TONO[t.ejemplos[k].familia], 8);
    else setVuelta((v) => v + 1); // la misma frase otra vez: se repite la escena
    setActiva(k);
    traerEnTira(refs.current[k]);
  };
  const activaRef = useRef(activa);
  activaRef.current = activa;
  const elegirRef = useRef(elegir);
  elegirRef.current = elegir;
  const recorrido = useRecorrido(n, () => elegirRef.current(activaRef.current + 1), 4200);
  const mover = (i) => {
    recorrido.parar();
    elegir(i);
    refs.current[(i + n) % n]?.focus({ preventScroll: true });
  };
  const deslizar = useDeslizar((ev) => { recorrido.parar(); elegir(activa + 1, ev); }, (ev) => { recorrido.parar(); elegir(activa - 1, ev); });
  const onKey = (ev, i) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); mover(i + 1); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); mover(i - 1); }
  };
  const hueco = esc.abierta ? 50 : 36; // media altura de la abertura de la puerta
  const clave = `${activa}-${vuelta}`;

  return (
    <div className={`ira-p2-apunta ira-p5-voz ira-juego-espera${recorrido.visto ? ' is-visto' : ''}`} ref={recorrido.ref}>
      <div className="ira-juego-cab">
        <p className="ira-met__texto">{t.intro}</p>
        <PistaTeclas />
      </div>
      <div className="ira-pz-banda ira-p2-apunta__rejilla">
        <div className="ira-p2-apunta__izq">
          <div role="radiogroup" aria-label={t.etiqueta} className="ira-p2-apunta__frases">
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
                className={`ira-p2-apunta__frase ira-juego-elige ira-juego--${tonoDe(TONO[x.familia])} ira-p2--${TONO[x.familia]}${i === activa ? ' is-activa' : ''}`}
              >
                <span className="ira-p2-codigo ira-cifra">{x.codigo}</span>
                <span className="ira-p2-apunta__frase-texto">
                  <span className="ira-p2-apunta__corto">{t.familias[x.familia]} · {x.subtipo}</span>
                  <span className="ira-p2-apunta__cita">{x.frase}</span>
                </span>
                {i === activa && <Chispas key={`c${activa}`} tono={TONO[x.familia]} semilla={x.frase} />}
              </button>
            ))}
          </div>
          <Mando i={activa} n={n} ir={elegir} recorrido={recorrido} tono={tono} etiqueta={t.etiqueta} textos={t.mando} />
        </div>

        <div className={`ira-p2-apunta__lado ira-p2--${tono} ira-juego--${tonoDe(tono)}`} {...deslizar}>
          <svg
            viewBox="0 0 440 194"
            className={`ira-p5-escena ira-p5-escena--${e.codigo} ira-p5-escena--${e.familia}${e.entrada === 'norma' ? ' ira-p5-escena--norma' : ''}`}
            role="img"
            aria-label={`${e.frase}: ${e.escena}`}
            onClick={(ev) => { chispazo(ev, tono, 9); setVuelta((v) => v + 1); }}
          >
            {/* silencio: la línea sin voz */}
            <line x1={X0} y1={Y} x2={X1} y2={Y} className="ira-p5-escena__base" />

            {/* el discurso: una puerta por la que la voz pasa o no */}
            <g className="ira-p5-escena__puerta">
              <line x1={XP} y1="28" x2={XP} y2={Y - hueco} />
              <line x1={XP} y1={Y + hueco} x2={XP} y2="172" />
            </g>
            <text x={XP + 11} y="38" className="ira-p5-escena__rotulo ira-p5-escena__rotulo--discurso">{t.discurso}</text>

            <g key={clave}>
              {/* la voz del otro llega, y el discurso acusa la llegada */}
              <path d={esc.entra} pathLength="100" className="ira-p5-escena__entra" />
              <circle cx={XP} cy={Y} r="7" className="ira-p5-escena__llegada" style={{ transformOrigin: `${XP}px ${Y}px` }} />

              {/* lo que queda al otro lado */}
              {esc.sale && <path d={esc.sale} pathLength="100" className="ira-p5-escena__sale" />}
              {esc.ruido && <path d={esc.ruido} pathLength="100" className="ira-p5-escena__sale ira-p5-escena__ruido" />}
              {esc.propia && <path d={esc.propia} pathLength="100" className={`ira-p5-escena__propia${esc.espera ? ' ira-p5-escena__propia--espera' : ''}`} />}
              {esc.vuelta && (
                <g className="ira-p5-escena__vuelta">
                  <path d={esc.vuelta} pathLength="100" />
                  <path d={`M${X_OTRO + 1} ${Y - 36} L${X_OTRO + 7} ${Y - 24} L${X_OTRO + 18} ${Y - 31}`} className="ira-p5-escena__vuelta-punta" />
                </g>
              )}
              {esc.cerrada && (
                <g className="ira-p5-escena__cierre">
                  <line x1={XP} y1={Y - hueco} x2={XP} y2={Y + hueco} style={{ transformOrigin: `${XP}px ${Y}px` }} />
                  <path d={`M${XP - 12} ${Y - 15} q-8 15 0 30`} className="ira-p5-escena__rebote" style={{ '--k': 0 }} />
                  <path d={`M${XP - 22} ${Y - 22} q-11 22 0 44`} className="ira-p5-escena__rebote" style={{ '--k': 1 }} />
                </g>
              )}

              {/* pulsos: la voz sigue llegando mientras se mira */}
              <path d={esc.paso} pathLength="100" className="ira-p5-escena__pulso" />
              {esc.propia && <path d={esc.propia} pathLength="100" className="ira-p5-escena__pulso ira-p5-escena__pulso--propia" />}

              {/* quien habla */}
              <g className="ira-p5-escena__otro">
                <circle cx={X_OTRO} cy={Y} r="17" className="ira-p5-escena__aro" />
                <circle cx={X_OTRO} cy={Y - 5} r="4.6" className="ira-p5-escena__figura" />
                <path d={`M${X_OTRO - 8.5} ${Y + 10} Q${X_OTRO - 8.5} ${Y + 1.5} ${X_OTRO} ${Y + 1.5} Q${X_OTRO + 8.5} ${Y + 1.5} ${X_OTRO + 8.5} ${Y + 10}`} className="ira-p5-escena__figura" />
              </g>
            </g>

            <text x={X_OTRO} y={Y + 40} className="ira-p5-escena__rotulo">{t.otro}</text>
            <text x={(XP + X1) / 2} y="184" className="ira-p5-escena__rotulo">{t.queda}</text>
          </svg>
          <p className="ira-p5-voz__escena" key={`e-${activa}`}>{e.escena}</p>

          <PistaDeslizar />
          <ol key={`pasos-${activa}`} className="ira-p2-pasos">
            <li className="ira-p2-paso" style={{ '--k': 0 }}><span className="ira-p2-paso__n ira-cifra">1</span><span className="ira-p2-paso__q">{t.paso1}</span><Respuesta>{t.entradas[e.entrada]}</Respuesta></li>
            <li className="ira-p2-paso" style={{ '--k': 1 }}><span className="ira-p2-paso__n ira-cifra">2</span><span className="ira-p2-paso__q">{t.paso2}</span><Respuesta tono={tono}>{t.familias[e.familia]}</Respuesta></li>
            <li className="ira-p2-paso" style={{ '--k': 2 }}><span className="ira-p2-paso__n ira-cifra">3</span><span className="ira-p2-paso__q">{t.paso3}</span><Respuesta>{e.codigo}</Respuesta></li>
          </ol>

          <div className="ira-p2-veredicto" aria-live="polite" key={`v-${activa}`}>
            <p className="ira-p2-veredicto__resultado"><span className="ira-p2-pildora">{e.codigo} · {t.familias[e.familia]}</span><span className="ira-p5-voz__signo">{t.signos[e.familia]}</span></p>
            <p className="ira-p5-voz__subtipo">{e.subtipo}</p>
            <p className="ira-p2-veredicto__porque">{e.porque}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── La unidad: un evento, por partes ──────────────────────────────────────────

export function AnatomiaEvento({ t }) {
  const [ref, visto] = useAlVer();
  const orden = { marca: 0, voz: 1, hace: 2 };
  return (
    <figure ref={ref} className={`ira-p5-anatomia${visto ? ' is-visto' : ''}`} aria-label={t.etiqueta}>
      <blockquote className="ira-p5-anatomia__frase">
        <span aria-hidden="true">«</span>
        {t.tramos.map((x, i) => (x.parte
          ? <span key={i} className={`ira-p5-tramo ira-p5-tramo--${x.parte}`} style={{ '--k': orden[x.parte] }}>{x.texto}<sup className="ira-cifra" aria-hidden="true">{orden[x.parte] + 1}</sup></span>
          : <span key={i}>{x.texto}</span>))}
        <span aria-hidden="true">»</span>
        {t.traduccion && <span className="ira-p5-anatomia__traduccion">{t.traduccion}</span>}
      </blockquote>
      <ol className="ira-p5-anatomia__partes">
        {t.partes.map(([id, nombre, texto], i) => (
          <li key={id} className={`ira-p5-parte ira-p5-parte--${id}`} style={{ '--k': i }}>
            <span className="ira-p5-parte__n ira-cifra" aria-hidden="true">{i + 1}</span>
            <span className="ira-p5-parte__nombre">{nombre}</span>
            <span className="ira-p5-parte__texto">{texto}</span>
          </li>
        ))}
      </ol>
      <p className={`ira-p2-ecuacion ira-p5-anatomia__suma${visto ? ' is-visible' : ''}`}>
        {t.suma.map((x, i) => (
          <span key={x} className="ira-p2-ecuacion__parte" style={{ '--k': i + 4 }}>
            {i > 0 && <span className="ira-p2-ecuacion__op" aria-hidden="true">+</span>}
            <span className="ira-p2-ecuacion__caja">{x}</span>
          </span>
        ))}
        <span className="ira-p2-ecuacion__parte" style={{ '--k': 7 }}>
          <span className="ira-p2-ecuacion__op" aria-hidden="true">=</span>
          <span className="ira-p2-ecuacion__caja ira-p2-ecuacion__caja--total">{t.total}</span>
        </span>
      </p>
    </figure>
  );
}

// ── Qué se ataca: dónde cae la respuesta ──────────────────────────────────────

const PUNTA = 'M0 -11 L2.4 -2.4 L11 0 L2.4 2.4 L0 11 L-2.4 2.4 L-11 0 L-2.4 -2.4 Z';
const DIANA = { persona: [58, 96], motivo: [156, 96], sentido: [336, 44], contenido: [336, 96] };

export function DondeGolpea({ t }) {
  const [sel, setSel] = useState('contenido');
  const [golpe, setGolpe] = useState(0);
  const refs = useRef({});
  const ids = t.opciones.map((o) => o.id);
  const o = t.opciones.find((x) => x.id === sel);
  const elegir = (id, ev) => {
    const nuevo = t.opciones.find((x) => x.id === id);
    chispazo(ev ?? refs.current[id], nuevo.tono === 'otro' ? 'oro' : nuevo.tono, 8);
    setSel(id);
    setGolpe((g) => g + 1);
  };
  const onKey = (ev, id) => {
    const i = ids.indexOf(id);
    let k = null;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') k = (i + 1) % ids.length;
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') k = (i - 1 + ids.length) % ids.length;
    if (k === null) return;
    ev.preventDefault();
    elegir(ids[k]);
    refs.current[ids[k]]?.focus({ preventScroll: true });
  };
  const [dx, dy] = DIANA[sel];
  const zona = (id, forma) => (
    <g className={`ira-p5-golpe__zona${sel === id ? ' is-sel' : ''}`} onClick={(ev) => elegir(id, ev)}>{forma}</g>
  );

  return (
    <div className={`ira-p5-golpe ira-p2--${o.tono}`}>
      <div className="ira-pz-banda ira-p5-golpe__banda">
        <svg viewBox="0 0 460 190" className={`ira-p5-golpe__svg is-${sel}`} role="img" aria-label={`${o.nombre}: ${o.titulo}. ${o.codigo}`}>
          {/* quien habla */}
          {zona('persona', (
            <>
              <circle cx="58" cy="96" r="28" className="ira-p5-golpe__persona" />
              <circle cx="58" cy="88" r="7.5" className="ira-p5-golpe__trazo" />
              <path d="M44 112 Q44 98 58 98 Q72 98 72 112" className="ira-p5-golpe__trazo" />
              <text x="58" y="150" className="ira-p5-golpe__rotulo ira-p5-golpe__rotulo--persona">{t.rotulos.persona}</text>
            </>
          ))}
          {/* por qué lo dice: lo que une a la persona con lo dicho */}
          {zona('motivo', (
            <>
              <rect x="92" y="78" width="128" height="36" className="ira-p5-golpe__area" />
              <path d="M92 96 H214 m-9 -6 l9 6 -9 6" className="ira-p5-golpe__motivo" />
              <text x="156" y="76" className="ira-p5-golpe__rotulo ira-p5-golpe__rotulo--motivo">{t.rotulos.motivo}</text>
            </>
          ))}
          {/* lo dicho: el contorno es el sentido; las líneas de dentro, el contenido */}
          {zona('sentido', (
            <>
              <rect x="228" y="44" width="216" height="104" rx="26" className="ira-p5-golpe__bocadillo" />
              <text x="336" y="32" className="ira-p5-golpe__rotulo ira-p5-golpe__rotulo--sentido">{t.rotulos.sentido}</text>
            </>
          ))}
          {zona('contenido', (
            <>
              <rect x="256" y="66" width="160" height="60" className="ira-p5-golpe__area" />
              <g className="ira-p5-golpe__lineas">
                <line x1="262" y1="80" x2="410" y2="80" />
                <line x1="262" y1="96" x2="410" y2="96" />
                <line x1="262" y1="112" x2="364" y2="112" />
              </g>
              <path d="M262 80 q9 -9 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 M262 96 q7 8 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 M262 112 q10 -8 20 0 t20 0 t20 0 t20 0" className="ira-p5-golpe__garabato" />
              <line x1="254" y1="124" x2="418" y2="68" className="ira-p5-golpe__niega" />
              <text x="336" y="172" className="ira-p5-golpe__rotulo ira-p5-golpe__rotulo--contenido">{t.rotulos.contenido}</text>
            </>
          ))}
          <g className="ira-p5-golpe__sale" aria-hidden="true">
            <path d="M58 60 V34 m-6 7 l6 -7 6 7" />
            <text x="58" y="24" className="ira-cifra">P3</text>
          </g>
          {/* el golpe: un destello cae donde cae la respuesta */}
          <g key={golpe} className="ira-p5-golpe__impacto" transform={`translate(${dx} ${dy})`} aria-hidden="true">
            <circle r="16" className="ira-p5-golpe__onda" />
            <path d={PUNTA} className="ira-p5-golpe__estrella" />
          </g>
        </svg>

        <div role="radiogroup" aria-label={t.etiqueta} className="ira-p5-golpe__opciones">
          {t.opciones.map((x) => (
            <button
              key={x.id}
              ref={(el) => { refs.current[x.id] = el; }}
              type="button"
              role="radio"
              aria-checked={x.id === sel}
              tabIndex={x.id === sel ? 0 : -1}
              onClick={(ev) => elegir(x.id, ev)}
              onKeyDown={(ev) => onKey(ev, x.id)}
              className={`ira-p5-golpe__opcion ira-p2--${x.tono}${x.id === sel ? ' is-sel' : ''}`}
            >
              <span className="ira-p5-golpe__opcion-nombre">{x.nombre}</span>
              <span className="ira-p2-codigo ira-cifra">{x.codigo}</span>
            </button>
          ))}
        </div>

        <div className="ira-p2-veredicto ira-p5-golpe__veredicto" aria-live="polite" key={sel}>
          <p className="ira-p5-golpe__titulo">{o.titulo}</p>
          <p className="ira-p5-golpe__ejemplos">{o.ejemplos}</p>
          <p className="ira-p2-veredicto__resultado"><span className="ira-p2-pildora">{o.codigo} · {o.resultado}</span></p>
          <p className="ira-p2-veredicto__porque">{o.nota}</p>
        </div>
      </div>
    </div>
  );
}

// ── La fórmula, para probarla ─────────────────────────────────────────────────

const TOPE = 20;
const calcular = (V, B, Z) => (10 * (V + 0.5 * B + 1)) / (V + B + Z + 2);

function Contador({ codigo, nombre, valor, cambiar, t }) {
  return (
    <div className={`ira-p5-contador ira-p2--${TONO[codigo]}`}>
      <span className="ira-p5-contador__k ira-cifra" aria-hidden="true">{codigo}</span>
      <span className="ira-p5-contador__nombre">{nombre}</span>
      <button type="button" className="ira-p5-contador__boton" onClick={(ev) => { chispazo(ev, TONO[codigo], 5); cambiar(valor - 1); }} disabled={valor <= 0} aria-label={t.menos(nombre)}>−</button>
      <output className="ira-p5-contador__n ira-cifra" aria-label={`${nombre}: ${valor}`}>{valor}</output>
      <button type="button" className="ira-p5-contador__boton" onClick={(ev) => { chispazo(ev, TONO[codigo], 5); cambiar(valor + 1); }} disabled={valor >= TOPE} aria-label={t.mas(nombre)}>+</button>
    </div>
  );
}

export function BalanzaP5({ t, presets, idioma }) {
  const inicial = presets[1];
  const [n, setN] = useState({ Z: inicial.Z, B: inicial.B, V: inicial.V });
  const total = n.Z + n.B + n.V;
  const nota = calcular(n.V, n.B, n.Z);
  const puntua = total >= 5;
  const fmt = (v, d = 2) => (idioma === 'en' ? v.toFixed(d) : v.toFixed(d).replace('.', ','));
  const medio = idioma === 'en' ? '0.5' : '0,5';
  const pon = (k) => (v) => setN((a) => ({ ...a, [k]: Math.max(0, Math.min(TOPE, v)) }));
  const presetActivo = presets.findIndex((p) => p.Z === n.Z && p.B === n.B && p.V === n.V);
  const fichas = [...Array(n.Z).fill('Z'), ...Array(n.B).fill('B'), ...Array(n.V).fill('V')];
  const solidez = total >= 10 ? t.solidez.solida : t.solidez.orientativa;
  const color = puntua ? colorCifra(nota) : undefined;
  const diluye = puntua && n.B > 0 && n.Z > 0;

  return (
    <div className="ira-pz-banda ira-p5-balanza">
      <div className="ira-p5-balanza__cab">
        <p className="ira-p5-balanza__titulo">{t.titulo}</p>
        <p className="ira-p5-balanza__intro">{t.intro}</p>
      </div>

      <div className="ira-p5-balanza__presets" role="group" aria-label={t.presets}>
        <span className="ira-p5-balanza__presets-rotulo">{t.presets}</span>
        {presets.map((p, i) => (
          <button key={p.nombre} type="button" aria-pressed={i === presetActivo} className={`ira-p5-preset${i === presetActivo ? ' is-on' : ''}`} onClick={(ev) => { chispazo(ev, 'oro', 6); setN({ Z: p.Z, B: p.B, V: p.V }); }}>
            {p.nombre}
          </button>
        ))}
      </div>

      <div className="ira-p5-balanza__rejilla">
        <div className="ira-p5-balanza__contadores">
          {['Z', 'B', 'V'].map((k) => <Contador key={k} codigo={k} nombre={t.nombres[k]} valor={n[k]} cambiar={pon(k)} t={t} />)}
          <ul className="ira-p5-fichas" aria-hidden="true">
            {fichas.map((k, i) => <li key={`${k}${i}`} className={`ira-p5-ficha ira-p2--${TONO[k]}`} />)}
          </ul>
          <p className="ira-p5-balanza__total">{t.eventos(total)}{puntua && <> · <strong>{solidez}</strong></>}</p>
        </div>

        <div className={`ira-p5-balanza__resultado${puntua ? '' : ' is-sin'}`} aria-live="polite">
          <p className="ira-p5-balanza__rotulo">{t.nota}</p>
          {puntua
            ? <NumeroAnimado valor={nota} formato={(v) => fmt(v)} className="ira-p5-balanza__nota ira-cifra" style={{ color }} duracion={450} />
            : <span className="ira-p5-balanza__nota ira-p5-balanza__nota--sin">{t.sinPuntuar}</span>}
          <p className="ira-p5-balanza__aviso">{puntua ? null : (total === 0 ? t.vacio : t.faltan(5 - total))}</p>

          <div className="ira-p5-regla" aria-hidden="true">
            <div className="ira-p5-regla__pista">
              {ESCALA.map((c, i) => <span key={c} style={{ background: c }} className={i === 5 ? 'is-centro' : ''} />)}
            </div>
            {puntua && <span className="ira-p5-regla__aguja" style={{ left: `${nota * 10}%`, '--aguja': color }} />}
            <span className="ira-p5-regla__centro">5 · {t.centro}</span>
            <span className="ira-p5-regla__polo">0 · {t.polos[0]}</span>
            <span className="ira-p5-regla__polo ira-p5-regla__polo--fin">10 · {t.polos[1]}</span>
          </div>

          <p className="ira-p5-balanza__cuenta ira-cifra">
            10 × (<b className="ira-p2--empatica">{n.V}</b> + {medio}·<b className="ira-p2--neutra">{n.B}</b> + 1) / (<b className="ira-p2--empatica">{n.V}</b> + <b className="ira-p2--neutra">{n.B}</b> + <b className="ira-p2--polariza">{n.Z}</b> + 2) = {fmt(nota)}
          </p>
          {diluye && <p className="ira-p5-balanza__dilucion">{t.dilucion(fmt(calcular(n.V, 0, n.Z)))}</p>}
        </div>
      </div>
    </div>
  );
}
