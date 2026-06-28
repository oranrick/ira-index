// src/components/WorldMap.jsx
// Mapa mundial interactivo: muestra entidades como círculos coloreados por IRA
// sobre un fondo de mapa equirectangular de Wikipedia (dominio público).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IRA_COLOR = (score) => {
  if (score == null) return '#555';
  if (score >= 7)   return '#6ec6a0';
  if (score >= 4.5) return '#e8a838';
  return '#e05252';
};

// Coordenadas lon/lat aproximadas para la proyección equirectangular.
// Entidades en el mismo país están ligeramente desplazadas para no solaparse.
const COORDS = {
  mujica:    { lon: -56.3, lat: -32.5 },
  ardern:    { lon: 174.9, lat: -40.9 },
  sheinbaum: { lon: -99.1, lat:  19.4 },
  sanchez:   { lon:  -3.7, lat:  40.4 },
  petro:     { lon: -74.1, lat:   4.6 },
  trump:     { lon: -77.0, lat:  38.9 },
  milei:     { lon: -64.2, lat: -31.4 },
  elpais:    { lon:  -3.7, lat:  41.8 },  // ES, ligeramente al norte de Sánchez
  telemundo: { lon: -80.2, lat:  25.8 },  // Miami
  fox:       { lon: -87.6, lat:  41.9 },  // Chicago aprox.
  publico:   { lon:  -3.7, lat:  38.8 },  // ES, ligeramente al sur de Sánchez
  rt:        { lon: 105.0, lat:  52.0 },  // Rusia central
};

const MAP_W = 800;
const MAP_H = 400;

function lonToX(lon) { return ((lon + 180) / 360) * MAP_W; }
function latToY(lat) { return ((90 - lat) / 180) * MAP_H; }

const TEXTS = {
  es: { title: 'Distribución geográfica', subtitle: 'Haz clic en un país para ver su análisis' },
  en: { title: 'Geographic distribution', subtitle: 'Click a country to view its analysis' },
};

export default function WorldMap({ entities, lang = 'es', accent = '#ff6600' }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const T = TEXTS[lang] || TEXTS.es;
  const accentA = (a) => accent === '#ff6600'
    ? `rgba(255,102,0,${a})`
    : `rgba(0,102,255,${a})`;

  return (
    <div style={{ marginTop: '28px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
          🌍 {T.title}
        </span>
        <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>
          {T.subtitle}
        </p>
      </div>

      <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
        {/* Fondo: mapa del mundo en dominio público (Wikipedia) */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt=""
          draggable={false}
          style={{ width: '100%', display: 'block', opacity: 0.09, filter: 'invert(1)', userSelect: 'none' }}
        />

        {/* Overlay SVG con los indicadores de entidades */}
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          {entities.map((entity) => {
            const coords = COORDS[entity.id];
            if (!coords) return null;
            const cx = lonToX(coords.lon);
            const cy = latToY(coords.lat);
            const color = IRA_COLOR(entity.score);
            const isHov = hovered === entity.id;
            const r = isHov ? 18 : 14;

            return (
              <g
                key={entity.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/entity/${entity.id}`)}
                onMouseEnter={() => setHovered(entity.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Halo exterior */}
                <circle
                  cx={cx} cy={cy}
                  r={r + 6}
                  fill={color}
                  fillOpacity={isHov ? 0.15 : 0.06}
                  style={{ transition: 'all 0.2s ease' }}
                />
                {/* Círculo principal */}
                <circle
                  cx={cx} cy={cy}
                  r={r}
                  fill={color}
                  fillOpacity={isHov ? 0.9 : 0.75}
                  stroke={color}
                  strokeWidth={isHov ? 2 : 1.5}
                  style={{ transition: 'all 0.2s ease' }}
                />
                {/* Score text */}
                <text
                  x={cx} y={cy + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: isHov ? '9px' : '8px',
                    fontWeight: 700,
                    fill: '#000',
                    fontFamily: "'DM Mono', monospace",
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {entity.score != null ? entity.score.toFixed(1) : '?'}
                </text>

                {/* Tooltip con nombre */}
                {isHov && (
                  <g>
                    <rect
                      x={cx - 52} y={cy - 36}
                      width={104} height={20}
                      rx={5}
                      fill="rgba(14,14,20,0.92)"
                      stroke={color}
                      strokeWidth={0.8}
                    />
                    <text
                      x={cx} y={cy - 25}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: '8.5px',
                        fontWeight: 700,
                        fill: '#fff',
                        fontFamily: "'DM Mono', monospace",
                        pointerEvents: 'none',
                      }}
                    >
                      {entity.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          ['#6ec6a0', '≥ 7.0', 'Empático'],
          ['#e8a838', '4.5 – 7.0', 'Mixto'],
          ['#e05252', '< 4.5', 'Polarizante'],
        ].map(([color, range, label]) => (
          <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Mono', monospace" }}>
              {lang === 'en' ? range : range} · {lang === 'en' ? label : label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
