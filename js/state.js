
      // =====================================================
      // ⭐⭐⭐ بناء شبكة "كافة الفلاتر" ديناميكياً من searches ⭐⭐⭐
      // =====================================================
      function getSearchesByGroup() {
        const groups = {};
        (searches || []).forEach((item, index) => {
          // "البحث العادي" هو المدخل الأساسي وليس أحد الفلاتر الـ48.
          if (item.group === 'أساسي') return;
          const group = item.group || 'أخرى';
          if (!groups[group]) groups[group] = [];
          groups[group].push({ ...item, index });
        });
        return groups;
      }

      function buildAllFiltersGrid() {
        const grid = document.getElementById('allFiltersGrid');
        if (!grid) return;
        grid.innerHTML = '';
        const groups = getSearchesByGroup();
        Object.entries(groups).forEach(([groupName, items]) => {
          const groupDiv = document.createElement('div');
          groupDiv.className = 'all-filter-group';
          groupDiv.dataset.group = groupName;
          const icon = groupIcons[groupName] || '📌';
          groupDiv.innerHTML = `<div class="all-filter-group-title">${icon} ${groupName}</div>`;
          const itemsDiv = document.createElement('div');
          itemsDiv.className = 'all-filter-items';
          items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'all-filter-item';
            itemDiv.dataset.linkIndex = String(item.index);
            itemDiv.dataset.filterOrder = String(document.querySelectorAll('#allFiltersGrid .all-filter-item').length + 1);
            const parts = item.name.trim().split(' ');
            const itemIcon = parts[0];
            const itemName = parts.slice(1).join(' ');
            itemDiv.innerHTML = `<span class="af-icon">${itemIcon}</span><span class="af-name">${itemName}</span>`;
            itemsDiv.appendChild(itemDiv);
          });
          groupDiv.appendChild(itemsDiv);
          grid.appendChild(groupDiv);
        });
        if (typeof setupAllFiltersMoreButton === 'function') setupAllFiltersMoreButton();
      }

      function setupAllFiltersMoreButton() {
        const grid = document.getElementById('allFiltersGrid');
        const button = document.getElementById('allFiltersMoreBtn');
        if (!grid || !button) return;
        const items = Array.from(grid.querySelectorAll('.all-filter-item'));
        const extraCount = Math.max(0, items.length - 12);
        let expanded = button.getAttribute('aria-expanded') === 'true';

        if (!extraCount) {
          button.hidden = true;
          items.forEach(item => item.classList.remove('af-extra-hidden'));
          return;
        }

        button.hidden = false;
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? '➖ إظهار أقل' : '➕ إظهار المزيد (' + extraCount + ')';
        items.forEach((item, i) => item.classList.toggle('af-extra-hidden', !expanded && i >= 12));

        if (!button.dataset.bound) {
          button.dataset.bound = 'true';
          button.addEventListener('click', () => {
            const open = button.getAttribute('aria-expanded') === 'true';
            const next = !open;
            button.setAttribute('aria-expanded', String(next));
            button.textContent = next ? '➖ إظهار أقل' : '➕ إظهار المزيد (' + extraCount + ')';
            items.forEach((item, i) => item.classList.toggle('af-extra-hidden', !next && i >= 12));
          });
        }
      }

      // =====================================================
      // SMART SEARCH DETECTION
      // =====================================================
      const smartPatterns = {
        maps: {
          keywords: ['مطعم', 'مطاعم', 'فندق', 'فنادق', 'مقهى', 'مقاهي', 'صيدلية', 'صيدليات', 'مستشفى', 'مستشفيات', 'بنك', 'بنوك', 'صراف', 'محطة', 'محطات', 'بقالة', 'سوبر ماركت', 'مول', 'مركز تجاري', 'قريب', 'قريبة', 'بالقرب', 'nearby', 'restaurant', 'hotel', 'cafe', 'pharmacy', 'hospital', 'bank', 'atm', 'gas station', 'supermarket', 'mall'],
          icon: '🗺️', label: 'خرائط'
        },
        news: {
          keywords: ['أخبار', 'خبر', 'عاجل', 'سياسة', 'اقتصاد', 'رياضة', 'news', 'breaking', 'politics', 'economy'],
          icon: '📰', label: 'أخبار'
        },
        images: {
          keywords: ['صورة', 'صور', 'خلفية', 'خلفيات', 'شعار', 'تصميم', 'image', 'images', 'wallpaper', 'logo', 'picture'],
          icon: '🖼️', label: 'صور'
        },
        videos: {
          keywords: ['فيديو', 'يوتيوب', 'مقطع', 'حلقة', 'video', 'youtube', 'watch', 'clip'],
          icon: '🎬', label: 'فيديو'
        }
      };

      function detectSearchMode(query) {
        if (!query || query.trim().length < 2) return null;
        const lower = query.toLowerCase();
        for (const [mode, config] of Object.entries(smartPatterns)) {
          for (const keyword of config.keywords) {
            if (lower.includes(keyword.toLowerCase())) return { mode, config };
          }
        }
        return null;
      }

      const searchModesConfig = [
        { id: 'smart', icon: '✨', label: 'ذكي', labelEn: 'Smart' },
        { id: 'web', icon: '🌐', label: 'ويب', labelEn: 'Web' },
        { id: 'news', icon: '📰', label: 'أخبار', labelEn: 'News' },
        { id: 'images', icon: '🖼️', label: 'صور', labelEn: 'Images' },
        { id: 'maps', icon: '🗺️', label: 'خرائط', labelEn: 'Maps' },
        { id: 'videos', icon: '🎬', label: 'فيديو', labelEn: 'Videos' }
      ];

      const contextualSuggestions = {
        maps: [
          { icon: '⭐', label: '4+ نجوم', apply: () => { mapState.rating = '4'; } },
          { icon: '🕐', label: 'مفتوح الآن', apply: () => { mapState.hours = 'open'; } },
          { icon: '💰', label: 'اقتصادي', apply: () => { mapState.price = '1'; } },
          { icon: '🍽️', label: 'مطاعم', apply: () => { mapState.category = 'restaurants'; } }
        ],
        news: [
          { icon: '⏰', label: 'آخر ساعة', apply: () => { newsState.time = 'h'; } },
          { icon: '📅', label: 'اليوم', apply: () => { newsState.time = 'h24'; } },
          { icon: '📆', label: 'هذا الأسبوع', apply: () => { newsState.time = 'd7'; } },
          { icon: '🔥', label: 'الأحدث', apply: () => { newsState.sort = 'date'; } }
        ],
        images: [
          { icon: '📐', label: 'كبير', apply: () => { imageState.size = 'l'; } },
          { icon: '🎨', label: 'ملون', apply: () => { imageState.colorType = 'color'; } },
          { icon: '👤', label: 'وجه', apply: () => { imageState.type = 'face'; } },
          { icon: '⚖️', label: 'مجاني', apply: () => { imageState.rights = 'f'; } }
        ],
        videos: [
          { icon: '⏱️', label: 'قصير', apply: () => { filterState.duration = ['short']; } },
          { icon: '🎥', label: 'HD', apply: () => { filterState.quality = ['hd']; } },
          { icon: '🔴', label: 'مباشر', apply: () => { filterState.type = ['live']; } }
        ],
        web: [
          { icon: '📄', label: 'PDF', apply: () => { advancedState.fileType = 'pdf'; } },
          { icon: '📅', label: 'هذا العام', apply: () => { filterState.date = ['year']; } },
          { icon: '📰', label: 'أخبار', apply: () => { advancedState.allWords = 'أخبار'; } }
        ]
      };

      // =====================================================
      // DOM ELEMENTS
      // =====================================================
      const searchInput = document.getElementById('searchInput');
      const searchBtn = document.getElementById('searchBtn');
      const translateBtn = document.getElementById('translateBtn');
      const langTool = document.getElementById('langTool');
      const langCode = document.getElementById('langCode');
      const langTarget = document.getElementById('langTarget');
      const suggestionsDropdown = document.getElementById('suggestionsDropdown');
      const quickSuggestions = document.getElementById('quickSuggestions');
      const emptyState = document.getElementById('emptyState');
      const emptyTitle = document.getElementById('emptyTitle');
      const emptyText = document.getElementById('emptyText');
      const toast = document.getElementById('toast');
      const lastUpdated = document.getElementById('lastUpdated');
      const themeToggle = document.getElementById('themeToggle');
      const langAr = document.getElementById('langAr');
      const langEn = document.getElementById('langEn');
      const heroTitle = document.getElementById('heroTitle');
      const heroDesc = document.getElementById('heroDesc');
      const activeFiltersBar = document.getElementById('activeFiltersBar');
      const smartIndicator = document.getElementById('smartIndicator');
      const smartIndicatorText = document.getElementById('smartIndicatorText');
      const searchModes = document.getElementById('searchModes');
      const contextualFilters = document.getElementById('contextualFilters');
      const cfChips = document.getElementById('cfChips');
      const cfLabelText = document.getElementById('cfLabelText');
      const presetsBar = document.getElementById('presetsBar');
      const openFiltersBtn = document.getElementById('openFiltersBtn');
      const closeFiltersBtn = document.getElementById('closeFiltersBtn');
      const applyFiltersBtn = document.getElementById('applyFiltersBtn');
      const drawerResetFiltersBtn = document.getElementById('drawerResetFiltersBtn');
      const filterOverlay = document.getElementById('filterOverlay');
      const filterBackdrop = document.getElementById('filterBackdrop');
      const filterBadge = document.getElementById('filterBadge');
      const filterBtnLabel = document.getElementById('filterBtnLabel');
      const filterTabs = document.getElementById('filterTabs');
      const cmdBtn = document.getElementById('cmdBtn');
      const cmdBackdrop = document.getElementById('cmdBackdrop');
      const cmdPalette = document.getElementById('cmdPalette');
      const cmdSearchInput = document.getElementById('cmdSearchInput');
      const cmdResults = document.getElementById('cmdResults');
      const advAllWords = document.getElementById('advAllWords');
      const advExactPhrase = document.getElementById('advExactPhrase');
      const advAnyWords = document.getElementById('advAnyWords');
      const advNoneWords = document.getElementById('advNoneWords');
      const advNumbers = document.getElementById('advNumbers');
      const advSite = document.getElementById('advSite');
      const advFileType = document.getElementById('advFileType');
      const advLastUpdate = document.getElementById('advLastUpdate');
      const advLang = document.getElementById('advLang');
      const advUsageRights = document.getElementById('advUsageRights');
      const newsAllWords = document.getElementById('newsAllWords');
      const newsExactPhrase = document.getElementById('newsExactPhrase');
      const newsSite = document.getElementById('newsSite');
      const mapPlace = document.getElementById('mapPlace');
      const mapNear = document.getElementById('mapNear');
      const mapCategory = document.getElementById('mapCategory');
      const allFilterBtns = document.querySelectorAll('.filter-btn');
      const spChips = document.getElementById('spChips');
      const filterSearchInput = document.getElementById('filterSearchInput');
