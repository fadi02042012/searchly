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

const __filterOverlay = document.getElementById('filterOverlay');
const __filterBackdrop = document.getElementById('filterBackdrop');
const __openFiltersBtn = document.getElementById('openFiltersBtn');
const __closeFiltersBtn = document.getElementById('closeFiltersBtn');

function __openAdvancedFilters() {
  if (!__filterOverlay) return;
  __filterOverlay.classList.add('open');
  __filterOverlay.setAttribute('aria-hidden', 'false');
  const tabs = document.querySelectorAll('.filter-tab');
  const panels = document.querySelectorAll('.filter-panel');
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  const videoTab = document.querySelector('.filter-tab[data-tab="videos"]');
  const videoPanel = document.querySelector('.filter-panel[data-panel="videos"]');
  const allPanel = document.querySelector('.filter-panel[data-panel="all-filters"]');
  if (videoTab) videoTab.classList.add('active');
  if (videoPanel) videoPanel.classList.add('active');
  if (allPanel) allPanel.classList.add('active');
  if (typeof buildAllFiltersGrid === "function") buildAllFiltersGrid();
  if (typeof attachAllFiltersListeners === "function") attachAllFiltersListeners();
  if (typeof updateAllFiltersUI === "function") updateAllFiltersUI();
}

function __closeAdvancedFilters() {
  if (!__filterOverlay) return;
  __filterOverlay.classList.remove('open');
  __filterOverlay.setAttribute('aria-hidden', 'true');
}
if (__openFiltersBtn) __openFiltersBtn.addEventListener('click', __openAdvancedFilters);
if (__closeFiltersBtn) __closeFiltersBtn.addEventListener('click', __closeAdvancedFilters);
if (__filterBackdrop) __filterBackdrop.addEventListener('click', __closeAdvancedFilters);
`)();
  } catch(error) {
    console.error('searchly: modular loader failed',error);
  }
})();
