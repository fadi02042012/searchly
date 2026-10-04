/** Searchly extracted module. Logic preserved from app.js. */

function getActiveFilters() {
        const active = [];
        if (filterState.sort && filterState.sort !== 'date') {
          active.push({ key: 'sort', value: filterState.sort, label: 'ترتيب: ' + (filterLabels[currentLang].sort?.[filterState.sort] || filterState.sort), type: 'simple', multi: false });
        }
        (filterState.type || []).forEach(v => active.push({ key: 'type', value: v, label: 'نوع: ' + (filterLabels[currentLang].type?.[v] || v), type: 'simple', multi: true }));
        // 🎯 اعرض الفلتر التعليمي كفلتر مركّب واحد بدل شريحتين منفصلتين.
        const hasLong = (filterState.duration || []).includes('long');
        const hasViews = filterState.sort === 'views';
        if(hasLong && hasViews){
          active.push({
            key: 'instructionalCombo',
            value: 'long-views',
            label: currentLang === 'ar' ? '🏆 أكثر من 20 دقيقة + الأعلى مشاهدة' : '🏆 Over 20 min + Most viewed',
            type: 'simpleCombo'
          });
        } else {
          (filterState.duration || []).forEach(v => active.push({ key: 'duration', value: v, label: (filterLabels[currentLang].duration?.[v] || v), type: 'simple', multi: true }));
        }
        (filterState.date || []).forEach(v => active.push({ key: 'date', value: v, label: 'تاريخ: ' + (filterLabels[currentLang].date?.[v] || v), type: 'simple', multi: true }));
        (filterState.quality || []).forEach(v => active.push({ key: 'quality', value: v, label: 'جودة: ' + (filterLabels[currentLang].quality?.[v] || v), type: 'simple', multi: true }));
        (filterState.feature || []).forEach(v => active.push({ key: 'feature', value: v, label: 'ميزة: ' + (filterLabels[currentLang].feature?.[v] || v), type: 'simple', multi: true }));

        const advMap = { allWords: 'ويب: كلمات', exactPhrase: 'ويب: عبارة', anyWords: 'ويب: أي كلمة', noneWords: 'ويب: استثناء', numbers: 'ويب: أرقام', site: 'ويب: موقع', fileType: 'ويب: نوع ملف', lastUpdate: 'ويب: تاريخ', lang: 'ويب: لغة', usageRights: 'ويب: حقوق' };
        Object.entries(advancedState).forEach(([k, v]) => {
          if (!v) return;
          active.push({ key: k, value: v, label: (advMap[k] || k) + ': ' + v, type: 'advanced' });
        });

        const newsMap = { allWords: 'أخبار: كلمات', exactPhrase: 'أخبار: عبارة', site: 'أخبار: موقع', time: 'أخبار: وقت', sort: 'أخبار: ترتيب' };
        Object.entries(newsState).forEach(([k, v]) => {
          if (!v || v === 'all') return;
          if (k === 'sort' && v === 'relevance') return;
          active.push({ key: k, value: v, label: (newsMap[k] || k) + ': ' + v, type: 'news' });
        });

        const imgMap = {
          allWords: 'صور: كلمات', site: 'صور: موقع', fileType: 'صور: نوع الملف',
          size: 'صور: حجم', exactWidth: 'صور: عرض', exactHeight: 'صور: ارتفاع',
          aspect: 'صور: نسبة', color: 'صور: لون', colorType: 'صور: نوع اللون',
          type: 'صور: نوع', rights: 'صور: حقوق', time: 'صور: وقت',
          lang: 'صور: لغة', region: 'صور: منطقة', safe: 'صور: سلامة'
        };
        Object.entries(imageState).forEach(([k, v]) => {
          if (!v || v === 'all') return;
          active.push({ key: k, value: v, label: (imgMap[k] || k) + ': ' + v, type: 'image' });
        });

        const mapMap = { place: 'خرائط: مكان', near: 'خرائط: قرب', rating: 'خرائط: تقييم', hours: 'خرائط: ساعات', price: 'خرائط: سعر', category: 'خرائط: فئة', sort: 'خرائط: ترتيب' };
        Object.entries(mapState).forEach(([k, v]) => {
          if (!v || v === 'all' || v === '0') return;
          if (k === 'sort' && v === 'relevance') return;
          active.push({ key: k, value: v, label: (mapMap[k] || k) + ': ' + v, type: 'map' });
        });

        // ⭐ روابط searches المختارة
        Object.keys(selectedLinksState.selected).forEach(key => {
          if (selectedLinksState.selected[key]) {
            const idx = Number(key.replace('link:', ''));
            const item = searches[idx];
            if (!item) return;
            active.push({ key: 'link', value: key, label: item.name, type: 'link', multi: true });
          }
        });

        return active;
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

function collectNewsInputs() {
        newsState.allWords = newsAllWords.value.trim();
        newsState.exactPhrase = newsExactPhrase.value.trim();
        newsState.site = newsSite.value.trim();
      }

function collectImageInputs() {
        const el = (id) => document.getElementById(id);
        if (el('imgExactWidth')) imageState.exactWidth = el('imgExactWidth').value.trim();
        if (el('imgExactHeight')) imageState.exactHeight = el('imgExactHeight').value.trim();
      }

function collectMapInputs() {
        mapState.place = mapPlace.value.trim();
        mapState.near = mapNear.value.trim();
        mapState.category = mapCategory.value;
      }

function resetAllFilters() {
        const mode = getActiveMode();
        modeFilters[mode] = createDefaultFilterState();
        loadStateFromMode(mode);
        setFilterButtonVisuals(filterState);
        syncAllInputs();
        updateAllFiltersUI();
        closeFilterDrawer();
        updateFilterSummary();
        renderActiveFiltersBar();
        showToast(langStrings[currentLang].toastResetFilters);
      }

