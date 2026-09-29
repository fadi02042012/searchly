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
    new Function(source + '\nif (typeof buildAllFiltersGrid === "function") buildAllFiltersGrid();\nif (typeof attachAllFiltersListeners === "function") attachAllFiltersListeners();\nif (typeof updateAllFiltersUI === "function") updateAllFiltersUI();')();
  } catch(error) {
    console.error('searchly: modular loader failed',error);
  }
})();
