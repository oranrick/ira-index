// src/components/WorldMap.jsx
// Mapa mundial interactivo: muestra entidades como círculos coloreados por IRA
// sobre un fondo de mapa equirectangular de Wikipedia (dominio público).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { colorPuntuacion, textoSobrePuntuacion, formatearPuntuacion } from '../lib/escala';
import IndicadorEscala from './ui/IndicadorEscala.jsx';

const IRA_COLOR = (score) => (score == null ? '#4A5C5C' : colorPuntuacion(score));

// Coordenadas lon/lat reales para la proyección equirectangular (base
// -180..180 / -90..90, lineal). Entidades que comparten ciudad llevan un
// offset dentro de su país para no solaparse (comentado en cada caso).
const COORDS = {
  mujica:    { lon: -56.2,  lat: -34.9 },   // Montevideo
  ardern:    { lon: 174.8,  lat: -41.3 },   // Wellington
  sheinbaum: { lon: -99.1,  lat:  19.4 },   // Ciudad de México
  sanchez:   { lon:  -3.7,  lat:  40.4 },   // Madrid
  petro:     { lon: -74.1,  lat:   4.6 },   // Bogotá
  trump:     { lon: -98.0,  lat:  39.0 },   // centro EE.UU. (Kansas) — deja NY libre para Fox
  milei:     { lon: -64.2,  lat: -31.4 },   // Córdoba (Buenos Aires solaparía con Montevideo)
  putin:     { lon:  37.6,  lat:  55.8 },   // Moscú
  rufian:    { lon:   2.15, lat:  41.4 },   // Barcelona
  bukele:    { lon: -89.2,  lat:  13.7 },   // San Salvador
  kast:      { lon: -70.7,  lat: -33.5 },   // Santiago de Chile
  elpais:    { lon:  -6.0,  lat:  42.8 },   // sede Madrid — offset NO para no solapar Sánchez
  telemundo: { lon: -80.2,  lat:  25.8 },   // Miami
  foxnews:   { lon: -74.0,  lat:  40.7 },   // Nueva York
  publico:   { lon:  -5.8,  lat:  37.4 },   // sede Madrid — offset SO para no solapar Sánchez
  rt:        { lon:  37.6,  lat:  61.0 },   // sede Moscú — offset norte para no solapar Putin
};

const MAP_W = 800;
const MAP_H = 400;

function lonToX(lon) { return ((lon + 180) / 360) * MAP_W; }
function latToY(lat) { return ((90 - lat) / 180) * MAP_H; }

const TEXTS = {
  es: { title: 'Distribución geográfica', subtitle: 'Haz clic en un país para ver su análisis' },
  en: { title: 'Geographic distribution', subtitle: 'Click a country to view its analysis' },
};

export default function WorldMap({ entities, lang = 'es', accent = '#DCB149' }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const T = TEXTS[lang] || TEXTS.es;
  const accentA = (a) => accent === '#DCB149'
    ? `rgba(220,177,73,${a})`
    : `rgba(220,177,73,${a})`;

  return (
    <div className="ira-panel" style={{ marginTop: '28px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 className="ira-seccion__titulo" style={{ marginBottom: '4px' }}>
          {T.title}
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: "var(--ira-texto-2)" }}>
          {T.subtitle}
        </p>
      </div>

      <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
        {/* Fondo: proyección equirectangular completa (-180..180 / -90..90),
            dominio público (Wikimedia "World location map"). Debe ser
            equirectangular: la conversión lon/lat → x/y es lineal. */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/World_location_map_%28equirectangular_180%29.svg/1280px-World_location_map_%28equirectangular_180%29.svg.png"
          alt=""
          draggable={false}
          style={{ width: '100%', display: 'block', opacity: 0.18, filter: 'invert(1) grayscale(1)', userSelect: 'none' }}
        />

        {/* Overlay SVG con los indicadores de entidades.
            preserveAspectRatio="none" fija el viewBox 2:1 al box del <img>
            (también 2:1) sin letterboxing por redondeos. */}
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          {entities.map((entity) => {
            const coords = COORDS[entity.id];
            if (!coords) return null;
            const cx = lonToX(coords.lon);
            const cy = latToY(coords.lat);
            const color = IRA_COLOR(entity.score);
            const isHov = hovered === entity.id;
            const r = isHov ? 20 : 16;
            // etiqueta corta: apellido (último token) para personas;
            // nombre sin paréntesis para medios ("RT (Russia Today)" → "RT")
            const shortName = entity.category === 'Medio'
              ? entity.name.replace(/\s*\([^)]*\)/g, '').trim()
              : entity.name.split(' ').pop();

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
                  fillOpacity={isHov ? 0.20 : 0.09}
                  style={{ transition: 'all 0.2s ease' }}
                />
                {/* Círculo principal */}
                <circle
                  cx={cx} cy={cy}
                  r={r}
                  fill={color}
                  fillOpacity={isHov ? 0.95 : 0.82}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1}
                  style={{ transition: 'all 0.2s ease' }}
                />
                {/* Score text */}
                <text
                  x={cx} y={cy + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: isHov ? '9.5px' : '8.5px',
                    fontWeight: 500,
                    fill: entity.score != null ? textoSobrePuntuacion(entity.score) : '#FCFDFF',
                    fontFamily: "var(--ira-font-cifra)",
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {entity.score != null ? formatearPuntuacion(entity.score, lang) : '?'}
                </text>

                {/* Etiqueta siempre visible: bandera + apellido */}
                <text
                  x={cx} y={cy + r + 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '7px',
                    fontWeight: 600,
                    fill: 'rgba(255,255,255,0.80)',
                    fontFamily: "var(--ira-font-texto)",
                    pointerEvents: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  {entity.flag} {shortName}
                </text>

                {/* Tooltip completo al hacer hover */}
                {isHov && (
                  <g>
                    <rect
                      x={cx - 58} y={cy - 42}
                      width={116} height={22}
                      rx={5}
                      fill="#112A2A"
                      stroke={color}
                      strokeWidth={0.8}
                    />
                    <text
                      x={cx} y={cy - 30}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: '8.5px',
                        fontWeight: 700,
                        fill: '#fff',
                        fontFamily: "var(--ira-font-texto)",
                        pointerEvents: 'none',
                      }}
                    >
                      {entity.flag} {entity.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda: cada color con su cifra */}
      <div style={{ marginTop: '16px', maxWidth: '420px' }}>
        <IndicadorEscala compacto lang={lang} />
      </div>
    </div>
  );
}
