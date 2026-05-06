// scripts/onboard-speech.js
// Pipeline completo para incorporar un nuevo discurso al corpus.
// Dado un speech-id (que ya existe en speeches.js) y su PDF, ejecuta:
//   1. Análisis IRA → Supabase (ira, params, summary, lectura_autor)
//   2. Traducción lectura_autor → lectura_autor_en en Supabase
//   3. Traducciones de campos del discurso (titleEn, contextEn, iraLabelEn, summaryEn, params[n].noteEn)
//   4. Traducciones de segmentos (textEn para discursos ES, textEs para discursos EN)
//
// Uso:
//   node scripts/onboard-speech.js <speech-id> <pdf-filename>
//
// Ejemplo:
//   node scripts/onboard-speech.js milei-davos-2024 10_Milei_Davos_2024.pdf

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { config } from 'dotenv';
import { PDFParse } from 'pdf-parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

config({ path: join(ROOT, '.env.local') });
config({ path: join(ROOT, '.env') });

const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';
const VERCEL_API   = 'https://ira-index.vercel.app/api/analyze';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const MAX_PDF_CHARS = 8000;

// ─── Validación de argumentos ─────────────────────────────────────────────────
const [,, SPEECH_ID, PDF_FILE] = process.argv;
if (!SPEECH_ID || !PDF_FILE) {
  console.error('\nUso: node scripts/onboard-speech.js <speech-id> <pdf-filename>\n');
  process.exit(1);
}
if (!ANTHROPIC_KEY) {
  console.error('ANTHROPIC_API_KEY no encontrada en .env.local\n');
  process.exit(1);
}

const PDF_PATH = join(ROOT, 'speeches', PDF_FILE);
if (!existsSync(PDF_PATH)) {
  console.error(`PDF no encontrado: speeches/${PDF_FILE}\n`);
  process.exit(1);
}

// ─── Cargar speeches.js ───────────────────────────────────────────────────────
const { speeches } = await import(pathToFileURL(join(ROOT, 'src/data/speeches.js')).href);
const speech = speeches.find(s => s.id === SPEECH_ID);
if (!speech) {
  console.error(`speech-id '${SPEECH_ID}' no encontrado en speeches.js\n`);
  process.exit(1);
}

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function step(label) {
  console.log(`\n  ── ${label}`);
}

// ─── 1. Análisis IRA → Supabase ───────────────────────────────────────────────
async function runAnalysis() {
  step('Extrayendo texto del PDF…');
  const parser = new PDFParse({ url: pathToFileURL(PDF_PATH).href });
  const { text } = await parser.getText();
  await parser.destroy();
  const truncated = text.trim().slice(0, MAX_PDF_CHARS);
  console.log(`     ${truncated.length} caracteres extraídos`);

  step('Analizando con motor IRA (Vercel)…');
  let result;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(VERCEL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: truncated }),
    });
    if (res.ok) { result = await res.json(); break; }
    const body = await res.text();
    if (attempt < 3) {
      process.stdout.write(`     intento ${attempt} fallido, reintentando en 5s…\n`);
      await new Promise(r => setTimeout(r, 5000));
    } else throw new Error(`API error ${res.status}: ${body}`);
  }
  console.log(`     IRA: ${result.ira.toFixed(2)}`);

  step('Guardando en Supabase…');
  // Borrar entrada previa si existe (upsert manual para evitar duplicados)
  await fetch(`${SUPABASE_URL}/rest/v1/analyses?speech_id=eq.${SPEECH_ID}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });

  const entity = speech.entityName.split(' ').pop(); // apellido como entity
  const insert = await fetch(`${SUPABASE_URL}/rest/v1/analyses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      speech_id: SPEECH_ID,
      entity,
      text: text.trim(),
      ira: result.ira,
      params: result.params,
      summary: result.summary,
      lectura_autor: result.lecturaAutor,
    }),
  });
  const [row] = await insert.json();
  if (!row?.id) throw new Error('Supabase insert failed');
  console.log(`     Guardado (id: ${row.id})`);
  return row;
}

// ─── 2. Traducir lectura_autor → lectura_autor_en ─────────────────────────────
async function translateLecturaAutor(rowId, lecturaAutor) {
  step('Traduciendo Parámetro R → EN…');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: 'Translate the following Spanish academic discourse analysis text to English. Preserve register, precision, and keep proper nouns untranslated. Return ONLY the translation.',
      messages: [{ role: 'user', content: lecturaAutor }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message);
  const translated = data.content?.find(b => b.type === 'text')?.text?.trim();

  await fetch(`${SUPABASE_URL}/rest/v1/analyses?id=eq.${rowId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ lectura_autor_en: translated }),
  });
  console.log('     ✓');
}

// ─── 3. Traducir campos del discurso → *En ────────────────────────────────────
async function translateSpeechFields() {
  step('Traduciendo campos del discurso (title, context, iraLabel, summary, params.note)…');
  const payload = {
    speechId: SPEECH_ID,
    title: speech.title,
    context: speech.context,
    iraLabel: speech.iraLabel,
    summary: speech.summary,
    params: speech.params.map((p, i) => ({ index: i, name: p.name, note: p.note ?? '' })),
  };

  const SYSTEM = `You are a professional translator for political discourse analysis. Translate fields to English.
Do NOT translate: IRA, Parámetro R, names of theorists/politicians, CELAC, UNASUR, TFG, UCM.
Return ONLY valid JSON with keys: titleEn, contextEn, iraLabelEn, summaryEn, params:[{index,noteEn}]`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(payload, null, 2) }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message);
  const raw = data.content?.find(b => b.type === 'text')?.text ?? '';
  const t = JSON.parse(raw.replace(/```json|```/g, '').trim());

  // Aplicar al speeches.js
  let src = readFileSync(join(ROOT, 'src/data/speeches.js'), 'utf-8');
  const speechStart = src.indexOf(`id: '${SPEECH_ID}'`);
  const idx = speeches.findIndex(s => s.id === SPEECH_ID);
  const next = speeches[idx + 1];
  const speechEnd = next ? src.indexOf(`id: '${next.id}'`, speechStart) : src.length;
  let block = src.slice(speechStart, speechEnd);

  const insert = (needle, addition) => {
    const i = block.indexOf(needle);
    if (i === -1) throw new Error(`No encontrado: "${needle.slice(0,40)}"`);
    block = block.slice(0, i + needle.length) + addition + block.slice(i + needle.length);
  };

  insert(`title: '${esc(speech.title)}',`,   `\n    titleEn: '${esc(t.titleEn)}',`);
  insert(`context: '${esc(speech.context)}',`, `\n    contextEn: '${esc(t.contextEn)}',`);
  insert(`iraLabel: '${esc(speech.iraLabel)}',`, `\n    iraLabelEn: '${esc(t.iraLabelEn)}',`);
  insert(`summary: '${esc(speech.summary)}',`,  `\n    summaryEn: '${esc(t.summaryEn)}',`);

  for (const { index, noteEn } of t.params) {
    const note = speech.params[index]?.note;
    if (!note || !noteEn) continue;
    const needle = `note: '${esc(note)}'`;
    const ni = block.indexOf(needle);
    if (ni === -1) continue;
    block = block.slice(0, ni + needle.length)
      + `, noteEn: '${esc(noteEn)}'`
      + block.slice(ni + needle.length);
  }

  writeFileSync(join(ROOT, 'src/data/speeches.js'), src.slice(0, speechStart) + block + src.slice(speechEnd), 'utf-8');
  console.log('     ✓');
}

// ─── 4. Traducir segmentos ────────────────────────────────────────────────────
async function translateSegments() {
  const isEs = speech.speechLang === 'es';
  const targetField = isEs ? 'textEn' : 'textEs';
  const dir = isEs ? 'ES→EN' : 'EN→ES';
  step(`Traduciendo segmentos (${dir})…`);

  const SYSTEM = isEs
    ? 'Translate each Spanish segment to English. Preserve register. Return ONLY a JSON array: [{"index":0,"textEn":"..."},...]'
    : 'Translate each English segment to Spanish. Preserve register. Return ONLY a JSON array: [{"index":0,"textEs":"..."},...]';

  const payload = speech.segments.map((s, i) => ({ index: i, text: s.text || '' }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(payload, null, 2) }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message);
  const raw = data.content?.find(b => b.type === 'text')?.text ?? '';
  const translations = JSON.parse(raw.replace(/```json|```/g, '').trim());

  let src = readFileSync(join(ROOT, 'src/data/speeches.js'), 'utf-8');
  const speechStart = src.indexOf(`id: '${SPEECH_ID}'`);
  const idx = speeches.findIndex(s => s.id === SPEECH_ID);
  const next = speeches[idx + 1];
  const speechEnd = next ? src.indexOf(`id: '${next.id}'`, speechStart) : src.length;
  let block = src.slice(speechStart, speechEnd);

  for (const item of translations) {
    const translated = item[targetField];
    if (!translated?.trim()) continue;
    const original = speech.segments[item.index]?.text;
    if (!original?.trim()) continue;
    const needle = `text: '${esc(original)}'`;
    const ni = block.indexOf(needle);
    if (ni === -1) continue;
    block = block.slice(0, ni + needle.length)
      + `,\n        ${targetField}: '${esc(translated)}'`
      + block.slice(ni + needle.length);
  }

  writeFileSync(join(ROOT, 'src/data/speeches.js'), src.slice(0, speechStart) + block + src.slice(speechEnd), 'utf-8');
  console.log(`     ✓ (${translations.length} segmentos)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(56)}`);
console.log(`  ONBOARDING: ${SPEECH_ID}`);
console.log(`  PDF: ${PDF_FILE}`);
console.log(`${'═'.repeat(56)}`);

try {
  const row = await runAnalysis();
  await translateLecturaAutor(row.id, row.lectura_autor);
  await translateSpeechFields();
  await translateSegments();

  console.log(`\n${'═'.repeat(56)}`);
  console.log(`  ✓ Discurso '${SPEECH_ID}' incorporado completamente.`);
  console.log(`  Recuerda hacer git add + commit cuando hayas revisado.\n`);
} catch (err) {
  console.error(`\n  ERROR: ${err.message}\n`);
  process.exit(1);
}
