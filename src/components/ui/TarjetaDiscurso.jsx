// IRA · tarjeta de discurso
// Orador y cargo, fecha en mono, cita, puntuación grande con el color de la escala y "/10",
// barra de 11 segmentos con "0 Polarizante" / "Empático 10" y botón "Ver desglose".
import { colorPuntuacion, formatearPuntuacion } from '../../lib/escala';
import BarraEscala from './BarraEscala.jsx';

const TXT = {
  es: { pol: '0 Polarizante', emp: 'Empático 10', ver: 'Ver desglose', de: 'de 10' },
  en: { pol: '0 Polarizing', emp: 'Empathic 10', ver: 'See breakdown', de: 'out of 10' },
};

export default function TarjetaDiscurso({
  orador, cargo, fecha, cita, puntuacion, lang = 'es', pie, onVerDesglose, compacta = false, as: Etiqueta = 'article',
}) {
  const t = TXT[lang] ?? TXT.es;
  const cifra = formatearPuntuacion(puntuacion, lang);
  return (
    <Etiqueta className={`ira-tarjeta${compacta ? ' ira-tarjeta--compacta' : ''}`}>
      <div className="ira-tarjeta__cabecera">
        <div className="ira-tarjeta__orador">
          <span className="ira-tarjeta__nombre">{orador}</span>
          {cargo && <span className="ira-tarjeta__cargo">{cargo}</span>}
        </div>
        {fecha && <span className="ira-tarjeta__fecha">{fecha}</span>}
      </div>
      {cita && <blockquote className="ira-tarjeta__cita">«{cita}»</blockquote>}
      <div className="ira-tarjeta__puntuacion">
        <p className="ira-tarjeta__cifra">
          <span style={{ color: colorPuntuacion(puntuacion) }}>{cifra}</span>
          <span className="ira-tarjeta__max">/10</span>
          <span className="ira-sr"> {t.de}</span>
        </p>
        <BarraEscala puntuacion={puntuacion} grosor={compacta ? 6 : 8} />
        <div className="ira-tarjeta__extremos" aria-hidden="true"><span>{t.pol}</span><span>{t.emp}</span></div>
      </div>
      {(pie || onVerDesglose) && (
        <div className="ira-tarjeta__pie">
          <span className="ira-tarjeta__nota">{pie}</span>
          {onVerDesglose && (
            <button type="button" className="ira-boton ira-boton--secundario ira-boton--compacto" onClick={onVerDesglose}>
              {t.ver}
              {orador && <span className="ira-sr">: {orador}{cargo ? `, ${cargo}` : ''}</span>}
            </button>
          )}
        </div>
      )}
    </Etiqueta>
  );
}
