// scripts/sync-speeches-db.mjs
// Sincroniza speeches.js con la generación re-analizada (tabla `analyses`)
// SOLO para los discursos donde ambas generaciones divergen más de 1.0 punto
// de IRA (decisión del autor, jul 2026: "mantener ambas pero corregir grandes
// diferencias"). Actualiza iraScore y los `value:` de los 7 parámetros; las
// notas y citas curadas no se tocan.
// Uso: node --env-file=.env.local scripts/sync-speeches-db.mjs

import { readFileSync, writeFileSync } from 'fs';

const THRESHOLD = 1.0;
const KEYS = ['pronominal', 'metafora', 'dicotomia', 'tono', 'disenso', 'vector', 'coherencia'];
const KEY2NAME = {
  pronominal: 'Uso pronominal inclusivo',
  metafora: 'Tipo de metáfora dominante',
  dicotomia: 'Carga dicotómica',
  tono: 'Tono emocional dominante',
  disenso: 'Reconocimiento del disenso',
  vector: 'Vector de acción',
  coherencia: 'Coherencia afectiva',
};

const res = await fetch(
  `${process.env.SUPABASE_URL}/rest/v1/analyses?select=speech_id,ira,params&speech_id=not.is.null`,
  { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } },
);
const dbRows = await res.json();

const path = new URL('../src/data/speeches.js', import.meta.url);
let src = readFileSync(path, 'utf8');

for (const row of dbRows) {
  const idMark = `id: '${row.speech_id}'`;
  const start = src.indexOf(idMark);
  if (start === -1) continue;
  const nextId = src.indexOf("\n  {\n    id: '", start + 1);
  const end = nextId === -1 ? src.length : nextId;
  let block = src.slice(start, end);

  const current = parseFloat(block.match(/iraScore:\s*([0-9.]+)/)?.[1]);
  if (isNaN(current) || Math.abs(current - row.ira) <= THRESHOLD) {
    console.log(`· ${row.speech_id}: Δ=${Math.abs(current - row.ira).toFixed(2)} ≤ ${THRESHOLD} — sin cambios`);
    continue;
  }

  block = block.replace(/(iraScore:\s*)[0-9.]+/, `$1${row.ira}`);
  for (const k of KEYS) {
    const score = row.params[k]?.score;
    if (typeof score !== 'number') continue;
    const re = new RegExp(`(name:\\s*'${KEY2NAME[k]}',\\s*value:\\s*)[0-9.]+`);
    if (!re.test(block)) { console.warn(`  ⚠ ${row.speech_id}: no encontré el value de ${k}`); continue; }
    block = block.replace(re, `$1${score}`);
  }

  src = src.slice(0, start) + block + src.slice(end);
  console.log(`✓ ${row.speech_id}: ${current} → ${row.ira} (params sincronizados)`);
}

writeFileSync(path, src);
console.log('\nspeeches.js actualizado.');
