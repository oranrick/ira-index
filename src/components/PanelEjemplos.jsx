// IRA · panel de la portada: un discurso analizado como grabación (traza de sus frases y
// citas marcadas como en una transcripción)
// Rota cada 7 s con fundido; flechas, puntos y contador. Al pulsar se reinicia el temporizador.
// Se detiene con el puntero encima o el foco dentro, y no rota con "reducir movimiento".
import { useCallback, useEffect, useRef, useState } from 'react';
import { colorCifra, formatearPuntuacion } from '../lib/escala';
import EtiquetaPuntuacion from './ui/EtiquetaPuntuacion.jsx';
import Traza from './ui/Traza.jsx';

const SEGUNDOS = 7;

const TXT = {
  es: {
    region: 'Fragmentos de un discurso analizado', pais: 'País', fecha: 'Fecha', persona: 'Persona', discurso: 'Discurso',
    puntuacion: 'Puntuación del discurso', pol: 'Elemento polarizador', emp: 'Elemento empático',
    ant: 'Ejemplo anterior', sig: 'Ejemplo siguiente', ejemplo: (n) => `Ejemplo ${n}`, cargando: 'Cargando discursos analizados…',
    marcaPol: 'fragmento polarizante', marcaEmp: 'fragmento empático',
  },
  en: {
    region: 'Fragments of an analyzed speech', pais: 'Country', fecha: 'Date', persona: 'Speaker', discurso: 'Speech',
    puntuacion: 'Speech score', pol: 'Polarizing element', emp: 'Empathic element',
    ant: 'Previous example', sig: 'Next example', ejemplo: (n) => `Example ${n}`, cargando: 'Loading analyzed speeches…',
    marcaPol: 'polarizing fragment', marcaEmp: 'empathic fragment',
  },
};

function prefiereQuieto() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function Fragmento({ f, lang, t }) {
  return (
    <figure className={`ira-panel-ej__fragmento ira-panel-ej__fragmento--${f.polaridad}`}>
      <blockquote className="ira-panel-ej__cita">
        <p><span className="ira-panel-ej__marca">«{f.texto}»</span></p>
      </blockquote>
      <figcaption className="ira-panel-ej__pie-frase">
        <span className="ira-sr">{f.polaridad === 'polarizante' ? t.marcaPol : t.marcaEmp}: </span>
        <b style={{ color: colorCifra(f.puntuacion) }}>{formatearPuntuacion(f.puntuacion, lang)}</b>
        <span aria-hidden="true">{f.polaridad === 'polarizante' ? t.pol.toLowerCase() : t.emp.toLowerCase()}</span>
      </figcaption>
    </figure>
  );
}

// Las notas de la traza: las de sus frases analizadas, en orden, con la nota del discurso
// en los extremos para que la grabación empiece y acabe en su tono general
function notasDe(ej) {
  const frases = ej.fragmentos.map((f) => f.puntuacion);
  return [ej.puntuacion, ...frases, ej.puntuacion];
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
          <div className="ira-panel-ej__cab">
            <p className="ira-panel-ej__quien">
              <b>{actual.persona}</b>
              <span>{actual.discurso}</span>
              <span className="ira-panel-ej__donde">{[actual.pais, actual.fecha].filter(Boolean).join(', ')}</span>
            </p>
            <p className="ira-panel-ej__cifra" aria-label={`${t.puntuacion}: ${formatearPuntuacion(actual.puntuacion, lang)}`}>
              <span style={{ color: colorCifra(actual.puntuacion) }}>{formatearPuntuacion(actual.puntuacion, lang)}</span>
              <span className="ira-panel-ej__max">{lang === 'en' ? 'of 10' : 'de 10'}</span>
            </p>
          </div>
          <Traza notas={notasDe(actual)} semilla={actual.id} alto={110} grosor={2.4} duracion={2200} cabezal repetir className="ira-panel-ej__traza" />
          <div className="ira-panel-ej__fragmentos">
            {actual.fragmentos.map((f, k) => <Fragmento key={k} f={f} lang={lang} t={t} />)}
          </div>
        </div>
      )}

      {n > 1 && (
        <div className="ira-panel-ej__controles">
          <div className="ira-panel-ej__puntos">
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
