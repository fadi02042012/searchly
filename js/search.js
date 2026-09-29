
      // =====================================================
      // STRINGS
      // =====================================================
      const langStrings = {
        ar: {
          heroTitle: 'ابحث بذكاء',
          heroDesc: 'اكتب ما تريد، وسنقترح عليك أفضل طريقة للبحث',
          searchPlaceholder: 'اكتب ما تريد البحث عنه...',
          search: '🔍 بحث',
          advancedSearchShort: 'بحث متقدم',
          emptyTitle: 'ابدأ البحث',
          emptyText: 'اكتب كلمة، وسنقترح عليك أفضل طريقة للبحث',
          quickLabel: 'جرّب:',
          quickSuggestions: ['مطاعم قريبة', 'أخبار اليوم', 'صور طبيعة', 'فيديو تعليمي', 'أسعار الذهب'],
          toastEmpty: '✏️ ادخل كلمة للبحث',
          toastTranslated: '🌐 تم الترجمة إلى ',
          toastTranslateEmpty: '✏️ ادخل نصاً للترجمة',
          toastTranslateError: '❌ لا توجد ترجمة',
          toastFiltersApplied: '✅ تم تطبيق الفلاتر',
          toastResetFilters: '🔄 تم إعادة الضبط',
          toastLangSwitched: '🌐 تم التبديل',
          toastFilterRemoved: '❌ تم إزالة الفلتر',
          toastPresetSaved: '💾 تم حفظ الـ Preset',
          toastPresetApplied: '✨ تم تطبيق الـ Preset',
          toastPresetDeleted: '🗑️ تم حذف الـ Preset',
          toastModeSwitched: '🎯 تم التبديل إلى: ',
          toastSearchIn: '🔍 البحث في ',
          toastTranslatedSearched: '🌐 تم الترجمة وفتح البحث في ',
          toastAllFiltersSelected: '✅ تم تحديد جميع الفلاتر الظاهرة',
          toastAllFiltersCleared: '🗑️ تم مسح جميع الفلاتر',
          toastNextStep: '📖 تم الانتقال إلى اختيار المدينة',
          activeFiltersLabel: 'نشط:',
          cfLabelText: 'فلاتر مقترحة:',
          noPresets: 'لا توجد Presets محفوظة',
          noFiltersSelected: 'لم يتم اختيار أي فلتر بعد'
        },
        en: {
          heroTitle: 'Search Smart',
          heroDesc: 'Type what you want, and we\'ll suggest the best way to search',
          searchPlaceholder: 'Type what you want to search...',
          search: '🔍 Search',
          advancedSearchShort: 'Advanced',
          emptyTitle: 'Start Searching',
          emptyText: 'Type a word and we\'ll suggest the best way to search',
          quickLabel: 'Try:',
          quickSuggestions: ['Nearby restaurants', 'Today news', 'Nature images', 'Educational video', 'Gold price'],
          toastEmpty: '✏️ Enter a search term',
          toastTranslated: '🌐 Translated to ',
          toastTranslateEmpty: '✏️ Enter text to translate',
          toastTranslateError: '❌ No translation',
          toastFiltersApplied: '✅ Filters applied',
          toastResetFilters: '🔄 Reset',
          toastLangSwitched: '🌐 Switched',
          toastFilterRemoved: '❌ Filter removed',
          toastPresetSaved: '💾 Preset saved',
          toastPresetApplied: '✨ Preset applied',
          toastPresetDeleted: '🗑️ Preset deleted',
          toastModeSwitched: '🎯 Switched to: ',
          toastSearchIn: '🔍 Searching in ',
          toastTranslatedSearched: '🌐 Translated & searched in ',
          toastAllFiltersSelected: '✅ Selected all visible filters',
          toastAllFiltersCleared: '🗑️ Cleared all filters',
          toastNextStep: '📖 Moved to city selection',
          activeFiltersLabel: 'Active:',
          cfLabelText: 'Suggested filters:',
          noPresets: 'No presets saved',
          noFiltersSelected: 'No filters selected yet'
        }
      };

      const filterLabels = {
        ar: {
          sort: { relevance: 'الأكثر صلة', date: 'تاريخ النشر', views: 'عدد المشاهدات', rating: 'التقييم' },
          type: { video: 'فيديو', playlist: 'قائمة', live: 'بث', shorts: 'Shorts', channel: 'قنوات', movie: 'أفلام' },
          duration: { short: 'قصير', medium: 'متوسط', long: 'طويل' },
          date: { hour: 'ساعة', today: 'اليوم', week: 'أسبوع', month: 'شهر', year: 'سنة' },
          quality: { '4k': '4K', hd: 'HD' },
          feature: { '360': '360°', vr180: 'VR180', '3d': '3D', hdr: 'HDR', cc: 'ترجمة' }
        },
        en: {
          sort: { relevance: 'Relevance', date: 'Date', views: 'Views', rating: 'Rating' },
          type: { video: 'Video', playlist: 'Playlist', live: 'Live', shorts: 'Shorts', channel: 'Channels', movie: 'Movies' },
          duration: { short: 'Short', medium: 'Medium', long: 'Long' },
          date: { hour: 'Hour', today: 'Today', week: 'Week', month: 'Month', year: 'Year' },
          quality: { '4k': '4K', hd: 'HD' },
          feature: { '360': '360°', vr180: 'VR180', '3d': '3D', hdr: 'HDR', cc: 'CC' }
        }
      };

      // =====================================================
      // TRANSLATION
      // =====================================================
      const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=';
      const translationCache = new Map();
      const translationDict = {
        'مرحبا': 'Hello', 'Hello': 'مرحبا', 'شكرا': 'Thanks', 'Thanks': 'شكرا',
        'أخبار': 'News', 'News': 'أخبار', 'رياضة': 'Sports', 'Sports': 'رياضة',
        'اقتصاد': 'Economy', 'Economy': 'اقتصاد', 'تقنية': 'Technology', 'Technology': 'تقنية'
      };

      function translateWithDictionary(text, targetLang) {
        if (!text || !text.trim()) return text;
        const trimmed = text.trim();
        const isArabic = /[\u0600-\u06FF]/.test(trimmed);
        if ((targetLang === 'ar' && isArabic) || (targetLang === 'en' && !isArabic)) return trimmed;
        const lowerInput = trimmed.toLowerCase();
        for (const [key, value] of Object.entries(translationDict)) {
          if (lowerInput === key.toLowerCase()) return value;
        }
        return text;
      }

      async function translateWithGoogle(text, targetLang) {
        if (!text || !text.trim()) return text;
        const trimmed = text.trim();
        try {
          const url = TRANSLATE_API + targetLang + '&dt=t&q=' + encodeURIComponent(trimmed);
          const response = await fetch(url);
          if (!response.ok) throw new Error('Network');
          const data = await response.json();
          if (data && data[0] && data[0][0]) return data[0].map(s => s[0]).join('');
          throw new Error('No translation');
        } catch (error) {
          return translateWithDictionary(trimmed, targetLang);
        }
      }

      async function translateText(text, targetLang) {
        const cacheKey = `${text}|${targetLang}`;
        if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);
        try {
          const result = await translateWithGoogle(text, targetLang);
          translationCache.set(cacheKey, result);
          return result;
        } catch {
          const result = translateWithDictionary(text, targetLang);
          translationCache.set(cacheKey, result);
          return result;
        }
      }

      function escapeHTML(value) {
        if (value === null || value === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(value);
        return div.innerHTML;
      }

      let toastTimer;
      function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
      }

      // =====================================================
      // ⭐⭐⭐ روابط كافة الفلاتر — التعامل مع selectedLinksState ⭐⭐⭐
      // =====================================================
      function updateAllFiltersUI() {
        if (spChips) {
          const selectedKeys = Object.keys(selectedLinksState.selected).filter(k => selectedLinksState.selected[k]);
          if (selectedKeys.length === 0) {
            spChips.innerHTML = '<span style="color:var(--muted-2);font-size:11px;">' + langStrings[currentLang].noFiltersSelected + '</span>';
          } else {
            spChips.innerHTML = selectedKeys.map(key => {
              const idx = Number(key.replace('link:', ''));
              const item = searches[idx];
              if (!item) return '';
              const parts = item.name.trim().split(' ');
              const icon = parts[0];
              const name = parts.slice(1).join(' ');
              return `<span class="sp-chip">${icon} ${name}</span>`;
            }).join('');
          }
        }
        document.querySelectorAll('.all-filter-item').forEach(item => {
          const idx = item.dataset.linkIndex;
          const key = 'link:' + idx;
          item.classList.toggle('selected', !!selectedLinksState.selected[key]);
        });
      }

      function handleAllFilterClick(item) {
        const idx = item.dataset.linkIndex;
        const key = 'link:' + idx;
        selectedLinksState.selected[key] = !selectedLinksState.selected[key];
        updateAllFiltersUI();
        saveCurrentStateToMode();
      }

      function attachAllFiltersListeners() {
        document.querySelectorAll('.all-filter-item').forEach(item => {
          if (item.dataset.bound === 'true') return;
          item.dataset.bound = 'true';
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAllFilterClick(item);
          });
        });
        if (filterSearchInput && filterSearchInput.dataset.bound === 'true') return;
        if (filterSearchInput) {
          filterSearchInput.dataset.bound = 'true';
          filterSearchInput.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            document.querySelectorAll('.all-filter-item').forEach(item => {
              const name = item.querySelector('.af-name').textContent.toLowerCase();
              item.style.display = q === '' || name.includes(q) ? '' : 'none';
            });
            document.querySelectorAll('.all-filter-group').forEach(group => {
              const visibleItems = Array.from(group.querySelectorAll('.all-filter-item')).filter(it => it.style.display !== 'none');
              group.style.display = visibleItems.length > 0 ? '' : 'none';
            });
          });
        }
        const selectAllBtn = document.getElementById('afSelectAll');
        if (selectAllBtn) {
          selectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.all-filter-item').forEach(item => {
              if (item.style.display !== 'none') {
                selectedLinksState.selected['link:' + item.dataset.linkIndex] = true;
              }
            });
            updateAllFiltersUI();
            saveCurrentStateToMode();
            showToast(langStrings[currentLang].toastAllFiltersSelected);
          });
        }
        const clearAllBtn = document.getElementById('afClearAll');
        if (clearAllBtn) {
          clearAllBtn.addEventListener('click', () => {
            selectedLinksState.selected = {};
            updateAllFiltersUI();
            saveCurrentStateToMode();
            showToast(langStrings[currentLang].toastAllFiltersCleared);
          });
        }
        const nextBtn = document.getElementById('afNextBtn');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            showToast(langStrings[currentLang].toastNextStep);
            closeFilterDrawer();
          });
        }
      }
