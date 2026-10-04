import { describe, expect, it } from 'vitest';
import { filterCommands, getCommandLabel } from '../src/commands/core.js';
import { translateWithDictionary, makeTranslationCacheKey } from '../src/i18n/core.js';
import { cloneFilterState, createModeFilterStore } from '../src/state/store.js';

describe('command core', () => {
  const commands = [
    { name: 'بحث', nameEn: 'Search' },
    { name: 'إعدادات', nameEn: 'Settings' }
  ];
  it('filters commands in both languages', () => {
    expect(filterCommands(commands, 'settings')).toHaveLength(1);
    expect(filterCommands(commands, 'بحث')).toHaveLength(1);
  });
  it('returns the localized label', () => {
    expect(getCommandLabel(commands[0], 'ar')).toBe('بحث');
    expect(getCommandLabel(commands[0], 'en')).toBe('Search');
  });
});

describe('i18n core', () => {
  it('uses dictionary fallback', () => {
    expect(translateWithDictionary('hello', 'ar', { hello: 'مرحبا' })).toBe('مرحبا');
    expect(translateWithDictionary('مرحبا', 'ar', {})).toBe('مرحبا');
  });
  it('creates stable cache keys', () => {
    expect(makeTranslationCacheKey('hello', 'ar')).toBe('hello|ar');
  });
});

describe('state store core', () => {
  const defaults = { type: [], duration: [], date: [], quality: [], feature: [], selectedLinks: {} };
  it('clones mutable filter collections', () => {
    const a = cloneFilterState({ type: ['video'], selectedLinks: { 'link:1': true } }, defaults);
    const b = cloneFilterState(a, defaults);
    a.type.push('news');
    a.selectedLinks['link:2'] = true;
    expect(b.type).toEqual(['video']);
    expect(b.selectedLinks).toEqual({ 'link:1': true });
  });
  it('creates isolated mode stores', () => {
    const store = createModeFilterStore(['web', 'news'], () => ({ items: [] }));
    store.web.items.push('x');
    expect(store.news.items).toEqual([]);
  });
});
