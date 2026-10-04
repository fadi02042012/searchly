import { describe, expect, it } from 'vitest';
import { normalizeSmartQuery, scoreSmartMode, detectSearchMode } from '../src/smart/core.js';
import { generateAdvancedLink } from '../src/search/url-core.js';

const rules = {
  settings: { phraseWeight: 3, keywordWeight: 1, tieMinScore: 5 },
  modes: {
    videos: { phrases: ['فيديوهات'], keywords: ['فيديو', 'يوتيوب'] },
    news: { phrases: ['آخر الأخبار'], keywords: ['أخبار', 'خبر'] }
  }
};

const searches = [
  { name: 'Example', base: 'https://example.com/search?q=', suffix: '', group: 'test' }
];

describe('smart search core', () => {
  it('normalizes common Arabic variants', () => {
    expect(normalizeSmartQuery('إختبار؟  مُهم')).toBe('اختبار مهم');
  });

  it('scores matching phrases above keywords', () => {
    const result = scoreSmartMode('آخر الأخبار', 'news', rules.modes.news, rules.settings);
    expect(result.score).toBeGreaterThan(1);
    expect(result.matched).toContain('اخر الاخبار');
  });

  it('detects the highest scoring mode', () => {
    expect(detectSearchMode('أريد آخر الأخبار', rules)?.mode).toBe('news');
    expect(detectSearchMode('شيء عادي', rules)).toBeNull();
  });
});

describe('search URL core', () => {
  it('encodes user input and returns a valid HTTPS URL', () => {
    const url = generateAdvancedLink('hello world & test', 0, searches);
    expect(url).toBe('https://example.com/search?q=hello%20world%20%26%20test');
  });

  it('falls back safely for an invalid provider URL', () => {
    const url = generateAdvancedLink('test', 0, [{ base: 'javascript:', suffix: '' }]);
    expect(url.startsWith('https://')).toBe(true);
  });
});
