// IRA · barra de navegación global
// Logo con nombre · Campaña 29-N · Archivo · Metodología · | · Iniciar sesión · Crear cuenta
// (las cuentas solo sirven para analizar: con las herramientas escondidas no se ofrecen)
// (Discursos se unió a Clasificación: cada político abre sus discursos)
import { useContext, useEffect, useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import IraLogo from './IraLogo.jsx';
import { AppContext } from '../App.jsx';
import { HERRAMIENTAS_ABIERTAS } from '../lib/funciones';

const TXT = {
  es: {
    nombre: 'Índice de Resonancia Afectiva',
    principal: 'Principal',
    campana: 'Campaña 29-N',
    clasificacion: 'Archivo',
    metodologia: 'Metodología',
    entrar: 'Iniciar sesión',
    crear: 'Crear cuenta',
    salir: 'Salir',
    menu: 'Menú',
    idioma: 'Switch to English',
    idiomaCorto: 'EN',
  },
  en: {
    nombre: 'Affective Resonance Index',
    principal: 'Main',
    campana: '29-N campaign',
    clasificacion: 'Archive',
    metodologia: 'Methodology',
    entrar: 'Sign in',
    crear: 'Create account',
    salir: 'Sign out',
    menu: 'Menu',
    idioma: 'Cambiar a español',
    idiomaCorto: 'ES',
  },
};

// Clasificación cubre también las fichas, los discursos de cada figura y el modo medios
const ACTIVA = {
  campana: (p) => p.startsWith('/elecciones'),
  clasificacion: (p) => /^\/(politicos|medios|entity\/|discursos)/.test(p),
  metodologia: (p) => p.startsWith('/metodologia') || p.startsWith('/about'),
};

export default function Nav() {
  const { lang, setLang, user, profile, signOut, openLogin, openRegister } = useContext(AppContext);
  const { pathname } = useLocation();
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  const t = TXT[lang] ?? TXT.es;

  // Cierra el menú móvil al cambiar de página o con Escape
  useEffect(() => { setAbierto(false); }, [pathname]);
  useEffect(() => {
    if (!abierto) return;
    const esc = (e) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [abierto]);

  const cambiarIdioma = () => setLang((l) => {
    const next = l === 'es' ? 'en' : 'es';
    try { localStorage.setItem('ira-lang', next); } catch {}
    return next;
  });

  const enlace = (id, to) => (
    <NavLink
      to={to}
      className={() => 'ira-nav__enlace' + (ACTIVA[id](pathname) ? ' is-activa' : '')}
      aria-current={ACTIVA[id](pathname) ? 'page' : undefined}
    >
      {t[id]}
    </NavLink>
  );

  return (
    <header className="ira-nav">
      <div className="ira-nav__barra">
        <IraLogo conNombre nombre={t.nombre} />

        <button
          type="button"
          className="ira-nav__menu"
          aria-expanded={abierto}
          aria-controls={panelId}
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="ira-sr">{t.menu}</span>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            {abierto
              ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>
              : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>}
          </svg>
        </button>

        <nav id={panelId} className={'ira-nav__panel' + (abierto ? ' is-abierto' : '')} aria-label={t.principal}>
          {enlace('campana', '/elecciones-29n')}
          {enlace('clasificacion', '/politicos')}
          {enlace('metodologia', '/metodologia')}
          {(user || HERRAMIENTAS_ABIERTAS) && <span className="ira-nav__sep" aria-hidden="true" />}
          {user ? (
            <>
              <span className="ira-nav__usuario" title={user.email}>{profile?.username ?? user.email?.split('@')[0]}</span>
              <button type="button" className="ira-nav__enlace ira-nav__enlace--fuerte" onClick={() => signOut()}>{t.salir}</button>
            </>
          ) : HERRAMIENTAS_ABIERTAS && (
            <>
              <button type="button" className="ira-nav__enlace ira-nav__enlace--fuerte" onClick={openLogin}>{t.entrar}</button>
              <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto" onClick={openRegister}>{t.crear}</button>
            </>
          )}
          <button type="button" className="ira-nav__idioma" onClick={cambiarIdioma} aria-label={t.idioma} lang={lang === 'es' ? 'en' : 'es'}>
            {t.idiomaCorto}
          </button>
        </nav>
      </div>
    </header>
  );
}
