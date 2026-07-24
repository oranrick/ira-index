// api/cron/daily-all-pm.js
// Segunda pasada diaria del dispatcher (20:00 UTC). Vercel colapsa dos entradas
// de cron con el mismo path, así que la pasada vespertina necesita un path
// propio. Misma lógica, mismo dedup — ver daily-all.js.
export { default } from './daily-all.js';
