// scripts/test-daily-all.mjs
// Harness local del cron consolidado: invoca el handler con req/res simulados.
// Ejecuta el pipeline REAL (scraping + análisis Claude + inserción en Supabase),
// exactamente lo que haría el cron en producción hoy.
// Uso: node --env-file=.env.local scripts/test-daily-all.mjs

import handler from '../api/cron/daily-all.js';

const req = { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } };
const res = {
  statusCode: null,
  status(code) { this.statusCode = code; return this; },
  json(body) {
    console.log(`HTTP ${this.statusCode}`);
    console.log(JSON.stringify(body, null, 2));
  },
};

await handler(req, res);
