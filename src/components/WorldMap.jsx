// IRA · mapa mundial interactivo
// Geometría local (src/data/mapaMundo.js, se carga bajo demanda). Cada país con discursos analizados
// late con el color de su puntuación (promedio de sus figuras). Pasar el cursor abre un resumen con
// enlace "Ver país"; hacer clic fija el país, acerca el mapa y muestra su resumen y sus botones.
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext, mergeSpeech } from '../App.jsx';
import { colorPuntuacion, colorCifra, formatearPuntuacion } from '../lib/escala';
import { fechaCorta } from '../lib/discursos';
import {
  PAISES, POLITICOS, PENDIENTES, nombrePais, urlBandera, etiquetaNivel, agruparPorPais, puntuacionFigura, discursosDelPais,
} from '../lib/paises';
import EtiquetaPuntuacion from './ui/EtiquetaPuntuacion.jsx';
import BarraEscala from './ui/BarraEscala.jsx';
import IndicadorEscala from './ui/IndicadorEscala.jsx';

const SIN_DATOS = '#4A5C5C';

const TXT = {
  es: {
    titulo: 'Distribución geográfica',
    sub: 'Cada país con discursos analizados late con el color de su puntuación. Pasa el cursor para ver su resumen y haz clic para acercarlo.',
    alt: 'Mapa mundial con los países que tienen discursos analizados, coloreados por su puntuación IRA',
    lideres: 'Líderes políticos analizados:', ultimo: 'Último análisis:', verPais: 'Ver país',
    todo: 'Ver todo el mundo', sinDiscursos: 'Sin discursos analizados', elige: 'Elige un país',
    eligeTexto: 'Haz clic en un país con ondas para fijarlo: aquí verás su resumen y los botones para entrar a la página del país y a los discursos de cada figura. El ritmo de las ondas refleja la puntuación: rápido y nervioso cuando el lenguaje polariza, lento y amplio cuando es empático.',
    paises: 'Países con análisis', sinAnalisis: 'Sin análisis aún',
    figuras: (n) => `${n} ${n === 1 ? 'figura analizada' : 'figuras analizadas'}`,
    discursos: (n) => `${n} ${n === 1 ? 'discurso' : 'discursos'}`,
    detalle: 'Detalle del país', de: 'de 10',
  },
  en: {
    titulo: 'Geographic distribution',
    sub: 'Each country with analyzed speeches pulses with the color of its score. Hover to see its summary and click to zoom in.',
    alt: 'World map of the countries with analyzed speeches, colored by their IRA score',
    lideres: 'Political leaders analyzed:', ultimo: 'Latest analysis:', verPais: 'See country',
    todo: 'Show the whole world', sinDiscursos: 'No analyzed speeches', elige: 'Choose a country',
    eligeTexto: 'Click a country with ripples to pin it: you will see its summary and buttons to the country page and to the speeches of each figure. The pulse rate reflects the score: fast and jittery when the language polarizes, slow and wide when it is empathic.',
    paises: 'Countries analyzed', sinAnalisis: 'Not analyzed yet',
    figuras: (n) => `${n} ${n === 1 ? 'figure analyzed' : 'figures analyzed'}`,
    discursos: (n) => `${n} ${n === 1 ? 'speech' : 'speeches'}`,
    detalle: 'Country detail', de: 'out of 10',
  },
};

function Flecha() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="ira-mapa__flecha">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function WorldMap({ entities, lang = 'es' }) {
  const t = TXT[lang] ?? TXT.es;
  const { supabaseMap } = useContext(AppContext);
  const [geo, setGeo] = useState(null);
  const [sel, setSel] = useState(null);
  const [hov, setHov] = useState(null);
  const temporizador = useRef(null);

  useEffect(() => {
    let vivo = true;
    import('../data/mapaMundo.js').then((m) => { if (vivo) setGeo(m); }).catch(() => {});
    return () => { vivo = false; clearTimeout(temporizador.current); };
  }, []);

  const paises = useMemo(() => agruparPorPais(entities, puntuacionFigura).map((p) => {
    const discursos = discursosDelPais(p.figuras, supabaseMap, mergeSpeech);
    return { ...p, discursos, ultimo: discursos[0] ?? null };
  }), [entities, supabaseMap]);

  if (paises.length === 0) return null;

  const porSlug = Object.fromEntries(paises.map((p) => [p.slug, p]));
  const activos = new Set(paises.map((p) => PAISES[p.nombre].atlas));
  const seleccion = sel ? porSlug[sel] : null;
  const enfoque = hov ? porSlug[hov] : null;

  const entrar = (slug) => { clearTimeout(temporizador.current); setHov(slug); };
  const salir = () => { clearTimeout(temporizador.current); temporizador.current = setTimeout(() => setHov(null), 260); };
  const alternar = (slug) => setSel((s) => (s === slug ? null : slug));
  const alTeclado = (e, slug) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(slug); } };

  // Zoom hacia el país fijado (mismo cálculo que el prototipo del diseño)
  let k = 1, tx = 0, ty = 0;
  if (geo && seleccion) {
    const bb = geo.PAISES_GEO[PAISES[seleccion.nombre].atlas].bb;
    const bw = Math.max(bb[2] - bb[0], 8), bh = Math.max(bb[3] - bb[1], 8);
    k = Math.min((geo.MAPA_W * 0.55) / bw, (geo.MAPA_H * 0.62) / bh, 7);
    tx = geo.MAPA_W / 2 - (k * (bb[0] + bb[2])) / 2;
    ty = geo.MAPA_H / 2 - (k * (bb[1] + bb[3])) / 2;
  }

  // Posición del resumen flotante, en % del lienzo
  let tip = null;
  if (geo && enfoque) {
    const [cx, cy] = geo.PAISES_GEO[PAISES[enfoque.nombre].atlas].c;
    const x = ((tx + k * cx) / geo.MAPA_W) * 100;
    const y = ((ty + k * cy) / geo.MAPA_H) * 100;
    tip = { x, y, izquierda: x > 56 };
  }

  const pulso = (p) => (1.5 + (p ?? 5) * 0.32).toFixed(2);

  return (
    <section className="ira-panel ira-mapa" aria-labelledby="ira-mapa-titulo" style={{ marginTop: 28 }}>
      <div style={{ marginBottom: 18 }}>
        <h3 id="ira-mapa-titulo" className="ira-seccion__titulo" style={{ marginBottom: 6 }}>{t.titulo}</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--ira-texto-2)', maxWidth: 640 }}>{t.sub}</p>
      </div>

      <div className="ira-mapa__cuerpo">
        <div className="ira-mapa__marco">
          <div className="ira-mapa__lienzo">
            <div className="ira-mapa__barrido" aria-hidden="true" />
            {geo ? (
              <svg viewBox={`0 0 ${geo.MAPA_W} ${geo.MAPA_H}`} role="img" aria-label={t.alt} className="ira-mapa__svg">
                <g className="ira-mapa__grupo" style={{ transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${k.toFixed(3)})` }}>
                  <path d={geo.ESFERA} fill="rgba(4,20,20,0.35)" stroke="#1B3636" vectorEffect="non-scaling-stroke" />
                  <path d={geo.GRATICULA} fill="none" stroke="#143030" strokeWidth="0.6" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
                  {Object.entries(geo.PAISES_GEO).filter(([n]) => !activos.has(n)).map(([n, g]) => (
                    <path key={n} d={g.d} fill="#0E2323" stroke="#1F4141" strokeWidth="0.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  ))}
                  {paises.map((p) => {
                    const g = geo.PAISES_GEO[PAISES[p.nombre].atlas];
                    const color = p.puntuacion == null ? SIN_DATOS : colorPuntuacion(p.puntuacion);
                    const fijado = sel === p.slug;
                    const activo = hov === p.slug || fijado;
                    const atenuado = sel && !fijado && hov !== p.slug;
                    return (
                      <g key={p.slug}>
                        <path
                          d={g.d} fill={color} stroke={activo ? '#FCFDFF' : color} strokeWidth={fijado ? 1.6 : activo ? 1.3 : 0.7}
                          strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                          className="ira-mapa__pais" tabIndex={0} role="button" aria-pressed={fijado}
                          aria-label={`${nombrePais(p, lang)}, ${formatearPuntuacion(p.puntuacion, lang)} ${t.de}`}
                          style={{ opacity: atenuado ? 0.5 : 0.92, filter: `drop-shadow(0 0 ${activo ? 14 : 7}px ${color})` }}
                          onClick={() => alternar(p.slug)} onKeyDown={(e) => alTeclado(e, p.slug)}
                          onMouseEnter={() => entrar(p.slug)} onMouseLeave={salir} onFocus={() => entrar(p.slug)} onBlur={salir}
                        />
                      </g>
                    );
                  })}
                  {paises.map((p) => {
                    const g = geo.PAISES_GEO[PAISES[p.nombre].atlas];
                    const color = p.puntuacion == null ? SIN_DATOS : colorPuntuacion(p.puntuacion);
                    const dur = `${pulso(p.puntuacion)}s`;
                    return (
                      <g key={p.slug} transform={`translate(${g.c[0]} ${g.c[1]}) scale(${(1 / Math.pow(k, 0.7)).toFixed(3)})`}>
                        <circle r="3" fill="none" stroke={color} vectorEffect="non-scaling-stroke" className="ira-mapa__onda" style={{ animationDuration: dur }} />
                        <circle r="3" fill="none" stroke={color} vectorEffect="non-scaling-stroke" className="ira-mapa__onda" style={{ animationDuration: dur, animationDelay: `${(pulso(p.puntuacion) / 2).toFixed(2)}s` }} />
                        <circle r="2.6" fill={color} style={{ pointerEvents: 'none' }} />
                        <circle r="1" fill="#FCFDFF" style={{ pointerEvents: 'none' }} />
                        <circle r={9 / k} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => alternar(p.slug)} onMouseEnter={() => entrar(p.slug)} onMouseLeave={salir} />
                      </g>
                    );
                  })}
                </g>
              </svg>
            ) : (
              <p className="ira-mapa__cargando" role="status">…</p>
            )}

            {sel && (
              <button type="button" className="ira-mapa__reset ira-boton ira-boton--secundario ira-boton--compacto" onClick={() => setSel(null)}>{t.todo}</button>
            )}
            <span className="ira-mapa__nota"><span className="ira-mapa__muestra" aria-hidden="true" />{t.sinDiscursos}</span>
          </div>

          {tip && enfoque && (
            <div
              className="ira-mapa__tip" role="group" aria-label={nombrePais(enfoque, lang)}
              style={{
                left: `${tip.x}%`, top: `clamp(8px, calc(${tip.y}% - 110px), calc(100% - 350px))`,
                transform: `translateX(${tip.izquierda ? 'calc(-100% - 24px)' : '24px'})`,
              }}
              onMouseEnter={() => entrar(enfoque.slug)} onMouseLeave={salir}
            >
              <div className="ira-mapa__tip-cab">
                <img src={urlBandera(enfoque.iso)} alt="" width="52" height="39" className="ira-mapa__tip-bandera" />
                <div>
                  <p className="ira-mapa__tip-pais">{nombrePais(enfoque, lang)}</p>
                  <p className="ira-mapa__tip-nivel"><EtiquetaPuntuacion puntuacion={enfoque.puntuacion} lang={lang} />{etiquetaNivel(enfoque.puntuacion, lang)}</p>
                </div>
              </div>
              <div>
                <p className="ira-mapa__tip-rotulo">{t.lideres}</p>
                <ul className="ira-mapa__tip-lista">
                  {enfoque.figuras.map((f) => (
                    <li key={f.id}><span>{f.name}</span><EtiquetaPuntuacion puntuacion={f.puntuacion} variante="punto" lang={lang} /></li>
                  ))}
                </ul>
              </div>
              {enfoque.ultimo && (
                <div className="ira-mapa__tip-ultimo">
                  <p className="ira-mapa__tip-rotulo">{t.ultimo}</p>
                  <p className="ira-mapa__tip-titulo">{(lang === 'en' && enfoque.ultimo.titleEn) || enfoque.ultimo.title}</p>
                  <p className="ira-mapa__tip-meta">{enfoque.ultimo.entityName} · {fechaCorta(enfoque.ultimo.date)} · <EtiquetaPuntuacion puntuacion={enfoque.ultimo.iraScore} variante="punto" lang={lang} /></p>
                </div>
              )}
              <Link to={`/pais/${enfoque.slug}`} className="ira-mapa__tip-enlace">{t.verPais}<Flecha /></Link>
            </div>
          )}
        </div>

        <aside className={`ira-mapa__panel${seleccion ? '' : ' ira-mapa__panel--vacio'}`} aria-label={t.detalle} aria-live="polite">
          {seleccion ? (
            <>
              <div className="ira-mapa__panel-col">
              <div className="ira-mapa__panel-cab">
                <img src={urlBandera(seleccion.iso)} alt="" width="64" height="48" className="ira-mapa__panel-bandera" />
                <h4 className="ira-mapa__panel-pais">{nombrePais(seleccion, lang)}</h4>
              </div>
              <div>
                <p className="ira-mapa__panel-cifra">
                  <span style={{ color: seleccion.puntuacion == null ? 'var(--ira-texto-3)' : colorCifra(seleccion.puntuacion) }}>{formatearPuntuacion(seleccion.puntuacion, lang)}</span>
                  <span className="ira-mapa__panel-max">/10</span>
                  <EtiquetaPuntuacion puntuacion={seleccion.puntuacion} lang={lang} />
                  <span className="ira-mapa__panel-nivel">{etiquetaNivel(seleccion.puntuacion, lang)}</span>
                </p>
                <div style={{ marginTop: 12 }}><BarraEscala puntuacion={seleccion.puntuacion} grosor={7} /></div>
              </div>
              </div>
              <p className="ira-mapa__panel-texto">
                {t.figuras(seleccion.figuras.length)} · {t.discursos(seleccion.discursos.length)}.
                {seleccion.ultimo && <> {t.ultimo} «{(lang === 'en' && seleccion.ultimo.titleEn) || seleccion.ultimo.title}» ({fechaCorta(seleccion.ultimo.date)}).</>}
              </p>
              <div className="ira-mapa__botones">
                <Link to={`/pais/${seleccion.slug}`} className="ira-boton ira-boton--principal ira-mapa__boton-todos">{t.verPais}<Flecha /></Link>
                {seleccion.figuras.map((f) => (
                  <Link key={f.id} to={`/politicos?figura=${f.id}`} className="ira-boton ira-boton--secundario ira-mapa__boton-persona">
                    <span className="ira-mapa__persona"><span>{f.name}</span>{POLITICOS[f.id] && <small>{POLITICOS[f.id].rol[lang] ?? POLITICOS[f.id].rol.es}</small>}</span>
                    <EtiquetaPuntuacion puntuacion={f.puntuacion} variante="punto" lang={lang} />
                  </Link>
                ))}
                {(PENDIENTES[seleccion.nombre] ?? []).map((f) => (
                  <div key={f.id} className="ira-mapa__boton-persona ira-mapa__boton-persona--pendiente">
                    <span className="ira-mapa__persona"><span>{f.name}</span><small>{f.rol[lang] ?? f.rol.es}</small></span>
                    <span>{t.sinAnalisis}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="ira-mapa__panel-pais" style={{ fontSize: 28 }}>{t.elige}</h4>
                <p className="ira-mapa__panel-texto" style={{ marginTop: 14 }}>{t.eligeTexto}</p>
              </div>
              <div className="ira-mapa__total">
                <span className="ira-mapa__total-rotulo">{t.paises}</span>
                <span className="ira-mapa__total-cifra">{paises.length}</span>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="ira-mapa__chips">
        {paises.map((p) => (
          <button key={p.slug} type="button" className="ira-chip ira-mapa__chip" aria-pressed={sel === p.slug}
            onClick={() => alternar(p.slug)} onMouseEnter={() => entrar(p.slug)} onMouseLeave={salir}>
            <img src={urlBandera(p.iso)} alt="" width="22" height="16" />
            {nombrePais(p, lang)}
            <EtiquetaPuntuacion puntuacion={p.puntuacion} variante="punto" lang={lang} />
          </button>
        ))}
      </div>

      <div style={{ marginTop: 18, maxWidth: 420 }}>
        <IndicadorEscala compacto lang={lang} />
      </div>
    </section>
  );
}
