/**
 * GOCASA360IT - Componentes Reutilizáveis
 * Versão: 1.0
 * Data: 28/12/2025
 * 
 * Este arquivo contém componentes padronizados que devem ser usados
 * em todas as páginas do projeto para garantir consistência visual.
 */

// ============================================
// 🎨 CONFIGURAÇÃO DE TEMA TAILWIND
// ============================================

// Adicionar ao <head> de cada página:
const TAILWIND_CONFIG = `
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#1976D2',
          secondary: '#0ea5e9',
          accent: '#f59e0b',
          success: '#28A745',
          danger: '#DC3545',
          warning: '#FFC107',
          info: '#17a2b8',
          dark: '#212529',
          light: '#f8f9fa'
        }
      }
    }
  }
</script>
`;

// ============================================
// 🏠 LOGO SVG OFICIAL
// ============================================

const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" class="h-10">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1976D2;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#28A745;stop-opacity:1"/>
    </linearGradient>
  </defs>
  <!-- Casa -->
  <path d="M 20 40 L 50 15 L 80 40 L 80 75 L 20 75 Z" 
        fill="url(#logoGradient)" stroke="white" stroke-width="3"/>
  <!-- Porta -->
  <rect x="40" y="55" width="20" height="20" fill="white"/>
  <!-- Janela -->
  <rect x="30" y="45" width="10" height="10" fill="white" opacity="0.8"/>
  <rect x="60" y="45" width="10" height="10" fill="white" opacity="0.8"/>
  
  <!-- Texto GOCASA360 -->
  <text x="95" y="60" font-family="Inter, Arial, sans-serif" 
        font-size="36" font-weight="700" fill="#1976D2">
    GOCASA
  </text>
  <text x="240" y="60" font-family="Inter, Arial, sans-serif" 
        font-size="36" font-weight="700" fill="#28A745">
    360
  </text>
  <!-- IT -->
  <text x="320" y="55" font-family="Inter, Arial, sans-serif" 
        font-size="24" font-weight="400" fill="#6B7280">
    IT
  </text>
</svg>
`;

// ============================================
// 🧭 NAVBAR (Componente Principal)
// ============================================

/**
 * Renderiza a Navbar oficial do GOCASA360IT
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.isAuthenticated - Usuário autenticado?
 * @param {string} options.userType - Tipo de usuário (proprietario, inquilino, corretor, admin)
 * @param {string} options.currentPage - Página atual (para highlight)
 * @returns {string} HTML da navbar
 */
function renderNavbar(options = {}) {
  const {
    isAuthenticated = false,
    userType = '',
    currentPage = '',
    userName = 'Usuário'
  } = options;

  const navLinks = isAuthenticated ? `
    <div class="hidden md:flex items-center gap-6">
      <a href="/imoveis" 
         class="text-gray-700 hover:text-primary transition-colors ${currentPage === 'imoveis' ? 'text-primary font-semibold' : ''}">
        <i class="fas fa-search mr-1"></i> Buscar Imóveis
      </a>
      
      ${['proprietario', 'corretor'].includes(userType) ? `
        <a href="/cadastrar-imovel" 
           class="text-gray-700 hover:text-primary transition-colors ${currentPage === 'cadastrar-imovel' ? 'text-primary font-semibold' : ''}">
          <i class="fas fa-plus-circle mr-1"></i> Anunciar
        </a>
      ` : ''}
      
      <a href="/dashboard" 
         class="text-gray-700 hover:text-primary transition-colors ${currentPage === 'dashboard' ? 'text-primary font-semibold' : ''}">
        <i class="fas fa-chart-line mr-1"></i> Dashboard
      </a>
      
      ${userType === 'admin' ? `
        <a href="/admin" 
           class="text-gray-700 hover:text-primary transition-colors ${currentPage === 'admin' ? 'text-primary font-semibold' : ''}">
          <i class="fas fa-shield-alt mr-1"></i> Admin
        </a>
      ` : ''}
      
      <div class="relative group">
        <button class="text-gray-700 hover:text-primary flex items-center gap-2">
          <i class="fas fa-user-circle text-xl"></i>
          <span>${userName}</span>
          <i class="fas fa-chevron-down text-xs"></i>
        </button>
        
        <!-- Dropdown Menu -->
        <div class="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <a href="/perfil" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            <i class="fas fa-user mr-2"></i> Meu Perfil
          </a>
          <a href="/configuracoes" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            <i class="fas fa-cog mr-2"></i> Configurações
          </a>
          <hr class="my-2">
          <button onclick="logout()" class="block w-full text-left px-4 py-2 text-danger hover:bg-gray-100">
            <i class="fas fa-sign-out-alt mr-2"></i> Sair
          </button>
        </div>
      </div>
    </div>
  ` : `
    <div class="hidden md:flex items-center gap-4">
      <a href="/imoveis" class="text-gray-700 hover:text-primary transition-colors">
        <i class="fas fa-search mr-1"></i> Buscar Imóveis
      </a>
      <a href="/login" 
         class="text-primary hover:text-secondary font-semibold transition-colors">
        Entrar
      </a>
      <a href="/cadastro" 
         class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg">
        Cadastrar
      </a>
    </div>
  `;

  return `
    <nav class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a href="/" class="flex items-center">
            ${LOGO_SVG}
          </a>

          ${navLinks}

          <!-- Mobile Menu Button -->
          <button onclick="toggleMobileMenu()" 
                  class="md:hidden text-gray-700 hover:text-primary">
            <i class="fas fa-bars text-2xl"></i>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div id="mobileMenu" class="hidden md:hidden pb-4">
          ${isAuthenticated ? `
            <a href="/imoveis" class="block py-2 text-gray-700 hover:text-primary">
              <i class="fas fa-search mr-2"></i> Buscar Imóveis
            </a>
            ${['proprietario', 'corretor'].includes(userType) ? `
              <a href="/cadastrar-imovel" class="block py-2 text-gray-700 hover:text-primary">
                <i class="fas fa-plus-circle mr-2"></i> Anunciar
              </a>
            ` : ''}
            <a href="/dashboard" class="block py-2 text-gray-700 hover:text-primary">
              <i class="fas fa-chart-line mr-2"></i> Dashboard
            </a>
            <button onclick="logout()" class="block w-full text-left py-2 text-danger hover:text-red-700">
              <i class="fas fa-sign-out-alt mr-2"></i> Sair
            </button>
          ` : `
            <a href="/imoveis" class="block py-2 text-gray-700 hover:text-primary">
              <i class="fas fa-search mr-2"></i> Buscar Imóveis
            </a>
            <a href="/login" class="block py-2 text-primary font-semibold">
              Entrar
            </a>
            <a href="/cadastro" class="block py-2 text-white bg-primary rounded-lg text-center">
              Cadastrar
            </a>
          `}
        </div>
      </div>
    </nav>
  `;
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
}

// ============================================
// 🍞 TOAST NOTIFICATIONS
// ============================================

/**
 * Mostra uma notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms (padrão: 4000)
 */
function showToast(message, type = 'success', duration = 4000) {
  const bgColors = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning text-dark',
    info: 'bg-info'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const toast = document.createElement('div');
  toast.className = `fixed top-5 right-5 ${bgColors[type]} ${type === 'warning' ? 'text-dark' : 'text-white'} px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-slide-in`;
  toast.style.animation = 'slideInRight 0.3s ease-out';
  
  toast.innerHTML = `
    <i class="fas ${icons[type]} text-xl"></i>
    <span class="font-semibold">${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-4 hover:opacity-70 transition-opacity">
      <i class="fas fa-times"></i>
    </button>
  `;

  document.body.appendChild(toast);

  // Auto-remover
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Adicionar animação CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);

// ============================================
// 🗨️ MODAIS
// ============================================

/**
 * Cria e exibe um modal
 * @param {Object} config - Configuração do modal
 * @param {string} config.id - ID único do modal
 * @param {string} config.title - Título do modal
 * @param {string} config.content - Conteúdo HTML do modal
 * @param {Array} config.actions - Array de botões [{text, onClick, class}]
 * @param {boolean} config.closeOnBackdrop - Fechar ao clicar fora? (padrão: true)
 */
function createModal(config) {
  const {
    id,
    title,
    content,
    actions = [],
    closeOnBackdrop = true,
    icon = 'fa-exclamation-triangle',
    iconColor = 'text-warning'
  } = config;

  // Remover modal existente
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const actionsHTML = actions.map(action => `
    <button onclick="${action.onClick}" 
            class="${action.class || 'bg-primary hover:bg-blue-700 text-white'} flex-1 py-2 px-4 rounded-lg font-semibold transition-all">
      ${action.text}
    </button>
  `).join('');

  const modalHTML = `
    <div id="${id}" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         ${closeOnBackdrop ? `onclick="if(event.target === this) closeModal('${id}')"` : ''}>
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in">
        <!-- Cabeçalho -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas ${icon} ${iconColor}"></i>
            ${title}
          </h3>
          <button onclick="closeModal('${id}')" class="text-gray-500 hover:text-gray-700 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="text-gray-600 mb-6">
          ${content}
        </div>

        <!-- Ações -->
        <div class="flex gap-3">
          ${actionsHTML}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Fecha um modal específico
 * @param {string} id - ID do modal
 */
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 200);
  }
}

/**
 * Modal de confirmação rápido
 * @param {string} message - Mensagem de confirmação
 * @param {function} onConfirm - Callback ao confirmar
 */
function confirmDialog(message, onConfirm) {
  const modalId = 'confirmModal_' + Date.now();
  
  createModal({
    id: modalId,
    title: 'Confirmar Ação',
    content: `<p>${message}</p>`,
    icon: 'fa-question-circle',
    iconColor: 'text-info',
    actions: [
      {
        text: 'Cancelar',
        onClick: `closeModal('${modalId}')`,
        class: 'bg-gray-300 hover:bg-gray-400 text-gray-800'
      },
      {
        text: 'Confirmar',
        onClick: `closeModal('${modalId}'); (${onConfirm.toString()})();`,
        class: 'bg-primary hover:bg-blue-700 text-white'
      }
    ]
  });
}

// ============================================
// 🔐 AUTENTICAÇÃO
// ============================================

/**
 * Logout do usuário
 */
async function logout() {
  try {
    const token = localStorage.getItem('token');
    
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    showToast('Logout realizado com sucesso!', 'success');
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  } catch (error) {
    console.error('Erro no logout:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

/**
 * Verifica se o usuário está autenticado
 * @returns {Object|null} Dados do usuário ou null
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Verifica se o usuário está autenticado (redireciona se não)
 * @param {string} redirectTo - URL para redirecionar se não autenticado
 */
function requireAuth(redirectTo = '/login') {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// ============================================
// 📋 LOADING STATES
// ============================================

/**
 * Mostra loading em um botão
 * @param {HTMLElement} button - Elemento do botão
 * @param {boolean} isLoading - Estado de loading
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Aguarde...';
    button.classList.add('opacity-70', 'cursor-not-allowed');
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.innerHTML;
    button.classList.remove('opacity-70', 'cursor-not-allowed');
  }
}

/**
 * Overlay de loading global
 * @param {boolean} show - Mostrar ou ocultar
 */
function showGlobalLoading(show) {
  let overlay = document.getElementById('globalLoadingOverlay');
  
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'globalLoadingOverlay';
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      overlay.innerHTML = `
        <div class="bg-white rounded-xl p-8 shadow-2xl text-center">
          <i class="fas fa-spinner fa-spin text-primary text-5xl mb-4"></i>
          <p class="text-gray-700 font-semibold text-lg">Carregando...</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.classList.remove('hidden');
  } else {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }
}

// ============================================
// 🎨 UTILITÁRIOS
// ============================================

/**
 * Formata valor monetário
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado (€ 1.234,56)
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

/**
 * Formata data
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada (dd/mm/yyyy)
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT');
}

/**
 * Debounce function
 * @param {function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// 📱 EXPORT
// ============================================

// Disponibilizar globalmente
window.GoCasa = {
  renderNavbar,
  showToast,
  createModal,
  closeModal,
  confirmDialog,
  logout,
  getCurrentUser,
  requireAuth,
  setButtonLoading,
  showGlobalLoading,
  formatCurrency,
  formatDate,
  debounce,
  LOGO_SVG,
  TAILWIND_CONFIG
};

console.log('✅ GOCASA360IT Components loaded');
