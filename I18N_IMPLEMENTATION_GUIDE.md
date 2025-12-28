# Sistema Multilíngue GOCASA360IT - Guia de Implementação

## ✅ STATUS ATUAL: Infraestrutura Completa

### 🎯 O Que Foi Implementado:

#### 1. **Arquivos de Tradução** ✅ COMPLETO
- 📁 `/public/i18n/pt-BR.json` - Português (Brasil)
- 📁 `/public/i18n/it-IT.json` - Italiano (Italia)
- 📁 `/public/i18n/en-US.json` - Inglês (USA)

**Conteúdo traduzido:**
- Navegação (nav)
- Homepage (home)
- Busca de imóveis (search)
- Detalhes do imóvel (property)
- Autenticação (auth)
- Cadastro de imóvel (addProperty)
- Footer
- Termos comuns (common)

#### 2. **Sistema i18n.js** ✅ COMPLETO
Localização: `/public/i18n.js`

**Funcionalidades:**
- ✅ Auto-detecção de idioma do navegador
- ✅ Persistência em localStorage
- ✅ Carregamento dinâmico de traduções
- ✅ Função `t(key)` para obter traduções
- ✅ Formatação de moeda por país (`formatCurrency()`)
- ✅ Info de campos de documento por país (`getDocumentFieldInfo()`)
- ✅ Info de CEP/CAP/ZIP por país (`getZipCodeFieldInfo()`)
- ✅ Info de telefone por país (`getPhoneFieldInfo()`)
- ✅ Função `changeLocale(locale)` para trocar idioma
- ✅ Atualização automática de elementos com `data-i18n`

#### 3. **Helpers i18n** ✅ COMPLETO
Localização: `/src/i18n-helpers.ts`

**Componentes:**
- ✅ Seletor de idioma (dropdown com bandeiras)
- ✅ Script de inicialização i18n
- ✅ Funções auxiliares de formatação

---

## 🔧 Como Usar o Sistema i18n:

### 1. **Adicionar i18n a uma Página**

```html
<!DOCTYPE html>
<html lang="pt-BR" id="htmlTag">
<head>
    <meta charset="UTF-8">
    <title>GOCASA360IT</title>
    <!-- Outros scripts -->
</head>
<body>
    <!-- Conteúdo da página -->
    
    <!-- PASSO 1: Carregar o script i18n.js -->
    <script src="/i18n.js"></script>
    
    <!-- PASSO 2: Inicializar e configurar -->
    <script>
        let i18nInstance;
        
        async function initI18n() {
            i18nInstance = await i18n.init();
            updateLanguage();
            translatePage();
        }
        
        async function changeLanguage(locale) {
            await i18nInstance.changeLocale(locale);
            window.location.reload();
        }
        
        function updateLanguage() {
            const flags = { 'pt-BR': '🇧🇷', 'it-IT': '🇮🇹', 'en-US': '🇺🇸' };
            const langs = { 'pt-BR': 'PT', 'it-IT': 'IT', 'en-US': 'EN' };
            
            document.getElementById('currentFlag').textContent = flags[i18nInstance.currentLocale];
            document.getElementById('currentLang').textContent = langs[i18nInstance.currentLocale];
            document.getElementById('htmlTag').lang = i18nInstance.currentLocale;
        }
        
        function translatePage() {
            // Traduzir textos específicos
            document.querySelector('[data-i18n="nav.login"]').textContent = i18nInstance.t('nav.login');
            document.querySelector('[data-i18n="nav.register"]').textContent = i18nInstance.t('nav.register');
            // ... outros elementos
        }
        
        // Inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initI18n);
        } else {
            initI18n();
        }
    </script>
</body>
</html>
```

### 2. **Adicionar Seletor de Idioma no Navbar**

```html
<div class="flex items-center space-x-4">
    <!-- Language Selector -->
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
            
            <button onclick="changeLanguage('it-IT')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition border-t">
                <span class="text-xl">🇮🇹</span>
                <div class="text-left">
                    <div class="font-semibold text-gray-800">Italiano</div>
                    <div class="text-xs text-gray-500">Italia</div>
                </div>
            </button>
            
            <button onclick="changeLanguage('en-US')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition border-t">
                <span class="text-xl">🇺🇸</span>
                <div class="text-left">
                    <div class="font-semibold text-gray-800">English</div>
                    <div class="text-xs text-gray-500">USA</div>
                </div>
            </button>
        </div>
    </div>
    
    <a href="/login" data-i18n="nav.login">Entrar</a>
    <a href="/cadastro" data-i18n="nav.register">Cadastrar</a>
</div>

<script>
    // Toggle dropdown
    document.addEventListener('click', (e) => {
        const btn = document.getElementById('langBtn');
        const dropdown = document.getElementById('langDropdown');
        
        if (btn && btn.contains(e.target)) {
            dropdown.classList.toggle('hidden');
        } else if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
</script>
```

### 3. **Adaptar Formulários com Campos Dinâmicos**

```javascript
// Exemplo: Campo de documento (CPF/Codice Fiscale/SSN)
function setupDocumentField() {
    const docInfo = i18nInstance.getDocumentFieldInfo();
    
    document.getElementById('docLabel').textContent = docInfo.label;
    document.getElementById('docInput').placeholder = docInfo.placeholder;
}

// Exemplo: Campo de CEP/CAP/ZIP
function setupZipCodeField() {
    const zipInfo = i18nInstance.getZipCodeFieldInfo();
    
    document.getElementById('zipLabel').textContent = zipInfo.label;
    document.getElementById('zipInput').placeholder = zipInfo.placeholder;
}

// Exemplo: Formatação de moeda
function displayPrice(value) {
    return i18nInstance.formatCurrency(value);
}
```

---

## 📋 PRÓXIMOS PASSOS - Roteiro de Implementação:

### Fase 1: Homepage (PRIORITÁRIO)
```bash
Arquivo: src/routes/pages.tsx - Rota: pages.get('/', ...)
```

**Tarefas:**
1. ✅ Adicionar script i18n.js antes do </body>
2. ✅ Adicionar seletor de idioma no navbar
3. ✅ Adicionar atributos data-i18n nos elementos:
   - Navbar: "Buscar Imóveis", "Anunciar", "Sobre", "Entrar", "Cadastrar"
   - Hero: Título, subtítulo, placeholder de busca, botão
   - Stats: "Imóveis Disponíveis", "Usuários Ativos", etc
   - Features: Títulos e descrições
   - CTA: Título, subtítulo, botão
   - Footer: Todos os links e textos

**Exemplo de implementação:**
```html
<h1 data-i18n="home.title">Encontre Seu Lar Ideal</h1>
<p data-i18n="home.subtitle">Milhares de imóveis...</p>
```

### Fase 2: Listagem de Imóveis
```bash
Arquivo: src/routes/pages.tsx - Rota: pages.get('/imoveis', ...)
```

**Tarefas:**
1. Adicionar i18n.js e inicialização
2. Seletor de idioma no navbar
3. Traduzir filtros de busca
4. Traduzir labels de cards
5. Adaptar formatação de preço (R$, €, $)

### Fase 3: Autenticação (Login/Cadastro)
```bash
Arquivo: src/routes/pages.tsx
- Rota: pages.get('/login', ...)
- Rota: pages.get('/cadastro', ...)
```

**Tarefas:**
1. Adicionar i18n.js
2. Traduzir todos os labels
3. **IMPORTANTE**: Adaptar campo de documento:
   - Brasil: CPF/CNPJ (000.000.000-00)
   - Italia: Codice Fiscale (RSSMRA80A01H501U)
   - USA: SSN (000-00-0000)
4. Adaptar mensagens de erro/sucesso

### Fase 4: Cadastro de Imóvel
```bash
Arquivo: src/routes/pages.tsx - Rota: pages.get('/cadastrar-imovel', ...)
```

**Tarefas:**
1. Adicionar i18n.js
2. Traduzir todos os campos
3. **IMPORTANTE**: Adaptar campo de CEP:
   - Brasil: CEP (00000-000)
   - Italia: CAP (00000)
   - USA: ZIP (00000)
4. Adaptar labels de preço (Aluguel/Venda)

### Fase 5: Detalhes do Imóvel
```bash
Arquivo: src/routes/pages.tsx - Rota: pages.get('/imoveis/:id', ...)
```

**Tarefas:**
1. Adicionar i18n.js
2. Traduzir características
3. Adaptar formatação de preço
4. Traduzir botões de ação

---

## 🧪 Como Testar:

### 1. Testar Detecção Automática
```javascript
// Abra o console do navegador
console.log(i18n.currentLocale); // Deve mostrar: pt-BR, it-IT ou en-US
```

### 2. Testar Troca de Idioma
- Clicar no seletor de idioma
- Escolher um idioma diferente
- Verificar se a página recarrega com novo idioma
- Verificar se localStorage foi atualizado:
```javascript
localStorage.getItem('locale'); // Deve retornar o idioma selecionado
```

### 3. Testar Formatação de Moeda
```javascript
i18n.formatCurrency(100000); 
// PT-BR: "R$ 100.000"
// IT-IT: "€ 100.000"
// EN-US: "$100,000"
```

### 4. Testar Campos Dinâmicos
```javascript
i18n.getDocumentFieldInfo();
// PT-BR: { label: "CPF/CNPJ", placeholder: "000.000.000-00" }
// IT-IT: { label: "Codice Fiscale", placeholder: "RSSMRA80A01H501U" }
// EN-US: { label: "SSN/Tax ID", placeholder: "000-00-0000" }
```

---

## 🚀 Exemplo Completo: Homepage com i18n

Ver arquivo: `IMPLEMENTATION_EXAMPLE.md` (a ser criado)

---

## 📊 Progresso da Implementação:

| Página | i18n.js | Seletor | Traduções | Campos Dinâmicos | Status |
|--------|---------|---------|-----------|------------------|--------|
| Homepage | ❌ | ❌ | ❌ | N/A | 🔴 Pendente |
| Listagem | ❌ | ❌ | ❌ | ✅ Preço | 🔴 Pendente |
| Detalhes | ❌ | ❌ | ❌ | ✅ Preço | 🔴 Pendente |
| Login | ❌ | ❌ | ❌ | N/A | 🔴 Pendente |
| Cadastro | ❌ | ❌ | ❌ | ❌ CPF/CF/SSN | 🔴 Pendente |
| Cadastrar Imóvel | ❌ | ❌ | ❌ | ❌ CEP/CAP/ZIP | 🔴 Pendente |

**Legenda:**
- ✅ Implementado
- ❌ Pendente
- 🔴 Não iniciado
- 🟡 Em progresso
- 🟢 Completo

---

## 💡 Dicas de Implementação:

1. **Começar pela Homepage**: É a página mais importante
2. **Usar data-i18n**: Facilita a manutenção
3. **Testar em cada idioma**: Verificar layout em PT, IT, EN
4. **Cuidado com tamanhos**: Textos em italiano são mais longos
5. **Adaptar validações**: Validar CPF só para PT-BR, etc

---

## 📁 Estrutura de Arquivos:

```
webapp/
├── public/
│   ├── i18n/
│   │   ├── pt-BR.json ✅
│   │   ├── it-IT.json ✅
│   │   └── en-US.json ✅
│   └── i18n.js ✅
├── src/
│   ├── routes/
│   │   └── pages.tsx ❌ (precisa integração)
│   └── i18n-helpers.ts ✅
└── README.md
```

---

## 🎯 Objetivos Finais:

- [x] Criar arquivos de tradução para 3 idiomas
- [x] Implementar sistema i18n.js
- [x] Criar helpers e componentes reutilizáveis
- [ ] Integrar i18n na Homepage
- [ ] Integrar i18n em Listagem
- [ ] Integrar i18n em Detalhes
- [ ] Integrar i18n em Auth (Login/Cadastro)
- [ ] Integrar i18n em Cadastro de Imóvel
- [ ] Testar todos os fluxos em 3 idiomas
- [ ] Deploy final

---

**Data de Criação**: 2025-12-28
**Status**: 🟡 Infraestrutura Completa - Aguardando Integração nas Páginas
