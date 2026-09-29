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
if (typeof attachAllFiltersListeners === "function") attachAllFiltersListeners();
if (typeof updateAllFiltersUI === "function") updateAllFiltersUI();
if (typeof setupAllFiltersMoreButton === "function") setupAllFiltersMoreButton();
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
if (__searchBtn) __searchBtn.addEventListener('click', () => performSearch());
if (__openFiltersBtn) __openFiltersBtn.addEventListener('click', __openAdvancedFilters);
if (__closeFiltersBtn) __closeFiltersBtn.addEventListener('click', __closeAdvancedFilters);
if (__filterBackdrop) __filterBackdrop.addEventListener('click', __closeAdvancedFilters);
`)();
  } catch(error) {
    console.error('searchly: modular loader failed',error);
  }
})();
