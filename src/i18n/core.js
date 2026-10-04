/** Pure translation helpers. */
export function translateWithDictionary(text, targetLang, dictionary = {}) {
  if (!text || !String(text).trim()) return text;
  const trimmed = String(text).trim();
  const isArabic = /[\u0600-\u06FF]/.test(trimmed);
  if ((targetLang === 'ar' && isArabic) || (targetLang === 'en' && !isArabic)) return trimmed;
  const lower = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(dictionary)) {
    if (lower === key.toLowerCase()) return value;
  }
  return text;
}

export function makeTranslationCacheKey(text, targetLang) {
  return String(text) + '|' + String(targetLang);
}
