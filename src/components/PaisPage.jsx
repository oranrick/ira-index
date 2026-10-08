// IRA · /pais/:slug — página de un país: bandera y nombre grandes, último discurso analizado,
// políticos analizados (con cargo y mini resumen) y todos sus discursos.
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';

import { AppContext, mergeSpeech } from '../App.jsx';
import { Superposicion } from './DiscursosPage.jsx';
import BarraEscala from './ui/BarraEscala.jsx';
import EtiquetaPuntuacion from './ui/EtiquetaPuntuacion.jsx';
import { colorPuntuacion, colorCifra, formatearPuntuacion } from '../lib/escala';
import { citaDestacada, fechaCorta } from '../lib/discursos';
import {
  PAISES, POLITICOS, PENDIENTES, nombrePais, urlBandera, etiquetaNivel, agruparPorPais, puntuacionFigura, discursosDelPais,
} from '../lib/paises';

const TXT = {
  es: {
    volver: '← Volver al mapa', rotulo: 'País', ultimo: 'Último discurso analizado', personas: 'Políticos analizados',
    todos: 'Todos los discursos de', otros: 'Otros países', ver: 'Ver análisis completo', verPol: 'Ver discursos',
    sinAnalisis: 'Aún sin discursos analizados', de: 'de 10', pol: '0 Polarizante', emp: 'Empático 10',
    figuras: (n) => `${n} ${n === 1 ? 'figura analizada' : 'figuras analizadas'}`,
    discursos: (n) => `${n} ${n === 1 ? 'discurso' : 'discursos'}`,
    bandera: (p) => `Bandera de ${p}`, abrir: 'Abrir análisis',
  },
  en: {
    volver: '← Back to the map', rotulo: 'Country', ultimo: 'Latest analyzed speech', personas: 'Politicians analyzed',
    todos: 'All speeches from', otros: 'Other countries', ver: 'See full analysis', verPol: 'See speeches',
    sinAnalisis: 'No analyzed speeches yet', de: 'out of 10', pol: '0 Polarizing', emp: 'Empathic 10',
    figuras: (n) => `${n} ${n === 1 ? 'figure analyzed' : 'figures analyzed'}`,
    discursos: (n) => `${n} ${n === 1 ? 'speech' : 'speeches'}`,
    bandera: (p) => `Flag of ${p}`, abrir: 'Open analysis',
  },
};

function Silueta({ atlas, color }) {
  const [geo, setGeo] = useState(null);
  useEffect(() => {
    let vivo = true;
    import('../data/mapaMundo.js').then((m) => { if (vivo) setGeo(m); }).catch(() => {});
    return () => { vivo = false; };
  }, []);
  const g = geo?.PAISES_GEO[atlas];
  if (!g) return null;
  const p = 6, [x0, y0, x1, y1] = g.bb;
  return (
    <svg viewBox={`${x0 - p} ${y0 - p} ${x1 - x0 + 2 * p} ${y1 - y0 + 2 * p}`} aria-hidden="true" className="ira-pais__silueta">
      <path d={g.d} fill={color} fillOpacity="0.9" stroke={color} vectorEffect="non-scaling-stroke" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
      <g transform={`translate(${g.c[0]} ${g.c[1]})`}>
        <circle r="3" fill="none" stroke={color} vectorEffect="non-scaling-stroke" className="ira-mapa__onda" />
        <circle r="3" fill="none" stroke={color} vectorEffect="non-scaling-stroke" className="ira-mapa__onda" style={{ animationDelay: '1.5s' }} />
        <circle r="2.2" fill="#FCFDFF" />
      </g>
    </svg>
  );
}

export default function PaisPage() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const { lang, supabaseMap, enrichedEntities } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const [activo, setActivo] = useState(null);

  const paises = useMemo(() => agruparPorPais(enrichedEntities, puntuacionFigura), [enrichedEntities]);
  const pais = paises.find((p) => p.slug === slug) ?? null;
  const discursos = useMemo(
    () => (pais ? discursosDelPais(pais.figuras, supabaseMap, mergeSpeech) : []),
    [pais, supabaseMap],
  );

  useEffect(() => {
    if (hash === '#discursos') document.getElementById('discursos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
  }, [slug, hash]);

  if (!pais) return <Navigate to="/politicos" replace />;

  const color = pais.puntuacion == null ? '#4A5C5C' : colorPuntuacion(pais.puntuacion);
  const ultimo = discursos[0] ?? null;
  const rol = (id) => POLITICOS[id]?.rol[lang] ?? POLITICOS[id]?.rol.es;
  const resumen = (id) => POLITICOS[id]?.resumen[lang] ?? POLITICOS[id]?.resumen.es;
  const nDe = (id) => discursos.filter((s) => s.entityId === id).length;
  const titulo = (s) => (lang === 'en' && s.titleEn) || s.title;

  return (
    <div className="main-container ira-pais" style={{ maxWidth: 1180 }}>
      <Link to="/politicos" className="ira-pais__volver">{t.volver}</Link>

      <header className="ira-pais__cabecera">
        <img src={urlBandera(pais.iso)} alt={t.bandera(nombrePais(pais, lang))} width="440" height="330" className="ira-pais__bandera" style={{ boxShadow: `0 0 80px ${color}47, 0 28px 60px rgba(0,0,0,0.5)` }} />
        <div className="ira-pais__titulos">
          <p className="ira-pais__rotulo">{t.rotulo}</p>
          <h1 className="ira-pais__nombre">{nombrePais(pais, lang)}</h1>
          <div className="ira-pais__datos">
            <p className="ira-pais__cifra">
              <span style={{ color: pais.puntuacion == null ? 'var(--ira-texto-3)' : color }}>{formatearPuntuacion(pais.puntuacion, lang)}</span>
              <span className="ira-pais__max">/10<span className="ira-sr"> {t.de}</span></span>
            </p>
            <EtiquetaPuntuacion puntuacion={pais.puntuacion} lang={lang} />
            <span className="ira-pais__nivel">{etiquetaNivel(pais.puntuacion, lang)}</span>
            <span className="ira-pais__conteo">{t.figuras(pais.figuras.length)} · {t.discursos(discursos.length)}</span>
          </div>
          <div style={{ maxWidth: 520 }}><BarraEscala puntuacion={pais.puntuacion} grosor={8} /></div>
        </div>
        <Silueta atlas={PAISES[pais.nombre].atlas} color={color} />
      </header>

      {ultimo && (
        <section className="ira-pais__seccion" aria-labelledby="ira-pais-ultimo">
          <h2 id="ira-pais-ultimo" className="ira-pais__h2">{t.ultimo}</h2>
          <article className="ira-pais__ultimo">
            <div className="ira-pais__ultimo-texto">
              <p className="ira-pais__orador"><strong>{ultimo.entityName}</strong>{rol(ultimo.entityId) && <span>{rol(ultimo.entityId)}</span>}<time>{fechaCorta(ultimo.date)}</time></p>
              <h3 className="ira-pais__ultimo-titulo">{titulo(ultimo)}</h3>
              <blockquote className="ira-pais__cita">«{citaDestacada(ultimo, lang, 260)}»</blockquote>
              <div><button type="button" className="ira-boton ira-boton--principal" onClick={() => setActivo(ultimo)}>{t.ver}</button></div>
            </div>
            <div className="ira-pais__ultimo-cifra">
              <p className="ira-pais__cifra ira-pais__cifra--grande">
                <span style={{ color: colorCifra(ultimo.iraScore) }}>{formatearPuntuacion(ultimo.iraScore, lang)}</span>
                <span className="ira-pais__max">/10<span className="ira-sr"> {t.de}</span></span>
              </p>
              <BarraEscala puntuacion={ultimo.iraScore} grosor={8} />
              <div className="ira-tarjeta__extremos" aria-hidden="true"><span>{t.pol}</span><span>{t.emp}</span></div>
            </div>
          </article>
        </section>
      )}

      <section className="ira-pais__seccion" aria-labelledby="ira-pais-personas">
        <h2 id="ira-pais-personas" className="ira-pais__h2">{t.personas}</h2>
        <ul className="ira-pais__personas">
          {pais.figuras.map((f) => (
            <li key={f.id}>
              <Link to={`/entity/${f.id}`} className="ira-pais__persona">
                {f.photo ? <img src={f.photo} alt="" className="ira-pais__foto" /> : <span className="ira-pais__foto ira-pais__foto--inicial" aria-hidden="true">{f.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>}
                <div className="ira-pais__persona-texto">
                  <p className="ira-pais__persona-nombre">{f.name}{rol(f.id) && <span className="ira-pais__rol">{rol(f.id)}</span>}</p>
                  {resumen(f.id) && <p className="ira-pais__persona-resumen">{resumen(f.id)}</p>}
                  <p className="ira-pais__persona-meta">{t.discursos(nDe(f.id))} · {t.verPol} →</p>
                </div>
                <p className="ira-pais__cifra ira-pais__cifra--media">
                  <span style={{ color: colorCifra(f.puntuacion) }}>{formatearPuntuacion(f.puntuacion, lang)}</span><span className="ira-pais__max">/10</span>
                </p>
              </Link>
            </li>
          ))}
          {(PENDIENTES[pais.nombre] ?? []).map((f) => (
            <li key={f.id}>
              <div className="ira-pais__persona ira-pais__persona--pendiente">
                <span className="ira-pais__foto ira-pais__foto--inicial" aria-hidden="true">{f.name.split(' ').filter((w) => w[0] === w[0].toUpperCase()).map((w) => w[0]).slice(0, 2).join('')}</span>
                <div className="ira-pais__persona-texto">
                  <p className="ira-pais__persona-nombre">{f.name}<span className="ira-pais__rol">{f.rol[lang] ?? f.rol.es}</span></p>
                  <p className="ira-pais__persona-resumen">{f.resumen[lang] ?? f.resumen.es}</p>
                  <p className="ira-pais__persona-meta">{t.sinAnalisis}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="discursos" className="ira-pais__seccion" aria-labelledby="ira-pais-todos">
        <h2 id="ira-pais-todos" className="ira-pais__h2">{t.todos} {nombrePais(pais, lang)}</h2>
        <ul className="ira-pais__lista">
          {discursos.map((s) => (
            <li key={s.id}>
              <button type="button" className="ira-pais__fila" onClick={() => setActivo(s)}>
                <time className="ira-pais__fila-fecha">{fechaCorta(s.date)}</time>
                <span className="ira-pais__fila-titulo">{titulo(s)}</span>
                <span className="ira-pais__fila-orador">{s.entityName}</span>
                <EtiquetaPuntuacion puntuacion={s.iraScore} variante="punto" lang={lang} />
                <span className="ira-sr">{t.abrir}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="ira-pais__seccion" aria-labelledby="ira-pais-otros">
        <h2 id="ira-pais-otros" className="ira-pais__h3">{t.otros}</h2>
        <div className="ira-mapa__chips" style={{ marginTop: 0 }}>
          {paises.filter((p) => p.slug !== slug).map((p) => (
            <Link key={p.slug} to={`/pais/${p.slug}`} className="ira-chip ira-mapa__chip">
              <img src={urlBandera(p.iso)} alt="" width="22" height="16" />{nombrePais(p, lang)}
              <EtiquetaPuntuacion puntuacion={p.puntuacion} variante="punto" lang={lang} />
            </Link>
          ))}
        </div>
      </section>

      {activo && <Superposicion speech={activo} lang={lang} onCerrar={() => setActivo(null)} />}
    </div>
  );
}
