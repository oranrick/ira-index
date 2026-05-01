export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Texto demasiado corto.' });
  }

  const SYSTEM = `Eres el motor analítico del IRA (Índice de Resonancia Afectiva), un índice académico que mide la capacidad empática o polarizadora de un discurso político, mediático o institucional.

Analiza el texto en español o inglés. Evalúa los siguientes 8 parámetros. Para cada uno, asigna una puntuación de 0.0 a 10.0 (donde 10 = máxima empatía, 0 = máxima polarización) y una breve descripción interpretativa (2-3 oraciones).

Parámetros:
1. pronominal: Uso pronominal inclusivo — qué pronombres usa y con qué verbos.
2. metafora: Tipo de metáfora dominante — ¿construye comunidad o enemigo?
3. dicotomia: Carga dicotómica — rigidez moral, división en buenos/malos.
4. tono: Tono emocional dominante — ¿qué emoción instala en quien lo recibe?
5. disenso: Reconocimiento del disenso — ¿valida la diferencia o la clausura?
6. vector: Vector de acción — ¿convoca a cooperar o a confrontar?
7. coherencia: Coherencia afectiva — distancia entre lo que dice y lo que hace retóricamente.
8. proyeccion: Proyección de futuro — ¿abre un horizonte compartido o lo clausura?

Responde ÚNICAMENTE con un objeto JSON válido, sin backticks, sin texto adicional:
{
  "params": {
    "pronominal": { "score": 7.2, "desc": "..." },
    "metafora": { "score": 5.1, "desc": "..." },
    "dicotomia": { "score": 6.0, "desc": "..." },
    "tono": { "score": 7.5, "desc": "..." },
    "disenso": { "score": 4.8, "desc": "..." },
    "vector": { "score": 6.2, "desc": "..." },
    "coherencia": { "score": 5.9, "desc": "..." },
    "proyeccion": { "score": 6.7, "desc": "..." }
  },
  "summary": "Síntesis interpretativa de 2-3 oraciones sobre el perfil afectivo del discurso."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM,
        messages: [{ role: 'user', content: `Analiza este texto:\n\n${text}` }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `API error ${response.status}`);
    }
    const raw = data.content?.find(b => b.type === 'text')?.text || '';
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    const scores = Object.values(parsed.params).map(p => p.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    res.status(200).json({ ...parsed, ira: Math.round(avg * 100) / 100 });
  } catch (e) {
    res.status(500).json({ error: 'Error al analizar. Intenta de nuevo.' });
  }
}
