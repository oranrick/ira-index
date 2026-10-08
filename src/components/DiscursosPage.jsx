// IRA · discursos de una figura: se abre desde Clasificación (/politicos?figura=ID).
// /discursos y /discursos?figura=ID redirigen aquí (los usan el mapa y la página de país).
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, mergeSpeech, rowToSpeech } from '../App.jsx';
import { supabase } from '../supabaseClient';
import { politicalSpeeches as speeches } from '../data/speeches';
import TarjetaDiscurso from './ui/TarjetaDiscurso.jsx';
import { SpeechView } from './SpeechView.jsx';
import { useAtraparFoco } from './ui/Ventana.jsx';
import { fechaCorta, fechaOrden, citaDestacada } from '../lib/discursos';

const TXT = {
  es: {
    volver: '← Clasificación', perfil: 'Ver perfil y radar →',
    ordenar: 'Ordenar', recientes: 'Más recientes', emp: 'Más empático', pol: 'Más polarizante',
    cargando: 'Cargando discursos…', vacio: 'Todavía no hay discursos analizados de esta figura.',
    diario: 'Análisis diario', corpus: 'Corpus del TFG', total: (n) => `${n} ${n === 1 ? 'discurso analizado' : 'discursos analizados'}`,
  },
  en: {
    volver: '← Leaderboard', perfil: 'See profile and radar →',
    ordenar: 'Sort', recientes: 'Most recent', emp: 'Most empathic', pol: 'Most polarizing',
    cargando: 'Loading speeches…', vacio: 'No analyzed speeches for this figure yet.',
    diario: 'Daily analysis', corpus: 'Thesis corpus', total: (n) => `${n} analyzed ${n === 1 ? 'speech' : 'speeches'}`,
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

export default function DiscursosFigura({ figuraId }) {
  const { lang, supabaseMap, enrichedEntities } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const [diarios, setDiarios] = useState(null);
  const [orden, setOrden] = useState('recientes');
  const [activo, setActivo] = useState(null);
  const figura = enrichedEntities.find((e) => e.id === figuraId) ?? null;

  useEffect(() => { window.scrollTo(0, 0); }, [figuraId]);

  useEffect(() => {
    let vivo = true;
    supabase.from('daily_analyses').select(COLUMNAS).eq('entity_id', figuraId).order('published_date', { ascending: false }).limit(120)
      .then(({ data }) => { if (vivo) setDiarios(Array.isArray(data) ? data.map(rowToSpeech) : []); })
      .catch(() => { if (vivo) setDiarios([]); });
    const espera = setTimeout(() => { if (vivo) setDiarios((d) => d ?? []); }, 6000);
    return () => { vivo = false; clearTimeout(espera); };
  }, [figuraId]);

  // La transcripción de un discurso diario se pide solo al abrirlo
  useEffect(() => {
    if (!activo || !activo.id.startsWith('daily-') || activo.transcript) return;
    const id = activo.id.slice('daily-'.length);
    supabase.from('daily_analyses').select('text').eq('id', id).single()
      .then(({ data }) => { if (data?.text) setActivo((a) => (a && a.id === activo.id ? { ...a, transcript: data.text } : a)); })
      .catch(() => {});
  }, [activo]);

  const lista = useMemo(() => {
    const corpus = speeches.filter((s) => s.entityId === figuraId).map((s) => ({ ...mergeSpeech(s, supabaseMap[s.id]), origen: 'corpus' }));
    const l = [...(diarios ?? []).map((s) => ({ ...s, origen: 'diario' })), ...corpus];
    if (orden === 'emp') return l.sort((a, b) => b.iraScore - a.iraScore);
    if (orden === 'pol') return l.sort((a, b) => a.iraScore - b.iraScore);
    return l.sort((a, b) => fechaOrden(b.date) - fechaOrden(a.date));
  }, [diarios, supabaseMap, figuraId, orden]);

  if (!figura) return null;

  return (
    <div className="main-container" style={{ maxWidth: 1180 }}>
      <Link to="/politicos" className="ira-boton ira-boton--secundario" style={{ marginBottom: 24 }}>{t.volver}</Link>

      <div className="ira-cabecera" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        {figura.photo && <img src={figura.photo} alt="" className="ira-figura__foto" style={{ width: 88, height: 88 }} />}
        <div style={{ minWidth: 0 }}>
          <h1 className="ira-cabecera__titulo" style={{ margin: 0 }}>{figura.name}</h1>
          <p className="ira-cabecera__texto" style={{ margin: '4px 0 0' }}>
            {figura.country} · <Link to={`/entity/${figura.id}`}>{t.perfil}</Link>
          </p>
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

      {activo && <Superposicion speech={activo} lang={lang} onCerrar={() => setActivo(null)} />}
    </div>
  );
}
