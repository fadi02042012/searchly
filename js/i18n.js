
      // =====================================================
      // EVENT LISTENERS
      // =====================================================
      searchBtn.addEventListener('click', () => performSearch());
      searchInput.addEventListener('input', () => {
        showSuggestions();
        updateSmartIndicator();
        if (getActiveMode() === 'smart') renderContextualFilters();
      });
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
        localStorage.setItem('sh_theme', isDark ? 'dark' : 'light');
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
        const initialMode = savedMode || 'web';
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

    \n