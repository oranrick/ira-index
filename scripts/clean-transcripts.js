// scripts/clean-transcripts.js
// Limpia los textos en Supabase: elimina artefactos de PDF/YouTube,
// palabras sin sentido, ceremonias de presentación, y separa en párrafos.
// Uso: ANTHROPIC_API_KEY=<key> node scripts/clean-transcripts.js
//      ANTHROPIC_API_KEY=<key> node scripts/clean-transcripts.js trump-victoria-2024

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: `${__dirname}/../.env.local` });
config({ path: `${__dirname}/../.env` });

const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';

const CLEAN_PROMPT = `Eres un editor especializado en transcripciones de discursos políticos.
Recibirás el texto bruto extraído de un PDF. Tu tarea es limpiar y estructurar ese texto.

REGLAS ESTRICTAS:
1. Elimina artefactos de extracción de PDF: números de página, encabezados/pies de página repetidos, marcas de tiempo (ej: "00:01:23"), la cadena "segundos" suelta.
2. Elimina frases de protocolo ajenas al discurso: "adelante señora presidenta", "tiene la palabra", "aplausos", "(aplausos)", "[aplausos]", "señoras y señores", presentaciones del maestro de ceremonias, etc.
3. Elimina metadatos del documento: "Corpus IRA · Discurso X/X", "Fuente:", "Traducción:", "UCM 2024", URLs, nombres de archivo.
4. Corrige errores de OCR evidentes: palabras cortadas a mitad, caracteres extraños, guiones de final de línea que rompen palabras.
5. Separa el texto en párrafos lógicos usando doble salto de línea (\\n\\n). Cada cambio de idea o pausa natural del discurso es un párrafo nuevo.
6. NO traduzcas, NO resumas, NO parafrasees. Conserva las palabras exactas del orador.
7. Conserva el idioma original del discurso (español o inglés).

Devuelve ÚNICAMENTE el texto limpio, sin comentarios, sin explicaciones, sin comillas envolventes.`;

async function cleanText(rawText, speechId) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY no encontrada');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: CLEAN_PROMPT,
      messages: [{ role: 'user', content: `Limpia este texto del discurso "${speechId}":\n\n${rawText}` }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);
  return data.content?.find(b => b.type === 'text')?.text?.trim() ?? '';
}

async function updateSupabase(id, cleanedText) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/analyses?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ text: cleanedText }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase PATCH error ${res.status}: ${body}`);
  }
}

async function main() {
  const filter = process.argv[2];

  // Fetch todas las filas (o filtradas)
  const url = filter
    ? `${SUPABASE_URL}/rest/v1/analyses?select=id,speech_id,text&speech_id=eq.${filter}`
    : `${SUPABASE_URL}/rest/v1/analyses?select=id,speech_id,text`;

  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const rows = await res.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    console.error('No se encontraron filas. ¿speech_id correcto?');
    process.exit(1);
  }

  console.log(`\n${'═'.repeat(54)}`);
  console.log('  LIMPIEZA DE TRANSCRIPCIONES');
  console.log(`  Filas a procesar: ${rows.length}`);
  console.log(`${'═'.repeat(54)}\n`);

  for (const row of rows) {
    process.stdout.write(`  ${row.speech_id.padEnd(34)} → `);

    if (!row.text?.trim()) {
      console.log('SKIP (sin texto)');
      continue;
    }

    try {
      const cleaned = await cleanText(row.text, row.speech_id);
      const before = row.text.length;
      const after = cleaned.length;
      await updateSupabase(row.id, cleaned);
      console.log(`✓  ${before} → ${after} chars`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }

  console.log('\n  Limpieza completa.\n');
}

main().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
