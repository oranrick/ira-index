// Genera src/data/mapaMundo.js: geometría local del mapa (world-atlas 110m, dominio público,
// proyección Natural Earth en un lienzo de 960x500). Sin dependencias externas en ejecución.
// Uso: node scripts/generar-mapa.mjs
import fs from 'node:fs';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath, geoGraticule, geoArea } from 'd3-geo';

const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const fc = feature(topo, topo.objects.countries);
fc.features = fc.features.filter((f) => f.properties.name !== 'Antarctica');
const W = 960, H = 500;
const proj = geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'FeatureCollection', features: fc.features });
const path = geoPath(proj).digits(1);
const r1 = (v) => Math.round(v * 10) / 10;

// Cajas de enfoque a mano (lon/lat) para países con territorios lejanos
const CAJAS = { 'New Zealand': [[166, -47.5], [178.5, -34]], Russia: [[30, 50], [180, 75]] };
// Centros a mano (lon/lat) donde el centroide cae mal
const CENTROS = { Russia: [96, 61], 'United States of America': [-98, 39], 'New Zealand': [172.5, -41.5], Spain: [-3.7, 40.2] };

const paises = {};
for (const f of fc.features) {
  const d = path(f);
  if (!d) continue;
  // El enfoque y el centro usan el polígono más grande (evita Alaska, Hawái, ultramar…)
  let principal = f;
  if (f.geometry.type === 'MultiPolygon') {
    let mejor = null, area = -1;
    for (const coords of f.geometry.coordinates) {
      const g = { type: 'Polygon', coordinates: coords };
      const a = geoArea(g);
      if (a > area) { area = a; mejor = g; }
    }
    principal = { type: 'Feature', geometry: mejor, properties: {} };
  }
  let [[x0, y0], [x1, y1]] = path.bounds(principal);
  const caja = CAJAS[f.properties.name];
  if (caja) {
    const p = proj(caja[0]), q = proj(caja[1]);
    x0 = Math.min(p[0], q[0]); y0 = Math.min(p[1], q[1]); x1 = Math.max(p[0], q[0]); y1 = Math.max(p[1], q[1]);
  }
  const [cx, cy] = CENTROS[f.properties.name] ? proj(CENTROS[f.properties.name]) : path.centroid(principal);
  paises[f.properties.name] = { d, c: [r1(cx), r1(cy)], bb: [r1(x0), r1(y0), r1(x1), r1(y1)] };
}

const salida = `// GENERADO por scripts/generar-mapa.mjs, no editar a mano.
// Geometría de world-atlas (Natural Earth, dominio público), lienzo ${W}x${H}.
export const MAPA_W = ${W};
export const MAPA_H = ${H};
export const ESFERA = ${JSON.stringify(geoPath(proj).digits(1)({ type: 'Sphere' }))};
export const GRATICULA = ${JSON.stringify(geoPath(proj).digits(1)(geoGraticule().step([30, 30])()))};
// nombre en world-atlas -> { d: trazado, c: [x, y] centro, bb: [x0, y0, x1, y1] caja de enfoque }
export const PAISES_GEO = ${JSON.stringify(paises)};
`;
fs.writeFileSync('src/data/mapaMundo.js', salida);
console.log((salida.length / 1024).toFixed(0) + ' KB,', Object.keys(paises).length, 'países');
