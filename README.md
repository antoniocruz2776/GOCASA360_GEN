# GOCASA360IT

## 🏠 Visão Geral do Projeto
**GOCASA360IT** é uma plataforma fullstack completa para aluguel e venda de imóveis, inspirada no modelo Quinto Andar. O projeto visa revolucionar o mercado imobiliário italiano/brasileiro com tecnologia, segurança e experiência digital de ponta.

## 🌍 Multilingual Support
- ✅ **3 idiomas completos**: Italiano (IT), Português (PT-BR), Inglês (EN-US)
- ✅ **370+ traduções** em todas as páginas principais
- ✅ **Seletor visual com bandeiras** integrado na navbar
- ✅ **Detecção automática** de idioma do navegador
- ✅ **Persistência** no localStorage
- ✅ **Adaptação por país**: Moeda, documentos, CEP/ZIP

## ✨ Funcionalidades Implementadas

### 🎨 Fase 1 - Landing Page Profissional ✅
- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ Identidade visual: Azul (#1976D2) como cor primária
- ✅ Hero section com busca inteligente de imóveis
- ✅ Filtros rápidos (preço, quartos, garagem, pet friendly)
- ✅ **Seção de Imóveis em Destaque** - Carregamento automático na homepage
- ✅ Seção de estatísticas (10K+ imóveis, 50K+ usuários)
- ✅ Cards de features com animações hover
- ✅ CTA para anúncio de imóveis
- ✅ Footer completo com links e redes sociais
- ✅ Navegação suave entre seções
- ✅ **Logo oficial GoCasa360** integrada

### 💾 Fase 2 - Backend & Database ✅
- ✅ **Banco de Dados D1** configurado e populado com dados de teste
- ✅ **Schema completo** com 7 tabelas principais:
  - `usuarios` - Gestão de usuários (proprietários, inquilinos, corretores, **admin**)
  - `imoveis` - Catálogo completo de imóveis
  - `favoritos` - Sistema de favoritos
  - `visitas` - Agendamento de visitas
  - `mensagens` - Chat entre usuários
  - `propostas` - Propostas de aluguel/compra
  - `sessoes` - Gerenciamento de autenticação
- ✅ **Migrations** automáticas com wrangler
- ✅ **Seed data** com 8+ imóveis de teste

### 🔌 APIs RESTful Implementadas ✅
- ✅ `GET /api/health` - Health check do sistema
- ✅ `GET /api/imoveis` - Listagem de imóveis com filtros avançados
- ✅ `GET /api/imoveis/:id` - Detalhes de um imóvel específico
- ✅ `GET /api/imoveis/destaque/list` - Listagem exclusiva de imóveis em destaque
- ✅ `POST /api/imoveis` - Cadastro de novos imóveis (proprietários/corretores)

### 🛡️ **NOVO: Painel de Administração Completo** ✅
#### Acesso: `/admin`

**Dashboard Principal:**
- ✅ **Estatísticas em tempo real**:
  - Total de usuários por tipo
  - Total de imóveis (disponíveis, destaque, visualizações)
  - Propostas por status
  - Visitas por status
  - Gráfico de crescimento de usuários (últimos 30 dias)
- ✅ **Gráficos visuais** (Chart.js):
  - Distribuição de usuários por tipo (pizza)
  - Status dos imóveis (barras)

**Gerenciamento de Usuários:**
- ✅ Listagem completa com paginação
- ✅ Filtros: tipo de usuário, status (ativo/inativo), busca por nome/email/CPF
- ✅ Ações disponíveis:
  - Ativar/Desativar usuários
  - Verificar documentos
  - Promover para admin
  - Excluir usuários
- ✅ API: `/api/admin/usuarios` (GET, PUT, DELETE)

**Gerenciamento de Imóveis:**
- ✅ Listagem completa com informações do proprietário
- ✅ Filtros: tipo, status (disponível/indisponível), busca por título/cidade
- ✅ Ações disponíveis:
  - Destacar/Remover destaque
  - Disponibilizar/Tornar indisponível
  - Excluir imóveis
- ✅ API: `/api/admin/imoveis` (GET, PUT, DELETE)

**Gerenciamento de Propostas:**
- ✅ Listagem completa com detalhes do imóvel e usuários
- ✅ Filtros: status (pendente, aceita, recusada, contra-proposta)
- ✅ Visualização de detalhes completos
- ✅ API: `/api/admin/propostas` (GET)

**Gerenciamento de Visitas:**
- ✅ Listagem completa com agenda global
- ✅ Filtros: status (pendente, confirmada, cancelada, realizada), data
- ✅ Visualização de detalhes completos
- ✅ API: `/api/admin/visitas` (GET)

**Recursos do Admin Panel:**
- ✅ **Multilíngue completo** (IT/PT/EN)
- ✅ Interface moderna e responsiva
- ✅ Navegação por abas entre seções
- ✅ Paginação em todas as listagens
- ✅ Confirmação de ações críticas
- ✅ Feedback visual de ações (success/error)

### 🔐 **NOVO: Sistema de Segurança e Moderação Enterprise** ✅
#### Implementação Completa dos Próximos Passos

**1. Autenticação JWT Admin:**
- ✅ Endpoint dedicado: `POST /api/auth/admin/login`
- ✅ Tokens JWT com expiração de 7 dias
- ✅ Middleware `requireAdmin` em todas as rotas admin
- ✅ Controle de tentativas de login falhadas
- ✅ Bloqueio automático de contas suspeitas
- ✅ Rastreamento de último login e IP

**2. Sistema de Permissões Granulares:**
- ✅ **4 Roles pré-configurados**:
  - `Super Admin`: Acesso total (`*`)
  - `Moderador`: Gerenciar usuários, imóveis e denúncias
  - `Suporte`: Visualização e suporte aos usuários
  - `Financeiro`: Gerenciar propostas e transações
- ✅ **Middleware de Permissões**: `requirePermission(permission)`
- ✅ **APIs de Gerenciamento**:
  - `GET /api/admin/permissoes` - Listar roles
  - `POST /api/admin/usuarios/:id/permissoes` - Conceder
  - `DELETE /api/admin/usuarios/:id/permissoes/:permId` - Revogar

**3. Sistema de Auditoria Completo:**
- ✅ **Tabela `audit_logs`**: Rastreia TODAS as ações admin
- ✅ **Campos rastreados**: admin_id, action_type, resource_type, resource_id, old_value, new_value, ip_address, user_agent
- ✅ **Ações monitoradas**: create, update, delete, approve, reject, block, unblock, grant_permission, revoke_permission
- ✅ **API de Consulta**: `GET /api/admin/audit-logs?admin_id=&resource_type=&action_type=&page=1`

**4. Sistema de Denúncias/Reports:**
- ✅ **Tipos suportados**: usuário, imóvel, proposta, mensagem
- ✅ **Motivos**: fraude, spam, conteúdo inapropriado, informação falsa, assédio, outro
- ✅ **Status workflow**: pendente → em_analise → resolvida/rejeitada
- ✅ **APIs**:
  - `GET /api/admin/denuncias` - Listar denúncias
  - `PUT /api/admin/denuncias/:id` - Atualizar status
  - `POST /api/admin/denuncias/criar` - Criar denúncia (público)
- ✅ Notificação automática para admins ao receber denúncia

**5. Sistema de Aprovação de Imóveis:**
- ✅ **Workflow de moderação**: pendente → aprovado/rejeitado/revisao_necessaria
- ✅ **Aprovação automática**: Imóvel disponibilizado após aprovação
- ✅ **Notificação ao proprietário**: Informando aprovação ou rejeição
- ✅ **APIs**:
  - `GET /api/admin/aprovacoes?status=pendente` - Listar pendências
  - `PUT /api/admin/aprovacoes/:id` - Aprovar/Rejeitar

**6. Sistema de Blacklist:**
- ✅ **Tipos**: email, cpf_cnpj, ip, telefone
- ✅ **Modos**: Permanente ou temporário (com data de expiração)
- ✅ **Verificação automática**: Helper `isBlacklisted(DB, tipo, valor)`
- ✅ **APIs**:
  - `GET /api/admin/blacklist?tipo=email` - Listar
  - `POST /api/admin/blacklist` - Adicionar
  - `DELETE /api/admin/blacklist/:id` - Remover

**7. Sistema de Notificações Admin:**
- ✅ **Tipos**: nova_denuncia, nova_proposta, documento_pendente, imovel_pendente, atividade_suspeita
- ✅ **Prioridades**: baixa, media, alta, critica
- ✅ **Notificações direcionadas**: Para admin específico ou todos
- ✅ **APIs**:
  - `GET /api/admin/notificacoes?lida=0&prioridade=alta` - Listar
  - `PUT /api/admin/notificacoes/:id/lida` - Marcar como lida

**Credenciais de Teste (Admin):**
```
Email: admin@gocasa360.com
Senha: Admin@123
Role: Super Admin
```

**Estatísticas de Implementação:**
- 🆕 **7 novas tabelas** no banco de dados
- 🆕 **15+ novas APIs** autenticadas
- 🆕 **3 middleware** de segurança
- 🆕 **~2,800 linhas** de código novo
- 📦 **Bundle size**: 280.60 kB (+18.5 KB)
- ✅ **9/12 próximos passos** concluídos (75%)
- ✅ Design consistente com o resto da plataforma

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

## 🌐 URLs de Acesso

### Desenvolvimento (Sandbox)
- **Homepage**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai
- **Listagem de Imóveis**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/imoveis
- **Login**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/login
- **Cadastro**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/cadastro
- **🛡️ Painel Admin**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/admin

### APIs Públicas
- **Health Check**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/api/health
- **Imóveis**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/api/imoveis
- **Destaques**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/api/imoveis/destaque/list
- **Criar Denúncia**: https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai/api/admin/denuncias/criar

### APIs Admin (Requerem Autenticação JWT)
- **Login Admin**: `POST /api/auth/admin/login`
- **Dashboard Stats**: `GET /api/admin/stats`
- **Denúncias**: `GET /api/admin/denuncias`
- **Aprovações**: `GET /api/admin/aprovacoes`
- **Blacklist**: `GET /api/admin/blacklist`
- **Notificações**: `GET /api/admin/notificacoes`
- **Audit Logs**: `GET /api/admin/audit-logs`
- **Permissões**: `GET /api/admin/permissoes`
- **Usuários**: `GET/PUT/DELETE /api/admin/usuarios`
- **Imóveis**: `GET/PUT/DELETE /api/admin/imoveis`

**Como usar APIs Admin:**
```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gocasa360.com","senha":"Admin@123"}'

# 2. Usar o token retornado
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:3000/api/admin/denuncias
```

### Código-fonte
- **GitHub**: https://github.com/antoniocruz2776/GOCASA360_GEN

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

### Para Administradores
1. Acesse `/admin` na plataforma
2. **Dashboard**: Visualize estatísticas gerais e gráficos
3. **Usuários**: Gerencie todos os usuários (ativar, desativar, verificar documentos, promover para admin)
4. **Imóveis**: Modere imóveis (destacar, disponibilizar, remover)
5. **Propostas**: Visualize e acompanhe todas as propostas da plataforma
6. **Visitas**: Gerencie a agenda global de visitas
7. Use filtros e busca para encontrar rapidamente o que precisa
8. Todas as ações são auditadas e reversíveis

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
