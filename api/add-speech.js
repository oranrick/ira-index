// api/add-speech.js
// Endpoint manual para añadir un discurso al feed "Análisis del día".
// Protegido: requiere una sesión Supabase válida (Authorization: Bearer <access_token>).

import { createClient } from '@supabase/supabase-js';
import { runIraAnalysis } from './_lib/iraEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'No autenticado.' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: 'Sesión inválida o expirada.' });
  }

  const { text, entityId, entityName, entityCountry, entityFlag, title, sourceUrl, date } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Texto demasiado corto.' });
  }
  if (!entityId || !entityName) {
    return res.status(400).json({ error: 'Falta entityId o entityName.' });
  }

  try {
    const result = await runIraAnalysis(text, {
      name: entityName,
      category: 'Político',
      situational: title,
    });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        entity_id: entityId,
        entity_name: entityName,
        entity_country: entityCountry || null,
        entity_flag: entityFlag || null,
        source_url: sourceUrl || null,
        title: title || null,
        published_date: date || null,
        text: text.trim(),
        ira: result.ira,
        params: result.params,
        summary: result.summary,
        lectura_autor: result.lecturaAutor,
        origin: 'manual',
      }),
    });

    if (!insertRes.ok) {
      const errBody = await insertRes.text();
      throw new Error(`Supabase insert failed: ${insertRes.status} ${errBody}`);
    }

    const [row] = await insertRes.json();
    res.status(200).json({ inserted: true, row, ira: result.ira });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al analizar o guardar el discurso.' });
  }
}
