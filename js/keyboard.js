
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
