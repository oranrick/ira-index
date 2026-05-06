// scripts/apply-translations.js
// Aplica translations-output.json a src/data/speeches.js.
// Uso: node scripts/apply-translations.js

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const speechesPath    = join(ROOT, 'src/data/speeches.js');
const translationsPath = join(__dirname, 'translations-output.json');

const translations = JSON.parse(readFileSync(translationsPath, 'utf-8'));
const { speeches }  = await import(pathToFileURL(join(ROOT, 'src/data/speeches.js')).href);

let src = readFileSync(speechesPath, 'utf-8');

// Escapa un string para insertarlo dentro de comillas simples en JS
function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Inserta texto justo después de la primera aparición de `needle` en `haystack`
function insertAfter(haystack, needle, insertion) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) throw new Error(`No encontrado: "${needle.slice(0, 60)}"`);
  return haystack.slice(0, idx + needle.length) + insertion + haystack.slice(idx + needle.length);
}

let ok = 0, errors = 0;

for (const speech of speeches) {
  const t = translations[speech.id];
  if (!t || t.error) { console.log(`  SKIP ${speech.id}`); continue; }

  process.stdout.write(`  ${speech.id.padEnd(36)} → `);
  try {
    // ── Localizar el bloque del discurso en el archivo ──────────────
    // Usamos la apertura del objeto para fijar el offset de búsqueda
    const speechMarker = `id: '${speech.id}'`;
    const speechStart  = src.indexOf(speechMarker);
    if (speechStart === -1) throw new Error(`id '${speech.id}' no encontrado`);

    // Localizar el cierre del objeto (siguiente '  {' al nivel de la lista
    // o fin de archivo). Para acotar la búsqueda usamos el inicio del
    // siguiente discurso (o fin de archivo).
    const nextSpeechMarker = speech.id !== speeches[speeches.length - 1].id
      ? `id: '${speeches[speeches.findIndex(s => s.id === speech.id) + 1].id}'`
      : null;
    const speechEnd = nextSpeechMarker
      ? src.indexOf(nextSpeechMarker, speechStart)
      : src.length;

    let block = src.slice(speechStart, speechEnd);

    // ── title ───────────────────────────────────────────────────────
    const titleNeedle = `title: '${esc(speech.title)}',`;
    block = insertAfter(block, titleNeedle, `\n    titleEn: '${esc(t.titleEn)}',`);

    // ── context ─────────────────────────────────────────────────────
    const ctxNeedle = `context: '${esc(speech.context)}',`;
    block = insertAfter(block, ctxNeedle, `\n    contextEn: '${esc(t.contextEn)}',`);

    // ── iraLabel ────────────────────────────────────────────────────
    const iraLabelNeedle = `iraLabel: '${esc(speech.iraLabel)}',`;
    block = insertAfter(block, iraLabelNeedle, `\n    iraLabelEn: '${esc(t.iraLabelEn)}',`);

    // ── summary ─────────────────────────────────────────────────────
    const summaryNeedle = `summary: '${esc(speech.summary)}',`;
    block = insertAfter(block, summaryNeedle, `\n    summaryEn: '${esc(t.summaryEn)}',`);

    // ── params[n].noteEn ────────────────────────────────────────────
    // Cada param es una línea de la forma:
    //   { name: '...', value: X, [quote: '...',] note: '...' },
    // El note siempre es el último campo y termina en `' },`
    for (let i = 0; i < speech.params.length; i++) {
      const originalNote = speech.params[i].note;
      if (!originalNote) continue;
      const noteEn = t.params?.find(p => p.index === i)?.noteEn;
      if (!noteEn) continue;

      // Buscar la línea del param dentro del bloque
      // El note cierra siempre con `' },` (fin de la línea del param)
      const noteSearch = `note: '${esc(originalNote)}'`;
      const noteIdx    = block.indexOf(noteSearch);
      if (noteIdx === -1) throw new Error(`note[${i}] no encontrado`);

      // Insertar noteEn justo después del `'` de cierre, antes del ` },`
      const afterNote = noteIdx + noteSearch.length;
      block = block.slice(0, afterNote)
        + `, noteEn: '${esc(noteEn)}'`
        + block.slice(afterNote);
    }

    // Sustituir el bloque en el source
    src = src.slice(0, speechStart) + block + src.slice(speechEnd);
    console.log('✓');
    ok++;
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    errors++;
  }
}

writeFileSync(speechesPath, src, 'utf-8');
console.log(`\n  Aplicadas: ${ok}  Errores: ${errors}`);
console.log(`  speeches.js actualizado.\n`);
