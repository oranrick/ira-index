// scripts/translate-lectura-autor.js
// Lee lectura_autor de Supabase, traduce al inglés con Claude,
// y guarda el resultado en lectura_autor_en.
// Uso: node scripts/translate-lectura-autor.js

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: `${__dirname}/../.env.local` });
config({ path: `${__dirname}/../.env` });

const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';
const API_KEY      = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) { console.error('ANTHROPIC_API_KEY no encontrada'); process.exit(1); }

const SYSTEM = `You are a specialist translator for academic discourse analysis texts.
Translate the given Spanish analytical reading into English.
Rules:
- Preserve the academic register and analytical precision of the original.
- Do NOT translate: IRA, Parámetro R, names of theorists or politicians.
- Maintain rhetorical terminology in the target language when an established English equivalent exists.
- Return ONLY the translated text, no quotes, no explanation.`;

async function translate(text) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM,
      messages: [{ role: 'user', content: text }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`);
  return data.content?.find(b => b.type === 'text')?.text?.trim() ?? '';
}

async function main() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/analyses?select=id,speech_id,lectura_autor`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const rows = await res.json();
  if (!Array.isArray(rows)) { console.error('Supabase error:', rows); process.exit(1); }

  console.log(`\n${'═'.repeat(54)}`);
  console.log('  TRADUCCIÓN lectura_autor → EN');
  console.log(`  Filas: ${rows.length}`);
  console.log(`${'═'.repeat(54)}\n`);

  for (const row of rows) {
    process.stdout.write(`  ${row.speech_id.padEnd(34)} → `);
    if (!row.lectura_autor?.trim()) { console.log('SKIP (vacío)'); continue; }

    try {
      const translated = await translate(row.lectura_autor);
      const patch = await fetch(
        `${SUPABASE_URL}/rest/v1/analyses?id=eq.${row.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ lectura_autor_en: translated }),
        }
      );
      if (!patch.ok) throw new Error(`PATCH ${patch.status}: ${await patch.text()}`);
      console.log('✓');
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }
  console.log('\n  Listo.\n');
}

main().catch(err => { console.error(err.message); process.exit(1); });
