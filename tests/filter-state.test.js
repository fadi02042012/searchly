import { describe, expect, it } from 'vitest';
import { snapshotFilterState, restoreFilterState } from '../src/filters/state.js';

describe('filter state persistence', () => {
  const defaults = { sort: 'date' };
  it('round-trips filter state without sharing arrays', () => {
    const snapshot = snapshotFilterState(
      { sort:'date', type:['video'], duration:[], date:[], quality:[], feature:[] },
      { allWords:'hello' }, { time:'all' }, { size:'large' }, { rating:'4' }, { selected:{a:true} }
    );
    const restored = restoreFilterState(snapshot, defaults);
    expect(restored.filterState.type).toEqual(['video']);
    expect(restored.advancedState.allWords).toBe('hello');
    expect(restored.imageState.size).toBe('large');
    expect(restored.mapState.rating).toBe('4');
    expect(restored.selectedLinksState.selected).toEqual({a:true});
    snapshot.type.push('news');
    expect(restored.filterState.type).toEqual(['video']);
  });
});
