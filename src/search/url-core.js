/** Pure URL builders. These functions never touch the DOM. */
export function generateAdvancedLink(query, index = 0, searches = []) {
  const safeIndex = Math.max(0, Math.min(searches.length - 1, Number(index) || 0));
  const search = searches[safeIndex];
  const value = String(query || '').trim();
  if (!search) return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(value);
  try {
    const parsed = new URL(search.base + encodeURIComponent(value) + search.suffix);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('unsupported_protocol');
    return parsed.href;
  } catch {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(value);
  }
}
