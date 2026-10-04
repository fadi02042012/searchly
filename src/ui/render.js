/** Searchly extracted module. Logic preserved from app.js. */

function escapeHTML(value) {
        if (value === null || value === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(value);
        return div.innerHTML;
      }

function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
      }

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
          groupDiv.innerHTML = `<div class="all-filter-group-title">${escapeHTML(icon)} ${escapeHTML(groupName)}</div>`;
          const itemsDiv = document.createElement('div');
          itemsDiv.className = 'all-filter-items';
          items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'all-filter-item';
            itemDiv.dataset.linkIndex = String(item.index);
            const parts = item.name.trim().split(' ');
            const itemIcon = parts[0];
            const itemName = parts.slice(1).join(' ');
            itemDiv.innerHTML = `<span class="af-icon">${escapeHTML(itemIcon)}</span><span class="af-name">${escapeHTML(itemName)}</span>`;
            itemsDiv.appendChild(itemDiv);
          });
          groupDiv.appendChild(itemsDiv);
          grid.appendChild(groupDiv);
        });
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

function updateFilterSummary() {
        const active = getActiveFilters();
        openFiltersBtn.classList.toggle('has-filters', active.length > 0);
        if (active.length > 0) {
          filterBadge.style.display = 'flex';
          filterBadge.textContent = active.length;
        } else filterBadge.style.display = 'none';
      }

