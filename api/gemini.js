/**
 * Searchly + Gemini serverless endpoint for Vercel.
 * The Gemini API key stays server-side in process.env.GEMINI_API_KEY.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const query = body.query;
    const language = body.language || 'ar';
    const currentMode = body.currentMode || 'smart';

    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });

    const model = 'gemini-3.6-flash';
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
      'Language: ' + language,
      'Current mode: ' + currentMode,
      'User query: ' + query.trim()
    ].join('\n');

    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, responseMimeType: 'application/json' }
        })
      }
    );

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
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