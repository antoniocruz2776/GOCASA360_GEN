# 🎨 GOCASA360IT - Padrões de Desenvolvimento

**Versão**: 1.0  
**Data**: 28/12/2025  
**Status**: 📋 OFICIAL

---

## 📋 Índice

1. [Design System](#-design-system)
2. [Componentes UI](#-componentes-ui)
3. [Padrões de API](#-padrões-de-api)
4. [Estrutura de Código](#-estrutura-de-código)
5. [Nomenclatura](#-nomenclatura)
6. [Mensagens e i18n](#-mensagens-e-i18n)
7. [Segurança](#-segurança)

---

## 🎨 Design System

### **Paleta de Cores Oficial**

```javascript
// Tailwind Config Extension
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',    // Azul principal (brand)
        secondary: '#0ea5e9',  // Azul claro (hover, links)
        accent: '#f59e0b',     // Laranja (destaques)
        success: '#28A745',    // Verde (sucesso)
        danger: '#DC3545',     // Vermelho (erro, exclusão)
        warning: '#FFC107',    // Amarelo (avisos, pausado)
        info: '#17a2b8',       // Azul info
        dark: '#212529',       // Preto (textos)
        light: '#f8f9fa'       // Cinza claro (backgrounds)
      }
    }
  }
}
```

### **Uso de Cores por Contexto**

| Contexto | Cor | Classe Tailwind | Uso |
|----------|-----|-----------------|-----|
| Botão principal | `primary` | `bg-primary hover:bg-blue-700` | CTAs, ações principais |
| Botão secundário | `secondary` | `bg-secondary hover:bg-sky-600` | Ações secundárias |
| Links | `primary` | `text-primary hover:text-secondary` | Navegação, hiperlinks |
| Sucesso | `success` | `bg-success text-white` | Confirmações, toasts de sucesso |
| Erro | `danger` | `bg-danger text-white` | Erros, exclusões |
| Aviso | `warning` | `bg-warning text-dark` | Alertas, status pausado |
| Status Ativo | `success` | `bg-green-100 text-green-800` | Badge verde |
| Status Pausado | `warning` | `bg-yellow-100 text-yellow-800` | Badge amarelo |
| Status Rascunho | `gray` | `bg-gray-100 text-gray-800` | Badge cinza |

---

## 🧩 Componentes UI

### **1. Navbar (Padrão Oficial)**

**Logo**: SVG inline com gradiente azul-verde

```html
<!-- Navbar Oficial GOCASA360IT -->
<nav class="bg-white shadow-md border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo SVG Inline -->
      <a href="/" class="flex items-center gap-2">
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
      </a>

      <!-- Menu Desktop -->
      <div class="hidden md:flex items-center gap-6">
        <a href="/imoveis" class="text-gray-700 hover:text-primary">
          <i class="fas fa-search mr-1"></i> Buscar Imóveis
        </a>
        <a href="/cadastrar-imovel" class="text-gray-700 hover:text-primary">
          <i class="fas fa-plus-circle mr-1"></i> Anunciar
        </a>
        <a href="/dashboard" class="text-gray-700 hover:text-primary">
          <i class="fas fa-chart-line mr-1"></i> Dashboard
        </a>
        <button onclick="logout()" 
                class="bg-danger hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          <i class="fas fa-sign-out-alt mr-1"></i> Sair
        </button>
      </div>
    </div>
  </div>
</nav>
```

### **2. Botões**

```html
<!-- Botão Primário -->
<button class="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
  <i class="fas fa-check mr-2"></i> Ação Principal
</button>

<!-- Botão Secundário -->
<button class="bg-secondary hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
  <i class="fas fa-arrow-left mr-2"></i> Voltar
</button>

<!-- Botão Perigo -->
<button class="bg-danger hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
  <i class="fas fa-trash mr-2"></i> Excluir
</button>

<!-- Botão Outline -->
<button class="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200">
  <i class="fas fa-save mr-2"></i> Salvar Rascunho
</button>
```

### **3. Inputs e Forms**

```html
<!-- Input Padrão -->
<div class="mb-4">
  <label class="block text-gray-700 font-semibold mb-2">
    Título do Imóvel <span class="text-danger">*</span>
  </label>
  <input type="text" 
         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
         placeholder="Ex: Apartamento moderno com 2 quartos"
         required>
  <p class="text-sm text-gray-500 mt-1">Máximo 100 caracteres</p>
</div>

<!-- Select Padrão -->
<div class="mb-4">
  <label class="block text-gray-700 font-semibold mb-2">
    Tipo de Imóvel <span class="text-danger">*</span>
  </label>
  <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
    <option value="">Selecione...</option>
    <option value="apartamento">Apartamento</option>
    <option value="casa">Casa</option>
    <option value="kitnet">Kitnet</option>
  </select>
</div>

<!-- Textarea -->
<div class="mb-4">
  <label class="block text-gray-700 font-semibold mb-2">Descrição</label>
  <textarea class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
            rows="4" 
            placeholder="Descreva o imóvel..."></textarea>
</div>
```

### **4. Cards**

```html
<!-- Card de Imóvel -->
<div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
  <!-- Imagem -->
  <div class="relative">
    <img src="..." alt="..." class="w-full h-48 object-cover">
    <!-- Badge Status -->
    <span class="absolute top-3 right-3 bg-success text-white px-3 py-1 rounded-full text-sm font-semibold">
      Ativo
    </span>
  </div>
  
  <!-- Conteúdo -->
  <div class="p-5">
    <h3 class="text-xl font-bold text-gray-800 mb-2 truncate">
      Apartamento moderno com 2 quartos
    </h3>
    <p class="text-gray-600 mb-3">Via Roma, 123 - Milano, MI</p>
    
    <!-- Métricas -->
    <div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
      <span><i class="fas fa-eye mr-1"></i> 234 views</span>
      <span><i class="fas fa-heart mr-1"></i> 12 favoritos</span>
    </div>
    
    <!-- Ações -->
    <div class="flex gap-2">
      <button class="flex-1 bg-primary hover:bg-blue-700 text-white py-2 rounded-lg text-sm">
        <i class="fas fa-eye mr-1"></i> Ver
      </button>
      <button class="flex-1 bg-secondary hover:bg-sky-600 text-white py-2 rounded-lg text-sm">
        <i class="fas fa-edit mr-1"></i> Editar
      </button>
    </div>
  </div>
</div>
```

### **5. Modais**

```html
<!-- Modal Padrão -->
<div id="modalExcluir" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
  <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">
        <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
        Confirmar Exclusão
      </h3>
      <button onclick="fecharModal()" class="text-gray-500 hover:text-gray-700">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>
    
    <!-- Conteúdo -->
    <p class="text-gray-600 mb-6">
      Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
    </p>
    
    <!-- Ações -->
    <div class="flex gap-3">
      <button onclick="fecharModal()" 
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-semibold">
        Cancelar
      </button>
      <button onclick="confirmarExclusao()" 
              class="flex-1 bg-danger hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold">
        <i class="fas fa-trash mr-2"></i> Excluir
      </button>
    </div>
  </div>
</div>
```

### **6. Toast Notifications**

```javascript
// Toast Padrão
function showToast(message, type = 'success') {
  const bgColors = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  };
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  const toast = document.createElement('div');
  toast.className = `fixed top-5 right-5 ${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-fade-in`;
  toast.innerHTML = `
    <i class="fas ${icons[type]} text-xl"></i>
    <span class="font-semibold">${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-4 hover:text-gray-200">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remover após 4 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Uso:
showToast('Imóvel cadastrado com sucesso!', 'success');
showToast('Erro ao salvar imóvel', 'error');
showToast('Preencha todos os campos obrigatórios', 'warning');
```

### **7. Badges de Status**

```html
<!-- Status Ativo -->
<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
  <i class="fas fa-check-circle mr-1"></i> Ativo
</span>

<!-- Status Pausado -->
<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
  <i class="fas fa-pause-circle mr-1"></i> Pausado
</span>

<!-- Status Rascunho -->
<span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
  <i class="fas fa-file-alt mr-1"></i> Rascunho
</span>
```

---

## 🔌 Padrões de API

### **1. Estrutura de Response Padrão**

```typescript
// ✅ Sucesso
{
  "success": true,
  "data": {
    // dados da resposta
  },
  "message": "Operação realizada com sucesso" // opcional
}

// ❌ Erro
{
  "success": false,
  "error": "Mensagem de erro detalhada",
  "code": "VALIDATION_ERROR", // opcional
  "details": { } // opcional, para erros de validação
}
```

### **2. Endpoints CRUD Padrão**

```typescript
// Listar recursos (GET /api/imoveis)
GET /api/imoveis?page=1&limit=20&order_by=created_at&order_dir=desc
Response: {
  success: true,
  data: {
    imoveis: [...],
    pagination: {
      total: 156,
      page: 1,
      limit: 20,
      pages: 8
    }
  }
}

// Buscar por ID (GET /api/imoveis/:id)
GET /api/imoveis/imovel_abc123
Response: {
  success: true,
  data: { ...imóvel }
}

// Criar recurso (POST /api/imoveis)
POST /api/imoveis
Body: { titulo: "...", tipo: "...", ... }
Response: {
  success: true,
  data: { id: "imovel_xyz", ...imóvel },
  message: "Imóvel cadastrado com sucesso"
}

// Atualizar recurso (PUT /api/imoveis/:id)
PUT /api/imoveis/imovel_abc123
Body: { titulo: "Novo título", ... }
Response: {
  success: true,
  data: { ...imóvel atualizado },
  message: "Imóvel atualizado com sucesso"
}

// Atualizar parcialmente (PATCH /api/imoveis/:id/status)
PATCH /api/imoveis/imovel_abc123/status
Body: { status: "pausado" }
Response: {
  success: true,
  data: { status: "pausado" },
  message: "Status atualizado com sucesso"
}

// Excluir recurso (DELETE /api/imoveis/:id)
DELETE /api/imoveis/imovel_abc123
Response: {
  success: true,
  message: "Imóvel excluído com sucesso"
}
```

### **3. Autenticação JWT**

```typescript
// Header padrão para rotas protegidas
Authorization: Bearer <token>

// Middleware de autenticação
async function requireAuth(c, next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return c.json({ success: false, error: 'Token não fornecido' }, 401);
  }
  
  try {
    const decoded = await verifyJWT(token, JWT_SECRET);
    const user = await getUserFromToken(token, c.env.DB);
    
    if (!user) {
      return c.json({ success: false, error: 'Sessão inválida' }, 401);
    }
    
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Token inválido' }, 401);
  }
}
```

### **4. Tratamento de Erros**

```typescript
// Erro de validação (400)
return c.json({
  success: false,
  error: 'Dados inválidos',
  code: 'VALIDATION_ERROR',
  details: {
    titulo: 'Campo obrigatório',
    preco_aluguel: 'Deve ser maior que 0'
  }
}, 400);

// Não autenticado (401)
return c.json({
  success: false,
  error: 'Usuário não autenticado'
}, 401);

// Sem permissão (403)
return c.json({
  success: false,
  error: 'Você não tem permissão para acessar este recurso'
}, 403);

// Não encontrado (404)
return c.json({
  success: false,
  error: 'Imóvel não encontrado'
}, 404);

// Erro interno (500)
return c.json({
  success: false,
  error: 'Erro interno do servidor'
}, 500);
```

---

## 📁 Estrutura de Código

### **1. Organização de Arquivos**

```
webapp/
├── src/
│   ├── index.tsx              # Entry point
│   ├── routes/
│   │   ├── auth.ts            # Autenticação
│   │   ├── imoveis.ts         # CRUD Imóveis
│   │   ├── favoritos.ts       # Favoritos
│   │   ├── visitas.ts         # Visitas
│   │   ├── propostas.ts       # Propostas
│   │   ├── dashboard.ts       # Dashboard
│   │   ├── admin.ts           # Admin básico
│   │   └── pages.tsx          # Páginas HTML
│   ├── utils/
│   │   ├── jwt.ts             # JWT helpers
│   │   ├── codice-fiscale.ts  # Validador CF
│   │   └── gdpr-compliance.ts # GDPR utils
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   └── static/
│       ├── wizard-imovel.js   # Wizard frontend
│       └── dashboard.js       # Dashboard frontend
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_add_visitas.sql
│   ├── 0003_add_propostas.sql
│   └── 0004_gdpr_compliance.sql
└── docs/
    ├── DoR.md
    ├── FLUXOS_USUARIO.md
    └── ...
```

### **2. Convenções de Nomenclatura**

```typescript
// ✅ Variáveis e funções: camelCase
const userName = 'João';
function getUserById(id) { }

// ✅ Constantes: UPPER_SNAKE_CASE
const JWT_SECRET = 'secret';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ✅ Componentes/Classes: PascalCase
class UserService { }

// ✅ Arquivos: kebab-case
// wizard-imovel.js
// codice-fiscale.ts

// ✅ IDs no banco: snake_case com prefixo
const imovelId = 'imovel_abc123';
const userId = 'user_xyz456';

// ✅ Campos de banco: snake_case
// usuario_id, preco_aluguel, created_at

// ✅ Rotas de API: kebab-case
// /api/cadastrar-imovel
// /api/dashboard/metrics
```

---

## 🌐 Mensagens e i18n

### **1. Mensagens de Sucesso**

```javascript
const SUCCESS_MESSAGES = {
  IMOVEL_CREATED: 'Imóvel cadastrado com sucesso!',
  IMOVEL_UPDATED: 'Imóvel atualizado com sucesso!',
  IMOVEL_DELETED: 'Imóvel excluído com sucesso!',
  IMOVEL_PAUSED: 'Imóvel pausado com sucesso!',
  IMOVEL_REACTIVATED: 'Imóvel reativado com sucesso!',
  DRAFT_SAVED: 'Rascunho salvo com sucesso!',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!'
};
```

### **2. Mensagens de Erro**

```javascript
const ERROR_MESSAGES = {
  // Autenticação
  AUTH_REQUIRED: 'Você precisa estar autenticado para acessar esta página',
  INVALID_CREDENTIALS: 'Email ou senha inválidos',
  SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente',
  
  // Validação
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_CEP: 'CEP inválido',
  INVALID_CF: 'Codice Fiscale inválido',
  
  // Upload
  FILE_TOO_LARGE: 'Arquivo muito grande. Máximo 10MB',
  INVALID_FILE_TYPE: 'Tipo de arquivo inválido. Use JPG ou PNG',
  MIN_PHOTOS: 'Selecione no mínimo 3 fotos',
  MAX_PHOTOS: 'Máximo de 20 fotos permitido',
  
  // Recursos
  IMOVEL_NOT_FOUND: 'Imóvel não encontrado',
  ACCESS_DENIED: 'Você não tem permissão para acessar este recurso',
  
  // Genéricos
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet'
};
```

---

## 🔒 Segurança

### **1. Validação de Inputs**

```typescript
// Sempre validar inputs no backend
function validateImovelData(data) {
  const errors = {};
  
  // Campos obrigatórios
  if (!data.titulo || data.titulo.trim().length === 0) {
    errors.titulo = 'Título é obrigatório';
  }
  
  if (data.titulo && data.titulo.length > 100) {
    errors.titulo = 'Título deve ter no máximo 100 caracteres';
  }
  
  // Validar enum
  const tiposValidos = ['apartamento', 'casa', 'kitnet', 'cobertura', 'terreno', 'comercial', 'rural'];
  if (!tiposValidos.includes(data.tipo)) {
    errors.tipo = 'Tipo de imóvel inválido';
  }
  
  // Validar números
  if (data.preco_aluguel && (isNaN(data.preco_aluguel) || data.preco_aluguel < 0)) {
    errors.preco_aluguel = 'Preço de aluguel inválido';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
```

### **2. Proteção de Rotas**

```typescript
// Middleware de autenticação
imoveis.use('/*', requireAuth);

// Middleware de autorização
async function requireProprietario(c, next) {
  const user = c.get('user');
  
  if (!['proprietario', 'corretor'].includes(user.tipo)) {
    return c.json({
      success: false,
      error: 'Apenas proprietários e corretores podem cadastrar imóveis'
    }, 403);
  }
  
  await next();
}

// Verificar ownership
async function verifyOwnership(c, next) {
  const user = c.get('user');
  const imovelId = c.req.param('id');
  
  const imovel = await c.env.DB.prepare(
    'SELECT * FROM imoveis WHERE id = ?'
  ).bind(imovelId).first();
  
  if (!imovel) {
    return c.json({ success: false, error: 'Imóvel não encontrado' }, 404);
  }
  
  if (imovel.proprietario_id !== user.id && user.tipo !== 'admin') {
    return c.json({
      success: false,
      error: 'Você não tem permissão para editar este imóvel'
    }, 403);
  }
  
  c.set('imovel', imovel);
  await next();
}
```

### **3. Sanitização de HTML**

```javascript
// Escapar HTML para prevenir XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Uso:
const safeTitle = escapeHtml(userInput);
```

---

## 📊 Métricas e Logging

### **1. Logging Padrão**

```typescript
// Log de operações importantes
console.log('[INFO] Imóvel criado:', { id: imovelId, user: user.id });
console.error('[ERROR] Falha ao criar imóvel:', error.message);
console.warn('[WARN] Upload de foto falhou, usando fallback');
```

### **2. Métricas de Performance**

```typescript
// Medir tempo de execução
const start = Date.now();
// ... operação
const duration = Date.now() - start;
console.log(`[PERF] Operação concluída em ${duration}ms`);
```

---

## ✅ Checklist de Padrões

Ao criar uma nova página ou componente, verificar:

- [ ] Navbar com logo SVG inline oficial
- [ ] Paleta de cores correta (primary, secondary, success, danger, warning)
- [ ] Botões seguem os padrões definidos
- [ ] Inputs com labels, placeholders e mensagens de ajuda
- [ ] Validação de campos obrigatórios (frontend + backend)
- [ ] Mensagens de erro/sucesso com toast notifications
- [ ] Modais com cabeçalho, conteúdo e ações
- [ ] Cards com estrutura consistente
- [ ] APIs retornam `{ success: boolean, data/error, message }`
- [ ] Rotas protegidas com `requireAuth`
- [ ] Verificação de ownership em operações CRUD
- [ ] Logs de operações importantes
- [ ] Responsividade (mobile-first)
- [ ] Acessibilidade (ARIA labels, keyboard navigation)

---

**Próxima revisão**: Sprint 2  
**Documento mantido por**: Equipe de desenvolvimento GoCasa360IT
