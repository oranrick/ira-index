// api/analyze.js
// Análisis IRA de texto libre del usuario.
// Protegido: requiere una sesión Supabase válida (Authorization: Bearer <access_token>) —
// mismo patrón que add-speech.js. El resultado NO se persiste aquí: el frontend
// lo guarda en user_analyses con la sesión del usuario (App.jsx), nunca en la
// tabla curada `analyses`.

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

  const { text, name, category, context: discourseContext } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Texto demasiado corto.' });
  }

  try {
    const result = await runIraAnalysis(text, {
      name,
      category,
      situational: discourseContext,
    });

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al analizar. Intenta de nuevo.' });
  }
}
