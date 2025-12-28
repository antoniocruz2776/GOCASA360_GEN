# GOCASA360IT

## 🏠 Visão Geral do Projeto
**GOCASA360IT** é uma plataforma fullstack completa para aluguel e venda de imóveis, inspirada no modelo Quinto Andar. O projeto visa revolucionar o mercado imobiliário brasileiro com tecnologia, segurança e experiência digital de ponta.

## ✨ Funcionalidades Implementadas

### 🎨 Fase 1 - Landing Page Profissional ✅
- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ Identidade visual: Azul (#2563eb) como cor primária
- ✅ Hero section com busca inteligente de imóveis
- ✅ Filtros rápidos (preço, quartos, garagem, pet friendly)
- ✅ **Seção de Imóveis em Destaque** - Carregamento automático na homepage
- ✅ Seção de estatísticas (10K+ imóveis, 50K+ usuários)
- ✅ Cards de features com animações hover
- ✅ CTA para anúncio de imóveis
- ✅ Footer completo com links e redes sociais
- ✅ Navegação suave entre seções

### 💾 Fase 2 - Backend & Database ✅
- ✅ **Banco de Dados D1** configurado e populado com dados de teste
- ✅ **Schema completo** com 7 tabelas principais:
  - `usuarios` - Gestão de usuários (proprietários, inquilinos, corretores, admin)
  - `imoveis` - Catálogo completo de imóveis
  - `favoritos` - Sistema de favoritos
  - `visitas` - Agendamento de visitas
  - `mensagens` - Chat entre usuários
  - `propostas` - Propostas de aluguel/compra
  - `sessoes` - Gerenciamento de autenticação
- ✅ **Migrations** automáticas com wrangler
- ✅ **Seed data** com 6 imóveis de teste

### 🔌 APIs RESTful Implementadas ✅
- ✅ `GET /api/health` - Health check do sistema
- ✅ `GET /api/imoveis` - Listagem de imóveis com filtros avançados:
  - Filtro por finalidade (aluguel, venda, ambos)
  - Filtro por tipo (apartamento, casa, kitnet, cobertura)
  - Filtro por localização (cidade, estado, bairro)
  - Filtro por preço (mínimo e máximo)
  - Filtro por características (quartos, vagas)
  - Filtro pet friendly
  - Paginação automática
  - **Ordenação por destaque** (imóveis destacados aparecem primeiro)
- ✅ `GET /api/imoveis/:id` - Detalhes de um imóvel específico
- ✅ `GET /api/imoveis/destaque/list` - Listagem exclusiva de imóveis em destaque
- ✅ `POST /api/imoveis` - Cadastro de novos imóveis (proprietários/corretores)
  - **Inclui campo `destaque`** para destacar imóvel na página principal

### 🖼️ Página de Listagem de Imóveis ✅
- ✅ Interface moderna e responsiva
- ✅ Cards de imóveis com foto, informações e preço
- ✅ Sistema de filtros dinâmicos integrado com API
- ✅ Busca por cidade, bairro ou endereço
- ✅ Filtros por tipo, preço, quartos, vagas e pet friendly
- ✅ Paginação funcional
- ✅ Skeleton loading durante carregamento
- ✅ Badges de destaque e finalidade
- ✅ Integração completa frontend-backend

### ⭐ Sistema de Destaque de Imóveis ✅ (NOVO!)
- ✅ **Campo `destaque`** na tabela de imóveis (boolean)
- ✅ **Seção dedicada na homepage** para imóveis em destaque
  - Carregamento automático via API
  - Design diferenciado com badge dourado "⭐ Destaque"
  - Até 6 imóveis em destaque simultâneos
- ✅ **Checkbox no formulário de cadastro** de imóveis
  - Proprietários podem marcar seus imóveis como destaque
  - Visual chamativo com explicação dos benefícios
- ✅ **API dedicada** (`GET /api/imoveis/destaque/list`)
- ✅ **Priorização nas listagens** - Imóveis em destaque aparecem primeiro
- ✅ **Funcionalidade testada e validada** com cenários reais

**Como funciona:**
1. Proprietário acessa `/cadastrar-imovel` após login
2. Preenche formulário completo do imóvel
3. Marca checkbox "⭐ Destacar meu Imóvel na Página Principal"
4. Imóvel aparece automaticamente na seção de destaques da home
5. Recebe maior visibilidade e prioridade nas buscas

### 🔧 Stack Tecnológica
- **Backend**: Hono Framework (Edge Runtime)
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript
- **Deploy**: Cloudflare Pages/Workers
- **Infraestrutura**: Edge Computing (baixa latência global)

## 📋 Funcionalidades Planejadas

### 🎯 Próximas Etapas (Em Ordem de Prioridade)

#### Fase 3: Página de Detalhes & Autenticação (Próxima)
- [ ] Página de detalhes do imóvel (galeria de fotos, mapa, descrição completa)
- [ ] Sistema de autenticação (login/cadastro com JWT)
- [ ] Perfis de usuário: Proprietário, Inquilino, Corretor, Admin
- [ ] Sistema de favoritos funcional

#### Fase 4: Upload de Imóveis (Proprietários)
- [ ] Formulário de cadastro de imóveis
- [ ] Upload de fotos (Cloudflare R2)
- [ ] Validação de dados
- [ ] Dashboard do proprietário (meus imóveis)

#### Fase 5: Agendamento e Comunicação
- [ ] Sistema de agendamento de visitas
- [ ] Chat em tempo real (proprietário x interessado)
- [ ] Notificações por email
- [ ] Calendário de disponibilidade

#### Fase 6: Propostas e Transações
- [ ] Sistema de propostas de aluguel/compra
- [ ] Gestão de propostas (aceitar, recusar, contra-proposta)
- [ ] Dashboard do inquilino/comprador
- [ ] Histórico de interações

## 🌐 URLs

### Desenvolvimento Local (Sandbox)
- **Home Page**: http://localhost:3000
- **Listagem de Imóveis**: http://localhost:3000/imoveis
- **API Health**: http://localhost:3000/api/health
- **API Imóveis**: http://localhost:3000/api/imoveis
- **URL Pública (Sandbox)**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai

### Produção (Após Deploy)
- **Production**: https://gocasa360it.pages.dev (a ser criado)
- **GitHub**: (a ser configurado)

## 📊 Arquitetura de Dados

### Banco de Dados: Cloudflare D1 (SQLite)
**Status**: ✅ Implementado e populado com 6 imóveis de teste

### Tabelas Implementadas

#### 1. Usuários (`usuarios`)
```sql
- id (TEXT PRIMARY KEY)
- email (UNIQUE, NOT NULL)
- senha_hash (NOT NULL)
- nome_completo (NOT NULL)
- tipo (proprietario, inquilino, corretor, admin)
- telefone
- cpf_cnpj (UNIQUE)
- foto_perfil
- documentos_verificados (BOOLEAN)
- ativo (BOOLEAN)
- created_at, updated_at
```

#### 2. Imóveis (`imoveis`)
```sql
- id (TEXT PRIMARY KEY)
- proprietario_id (FK -> usuarios)
- titulo, descricao
- tipo (apartamento, casa, kitnet, cobertura, terreno, comercial, rural)
- finalidade (aluguel, venda, ambos)
- preco_aluguel, preco_venda
- condominio, iptu
- Endereço completo (rua, numero, complemento, bairro, cidade, estado, cep)
- endereco_latitude, endereco_longitude
- Características (quartos, banheiros, vagas_garagem, area_util, area_total)
- mobiliado, pet_friendly
- comodidades (JSON array)
- fotos (JSON array), foto_capa
- disponivel, destaque, visualizacoes
- created_at, updated_at
```

#### 3. Favoritos (`favoritos`)
```sql
- id (TEXT PRIMARY KEY)
- usuario_id (FK -> usuarios)
- imovel_id (FK -> imoveis)
- created_at
- UNIQUE(usuario_id, imovel_id)
```

#### 4. Visitas Agendadas (`visitas`)
```sql
- id (TEXT PRIMARY KEY)
- imovel_id (FK -> imoveis)
- usuario_id (FK -> usuarios)
- proprietario_id (FK -> usuarios)
- data_hora
- status (pendente, confirmada, cancelada, realizada)
- observacoes
- created_at, updated_at
```

#### 5. Mensagens/Chat (`mensagens`)
```sql
- id (TEXT PRIMARY KEY)
- remetente_id (FK -> usuarios)
- destinatario_id (FK -> usuarios)
- imovel_id (FK -> imoveis, nullable)
- mensagem (TEXT)
- lida (BOOLEAN)
- created_at
```

#### 6. Propostas (`propostas`)
```sql
- id (TEXT PRIMARY KEY)
- imovel_id (FK -> imoveis)
- usuario_id (FK -> usuarios)
- proprietario_id (FK -> usuarios)
- tipo (aluguel, compra)
- valor_proposto
- mensagem
- status (pendente, aceita, recusada, contra_proposta)
- valor_contra_proposta
- mensagem_resposta
- created_at, updated_at
```

#### 7. Sessões (`sessoes`)
```sql
- id (TEXT PRIMARY KEY)
- usuario_id (FK -> usuarios)
- token (JWT)
- expires_at
- created_at
```
### Serviços Cloudflare a Implementar
- **R2 Storage**: Armazenamento de fotos e documentos (próxima fase)
- **KV Storage**: Cache de buscas e sessões (opcional)

### Índices Otimizados
O banco possui 20+ índices para melhor performance em buscas por:
- Localização (cidade, estado, bairro)
- Tipo e finalidade do imóvel
- Faixa de preço
- Características (quartos, vagas)
- Disponibilidade e destaque

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- NPM
- Wrangler CLI (incluído no projeto)

### Instalação e Execução Local
```bash
cd /home/user/webapp

# Instalar dependências
npm install

# Aplicar migrations do banco de dados
npm run db:migrate:local

# Popular banco com dados de teste
npm run db:seed

# Build do projeto
npm run build

# Iniciar servidor de desenvolvimento com D1
pm2 start ecosystem.config.cjs

# Verificar se está rodando
npm run test

# Acessar aplicação
# Home: http://localhost:3000
# Listagem: http://localhost:3000/imoveis
```

### Comandos Úteis do Banco de Dados
```bash
# Reset completo do banco local
npm run db:reset

# Console SQL local
npm run db:console:local

# Exemplo de query
npx wrangler d1 execute gocasa360it-production --local --command="SELECT * FROM imoveis LIMIT 5"
```

### Deploy para Cloudflare Pages
```bash
# Setup da API key do Cloudflare
# (usar ferramenta setup_cloudflare_api_key)

# Criar banco D1 de produção
npx wrangler d1 create gocasa360it-production

# Aplicar migrations em produção
npm run db:migrate:prod

# Deploy
npm run deploy:prod
```

## 🎨 Identidade Visual

### Paleta de Cores
- **Primary**: #2563eb (Azul Royal)
- **Secondary**: #0ea5e9 (Azul Céu)
- **Accent**: #f59e0b (Laranja)
- **Dark**: #1e293b (Cinza Escuro)
- **Light**: #f1f5f9 (Cinza Claro)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 600, 700, 800

### Ícones
- **Biblioteca**: Font Awesome 6.4.0
- **Ícone Principal**: `fa-home`

## 📱 Guia de Uso

### Para Inquilinos/Compradores
1. Acesse a plataforma GOCASA360IT
2. Use a barra de busca para encontrar imóveis
3. Aplique filtros (preço, quartos, localização)
4. Visualize detalhes dos imóveis
5. Agende visitas
6. Faça propostas

### Para Proprietários
1. Cadastre-se na plataforma
2. Clique em "Anunciar Imóvel Grátis"
3. Preencha informações e faça upload de fotos
4. Publique o anúncio
5. Gerencie propostas e agendamentos
6. Feche contratos digitalmente

## 🔒 Segurança
- Autenticação JWT
- Criptografia de senhas (bcrypt)
- Validação de documentos
- Transações seguras
- Compliance LGPD

## 📝 Status do Deployment
- **Platform**: Cloudflare Pages
- **Status**: 🟡 Em Desenvolvimento
- **Last Updated**: 2024-12-28

## 🤝 Contribuições
Projeto em desenvolvimento ativo. Sugestões e melhorias são bem-vindas!

## 📄 Licença
Proprietary - GOCASA360IT © 2024

---

**Desenvolvido com ❤️ usando Hono + Cloudflare Workers**
