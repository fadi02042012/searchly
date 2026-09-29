
      // =====================================================
      // SEARCH — ⭐ يستخدم الروابط المختارة من searches
      // =====================================================
      function performSearch(term) {
        const query = (term || searchInput.value).trim();
        if (!query) { showToast(langStrings[currentLang].toastEmpty); return; }
        currentQuery = query;
        const mode = getActiveMode();

        // ⭐ إذا كانت هناك روابط مختارة → افتحها كلها
        const selectedLinks = buildSelectedLinksURLs(query);
        if (selectedLinks.length > 0 && (mode === 'videos' || mode === 'smart')) {
          selectedLinks.slice(0, 5).forEach(link => {
            window.open(link.url, '_blank');
          });
          emptyState.style.display = 'none';
          lastUpdated.textContent = new Date().toLocaleString(currentLang === 'ar' ? 'ar' : 'en');
          const modeInfo = searchModesConfig.find(m => m.id === mode);
          if (modeInfo) {
            const label = currentLang === 'ar' ? modeInfo.label : modeInfo.labelEn;
            showToast(`${langStrings[currentLang].toastSearchIn}${label} (${selectedLinks.length})`);
          }
          return;
        }

        const url = buildSearchURL(mode, query);
        window.open(url, '_blank');
        emptyState.style.display = 'none';
        lastUpdated.textContent = new Date().toLocaleString(currentLang === 'ar' ? 'ar' : 'en');
        const modeInfo = searchModesConfig.find(m => m.id === mode);
        if (modeInfo) {
          const label = currentLang === 'ar' ? modeInfo.label : modeInfo.labelEn;
          showToast(langStrings[currentLang].toastSearchIn + label);
        }
      }

      // =====================================================
      // TRANSLATE + SEARCH
      // =====================================================
      async function performTranslateAndSearch() {
        if (isTranslating) return;
        const text = searchInput.value.trim();
        const strings = langStrings[currentLang];
        if (!text) { showToast(strings.toastTranslateEmpty); return; }

        let targetLang;
        if (!langTouched) {
          targetLang = /[\u0600-\u06FF]/.test(text) ? 'en' : 'ar';
          langTarget.value = targetLang;
          langCode.textContent = targetLang.toUpperCase();
          langTool.classList.add('active');
        } else targetLang = langTarget.value;

        isTranslating = true;
        translateBtn.classList.add('loading');

        try {
          const translated = await translateText(text, targetLang);
          const searchTerm = (translated && translated !== text) ? translated : text;
          if (translated && translated !== text) {
            searchInput.value = translated;
            currentQuery = translated;
          } else currentQuery = text;

          const mode = getActiveMode();
          const url = buildSearchURL(mode, searchTerm);
          window.open(url, '_blank');
          const modeInfo = searchModesConfig.find(m => m.id === mode);
          const modeLabel = modeInfo ? (currentLang === 'ar' ? modeInfo.label : modeInfo.labelEn) : '';

          if (translated && translated !== text) {
            showToast(`${strings.toastTranslatedSearched}${modeLabel}`);
          } else {
            showToast(`${strings.toastTranslated} ${targetLang.toUpperCase()} · ${strings.toastSearchIn}${modeLabel}`);
          }
          emptyState.style.display = 'none';
          lastUpdated.textContent = new Date().toLocaleString(currentLang === 'ar' ? 'ar' : 'en');
          updateSmartIndicator();
          renderContextualFilters();
        } catch {
          showToast(strings.toastTranslateError);
        } finally {
          isTranslating = false;
          translateBtn.classList.remove('loading');
        }
      }

      // =====================================================
      // FILTER VISUALS
      // =====================================================
      function setFilterButtonVisuals(state) {
        allFilterBtns.forEach(btn => {
          if (btn.hasAttribute('data-filter')) { btn.classList.toggle('active-filter', state.sort === btn.dataset.filter); return; }
          if (btn.hasAttribute('data-filter-type')) { btn.classList.toggle('active-filter', (state.type || []).includes(btn.dataset.filterType)); return; }
          if (btn.hasAttribute('data-filter-duration')) { btn.classList.toggle('active-filter', (state.duration || []).includes(btn.dataset.filterDuration)); return; }
          if (btn.hasAttribute('data-filter-date')) { btn.classList.toggle('active-filter', (state.date || []).includes(btn.dataset.filterDate)); return; }
          if (btn.hasAttribute('data-filter-quality')) { btn.classList.toggle('active-filter', (state.quality || []).includes(btn.dataset.filterQuality)); return; }
          if (btn.hasAttribute('data-filter-feature')) { btn.classList.toggle('active-filter', (state.feature || []).includes(btn.dataset.filterFeature)); return; }
        });
      }

      function updateFilterSummary() {
        const active = getActiveFilters();
        openFiltersBtn.classList.toggle('has-filters', active.length > 0);
        if (active.length > 0) {
          filterBadge.style.display = 'flex';
          filterBadge.textContent = active.length;
        } else filterBadge.style.display = 'none';
      }

      function updateFilter(element) {
        if (element.hasAttribute('data-filter')) {
          pendingFilterState.sort = element.dataset.filter;
          element.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
          element.classList.add('active-filter');
          return;
        }
        if (element.hasAttribute('data-filter-type')) { toggleMultiFilter(element, 'type', element.dataset.filterType); return; }
        if (element.hasAttribute('data-filter-duration')) { toggleMultiFilter(element, 'duration', element.dataset.filterDuration); return; }
        if (element.hasAttribute('data-filter-date')) { toggleMultiFilter(element, 'date', element.dataset.filterDate); return; }
        if (element.hasAttribute('data-filter-quality')) { toggleMultiFilter(element, 'quality', element.dataset.filterQuality); return; }
        if (element.hasAttribute('data-filter-feature')) { toggleMultiFilter(element, 'feature', element.dataset.filterFeature); return; }
      }

      function toggleMultiFilter(element, category, value) {
        if (!Array.isArray(pendingFilterState[category])) pendingFilterState[category] = [];
        const arr = pendingFilterState[category];
        const idx = arr.indexOf(value);
        if (idx > -1) { arr.splice(idx, 1); element.classList.remove('active-filter'); }
        else { arr.push(value); element.classList.add('active-filter'); }
      }

      // =====================================================
      // SYNC INPUTS
      // =====================================================
      function syncAdvancedInputs() {
        advAllWords.value = advancedState.allWords || '';
        advExactPhrase.value = advancedState.exactPhrase || '';
        advAnyWords.value = advancedState.anyWords || '';
        advNoneWords.value = advancedState.noneWords || '';
        advNumbers.value = advancedState.numbers || '';
        advSite.value = advancedState.site || '';
        advFileType.value = advancedState.fileType || '';
        advLastUpdate.value = advancedState.lastUpdate || '';
        advLang.value = advancedState.lang || '';
        advUsageRights.value = advancedState.usageRights || '';
      }
      function collectAdvancedInputs() {
        advancedState.allWords = advAllWords.value.trim();
        advancedState.exactPhrase = advExactPhrase.value.trim();
        advancedState.anyWords = advAnyWords.value.trim();
        advancedState.noneWords = advNoneWords.value.trim();
        advancedState.numbers = advNumbers.value.trim();
        advancedState.site = advSite.value.trim();
        advancedState.fileType = advFileType.value;
        advancedState.lastUpdate = advLastUpdate.value;
        advancedState.lang = advLang.value;
        advancedState.usageRights = advUsageRights.value;
      }

      function syncNewsInputs() {
        newsAllWords.value = newsState.allWords || '';
        newsExactPhrase.value = newsState.exactPhrase || '';
        newsSite.value = newsState.site || '';
        document.querySelectorAll('.news-time-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.newsTime === newsState.time));
        document.querySelectorAll('.news-sort-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.newsSort === newsState.sort));
      }
      function collectNewsInputs() {
        newsState.allWords = newsAllWords.value.trim();
        newsState.exactPhrase = newsExactPhrase.value.trim();
        newsState.site = newsSite.value.trim();
      }

      function syncImageInputs() {
        const el = (id) => document.getElementById(id);
        if (el('imgExactWidth')) el('imgExactWidth').value = imageState.exactWidth || '';
        if (el('imgExactHeight')) el('imgExactHeight').value = imageState.exactHeight || '';
        document.querySelectorAll('.img-size-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgSize === imageState.size));
        document.querySelectorAll('.img-aspect-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgAspect === imageState.aspect));
        document.querySelectorAll('.img-color-type-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgColorType === imageState.colorType));
        document.querySelectorAll('.img-type-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgType === imageState.type));
        document.querySelectorAll('.img-time-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgTime === imageState.time));
        document.querySelectorAll('.img-rights-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgRights === imageState.rights));
        document.querySelectorAll('.img-safe-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.imgSafe === imageState.safe));
        document.querySelectorAll('.color-swatch').forEach(b => b.classList.toggle('selected', b.dataset.imgColor === imageState.color));
      }

      function collectImageInputs() {
        const el = (id) => document.getElementById(id);
        if (el('imgExactWidth')) imageState.exactWidth = el('imgExactWidth').value.trim();
        if (el('imgExactHeight')) imageState.exactHeight = el('imgExactHeight').value.trim();
      }

      function syncMapInputs() {
        mapPlace.value = mapState.place || '';
        mapNear.value = mapState.near || '';
        mapCategory.value = mapState.category || '';
        document.querySelectorAll('.map-rating-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.mapRating === mapState.rating));
        document.querySelectorAll('.map-hours-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.mapHours === mapState.hours));
        document.querySelectorAll('.map-price-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.mapPrice === mapState.price));
        document.querySelectorAll('.map-sort-btn').forEach(b => b.classList.toggle('active-filter', b.dataset.mapSort === mapState.sort));
      }
      function collectMapInputs() {
        mapState.place = mapPlace.value.trim();
        mapState.near = mapNear.value.trim();
        mapState.category = mapCategory.value;
      }
