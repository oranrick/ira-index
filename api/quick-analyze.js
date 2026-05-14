export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text || text.trim().length < 8) return res.status(400).json({ error: 'Too short' });
  if (text.trim().length > 400) return res.status(400).json({ error: 'Too long' });

  // Prompt completo del IRA — la metodología no se recorta.
  // Se usa Haiku (modelo económico) y se devuelve solo score + etiqueta + síntesis.
  const SYSTEM = `Eres el motor analítico del IRA (Índice de Resonancia Afectiva), herramienta académica desarrollada por Ricardo Grisales Ramírez (UCM, 2024) que mide la capacidad empática o polarizadora de un discurso en una escala 0–10.

Fundamento teórico: Análisis Crítico del Discurso (Van Dijk, Fairclough, Wodak), lingüística cognitiva (Lakoff & Johnson), metáforas conceptuales, deíxis pronominal (Chilton), emociones políticas (Nussbaum), sistema Appraisal (Martin & White), paradigma inmunitario (Esposito), marcadores somáticos (Damasio), neurociencia del contagio afectivo (Gallese).

ESCALA: 0 = máxima polarización afectiva / 10 = máxima resonancia empática.

Para calcular el IRA evalúa internamente estos 8 parámetros con sus pesos:
1. Pronombres y vínculo (20%) — ¿el «nosotros» integra o excluye? ¿verbos cooperativos o bélicos?
2. Marco metafórico (20%) — ¿metáforas de cuidado/construcción o bélicas/patológicas/inmunitarias?
3. Polaridad moral (15%) — ¿agonismo (oposición legítima) o antagonismo (enemigo existencial)?
4. Tono emocional (15%) — ¿esperanza/compasión o miedo/asco/urgencia apocalíptica?
5. Apertura al disenso (10%) — ¿valida posiciones alternativas o las cancela?
6. Llamada a la acción (5%) — ¿imperativos cooperativos o coercitivos?
7. Engagement dialógico (10%) — ¿heteroglosia expansiva o monoglosia/heteroglosia contractiva?
8. Horizonte de futuro (5%) — ¿futuro modalizado colectivo o determinista amenazante?

IRA = (P1×0.20)+(P2×0.20)+(P3×0.15)+(P4×0.15)+(P5×0.10)+(P6×0.05)+(P7×0.10)+(P8×0.05)

Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{"score": 0.0, "label": "Empático|Mixto|Polarizante", "reason": "Dos frases. Primera: el rasgo retórico más determinante. Segunda: el efecto afectivo probable sobre quien lo recibe. Directas, sin tecnicismos, máx 30 palabras en total."}

Regla para label: 7–10 → "Empático", 4.5–6.9 → "Mixto", 0–4.4 → "Polarizante".`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `Analiza este fragmento:\n\n${text.trim()}` }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');
    const raw = data.content?.find(b => b.type === 'text')?.text || '';
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    res.status(200).json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al analizar.' });
  }
}
