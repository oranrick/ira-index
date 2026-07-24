// scripts/reweight-daily.js
// Migra daily_analyses a la fórmula vigente (sin P8): recalcula `ira` desde los
// scores almacenados en `params` y elimina la clave `proyeccion`.
// Equivalente a reweight-params.js, que ya migró la tabla `analyses`.
// Uso: node --env-file=.env.local scripts/reweight-daily.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

const headers = {
  'Content-Type': 'application/json',
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

async function main() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/daily_analyses?select=id,entity_id,published_date,ira,params&order=published_date.asc`,
    { headers },
  );
  if (!res.ok) throw new Error(`fetch ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  console.log(`Filas: ${rows.length}\n`);

  for (const row of rows) {
    const { proyeccion, ...paramsWithoutP8 } = row.params;
    const newIra = Math.round(recalcIRA(paramsWithoutP8) * 100) / 100;

    const upd = await fetch(`${SUPABASE_URL}/rest/v1/daily_analyses?id=eq.${row.id}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ ira: newIra, params: paramsWithoutP8 }),
    });
    if (!upd.ok) throw new Error(`update ${row.id}: ${upd.status} ${await upd.text()}`);

    console.log(`✓ ${row.entity_id.padEnd(11)} ${row.published_date}  ${row.ira} → ${newIra}`);
  }
  console.log('\nListo.');
}

main().catch(err => { console.error(err); process.exit(1); });
