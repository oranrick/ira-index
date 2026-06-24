import { runIraAnalysis } from './_lib/iraEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Persist to Supabase (silent fail)
    try {
      const dbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          text,
          ira: Math.round(result.ira * 100) / 100,
          params: result.params,
          summary: result.summary,
          lectura_autor: result.lecturaAutor,
        }),
      });
      if (!dbRes.ok) {
        const errBody = await dbRes.text();
        console.error('Supabase insert failed:', dbRes.status, errBody);
      }
    } catch (dbError) {
      console.error('Supabase insert error:', dbError);
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al analizar. Intenta de nuevo.' });
  }
}
