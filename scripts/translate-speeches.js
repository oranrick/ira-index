// scripts/translate-speeches.js
// Traduce al inglés los campos faltantes de cada discurso en speeches.js.
// Genera scripts/translations-output.json para revisión antes de aplicar.
// Uso: node scripts/translate-speeches.js

import { writeFileSync } from 'node:fs';
import { join, dirname as pathDirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';

const __dirname = pathDirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

config({ path: join(ROOT, '.env.local') });
config({ path: join(ROOT, '.env') });

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY no encontrada en .env.local');
  process.exit(1);
}

// ── Carga speeches.js vía dynamic import ──────────────────────────────────────
const { speeches } = await import(pathToFileURL(join(ROOT, 'src/data/speeches.js')).href);

// ── Prompt de sistema ─────────────────────────────────────────────────────────
const SYSTEM = `You are a professional translator specializing in political discourse analysis.
Translate the given fields from Spanish to English with these rules:

1. DO NOT translate these terms — keep them exactly as-is:
   IRA (Índice de Resonancia Afectiva), Parámetro R, TFG, UCM, CELAC, UNASUR, OTAN,
   names of people (Van Dijk, Fairclough, Wodak, Lakoff, Nussbaum, Ardern, Trump, Petro,
   Sheinbaum, Mujica, Mouffe, Habermas, Esposito, Illouz, Charteris-Black, Cap, Dunmire,
   Martin & White, Reisigl, Chilton, Halliday, Marcus, Charaudeau, Damasio, Goleman, Klemperer),
   rhetorical/linguistic terms already in English (Engage, Entertain, Acknowledge, Counter, Deny,
   Proclaim, Appraisal, Discourse Quality Index, Critical Metaphor Analysis, Affective Intelligence Theory),
   book titles cited in quotes (keep original language),
   country names used as proper nouns.

2. For "iraLabel" values like "Fuertemente empático", "Principalmente polarizante", etc. →
   translate naturally: "Strongly empathic", "Primarily polarizing", "Mixed — empathic in proposal",
   "Mixed with internal tension", "Strongly polarizing", "Maximum empathy".

3. Maintain the academic register and analytical tone of the original.

4. For "summary" and "noteEn" fields: preserve the analytical precision. Do not simplify.

5. Return ONLY a valid JSON object, no markdown, no explanation.`;

// ── Función de traducción ─────────────────────────────────────────────────────
async function translateSpeech(speech) {
  const paramsPayload = speech.params.map((p, i) => ({
    index: i,
    name: p.name,
    note: p.note ?? '',
  }));

  const payload = {
    speechId: speech.id,
    title: speech.title,
    context: speech.context,
    iraLabel: speech.iraLabel,
    summary: speech.summary,
    params: paramsPayload,
  };

  const prompt = `Translate the following fields to English. Return a JSON object with exactly these keys:
- titleEn
- contextEn
- iraLabelEn
- summaryEn
- params: array of objects { index, noteEn } — one per param, in the same order

Input:
${JSON.stringify(payload, null, 2)}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);

  const raw = data.content?.find(b => b.type === 'text')?.text ?? '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n══════════════════════════════════════════════════════');
  console.log('  TRADUCCIÓN AUTOMÁTICA DE DISCURSOS → EN');
  console.log(`  Discursos a procesar: ${speeches.length}`);
  console.log('══════════════════════════════════════════════════════\n');

  const output = {};

  for (const speech of speeches) {
    process.stdout.write(`  ${speech.id.padEnd(36)} → `);
    try {
      const translation = await translateSpeech(speech);
      output[speech.id] = translation;

      const paramCount = translation.params?.length ?? 0;
      console.log(`✓  (${paramCount} params)`);

      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      output[speech.id] = { error: err.message };
    }
  }

  const outPath = join(__dirname, 'translations-output.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n  ✓ Guardado en scripts/translations-output.json`);
  console.log('══════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
