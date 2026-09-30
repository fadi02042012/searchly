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
      // تحميل القواعد الخارجية مبكرًا؛ القواعد الاحتياطية تعمل فورًا حتى يكتمل التحميل.
      loadSmartRules();

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

      // =====================================================
      // ✨ SMART RULE ENGINE
      // القواعد قابلة للتعديل من smart-rules.json دون تعديل هذا الملف.
      // =====================================================
      const DEFAULT_SMART_RULES = {
        version: 1,
        settings: { phraseWeight: 5, keywordWeight: 1, tieMinScore: 5, maxSuggestions: 8 },
        modes: {
          maps: { icon: '🗺️', label: 'خرائط', phrases: ['near me','nearby','مطاعم قريبه','فنادق قريبه','بالقرب مني'], keywords: ['مطعم','مطاعم','فندق','فنادق','مقهى','مقاهي','صيدلية','مستشفى','بنك','محطة','restaurant','hotel','cafe','pharmacy','hospital','bank'] },
          news: { icon: '📰', label: 'أخبار', phrases: ['اخبار اليوم','آخر الأخبار','خبر عاجل','latest news','breaking news'], keywords: ['اخبار','أخبار','خبر','عاجل','سياسة','اقتصاد','رياضة','انتخابات','news','breaking','politics','economy','sports'] },
          images: { icon: '🖼️', label: 'صور', phrases: ['صور عالية الجودة','خلفيات عالية الدقة','صور png','صور مجانية','صور كبيرة'], keywords: ['صورة','صور','صوره','خلفية','خلفيات','شعار','تصميم','png','jpg','jpeg','wallpaper','image','images','picture','logo'] },
          videos: { icon: '🎬', label: 'فيديو', phrases: ['فيديو تعليمي','فيديو كامل','فيديو مباشر','بث مباشر','فيلم كامل','مسلسل كامل','شرح كامل','شرح بالتفصيل','خطوة بخطوة','طريقة صنع','كيفية صنع','كيف اصنع','كيف اسوي','مراجعة','مقارنة','tutorial','how to','how to make','documentary'], keywords: ['فيديو','يوتيوب','مقطع','مشاهدة','شاهد','حلقة','فيلم','أفلام','مسلسل','شرح','تعلم','دروس','طريقة','كيفية','مراجعة','مقارنة','وثائقي','video','youtube','watch','tutorial','documentary'] }
        },
        filters: [
          {id:'file-pdf',mode:'web',action:'advancedFileType',icon:'📄',label:'ويب: نوع ملف: PDF',phrases:['ملف pdf','pdf','بي دي اف'],value:'pdf',priority:10},
          {id:'file-doc',mode:'web',action:'advancedFileType',icon:'📄',label:'ويب: نوع ملف: DOC + DOCX',phrases:['ملف doc','ملف docx','doc','docx','وورد','word'],value:'doc',priority:10},
          {id:'file-xls',mode:'web',action:'advancedFileType',icon:'📄',label:'ويب: نوع ملف: XLS + XLSX',phrases:['ملف xls','ملف xlsx','xls','xlsx','اكسل','excel'],value:'xls',priority:10},
          {id:'file-ppt',mode:'web',action:'advancedFileType',icon:'📄',label:'ويب: نوع ملف: PPT + PPTX',phrases:['ملف ppt','ملف pptx','ppt','pptx','باوربوينت','powerpoint'],value:'ppt',priority:10},
          {id:'file-txt',mode:'web',action:'advancedFileType',icon:'📄',label:'ويب: نوع ملف: TXT',phrases:['ملف txt','txt','ملف نصي'],value:'txt',priority:10},
          {id:'free-images',mode:'images',action:'imageRights',icon:'⚖️',label:'صور: مجاني',phrases:['صور مجانية','صورة مجانية'],keywords:['مجاني','free'],value:'f',priority:20},
          {id:'free-web',mode:'web',action:'advancedUsageRights',icon:'⚖️',label:'ويب: مجاني للاستخدام',phrases:['مجاني','free','royalty free'],value:'f',priority:5},
          {id:'4k',mode:'videos',action:'link',icon:'🎥',label:'4K',phrases:['4k','فيديو 4k','دقة 4k'],value:'4k',priority:20},
          {id:'hd',mode:'videos',action:'link',icon:'📺',label:'HD',phrases:['hd','فيديو hd'],value:'hd',priority:20},
          {id:'hdr',mode:'videos',action:'link',icon:'✨',label:'HDR',phrases:['hdr'],value:'hdr',priority:20},
          {id:'360',mode:'videos',action:'link',icon:'🌍',label:'360°',phrases:['360'],value:'360',priority:20},
          {id:'vr180',mode:'videos',action:'link',icon:'🥽',label:'VR180',phrases:['vr180','vr 180'],value:'vr180',priority:20},
          {id:'3d',mode:'videos',action:'link',icon:'🎞️',label:'3D',phrases:['ثلاثي الابعاد','ثلاثي الأبعاد','3d'],value:'3d',priority:20},
          {id:'long',mode:'videos',action:'link',icon:'🎬',label:'أكثر من 20 دقيقة',phrases:['اكثر من 20 دقيقه','أكثر من 20 دقيقة','20 دقيقة','20 دقيقه','long'],value:'long',priority:20},
          {id:'short',mode:'videos',action:'link',icon:'⏱️',label:'أقل من 4 دقائق',phrases:['اقل من 4 دقائق','أقل من 4 دقائق','short'],value:'short',priority:20},
          {id:'medium',mode:'videos',action:'link',icon:'⌛',label:'بين 4 و20 دقيقة',phrases:['بين 4 و20','4-20','4 الى 20','medium'],value:'medium',priority:20},
          {id:'views',mode:'videos',action:'link',icon:'🔥',label:'الترتيب حسب عدد المشاهدات',phrases:['الاكثر مشاهدة','الأكثر مشاهدة','عدد المشاهدات','مشاهدات','most viewed','views'],value:'views',priority:30},
          {id:'rating',mode:'videos',action:'link',icon:'⭐',label:'الترتيب حسب التقييم',phrases:['الأعلى تقييما','الأعلى تقييمًا','اعلى تقييم','تقييم','rating'],value:'rating',priority:20},
          {id:'hour',mode:'videos',action:'link',icon:'🕐',label:'آخر ساعة',phrases:['آخر ساعة','اخر ساعه','الساعة الماضية','last hour'],value:'hour',priority:20},
          {id:'today',mode:'videos',action:'link',icon:'📆',label:'اليوم',phrases:['اليوم','today','24 ساعة','24h'],value:'today',priority:20},
          {id:'week',mode:'videos',action:'link',icon:'📅',label:'هذا الأسبوع',phrases:['هذا الاسبوع','هذا الأسبوع','this week'],value:'week',priority:20},
          {id:'month',mode:'videos',action:'link',icon:'🗓️',label:'هذا الشهر',phrases:['هذا الشهر','this month'],value:'month',priority:20},
          {id:'year',mode:'videos',action:'link',icon:'📖',label:'هذا العام',phrases:['هذا العام','هذه السنة','this year'],value:'year',priority:20},
          {id:'live',mode:'videos',action:'link',icon:'🔴',label:'مباشر',phrases:['بث مباشر','مباشر','live'],value:'live',priority:25},
          {id:'shorts',mode:'videos',action:'link',icon:'🎬',label:'YouTube Shorts',phrases:['shorts','شورتس','شورت'],value:'shorts',priority:25},
          {id:'playlist',mode:'videos',action:'link',icon:'📂',label:'قوائم تشغيل',phrases:['قائمة تشغيل','قوائم تشغيل','playlist','playlists'],value:'playlist',priority:25},
          {id:'channel',mode:'videos',action:'link',icon:'📺',label:'قنوات',phrases:['قناة','قنوات','channel','channels'],value:'channel',priority:25},
          {id:'movie',mode:'videos',action:'link',icon:'🎬',label:'أفلام',phrases:['فيلم','افلام','أفلام','movie','movies'],value:'movie',priority:25},
          {id:'video',mode:'videos',action:'link',icon:'🎥',label:'فيديوهات فقط',phrases:['فيديو','فيديوهات','video','videos'],value:'video',priority:10},
          {id:'instagram',mode:'videos',action:'link',icon:'📷',label:'البحث في Instagram',phrases:['انستقرام','انستجرام','instagram'],value:'instagram',priority:15},
          {id:'instructional',mode:'videos',action:'link',icon:'🔥',label:'الترتيب حسب عدد المشاهدات',phrases:['كيف اصنع','كيف اسوي','كيف اعمل','طريقة صنع','طريقة صناعة','كيفية صنع','كيفية صناعة','كيف يصنع','كيف تصنع','شرح','شرح كامل','شرح بالتفصيل','شرح للمبتدئين','خطوة بخطوة','طريقة عمل','طريقة استخدام','طريقة تركيب','طريقة اصلاح','طريقة إصلاح','حل مشكلة','تعلم','دروس','درس','tutorial','how to','how do i','how to make','how to use','step by step','beginner guide','full tutorial','guide'],value:'views',priority:40},
          {id:'map-restaurants',mode:'maps',action:'mapCategory',icon:'🍽️',label:'مطاعم',phrases:['مطعم','مطاعم','restaurant'],value:'restaurants',priority:20},
          {id:'map-hotels',mode:'maps',action:'mapCategory',icon:'🏨',label:'فنادق',phrases:['فندق','فنادق','hotel'],value:'hotels',priority:20},
          {id:'map-cafes',mode:'maps',action:'mapCategory',icon:'☕',label:'مقاهي',phrases:['مقهى','مقاهي','cafe'],value:'cafes',priority:20},
          {id:'map-pharmacies',mode:'maps',action:'mapCategory',icon:'💊',label:'صيدليات',phrases:['صيدلية','صيدليات','pharmacy'],value:'pharmacies',priority:20},
          {id:'map-hospitals',mode:'maps',action:'mapCategory',icon:'🏥',label:'مستشفيات',phrases:['مستشفى','مستشفيات','hospital'],value:'hospitals',priority:20},
          {id:'map-banks',mode:'maps',action:'mapCategory',icon:'🏦',label:'بنوك',phrases:['بنك','بنوك','bank'],value:'banks',priority:20},
          {id:'map-rating',mode:'maps',action:'mapRating',icon:'⭐',label:'4+ نجوم',phrases:['4+ نجوم','أربع نجوم','4 نجوم'],value:'4',priority:20},
          {id:'map-open',mode:'maps',action:'mapHours',icon:'🕐',label:'مفتوح الآن',phrases:['مفتوح الآن','open now'],value:'open',priority:20},
          {id:'map-budget',mode:'maps',action:'mapPrice',icon:'💰',label:'اقتصادي',phrases:['اقتصادي','رخيص','cheap','budget'],value:'1',priority:20},
          {id:'news-hour',mode:'news',action:'newsTime',icon:'⏰',label:'آخر ساعة',phrases:['آخر ساعة','اخر ساعه','last hour'],value:'h',priority:20},
          {id:'news-today',mode:'news',action:'newsTime',icon:'📅',label:'اليوم',phrases:['اليوم','today'],value:'h24',priority:20},
          {id:'news-week',mode:'news',action:'newsTime',icon:'📆',label:'هذا الأسبوع',phrases:['هذا الاسبوع','هذا الأسبوع','this week'],value:'d7',priority:20},
          {id:'news-month',mode:'news',action:'newsTime',icon:'🗓️',label:'هذا الشهر',phrases:['هذا الشهر','this month'],value:'d30',priority:20},
          {id:'news-latest',mode:'news',action:'newsSort',icon:'🔥',label:'الأحدث',phrases:['الأحدث','الاحدث','latest'],value:'date',priority:20},
          {id:'image-large',mode:'images',action:'imageSize',icon:'📐',label:'كبير',phrases:['كبير','كبيرة','large'],value:'l',priority:20},
          {id:'image-color',mode:'images',action:'imageColorType',icon:'🎨',label:'ملون',phrases:['ملون','ملونة','color'],value:'color',priority:20},
          {id:'image-gray',mode:'images',action:'imageColorType',icon:'⚫',label:'أبيض وأسود',phrases:['ابيض واسود','أبيض وأسود','gray','black and white'],value:'gray',priority:20},
          {id:'image-face',mode:'images',action:'imageType',icon:'👤',label:'وجه',phrases:['وجه','faces','face'],value:'face',priority:20},
          {id:'image-free',mode:'images',action:'imageRights',icon:'⚖️',label:'مجاني',phrases:['مجاني','free'],value:'f',priority:20},
          {id:'image-transparent',mode:'images',action:'imageColorType',icon:'🪟',label:'شفاف',phrases:['شفاف','transparent'],value:'trans',priority:20},
          {id:'image-png',mode:'images',action:'imageFileType',icon:'🖼️',label:'PNG',phrases:['png'],value:'png',priority:20},
          {id:'image-jpg',mode:'images',action:'imageFileType',icon:'🖼️',label:'JPG',phrases:['jpg','jpeg'],value:'jpg',priority:20}
        ],
        combinations: [
          {id:'long-4k-hd',mode:'videos',requires:['long','4k','hd'],target:'long4kHd',priority:100,icon:'💎',label:'أكثر من 20 دقيقة + 4K + HD'},
          {id:'long-4k',mode:'videos',requires:['long','4k'],target:'long4k',priority:90,icon:'🎞️',label:'أكثر من 20 دقيقة + 4K'},
          {id:'long-views',mode:'videos',requires:['long','views'],target:'longViews',priority:85,icon:'🏆',label:'أكثر من 20 دقيقة + الأعلى مشاهدة'}
        ]
      };

      let smartRules = DEFAULT_SMART_RULES;
      let smartRulesLoaded = false;
      let smartInputTimer = null;
      const SMART_RULES_VERSION = 1;

      function normalizeSmartRules(payload) {
        if (!payload || typeof payload !== 'object') return DEFAULT_SMART_RULES;
        const modes = payload.modes && typeof payload.modes === 'object' ? payload.modes : DEFAULT_SMART_RULES.modes;
        const filters = Array.isArray(payload.filters) ? payload.filters.filter(r => r && r.id && r.action) : DEFAULT_SMART_RULES.filters;
        const combinations = Array.isArray(payload.combinations) ? payload.combinations.filter(r => r && Array.isArray(r.requires) && r.target) : DEFAULT_SMART_RULES.combinations;
        return { version: payload.version || 1, settings: { ...DEFAULT_SMART_RULES.settings, ...(payload.settings || {}) }, modes, filters, combinations };
      }

      async function loadSmartRules() {
        try {
          const response = await fetch('./smart-rules.json?v=' + SMART_RULES_VERSION, { cache: 'default' });
          if (!response.ok) throw new Error('smart-rules-' + response.status);
          smartRules = normalizeSmartRules(await response.json());
          smartRulesLoaded = true;
        } catch (error) {
          smartRules = DEFAULT_SMART_RULES;
          smartRulesLoaded = false;
          console.warn('تعذر تحميل smart-rules.json، تم استخدام القواعد الاحتياطية.', error);
        }
        if (typeof renderContextualFilters === 'function') renderContextualFilters();
        if (typeof updateSmartIndicator === 'function') updateSmartIndicator();
      }

      function scoreSmartMode(query, mode, config) {
        const lower = normalizeSmartQuery(query);
        let score = 0;
        const matched = [];
        (config.phrases || []).forEach(phrase => {
          const p = normalizeSmartQuery(phrase);
          if (p && lower.includes(p)) { score += Number(smartRules.settings.phraseWeight) || 5; matched.push(p); }
        });
        (config.keywords || []).forEach(keyword => {
          const k = normalizeSmartQuery(keyword);
          if (k && lower.includes(k)) { score += Number(smartRules.settings.keywordWeight) || 1; matched.push(k); }
        });
        return { mode, config, score, matched: [...new Set(matched)] };
      }

      function detectSearchMode(query) {
        if (!query || normalizeSmartQuery(query).length < 2) return null;
        const results = Object.entries(smartRules.modes || {})
          .map(([mode, config]) => scoreSmartMode(query, mode, config))
          .filter(result => result.score > 0)
          .sort((a,b) => b.score - a.score);
        if (!results.length) return null;
        const best = results[0], second = results[1];
        const tieMin = Number(smartRules.settings.tieMinScore) || 5;
        if (second && best.score === second.score && best.score < tieMin) return null;
        return best;
      }

      function smartHas(lower, values) {
        return (values || []).some(value => lower.includes(normalizeSmartQuery(value)));
      }

      function getMatchedSmartRules(query) {
        const lower = normalizeSmartQuery(query);
        if (!lower) return [];
        return (smartRules.filters || [])
          .map(rule => {
            const phrases = Array.isArray(rule.phrases) ? rule.phrases : [];
            const keywords = Array.isArray(rule.keywords) ? rule.keywords : [];
            let score = 0;
            phrases.forEach(p => { if (p && lower.includes(normalizeSmartQuery(p))) score += Number(rule.phraseWeight || smartRules.settings.phraseWeight || 5); });
            keywords.forEach(k => { if (k && lower.includes(normalizeSmartQuery(k))) score += Number(rule.keywordWeight || smartRules.settings.keywordWeight || 1); });
            return { rule, score };
          })
          .filter(item => item.score > 0)
          .sort((a,b) => (Number(b.rule.priority)||0) - (Number(a.rule.priority)||0) || b.score - a.score);
      }

      // Stable filter IDs are the public contract between JSON rules and the app.
      // Numeric search indexes remain an internal fallback for legacy rules.
      const smartFilterLinks = {
        views: 1, rating: 2, uploaded: 3, title: 4, hour: 5, today: 6, week: 7, month: 8, year: 9,
        short: 10, medium: 11, long: 12, '4k': 13, hdr: 14, hd: 15, '360': 16, vr180: 17, '3d': 18,
        longViews: 19, long4k: 20, long4kHd: 21, video: 22, channel: 23, playlist: 24, movie: 25,
        live: 26, shorts: 27, youtubeShorts: 27, instagram: 33
      };

      function getSmartFilterIndex(filterId) {
        if (!filterId) return undefined;
        const direct = (smartRules.filters || []).find(rule => rule.id === filterId && rule.linkIndex !== undefined);
        if (direct) return Number(direct.linkIndex);
        const legacy = smartFilterLinks[filterId];
        return legacy === undefined ? undefined : Number(legacy);
      }

      function getSmartFilterRule(filterId) {
        return (smartRules.filters || []).find(rule => rule.id === filterId) || null;
      }

      function applySmartRule(rule) {
        if (!rule) return;
        const action = rule.action, value = rule.value;
        if (action === 'link') {
          const index = getSmartFilterIndex(value);
          if (index !== undefined) selectSmartLink(index);
        } else if (action === 'advancedFileType') advancedState.fileType = value;
        else if (action === 'advancedUsageRights') advancedState.usageRights = value;
        else if (action === 'imageRights') imageState.rights = value;
        else if (action === 'imageSize') imageState.size = value;
        else if (action === 'imageColorType') imageState.colorType = value;
        else if (action === 'imageType') imageState.type = value;
        else if (action === 'imageFileType') imageState.fileType = value;
        else if (action === 'mapCategory') mapState.category = value;
        else if (action === 'mapRating') mapState.rating = value;
        else if (action === 'mapHours') mapState.hours = value;
        else if (action === 'mapPrice') mapState.price = value;
        else if (action === 'newsTime') newsState.time = value;
        else if (action === 'newsSort') newsState.sort = value;
      }

      function getSmartSpecialSuggestions(query) {
        const matched = getMatchedSmartRules(query);
        const suggestions = matched.map(({rule}) => ({
          id: 'smart-' + rule.id, icon: rule.icon || '✨', label: rule.label || rule.id,
          linkIndex: rule.action === 'link' ? getSmartFilterIndex(rule.value) : undefined,
          auto: true, apply: () => applySmartRule(rule)
        }));
        return suggestions.slice(0, Number(smartRules.settings.maxSuggestions) || 8);
      }

      function selectSmartLink(index) {
        selectedLinksState.selected = {};
        selectedLinksState.selected['link:' + index] = true;
      }

      function applySmartIntent(query, options = {}) {
        const lower = normalizeSmartQuery(query);
        if (!lower) { if (options.reset !== false) resetSmartAutoState(); return null; }
        resetSmartAutoState();
        const detected = detectSearchMode(query);
        const matched = getMatchedSmartRules(query);
        const suggestions = getSmartSpecialSuggestions(query);

        if (detected?.mode === 'maps') {
          mapState.place = query;
          matched.filter(({rule}) => rule.mode === 'maps').forEach(({rule}) => applySmartRule(rule));
        } else if (detected?.mode === 'news') {
          newsState.allWords = query;
          matched.filter(({rule}) => rule.mode === 'news').forEach(({rule}) => applySmartRule(rule));
        } else if (detected?.mode === 'images') {
          imageState.allWords = query;
          matched.filter(({rule}) => rule.mode === 'images').forEach(({rule}) => applySmartRule(rule));
        }

        if (detected?.mode === 'videos') {
          const ids = new Set(matched.filter(({rule}) => rule.mode === 'videos').map(({rule}) => rule.id));
          const combo = (smartRules.combinations || []).slice().sort((a,b) => (Number(b.priority)||0)-(Number(a.priority)||0)).find(c => c.mode === 'videos' && c.requires.every(id => ids.has(id)));
          if (combo) selectSmartLink(getSmartFilterIndex(combo.target));
          else {
            const videoRules = matched.filter(({rule}) => rule.mode === 'videos' && rule.action === 'link');
            const instructional = ids.has('instructional');
            const target = videoRules.find(({rule}) => rule.id === 'views' || rule.id === 'instructional');
            if (target) selectSmartLink(getSmartFilterIndex(target.rule.value));
            else if (videoRules.length) selectSmartLink(getSmartFilterIndex(videoRules[0].rule.value));
            else if (instructional) selectSmartLink(getSmartFilterIndex('views'));
          }
        } else if (detected?.mode === 'web' || !detected) {
          const webRule = matched.find(({rule}) => rule.mode === 'web' && rule.action !== 'advancedUsageRights');
          if (webRule) applySmartRule(webRule.rule);
          else {
            const link = matched.find(({rule}) => rule.action === 'link');
            if (link) selectSmartLink(getSmartFilterIndex(link.rule.value));
          }
        }

        return { detected, suggestions, loaded: smartRulesLoaded };
      }

      const searchModesConfig = [
        { id: 'smart', icon: '✨', label: 'ذكي', labelEn: 'Smart' },
        { id: 'web', icon: '🌐', label: 'ويب', labelEn: 'Web' },
        { id: 'news', icon: '📰', label: 'أخبار', labelEn: 'News' },
        { id: 'images', icon: '🖼️', label: 'صور', labelEn: 'Images' },
        { id: 'maps', icon: '🗺️', label: 'خرائط', labelEn: 'Maps' },
        { id: 'videos', icon: '🎬', label: 'فيديو', labelEn: 'Videos' }
      ];


