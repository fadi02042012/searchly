import { searches } from './src/data/searches.js';
import { createDefaultFilterState, readStorage, writeStorage } from './src/state.js';
import { debounce } from './src/utils.js';
import { normalizeSmartQuery as normalizeSmartQueryCore, scoreSmartMode as scoreSmartModeCore, detectSearchMode as detectSearchModeCore } from './src/smart/core.js';
import { generateAdvancedLink as generateAdvancedLinkCore } from './src/search/url-core.js';
import { snapshotFilterState, restoreFilterState } from './src/filters/state.js';
import { filterCommands as filterCommandsCore, getCommandLabel } from './src/commands/core.js';
import { translateWithDictionary as translateWithDictionaryCore, makeTranslationCacheKey } from './src/i18n/core.js';
(function() {
      'use strict';

      // =====================================================
      // ⭐⭐⭐ 48 رابط بحث متقدم (من 03-links.js) ⭐⭐⭐
      // =====================================================
      ;

      // =====================================================
      // ⭐ دوال الروابط المتقدمة (من 03-links.js)
      // =====================================================
      function generateAdvancedLink(query, index = 0) { return generateAdvancedLinkCore(query, index, searches); }

      
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
      let smartSaveTimer = null;
      let lastFocusedElement = null;

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

      // localStorage غير مضمون (وضع التصفح الخاص/قيود المساحة)، لذلك لا ينبغي
      // أن يمنع تهيئة التطبيق أو البحث الأساسي عند فشل القراءة أو الكتابة.
      

      

      // =====================================================
      // SAVE / LOAD STATE
      // =====================================================
      function saveStateToMode(mode) {
        if (!mode || !modeFilters[mode]) return;
        modeFilters[mode] = snapshotFilterState(filterState, advancedState, newsState, imageState, mapState, selectedLinksState);
        try {
          writeStorage('sh_mode_filters', JSON.stringify(modeFilters));
        } catch {
          // Storage can be unavailable or full; the in-memory state remains usable.
        }
      }

      function saveCurrentStateToMode() {
        saveStateToMode(getActiveMode());
      }

      function loadModeFilters() {
        const saved = readStorage('sh_mode_filters');
        if (!saved) return;
        try {
          const parsed = JSON.parse(saved);
          if (!parsed || typeof parsed !== 'object') return;
          Object.keys(modeFilters).forEach(mode => {
            const restored = parsed[mode] || {};
            modeFilters[mode] = { ...createDefaultFilterState(), ...restored };
            ['type', 'duration', 'date', 'quality', 'feature'].forEach(key => {
              if (!Array.isArray(modeFilters[mode][key])) modeFilters[mode][key] = [];
            });
            if (!modeFilters[mode].selectedLinks || typeof modeFilters[mode].selectedLinks !== 'object') {
              modeFilters[mode].selectedLinks = {};
            }
          });
        } catch {
          // Ignore corrupted local state and keep defaults.
        }
      }

      function switchMode(newMode) {
        const validModes = new Set(['smart', 'web', 'news', 'images', 'maps', 'videos']);
        if (!validModes.has(newMode)) return;
        const oldMode = getActiveMode();
        if (oldMode === newMode) return;
        saveStateToMode(oldMode);
        setActiveMode(newMode);
        writeStorage('sh_mode', newMode);
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

      function scheduleSmartStateSave() {
        clearTimeout(smartSaveTimer);
        smartSaveTimer = setTimeout(() => {
          saveStateToMode('smart');
          smartSaveTimer = null;
        }, 180);
      }

      function loadStateFromMode(modeId) {
        const restored = restoreFilterState(modeFilters[modeId], createDefaultFilterState());
        filterState = restored.filterState;
        advancedState = restored.advancedState;
        newsState = restored.newsState;
        imageState = restored.imageState;
        mapState = restored.mapState;
        selectedLinksState = restored.selectedLinksState;
      }

      function resetSmartAutoState() {
        filterState=createDefaultFilterState();
        advancedState={allWords:'',exactPhrase:'',anyWords:'',noneWords:'',numbers:'',site:'',fileType:'',lastUpdate:'',lang:'',usageRights:''};
        newsState={allWords:'',exactPhrase:'',site:'',time:'all',sort:'relevance'};
        imageState={allWords:'',site:'',fileType:'',size:'all',exactWidth:'',exactHeight:'',aspect:'all',color:'all',colorType:'all',type:'all',rights:'all',time:'all',lang:'',region:'',safe:'all'};
        mapState={place:'',near:'',rating:'0',hours:'all',price:'all',category:'',sort:'relevance'};
        selectedLinksState={selected:{}};
      }
      function getSmartFilterIndex(id) {
        const r=(smartRules.filters||[]).find(x=>x.id===id);
        if(r && r.linkIndex!==undefined)return Number(r.linkIndex);
        const legacy={views:1,rating:2,uploaded:3,title:4,hour:5,today:6,week:7,month:8,year:9,short:10,medium:11,long:12,'4k':13,hdr:14,hd:15,'360':16,vr180:17,'3d':18,longViews:19,long4k:20,long4kHd:21,video:22,channel:23,playlist:24,movie:25,live:26,shorts:27,instagram:33};
        return legacy[id];
      }
      function selectSmartLink(index) {
        const idx = Number(index);
        if (!Number.isInteger(idx) || idx < 0 || idx >= searches.length) return false;
        const current = searches[idx];
        if (!current) return false;

        const key = 'link:' + idx;
        const sameGroupKeys = Object.keys(selectedLinksState.selected).filter(k => {
          if (!selectedLinksState.selected[k] || k === key) return false;
          const otherIdx = Number(k.replace('link:', ''));
          return searches[otherIdx] && searches[otherIdx].group === current.group;
        });

        if (selectedLinksState.selected[key]) {
          delete selectedLinksState.selected[key];
        } else {
          sameGroupKeys.forEach(k => delete selectedLinksState.selected[k]);
          selectedLinksState.selected[key] = true;
        }

        updateAllFiltersUI();
        saveCurrentStateToMode();
        return true;
      }

      function getMatchedSmartRules(query) {
        const q=normalizeSmartQuery(query);
        return (smartRules.filters||[]).map(rule=>{
          let score=0;
          (rule.phrases||[]).forEach(p=>{if(q.includes(normalizeSmartQuery(p)))score+=Number(rule.phraseWeight||smartRules.settings.phraseWeight||5);});
          (rule.keywords||[]).forEach(k=>{if(q.includes(normalizeSmartQuery(k)))score+=Number(rule.keywordWeight||smartRules.settings.keywordWeight||1);});
          return {rule,score};
        }).filter(x=>x.score>0).sort((a,b)=>(Number(b.rule.priority)||0)-(Number(a.rule.priority)||0)||b.score-a.score);
      }
      function applySmartRule(rule) {
        if(!rule)return;
        const v=rule.value;
        // 🎬 الفلاتر الذكية للفيديو تُطبّق على filterState مباشرةً،
        // حتى يمكن جمع فيلم/مسلسل + مدة + جودة + تاريخ بدون الاعتماد على رابط واحد.
        if(rule.mode==='videos' && rule.action==='link'){
          const map = {
            short: ['duration','short'], medium: ['duration','medium'], long: ['duration','long'],
            '4k': ['quality','4k'], hd: ['quality','hd'], hdr: ['feature','hdr'],
            '360': ['feature','360'], vr180: ['feature','vr180'], '3d': ['feature','3d'],
            live: ['type','live'], shorts: ['type','shorts'], playlist: ['type','playlist'],
            channel: ['type','channel'], video: ['type','video'],
            movie: ['type','movie'], series: ['type','series']
          };
          if(v==='views'){
            // 🔥 عبارات الشرح/التصنيع/التركيب وما شابه = محتوى تعليمي طويل + الأعلى مشاهدة.
            // النوايا التعليمية/التصنيع/التركيب/الإصلاح/المقارنة/الوثائقيات
            // تتعامل كبحث طويل + الأعلى مشاهدة.
            const longIntents = [
              'instructional','educational','installation','manufacturing',
              'repair','comparison','documentary'
            ];
            if(longIntents.includes(rule.id)){
              if(!Array.isArray(filterState.duration)) filterState.duration=[];
              if(!filterState.duration.includes('long')) filterState.duration.push('long');
            }
            // المراجعات تحتاج الأعلى تقييمًا، مع الإبقاء على الأعلى مشاهدة كترتيب مساعد.
            if(rule.id==='review'){
              filterState.sort='rating';
              return;
            }
            filterState.sort='views';
            return;
          }
          if(v==='rating'){ filterState.sort='rating'; return; }
          if(v==='hour'||v==='today'||v==='week'||v==='month'||v==='year'){
            filterState.date=[v]; return;
          }
          const mapped=map[v];
          if(mapped){
            const [key,value]=mapped;
            if(!Array.isArray(filterState[key])) filterState[key]=[];
            if(!filterState[key].includes(value)) filterState[key].push(value);
            const longIntentIds = [
              'movie-full','series-full','quality-4k','quality-hd','quality-hdr'
            ];
            if(longIntentIds.includes(rule.id)){
              if(!Array.isArray(filterState.duration)) filterState.duration=[];
              if(!filterState.duration.includes('long')) filterState.duration.push('long');
            }
            // عبارات السياحة والمناظر الطبيعية تطلب جودة 4K + HD معًا.
            if(rule.id && rule.id.startsWith('tourism-') && rule.id.endsWith('-quality')){
              if(!Array.isArray(filterState.quality)) filterState.quality=[];
              if(!filterState.quality.includes('4k')) filterState.quality.push('4k');
              if(!filterState.quality.includes('hd')) filterState.quality.push('hd');
            }
          }
          return;
        }
        if(rule.action==='link'){const i=getSmartFilterIndex(v);if(i!==undefined)selectSmartLink(i);}
        else if(rule.action==='advancedFileType')advancedState.fileType=v;
        else if(rule.action==='advancedUsageRights')advancedState.usageRights=v;
        else if(rule.action==='imageRights')imageState.rights=v;
        else if(rule.action==='imageSize')imageState.size=v;
        else if(rule.action==='imageColorType')imageState.colorType=v;
        else if(rule.action==='imageType')imageState.type=v;
        else if(rule.action==='imageFileType')imageState.fileType=v;
        else if(rule.action==='mapCategory')mapState.category=v;
        else if(rule.action==='mapRating')mapState.rating=v;
        else if(rule.action==='mapHours')mapState.hours=v;
        else if(rule.action==='mapPrice')mapState.price=v;
        else if(rule.action==='newsTime')newsState.time=v;
        else if(rule.action==='newsSort')newsState.sort=v;
      }
      function getSmartSpecialSuggestions(query) {
        return getMatchedSmartRules(query).slice(0,Number(smartRules.settings.maxSuggestions)||8).map(({rule})=>({id:'smart-'+rule.id,icon:rule.icon||'✨',label:rule.label||rule.id,linkIndex:rule.action==='link'?getSmartFilterIndex(rule.value):undefined,apply:()=>applySmartRule(rule)}));
      }
      function applySmartIntent(query,{reset=true}={}) {
        if(reset)resetSmartAutoState();
        const detected=detectSearchMode(query), matched=getMatchedSmartRules(query);
        if(!query)return null;
        if(detected?.mode==='maps'){mapState.place=query;matched.filter(x=>x.rule.mode==='maps').forEach(x=>applySmartRule(x.rule));}
        else if(detected?.mode==='news'){newsState.allWords=query;matched.filter(x=>x.rule.mode==='news').forEach(x=>applySmartRule(x.rule));}
        else if(detected?.mode==='images'){imageState.allWords=query;matched.filter(x=>x.rule.mode==='images').forEach(x=>applySmartRule(x.rule));}
        else if(detected?.mode==='videos'){
          // 🎯 طبّق كل نوايا الفيديو المكتشفة معًا.
          // مثال: "فيلم عادل امام أكثر من 20 دقيقة" => فيلم + مدة طويلة.
          const videoMatches=matched.filter(x=>x.rule.mode==='videos');
          videoMatches
            .sort((a,b)=>(Number(b.rule.priority)||0)-(Number(a.rule.priority)||0)||b.score-a.score)
            .forEach(x=>applySmartRule(x.rule));
        } else {
          const web=matched.find(x=>x.rule.mode==='web');
          if(web)applySmartRule(web.rule);
        }
        return {detected,suggestions:getSmartSpecialSuggestions(query)};
      }
      async function loadSmartRules(){
        try{
          const response=await fetch('./data/smart-rules.json',{cache:'force-cache'});
          if(!response.ok)throw new Error('HTTP '+response.status);
          const data=await response.json();
          if(data&&data.modes&&Array.isArray(data.filters))smartRules={...DEFAULT_SMART_RULES,...data,settings:{...DEFAULT_SMART_RULES.settings,...(data.settings||{})}};
          smartRulesLoaded=true;
        }catch(e){smartRules=DEFAULT_SMART_RULES;smartRulesLoaded=false;console.warn('Smart rules fallback',e);}
        updateSmartIndicator(); if(typeof renderContextualFilters==='function')renderContextualFilters();
      }
      loadSmartRules();

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
          type: { video: 'فيديو', playlist: 'قائمة', live: 'بث', shorts: 'Shorts', channel: 'قنوات', movie: 'أفلام', series: 'مسلسلات' },
          duration: { short: 'أقل من 4 دقائق', medium: 'بين 4 و20 دقيقة', long: '🎬 أكثر من 20 دقيقة' },
          date: { hour: 'ساعة', today: 'اليوم', week: 'أسبوع', month: 'شهر', year: 'سنة' },
          quality: { '4k': '4K', hd: 'HD' },
          feature: { '360': '360°', vr180: 'VR180', '3d': '3D', hdr: 'HDR', cc: 'ترجمة' }
        },
        en: {
          sort: { relevance: 'Relevance', date: 'Date', views: 'Views', rating: 'Rating' },
          type: { video: 'Video', playlist: 'Playlist', live: 'Live', shorts: 'Shorts', channel: 'Channels', movie: 'Movies', series: 'Series' },
          duration: { short: 'Under 4 min', medium: '4–20 min', long: '🎬 Over 20 min' },
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
        return translateWithDictionaryCore(text, targetLang, translationDict);
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
        const cacheKey = makeTranslationCacheKey(text, targetLang);
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
        if (advancedState.fileType) parts.push('filetype:' + advancedState.fileType);
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

      function videoSearchURL(query) {
        let finalQuery = String(query || '').trim();
        const types = filterState.type || [];
        const durations = filterState.duration || [];
        const dates = filterState.date || [];
        const quality = filterState.quality || [];
        const features = filterState.feature || [];

        // 🧠 نظّف عبارات الفلاتر التي كتبها المستخدم من نص البحث.
        // مثال: "فيلم عادل امام أكثر من 20 دقيقة" يصبح بحثًا عن "عادل امام فيلم"
        // مع تطبيق فلتر المدة بشكل مستقل.
        const filterPhrases = [
          /أكثر\s+من\s+20\s+دقيقة|اكثر\s+من\s+20\s+دقيقه/gi,
          /بين\s+4\s*(?:و|إلى|الى|-)\s*20\s+دقيقة/gi,
          /أقل\s+من\s+4\s+دقائق|اقل\s+من\s+4\s+دقائق/gi,
          /4k/gi, /hd/gi, /hdr/gi, /vr\s*180/gi,
          /ثلاثي\s+الأبعاد|ثلاثي\s+الابعاد/gi,
          /آخر\s+ساعة|اخر\s+ساعه/gi, /اليوم/gi, /هذا\s+الأسبوع|هذا\s+الاسبوع/gi,
          /هذا\s+الشهر/gi, /هذا\s+العام|هذه\s+السنة/gi
        ];
        filterPhrases.forEach(pattern => { finalQuery = finalQuery.replace(pattern, ' '); });

        // إزالة كلمات نوع المحتوى من النص ثم إضافتها بصيغة موحّدة.
        finalQuery = finalQuery
          .replace(/\b(?:movie|movies|series|video|videos|shorts|playlist|playlists)\b/gi, ' ')
          .replace(/\b(?:فيلم|أفلام|افلام|مسلسل|مسلسلات|فيديو|فيديوهات|شورتس|شورت|قائمة تشغيل|قوائم تشغيل)\b/gi, ' ')
          .replace(/\s+/g, ' ').trim();

        // النوع: أفلام/مسلسلات ليست فلاتر YouTube مستقلة في صفحة النتائج،
        // لذلك نضيفها للاستعلام بشكل صريح.
        if (types.includes('movie')) finalQuery += ' فيلم';
        if (types.includes('series')) finalQuery += ' مسلسل';

        const params = new URLSearchParams();
        params.set('search_query', finalQuery);

        // نستخدم فلاتر YouTube الأصلية عندما يكون هناك فلتر واحد قابل للتمثيل مباشرة.
        // عند تعدد الفلاتر، نُبقي الاستعلام صالحًا ونستخدم أول فلتر مدعوم.
        const spMap = {
          short: 'EgIYAQ%3D%3D',
          medium: 'EgIYAw%3D%3D',
          long: 'EgIYAg%3D%3D',
          '4k': 'EgJwAQ%3D%3D',
          hd: 'EgIgAQ%3D%3D',
          '360': 'EgJ4AQ%3D%3D',
          vr180: 'EgPQAQE%3D',
          '3d': 'EgI4AQ%3D%3D',
          hdr: 'EgPIAQE%3D'
        };
        const candidates = [...durations, ...quality, ...features];
        const supported = candidates.find(v => spMap[v]);
        if (supported) params.set('sp', decodeURIComponent(spMap[supported]));

        // فلاتر النوع الأساسية التي يدعمها YouTube عبر sp.
        const typeSp = {
          live: 'EgJAAQ%3D%3D',
          playlist: 'EgIQAw%3D%3D',
          shorts: 'EgIQAQ%3D%3D',
          video: 'EgIQAQ%3D%3D'
        };
        if (!supported) {
          const t = types.find(v => typeSp[v]);
          if (t) params.set('sp', decodeURIComponent(typeSp[t]));
        }

        const dateMap = { hour: 'EgIIAQ%3D%3D', today: 'EgQIAhAB', week: 'EgQIAxAB', month: 'EgQIBBAB', year: 'EgQIBRAB' };
        const d = dates.find(v => dateMap[v]);
        if (d && !params.has('sp')) params.set('sp', decodeURIComponent(dateMap[d]));

        // الترتيب يظل مفيدًا عبر واجهة Google عند الحاجة، لذلك لا نخلط مصدرين للفلترة.
        return 'https://www.youtube.com/results?' + params.toString();
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
              return videoSearchURL(query);
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
            if (filter.type === 'simpleCombo') {
              filterState.duration = (filterState.duration || []).filter(v => v !== 'long');
              filterState.sort = 'date';
              setFilterButtonVisuals(filterState);
              saveCurrentStateToMode();
            } else if (filter.type === 'simple') {
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
        const modeTabs = searchModes.querySelectorAll('.mode-tab');
        modeTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const modeId = tab.dataset.mode;
            if (getActiveMode() === modeId) return;
            switchMode(modeId);
            const modeInfo = searchModesConfig.find(m => m.id === modeId);
            if (modeInfo) {
              const label = currentLang === 'ar' ? modeInfo.label : modeInfo.labelEn;
              showToast(langStrings[currentLang].toastModeSwitched + label);
            }
          });
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
        if (mode === 'smart') {
          const smart = getSmartSpecialSuggestions(currentQuery || '').filter(s => s && s.label);
          const seen = new Set();
          suggestions = smart.filter(s => {
            const key = s.linkIndex !== undefined ? 'link:' + s.linkIndex : s.id;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).slice(0, Number(smartRules.settings.maxSuggestions) || 10);
          if (!suggestions.length) {
            const modeKey = detectSearchMode(currentQuery)?.mode || 'web';
            suggestions = contextualSuggestions[modeKey] || [];
          }
        } else {
          suggestions = contextualSuggestions[mode] || [];
        }
        if (!suggestions.length) {
          contextualFilters.classList.remove('show');
          return;
        }
        contextualFilters.classList.add('show');
        cfLabelText.textContent = currentLang === 'ar' ? 'فلاتر ذكية مقترحة' : 'Suggested smart filters';
        cfChips.innerHTML = '';
        suggestions.forEach(sug => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'cf-chip';
          chip.setAttribute('aria-label', String(sug.label));
          chip.dataset.smartRuleId = sug.id || '';
          if (sug.linkIndex !== undefined) chip.dataset.linkIndex = String(sug.linkIndex);
          chip.innerHTML = `<span class="chip-icon">${escapeHTML(sug.icon || '✨')}</span><span>${escapeHTML(sug.label)}</span>`;
          chip.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            let applied = false;
            if (sug.linkIndex !== undefined) applied = selectSmartLink(sug.linkIndex);
            else if (typeof sug.apply === 'function') { sug.apply(); applied = true; }
            if (!applied) return;
            saveCurrentStateToMode();
            updateAllFiltersUI();
            updateFilterSummary();
            renderActiveFiltersBar();
            chip.classList.toggle('active');
          });
          cfChips.appendChild(chip);
        });
      }

      function updateSmartIndicator() {
        const mode = getActiveMode();
        if (mode !== 'smart') { smartIndicator.classList.remove('show'); return; }
        const detected = detectSearchMode(searchInput.value);
        if (detected) {
          smartIndicator.classList.add('show');
          smartIndicatorText.textContent = (currentLang === 'ar' ? 'وضع ذكي: ' : 'Smart: ') + detected.config.label;
        } else smartIndicator.classList.remove('show');
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
              writeStorage('sh_presets', JSON.stringify(presets));
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
        writeStorage('sh_presets', JSON.stringify(presets));
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
          applySmartIntent(query,{reset:true});
          saveStateToMode('smart');
          updateAllFiltersUI(); updateFilterSummary(); renderActiveFiltersBar();
        }

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

      // =====================================================
      // DRAWER OPEN/CLOSE
      // =====================================================
      function openFilterDrawer() {
        const mode = getActiveMode();
        lastFocusedElement = document.activeElement;
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
        filterOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeFiltersBtn.focus();
        syncFilterTabWithMode(mode);
        setTimeout(() => syncFilterTabWithMode(mode), 100);
        setTimeout(() => syncFilterTabWithMode(mode), 260);
      }

      function closeFilterDrawer() {
        filterOverlay.classList.remove('open');
        filterBackdrop.classList.remove('open');
        filterOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
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
        lastFocusedElement = document.activeElement;
        cmdBackdrop.classList.add('show');
        cmdPalette.classList.add('show');
        cmdPalette.setAttribute('aria-hidden', 'false');
        cmdSearchInput.value = '';
        renderCmdResults('');
        setTimeout(() => cmdSearchInput.focus(), 50);
      }
      function closeCmdPalette() {
        cmdBackdrop.classList.remove('show');
        cmdPalette.classList.remove('show');
        cmdPalette.setAttribute('aria-hidden', 'true');
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
      }

      function renderCmdResults(query) {
        const lower = query.toLowerCase();
        const filtered = filterCommandsCore(commands, query);
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
            <span class="cmd-name">${escapeHTML(getCommandLabel(cmd, currentLang))}</span>
            ${cmd.shortcut ? `<span class="cmd-shortcut">${cmd.shortcut}</span>` : ''}
          `;
          item.addEventListener('click', () => { closeCmdPalette(); cmd.action(); });
          cmdResults.appendChild(item);
        });
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
      // =====================================================
      // EVENT LISTENERS
      // =====================================================
      searchBtn.addEventListener('click', (e) => { e.preventDefault(); performSearch(); });
      const handleSearchInput = debounce(() => {
        currentQuery = searchInput.value.trim();
        if (getActiveMode() === 'smart') {
          applySmartIntent(currentQuery, { reset: true });
          scheduleSmartStateSave();
          updateAllFiltersUI();
          updateFilterSummary();
          renderActiveFiltersBar();
        }
        showSuggestions();
        updateSmartIndicator();
        if (getActiveMode() === 'smart') renderContextualFilters();
      }, 180);

      searchInput.addEventListener('input', handleSearchInput);
      searchInput.addEventListener('focus', showSuggestions);
      searchInput.addEventListener('blur', hideSuggestions);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          suggestionsDropdown.classList.remove('show');
          performSearch();
        }
      });

      translateBtn.addEventListener('click', performTranslateAndSearch);

      langTarget.addEventListener('change', () => {
        langTouched = true;
        langCode.textContent = langTarget.value.toUpperCase();
        langTool.classList.add('active');
      });

      themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        writeStorage('sh_theme', isDark ? 'dark' : 'light');
      });

      langAr.addEventListener('click', () => switchLanguage('ar'));
      langEn.addEventListener('click', () => switchLanguage('en'));

      openFiltersBtn.addEventListener('click', openFilterDrawer);
      closeFiltersBtn.addEventListener('click', closeFilterDrawer);
      filterBackdrop.addEventListener('click', closeFilterDrawer);
      applyFiltersBtn.addEventListener('click', applyFilters);
      drawerResetFiltersBtn.addEventListener('click', resetAllFilters);

      allFilterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (this.hasAttribute('data-filter') || this.hasAttribute('data-filter-type') ||
              this.hasAttribute('data-filter-duration') || this.hasAttribute('data-filter-date') ||
              this.hasAttribute('data-filter-quality') || this.hasAttribute('data-filter-feature')) {
            updateFilter(this);
            return;
          }
          if (this.classList.contains('news-time-btn')) {
            newsState.time = this.dataset.newsTime;
            document.querySelectorAll('.news-time-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('news-sort-btn')) {
            newsState.sort = this.dataset.newsSort;
            document.querySelectorAll('.news-sort-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-size-btn')) {
            imageState.size = this.dataset.imgSize;
            document.querySelectorAll('.img-size-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-aspect-btn')) {
            imageState.aspect = this.dataset.imgAspect;
            document.querySelectorAll('.img-aspect-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-color-type-btn')) {
            imageState.colorType = this.dataset.imgColorType;
            document.querySelectorAll('.img-color-type-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-type-btn')) {
            imageState.type = this.dataset.imgType;
            document.querySelectorAll('.img-type-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-rights-btn')) {
            imageState.rights = this.dataset.imgRights;
            document.querySelectorAll('.img-rights-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-time-btn')) {
            imageState.time = this.dataset.imgTime;
            document.querySelectorAll('.img-time-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('img-safe-btn')) {
            imageState.safe = this.dataset.imgSafe;
            document.querySelectorAll('.img-safe-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('map-rating-btn')) {
            mapState.rating = this.dataset.mapRating;
            document.querySelectorAll('.map-rating-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('map-hours-btn')) {
            mapState.hours = this.dataset.mapHours;
            document.querySelectorAll('.map-hours-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('map-price-btn')) {
            mapState.price = this.dataset.mapPrice;
            document.querySelectorAll('.map-price-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          } else if (this.classList.contains('map-sort-btn')) {
            mapState.sort = this.dataset.mapSort;
            document.querySelectorAll('.map-sort-btn').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
          }
        });
      });

      document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function(e) {
          e.stopPropagation();
          imageState.color = this.dataset.imgColor;
          document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
        });
      });

      cmdBtn.addEventListener('click', openCmdPalette);
      cmdBackdrop.addEventListener('click', closeCmdPalette);
      cmdSearchInput.addEventListener('input', (e) => {
        cmdActiveIndex = 0;
        renderCmdResults(e.target.value);
      });
      cmdSearchInput.addEventListener('keydown', (e) => {
        const items = cmdResults.querySelectorAll('.cmd-item');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          cmdActiveIndex = Math.min(cmdActiveIndex + 1, items.length - 1);
          items.forEach((it, i) => it.classList.toggle('active', i === cmdActiveIndex));
          items[cmdActiveIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          cmdActiveIndex = Math.max(cmdActiveIndex - 1, 0);
          items.forEach((it, i) => it.classList.toggle('active', i === cmdActiveIndex));
          items[cmdActiveIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const active = items[cmdActiveIndex];
          if (active) active.click();
        } else if (e.key === 'Escape') closeCmdPalette();
      });

      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '/') {
          e.preventDefault();
          if (cmdPalette.classList.contains('show')) closeCmdPalette();
          else openCmdPalette();
        }
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
        if (e.key === 'Escape') {
          if (filterOverlay.classList.contains('open')) closeFilterDrawer();
          if (cmdPalette.classList.contains('show')) closeCmdPalette();
        }
      });

      // =====================================================
      // INIT
      // =====================================================
      function init() {
        // ⭐ بناء شبكة كافة الفلاتر من searches
        buildAllFiltersGrid();

        const savedTheme = readStorage('sh_theme');
        if (savedTheme === 'dark') {
          isDark = true;
          document.documentElement.setAttribute('data-theme', 'dark');
          themeToggle.textContent = '☀️';
        } else {
          isDark = false;
          document.documentElement.setAttribute('data-theme', 'light');
          themeToggle.textContent = '🌙';
        }
        const savedPresets = readStorage('sh_presets');
        if (savedPresets) {
          try {
            const parsedPresets = JSON.parse(savedPresets);
            presets = Array.isArray(parsedPresets) ? parsedPresets.filter(p => p && typeof p.name === 'string') : [];
          } catch(e) { presets = []; }
        }
        const savedMode = readStorage('sh_mode');
        const validModes = new Set(['smart', 'web', 'news', 'images', 'maps', 'videos']);
        const initialMode = validModes.has(savedMode) ? savedMode : 'web';
        setActiveMode(initialMode);
        attachModeTabListeners();
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
