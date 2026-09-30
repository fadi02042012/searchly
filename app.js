    (function() {
      'use strict';

      // =====================================================
      // ⭐⭐⭐ 48 رابط بحث متقدم (من 03-links.js) ⭐⭐⭐
      // =====================================================
      const searches = [
        { name: "📺 البحث العادي", group: "أساسي", base: "https://www.youtube.com/results?search_query=", suffix: "" },
        { name: "🔥 الترتيب حسب عدد المشاهدات", group: "الترتيب", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=CAMSAhAB" },
        { name: "⭐ الترتيب حسب التقييم", group: "الترتيب", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=CAESAhAB" },
        { name: "📅 الترتيب حسب تاريخ التحميل", group: "الترتيب", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=CAI%3D" },
        { name: "📝 البحث في عنوان الفيديو", group: "الترتيب", base: "https://www.youtube.com/results?search_query=intitle%3A%22", suffix: "%22" },
        { name: "🕐 آخر ساعة", group: "التاريخ", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIIAQ%3D%3D" },
        { name: "📆 اليوم", group: "التاريخ", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgQIAhAB" },
        { name: "📅 هذا الأسبوع", group: "التاريخ", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgQIAxAB" },
        { name: "🗓 هذا الشهر", group: "التاريخ", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgQIBBAB" },
        { name: "📖 هذا العام", group: "التاريخ", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgQIBRAB" },
        { name: "⏱ أقل من 4 دقائق", group: "المدة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIYAQ%3D%3D" },
        { name: "⌛ بين 4 و20 دقيقة", group: "المدة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIYAw%3D%3D" },
        { name: "🎬 أكثر من 20 دقيقة", group: "المدة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIYAg%3D%3D" },
        { name: "🎥 فيديوهات 4K", group: "الجودة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgJwAQ%3D%3D" },
        { name: "✨ HDR", group: "الجودة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgPIAQE%3D" },
        { name: "📺 دقة HD", group: "الجودة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIgAQ%3D%3D" },
        { name: "🌍 فيديوهات 360°", group: "الجودة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgJ4AQ%3D%3D" },
        { name: "🥽 VR180", group: "الجودة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgPQAQE%3D" },
        { name: "🎞 ثلاثي الأبعاد", group: "الجودة", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgI4AQ%3D%3D" },
        { name: "🏆 أكثر من 20 دقيقة + الأعلى مشاهدة", group: "مركب", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=CAMSAhgC" },
        { name: "🎞 أكثر من 20 دقيقة + 4K", group: "مركب", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgYQBBgCcAE%3D" },
        { name: "💎 أكثر من 20 دقيقة + 4K + HD", group: "مركب", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgYYAiABcAE%3D" },
        { name: "🎥 فيديوهات فقط", group: "نوع المحتوى", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIQAQ%3D%3D" },
        { name: "📺 قنوات", group: "نوع المحتوى", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIQAg%3D%3D" },
        { name: "📂 قوائم تشغيل", group: "نوع المحتوى", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIQAw%3D%3D" },
        { name: "🎬 أفلام", group: "نوع المحتوى", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgIQBA%3D%3D" },
        { name: "📡 بث مباشر", group: "نوع المحتوى", base: "https://www.youtube.com/results?search_query=", suffix: "&sp=EgJAAQ%3D%3D" },
        { name: "🎬 YouTube Shorts", group: "منصات", base: "https://www.google.com/search?q=site:youtube.com+", suffix: "&udm=39" },
        { name: "🔍 البحث في Google عن فيديوهات YouTube", group: "منصات", base: "https://www.google.com/search?q=site:youtube.com+", suffix: "&tbm=vid" },
        { name: "🆕 فيديوهات YouTube الأحدث (Google)", group: "منصات", base: "https://www.google.com/search?q=site:youtube.com+", suffix: "&num=100&udm=7&tbs=qdr:d" },
        { name: "📈 ترند YouTube", group: "منصات", base: "https://www.google.com/search?q=", suffix: "+site:https://www.youtube.com/feed/trending" },
        { name: "📂 قوائم تشغيل YouTube", group: "منصات", base: "https://www.google.com/search?q=", suffix: "+site:https://www.youtube.com/user/*/playlists" },
        { name: "📺 البحث داخل قناة TEDx", group: "قنوات محددة", base: "https://www.youtube.com/@TEDx/search?query=", suffix: "" },
        { name: "📷 البحث في Instagram (آخر 24 ساعة)", group: "منصات", base: "https://www.google.com/search?q=site:https://www.instagram.com+", suffix: "&num=10&tbs=qdr:d" },
        { name: "📺 البحث داخل قناة ArabicMOD", group: "قنوات محددة", base: "https://www.youtube.com/@ArabicMOD/search?query=", suffix: "" },
        { name: "📺 البحث داخل قناة Fortinet", group: "قنوات محددة", base: "https://www.youtube.com/@fortinet/search?query=", suffix: "" },
        { name: "😂 البحث داخل قناة Gags", group: "قنوات محددة", base: "https://www.youtube.com/@gags/search?query=", suffix: "" },
        { name: "📖 البحث داخل قناة Sautuliman", group: "قنوات محددة", base: "https://www.youtube.com/@Sautuliman-AljameatusSaifiyah/search?query=", suffix: "" },
        { name: "🎥 Vimeo", group: "منصات", base: "https://www.google.com/search?q=site:https://vimeo.com+", suffix: "" },
        { name: "🎞 Dailymotion", group: "منصات", base: "https://www.dailymotion.com/search/", suffix: "/videos" },
        { name: "▶ Playeur", group: "منصات", base: "https://playeur.com/search?q=", suffix: "" },
        { name: "🎬 Youku", group: "منصات", base: "https://so.youku.com/search_video/q_", suffix: "?searchfrom=1" },
        { name: "📺 Bilibili", group: "منصات", base: "https://search.bilibili.com/all?keyword=", suffix: "&from_source=webtop_search" },
        { name: "📹 Bing Video", group: "منصات", base: "https://www.bing.com/videos/search?q=", suffix: "" },
        { name: "📹 Yahoo Video", group: "منصات", base: "https://www.yahoo.com/video/search?p=", suffix: "" },
        { name: "📹 AOL Video", group: "منصات", base: "https://search.aol.com/aol/video?q=", suffix: "" },
        { name: "📹 Yandex Video", group: "منصات", base: "https://yandex.com/video/search?text=", suffix: "" },
        { name: "🌍 EarthCam", group: "منصات", base: "https://www.earthcam.com/search/ft_search.php?term=", suffix: "" },
        { name: "📷 WebCamTaxi", group: "منصات", base: "https://www.webcamtaxi.com/en/search.html?searchword=", suffix: "&searchphrase=all" }
      ];

      // =====================================================
      // ⭐ دوال الروابط المتقدمة (من 03-links.js)
      // =====================================================
      function generateAdvancedLink(query, index = 0) {
        const safeIndex = Math.max(0, Math.min(searches.length - 1, Number(index) || 0));
        const search = searches[safeIndex];
        const value = String(query || '').trim();
        const url = search.base + encodeURIComponent(value) + search.suffix;
        try {
          const parsed = new URL(url);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('unsupported_protocol');
          return parsed.href;
        } catch (error) {
          console.warn('رابط بحث متقدم غير صالح:', search.name, error);
          return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(value);
        }
      }

      // ⭐ تجميع الروابط حسب group للبناء الديناميكي
      function getSearchesByGroup() {
        const groups = {};
        searches.forEach((s, i) => {
          if (!groups[s.group]) groups[s.group] = [];
          groups[s.group].push({ ...s, index: i });
        });
        return groups;
      }

      const groupIcons = {
        'أساسي': '📺',
        'الترتيب': '🔥',
        'التاريخ': '📅',
        'المدة': '⏱️',
        'الجودة': '✨',
        'مركب': '🏆',
        'نوع المحتوى': '🎬',
        'منصات': '🌐',
        'قنوات محددة': '📺'
      };

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
        const validMode = searchModesConfig.some(item => item.id === mode) ? mode : 'web';
        document.querySelectorAll('.search-modes .mode-tab[data-mode]').forEach(tab => {
          const isActive = tab.dataset.mode === validMode;
          tab.classList.toggle('active', isActive);
          tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        return validMode;
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
        const validMode = searchModesConfig.some(item => item.id === newMode) ? newMode : 'web';
        const oldMode = getActiveMode();

        if (oldMode !== validMode) {
          saveStateToMode(oldMode);
          localStorage.setItem('sh_mode', validMode);
          loadStateFromMode(validMode);
        }
        setActiveMode(validMode);
        renderContextualFilters();
        syncFilterTabWithMode(validMode);
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

      // =====================================================
      // ⭐⭐⭐ بناء شبكة "كافة الفلاتر" ديناميكياً من searches ⭐⭐⭐
      // =====================================================
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
            const parts = item.name.trim().split(' ');
            const itemIcon = parts[0];
            const itemName = parts.slice(1).join(' ');
            itemDiv.innerHTML = `<span class="af-icon">${itemIcon}</span><span class="af-name">${itemName}</span>`;
            itemsDiv.appendChild(itemDiv);
          });
          groupDiv.appendChild(itemsDiv);
          grid.appendChild(groupDiv);
        });
      }

      // =====================================================
      // SMART SEARCH DETECTION
      // =====================================================
      // =====================================================
      // ✨ SMART SEARCH — تحليل النية متعدد الإشارات
      // =====================================================
      function normalizeSmartQuery(query) {
        return String(query || '')
          .toLowerCase()
          .replace(/[إأآ]/g, 'ا')
          .replace(/ة/g, 'ه')
          .replace(/[ًٌٍَُِّْـ]/g, '')
          .replace(/[؟?!.,،؛:()[\]{}"'']/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      const smartPatterns = {
        maps: {
          phrases: ['مطاعم قريبه','مطاعم قريبة','مطعم قريب','فنادق قريبه','فنادق قريبة','مقاهي قريبه','صيدليات قريبه','مستشفيات قريبه','بالقرب مني','بالقرب من','قريب مني','قريبة مني','near me','nearby','restaurants near','hotels near'],
          keywords: ['مطعم','مطاعم','فندق','فنادق','مقهى','مقاهي','صيدلية','صيدليات','مستشفى','مستشفيات','بنك','بنوك','صراف','محطة','محطات','بقالة','سوبر ماركت','مول','مركز تجاري','restaurant','hotel','cafe','pharmacy','hospital','bank','atm','gas station','supermarket','mall'],
          icon: '🗺️', label: 'خرائط'
        },
        news: {
          phrases: ['اخبار اليوم','أخبار اليوم','اخر الاخبار','آخر الأخبار','خبر عاجل','اخبار عاجله','هذا الخبر','ما الجديد في','latest news','breaking news','today news'],
          keywords: ['اخبار','أخبار','خبر','عاجل','سياسة','اقتصاد','رياضة','انتخابات','news','breaking','politics','economy','sports'],
          icon: '📰', label: 'أخبار'
        },
        images: {
          phrases: ['صور عاليه الجوده','صور عالية الجودة','خلفيات عاليه الدقه','خلفيات عالية الدقة','صور png','صور مجانية','صورة مجانية','صور كبيره','صور كبيرة','صور مربعة','صور عريضه','صور عريضة'],
          keywords: ['صورة','صور','صوره','خلفية','خلفيات','شعار','تصميم','png','jpg','jpeg','wallpaper','image','images','picture','logo'],
          icon: '🖼️', label: 'صور'
        },
        videos: {
          phrases: [
            'فيديو تعليمي','فيديو كامل','فيديو مباشر','بث مباشر','فيلم كامل','فيلم مترجم','فيلم مدبلج',
            'مسلسل كامل','مسلسل مترجم','جميع الحلقات','الحلقة كاملة','حلقة كاملة','فيديو 4k',
            'فيديو hd','شرح كامل','شرح بالتفصيل','شرح للمبتدئين','خطوة بخطوة','طريقة صنع','طريقة صناعة',
            'كيفية صنع','كيفية صناعة','كيف يصنع','كيف تصنع','كيف اصنع','كيف اسوي','كيف اعمل',
            'طريقة عمل','طريقة استخدام','طريقة تركيب','طريقة اصلاح','طريقة إصلاح','حل مشكلة',
            'مراجعة','مراجعات','مقارنة','مقارنات','تجربة','تجارب','دروس','درس','تعلم','tutorial',
            'how to','how do i','how to make','how to use','step by step','beginner guide',
            'full tutorial','review','reviews','comparison','guide','documentary','فيلم وثائقي','فيلم وثائقية',
            'أفلام وثائقية','افلام وثائقية','وثائقي','وثائقيات','مسلسل','مسلسلات','حلقة','موسم','أنمي','انمي','كرتون'
          ],
          keywords: ['فيديو','يوتيوب','مقطع','مشاهدة','شاهد','حلقة','فيلم','أفلام','مسلسل','مسلسلات','شرح','تعلم','دروس','طريقة','كيفية','مراجعة','مقارنة','وثائقي','انمي','أنمي','كرتون','video','youtube','watch','clip','tutorial','documentary'],
          icon: '🎬', label: 'فيديو'
        }
      };

      function scoreSmartMode(query, mode, config) {
        const lower = normalizeSmartQuery(query);
        let score = 0;
        const matched = [];
        config.phrases.forEach(phrase => {
          const p = normalizeSmartQuery(phrase);
          if (p && lower.includes(p)) {
            score += 5;
            matched.push(p);
          }
        });
        config.keywords.forEach(keyword => {
          const k = normalizeSmartQuery(keyword);
          if (k && lower.includes(k)) {
            score += 1;
            matched.push(k);
          }
        });
        return { mode, config, score, matched: [...new Set(matched)] };
      }

      function detectSearchMode(query) {
        if (!query || normalizeSmartQuery(query).length < 2) return null;
        const results = Object.entries(smartPatterns)
          .map(([mode, config]) => scoreSmartMode(query, mode, config))
          .filter(result => result.score > 0)
          .sort((a, b) => b.score - a.score);

        if (!results.length) return null;
        const best = results[0];
        const second = results[1];
        if (second && best.score === second.score && best.score < 5) return null;
        return best;
      }

      const searchModesConfig = [
        { id: 'smart', icon: '✨', label: 'ذكي', labelEn: 'Smart' },
        { id: 'web', icon: '🌐', label: 'ويب', labelEn: 'Web' },
        { id: 'news', icon: '📰', label: 'أخبار', labelEn: 'News' },
        { id: 'images', icon: '🖼️', label: 'صور', labelEn: 'Images' },
        { id: 'maps', icon: '🗺️', label: 'خرائط', labelEn: 'Maps' },
        { id: 'videos', icon: '🎬', label: 'فيديو', labelEn: 'Videos' }
      ];

      const smartFilterLinks = {
        views: 1, rating: 2, uploaded: 3, title: 4,
        hour: 5, today: 6, week: 7, month: 8, year: 9,
        short: 10, medium: 11, long: 12, '4k': 13, hdr: 14, hd: 15,
        '360': 16, vr180: 17, '3d': 18,
        longViews: 19, long4k: 20, long4kHd: 21,
        video: 22, channel: 23, playlist: 24, movie: 25, live: 26, shorts: 27,
        youtubeShorts: 27, instagram: 33
      };

      function smartHas(lower, values) {
        return values.some(value => lower.includes(normalizeSmartQuery(value)));
      }

      function resetSmartAutoState() {
        filterState.sort = 'date';
        filterState.type = [];
        filterState.duration = [];
        filterState.date = [];
        filterState.quality = [];
        filterState.feature = [];
        advancedState = { allWords: '', exactPhrase: '', anyWords: '', noneWords: '', numbers: '', site: '', fileType: '', lastUpdate: '', lang: '', usageRights: '' };
        newsState = { allWords: '', exactPhrase: '', site: '', time: 'all', sort: 'relevance' };
        imageState = { allWords: '', site: '', fileType: '', size: 'all', exactWidth: '', exactHeight: '', aspect: 'all', color: 'all', colorType: 'all', type: 'all', rights: 'all', time: 'all', lang: '', region: '', safe: 'all' };
        mapState = { place: '', near: '', rating: '0', hours: 'all', price: 'all', category: '', sort: 'relevance' };
        selectedLinksState.selected = {};
      }

      function getSmartSpecialSuggestions(query) {
        const lower = normalizeSmartQuery(query);
        const suggestions = [];
        const addLink = (id, icon, label, key) => {
          const index = smartFilterLinks[key];
          if (index === undefined) return;
          suggestions.push({ id, icon, label, linkIndex: index, auto: true, apply: () => selectSmartLink(index) });
        };
        const addSimple = (id, icon, label, apply) => suggestions.push({ id, icon, label, auto: true, apply });

        // نوع الملف: يدعم الصيغ الشائعة المرتبطة ببعضها.
        const fileGroups = [
          { type: 'pdf', label: 'ويب: نوع ملف: PDF', phrases: ['ملف pdf','pdf','بي دي اف','ملفات بي دي اف'] },
          { type: 'doc', label: 'ويب: نوع ملف: DOC + DOCX', phrases: ['ملف doc','ملف docx','doc','docx','وورد','word'] },
          { type: 'xls', label: 'ويب: نوع ملف: XLS + XLSX', phrases: ['ملف xls','ملف xlsx','xls','xlsx','اكسل','excel'] },
          { type: 'ppt', label: 'ويب: نوع ملف: PPT + PPTX', phrases: ['ملف ppt','ملف pptx','ppt','pptx','باوربوينت','powerpoint'] },
          { type: 'txt', label: 'ويب: نوع ملف: TXT', phrases: ['ملف txt','txt','ملف نصي','نص txt'] }
        ];
        const file = fileGroups.find(item => smartHas(lower, item.phrases));
        if (file) addSimple('smart-file-' + file.type, '📄', file.label, () => { advancedState.fileType = file.type; });

        if (smartHas(lower, ['مجاني','free','royalty free'])) {
          if (smartHas(lower, ['صورة','صور','image','images'])) addSimple('smart-images-free','⚖️','صور: مجاني', () => { imageState.rights = 'f'; });
          else addSimple('smart-web-free','⚖️','ويب: مجاني للاستخدام', () => { advancedState.usageRights = 'f'; });
        }
        if (smartHas(lower, ['4k'])) addLink('smart-4k','🎥','4K','4k');
        if (smartHas(lower, ['hd'])) addLink('smart-hd','📺','HD','hd');
        if (smartHas(lower, ['hdr'])) addLink('smart-hdr','✨','HDR','hdr');
        if (smartHas(lower, ['360'])) addLink('smart-360','🌍','360°','360');
        if (smartHas(lower, ['vr180','vr 180'])) addLink('smart-vr180','🥽','VR180','vr180');
        if (smartHas(lower, ['ثلاثي الابعاد','ثلاثي الأبعاد','3d'])) addLink('smart-3d','🎞️','3D','3d');

        if (smartHas(lower, ['اكثر من 20 دقيقه','أكثر من 20 دقيقة','20 دقيقة','20 دقيقه','long'])) addLink('smart-long','🎬','أكثر من 20 دقيقة','long');
        if (smartHas(lower, ['اقل من 4 دقائق','أقل من 4 دقائق','اقل من 4 دق','short'])) addLink('smart-short','⏱️','أقل من 4 دقائق','short');
        if (smartHas(lower, ['بين 4 و20','4-20','4 الى 20','medium'])) addLink('smart-medium','⌛','بين 4 و20 دقيقة','medium');

        if (smartHas(lower, ['الاكثر مشاهدة','الأكثر مشاهدة','عدد المشاهدات','مشاهدات','most viewed','views'])) addLink('smart-views','🔥','الترتيب حسب عدد المشاهدات','views');
        if (smartHas(lower, ['الأعلى تقييما','الأعلى تقييمًا','اعلى تقييم','تقييم','rating'])) addLink('smart-rating','⭐','الترتيب حسب التقييم','rating');

        if (smartHas(lower, ['آخر ساعة','اخر ساعه','الساعة الماضية','last hour'])) addLink('smart-hour','🕐','آخر ساعة','hour');
        else if (smartHas(lower, ['اليوم','today','24 ساعة','24h'])) addLink('smart-today','📆','اليوم','today');
        else if (smartHas(lower, ['هذا الاسبوع','هذا الأسبوع','الاسبوع','this week'])) addLink('smart-week','📅','هذا الأسبوع','week');
        else if (smartHas(lower, ['هذا الشهر','this month'])) addLink('smart-month','🗓️','هذا الشهر','month');
        else if (smartHas(lower, ['هذا العام','هذه السنة','this year'])) addLink('smart-year','📖','هذا العام','year');

        if (smartHas(lower, ['بث مباشر','مباشر','live'])) addLink('smart-live','🔴','مباشر','live');
        if (smartHas(lower, ['shorts','شورتس','شورت'])) addLink('smart-shorts','🎬','YouTube Shorts','shorts');
        if (smartHas(lower, ['قائمة تشغيل','قوائم تشغيل','playlist','playlists'])) addLink('smart-playlist','📂','قوائم تشغيل','playlist');
        if (smartHas(lower, ['قناة','قنوات','channel','channels'])) addLink('smart-channel','📺','قنوات','channel');
        if (smartHas(lower, ['فيلم','افلام','أفلام','movie','movies'])) addLink('smart-movie','🎬','أفلام','movie');
        if (smartHas(lower, ['فيديو','فيديوهات','video','videos'])) addLink('smart-video','🎥','فيديوهات فقط','video');

        if (smartHas(lower, ['انستقرام','انستجرام','instagram'])) addLink('smart-instagram','📷','البحث في Instagram','instagram');

        // الاستعلامات التعليمية/الشرح غالبًا تستفيد من ترتيب المشاهدات.
        const instructional = smartHas(lower, [
          'كيف اصنع','كيف اسوي','كيف اعمل','طريقة صنع','طريقة صناعة','كيفية صنع','كيفية صناعة',
          'كيف يصنع','كيف تصنع','شرح','شرح كامل','شرح بالتفصيل','شرح للمبتدئين',
          'خطوة بخطوة','طريقة عمل','طريقة استخدام','طريقة تركيب','طريقة اصلاح','طريقة إصلاح',
          'حل مشكلة','تعلم','دروس','درس','tutorial','how to','how do i','how to make',
          'how to use','step by step','beginner guide','full tutorial','guide'
        ]);
        if (instructional && !suggestions.some(s => s.id === 'smart-views')) {
          addLink('smart-views','🔥','الترتيب حسب عدد المشاهدات','views');
        }

        return suggestions;
      }

      function selectSmartLink(index) {
        selectedLinksState.selected = {};
        selectedLinksState.selected['link:' + index] = true;
      }

      function applySmartIntent(query, options = {}) {
        const lower = normalizeSmartQuery(query);
        if (!lower) {
          if (options.reset !== false) resetSmartAutoState();
          return null;
        }

        resetSmartAutoState();
        const detected = detectSearchMode(query);
        const suggestions = getSmartSpecialSuggestions(query);

        // الصور / الخرائط / الأخبار لها حالة مخصصة، مع الحفاظ على استعلام المستخدم.
        if (detected?.mode === 'maps') {
          mapState.place = query;
          if (smartHas(lower, ['قريب','قريبه','قريبة','بالقرب','near me','nearby'])) mapState.hours = 'all';
          if (smartHas(lower, ['مطعم','مطاعم','restaurant'])) mapState.category = 'restaurants';
          if (smartHas(lower, ['فندق','فنادق','hotel'])) mapState.category = 'hotels';
          if (smartHas(lower, ['مقهى','مقاهي','cafe'])) mapState.category = 'cafes';
          if (smartHas(lower, ['صيدلية','صيدليات','pharmacy'])) mapState.category = 'pharmacies';
          if (smartHas(lower, ['مستشفى','مستشفيات','hospital'])) mapState.category = 'hospitals';
          if (smartHas(lower, ['بنك','بنوك','bank'])) mapState.category = 'banks';
          if (smartHas(lower, ['4+ نجوم','أربع نجوم','4 نجوم'])) mapState.rating = '4';
          if (smartHas(lower, ['مفتوح الآن','open now'])) mapState.hours = 'open';
          if (smartHas(lower, ['اقتصادي','رخيص','cheap','budget'])) mapState.price = '1';
        } else if (detected?.mode === 'news') {
          newsState.allWords = query;
          if (smartHas(lower, ['آخر ساعة','اخر ساعه','last hour'])) newsState.time = 'h';
          else if (smartHas(lower, ['اليوم','today'])) newsState.time = 'h24';
          else if (smartHas(lower, ['هذا الاسبوع','هذا الأسبوع','this week'])) newsState.time = 'd7';
          else if (smartHas(lower, ['هذا الشهر','this month'])) newsState.time = 'd30';
          if (smartHas(lower, ['الأحدث','الاحدث','latest'])) newsState.sort = 'date';
        } else if (detected?.mode === 'images') {
          imageState.allWords = query;
          if (smartHas(lower, ['كبير','كبيرة','large'])) imageState.size = 'l';
          if (smartHas(lower, ['ملون','ملونة','color'])) imageState.colorType = 'color';
          if (smartHas(lower, ['ابيض واسود','أبيض وأسود','gray','black and white'])) imageState.colorType = 'gray';
          if (smartHas(lower, ['وجه','faces','face'])) imageState.type = 'face';
          if (smartHas(lower, ['مجاني','free'])) imageState.rights = 'f';
          if (smartHas(lower, ['شفاف','transparent'])) imageState.colorType = 'trans';
          if (smartHas(lower, ['png'])) imageState.fileType = 'png';
          if (smartHas(lower, ['jpg','jpeg'])) imageState.fileType = 'jpg';
        }

        // طبقة فيديو مستقلة: يمكن تركيب عدة شروط في استعلام واحد.
        if (detected?.mode === 'videos') {
          const hasLong = smartHas(lower, ['أكثر من 20 دقيقة','اكثر من 20 دقيقه','20 دقيقة','20 دقيقه','long']);
          const has4k = smartHas(lower, ['4k']);
          const hasHd = smartHas(lower, ['hd']);
          const hasViews = smartHas(lower, ['الاكثر مشاهدة','الأكثر مشاهدة','عدد المشاهدات','مشاهدات','most viewed','views']);
          if (hasLong && has4k && hasHd) selectSmartLink(smartFilterLinks.long4kHd);
          else if (hasLong && has4k) selectSmartLink(smartFilterLinks.long4k);
          else if (hasLong && hasViews) selectSmartLink(smartFilterLinks.longViews);
          else if (hasViews) selectSmartLink(smartFilterLinks.views);
          else if (hasLong) selectSmartLink(smartFilterLinks.long);
          else if (has4k) selectSmartLink(smartFilterLinks['4k']);
          else if (hasHd) selectSmartLink(smartFilterLinks.hd);
          else if (hasViews) selectSmartLink(smartFilterLinks.views);
          else if (smartHas(lower, [
            'كيف اصنع','كيف اسوي','كيف اعمل','طريقة صنع','طريقة صناعة','كيفية صنع','كيفية صناعة',
            'كيف يصنع','كيف تصنع','شرح','شرح كامل','شرح بالتفصيل','شرح للمبتدئين',
            'خطوة بخطوة','طريقة عمل','طريقة استخدام','طريقة تركيب','طريقة اصلاح','طريقة إصلاح',
            'حل مشكلة','تعلم','دروس','درس','tutorial','how to','how do i','how to make',
            'how to use','step by step','beginner guide','full tutorial','guide'
          ])) selectSmartLink(smartFilterLinks.views);
          else if (smartHas(lower, ['فيلم كامل','مسلسل كامل','حلقة كاملة'])) selectSmartLink(smartFilterLinks.movie);
        } else if (detected?.mode === 'web' || !detected) {
          // لا نغيّر البحث العام إلى فيديو لمجرد كلمة غير حاسمة.
          if (suggestions.length && suggestions.some(s => s.linkIndex !== undefined)) {
            const firstLink = suggestions.find(s => s.linkIndex !== undefined);
            selectSmartLink(firstLink.linkIndex);
          }
        }

        // طبق جميع الفلاتر الخاصة بالنوع حتى عند وجود رابط مركب.
        suggestions.forEach(s => {
          if (s.fileType) advancedState.fileType = s.fileType;
        });

        return { detected, suggestions };
      }

      const contextualSuggestions = {
        maps: [
          { id: 'maps-rating-4', icon: '⭐', label: '4+ نجوم', apply: () => { mapState.rating = '4'; } },
          { id: 'maps-open-now', icon: '🕐', label: 'مفتوح الآن', apply: () => { mapState.hours = 'open'; } },
          { id: 'maps-budget', icon: '💰', label: 'اقتصادي', apply: () => { mapState.price = '1'; } },
          { id: 'maps-restaurants', icon: '🍽️', label: 'مطاعم', apply: () => { mapState.category = 'restaurants'; } }
        ],
        news: [
          { id: 'news-last-hour', icon: '⏰', label: 'آخر ساعة', apply: () => { newsState.time = 'h'; } },
          { id: 'news-today', icon: '📅', label: 'اليوم', apply: () => { newsState.time = 'h24'; } },
          { id: 'news-week', icon: '📆', label: 'هذا الأسبوع', apply: () => { newsState.time = 'd7'; } },
          { id: 'news-latest', icon: '🔥', label: 'الأحدث', apply: () => { newsState.sort = 'date'; } }
        ],
        images: [
          { id: 'images-large', icon: '📐', label: 'كبير', apply: () => { imageState.size = 'l'; } },
          { id: 'images-color', icon: '🎨', label: 'ملون', apply: () => { imageState.colorType = 'color'; } },
          { id: 'images-face', icon: '👤', label: 'وجه', apply: () => { imageState.type = 'face'; } },
          { id: 'images-free', icon: '⚖️', label: 'مجاني', apply: () => { imageState.rights = 'f'; } }
        ],
        videos: [
          { id: 'videos-views', icon: '🔥', label: 'الترتيب حسب عدد المشاهدات', linkIndex: 1, apply: () => selectSmartLink(1) },
          { id: 'videos-long', icon: '🎬', label: 'أكثر من 20 دقيقة', linkIndex: 12, apply: () => selectSmartLink(12) },
          { id: 'videos-4k', icon: '🎥', label: '4K', linkIndex: 13, apply: () => selectSmartLink(13) },
          { id: 'videos-hd', icon: '📺', label: 'HD', linkIndex: 15, apply: () => selectSmartLink(15) },
          { id: 'videos-long-4k-hd', icon: '💎', label: 'أكثر من 20 دقيقة + 4K + HD', linkIndex: 21, apply: () => selectSmartLink(21) },
          { id: 'videos-short', icon: '⏱️', label: 'قصير', linkIndex: 10, apply: () => selectSmartLink(10) },
          { id: 'videos-live', icon: '🔴', label: 'مباشر', linkIndex: 26, apply: () => selectSmartLink(26) }
        ],
        web: [
          { id: 'web-pdf', icon: '📄', label: 'PDF', apply: () => { advancedState.fileType = 'pdf'; } },
          { id: 'web-year', icon: '📅', label: 'هذا العام', apply: () => { filterState.date = ['year']; } },
          { id: 'web-news', icon: '📰', label: 'أخبار', apply: () => { advancedState.allWords = 'أخبار'; } }
        ]
      };

      // =====================================================
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
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAllFilterClick(item);
          });
        });
        if (filterSearchInput) {
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

      // =====================================================
      // URL BUILDERS (لبحث الويب/الأخبار/الصور/الخرائط)
      // =====================================================
      function buildAdvancedQuery(baseQuery) {
        const parts = [];
        if (advancedState.allWords) parts.push(advancedState.allWords.trim());
        if (advancedState.exactPhrase) parts.push('"' + advancedState.exactPhrase.trim() + '"');
        if (advancedState.anyWords) {
          const words = advancedState.anyWords.split(/[|,،\s]+/).filter(Boolean);
          if (words.length > 0) parts.push('(' + words.join(' OR ') + ')');
        }
        if (advancedState.noneWords) {
          const words = advancedState.noneWords.split(/[\s,،]+/).filter(Boolean);
          words.forEach(w => parts.push('-' + w));
        }
        if (advancedState.numbers) parts.push(advancedState.numbers.trim());
        if (advancedState.site) parts.push('site:' + advancedState.site.trim());
        if (advancedState.fileType) {
          const fileTypeGroups = {
            pdf: ['pdf'],
            doc: ['doc', 'docx'],
            xls: ['xls', 'xlsx'],
            ppt: ['ppt', 'pptx'],
            txt: ['txt']
          };
          const extensions = fileTypeGroups[advancedState.fileType] || [advancedState.fileType];
          parts.push(extensions.length === 1
            ? 'filetype:' + extensions[0]
            : '(' + extensions.map(ext => 'filetype:' + ext).join(' OR ') + ')');
        }
        if (parts.length === 0) return baseQuery;
        if (baseQuery && !advancedState.allWords && !advancedState.exactPhrase && !advancedState.anyWords && !advancedState.numbers) {
          parts.unshift(baseQuery);
        }
        return parts.join(' ');
      }

      function buildNewsQuery(baseQuery) {
        const parts = [];
        if (newsState.allWords) parts.push(newsState.allWords.trim());
        if (newsState.exactPhrase) parts.push('"' + newsState.exactPhrase.trim() + '"');
        if (newsState.site) parts.push('site:' + newsState.site.trim());
        if (parts.length === 0) return baseQuery;
        if (baseQuery && !newsState.allWords && !newsState.exactPhrase) parts.unshift(baseQuery);
        return parts.join(' ');
      }

      function googleSearchURL(query) {
        const finalQuery = buildAdvancedQuery(String(query || ''));
        const params = [];
        const types = filterState.type || [];
        if (types.some(t => ['video', 'live', 'shorts', 'playlist'].includes(t))) params.push('tbm=vid');
        const dates = filterState.date || [];
        const dateMap = { hour: 'qdr:h', today: 'qdr:d', week: 'qdr:w', month: 'qdr:m', year: 'qdr:y' };
        const datePriority = ['hour', 'today', 'week', 'month', 'year'];
        for (const d of datePriority) {
          if (dates.includes(d) && dateMap[d]) { params.push('tbs=' + dateMap[d]); break; }
        }
        if (advancedState.lastUpdate) {
          const advMap = { d: 'qdr:d', w: 'qdr:w', m: 'qdr:m', y: 'qdr:y' };
          if (advMap[advancedState.lastUpdate]) {
            const i = params.findIndex(p => p.startsWith('tbs='));
            const v = advMap[advancedState.lastUpdate];
            if (i >= 0) params[i] += ',' + v; else params.push('tbs=' + v);
          }
        }
        if (advancedState.lang) params.push('lr=lang_' + advancedState.lang);
        if (advancedState.usageRights) {
          const i = params.findIndex(p => p.startsWith('tbs='));
          if (i >= 0) params[i] += ',sur:' + advancedState.usageRights;
          else params.push('tbs=sur:' + advancedState.usageRights);
        }
        const q = encodeURIComponent(finalQuery.trim()).replace(/%20/g, '+');
        return 'https://www.google.com/search?q=' + q + (params.length ? '&' + params.join('&') : '');
      }

      function newsSearchURL(query) {
        const finalQuery = buildNewsQuery(String(query || ''));
        const q = encodeURIComponent(finalQuery.trim()).replace(/%20/g, '+');
        const timeMap = { h: 'when:1h', h24: 'when:1d', d7: 'when:7d', d30: 'when:1m', y1: 'when:1y', archive: 'when:archive' };
        const params = [];
        if (newsState.time !== 'all' && timeMap[newsState.time]) params.push(timeMap[newsState.time]);
        if (newsState.sort === 'date') params.push('sort:date');
        let url = 'https://news.google.com/search?q=' + q;
        if (params.length) url += '&' + params.join('&');
        return url;
      }

      function imageSearchURL(query) {
        const parts = [String(query || '')];
        if (imageState.allWords) parts.push(imageState.allWords);
        if (imageState.site) parts.push('site:' + imageState.site);
        if (imageState.fileType) parts.push('filetype:' + imageState.fileType);
        const finalQuery = parts.filter(Boolean).join(' ');
        const tbs = [];
        if (imageState.size !== 'all') {
          const sizeMap = {
            l: 'isz:l', m: 'isz:m', i: 'isz:i',
            '2mp': 'isz:lt,islt:2mp', '8mp': 'isz:lt,islt:8mp', '20mp': 'isz:lt,islt:20mp'
          };
          if (sizeMap[imageState.size]) tbs.push(sizeMap[imageState.size]);
        }
        if (imageState.exactWidth && imageState.exactHeight) {
          tbs.push(`isz:ex,iszw:${imageState.exactWidth},iszh:${imageState.exactHeight}`);
        } else if (imageState.exactWidth) tbs.push(`isz:ex,iszw:${imageState.exactWidth}`);
        else if (imageState.exactHeight) tbs.push(`isz:ex,iszh:${imageState.exactHeight}`);
        if (imageState.aspect !== 'all') {
          const aspectMap = { tall: 'iar:t', square: 'iar:s', wide: 'iar:w', panoramic: 'iar:xw' };
          if (aspectMap[imageState.aspect]) tbs.push(aspectMap[imageState.aspect]);
        }
        if (imageState.color !== 'all') tbs.push('ic:specific,isc:' + imageState.color);
        if (imageState.colorType !== 'all') {
          const cMap = { color: 'ic:color', gray: 'ic:gray', trans: 'ic:trans' };
          if (cMap[imageState.colorType]) tbs.push(cMap[imageState.colorType]);
        }
        if (imageState.type !== 'all') {
          const tMap = { face: 'itp:face', photo: 'itp:photo', clipart: 'itp:clipart', lineart: 'itp:lineart', animated: 'itp:animated' };
          if (tMap[imageState.type]) tbs.push(tMap[imageState.type]);
        }
        if (imageState.rights !== 'all') tbs.push('sur:' + imageState.rights);
        if (imageState.time !== 'all') {
          const timeMap = { d: 'qdr:d', w: 'qdr:w', m: 'qdr:m', y: 'qdr:y' };
          if (timeMap[imageState.time]) tbs.push(timeMap[imageState.time]);
        }
        const params = ['tbm=isch'];
        if (tbs.length) params.push('tbs=' + tbs.join(','));
        if (imageState.lang) params.push('lr=lang_' + imageState.lang);
        if (imageState.region) params.push('cr=country' + imageState.region.toUpperCase());
        if (imageState.safe === 'active') params.push('safe=active');
        const q = encodeURIComponent(finalQuery.trim()).replace(/%20/g, '+');
        return 'https://www.google.com/search?q=' + q + '&' + params.join('&');
      }

      function mapSearchURL(query) {
        let searchQuery = mapState.place || query || '';
        if (mapState.near) searchQuery += ' near ' + mapState.near;
        const params = [];
        if (mapState.near) params.push('near=' + encodeURIComponent(mapState.near));
        if (mapState.category) params.push('category=' + mapState.category);
        if (mapState.rating !== '0') params.push('min_rating=' + mapState.rating);
        if (mapState.hours === 'open') params.push('open_now=1');
        if (mapState.hours === '24h') params.push('open_24h=1');
        if (mapState.price !== 'all') params.push('price=' + mapState.price);
        if (mapState.sort !== 'relevance') params.push('sort=' + mapState.sort);
        let url = 'https://www.google.com/maps/search/' + encodeURIComponent(searchQuery.trim()).replace(/%20/g, '+');
        if (params.length) url += '?' + params.join('&');
        return url;
      }

      // ⭐⭐⭐ بناء روابط متعددة من selectedLinksState ⭐⭐⭐
      function buildSelectedLinksURLs(query) {
        const urls = [];
        Object.keys(selectedLinksState.selected).forEach(key => {
          if (!selectedLinksState.selected[key]) return;
          const idx = Number(key.replace('link:', ''));
          if (isNaN(idx)) return;
          urls.push({
            index: idx,
            name: searches[idx]?.name || '',
            url: generateAdvancedLink(query, idx)
          });
        });
        return urls;
      }

      function buildSearchURL(mode, query) {
        switch (mode) {
          case 'images': return imageSearchURL(query);
          case 'news': return newsSearchURL(query);
          case 'maps': return mapSearchURL(query);
          case 'videos':
          case 'smart': {
            const detected = mode === 'smart' ? detectSearchMode(query) : null;
            const effectiveMode = detected ? detected.mode : (mode === 'videos' ? 'videos' : 'web');
            if (effectiveMode === 'images') return imageSearchURL(query);
            if (effectiveMode === 'news') return newsSearchURL(query);
            if (effectiveMode === 'maps') return mapSearchURL(query);
            if (effectiveMode === 'videos' || mode === 'videos') {
              // ⭐ استخدم أول رابط مختار أو الرابط الافتراضي
              const selected = buildSelectedLinksURLs(query);
              if (selected.length > 0) return selected[0].url;
              return generateAdvancedLink(query, 0);
            }
            return googleSearchURL(query);
          }
          case 'web':
          default: return googleSearchURL(query);
        }
      }

      // =====================================================
      // GET ACTIVE FILTERS
      // =====================================================
      function getActiveFilters() {
        const active = [];
        if (filterState.sort && filterState.sort !== 'date') {
          active.push({ key: 'sort', value: filterState.sort, label: 'ترتيب: ' + (filterLabels[currentLang].sort?.[filterState.sort] || filterState.sort), type: 'simple', multi: false });
        }
        (filterState.type || []).forEach(v => active.push({ key: 'type', value: v, label: 'نوع: ' + (filterLabels[currentLang].type?.[v] || v), type: 'simple', multi: true }));
        (filterState.duration || []).forEach(v => active.push({ key: 'duration', value: v, label: 'مدة: ' + (filterLabels[currentLang].duration?.[v] || v), type: 'simple', multi: true }));
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

      function renderActiveFiltersBar() {
        const active = getActiveFilters();
        activeFiltersBar.innerHTML = '';
        if (active.length === 0) {
          activeFiltersBar.classList.remove('show');
          filterBadge.style.display = 'none';
          return;
        }
        activeFiltersBar.classList.add('show');
        filterBadge.style.display = 'flex';
        filterBadge.textContent = active.length;

        const label = document.createElement('span');
        label.className = 'active-filters-label';
        label.textContent = langStrings[currentLang].activeFiltersLabel;
        activeFiltersBar.appendChild(label);

        active.slice(0, 12).forEach(filter => {
          const chip = document.createElement('span');
          chip.className = 'active-filter-chip';
          const text = document.createElement('span');
          text.textContent = filter.label.length > 30 ? filter.label.substring(0, 30) + '…' : filter.label;
          chip.appendChild(text);
          const closeBtn = document.createElement('span');
          closeBtn.className = 'chip-close';
          closeBtn.textContent = '×';
          closeBtn.addEventListener('click', () => {
            if (filter.type === 'simple') {
              if (filter.multi) {
                const arr = filterState[filter.key];
                const idx = arr.indexOf(filter.value);
                if (idx > -1) arr.splice(idx, 1);
              } else {
                filterState[filter.key] = filter.key === 'sort' ? 'date' : 'all';
              }
              setFilterButtonVisuals(filterState);
              saveCurrentStateToMode();
            } else if (filter.type === 'advanced') {
              advancedState[filter.key] = '';
              syncAdvancedInputs();
              saveCurrentStateToMode();
            } else if (filter.type === 'news') {
              newsState[filter.key] = ['time', 'sort'].includes(filter.key) ? (filter.key === 'sort' ? 'relevance' : 'all') : '';
              syncNewsInputs();
              saveCurrentStateToMode();
            } else if (filter.type === 'image') {
              const allKeys = ['size', 'colorType', 'type', 'rights', 'time', 'aspect', 'color', 'safe'];
              imageState[filter.key] = allKeys.includes(filter.key) ? 'all' : '';
              syncImageInputs();
              saveCurrentStateToMode();
            } else if (filter.type === 'map') {
              mapState[filter.key] = ['rating', 'hours', 'price', 'sort'].includes(filter.key) ? (filter.key === 'sort' ? 'relevance' : (filter.key === 'rating' ? '0' : 'all')) : '';
              syncMapInputs();
              saveCurrentStateToMode();
            } else if (filter.type === 'link') {
              delete selectedLinksState.selected[filter.value];
              updateAllFiltersUI();
              saveCurrentStateToMode();
            }
            updateFilterSummary();
            renderActiveFiltersBar();
            showToast(langStrings[currentLang].toastFilterRemoved);
          });
          chip.appendChild(closeBtn);
          activeFiltersBar.appendChild(chip);
        });

        if (active.length > 12) {
          const more = document.createElement('span');
          more.className = 'active-filters-label';
          more.textContent = `+${active.length - 12} أكثر`;
          activeFiltersBar.appendChild(more);
        }
      }

      // =====================================================
      // SYNC FILTER TAB
      // =====================================================
      function syncFilterTabWithMode(modeId) {
        const modeToTabMap = {
          'smart': 'quick',
          'web': 'web',
          'news': 'news',
          'images': 'images',
          'maps': 'maps',
          'videos': 'all-filters'
        };
        const targetTab = modeToTabMap[modeId] || 'quick';
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.filter-panel').forEach(p => p.classList.remove('active'));
        const tabBtn = document.querySelector(`.filter-tab[data-tab="${targetTab}"]`);
        if (tabBtn) tabBtn.classList.add('active');
        const panel = document.querySelector(`.filter-panel[data-panel="${targetTab}"]`);
        if (panel) panel.classList.add('active');
      }

      function attachModeTabListeners() {
        if (!searchModes || searchModes.dataset.modeTabsInitialized === '1') return;
        searchModes.dataset.modeTabsInitialized = '1';

        searchModes.addEventListener('click', (e) => {
          const tab = e.target.closest('.mode-tab[data-mode]');
          if (!tab || !searchModes.contains(tab)) return;

          e.preventDefault();
          e.stopPropagation();

          const modeId = tab.dataset.mode;
          const modeInfo = searchModesConfig.find(m => m.id === modeId);
          if (!modeInfo) return;

          switchMode(modeId);

          const label = currentLang === 'ar' ? modeInfo.label : modeInfo.labelEn;
          showToast(langStrings[currentLang].toastModeSwitched + label);
        });
      }

      if (filterTabs) {
        filterTabs.addEventListener('click', (e) => {
          const tab = e.target.closest('.filter-tab');
          if (!tab) return;
          e.preventDefault();
          e.stopPropagation();
          const tabName = tab.dataset.tab;
          document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          document.querySelectorAll('.filter-panel').forEach(p => p.classList.remove('active'));
          const panel = document.querySelector(`.filter-panel[data-panel="${tabName}"]`);
          if (panel) panel.classList.add('active');
        });
      }

      function renderContextualFilters() {
        const mode = getActiveMode();
        let suggestions = [];
        let modeKey = mode;

        if (mode === 'smart') {
          // العرض لا يغيّر الحالة؛ التطبيق التلقائي يتم فقط عند تغيّر الاستعلام أو تنفيذ البحث.
          const detected = detectSearchMode(currentQuery || searchInput.value);
          modeKey = detected?.mode || 'web';
          suggestions = getSmartSpecialSuggestions(currentQuery || searchInput.value);
          const generic = contextualSuggestions[modeKey] || [];
          generic.forEach(item => {
            if (!suggestions.some(s => s.id === item.id)) suggestions.push(item);
          });
        } else {
          suggestions = contextualSuggestions[modeKey] || [];
        }

        if (!suggestions.length) {
          contextualFilters.classList.remove('show');
          return;
        }

        contextualFilters.classList.add('show');
        cfLabelText.textContent = mode === 'smart'
          ? (currentLang === 'ar' ? '✨ الفلاتر المناسبة:' : '✨ Relevant filters:')
          : langStrings[currentLang].cfLabelText;
        cfChips.innerHTML = '';

        suggestions.slice(0, 8).forEach(sug => {
          const chip = document.createElement('button');
          chip.className = 'cf-chip';
          chip.innerHTML = `<span class="chip-icon">${sug.icon}</span><span>${sug.label}</span>`;

          const isLinkActive = sug.linkIndex !== undefined &&
            !!selectedLinksState.selected['link:' + sug.linkIndex];
          const isFileActive = sug.id && sug.id.startsWith('smart-file-') && !!advancedState.fileType;
          const isImageFreeActive = sug.id === 'smart-images-free' && imageState.rights === 'f';
          const isWebFreeActive = sug.id === 'smart-web-free' && advancedState.usageRights === 'f';
          const isGenericActive = (
            sug.id === 'videos-views' && !!selectedLinksState.selected['link:1']
          );
          if (isLinkActive || isFileActive || isImageFreeActive || isWebFreeActive || isGenericActive) {
            chip.classList.add('active');
          }

          chip.addEventListener('click', () => {
            if (sug.linkIndex !== undefined) {
              selectSmartLink(sug.linkIndex);
            } else {
              sug.apply();
            }
            saveCurrentStateToMode();
            updateFilterSummary();
            renderActiveFiltersBar();
            updateAllFiltersUI();
            renderContextualFilters();
          });
          cfChips.appendChild(chip);
        });

        if (mode === 'smart') {
          const hint = document.createElement('span');
          hint.className = 'cf-auto-hint';
          hint.textContent = currentLang === 'ar' ? 'تُطبّق تلقائيًا قبل فتح النتائج' : 'Applied automatically before opening results';
          cfChips.appendChild(hint);
        }
      }

      function updateSmartIndicator() {
        const mode = getActiveMode();
        if (mode !== 'smart') { smartIndicator.classList.remove('show'); return; }
        const detected = detectSearchMode(searchInput.value);
        if (detected) {
          smartIndicator.classList.add('show');
          smartIndicatorText.textContent = (currentLang === 'ar' ? 'وضع ذكي: ' : 'Smart: ') + detected.config.label;
        } else {
          smartIndicator.classList.remove('show');
        }
      }

      // =====================================================
      // PRESETS
      // =====================================================
      function renderPresets() {
        presetsBar.innerHTML = '';
        const label = document.createElement('span');
        label.className = 'presets-label';
        label.innerHTML = '<span>⭐</span><span>' + (currentLang === 'ar' ? 'Presets:' : 'Presets:') + '</span>';
        presetsBar.appendChild(label);

        if (presets.length === 0) {
          const empty = document.createElement('span');
          empty.style.color = 'var(--muted-2)';
          empty.style.fontSize = '12px';
          empty.textContent = langStrings[currentLang].noPresets;
          presetsBar.appendChild(empty);
        }

        presets.forEach((preset, idx) => {
          const chip = document.createElement('button');
          chip.className = 'preset-chip';
          chip.innerHTML = `<span>✨</span><span>${escapeHTML(preset.name)}</span><span class="preset-close" data-idx="${idx}">×</span>`;
          chip.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-close')) {
              e.stopPropagation();
              presets.splice(idx, 1);
              localStorage.setItem('sh_presets', JSON.stringify(presets));
              renderPresets();
              showToast(langStrings[currentLang].toastPresetDeleted);
              return;
            }
            if (preset.mode && modeFilters[preset.mode] && preset.modeState) {
              modeFilters[preset.mode] = { ...createDefaultFilterState(), ...preset.modeState };
              if (preset.mode === getActiveMode()) loadStateFromMode(getActiveMode());
              else { setActiveMode(preset.mode); loadStateFromMode(preset.mode); }
              saveCurrentStateToMode();
              setFilterButtonVisuals(filterState);
              syncAllInputs();
              updateFilterSummary();
              renderActiveFiltersBar();
              renderContextualFilters();
              updateAllFiltersUI();
              syncFilterTabWithMode(getActiveMode());
              showToast(langStrings[currentLang].toastPresetApplied);
            }
          });
          presetsBar.appendChild(chip);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'preset-add';
        addBtn.innerHTML = '<span>+</span><span>' + (currentLang === 'ar' ? 'جديد' : 'New') + '</span>';
        addBtn.addEventListener('click', () => savePreset());
        presetsBar.appendChild(addBtn);
      }

      function savePreset() {
        const name = prompt(currentLang === 'ar' ? 'اسم الـ Preset:' : 'Preset name:');
        if (!name || !name.trim()) return;
        saveCurrentStateToMode();
        const mode = getActiveMode();
        presets.push({
          name: name.trim(),
          mode: mode,
          modeState: JSON.parse(JSON.stringify(modeFilters[mode]))
        });
        localStorage.setItem('sh_presets', JSON.stringify(presets));
        renderPresets();
        showToast(langStrings[currentLang].toastPresetSaved);
      }

      // =====================================================
      // SUGGESTIONS
      // =====================================================
      const baseSuggestions = {
        ar: [
          { text: 'مطاعم قريبة', hint: '🗺️ خرائط' }, { text: 'أخبار اليوم', hint: '📰 أخبار' },
          { text: 'صور طبيعة', hint: '🖼️ صور' }, { text: 'فيديو تعليمي', hint: '🎬 فيديو' },
          { text: 'أسعار الذهب', hint: '🌐 ويب' }, { text: 'فنادق بالقرب', hint: '🗺️ خرائط' },
          { text: 'الدوري الإنجليزي', hint: '📰 أخبار' }, { text: 'خلفيات 4K', hint: '🖼️ صور' },
          { text: 'الذكاء الاصطناعي', hint: '🌐 ويب' }, { text: 'مقاهي', hint: '🗺️ خرائط' }
        ],
        en: [
          { text: 'Nearby restaurants', hint: '🗺️ Maps' }, { text: 'Today news', hint: '📰 News' },
          { text: 'Nature images', hint: '🖼️ Images' }, { text: 'Educational video', hint: '🎬 Videos' },
          { text: 'Gold price', hint: '🌐 Web' }, { text: 'Hotels nearby', hint: '🗺️ Maps' },
          { text: 'Premier League', hint: '📰 News' }, { text: '4K wallpapers', hint: '🖼️ Images' },
          { text: 'Artificial intelligence', hint: '🌐 Web' }, { text: 'Cafes', hint: '🗺️ Maps' }
        ]
      };

      function showSuggestions() {
        const rawQuery = searchInput.value;
        const query = rawQuery.trim();
        suggestionsDropdown.innerHTML = '';
        if (query.length === 0) {
          suggestionsDropdown.classList.remove('show');
          updateSmartIndicator();
          return;
        }
        const lowerQuery = query.toLowerCase();
        const suggestions = baseSuggestions[currentLang] || baseSuggestions.ar;
        const filtered = suggestions.filter(s => s.text.toLowerCase().includes(lowerQuery));

        const detected = detectSearchMode(query);
        if (detected) {
          const smartItem = document.createElement('div');
          smartItem.className = 'suggestion-item';
          smartItem.innerHTML = `
            <span class="icon">${detected.config.icon}</span>
            <span><span class="highlight">${escapeHTML(query)}</span></span>
            <span class="suggestion-hint">${currentLang === 'ar' ? 'وضع ذكي: ' : 'Smart: '}${detected.config.label}</span>
          `;
          smartItem.addEventListener('mousedown', (e) => {
            e.preventDefault();
            switchMode(detected.mode);
            searchInput.value = query;
            suggestionsDropdown.classList.remove('show');
            performSearch(query);
          });
          suggestionsDropdown.appendChild(smartItem);
        }

        const allSuggestions = [query, ...filtered.filter(s => s.text !== query).map(s => s.text)];

        allSuggestions.slice(0, 8).forEach((text, idx) => {
          if (idx === 0 && detected) return;
          const el = document.createElement('div');
          el.className = 'suggestion-item';
          const matchedSug = suggestions.find(s => s.text === text);
          const lowerText = text.toLowerCase();
          const matchIdx = lowerText.indexOf(lowerQuery);
          let highlighted = escapeHTML(text);
          if (matchIdx !== -1) {
            const before = escapeHTML(text.slice(0, matchIdx));
            const match = escapeHTML(text.slice(matchIdx, matchIdx + query.length));
            const after = escapeHTML(text.slice(matchIdx + query.length));
            highlighted = `${before}<span class="highlight">${match}</span>${after}`;
          }
          el.innerHTML = `
            <span class="icon">🔍</span>
            <span>${highlighted}</span>
            ${matchedSug ? `<span class="suggestion-hint">${matchedSug.hint}</span>` : ''}
          `;
          el.addEventListener('mousedown', (e) => {
            e.preventDefault();
            searchInput.value = text;
            suggestionsDropdown.classList.remove('show');
            performSearch(text);
          });
          suggestionsDropdown.appendChild(el);
        });
        suggestionsDropdown.classList.add('show');
        updateSmartIndicator();
      }

      function hideSuggestions() {
        setTimeout(() => suggestionsDropdown.classList.remove('show'), 200);
      }

      // =====================================================
      // SEARCH — ⭐ يستخدم الروابط المختارة من searches
      // =====================================================
      function performSearch(term) {
        const query = (term || searchInput.value).trim();
        if (!query) { showToast(langStrings[currentLang].toastEmpty); return; }
        currentQuery = query;
        const mode = getActiveMode();

        if (mode === 'smart') {
          applySmartIntent(query, { reset: true });
          saveCurrentStateToMode();
          syncAllInputs();
          updateAllFiltersUI();
          updateFilterSummary();
          renderActiveFiltersBar();
        }

        const selectedLinks = buildSelectedLinksURLs(query);
        if (selectedLinks.length > 0 && (mode === 'videos' || mode === 'smart')) {
          selectedLinks.slice(0, 5).forEach(link => window.open(link.url, '_blank'));
          emptyState.style.display = 'none';
          lastUpdated.textContent = new Date().toLocaleString(currentLang === 'ar' ? 'ar' : 'en');
          const modeInfo = searchModesConfig.find(m => m.id === mode);
          if (modeInfo) {
            const label = currentLang === 'ar' ? modeInfo.label : modeInfo.labelEn;
            showToast(`${langStrings[currentLang].toastSearchIn}${label} (${selectedLinks.length})`);
          }
          renderContextualFilters();
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
        renderContextualFilters();
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

      // =====================================================
      // DRAWER OPEN/CLOSE
      // =====================================================
      function openFilterDrawer() {
        const mode = getActiveMode();
        pendingFilterState = {
          sort: filterState.sort,
          type: [...(filterState.type || [])],
          duration: [...(filterState.duration || [])],
          date: [...(filterState.date || [])],
          quality: [...(filterState.quality || [])],
          feature: [...(filterState.feature || [])]
        };
        setFilterButtonVisuals(pendingFilterState);
        filterOverlay.classList.add('open');
        filterBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        syncFilterTabWithMode(mode);
        setTimeout(() => syncFilterTabWithMode(mode), 100);
        setTimeout(() => syncFilterTabWithMode(mode), 260);
      }

      function closeFilterDrawer() {
        filterOverlay.classList.remove('open');
        filterBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }

      function applyFilters() {
        collectAdvancedInputs();
        collectNewsInputs();
        collectImageInputs();
        collectMapInputs();

        filterState = { ...pendingFilterState };
        ['type', 'duration', 'date', 'quality', 'feature'].forEach(k => {
          if (!Array.isArray(filterState[k])) filterState[k] = [];
        });

        saveCurrentStateToMode();
        closeFilterDrawer();
        updateFilterSummary();
        renderActiveFiltersBar();
        showToast(langStrings[currentLang].toastFiltersApplied);
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

      // =====================================================
      // COMMAND PALETTE
      // =====================================================
      const commands = [
        { icon: '🔍', name: 'بحث', nameEn: 'Search', shortcut: 'Ctrl+K', action: () => searchInput.focus() },
        { icon: '🌐', name: 'ترجمة + بحث', nameEn: 'Translate + Search', action: () => performTranslateAndSearch() },
        { icon: '✨', name: 'وضع ذكي', nameEn: 'Smart mode', action: () => { switchMode('smart'); } },
        { icon: '🌐', name: 'وضع الويب', nameEn: 'Web mode', action: () => { switchMode('web'); } },
        { icon: '📰', name: 'وضع الأخبار', nameEn: 'News mode', action: () => { switchMode('news'); } },
        { icon: '🖼️', name: 'وضع الصور', nameEn: 'Images mode', action: () => { switchMode('images'); } },
        { icon: '🗺️', name: 'وضع الخرائط', nameEn: 'Maps mode', action: () => { switchMode('maps'); } },
        { icon: '🎬', name: 'وضع الفيديو', nameEn: 'Videos mode', action: () => { switchMode('videos'); } },
        { icon: '🎛️', name: 'بحث متقدم', nameEn: 'Advanced search', action: () => openFilterDrawer() },
        { icon: '🔄', name: 'إعادة ضبط', nameEn: 'Reset filters', action: () => resetAllFilters() },
        { icon: '🌙', name: 'تبديل الوضع الليلي', nameEn: 'Toggle dark mode', action: () => themeToggle.click() },
        { icon: '🇸🇦', name: 'العربية', nameEn: 'Arabic', action: () => switchLanguage('ar') },
        { icon: '🇬🇧', name: 'English', nameEn: 'English', action: () => switchLanguage('en') },
        { icon: '💾', name: 'حفظ Preset', nameEn: 'Save preset', action: () => savePreset() }
      ];

      function openCmdPalette() {
        cmdBackdrop.classList.add('show');
        cmdPalette.classList.add('show');
        cmdSearchInput.value = '';
        renderCmdResults('');
        setTimeout(() => cmdSearchInput.focus(), 50);
      }
      function closeCmdPalette() {
        cmdBackdrop.classList.remove('show');
        cmdPalette.classList.remove('show');
      }

      function renderCmdResults(query) {
        const lower = query.toLowerCase();
        const filtered = commands.filter(c => c.name.toLowerCase().includes(lower) || c.nameEn.toLowerCase().includes(lower));
        cmdResults.innerHTML = '';
        if (filtered.length === 0) {
          cmdResults.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px;">لا توجد نتائج</div>';
          return;
        }
        const group = document.createElement('div');
        group.className = 'cmd-group';
        group.textContent = currentLang === 'ar' ? 'الأوامر' : 'Commands';
        cmdResults.appendChild(group);
        filtered.forEach((cmd, idx) => {
          const item = document.createElement('div');
          item.className = `cmd-item ${idx === cmdActiveIndex ? 'active' : ''}`;
          item.innerHTML = `
            <span class="cmd-icon">${cmd.icon}</span>
            <span class="cmd-name">${escapeHTML(currentLang === 'ar' ? cmd.name : cmd.nameEn)}</span>
            ${cmd.shortcut ? `<span class="cmd-shortcut">${cmd.shortcut}</span>` : ''}
          `;
          item.addEventListener('click', () => { closeCmdPalette(); cmd.action(); });
          cmdResults.appendChild(item);
        });
      }

      // =====================================================
      // SEARCH CONTROLS
      // =====================================================
      function attachSearchListeners() {
        if (!searchBtn || !searchInput) return;
        if (searchBtn.dataset.searchInitialized === '1') return;
        searchBtn.dataset.searchInitialized = '1';

        searchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          performSearch();
        });

        searchInput.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          suggestionsDropdown.classList.remove('show');
          performSearch();
        });

        searchInput.addEventListener('input', () => {
          currentQuery = searchInput.value.trim();
          if (getActiveMode() === 'smart') {
            applySmartIntent(currentQuery, { reset: true });
            saveCurrentStateToMode();
            updateAllFiltersUI();
            updateFilterSummary();
            renderActiveFiltersBar();
          }
          showSuggestions();
          renderContextualFilters();
        });

        searchInput.addEventListener('focus', () => {
          if (searchInput.value.trim()) showSuggestions();
        });

        searchInput.addEventListener('blur', hideSuggestions);
      }

      // =====================================================
      // LANGUAGE SWITCH
      // =====================================================
      function switchLanguage(lang) {
        if (currentLang === lang) return;
        currentLang = lang;
        const strings = langStrings[lang];
        heroTitle.textContent = strings.heroTitle;
        heroDesc.textContent = strings.heroDesc;
        searchInput.placeholder = strings.searchPlaceholder;
        searchBtn.textContent = strings.search;
        filterBtnLabel.textContent = strings.advancedSearchShort;
        emptyTitle.textContent = strings.emptyTitle;
        emptyText.textContent = strings.emptyText;
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active-lang'));
        document.getElementById(lang === 'ar' ? 'langAr' : 'langEn').classList.add('active-lang');
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        const modeTabs = searchModes.querySelectorAll('.mode-tab');
        modeTabs.forEach(tab => {
          const modeId = tab.dataset.mode;
          const modeInfo = searchModesConfig.find(m => m.id === modeId);
          if (modeInfo) {
            const labelSpan = tab.querySelector('span:last-child');
            if (labelSpan) labelSpan.textContent = lang === 'ar' ? modeInfo.label : modeInfo.labelEn;
          }
        });
        renderQuickSuggestions();
        renderContextualFilters();
        renderPresets();
        updateFilterSummary();
        renderActiveFiltersBar();
        updateAllFiltersUI();
        showToast(strings.toastLangSwitched);
      }

      // =====================================================
      // RENDER QUICK SUGGESTIONS
      // =====================================================
      function renderQuickSuggestions() {
        const strings = langStrings[currentLang];
        quickSuggestions.innerHTML = '';
        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = strings.quickLabel;
        quickSuggestions.appendChild(label);
        strings.quickSuggestions.forEach(text => {
          const chip = document.createElement('button');
          chip.textContent = text;
          chip.addEventListener('click', () => { searchInput.value = text; performSearch(text); });
          quickSuggestions.appendChild(chip);
        });
      }

      // =====================================================
      
      function init() {
        // ⭐ بناء شبكة كافة الفلاتر من searches
        buildAllFiltersGrid();

        const savedTheme = localStorage.getItem('sh_theme');
        if (savedTheme === 'dark') {
          isDark = true;
          document.documentElement.setAttribute('data-theme', 'dark');
          themeToggle.textContent = '☀️';
        } else {
          isDark = false;
          document.documentElement.setAttribute('data-theme', 'light');
          themeToggle.textContent = '🌙';
        }
        const savedPresets = localStorage.getItem('sh_presets');
        if (savedPresets) {
          try { presets = JSON.parse(savedPresets) || []; } catch(e) { presets = []; }
        }
        const savedMode = localStorage.getItem('sh_mode');
        const initialMode = searchModesConfig.some(item => item.id === savedMode) ? savedMode : 'web';
        setActiveMode(initialMode);
        attachModeTabListeners();
        attachSearchListeners();
        attachAllFiltersListeners();
        loadStateFromMode(initialMode);
        setFilterButtonVisuals(filterState);
        updateFilterSummary();
        renderActiveFiltersBar();
        syncAllInputs();
        syncFilterTabWithMode(initialMode);
        renderQuickSuggestions();
        renderContextualFilters();
        renderPresets();
        updateAllFiltersUI();
        lastUpdated.textContent = new Date().toLocaleString(currentLang === 'ar' ? 'ar' : 'en');
        searchInput.focus();

        console.log('✅ searchly — تم تحميل ' + searches.length + ' رابطاً متقدماً');
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

    })();
