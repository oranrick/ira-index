// IRA · portada
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, mergeSpeech } from '../App.jsx';
import { supabase } from '../supabaseClient';
import { politicalSpeeches as speeches } from '../data/speeches';
import IndicadorEscala from './ui/IndicadorEscala.jsx';
import { HERRAMIENTAS_ABIERTAS } from '../lib/funciones';
import PanelEjemplos from './PanelEjemplos.jsx';
import ModalCiencia from './ModalCiencia.jsx';
import { ejemploDesdeCorpus, ejemploDesdeDiario, seleccionarEjemplos } from '../lib/ejemplosPortada';

const TXT = {
  es: {
    titulo: 'Cómo suena la política cuando escucha',
    intro: (Met, Neuro, Ling, Psico) => (
      <>IRA es un índice de resonancia afectiva construido sobre una {Met('metodología')} que integra {Neuro('neurociencia')}, {Ling('lingüística')} y {Psico('psicoanálisis')}. Escucha cómo hablan los políticos y mide si su lenguaje acerca o polariza. Durante la campaña del 29-N, escucha cada semana a los cuatro principales candidatos.</>
    ),
    ver: 'Ver el archivo',
    campana: 'La campaña del 29-N',
    crear: 'Crear cuenta para analizar',
    analizar: 'Analizar un discurso',
    nota: (Entrar) => <>¿Ya tienes cuenta? {Entrar('Inicia sesión')} para analizar un discurso.</>,
    origen: 'Ejemplos del archivo, calculados con el método de 2024.',
    nuevoRotulo: 'Elecciones generales · 29-N',
    nuevoTexto: 'Del 13 al 27 de noviembre, un mitin por semana de cada candidatura, medido con P1 y P2 de la Metodología 2.0.',
  },
  en: {
    titulo: 'How politics sounds when it listens',
    intro: (Met, Neuro, Ling, Psico) => (
      <>IRA is an affective resonance index built on a {Met('methodology')} that brings together {Neuro('neuroscience')}, {Ling('linguistics')} and {Psico('psychoanalysis')}. It listens to how politicians speak and measures whether their language brings people closer or polarizes. During the campaign for Spain's 29 November election, it listens every week to the four main candidates.</>
    ),
    ver: 'See the archive',
    campana: 'The 29-N campaign',
    crear: 'Create an account to analyze',
    analizar: 'Analyze a speech',
    nota: (Entrar) => <>Already have an account? {Entrar('Sign in')} to analyze a speech.</>,
    origen: 'Examples from the archive, calculated with the 2024 method.',
    nuevoRotulo: 'Spanish general election · 29-N',
    nuevoTexto: 'From 13 to 27 November, one rally per candidate per week, measured with P1 and P2 of Methodology 2.0.',
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
        <h1 className="ira-portada__titulo">
          {t.titulo.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="ira-portada__subraya">
            {t.titulo.split(' ').slice(-1)[0]}
            <svg viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path d="M4 20 C 60 10, 120 26, 180 16 S 270 12, 296 18" /></svg>
          </span>
        </h1>
        <div className="ira-portada__bajada">
        <p className="ira-portada__intro">
          {t.intro((x) => <Link to="/about">{x}</Link>, boton('neuro'), boton('ling'), boton('psico'))}
        </p>
        <div className="ira-portada__lado">
        <div className="ira-portada__acciones">
          <Link to="/elecciones-29n" className="ira-boton ira-boton--principal">{t.campana}</Link>
          {!HERRAMIENTAS_ABIERTAS
            ? <Link to="/politicos" className="ira-boton ira-boton--secundario">{t.ver}</Link>
            : user
              ? <Link to="/analyze" className="ira-boton ira-boton--secundario">{t.analizar}</Link>
              : <button type="button" className="ira-boton ira-boton--secundario" onClick={openRegister}>{t.crear}</button>}
        </div>
        {HERRAMIENTAS_ABIERTAS && !user && (
          <p className="ira-portada__nota">
            {t.nota((x) => <button type="button" className="ira-enlace-boton" onClick={openLogin}>{x}</button>)}
          </p>
        )}
        </div>
        </div>
      </div>

      <PanelEjemplos ejemplos={ejemplos} lang={lang} />
      <p className="ira-portada__origen">{t.origen}</p>

      <div className="ira-portada__pie">
        <Link to="/elecciones-29n" className="ira-portada__nuevo">
            <span className="ira-portada__nuevo-rotulo">{t.nuevoRotulo}</span>
            <span className="ira-portada__nuevo-texto">{t.nuevoTexto}</span>
          </Link>
          <IndicadorEscala compacto lang={lang} className="ira-portada__escala" />
      </div>

      <ModalCiencia ciencia={ciencia} lang={lang} onCerrar={() => setCiencia(null)} />
    </div>
  );
}
