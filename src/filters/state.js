/**
 * Filter state serialization and mode isolation.
 * No DOM dependencies; safe to unit test.
 */
export function snapshotFilterState(filterState, advancedState, newsState, imageState, mapState, selectedLinksState) {
  return {
    sort: filterState.sort || 'date',
    type: [...(filterState.type || [])], duration: [...(filterState.duration || [])],
    date: [...(filterState.date || [])], quality: [...(filterState.quality || [])], feature: [...(filterState.feature || [])],
    advAllWords: advancedState.allWords || '', advExactPhrase: advancedState.exactPhrase || '',
    advAnyWords: advancedState.anyWords || '', advNoneWords: advancedState.noneWords || '', advNumbers: advancedState.numbers || '',
    advSite: advancedState.site || '', advFileType: advancedState.fileType || '', advLastUpdate: advancedState.lastUpdate || '',
    advLang: advancedState.lang || '', advUsageRights: advancedState.usageRights || '',
    newsAllWords: newsState.allWords || '', newsExactPhrase: newsState.exactPhrase || '', newsSite: newsState.site || '',
    newsTime: newsState.time || 'all', newsSort: newsState.sort || 'relevance',
    imgAllWords: imageState.allWords || '', imgSite: imageState.site || '', imgFileType: imageState.fileType || '',
    imgSize: imageState.size || 'all', imgExactWidth: imageState.exactWidth || '', imgExactHeight: imageState.exactHeight || '',
    imgAspect: imageState.aspect || 'all', imgColor: imageState.color || 'all', imgColorType: imageState.colorType || 'all',
    imgType: imageState.type || 'all', imgRights: imageState.rights || 'all', imgTime: imageState.time || 'all',
    imgLang: imageState.lang || '', imgRegion: imageState.region || '', imgSafe: imageState.safe || 'all',
    mapPlace: mapState.place || '', mapNear: mapState.near || '', mapRating: mapState.rating || '0',
    mapHours: mapState.hours || 'all', mapPrice: mapState.price || 'all', mapCategory: mapState.category || '', mapSort: mapState.sort || 'relevance',
    selectedLinks: { ...((selectedLinksState && selectedLinksState.selected) || {}) }
  };
}

export function restoreFilterState(snapshot, defaults) {
  const s = snapshot || {};
  return {
    filterState: {
      sort: s.sort || defaults.sort || 'date', type: [...(s.type || [])], duration: [...(s.duration || [])],
      date: [...(s.date || [])], quality: [...(s.quality || [])], feature: [...(s.feature || [])]
    },
    advancedState: {
      allWords:s.advAllWords||'', exactPhrase:s.advExactPhrase||'', anyWords:s.advAnyWords||'', noneWords:s.advNoneWords||'',
      numbers:s.advNumbers||'', site:s.advSite||'', fileType:s.advFileType||'', lastUpdate:s.advLastUpdate||'', lang:s.advLang||'', usageRights:s.advUsageRights||''
    },
    newsState: { allWords:s.newsAllWords||'', exactPhrase:s.newsExactPhrase||'', site:s.newsSite||'', time:s.newsTime||'all', sort:s.newsSort||'relevance' },
    imageState: { allWords:s.imgAllWords||'', site:s.imgSite||'', fileType:s.imgFileType||'', size:s.imgSize||'all', exactWidth:s.imgExactWidth||'', exactHeight:s.imgExactHeight||'', aspect:s.imgAspect||'all', color:s.imgColor||'all', colorType:s.imgColorType||'all', type:s.imgType||'all', rights:s.imgRights||'all', time:s.imgTime||'all', lang:s.imgLang||'', region:s.imgRegion||'', safe:s.imgSafe||'all' },
    mapState: { place:s.mapPlace||'', near:s.mapNear||'', rating:s.mapRating||'0', hours:s.mapHours||'all', price:s.mapPrice||'all', category:s.mapCategory||'', sort:s.mapSort||'relevance' },
    selectedLinksState: { selected:{...(s.selectedLinks||{})} }
  };
}
