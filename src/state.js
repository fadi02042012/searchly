/**
 * Searchly state primitives.
 * Pure defaults and storage access live here so app.js stays focused on orchestration.
 */
export function createDefaultFilterState() {
  return {
    sort: 'date',
    type: [], duration: [], date: [], quality: [], feature: [],
    advAllWords: '', advExactPhrase: '', advAnyWords: '', advNoneWords: '',
    advNumbers: '', advSite: '', advFileType: '', advLastUpdate: '',
    advLang: '', advUsageRights: '',
    newsAllWords: '', newsExactPhrase: '', newsSite: '',
    newsTime: 'all', newsSort: 'relevance',
    imgAllWords: '', imgSite: '', imgFileType: '',
    imgSize: 'all', imgExactWidth: '', imgExactHeight: '', imgAspect: 'all',
    imgColor: 'all', imgColorType: 'all', imgType: 'all', imgRights: 'all',
    imgTime: 'all', imgLang: '', imgRegion: '', imgSafe: 'all',
    mapPlace: '', mapNear: '', mapRating: '0', mapHours: 'all',
    mapPrice: 'all', mapCategory: '', mapSort: 'relevance',
    selectedLinks: {}
  };
}

export function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
