class I18n {
  constructor() {
    this.languages = {
      'en': { name: 'English', flag: 'EN', file: 'languages/en.json' },
      'fr': { name: 'Français', flag: 'FR', file: 'languages/fr.json' },
      'de': { name: 'Deutsch', flag: 'DE', file: 'languages/de.json' },
      'es': { name: 'Español', flag: 'ES', file: 'languages/es.json' },
      'vi': { name: 'Tiếng Việt', flag: 'VN', file: 'languages/vi.json' },
      'ja': { name: '日本語', flag: 'JP', file: 'languages/ja.json' },
      'ko': { name: '한국어', flag: 'KR', file: 'languages/ko.json' }
    };
    this.currentLanguage = localStorage.getItem('tft-calc-language') || 'en';
    this.translations = {};
    this.loadLanguage(this.currentLanguage);
  }

  async loadLanguage(langCode) {
    try {
      const response = await fetch(this.languages[langCode].file);
      if (!response.ok) {
        throw new Error(`Failed to load language file: ${response.status}`);
      }
      this.translations = await response.json();
      this.currentLanguage = langCode;
      localStorage.setItem('tft-calc-language', langCode);
      this.updateUI();
    } catch (error) {
      console.error('Error loading language:', error);
      // Fallback mech to en
      if (langCode !== 'en') {
        this.loadLanguage('en');
      }
    }
  }

  t(key, variables = {}) {
    let translation = this.translations[key] || key;
    
    // Replace variables in the translation
    Object.keys(variables).forEach(variable => {
      translation = translation.replace(`{${variable}}`, variables[variable]);
    });
    
    return translation;
  }

  updateUI() {
    // page title
    document.title = this.t('title') + ' | Teamfight Tactics Shop Odds & Probability Tool';
    
    // main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
      mainTitle.textContent = this.t('title');
    }

    // disclaimer
    const disclaimer = document.querySelector('.description-section');
    if (disclaimer) {
      disclaimer.innerHTML = `<b>Disclaimer:</b> ${this.t('disclaimer')}`;
    }

    // form labels
    const currentLevelLabel = document.querySelector('label[for="level-search"]');
    if (currentLevelLabel) {
      currentLevelLabel.textContent = this.t('currentLevel');
    }

    const unitLabel = document.querySelector('label[for="unit-search"]');
    if (unitLabel) {
      unitLabel.textContent = this.t('selectUnit');
    }

    const goldLabel = document.querySelector('label[for="gold"]');
    if (goldLabel) {
      goldLabel.textContent = this.t('amountOfGold');
    }

    // placeholders
    const levelSearch = document.getElementById('level-search');
    if (levelSearch) {
      levelSearch.placeholder = this.t('levelPlaceholder');
    }

    const unitSearch = document.getElementById('unit-search');
    if (unitSearch) {
      unitSearch.placeholder = this.t('unitPlaceholder');
    }

    // chart title
    const chartTitle = document.querySelector('.chart-section h2');
    if (chartTitle) {
      chartTitle.textContent = this.t('probabilityChart');
    }

    // dynamic labels
    if (typeof selectedUnit !== 'undefined' && selectedUnit) {
      this.updateDynamicLabels(selectedUnit);
    }

    // current language display
    this.updateLanguageSelector();
    
    // chart and gold requirements
    if (typeof updateChart === 'function') {
      updateChart();
    }
  }

  updateDynamicLabels(unit = null) {
    if (unit) {
      const copiesLabel = document.querySelector('label[for="copies-out"]');
      if (copiesLabel) {
        copiesLabel.innerHTML = this.t('copiesOut', { unitName: `<span id="unit-name-label">${unit.name}</span>` });
      }

      const poolLabel = document.querySelector('label[for="pool-out"]');
      if (poolLabel) {
        poolLabel.innerHTML = this.t('poolOut', { cost: `<span id="cost-label">${unit.cost}</span>` });
      }
    }
  }

  updateLanguageSelector() {
    const currentLangButton = document.getElementById('current-language');
    if (currentLangButton) {
      const lang = this.languages[this.currentLanguage];
      currentLangButton.innerHTML = `<span class="flag-badge">${lang.flag}</span> ${lang.name}`;
    }
    
    // dropdown options highlighting
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
      const options = dropdown.querySelectorAll('.language-option');
      options.forEach((option, index) => {
        const langCode = Object.keys(this.languages)[index];
        if (langCode === this.currentLanguage) {
          option.classList.add('selected');
        } else {
          option.classList.remove('selected');
        }
      });
    }
  }

  createLanguageSelector() {
    const header = document.createElement('header');
    header.className = 'language-header';
    
    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    
    const currentLangButton = document.createElement('button');
    currentLangButton.id = 'current-language';
    currentLangButton.className = 'current-language-btn';
    const currentLang = this.languages[this.currentLanguage];
    currentLangButton.innerHTML = `<span class="flag-badge">${currentLang.flag}</span> ${currentLang.name}`;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'language-dropdown';
    dropdown.id = 'language-dropdown';
    
    Object.entries(this.languages).forEach(([code, lang]) => {
      const option = document.createElement('div');
      option.className = 'language-option';
      if (code === this.currentLanguage) {
        option.classList.add('selected');
      }
      option.innerHTML = `<span class="flag-badge">${lang.flag}</span> ${lang.name}`;
      option.onclick = () => {
        this.loadLanguage(code);
        this.hideLanguageDropdown();
      };
      dropdown.appendChild(option);
    });
    
    currentLangButton.onclick = () => {
      this.toggleLanguageDropdown();
    };
    
    languageSelector.appendChild(currentLangButton);
    languageSelector.appendChild(dropdown);
    header.appendChild(languageSelector);
    
    document.body.insertBefore(header, document.body.firstChild);
    
    // Close dropdown
    document.addEventListener('click', (e) => {
      if (!languageSelector.contains(e.target)) {
        this.hideLanguageDropdown();
      }
    });
  }

  toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('current-language');
    
    if (dropdown.style.display === 'block') {
      this.hideLanguageDropdown();
    } else {
      this.showLanguageDropdown();
    }
  }

  showLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('current-language');
    dropdown.style.display = 'block';
    button.classList.add('open');
  }

  hideLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('current-language');
    dropdown.style.display = 'none';
    button.classList.remove('open');
  }
}

const i18n = new I18n(); 