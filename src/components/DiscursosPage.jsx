// IRA · /discursos — todos los discursos analizados (corpus + análisis diarios)
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext, mergeSpeech, rowToSpeech } from '../App.jsx';
import { supabase } from '../supabaseClient';
import { speeches } from '../data/speeches';
import TarjetaDiscurso from './ui/TarjetaDiscurso.jsx';
import { SpeechView } from './SpeechView.jsx';
import { useAtraparFoco } from './ui/Ventana.jsx';
import { fechaCorta, fechaOrden, citaDestacada } from '../lib/discursos';

const TXT = {
  es: {
    titulo: 'Discursos',
    intro: 'Discursos políticos ya analizados con la metodología IRA: el corpus del TFG «El contagio de las palabras» y los discursos que se analizan cada día. Cada tarjeta muestra un fragmento destacado y la puntuación global, de 0 (polarizante) a 10 (empático).',
    todas: 'Todas las figuras', ordenar: 'Ordenar', recientes: 'Más recientes', emp: 'Más empático', pol: 'Más polarizante',
    cargando: 'Cargando discursos…', vacio: 'No hay discursos para este filtro.', figura: 'Figura',
    palabras: 'palabras', diario: 'Análisis diario', corpus: 'Corpus del TFG', total: (n) => `${n} discursos`,
  },
  en: {
    titulo: 'Speeches',
    intro: 'Political speeches already analyzed with the IRA methodology: the corpus from the thesis “The contagion of words” and the speeches analyzed every day. Each card shows a highlighted fragment and the overall score, from 0 (polarizing) to 10 (empathic).',
    todas: 'All figures', ordenar: 'Sort', recientes: 'Most recent', emp: 'Most empathic', pol: 'Most polarizing',
    cargando: 'Loading speeches…', vacio: 'No speeches match this filter.', figura: 'Figure',
    palabras: 'words', diario: 'Daily analysis', corpus: 'Thesis corpus', total: (n) => `${n} speeches`,
  },
};

const COLUMNAS = 'id,entity_id,entity_name,title,published_date,source_url,ira,params,segments,summary,lectura_autor';

function Superposicion({ speech, lang, onCerrar }) {
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
  const { lang, supabaseMap } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const [diarios, setDiarios] = useState(null);
  const [figura, setFigura] = useState('all');
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

  const figuras = useMemo(() => {
    const m = new Map();
    todos.forEach((s) => { if (!m.has(s.entityId)) m.set(s.entityId, s.entityName); });
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [todos]);

  const lista = useMemo(() => {
    const l = todos.filter((s) => figura === 'all' || s.entityId === figura);
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

      <div className="ira-filtros">
        <div className="ira-filtros__grupo" role="group" aria-label={t.figura}>
          <button type="button" className="ira-chip" aria-pressed={figura === 'all'} onClick={() => setFigura('all')}>{t.todas}</button>
          {figuras.map(([id, nombre]) => (
            <button type="button" key={id} className="ira-chip" aria-pressed={figura === id} onClick={() => setFigura(id)}>{nombre}</button>
          ))}
        </div>
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
