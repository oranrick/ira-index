// IRA · aviso de archivo: las notas de fichas y países se calcularon con el método de 2024.
// Va encima de la cifra para que nadie la compare con las lecturas de campaña (Metodología 2.0).
import { Link } from 'react-router-dom';

const TXT = {
  es: { rotulo: 'Archivo · método 2024', texto: 'Nota calculada con los siete parámetros del trabajo de fin de grado. Se recalculará cuando cierre la Metodología 2.0.', enlace: 'Cómo se calculaba' },
  en: { rotulo: 'Archive · 2024 method', texto: 'Score calculated with the seven parameters of the original thesis. It will be recalculated when Methodology 2.0 is complete.', enlace: 'How it was calculated' },
};

export default function AvisoArchivo({ lang = 'es', className = '' }) {
  const t = TXT[lang] ?? TXT.es;
  return (
    <p className={`ira-archivo ${className}`}>
      <span className="ira-archivo__rotulo">{t.rotulo}</span>
      <span className="ira-archivo__texto">{t.texto} <Link to="/about#metodologia-2024">{t.enlace}</Link></span>
    </p>
  );
}
