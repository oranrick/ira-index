// IRA · portada
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, mergeSpeech } from '../App.jsx';
import { supabase } from '../supabaseClient';
import { speeches } from '../data/speeches';
import IndicadorEscala from './ui/IndicadorEscala.jsx';
import PanelEjemplos from './PanelEjemplos.jsx';
import ModalCiencia from './ModalCiencia.jsx';
import { ejemploDesdeCorpus, ejemploDesdeDiario, seleccionarEjemplos } from '../lib/ejemplosPortada';

const TXT = {
  es: {
    titulo: 'Cómo suena la política cuando escucha',
    intro: (Met, Neuro, Ling, Psico) => (
      <>IRA es un índice de resonancia afectiva construido sobre una {Met('metodología')} que integra {Neuro('neurociencia')}, {Ling('lingüística')} y {Psico('psicoanálisis')}. Aquí se recogen discursos ya analizados y, con una cuenta, puedes analizar los tuyos con una IA que aplica esa misma metodología.</>
    ),
    ver: 'Ver discursos analizados',
    crear: 'Crear cuenta para analizar',
    analizar: 'Analizar un discurso',
    nota: (Entrar) => <>¿Ya tienes cuenta? {Entrar('Inicia sesión')} para analizar un discurso.</>,
  },
  en: {
    titulo: 'How politics sounds when it listens',
    intro: (Met, Neuro, Ling, Psico) => (
      <>IRA is an affective resonance index built on a {Met('methodology')} that brings together {Neuro('neuroscience')}, {Ling('linguistics')} and {Psico('psychoanalysis')}. Here you will find speeches that have already been analyzed and, with an account, you can analyze your own with an AI that applies the same methodology.</>
    ),
    ver: 'See analyzed speeches',
    crear: 'Create an account to analyze',
    analizar: 'Analyze a speech',
    nota: (Entrar) => <>Already have an account? {Entrar('Sign in')} to analyze a speech.</>,
  },
};

const COLUMNAS_DIARIO = 'id,entity_id,entity_name,entity_country,title,published_date,ira,params,segments';

export default function Portada() {
  const { lang, supabaseMap, supabaseReady, enrichedEntities, user, openLogin, openRegister } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const [ciencia, setCiencia] = useState(null);
  const [diarios, setDiarios] = useState(null);

  useEffect(() => {
    let vivo = true;
    supabase
      .from('daily_analyses')
      .select(COLUMNAS_DIARIO)
      .order('published_date', { ascending: false })
      .limit(30)
      .then(({ data }) => { if (vivo) setDiarios(Array.isArray(data) ? data : []); })
      .catch(() => { if (vivo) setDiarios([]); });
    // Si la base de datos no responde, el panel sigue con el corpus
    const espera = setTimeout(() => { if (vivo) setDiarios((d) => d ?? []); }, 6000);
    return () => { vivo = false; clearTimeout(espera); };
  }, []);

  const ejemplos = useMemo(() => {
    if (!supabaseReady || diarios === null) return [];
    const paises = Object.fromEntries(enrichedEntities.map((e) => [e.id, e]));
    // Un discurso diario por figura: el más reciente con fragmentos anotados
    const vistos = new Set();
    const recientes = [];
    for (const row of diarios) {
      if (vistos.has(row.entity_id) || !(row.segments ?? []).some((s) => s.type)) continue;
      vistos.add(row.entity_id);
      recientes.push(ejemploDesdeDiario({ ...row, entity_country: row.entity_country ?? paises[row.entity_id]?.country }, lang));
    }
    const corpus = speeches.map((s) => ejemploDesdeCorpus(mergeSpeech(s, supabaseMap[s.id]), paises[s.entityId], lang));
    return seleccionarEjemplos([...recientes, ...corpus]);
  }, [supabaseReady, supabaseMap, diarios, enrichedEntities, lang]);

  const boton = (id) => (texto) => (
    <button type="button" className="ira-enlace-boton" aria-haspopup="dialog" onClick={() => setCiencia(id)}>{texto}</button>
  );

  return (
    <div className="ira-portada">
      <div className="ira-portada__texto">
        <h1 className="ira-portada__titulo">{t.titulo}</h1>
        <p className="ira-portada__intro">
          {t.intro((x) => <Link to="/about">{x}</Link>, boton('neuro'), boton('ling'), boton('psico'))}
        </p>
        <div className="ira-portada__acciones">
          <Link to="/discursos" className="ira-boton ira-boton--principal">{t.ver}</Link>
          {user
            ? <Link to="/analyze" className="ira-boton ira-boton--secundario">{t.analizar}</Link>
            : <button type="button" className="ira-boton ira-boton--secundario" onClick={openRegister}>{t.crear}</button>}
        </div>
        {!user && (
          <p className="ira-portada__nota">
            {t.nota((x) => <button type="button" className="ira-enlace-boton" onClick={openLogin}>{x}</button>)}
          </p>
        )}
        <IndicadorEscala compacto lang={lang} className="ira-portada__escala" />
      </div>

      <PanelEjemplos ejemplos={ejemplos} lang={lang} />

      <ModalCiencia ciencia={ciencia} lang={lang} onCerrar={() => setCiencia(null)} />
    </div>
  );
}
