// Sistema de Internacionalização (i18n) para GOCASA360IT
// Suporta: Português (PT-BR), Italiano (IT-IT), Inglês (EN-US)

class I18n {
  constructor() {
    this.translations = {};
    this.currentLocale = this.detectLocale();
    this.defaultLocale = 'pt-BR';
  }

  // Detecta o idioma do navegador ou localStorage
  detectLocale() {
    // 1. Verifica localStorage
    const saved = localStorage.getItem('locale');
    if (saved && ['pt-BR', 'it-IT', 'en-US'].includes(saved)) {
      return saved;
    }

    // 2. Detecta do navegador
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Mapeamento de idiomas
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('it')) return 'it-IT';
    if (browserLang.startsWith('en')) return 'en-US';
    
    // 3. Default: Português
    return 'pt-BR';
  }

  // Carrega o arquivo de tradução
  async loadTranslations(locale) {
    if (this.translations[locale]) {
      return this.translations[locale];
    }

    try {
      const response = await fetch(`/i18n/${locale}.json`);
      const data = await response.json();
      this.translations[locale] = data;
      return data;
    } catch (error) {
      console.error(`Erro ao carregar traduções para ${locale}:`, error);
      // Fallback para default
      if (locale !== this.defaultLocale) {
        return this.loadTranslations(this.defaultLocale);
      }
      return {};
    }
  }

  // Obtém uma tradução usando notação de ponto (ex: "nav.login")
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLocale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Se não encontrar, tenta no idioma padrão
    if (value === undefined && this.currentLocale !== this.defaultLocale) {
      const defaultKeys = key.split('.');
      let defaultValue = this.translations[this.defaultLocale];
      
      for (const k of defaultKeys) {
        if (defaultValue && typeof defaultValue === 'object') {
          defaultValue = defaultValue[k];
        } else {
          defaultValue = undefined;
          break;
        }
      }
      
      value = defaultValue;
    }

    // Se ainda não encontrar, retorna a key
    if (value === undefined) {
      console.warn(`Tradução não encontrada: ${key}`);
      return key;
    }

    // Substitui parâmetros {param}
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return value;
  }

  // Muda o idioma
  async changeLocale(newLocale) {
    if (!['pt-BR', 'it-IT', 'en-US'].includes(newLocale)) {
      console.error(`Idioma não suportado: ${newLocale}`);
      return false;
    }

    await this.loadTranslations(newLocale);
    this.currentLocale = newLocale;
    localStorage.setItem('locale', newLocale);
    
    // Atualiza a página
    this.updatePageContent();
    
    return true;
  }

  // Atualiza todo o conteúdo da página
  updatePageContent() {
    // Atualiza elementos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // Atualiza placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    // Atualiza títulos (title)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });

    // Evento customizado para componentes React/outros frameworks
    window.dispatchEvent(new CustomEvent('localeChanged', { 
      detail: { locale: this.currentLocale } 
    }));
  }

  // Formata moeda baseada no idioma
  formatCurrency(value) {
    const config = this.translations[this.currentLocale];
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(value);
  }

  // Formata número baseado no idioma
  formatNumber(value) {
    const config = this.translations[this.currentLocale];
    const formatter = new Intl.NumberFormat(config.locale);
    return formatter.format(value);
  }

  // Obtém informações do país
  getCountryInfo() {
    const config = this.translations[this.currentLocale];
    return {
      country: config.country,
      currency: config.currency,
      currencySymbol: config.currencySymbol,
      locale: config.locale
    };
  }

  // Obtém campo de documento do país (CPF, Codice Fiscale, SSN)
  getDocumentFieldInfo() {
    const labels = {
      'pt-BR': { label: 'CPF/CNPJ', placeholder: '000.000.000-00', mask: '999.999.999-99' },
      'it-IT': { label: 'Codice Fiscale', placeholder: 'RSSMRA80A01H501U', mask: 'AAAAAAAAAAAAAAAA' },
      'en-US': { label: 'SSN/Tax ID', placeholder: '000-00-0000', mask: '999-99-9999' }
    };
    
    return labels[this.currentLocale] || labels['pt-BR'];
  }

  // Obtém campo de CEP/CAP/ZIP
  getZipCodeFieldInfo() {
    const labels = {
      'pt-BR': { label: 'CEP', placeholder: '00000-000', mask: '99999-999' },
      'it-IT': { label: 'CAP', placeholder: '00000', mask: '99999' },
      'en-US': { label: 'ZIP Code', placeholder: '00000', mask: '99999' }
    };
    
    return labels[this.currentLocale] || labels['pt-BR'];
  }

  // Obtém máscara de telefone
  getPhoneFieldInfo() {
    const labels = {
      'pt-BR': { placeholder: '(11) 99999-9999', mask: '(99) 99999-9999' },
      'it-IT': { placeholder: '+39 333 123 4567', mask: '+99 999 999 9999' },
      'en-US': { placeholder: '+1 (555) 123-4567', mask: '+9 (999) 999-9999' }
    };
    
    return labels[this.currentLocale] || labels['pt-BR'];
  }

  // Inicializa o sistema i18n
  async init() {
    await this.loadTranslations(this.currentLocale);
    this.updatePageContent();
    return this;
  }
}

// Instância global
const i18n = new I18n();

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.i18n = i18n;
}
