// Helper functions for i18n integration in pages
// This file provides reusable components for multilingual support

// Language selector dropdown for navbar
export const languageSelector = `
  <div class="relative group">
    <button id="langBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
      <span id="currentFlag" class="text-xl">🇧🇷</span>
      <span id="currentLang" class="font-semibold text-gray-700">PT</span>
      <i class="fas fa-chevron-down text-xs text-gray-500"></i>
    </button>
    
    <div id="langDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <button onclick="changeLanguage('pt-BR')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition">
        <span class="text-xl">🇧🇷</span>
        <div class="text-left">
          <div class="font-semibold text-gray-800">Português</div>
          <div class="text-xs text-gray-500">Brasil</div>
        </div>
      </button>
      
      <button onclick="changeLanguage('it-IT')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition border-t border-gray-100">
        <span class="text-xl">🇮🇹</span>
        <div class="text-left">
          <div class="font-semibold text-gray-800">Italiano</div>
          <div class="text-xs text-gray-500">Italia</div>
        </div>
      </button>
      
      <button onclick="changeLanguage('en-US')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition border-t border-gray-100">
        <span class="text-xl">🇺🇸</span>
        <div class="text-left">
          <div class="font-semibold text-gray-800">English</div>
          <div class="text-xs text-gray-500">USA</div>
        </div>
      </button>
    </div>
  </div>
`;

// i18n initialization script for pages
export const i18nInitScript = `
  <script src="/i18n.js"></script>
  <script>
    // Initialize i18n on page load
    let i18nInstance;
    
    async function initI18n() {
      i18nInstance = await i18n.init();
      updateLanguageButton();
      translatePage();
    }
    
    // Change language function
    async function changeLanguage(locale) {
      await i18nInstance.changeLocale(locale);
      updateLanguageButton();
      translatePage();
      closeLangDropdown();
      
      // Reload page to apply translations
      window.location.reload();
    }
    
    // Update language button display
    function updateLanguageButton() {
      const flags = {
        'pt-BR': '🇧🇷',
        'it-IT': '🇮🇹',
        'en-US': '🇺🇸'
      };
      
      const langs = {
        'pt-BR': 'PT',
        'it-IT': 'IT',
        'en-US': 'EN'
      };
      
      const currentLang = i18nInstance.currentLocale;
      const flagEl = document.getElementById('currentFlag');
      const langEl = document.getElementById('currentLang');
      
      if (flagEl) flagEl.textContent = flags[currentLang] || '🇧🇷';
      if (langEl) langEl.textContent = langs[currentLang] || 'PT';
    }
    
    // Toggle language dropdown
    document.addEventListener('click', (e) => {
      const langBtn = document.getElementById('langBtn');
      const langDropdown = document.getElementById('langDropdown');
      
      if (langBtn && langBtn.contains(e.target)) {
        langDropdown.classList.toggle('hidden');
      } else if (langDropdown && !langDropdown.contains(e.target)) {
        langDropdown.classList.add('hidden');
      }
    });
    
    function closeLangDropdown() {
      const langDropdown = document.getElementById('langDropdown');
      if (langDropdown) langDropdown.classList.add('hidden');
    }
    
    // Translate page elements
    function translatePage() {
      // This will be overridden in each page with specific translations
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initI18n);
    } else {
      initI18n();
    }
  </script>
`;

// Format currency helper
export const formatCurrencyScript = `
  function formatCurrency(value) {
    if (!i18nInstance) return 'R$ ' + value;
    return i18nInstance.formatCurrency(value);
  }
`;

// Get document field info (CPF/Codice Fiscale/SSN)
export const getDocumentFieldScript = `
  function getDocumentField() {
    if (!i18nInstance) return { label: 'CPF/CNPJ', placeholder: '000.000.000-00' };
    return i18nInstance.getDocumentFieldInfo();
  }
`;

// Get ZIP code field info (CEP/CAP/ZIP)
export const getZipCodeFieldScript = `
  function getZipCodeField() {
    if (!i18nInstance) return { label: 'CEP', placeholder: '00000-000' };
    return i18nInstance.getZipCodeFieldInfo();
  }
`;

export default {
  languageSelector,
  i18nInitScript,
  formatCurrencyScript,
  getDocumentFieldScript,
  getZipCodeFieldScript
};
