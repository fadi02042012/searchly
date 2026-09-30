/**
 * Searchly + Gemini query-understanding endpoint for Vercel.
 * The Gemini API key stays server-side in process.env.GEMINI_API_KEY.
 */
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 20;
const buckets = new Map();

function getClientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'unknown';
  return ip.slice(0, 80);
}

function rateLimited(key) {
  const now = Date.now();
  const current = buckets.get(key) || [];
  const recent = current.filter(t => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    buckets.set(key, recent);
    return true;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 2000) {
    for (const [k, times] of buckets) {
      if (!times.some(t => now - t < RATE_WINDOW_MS)) buckets.delete(k);
    }
  }
  return false;
}

function fallback(query) {
  return { mode: 'smart', query: query.trim(), filters: null };
}

function sanitizeResult(result, query) {
  const allowedModes = new Set(['web', 'news', 'images', 'maps', 'videos']);
  const safe = result && typeof result === 'object' ? result : {};
  return {
    mode: allowedModes.has(safe.mode) ? safe.mode : 'web',
    query: typeof safe.query === 'string' && safe.query.trim() ? safe.query.trim().slice(0, 4000) : query.trim(),
    filters: safe.filters && typeof safe.filters === 'object' ? safe.filters : null
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const clientKey = getClientKey(req);
  if (rateLimited(clientKey)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  try {
    const body = req.body || {};
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const language = typeof body.language === 'string' ? body.language.slice(0, 12) : 'ar';
    const currentMode = typeof body.currentMode === 'string' ? body.currentMode.slice(0, 12) : 'smart';

    if (!query || query.length > 4000) {
      return res.status(400).json({ error: 'Invalid query' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });

    const prompt = [
      'You are the query-understanding layer for Searchly.',
      'Return ONLY valid JSON. Do not answer the user. Do not browse. Never create URLs or JavaScript.',
      'Classify the query into exactly one mode: web, news, images, maps, videos.',
      'Return: {"mode":"...","query":"...","filters":{...}}.',
      'Preserve intent. Only add filters explicitly implied by the query.',
      'For web filters use only: allWords, exactPhrase, anyWords, noneWords, numbers, site, fileType, lastUpdate, lang, usageRights.',
      'For news filters use only: allWords, exactPhrase, site, time, sort.',
      'For images filters use only: allWords, site, fileType, size, exactWidth, exactHeight, aspect, color, colorType, type, rights, time, lang, region, safe.',
      'For maps filters use only: place, near, rating, hours, price, category, sort.',
      'For videos filters use arrays only: type, duration, date, quality, feature.',
      'Do not invent values. If no filter is clearly implied, return an empty object for that mode.',
      'Use web for ordinary questions/searches, news for explicit current/latest news, images for photos/pictures/wallpapers, maps for places/nearby/directions, videos for explicit video/tutorial/watch requests.',
      'Language: ' + language,
      'Current mode: ' + currentMode,
      'User query: ' + query
    ].join('\n');

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

    async function callGemini() {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 300,
            responseMimeType: 'application/json'
          }
        })
      });
    }

    let response = null;
    let lastError = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await callGemini();
        if (response.ok) break;

        const retryable = [408, 429, 500, 502, 503, 504].includes(response.status);
        if (!retryable || attempt === 2) break;

        const retryAfter = Number(response.headers.get('retry-after'));
        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, 8000)
          : Math.min(1000 * Math.pow(2, attempt), 8000) + Math.floor(Math.random() * 400);

        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        lastError = error;
        if (attempt === 2) break;
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000) + Math.floor(Math.random() * 400);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    if (!response) {
      console.error('Gemini request error:', lastError);
      return res.status(200).json({ result: fallback(query), fallback: true });
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      if ([408, 429, 500, 502, 503, 504].includes(response.status)) {
        return res.status(200).json({ result: fallback(query), fallback: true });
      }
      return res.status(502).json({ error: 'Gemini API request failed' });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim() || '';
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.warn('Gemini returned invalid JSON; using fallback.');
      return res.status(200).json({ result: fallback(query), fallback: true });
    }

    return res.status(200).json({ result: sanitizeResult(parsed, query), fallback: false });
  } catch (error) {
    console.error('Searchly Gemini endpoint error:', error);
    return res.status(200).json({ result: fallback(typeof req.body?.query === 'string' ? req.body.query : ''), fallback: true });
  }
};
