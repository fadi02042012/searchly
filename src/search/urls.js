/** Searchly extracted module. Logic preserved from app.js. */

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

function getSearchesByGroup() {
        const groups = {};
        searches.forEach((s, i) => {
          if (!groups[s.group]) groups[s.group] = [];
          groups[s.group].push({ ...s, index: i });
        });
        return groups;
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

