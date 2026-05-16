// scripts/update-speeches-js.mjs
// Actualiza iraScore en speeches.js y elimina el param 'Proyección de futuro' (P8).
// Uso: node scripts/update-speeches-js.mjs

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '../src/data/speeches.js');

// Nuevos iraScores calculados con la fórmula actualizada (P1×0.20 + P2×0.20 + P3×0.10 + P4×0.20 + P5×0.20 + P6×0.05 + P7×0.05)
const NEW_SCORES = {
  'trump-victoria-2024':           2.60,
  'trump-never-concede-2021':      1.30,
  'petro-celac-2025':              5.92,
  'petro-consulta-2025':           4.97,
  'sheinbaum-victoria-2024':       8.08,
  'sheinbaum-aranceles-2025':      7.23,
  'ardern-christchurch-2019':      9.07,
  'ardern-onu-2022':               8.90,
  'mujica-despedida-2015':         8.74,
  'sanchez-onu-2024':              6.55,
  'sanchez-barcelona-2026':        5.08,
  'elpais-apaciguamiento-2025':    6.43,
  'elpais-trump-latam-2026':       6.03,
  'rt-lukyanov-globalism-2025':    3.48,
  'rt-timofeev-ukraine-2025':      2.98,
  'telemundo-dhs-tensiones-2025':  5.90,
  'telemundo-daca-contreras-2026': 6.80,
  'foxnews-nss-2025':              4.23,
  'foxnews-bubble-2026':           3.28,
  'publico-hrw-trump-2026':        6.83,
  'publico-guerra-inmigracion-2026': 6.70,
};

let content = readFileSync(FILE, 'utf-8');

// 1. Actualizar iraScore por bloque de speech
let updated = 0;
for (const [id, newScore] of Object.entries(NEW_SCORES)) {
  // Busca el id y luego el iraScore más cercano después
  const idPattern = new RegExp(`(id:\\s*'${id}'[\\s\\S]{0,800}?iraScore:\\s*)([\\d.]+)`, 'm');
  const match = content.match(idPattern);
  if (!match) {
    console.warn(`⚠️  No encontrado: ${id}`);
    continue;
  }
  content = content.replace(idPattern, `$1${newScore}`);
  console.log(`✓ ${id}: → ${newScore}`);
  updated++;
}

// 2. Eliminar líneas del param 'Proyección de futuro'
// Soporta CRLF y LF. Elimina la línea completa que contiene el param P8.
const P8_PATTERN = /[ \t]*\{[\s]*name: 'Proyecci[\s\S]*?\},?\r?\n/g;
const beforeRemoval = content.match(P8_PATTERN)?.length ?? 0;
content = content.replace(P8_PATTERN, '');
console.log(`\n✓ Eliminadas ${beforeRemoval} entradas de 'Proyección de futuro'`);

writeFileSync(FILE, content, 'utf-8');
console.log(`\n✅ speeches.js actualizado (${updated} iraScores, P8 eliminado)\n`);
