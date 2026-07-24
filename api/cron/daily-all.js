// api/cron/daily-all.js
// Cron diario consolidado (ver vercel.json) — reemplaza a daily-milei.js y
// daily-sheinbaum.js. Recorre todos los adaptadores de api/_lib/dailySources.js:
//   1. findLatest() → candidato más reciente de cada fuente oficial
//   2. dedup por source_url contra daily_analyses
//   3. análisis con el motor IRA compartido (api/_lib/iraEngine.js)
//   4. inserción en daily_analyses
//
// Se ejecuta dos veces al día (13:00 y 20:00 UTC) para cubrir los horarios de
// publicación de cada fuente; el dedup hace las dobles pasadas inocuas.
// Presupuesto de tiempo: con maxDuration=300 (vercel.json), deja de lanzar
// análisis nuevos pasado TIME_BUDGET_MS — lo pendiente cae en la siguiente pasada.
//
// Protegido por CRON_SECRET — Vercel inyecta la cabecera Authorization
// en las invocaciones de Cron Jobs cuando esta env var está configurada.

import { runIraAnalysis } from '../_lib/iraEngine.js';
import { SOURCES } from '../_lib/dailySources.js';

const MAX_CHARS = 8000;
const MIN_CHARS = 2000; // menos de ~350 palabras no parece un discurso real
const TIME_BUDGET_MS = 240_000;

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbHeaders = {
    'Content-Type': 'application/json',
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  };

  const started = Date.now();
  const results = [];

  for (const source of SOURCES) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      results.push({ source: source.id, status: 'deferred', reason: 'time budget agotado' });
      continue;
    }

    try {
      const latest = await source.findLatest();
      if (!latest) {
        results.push({ source: source.id, status: 'skipped', reason: 'sin candidato' });
        continue;
      }

      const existingRes = await fetch(
        `${SUPABASE_URL}/rest/v1/daily_analyses?source_url=eq.${encodeURIComponent(latest.sourceUrl)}&select=id`,
        { headers: dbHeaders },
      );
      const existing = await existingRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        results.push({ source: source.id, status: 'skipped', reason: 'already processed', sourceUrl: latest.sourceUrl });
        continue;
      }

      const text = latest.text.slice(0, MAX_CHARS);
      if (text.length < MIN_CHARS) {
        results.push({ source: source.id, status: 'skipped', reason: `texto demasiado corto (${text.length} chars)`, sourceUrl: latest.sourceUrl });
        continue;
      }

      const result = await runIraAnalysis(text, {
        name: source.entity.entity_name,
        category: source.category,
        situational: latest.title,
      });

      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_analyses`, {
        method: 'POST',
        headers: { ...dbHeaders, Prefer: 'return=minimal' },
        body: JSON.stringify({
          ...source.entity,
          source_url: latest.sourceUrl,
          title: latest.title,
          published_date: latest.publishedDate,
          text,
          ira: result.ira,
          params: result.params,
          segments: result.segments,
          summary: result.summary,
          lectura_autor: result.lecturaAutor,
          origin: 'cron',
        }),
      });
      if (!insertRes.ok) {
        throw new Error(`Supabase insert failed: ${insertRes.status} ${await insertRes.text()}`);
      }

      results.push({ source: source.id, status: 'inserted', sourceUrl: latest.sourceUrl, ira: result.ira });
    } catch (e) {
      console.error(`[daily-all] ${source.id}:`, e);
      results.push({ source: source.id, status: 'error', reason: e.message });
    }
  }

  // 200 siempre que el dispatcher haya podido recorrer las fuentes: los errores
  // por fuente quedan detallados en el body y no deben marcar el cron como fallido.
  res.status(200).json({ elapsed_s: Math.round((Date.now() - started) / 1000), results });
}
