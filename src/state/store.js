/** Pure state transitions used by the browser store. */
export function cloneFilterState(state, defaults) {
  const source = state || {};
  return {
    ...defaults,
    ...source,
    type: [...(source.type || defaults.type || [])],
    duration: [...(source.duration || defaults.duration || [])],
    date: [...(source.date || defaults.date || [])],
    quality: [...(source.quality || defaults.quality || [])],
    feature: [...(source.feature || defaults.feature || [])],
    selectedLinks: { ...(source.selectedLinks || {}) }
  };
}

export function createModeFilterStore(modes, defaultsFactory) {
  return Object.fromEntries(modes.map(mode => [mode, defaultsFactory()]));
}
