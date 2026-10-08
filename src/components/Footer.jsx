// IRA · pie de página global, discreto
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';

const TXT = {
  es: { dia: 'Análisis del día', patrones: 'Patrones', medios: 'Medios', autoria: 'TFG de Ricardo Grisales Ramírez · UCM' },
  en: { dia: 'Daily analysis', patrones: 'Patterns', medios: 'Media', autoria: 'Thesis by Ricardo Grisales Ramírez · UCM' },
};

export default function Footer() {
  const { lang, hasDaily } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  return (
    <footer className="ira-pie">
      <nav className="ira-pie__enlaces" aria-label={lang === 'en' ? 'More sections' : 'Más secciones'}>
        {hasDaily && <Link to="/analisis-del-dia">{t.dia}</Link>}
        <Link to="/patrones">{t.patrones}</Link>
        <Link to="/medios">{t.medios}</Link>
      </nav>
      <p className="ira-pie__autoria">
        {t.autoria} · <a href="https://oranrick.com" target="_blank" rel="noopener noreferrer">oranrick.com</a>
      </p>
    </footer>
  );
}
