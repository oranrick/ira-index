// scripts/translate-segments-es.js
// Añade textEn a cada segmento de los discursos en español.
// Uso: node scripts/translate-segments-es.js

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

config({ path: join(ROOT, '.env.local') });
config({ path: join(ROOT, '.env') });

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error('ANTHROPIC_API_KEY no encontrada'); process.exit(1); }

const { speeches } = await import(pathToFileURL(join(ROOT, 'src/data/speeches.js')).href);

const SYSTEM = `You are a specialist translator for political discourse analysis.
Translate each Spanish segment to English.
Rules:
- Preserve the exact register and rhetorical force of each fragment.
- Keep proper nouns, country names, institution names untranslated.
- Do NOT add explanation or commentary — only the translation of the text.
- Empty strings stay empty strings.
- Return ONLY a valid JSON array: [{"index":0,"textEn":"..."},{"index":1,"textEn":"..."},...]`;

async function translateSegments(speechId, segments) {
  const payload = segments.map((s, i) => ({ index: i, text: s.text || '' }));
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Translate segments for speech "${speechId}":\n${JSON.stringify(payload, null, 2)}`,
      }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);
  const raw = data.content?.find(b => b.type === 'text')?.text ?? '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

let src = readFileSync(join(ROOT, 'src/data/speeches.js'), 'utf-8');
const spanishSpeeches = speeches.filter(s => s.speechLang === 'es');

console.log(`\n${'═'.repeat(54)}`);
console.log('  TRADUCCIÓN SEGMENTOS ES → EN');
console.log(`  Discursos: ${spanishSpeeches.length}`);
console.log(`${'═'.repeat(54)}\n`);

for (const speech of spanishSpeeches) {
  process.stdout.write(`  ${speech.id.padEnd(36)} → `);
  try {
    const translations = await translateSegments(speech.id, speech.segments);

    // Aplicar textEn a cada segmento en el source
    // Localizar el bloque del discurso
    const speechMarker = `id: '${speech.id}'`;
    const speechStart = src.indexOf(speechMarker);
    const nextSpeech = spanishSpeeches[spanishSpeeches.indexOf(speech) + 1]
      ?? speeches[speeches.findIndex(s => s.id === speech.id) + 1];
    const speechEnd = nextSpeech
      ? src.indexOf(`id: '${nextSpeech.id}'`, speechStart)
      : src.length;

    let block = src.slice(speechStart, speechEnd);

    for (const { index, textEn } of translations) {
      if (!textEn?.trim()) continue;
      const original = speech.segments[index]?.text;
      if (!original?.trim()) continue;

      // Buscar `text: '${original}'` dentro del bloque y añadir textEn después
      const needle = `text: '${esc(original)}'`;
      const idx = block.indexOf(needle);
      if (idx === -1) continue;
      block = block.slice(0, idx + needle.length)
        + `,\n        textEn: '${esc(textEn)}'`
        + block.slice(idx + needle.length);
    }

    src = src.slice(0, speechStart) + block + src.slice(speechEnd);
    console.log(`✓  (${translations.length} segmentos)`);
    await new Promise(r => setTimeout(r, 1000));
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

writeFileSync(join(ROOT, 'src/data/speeches.js'), src, 'utf-8');
console.log('\n  speeches.js actualizado.\n');
