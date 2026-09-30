/**
 * Searchly + Gemini query-understanding endpoint for Vercel.
 * The Gemini API key stays server-side in process.env.GEMINI_API_KEY.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const query = body.query;
    const language = body.language || 'ar';
    const currentMode = body.currentMode || 'smart';

    if (typeof query !== 'string' || !query.trim() || query.length > 4000) {
      return res.status(400).json({ error: 'Invalid query' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });

    const model = 'gemini-3.8-flash';
    const prompt = [
      'You are the query-understanding layer for a web search engine named Searchly.',
      'Analyze the user search query and return ONLY valid JSON.',
      'Do not answer the user. Do not browse. Do not invent facts.',
      '',
      'Allowed mode values: web, news, images, maps, videos, smart.',
      'Return exactly: {"mode":"web|news|images|maps|videos|smart","query":"optimized search query"}',
      '',
      'Rules:',
      '- Preserve the user intent and important terms.',
      '- Make only safe, obvious cleanup/normalization changes.',
      '- Choose news for explicit news/current-events requests.',
      '- Choose images for pictures/photos/wallpapers.',
      '- Choose videos for explicit video/tutorial/watch requests.',
      '- Choose maps for places, nearby businesses, directions, or locations.',
      '- Otherwise choose web.',
      '- If the query is already clear, keep it nearly unchanged.',
      '- JSON only, no markdown.',
      '',
      'Language: ' + String(language).slice(0, 12),
      'Current mode: ' + String(currentMode).slice(0, 12),
      'User query: ' + query.trim()
    ].join('\n');

    async function callGemini() {
      return fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 120,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
      // Gemini transient failures must not break Smart Search.
      if ([408, 429, 500, 502, 503, 504].includes(geminiResponse.status)) {
        return res.status(200).json({
          result: { mode: 'smart', query: query.trim(), filters: null },
          fallback: true
        });
      }
      return res.status(502).json({ error: 'Gemini API request failed' });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim() || '';
    let result;
    try { result = JSON.parse(text); } catch { result = { mode: 'smart', query: query.trim() }; }

    const allowedModes = new Set(['web', 'news', 'images', 'maps', 'videos', 'smart']);
    if (!allowedModes.has(result.mode)) result.mode = 'smart';
    if (typeof result.query !== 'string' || !result.query.trim()) result.query = query.trim();

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Searchly Gemini endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
