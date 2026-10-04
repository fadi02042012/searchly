/** Searchly extracted module. Logic preserved from app.js. */

function scoreSmartMode(query, mode, config) {
        const q=normalizeSmartQuery(query), matched=[]; let score=0;
        (config.phrases||[]).forEach(p=>{const n=normalizeSmartQuery(p);if(n&&q.includes(n)){score+=smartRules.settings.phraseWeight;matched.push(n);}});
        (config.keywords||[]).forEach(k=>{const n=normalizeSmartQuery(k);if(n&&q.includes(n)){score+=smartRules.settings.keywordWeight;matched.push(n);}});
        return {mode,config,score,matched:[...new Set(matched)]};
      }

function detectSearchMode(query) {
        const q=normalizeSmartQuery(query); if(q.length<2)return null;
        const results=Object.entries(smartRules.modes||{}).map(([mode,c])=>scoreSmartMode(query,mode,c)).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
        if(!results.length)return null;
        const best=results[0], second=results[1];
        if(second && best.score===second.score && best.score < Number(smartRules.settings.tieMinScore||5))return null;
        return best;
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
          const response=await fetch('./smart-rules.json',{cache:'no-store'});
          if(!response.ok)throw new Error('HTTP '+response.status);
          const data=await response.json();
          if(data&&data.modes&&Array.isArray(data.filters))smartRules={...DEFAULT_SMART_RULES,...data,settings:{...DEFAULT_SMART_RULES.settings,...(data.settings||{})}};
          smartRulesLoaded=true;
        }catch(e){smartRules=DEFAULT_SMART_RULES;smartRulesLoaded=false;console.warn('Smart rules fallback',e);}
        updateSmartIndicator(); if(typeof renderContextualFilters==='function')renderContextualFilters();
      }

