// IRA · panel de la portada con discursos de ejemplo
// Rota cada 7 s con fundido; flechas, puntos y contador. Al pulsar se reinicia el temporizador.
// Se detiene con el puntero encima o el foco dentro, y no rota con "reducir movimiento".
import { useCallback, useEffect, useRef, useState } from 'react';
import { colorPuntuacion, formatearPuntuacion } from '../lib/escala';
import EtiquetaPuntuacion from './ui/EtiquetaPuntuacion.jsx';
import Estrella from './ui/Estrella.jsx';

const SEGUNDOS = 7;

const TXT = {
  es: {
    region: 'Fragmentos de un discurso analizado', pais: 'País', fecha: 'Fecha', persona: 'Persona', discurso: 'Discurso',
    puntuacion: 'Puntuación del discurso', pol: 'Elemento polarizador', emp: 'Elemento empático',
    ant: 'Ejemplo anterior', sig: 'Ejemplo siguiente', ejemplo: (n) => `Ejemplo ${n}`, cargando: 'Cargando discursos analizados…',
    marcaPol: 'polarizante', marcaEmp: 'empático',
  },
  en: {
    region: 'Fragments of an analyzed speech', pais: 'Country', fecha: 'Date', persona: 'Speaker', discurso: 'Speech',
    puntuacion: 'Speech score', pol: 'Polarizing element', emp: 'Empathic element',
    ant: 'Previous example', sig: 'Next example', ejemplo: (n) => `Example ${n}`, cargando: 'Loading analyzed speeches…',
    marcaPol: 'polarizing', marcaEmp: 'empathic',
  },
};

const ESTRELLA = {
  polarizante: { color: 'var(--ira-estrella-polarizante)', brillo: '#BE281A' },
  empatico: { color: 'var(--ira-estrella-empatica)', brillo: '#8DAA7E' },
};

function prefiereQuieto() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function Fragmento({ f, lang, t }) {
  const { inicio, fin } = f.marca;
  const est = ESTRELLA[f.polaridad];
  return (
    <div className="ira-panel-ej__fragmento">
      <EtiquetaPuntuacion puntuacion={f.puntuacion} lang={lang} className="ira-panel-ej__etiqueta" />
      <p>
        «{f.texto.slice(0, inicio)}
        <mark className={`ira-marca ira-marca--${f.polaridad}${fin - inicio > 60 ? ' ira-marca--larga' : ''}`}>
          {f.texto.slice(inicio, fin)}
          <Estrella color={est.color} brillo={est.brillo} titila />
          <span className="ira-sr"> ({f.polaridad === 'polarizante' ? t.marcaPol : t.marcaEmp})</span>
        </mark>
        {f.texto.slice(fin)}»
      </p>
    </div>
  );
}

export default function PanelEjemplos({ ejemplos, lang = 'es' }) {
  const t = TXT[lang] ?? TXT.es;
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const temporizador = useRef(null);
  const n = ejemplos.length;
  const actual = n ? ejemplos[i % n] : null;

  const reiniciar = useCallback(() => {
    clearInterval(temporizador.current);
    if (n < 2 || prefiereQuieto()) return;
    temporizador.current = setInterval(() => setI((v) => (v + 1) % n), SEGUNDOS * 1000);
  }, [n]);

  useEffect(() => {
    if (pausa) { clearInterval(temporizador.current); return undefined; }
    reiniciar();
    return () => clearInterval(temporizador.current);
  }, [pausa, reiniciar]);

  useEffect(() => { if (i >= n) setI(0); }, [i, n]);

  const ir = (j) => { setI(((j % n) + n) % n); reiniciar(); };

  const salirFoco = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPausa(false); };

  return (
    <aside
      className="ira-panel-ej"
      aria-label={t.region}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={salirFoco}
    >
      {!actual ? (
        <p className="ira-panel-ej__vacio" role="status">{t.cargando}</p>
      ) : (
        <div key={actual.id} className="ira-panel-ej__contenido">
          <dl className="ira-panel-ej__datos">
            <div><dt>{t.pais}</dt><dd>{actual.pais || '—'}</dd></div>
            <div><dt>{t.fecha}</dt><dd className="ira-cifra-fecha">{actual.fecha || '—'}</dd></div>
            <div><dt>{t.persona}</dt><dd>{actual.persona}</dd></div>
            <div><dt>{t.discurso}</dt><dd>{actual.discurso}</dd></div>
          </dl>

          <div className="ira-panel-ej__fragmentos">
            {actual.fragmentos.map((f, k) => <Fragmento key={k} f={f} lang={lang} t={t} />)}
          </div>

          <div className="ira-panel-ej__resumen">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="ira-panel-ej__rotulo">{t.puntuacion}</span>
              <p className="ira-panel-ej__cifra">
                <span style={{ color: colorPuntuacion(actual.puntuacion) }}>{formatearPuntuacion(actual.puntuacion, lang)}</span>
                <span className="ira-panel-ej__max">/10</span>
              </p>
            </div>
            <div className="ira-panel-ej__leyenda">
              <span><Estrella {...ESTRELLA.polarizante} />{t.pol}</span>
              <span><Estrella {...ESTRELLA.empatico} />{t.emp}</span>
            </div>
          </div>
        </div>
      )}

      {n > 1 && (
        <div className="ira-panel-ej__controles">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {ejemplos.map((e, k) => (
              <button
                key={e.id}
                type="button"
                className="ira-panel-ej__punto"
                aria-label={t.ejemplo(k + 1)}
                aria-pressed={k === i % n}
                onClick={() => ir(k)}
              >
                <span style={{ width: k === i % n ? 20 : 6, background: k === i % n ? 'var(--ira-nieve)' : 'var(--ira-linea-fuerte)' }} />
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ira-panel-ej__contador">{(i % n) + 1} / {n}</span>
            <button type="button" className="ira-boton ira-boton--secundario ira-boton--icono" aria-label={t.ant} onClick={() => ir(i - 1)}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-icono-trazo"><polyline points="15 6 9 12 15 18" /></svg>
            </button>
            <button type="button" className="ira-boton ira-boton--secundario ira-boton--icono" aria-label={t.sig} onClick={() => ir(i + 1)}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="ira-icono-trazo"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
