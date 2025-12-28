# 🎨 GoCasa360IT - Design System & Padrões

**Versão**: 1.0  
**Data**: 28/12/2025  
**Status**: ✅ OFICIAL

---

## 🎨 Paleta de Cores

### Cores Principais
```javascript
{
  primary: '#1976D2',      // Azul principal GoCasa
  secondary: '#0ea5e9',    // Azul secundário (360)
  accent: '#f59e0b',       // Amarelo/dourado para destaques
  success: '#28A745',      // Verde para ações positivas
  danger: '#DC3545',       // Vermelho para ações destrutivas
  warning: '#f59e0b',      // Amarelo para avisos
  dark: '#1e293b',         // Texto escuro
  light: '#f1f5f9'         // Background claro
}
```

### Cores de Status
```javascript
{
  disponivel: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    icon: 'check-circle'
  },
  pausado: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    icon: 'pause-circle'
  },
  rascunho: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    icon: 'file'
  },
  pendente: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    icon: 'clock'
  },
  confirmada: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    icon: 'check'
  },
  cancelada: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    icon: 'times'
  }
}
```

---

## 🏗️ Componentes Padrão

### Logo GoCasa360
```html
<div class="flex items-center space-x-2 group">
    <div class="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg shadow-md group-hover:shadow-lg transition">
        <i class="fas fa-home text-white text-2xl"></i>
    </div>
    <div class="flex flex-col">
        <span class="text-primary font-bold text-xl tracking-tight">GoCasa</span>
        <span class="text-secondary font-semibold text-xs -mt-1">360</span>
    </div>
</div>
```

### Favicon
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%231976D2' width='100' height='100' rx='15'/><text y='75' x='50' text-anchor='middle' font-size='60' fill='white' font-family='Arial'>🏠</text></svg>">
```

### Navbar Padrão
```html
<nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <a href="/" class="flex items-center">
                <!-- Logo Component -->
            </a>
            
            <!-- Navigation Links -->
            <div class="flex items-center space-x-4">
                <!-- Se não autenticado -->
                <a href="/imoveis">Buscar Imóveis</a>
                <a href="/anunciar">Anunciar</a>
                <a href="/login">Entrar</a>
                <a href="/cadastro">Cadastrar</a>
                
                <!-- Se autenticado -->
                <a href="/imoveis">Buscar</a>
                <a href="/favoritos">Favoritos</a>
                <a href="/dashboard">Dashboard</a>
                <button onclick="logout()">Sair</button>
            </div>
        </div>
    </div>
</nav>
```

### Botões
```css
/* Primary Button */
.btn-primary {
  @apply px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-semibold;
}

/* Secondary Button */
.btn-secondary {
  @apply px-6 py-3 bg-secondary text-white rounded-lg hover:bg-cyan-600 transition shadow-md hover:shadow-lg font-semibold;
}

/* Success Button */
.btn-success {
  @apply px-6 py-3 bg-success text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg font-semibold;
}

/* Danger Button */
.btn-danger {
  @apply px-6 py-3 bg-danger text-white rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg font-semibold;
}

/* Outline Button */
.btn-outline {
  @apply px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold;
}

/* Icon Action Button */
.btn-action {
  @apply px-4 py-2 rounded-lg transition font-medium;
}
```

### Cards
```html
<!-- Property Card -->
<div class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
    <div class="h-48 bg-gray-300">
        <img src="..." class="w-full h-full object-cover">
    </div>
    <div class="p-4">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Título</h3>
        <p class="text-gray-600 mb-4">Descrição</p>
        <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-primary">€ 1.200</span>
            <button class="btn-primary">Ver Detalhes</button>
        </div>
    </div>
</div>

<!-- Metric Card -->
<div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Título</p>
            <p class="text-3xl font-bold text-gray-900">123</p>
        </div>
        <div class="p-4 bg-blue-50 rounded-full">
            <i class="fas fa-icon text-2xl text-primary"></i>
        </div>
    </div>
</div>
```

### Alertas
```javascript
function showAlert(message, type = 'info') {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  
  const alertDiv = document.getElementById('alert');
  alertDiv.className = `p-4 border rounded-lg ${colors[type]} mb-6`;
  alertDiv.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-${icons[type]} mr-3 text-xl"></i>
      <span>${message}</span>
    </div>
  `;
  alertDiv.classList.remove('hidden');
  
  setTimeout(() => alertDiv.classList.add('hidden'), 5000);
}
```

### Modais
```html
<!-- Modal Template -->
<div id="modalId" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center mb-4">
            <div class="p-3 bg-blue-100 rounded-full mr-4">
                <i class="fas fa-icon text-2xl text-primary"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Título</h3>
        </div>
        
        <p class="text-gray-700 mb-6">Conteúdo do modal</p>
        
        <div class="flex space-x-3">
            <button onclick="fecharModal('modalId')" class="flex-1 btn-outline">
                Cancelar
            </button>
            <button class="flex-1 btn-primary">
                Confirmar
            </button>
        </div>
    </div>
</div>
```

---

## 📐 Layout Padrão

### Grid Responsivo
```css
/* Mobile: 1 coluna */
/* Tablet: 2 colunas */
/* Desktop: 3 colunas */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

### Container
```css
.container-app {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Espaçamento
```css
/* Seções principais */
.section-spacing {
  @apply py-8 md:py-12;
}

/* Entre elementos */
.element-spacing {
  @apply space-y-6;
}
```

---

## 🔤 Tipografia

### Fonte
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
body { 
  font-family: 'Inter', sans-serif; 
}
```

### Hierarquia
```css
/* Título Principal (H1) */
.heading-1 {
  @apply text-4xl font-bold text-gray-900 mb-4;
}

/* Título Seção (H2) */
.heading-2 {
  @apply text-2xl font-bold text-gray-900 mb-3;
}

/* Título Card (H3) */
.heading-3 {
  @apply text-xl font-bold text-gray-900 mb-2;
}

/* Corpo de texto */
.body-text {
  @apply text-base text-gray-700 leading-relaxed;
}

/* Texto pequeno */
.small-text {
  @apply text-sm text-gray-600;
}

/* Texto muito pequeno */
.tiny-text {
  @apply text-xs text-gray-500;
}
```

---

## 🔐 Autenticação

### Verificação de Token
```javascript
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  return token;
}
```

### Logout
```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### Headers de API
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};
```

---

## 🌐 Rotas Padrão

### Páginas Públicas
- `/` - Landing page
- `/imoveis` - Busca de imóveis
- `/imoveis/:id` - Detalhes do imóvel
- `/login` - Login
- `/cadastro` - Registro
- `/privacy-policy` - Política de privacidade
- `/terms-of-service` - Termos de serviço

### Páginas Protegidas (Requerem Autenticação)
- `/dashboard` - Dashboard proprietário
- `/cadastrar-imovel` - Wizard de cadastro
- `/favoritos` - Favoritos do usuário
- `/perfil` - Perfil do usuário
- `/mensagens` - Mensagens

### Páginas Admin
- `/admin` - Painel administrativo

---

## 📱 Responsividade

### Breakpoints Tailwind
```javascript
{
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Classes Úteis
```css
/* Esconder em mobile */
.hidden-mobile { @apply hidden md:block; }

/* Mostrar apenas em mobile */
.mobile-only { @apply block md:hidden; }

/* Stack em mobile, row em desktop */
.stack-mobile { @apply flex flex-col md:flex-row; }
```

---

## 🎯 Estados Vazios (Empty States)

### Template
```html
<div class="text-center py-12">
    <i class="fas fa-icon text-6xl text-gray-300 mb-4"></i>
    <h3 class="text-xl font-bold text-gray-700 mb-2">Título</h3>
    <p class="text-gray-600 mb-6">Descrição do estado vazio</p>
    <a href="#" class="btn-primary">Ação Principal</a>
</div>
```

---

## ⏳ Estados de Loading

### Spinner
```html
<div class="text-center py-12">
    <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
    <p class="text-gray-600">Carregando...</p>
</div>
```

### Skeleton
```css
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}
```

---

## 🔔 Notificações

### Toast Notification
```javascript
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${getToastColor(type)} z-50 animate-slide-up`;
  toast.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-${getToastIcon(type)} mr-3"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
```

---

## 📊 Formatação de Dados

### Preços (€ Euro Italiano)
```javascript
function formatPrice(value) {
  return `€ ${parseFloat(value).toLocaleString('it-IT')}`;
}
```

### Datas (Formato Italiano)
```javascript
function formatDate(date) {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
```

### Números
```javascript
function formatNumber(value) {
  return parseInt(value).toLocaleString('it-IT');
}
```

---

## ✅ Validações

### Email
```javascript
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Telefone Italiano
```javascript
function validatePhone(phone) {
  return /^(\+39)?[\s]?[0-9]{9,10}$/.test(phone);
}
```

### CEP/CAP Italiano
```javascript
function validateCAP(cap) {
  return /^[0-9]{5}$/.test(cap);
}
```

---

## 🎨 Animações

### Transições
```css
.transition-all {
  @apply transition-all duration-300 ease-in-out;
}

.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-500 ease-in-out;
}
```

### Hover Effects
```css
.hover-lift {
  @apply transition-transform hover:-translate-y-1;
}

.hover-shadow {
  @apply shadow hover:shadow-lg transition-shadow;
}
```

---

## 📋 Checklist de Implementação

Ao criar uma nova página/componente, verificar:

- [ ] Paleta de cores GoCasa360 aplicada
- [ ] Logo padrão incluído
- [ ] Favicon configurado
- [ ] Navbar com links corretos
- [ ] Responsividade (mobile, tablet, desktop)
- [ ] Estados de loading
- [ ] Estados vazios (empty states)
- [ ] Mensagens de erro/sucesso
- [ ] Autenticação (se necessário)
- [ ] Formatação de preços em €
- [ ] Fonte Inter aplicada
- [ ] Transições suaves
- [ ] Acessibilidade (alt text, aria labels)

---

**Última atualização**: 28/12/2025  
**Versão**: 1.0  
**Mantido por**: Equipe GoCasa360IT
