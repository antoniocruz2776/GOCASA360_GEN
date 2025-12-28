# GOCASA360IT

## 🏠 Visão Geral do Projeto
**GOCASA360IT** é uma plataforma fullstack completa para aluguel e venda de imóveis, inspirada no modelo Quinto Andar. O projeto visa revolucionar o mercado imobiliário brasileiro com tecnologia, segurança e experiência digital de ponta.

## ✨ Funcionalidades Implementadas

### 🎨 MVP - Landing Page Profissional
- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ Identidade visual: Azul (#2563eb) como cor primária
- ✅ Hero section com busca inteligente de imóveis
- ✅ Filtros rápidos (preço, quartos, garagem, pet friendly)
- ✅ Seção de estatísticas (10K+ imóveis, 50K+ usuários)
- ✅ Cards de features com animações hover
- ✅ CTA para anúncio de imóveis
- ✅ Footer completo com links e redes sociais
- ✅ Navegação suave entre seções

### 🔧 Stack Tecnológica
- **Backend**: Hono Framework (Edge Runtime)
- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript
- **Deploy**: Cloudflare Pages/Workers
- **Infraestrutura**: Edge Computing (baixa latência global)

## 📋 Funcionalidades Planejadas

### 🎯 Próximas Etapas (Em Ordem de Prioridade)

#### Fase 1: Autenticação e Perfis (Semana 1-2)
- [ ] Sistema de autenticação (login/cadastro)
- [ ] Perfis de usuário: Proprietário, Inquilino, Corretor
- [ ] Dashboard personalizado por tipo de usuário
- [ ] Gestão de perfis e documentos

#### Fase 2: Módulo de Imóveis (Semana 3-4)
- [ ] Database D1 (schema para imóveis)
- [ ] CRUD completo de imóveis
- [ ] Upload de fotos (Cloudflare R2)
- [ ] Listagem com paginação
- [ ] Visualização detalhada de imóveis
- [ ] Sistema de favoritos

#### Fase 3: Busca e Filtros (Semana 5-6)
- [ ] Busca avançada (localização, preço, características)
- [ ] Filtros dinâmicos (quartos, banheiros, área, etc)
- [ ] Mapa interativo (integração Google Maps)
- [ ] Ordenação de resultados
- [ ] Sugestões inteligentes

#### Fase 4: Agendamento e Comunicação (Semana 7-8)
- [ ] Sistema de agendamento de visitas
- [ ] Chat em tempo real (proprietário x interessado)
- [ ] Notificações por email
- [ ] Calendário de disponibilidade

#### Fase 5: Transações e Contratos (Semana 9-10)
- [ ] Proposta de aluguel/compra
- [ ] Análise de crédito automatizada
- [ ] Geração de contratos digitais
- [ ] Integração com pagamentos (PIX, Cartão)

## 🌐 URLs

### Desenvolvimento Local
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

### Produção (Após Deploy)
- **Production**: https://gocasa360it.pages.dev (a ser criado)
- **GitHub**: (a ser configurado)

## 📊 Arquitetura de Dados

### Modelos Principais (A Implementar)

#### Usuários
```sql
- id (UUID)
- email (unique)
- senha (hash)
- nome_completo
- tipo (proprietario, inquilino, corretor, admin)
- telefone
- cpf_cnpj
- documentos_verificados (boolean)
- created_at
```

#### Imóveis
```sql
- id (UUID)
- proprietario_id (FK)
- titulo
- descricao
- tipo (apartamento, casa, kitnet, cobertura)
- finalidade (aluguel, venda)
- preco
- endereco (JSON: rua, numero, complemento, bairro, cidade, estado, cep)
- caracteristicas (JSON: quartos, banheiros, vagas, area_m2)
- comodidades (JSON: array)
- fotos (JSON: array de URLs)
- disponivel (boolean)
- created_at
```

#### Favoritos
```sql
- id (UUID)
- usuario_id (FK)
- imovel_id (FK)
- created_at
```

### Serviços Cloudflare Utilizados
- **D1 Database**: Dados relacionais (usuários, imóveis, transações)
- **R2 Storage**: Armazenamento de fotos e documentos
- **KV Storage**: Cache de buscas e sessões

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn
- Conta Cloudflare (para deploy)

### Instalação Local
```bash
cd /home/user/webapp

# Instalar dependências (já instaladas)
npm install

# Build do projeto
npm run build

# Iniciar servidor de desenvolvimento
pm2 start ecosystem.config.cjs

# Verificar se está rodando
npm run test
```

### Deploy para Cloudflare Pages
```bash
# Setup da API key do Cloudflare
# (usar ferramenta setup_cloudflare_api_key)

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
