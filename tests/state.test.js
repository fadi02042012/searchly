import { describe, expect, it } from 'vitest';
import { createDefaultFilterState } from '../src/state.js';

describe('createDefaultFilterState', () => {
  it('returns the expected safe defaults', () => {
    const state = createDefaultFilterState();
    expect(state.sort).toBe('date');
    expect(state.newsTime).toBe('all');
    expect(state.imgSize).toBe('all');
    expect(state.mapRating).toBe('0');
    expect(state.selectedLinks).toEqual({});
  });

  it('does not share mutable arrays between calls', () => {
    const a = createDefaultFilterState();
    const b = createDefaultFilterState();
    a.type.push('video');
    expect(b.type).toEqual([]);
  });
});
