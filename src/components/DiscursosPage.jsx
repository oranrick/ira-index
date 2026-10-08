// IRA · /discursos — primero los políticos (con foto); al elegir uno, sus discursos analizados
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext, mergeSpeech, rowToSpeech } from '../App.jsx';
import { supabase } from '../supabaseClient';
import { politicalSpeeches as speeches } from '../data/speeches';
import TarjetaDiscurso from './ui/TarjetaDiscurso.jsx';
import { SpeechView } from './SpeechView.jsx';
import { useAtraparFoco } from './ui/Ventana.jsx';
import BarraEscala from './ui/BarraEscala.jsx';
import { fechaCorta, fechaOrden, citaDestacada } from '../lib/discursos';
import { colorCifra, formatearPuntuacion } from '../lib/escala';

const TXT = {
  es: {
    titulo: 'Discursos',
    intro: 'Discursos políticos analizados con la metodología IRA. Elige un político para ver sus discursos: cada tarjeta muestra un fragmento destacado y la puntuación global, de 0 (polarizante) a 10 (empático).',
    volver: '← Todos los políticos', ver: (n) => `Ver ${n} ${n === 1 ? 'discurso' : 'discursos'} →`, iraMedio: 'IRA medio',
    todas: 'Todas las figuras', ordenar: 'Ordenar', recientes: 'Más recientes', emp: 'Más empático', pol: 'Más polarizante',
    cargando: 'Cargando discursos…', vacio: 'No hay discursos para este filtro.', figura: 'Figura',
    palabras: 'palabras', diario: 'Análisis diario', corpus: 'Corpus del TFG', total: (n) => `${n} discursos`,
  },
  en: {
    titulo: 'Speeches',
    intro: 'Political speeches analyzed with the IRA methodology. Pick a politician to see their speeches: each card shows a highlighted fragment and the overall score, from 0 (polarizing) to 10 (empathic).',
    volver: '← All politicians', ver: (n) => `See ${n} ${n === 1 ? 'speech' : 'speeches'} →`, iraMedio: 'Average IRA',
    todas: 'All figures', ordenar: 'Sort', recientes: 'Most recent', emp: 'Most empathic', pol: 'Most polarizing',
    cargando: 'Loading speeches…', vacio: 'No speeches match this filter.', figura: 'Figure',
    palabras: 'words', diario: 'Daily analysis', corpus: 'Thesis corpus', total: (n) => `${n} speeches`,
  },
};

const COLUMNAS = 'id,entity_id,entity_name,title,published_date,source_url,ira,params,segments,summary,lectura_autor';

export function Superposicion({ speech, lang, onCerrar }) {
  const ref = useRef(null);
  useAtraparFoco(true, ref, onCerrar);
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={speech.title} tabIndex={-1}
      style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'var(--ira-noche)', overflowY: 'auto', outline: 'none' }}>
      <SpeechView speech={speech} onBack={onCerrar} lang={lang} />
    </div>
  );
}

export default function DiscursosPage() {
  const { lang, supabaseMap, enrichedEntities } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const [diarios, setDiarios] = useState(null);
  const [params, setParams] = useSearchParams();
  const figura = params.get('figura');
  const elegir = (id) => { setParams(id ? { figura: id } : {}); window.scrollTo(0, 0); };
  const [orden, setOrden] = useState('recientes');
  const [activo, setActivo] = useState(null);

  useEffect(() => {
    let vivo = true;
    supabase.from('daily_analyses').select(COLUMNAS).order('published_date', { ascending: false }).limit(120)
      .then(({ data }) => { if (vivo) setDiarios(Array.isArray(data) ? data.map(rowToSpeech) : []); })
      .catch(() => { if (vivo) setDiarios([]); });
    const espera = setTimeout(() => { if (vivo) setDiarios((d) => d ?? []); }, 6000);
    return () => { vivo = false; clearTimeout(espera); };
  }, []);

  // La transcripción de un discurso diario se pide solo al abrirlo
  useEffect(() => {
    if (!activo || !activo.id.startsWith('daily-') || activo.transcript) return;
    const id = activo.id.slice('daily-'.length);
    supabase.from('daily_analyses').select('text').eq('id', id).single()
      .then(({ data }) => { if (data?.text) setActivo((a) => (a && a.id === activo.id ? { ...a, transcript: data.text } : a)); })
      .catch(() => {});
  }, [activo]);

  const todos = useMemo(() => {
    const corpus = speeches.map((s) => ({ ...mergeSpeech(s, supabaseMap[s.id]), origen: 'corpus' }));
    return [...(diarios ?? []).map((s) => ({ ...s, origen: 'diario' })), ...corpus];
  }, [diarios, supabaseMap]);

  // Políticos con al menos un discurso, en el orden de la clasificación
  const figuras = useMemo(() => {
    const n = {};
    todos.forEach((s) => { n[s.entityId] = (n[s.entityId] ?? 0) + 1; });
    return enrichedEntities.filter((e) => e.category === 'Político' && n[e.id]).map((e) => ({ ...e, n: n[e.id] }));
  }, [todos, enrichedEntities]);
  const activa = figuras.find((e) => e.id === figura) ?? null;

  const lista = useMemo(() => {
    const l = todos.filter((s) => s.entityId === figura);
    if (orden === 'emp') return [...l].sort((a, b) => b.iraScore - a.iraScore);
    if (orden === 'pol') return [...l].sort((a, b) => a.iraScore - b.iraScore);
    return [...l].sort((a, b) => fechaOrden(b.date) - fechaOrden(a.date));
  }, [todos, figura, orden]);

  return (
    <div className="main-container" style={{ maxWidth: 1180 }}>
      <div className="ira-cabecera">
        <h1 className="ira-cabecera__titulo">{t.titulo}</h1>
        <p className="ira-cabecera__texto">{t.intro}</p>
      </div>

      {!activa ? (
        <ul className="ira-rejilla-discursos">
          {figuras.map((e) => (
            <li key={e.id}>
              <button type="button" className="ira-figura" style={{ flex: 1, textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => elegir(e.id)}>
                <div className="ira-figura__cabecera">
                  {e.photo && <img src={e.photo} alt="" className="ira-figura__foto" />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="ira-figura__nombre">{e.name}</h2>
                    <p className="ira-figura__pais">{e.country}</p>
                  </div>
                </div>
                <div>
                  <p className="ira-figura__cifra">
                    <span style={{ color: e.score != null ? colorCifra(e.score) : 'var(--ira-texto-3)' }}>{formatearPuntuacion(e.score, lang)}</span>
                    <span className="ira-figura__max">/10 · {t.iraMedio}</span>
                  </p>
                  <div style={{ marginTop: 10 }}><BarraEscala puntuacion={e.score} grosor={6} /></div>
                </div>
                <span className="ira-figura__cta">{t.ver(e.n)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <button type="button" className="ira-boton ira-boton--secundario" style={{ marginBottom: 20 }} onClick={() => elegir(null)}>{t.volver}</button>

          <div className="ira-figura__cabecera" style={{ alignItems: 'center', marginBottom: 20 }}>
            {activa.photo && <img src={activa.photo} alt="" className="ira-figura__foto" style={{ width: 64, height: 64 }} />}
            <div>
              <h2 className="ira-figura__nombre" style={{ fontSize: 24 }}>{activa.name}</h2>
              <p className="ira-figura__pais">{activa.country}</p>
            </div>
          </div>

          <div className="ira-filtros">
            <div className="ira-filtros__grupo" role="group" aria-labelledby="ira-disc-ordenar">
              <span id="ira-disc-ordenar" className="ira-filtros__rotulo">{t.ordenar}</span>
              {[['recientes', t.recientes], ['emp', t.emp], ['pol', t.pol]].map(([id, label]) => (
                <button type="button" key={id} className="ira-chip" aria-pressed={orden === id} onClick={() => setOrden(id)}>{label}</button>
              ))}
            </div>
          </div>

          <p className="ira-filtros__total" role="status">
            {diarios === null ? t.cargando : lista.length ? t.total(lista.length) : t.vacio}
          </p>

          <ul className="ira-rejilla-discursos">
            {lista.map((s) => (
              <li key={s.id}>
                <TarjetaDiscurso
                  compacta
                  lang={lang}
                  orador={s.entityName}
                  cargo={(lang === 'en' && s.titleEn) || s.title}
                  fecha={fechaCorta(s.date)}
                  cita={citaDestacada(s, lang, 200)}
                  puntuacion={s.iraScore}
                  pie={s.origen === 'diario' ? t.diario : t.corpus}
                  onVerDesglose={() => setActivo(s)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {activo && <Superposicion speech={activo} lang={lang} onCerrar={() => setActivo(null)} />}
    </div>
  );
}
