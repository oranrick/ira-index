// scripts/reanalyze-corpus.js
// Lee los PDFs del corpus, llama a la API de IRA y guarda en Supabase.
// Uso: node scripts/reanalyze-corpus.js

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { PDFParse } from 'pdf-parse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const API_URL = 'https://ira-index.vercel.app/api/analyze';
const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';

function extractEntity(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('trump'))     return 'Trump';
  if (lower.includes('petro'))     return 'Petro';
  if (lower.includes('sheinbaum')) return 'Sheinbaum';
  if (lower.includes('ardern'))    return 'Ardern';
  if (lower.includes('mujica'))    return 'Mujica';
  return 'Desconocido';
}

const PDFS = [
  { file: '01_Trump_Victoria_2024.pdf',              speechId: 'trump-victoria-2024' },
  { file: '02_Trump_We_Will_Never_Concede_2021.pdf', speechId: 'trump-never-concede-2021' },
  { file: '03_Petro_CELAC_2025.pdf',                 speechId: 'petro-celac-2025' },
  { file: '04_Petro_Pulzo_2025.pdf',                 speechId: 'petro-consulta-2025' },
  { file: '05_Sheinbaum_Victoria.pdf',               speechId: 'sheinbaum-victoria-2024' },
  { file: '06_Sheinbaum_Aranceles_2025.pdf',         speechId: 'sheinbaum-aranceles-2025' },
  { file: '07_Ardern_Christchurch.pdf',              speechId: 'ardern-christchurch-2019' },
  { file: '08_Ardern_ONU.pdf',                       speechId: 'ardern-onu-2022' },
  { file: '09_Mujica_UNASUR.pdf',                    speechId: 'mujica-despedida-2015' },
];

async function extractText(pdfPath) {
  const url = pathToFileURL(pdfPath).href;
  const parser = new PDFParse({ url });
  const result = await parser.getText();
  await parser.destroy();
  return result.text.trim();
}

// Vercel serverless tiene timeout de ~10s; truncamos para evitarlo
const MAX_CHARS = 8000;

async function analyzeText(text, retries = 3) {
  const truncated = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: truncated }),
    });

    if (res.ok) return res.json();

    const body = await res.text();
    if (attempt < retries) {
      process.stdout.write(`(intento ${attempt} fallido, reintentando en 5s) `);
      await new Promise(r => setTimeout(r, 5000));
    } else {
      throw new Error(`API error ${res.status}: ${body}`);
    }
  }
}

async function saveToSupabase(speechId, entity, text, result) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/analyses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      speech_id: speechId,
      entity,
      text,
      ira: result.ira,
      params: result.params,
      summary: result.summary,
      lectura_autor: result.lecturaAutor,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase error ${res.status}: ${body}`);
  }
}

async function main() {
  const filters = process.argv.slice(2).map(a => a.toLowerCase());
  const queue = filters.length
    ? PDFS.filter(({ file, speechId }) => filters.some(f => file.toLowerCase().includes(f) || speechId.includes(f)))
    : PDFS;

  console.log('\n══════════════════════════════════════════════════');
  console.log('  IRA CORPUS RE-ANÁLISIS');
  console.log('══════════════════════════════════════════════════\n');

  for (const { file, speechId } of queue) {
    const pdfPath = join(ROOT, 'speeches', file);
    const entity = extractEntity(file);

    process.stdout.write(`  ${file.padEnd(42)} → `);

    if (!existsSync(pdfPath)) {
      console.log('SKIP (archivo no encontrado)');
      continue;
    }

    try {
      const text = await extractText(pdfPath);
      const result = await analyzeText(text);
      await saveToSupabase(speechId, entity, text, result);
      console.log(`IRA ${result.ira.toFixed(2)}  ✓ guardado`);
      // pausa para no saturar la API entre peticiones
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }

  console.log('\n  Análisis completo.\n');
}

main().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
