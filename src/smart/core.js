/** Pure smart-search engine. No DOM or application state dependencies. */
export function normalizeSmartQuery(query) {
  return String(query || '').toLowerCase()
    .replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه')
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[؟?!.,،؛:()[\]{}"']/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

export function scoreSmartMode(query, mode, config, settings = {}) {
  const q = normalizeSmartQuery(query);
  const matched = [];
  let score = 0;
  const phraseWeight = Number(settings.phraseWeight ?? 3);
  const keywordWeight = Number(settings.keywordWeight ?? 1);
  (config?.phrases || []).forEach(p => {
    const n = normalizeSmartQuery(p);
    if (n && q.includes(n)) { score += phraseWeight; matched.push(n); }
  });
  (config?.keywords || []).forEach(k => {
    const n = normalizeSmartQuery(k);
    if (n && q.includes(n)) { score += keywordWeight; matched.push(n); }
  });
  return { mode, config, score, matched: [...new Set(matched)] };
}

export function detectSearchMode(query, smartRules) {
  const q = normalizeSmartQuery(query);
  if (q.length < 2) return null;
  const settings = smartRules?.settings || {};
  const results = Object.entries(smartRules?.modes || {})
    .map(([mode, config]) => scoreSmartMode(query, mode, config, settings))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!results.length) return null;
  const best = results[0], second = results[1];
  if (second && best.score === second.score && best.score < Number(settings.tieMinScore || 5)) return null;
  return best;
}
