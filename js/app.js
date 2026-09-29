/* searchly modular loader */
(async function(){
  'use strict';
  const files=['search-links.js','config.js','state.js','search.js','filters.js','results.js','ui.js','keyboard.js','i18n.js'];
  try {
    const parts=await Promise.all(files.map(async file=>{
      const response=await fetch('./js/'+file,{cache:'no-store'});
      if(!response.ok) throw new Error('Failed to load '+file+' ('+response.status+')');
      return response.text();
    }));
    const source = "const searches = window.searchlySearches; const groupIcons = window.searchlyGroupIcons;\n" + parts.join('\n\n');
    new Function(source + `
if (typeof buildAllFiltersGrid === "function") buildAllFiltersGrid();

document.addEventListener('click', function(e) {
  const btn = e.target.closest('[data-youtube-preset]');
  if (!btn) return;
  e.preventDefault();
  const preset = btn.dataset.youtubePreset || '';
  if (typeof filterState === 'undefined') return;
  if (preset === 'film' || preset === 'channel') {
    filterState.youtubePreset = '';
    filterState.type = Array.from(new Set([...(filterState.type || []).filter(v => v !== 'film' && v !== 'channel'), preset]));
    filterState.videoPlatform = 'youtube';
  } else if (preset) {
    filterState.youtubePreset = preset;
  }
  document.querySelectorAll('[data-youtube-preset]').forEach(b => b.classList.toggle('active-filter', b === btn));
  if (typeof saveCurrentStateToMode === 'function') saveCurrentStateToMode();
  if (typeof setFilterButtonVisuals === 'function') setFilterButtonVisuals(filterState);
  if (typeof updateFilterSummary === 'function') updateFilterSummary();
  if (typeof renderActiveFiltersBar === 'function') renderActiveFiltersBar();
  if (typeof __renderSearchlyPresetsAndActive === 'function') __renderSearchlyPresetsAndActive();
});


function __renderSearchlyPresetsAndActive() {
  if (typeof renderPresets === 'function') renderPresets();
  if (typeof renderActiveFiltersBar === 'function') renderActiveFiltersBar();
}
__renderSearchlyPresetsAndActive();
if (typeof attachAllFiltersListeners === "function") attachAllFiltersListeners();
if (typeof updateAllFiltersUI === "function") updateAllFiltersUI();

document.addEventListener('click', function(e) {
  const sortBtn = e.target.closest('.filter-btn[data-filter-sort]');
  if (!sortBtn) return;
  e.preventDefault();
  e.stopPropagation();

  const value = sortBtn.dataset.filterSort || 'relevance';
  if (typeof filterState !== 'undefined') filterState.sort = value;

  document.querySelectorAll('.filter-btn[data-filter-sort]').forEach(btn => {
    btn.classList.toggle('active-filter', btn === sortBtn);
  });

  if (typeof saveCurrentStateToMode === 'function') saveCurrentStateToMode();
  if (typeof setFilterButtonVisuals === 'function') setFilterButtonVisuals(filterState);
  if (typeof syncAllInputs === 'function') syncAllInputs();
  if (typeof updateFilterSummary === 'function') updateFilterSummary();
  if (typeof renderActiveFiltersBar === 'function') renderActiveFiltersBar();
  if (typeof updateAllFiltersUI === 'function') updateAllFiltersUI();
});
document.addEventListener('click', function(e) {
  const platformBtn = e.target.closest('[data-video-platform]');
  if (!platformBtn) return;
  e.preventDefault();
  e.stopPropagation();
  if (typeof filterState === 'undefined') return;
  filterState.videoPlatform = platformBtn.dataset.videoPlatform || 'youtube';
  document.querySelectorAll('[data-video-platform]').forEach(btn => btn.classList.toggle('active-filter', btn === platformBtn));
  if (typeof saveCurrentStateToMode === 'function') saveCurrentStateToMode();
  if (typeof updateFilterSummary === 'function') updateFilterSummary();
  if (typeof renderActiveFiltersBar === 'function') renderActiveFiltersBar();
});
if (typeof setupAllFiltersMoreButton === "function") setupAllFiltersMoreButton();

const __ytMoreBtn = document.getElementById('youtubeMoreBtn');
if (__ytMoreBtn && !__ytMoreBtn.dataset.bound) {
  __ytMoreBtn.dataset.bound = 'true';
  const extras = Array.from(document.querySelectorAll('.youtube-extra-filter'));
  extras.forEach(b => b.hidden = true);
  __ytMoreBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const open = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!open));
    extras.forEach(b => b.hidden = open);
    this.textContent = open ? '➕ إظهار المزيد' : '➖ إظهار أقل';
  });
}
const __allFiltersSearch = document.getElementById('filterSearchInput');
const __allFiltersMore = document.getElementById('allFiltersMoreBtn');
if (__allFiltersSearch && !__allFiltersSearch.dataset.boundMore) {
  __allFiltersSearch.dataset.boundMore = 'true';
  __allFiltersSearch.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    const items = Array.from(document.querySelectorAll('#allFiltersGrid .all-filter-item'));
    if (q) {
      items.forEach(item => {
        const match = item.textContent.toLowerCase().includes(q);
        item.style.display = match ? '' : 'none';
      });
      if (__allFiltersMore) __allFiltersMore.hidden = true;
    } else {
      items.forEach(item => item.style.display = '');
      if (typeof setupAllFiltersMoreButton === "function") setupAllFiltersMoreButton();
    }
  });
}


const __filterOverlay = document.getElementById('filterOverlay');
const __filterBackdrop = document.getElementById('filterBackdrop');
const __openFiltersBtn = document.getElementById('openFiltersBtn');
const __closeFiltersBtn = document.getElementById('closeFiltersBtn');

function resetAllFilters() {
  // Reset means no active filters; do not restore the newest/date sort.
  const defaults = {sort:'relevance',type:[],duration:[],date:[],quality:[],feature:[],youtubePreset:'',videoPlatform:'youtube'};

  if (typeof filterState !== 'undefined') {
    Object.keys(defaults).forEach(k => {
      filterState[k] = Array.isArray(defaults[k]) ? [...defaults[k]] : defaults[k];
    });
  }

  if (typeof modeFilters !== 'undefined') {
    Object.keys(modeFilters).forEach(mode => {
      modeFilters[mode] = {sort:'relevance',type:[],duration:[],date:[],quality:[],feature:[],youtubePreset:'',videoPlatform:'youtube'};
    });
  }

  if (typeof advancedState !== 'undefined') Object.assign(advancedState, {
    allWords:'', exactPhrase:'', anyWords:'', noneWords:'', numbers:'',
    site:'', fileType:'', lastUpdate:'', lang:'', usageRights:''
  });
  if (typeof newsState !== 'undefined') Object.assign(newsState, {
    allWords:'', exactPhrase:'', site:'', time:'all', sort:'relevance'
  });
  if (typeof imageState !== 'undefined') Object.assign(imageState, {
    allWords:'', site:'', fileType:'', size:'all', exactWidth:'', exactHeight:'',
    aspect:'all', color:'all', colorType:'all', type:'all', rights:'all',
    time:'all', lang:'', region:'', safe:'all'
  });
  if (typeof mapState !== 'undefined') Object.assign(mapState, {
    place:'', near:'', category:'', rating:'0', hours:'all', price:'all', sort:'relevance'
  });
  if (typeof selectedLinksState !== 'undefined') selectedLinksState.selected = {};

  if (typeof saveCurrentStateToMode === 'function') saveCurrentStateToMode();
  if (typeof syncAdvancedInputs === 'function') syncAdvancedInputs();
  if (typeof syncNewsInputs === 'function') syncNewsInputs();
  if (typeof syncImageInputs === 'function') syncImageInputs();
  if (typeof syncMapInputs === 'function') syncMapInputs();
  if (typeof syncAllInputs === 'function') syncAllInputs();
  if (typeof setFilterButtonVisuals === 'function') setFilterButtonVisuals(filterState);
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active-filter'));
  const defaultSort = document.querySelector('.filter-btn[data-filter-sort="relevance"]');
  if (defaultSort) defaultSort.classList.add('active-filter');
  const defaultMapSort = document.querySelector('.map-sort-btn[data-map-sort="relevance"]');
  if (defaultMapSort) defaultMapSort.classList.add('active-filter');
  const defaultRating = document.querySelector('.map-rating-btn[data-map-rating="0"]');
  if (defaultRating) defaultRating.classList.add('active-filter');
  const defaultHours = document.querySelector('.map-hours-btn[data-map-hours="all"]');
  if (defaultHours) defaultHours.classList.add('active-filter');
  const defaultPrice = document.querySelector('.map-price-btn[data-map-price="all"]');
  if (defaultPrice) defaultPrice.classList.add('active-filter');
  if (typeof updateAllFiltersUI === 'function') updateAllFiltersUI();
  if (typeof updateFilterSummary === 'function') updateFilterSummary();
  if (typeof renderActiveFiltersBar === 'function') renderActiveFiltersBar();
  if (typeof __renderSearchlyPresetsAndActive === 'function') __renderSearchlyPresetsAndActive();
  if (typeof renderContextualFilters === 'function') renderContextualFilters();
  if (typeof showToast === 'function') showToast((typeof langStrings !== 'undefined' && langStrings[currentLang]?.toastResetFilters) || '🔄 تم إعادة الضبط');
}

function __openAdvancedFilters() {
  if (typeof openFilterDrawer === "function") {
    openFilterDrawer();
    return;
  }
  if (!__filterOverlay) return;
  __filterOverlay.classList.add('open');
  __filterOverlay.setAttribute('aria-hidden', 'false');
}

function __closeAdvancedFilters() {
  if (!__filterOverlay) return;
  __filterOverlay.classList.remove('open');
  __filterOverlay.setAttribute('aria-hidden', 'true');
}
const __searchBtn = document.getElementById('searchBtn');
if (__searchBtn) __searchBtn.addEventListener('click', () => {
  if (typeof performSearch === 'function') {
    performSearch();
  } else {
    const input = document.getElementById('searchInput');
    const query = input ? input.value.trim() : '';
    if (!query) return;
    const active = document.querySelector('.mode-tab.active');
    const mode = active ? active.dataset.mode : 'web';
    const urls = {
      web: 'https://www.google.com/search?q=',
      news: 'https://www.google.com/search?tbm=nws&q=',
      images: 'https://www.google.com/search?tbm=isch&q=',
      videos: 'https://www.youtube.com/results?search_query=',
      maps: 'https://www.google.com/maps/search/'
    };
    const base = urls[mode] || urls.web;
    window.open(base + encodeURIComponent(query), '_blank');
  }
});
if (__openFiltersBtn) __openFiltersBtn.addEventListener('click', __openAdvancedFilters);
if (__closeFiltersBtn) __closeFiltersBtn.addEventListener('click', __closeAdvancedFilters);
if (__filterBackdrop) __filterBackdrop.addEventListener('click', __closeAdvancedFilters);
`)();
  } catch(error) {
    console.error('searchly: modular loader failed',error);
  }
})();
