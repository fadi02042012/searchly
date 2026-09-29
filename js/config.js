// =====================================================
      // STATE
      // =====================================================
      let currentLang = 'ar';
      let isDark = false;
      let isTranslating = false;
      let langTouched = false;
      let currentQuery = '';
      let cmdActiveIndex = 0;

      function getActiveMode() {
        const activeTab = document.querySelector('.mode-tab.active');
        if (activeTab && activeTab.dataset.mode) return activeTab.dataset.mode;
        const anyTab = document.querySelector('.mode-tab');
        return anyTab ? anyTab.dataset.mode : 'web';
      }

      function setActiveMode(mode) {
        document.querySelectorAll('.mode-tab').forEach(tab => {
          tab.classList.toggle('active', tab.dataset.mode === mode);
        });
      }

      function createDefaultFilterState() {
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
          selectedLinks: {}  // ⭐ مفاتيح الروابط المختارة من searches
        };
      }

      let modeFilters = {
        smart: createDefaultFilterState(),
        web: createDefaultFilterState(),
        news: createDefaultFilterState(),
        images: createDefaultFilterState(),
        maps: createDefaultFilterState(),
        videos: createDefaultFilterState()
      };

      let filterState = createDefaultFilterState();
      let advancedState = { allWords: '', exactPhrase: '', anyWords: '', noneWords: '', numbers: '', site: '', fileType: '', lastUpdate: '', lang: '', usageRights: '' };
      let newsState = { allWords: '', exactPhrase: '', site: '', time: 'all', sort: 'relevance' };
      let imageState = {
        allWords: '', site: '', fileType: '',
        size: 'all', exactWidth: '', exactHeight: '', aspect: 'all',
        color: 'all', colorType: 'all', type: 'all', rights: 'all',
        time: 'all', lang: '', region: '', safe: 'all'
      };
      let mapState = { place: '', near: '', rating: '0', hours: 'all', price: 'all', category: '', sort: 'relevance' };
      let selectedLinksState = { selected: {} };  // ⭐ روابط searches المختارة

      let presets = [];
      let pendingFilterState = createDefaultFilterState();

      // =====================================================
      // SAVE / LOAD STATE
      // =====================================================
      function saveStateToMode(mode) {
        if (!mode || !modeFilters[mode]) return;
        modeFilters[mode] = {
          sort: filterState.sort,
          type: [...(filterState.type || [])],
          duration: [...(filterState.duration || [])],
          date: [...(filterState.date || [])],
          quality: [...(filterState.quality || [])],
          feature: [...(filterState.feature || [])],
          advAllWords: advancedState.allWords, advExactPhrase: advancedState.exactPhrase,
          advAnyWords: advancedState.anyWords, advNoneWords: advancedState.noneWords,
          advNumbers: advancedState.numbers, advSite: advancedState.site,
          advFileType: advancedState.fileType, advLastUpdate: advancedState.lastUpdate,
          advLang: advancedState.lang, advUsageRights: advancedState.usageRights,
          newsAllWords: newsState.allWords, newsExactPhrase: newsState.exactPhrase,
          newsSite: newsState.site, newsTime: newsState.time, newsSort: newsState.sort,
          imgAllWords: imageState.allWords, imgSite: imageState.site, imgFileType: imageState.fileType,
          imgSize: imageState.size, imgExactWidth: imageState.exactWidth, imgExactHeight: imageState.exactHeight,
          imgAspect: imageState.aspect, imgColor: imageState.color, imgColorType: imageState.colorType,
          imgType: imageState.type, imgRights: imageState.rights, imgTime: imageState.time,
          imgLang: imageState.lang, imgRegion: imageState.region, imgSafe: imageState.safe,
          mapPlace: mapState.place, mapNear: mapState.near, mapRating: mapState.rating,
          mapHours: mapState.hours, mapPrice: mapState.price,
          mapCategory: mapState.category, mapSort: mapState.sort,
          selectedLinks: JSON.parse(JSON.stringify(selectedLinksState.selected || {}))
        };
        localStorage.setItem('sh_mode_filters', JSON.stringify(modeFilters));
      }

      function saveCurrentStateToMode() {
        saveStateToMode(getActiveMode());
      }

      function loadStateFromMode(modeId) {
        const s = modeFilters[modeId] || createDefaultFilterState();
        filterState = {
          sort: s.sort || 'date',
          type: [...(s.type || [])], duration: [...(s.duration || [])],
          date: [...(s.date || [])], quality: [...(s.quality || [])],
          feature: [...(s.feature || [])]
        };
        advancedState = {
          allWords: s.advAllWords || '', exactPhrase: s.advExactPhrase || '',
          anyWords: s.advAnyWords || '', noneWords: s.advNoneWords || '',
          numbers: s.advNumbers || '', site: s.advSite || '',
          fileType: s.advFileType || '', lastUpdate: s.advLastUpdate || '',
          lang: s.advLang || '', usageRights: s.advUsageRights || ''
        };
        newsState = {
          allWords: s.newsAllWords || '', exactPhrase: s.newsExactPhrase || '',
          site: s.newsSite || '', time: s.newsTime || 'all', sort: s.newsSort || 'relevance'
        };
        imageState = {
          allWords: s.imgAllWords || '', site: s.imgSite || '', fileType: s.imgFileType || '',
          size: s.imgSize || 'all', exactWidth: s.imgExactWidth || '', exactHeight: s.imgExactHeight || '',
          aspect: s.imgAspect || 'all', color: s.imgColor || 'all', colorType: s.imgColorType || 'all',
          type: s.imgType || 'all', rights: s.imgRights || 'all', time: s.imgTime || 'all',
          lang: s.imgLang || '', region: s.imgRegion || '', safe: s.imgSafe || 'all'
        };
        mapState = {
          place: s.mapPlace || '', near: s.mapNear || '', rating: s.mapRating || '0',
          hours: s.mapHours || 'all', price: s.mapPrice || 'all',
          category: s.mapCategory || '', sort: s.mapSort || 'relevance'
        };
        selectedLinksState = { selected: s.selectedLinks || {} };
      }

      function loadModeFilters() {
        const saved = localStorage.getItem('sh_mode_filters');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
              Object.keys(modeFilters).forEach(k => {
                modeFilters[k] = { ...createDefaultFilterState(), ...(parsed[k] || {}) };
                ['type', 'duration', 'date', 'quality', 'feature'].forEach(mk => {
                  if (!Array.isArray(modeFilters[k][mk])) modeFilters[k][mk] = [];
                });
                if (!modeFilters[k].selectedLinks || typeof modeFilters[k].selectedLinks !== 'object') {
                  modeFilters[k].selectedLinks = {};
                }
              });
            }
          } catch(e) {}
        }
      }
      loadModeFilters();

      function switchMode(newMode) {
        const oldMode = getActiveMode();
        if (oldMode === newMode) return;
        saveStateToMode(oldMode);
        setActiveMode(newMode);
        localStorage.setItem('sh_mode', newMode);
        loadStateFromMode(newMode);
        renderContextualFilters();
        syncFilterTabWithMode(newMode);
        syncAllInputs();
        setFilterButtonVisuals(filterState);
        updateFilterSummary();
        renderActiveFiltersBar();
        updateSmartIndicator();
        updateAllFiltersUI();
      }

      function syncAllInputs() {
        syncAdvancedInputs();
        syncNewsInputs();
        syncImageInputs();
        syncMapInputs();
      }
