// scripts/reweight-params.js
// Recalcula el IRA con los nuevos pesos sin llamar a la API de Claude.
// Elimina P8 (proyeccion) de params. Actualiza Supabase y muestra los nuevos scores.
// Uso: node scripts/reweight-params.js

const SUPABASE_URL = 'https://jsxmlxuzblezwlaxwpuc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VRQ9UW5FrRcARTfkmiYI4w_etib_jVA';

// Nueva fórmula (P8 eliminado)
const WEIGHTS = {
  pronominal: 0.20,
  metafora:   0.20,
  dicotomia:  0.10,
  tono:       0.20,
  disenso:    0.20,
  vector:     0.05,
  coherencia: 0.05,
};

function recalcIRA(params) {
  return Object.entries(WEIGHTS).reduce((sum, [key, w]) => {
    const val = params[key]?.score ?? params[key] ?? 0;
    return sum + val * w;
  }, 0);
}

async function fetchAll() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/analyses?select=id,speech_id,entity,params`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase fetch error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function updateRow(id, newIra, newParams) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/analyses?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ ira: newIra, params: newParams }),
  });
  if (!res.ok) throw new Error(`Supabase update error ${res.status}: ${await res.text()}`);
}

async function main() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  IRA REWEIGHT — sin P8, nuevos pesos');
  console.log('══════════════════════════════════════════════════\n');

  const rows = await fetchAll();
  console.log(`Filas encontradas: ${rows.length}\n`);

  for (const row of rows) {
    const { id, speech_id, entity, params } = row;

    // Quitar P8
    const { proyeccion, ...paramsWithoutP8 } = params;

    const newIra = Math.round(recalcIRA(paramsWithoutP8) * 100) / 100;

    await updateRow(id, newIra, paramsWithoutP8);

    console.log(`✓ ${entity} (${speech_id})`);
    console.log(`  IRA anterior: ${params.ira ?? '?'} → nuevo: ${newIra}`);
    const s = k => paramsWithoutP8[k]?.score ?? paramsWithoutP8[k] ?? '?';
    console.log(`  Scores: P1=${s('pronominal')} P2=${s('metafora')} P3=${s('dicotomia')} P4=${s('tono')} P5=${s('disenso')} P6=${s('vector')} P7=${s('coherencia')}\n`);
  }

  console.log('══════════════════════════════════════════════════');
  console.log('  Listo. Copia los nuevos iraScore en speeches.js.');
  console.log('══════════════════════════════════════════════════\n');
}

main().catch(err => { console.error(err); process.exit(1); });
