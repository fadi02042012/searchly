
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
              // 🎬 وضع الفيديو = YouTube فقط + تطبيق إعدادات الفلاتر
              const parts = [String(query || '').trim()];
              const fs = filterState || {};

              // بحث داخل العنوان
              if ((fs.type || []).includes('title')) parts[0] = 'intitle:' + parts[0];

              // نوع المحتوى
              const typeSp = {
                video: 'EgIQAQ%3D%3D',
                playlist: 'EgIQAw%3D%3D',
                live: 'EgJAAQ%3D%3D',
                channel: 'EgIQAg%3D%3D',
                film: 'EgIQBA%3D%3D'
              };
              const type = (fs.type || []).find(v => typeSp[v]);

              // المدة
              const durationSp = {
                short: 'EgIYAQ%3D%3D',
                medium: 'EgIYAw%3D%3D',
                long: 'EgIYAg%3D%3D'
              };
              const duration = (fs.duration || []).find(v => durationSp[v]);

              // التاريخ
              const dateSp = {
                hour: 'EgIIAQ%3D%3D',
                today: 'EgQIAhAB',
                week: 'EgQIAxAB',
                month: 'EgQIBBAB',
                year: 'EgQIBRAB'
              };
              const date = (fs.date || []).find(v => dateSp[v]);

              // الجودة / خصائص الفيديو
              const qualitySp = {
                '4k': 'EgJwAQ%3D%3D',
                hdr: 'EgPIAQE%3D',
                hd: 'EgIgAQ%3D%3D',
                '360': 'EgJ4AQ%3D%3D',
                vr180: 'EgPQAQE%3D',
                '3d': 'EgI4AQ%3D%3D'
              };
              const quality = (fs.quality || []).find(v => qualitySp[v]);

              // YouTube يدعم رمز sp واحداً لكل حالة فلترة. لا نرسل عدة sp
              // حتى لا يصبح الرابط غير صالح؛ نختار الفلتر الأكثر تحديداً.
              const q = encodeURIComponent(parts[0]).replace(/%20/g, '+');
              let url = 'https://www.youtube.com/results?search_query=' + q;

              // ترتيب النتائج في YouTube: sp=CAASAH... ليس ثابتاً عبر الواجهة،
              // لذلك نترك الترتيب للواجهة ولا نخترع رمزاً غير موثوق.
              // فلتر النوع/المدة/التاريخ/الجودة: نستخدم رموز YouTube الموثقة
              // الموجودة في بيانات الفلاتر الحالية.
              const presetSp = {
                views: 'CAMSAhAB',
                rating: 'CAESAhAB',
                date: 'CAI%3D',
                title: ''
              };
              const compositeSp = {
                long_views: 'CAMSAhgC',
                long_4k: 'EgYQBBgCcAE%3D',
                long_4k_hd: 'EgYYAiABcAE%3D'
              };

              // الفلاتر المركبة المحفوظة/الإضافية لها أولوية.
              const preset = fs.youtubePreset || '';
              const platform = fs.videoPlatform || 'youtube';
              if (platform !== 'youtube') {
                const platformMap = {
                  vimeo: 'https://www.google.com/search?q=site%3Avimeo.com+',
                  dailymotion: 'https://www.dailymotion.com/search/',
                  bilibili: 'https://search.bilibili.com/all?keyword=',
                  youku: 'https://so.youku.com/search_video/q_',
                  yandex: 'https://yandex.com/video/search?text='
                };
                if (platformMap[platform]) return platformMap[platform] + encodeURIComponent(String(query || '').trim()) + (platform === 'vimeo' ? '&tbm=vid' : platform === 'dailymotion' ? '/videos' : platform === 'bilibili' ? '&from_source=webtop_search' : platform === 'youku' ? '?searchfrom=1' : '');
              }
              if (preset && compositeSp[preset]) {
                url += '&sp=' + compositeSp[preset];
                return url;
              }

              // ترتيب YouTube يستخدم رموز sp مستقلة.
              if (fs.sort && presetSp[fs.sort]) {
                url += '&sp=' + presetSp[fs.sort];
                return url;
              }

              const candidates = [
                ['type', typeSp[type]],
                ['duration', durationSp[duration]],
                ['date', dateSp[date]],
                ['quality', qualitySp[quality]]
              ].filter(([, value]) => Boolean(value));

              if (candidates.length) url += '&sp=' + candidates[0][1];
              return url;
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
        if (filterState.youtubePreset) {
          const presetLabels = {
            long_views: 'YouTube: +20 دقيقة + الأكثر مشاهدة',
            long_4k: 'YouTube: +20 دقيقة + 4K',
            long_4k_hd: 'YouTube: +20 دقيقة + 4K + HD'
          };
          active.push({ key: 'youtubePreset', value: filterState.youtubePreset, label: presetLabels[filterState.youtubePreset] || ('YouTube: ' + filterState.youtubePreset), type: 'youtubePreset', multi: false });
        }
        if (filterState.videoPlatform && filterState.videoPlatform !== 'youtube') {
          const platformLabels = { vimeo:'Vimeo', dailymotion:'Dailymotion', bilibili:'Bilibili', youku:'Youku', yandex:'Yandex Video' };
          active.push({ key: 'videoPlatform', value: filterState.videoPlatform, label: 'منصة: ' + (platformLabels[filterState.videoPlatform] || filterState.videoPlatform), type: 'videoPlatform', multi: false });
        }
        if (filterState.sort && filterState.sort !== 'relevance') {
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
          if (k === 'safe' && v === 'active') return;
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
                filterState[filter.key] = filter.key === 'sort' ? 'relevance' : 'all';
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
            } else if (filter.type === 'youtubePreset') {
              filterState.youtubePreset = '';
              saveCurrentStateToMode();
            } else if (filter.type === 'videoPlatform') {
              filterState.videoPlatform = 'youtube';
              document.querySelectorAll('[data-video-platform]').forEach(btn => btn.classList.toggle('active-filter', btn.dataset.videoPlatform === 'youtube'));
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
