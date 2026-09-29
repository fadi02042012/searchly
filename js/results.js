
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
          'videos': 'videos'
        };
        const detectedMode = modeId === 'smart' ? (detectSearchMode(currentQuery || '')?.mode || 'web') : modeId;
        const targetTab = modeToTabMap[detectedMode] || 'quick';
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.filter-panel').forEach(p => p.classList.remove('active'));
        const tabBtn = document.querySelector(`.filter-tab[data-tab="${targetTab}"]`);
        if (tabBtn) tabBtn.classList.add('active');
        const panel = document.querySelector(`.filter-panel[data-panel="${targetTab}"]`);
        if (panel) panel.classList.add('active');
        if (false) { }
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
          if (false) { }
        });
      }

      function renderContextualFilters() {
        const mode = getActiveMode();
        let modeKey = mode === 'smart' ? (detectSearchMode(currentQuery)?.mode || 'web') : mode;
        const suggestions = contextualSuggestions[modeKey];
        if (!suggestions || suggestions.length === 0) {
          contextualFilters.classList.remove('show');
          return;
        }
        contextualFilters.classList.add('show');
        cfLabelText.textContent = langStrings[currentLang].cfLabelText;
        cfChips.innerHTML = '';
        suggestions.forEach(sug => {
          const chip = document.createElement('button');
          chip.className = 'cf-chip';
          chip.innerHTML = `<span class="chip-icon">${sug.icon}</span><span>${sug.label}</span>`;
          chip.addEventListener('click', () => {
            sug.apply();
            saveCurrentStateToMode();
            chip.classList.toggle('active');
            updateFilterSummary();
            renderActiveFiltersBar();
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
