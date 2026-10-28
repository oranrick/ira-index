// IRA · fondo con destellos
// Destellos repartidos al azar por toda la pantalla, con tres intensidades.
// Los fuertes solo usan los extremos de la escala (rojo 0-2, verde 8-10):
// el impacto más intenso brilla más, sea negativo o positivo.
// Decorativo: aria-hidden, sin eventos de puntero, quieto con "reducir movimiento".
import { useMemo } from 'react';
import { ESCALA } from '../lib/escala';
import '../styles/destellos.css';

// Peso de cada punto de la escala: los extremos aparecen más
const PESOS = [7, 6, 4, 3, 2, 1.5, 2, 3, 4, 6, 7];
const TOTAL = PESOS.reduce((a, b) => a + b, 0);
const EXTREMOS = [0, 1, 2, 8, 9, 10];

function puntoEscala(soloExtremos) {
  if (soloExtremos) return EXTREMOS[Math.floor(Math.random() * EXTREMOS.length)];
  let r = Math.random() * TOTAL;
  for (let i = 0; i < PESOS.length; i++) {
    r -= PESOS[i];
    if (r <= 0) return i;
  }
  return 10;
}

const limitar = (v) => Math.min(1, Math.max(0, v));

function crearDestellos(cantidad, intensidad) {
  return Array.from({ length: cantidad }, (_, k) => {
    const t = Math.random();
    const nivel = t < 0.09 ? 'fuerte' : t < 0.32 ? 'medio' : 'tenue';
    const color = ESCALA[puntoEscala(nivel === 'fuerte')];
    const i = intensidad;
    let size, opacidad, glow, nucleo = color, onda = 0;

    if (nivel === 'fuerte') {
      size = 3.5 + Math.random() * 2;
      opacidad = limitar(Math.max(i, 0.6));
      nucleo = '#FCFDFF';
      glow = `0 0 ${Math.round(6 * i)}px ${Math.round(2 * i)}px ${color}, ` +
             `0 0 ${Math.round(22 * i)}px ${Math.round(4 * i)}px ${color}99, ` +
             `0 0 ${Math.round(48 * i)}px ${Math.round(10 * i)}px ${color}33`;
      onda = Math.round(34 + Math.random() * 22);
    } else if (nivel === 'medio') {
      size = 2 + Math.random() * 1.4;
      opacidad = limitar((0.6 + Math.random() * 0.25) * i);
      glow = `0 0 ${Math.round(6 * i)}px ${color}, 0 0 ${Math.round(14 * i)}px ${color}66`;
      if (Math.random() < 0.25) onda = Math.round(20 + Math.random() * 10);
    } else {
      size = 1 + Math.random() * 1.2;
      opacidad = limitar((0.2 + Math.random() * 0.35) * i);
      glow = `0 0 ${Math.round(size * 3)}px ${color}`;
    }

    // Estrella de cuatro puntas, la misma de los fragmentos de la portada: en todos los
    // fuertes y en algunos medios, para que la firma de la portada se vea en toda la web
    const estrella = nivel === 'fuerte' ? Math.round(18 + Math.random() * 12)
      : nivel === 'medio' && Math.random() < 0.3 ? Math.round(10 + Math.random() * 6) : 0;

    const dur = 3 + Math.random() * 5;
    return {
      id: k,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size, opacidad, glow, nucleo, color, onda, estrella,
      dur, retraso: -Math.random() * 8,
    };
  });
}

export default function Destellos({ cantidad = 90, intensidad = 1, animado = true }) {
  // Nueva colocación en cada carga de la página
  const destellos = useMemo(() => crearDestellos(cantidad, intensidad), [cantidad, intensidad]);

  return (
    <div className="ira-destellos" aria-hidden="true">
      {destellos.map((d) => (
        <div key={d.id} className="ira-destello" style={{ left: `${d.x}%`, top: `${d.y}%`, opacity: d.opacidad }}>
          <div
            className="ira-destello__nucleo"
            style={{
              width: d.size, height: d.size, left: -d.size / 2, top: -d.size / 2,
              background: d.nucleo, boxShadow: d.glow,
              animation: animado ? `ira-titileo ${d.dur.toFixed(2)}s ease-in-out ${d.retraso.toFixed(2)}s infinite` : 'none',
            }}
          />
          {d.estrella > 0 && (
            <svg
              viewBox="0 0 24 24"
              width={d.estrella}
              height={d.estrella}
              className="ira-destello__estrella"
              style={{
                left: -d.estrella / 2, top: -d.estrella / 2, fill: d.color,
                filter: `drop-shadow(0 0 3px ${d.color})`,
                animation: animado ? `ira-destello-cruz ${d.dur.toFixed(2)}s ease-in-out ${d.retraso.toFixed(2)}s infinite` : 'none',
              }}
            >
              <path d="M12 0 L13.1 10.9 L24 12 L13.1 13.1 L12 24 L10.9 13.1 L0 12 L10.9 10.9 Z" />
            </svg>
          )}
          {d.onda > 0 && (
            <div
              className="ira-destello__onda"
              style={{
                width: d.onda, height: d.onda, borderColor: d.color,
                animation: animado ? `ira-onda ${(d.dur * 1.4).toFixed(2)}s ease-out ${d.retraso.toFixed(2)}s infinite` : 'none',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
