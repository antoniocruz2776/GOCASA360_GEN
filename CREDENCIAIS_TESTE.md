# 🔑 CREDENCIAIS DE TESTE - GOCASA360IT

**Data**: 28/12/2025  
**Ambiente**: Desenvolvimento Local

---

## 📧 USUÁRIOS DISPONÍVEIS

### **1. João Silva - Proprietário** ⭐ RECOMENDADO
- **Email**: `joao.silva@email.com`
- **Senha**: `senha123`
- **Tipo**: Proprietário
- **Acesso**:
  - ✅ Dashboard completo (Story 4)
  - ✅ Cadastro de imóveis via Wizard (Story 1)
  - ✅ Visualização e gestão de imóveis
  - ✅ Edição, pausa e exclusão de imóveis
  
### **2. Maria Santos - Inquilino**
- **Email**: `maria.santos@email.com`
- **Senha**: `senha123`
- **Tipo**: Inquilino
- **Acesso**:
  - ✅ Buscar imóveis
  - ✅ Favoritar imóveis
  - ✅ Agendar visitas
  - ✅ Enviar mensagens

### **3. Carlos Oliveira - Corretor**
- **Email**: `carlos.corretor@email.com`
- **Senha**: `senha123`
- **Tipo**: Corretor
- **Acesso**:
  - ✅ Cadastrar imóveis
  - ✅ Intermediar negócios
  - ✅ Dashboard de corretor

### **4. Ana Costa - Proprietária**
- **Email**: `ana.proprietaria@email.com`
- **Senha**: `senha123`
- **Tipo**: Proprietária
- **Acesso**:
  - ✅ Dashboard completo
  - ✅ Gestão de imóveis

### **5. Admin GOCASA - Administrador**
- **Email**: `admin@gocasa360it.com`
- **Senha**: `senha123`
- **Tipo**: Admin
- **Acesso**:
  - ✅ Painel administrativo
  - ✅ Gestão de usuários
  - ✅ Gestão de imóveis
  - ✅ Visualização de métricas

---

## 🌐 URLS DO AMBIENTE

### **Aplicação Principal**
```
https://3000-i68t7i2orvxg8ha29zhdy-5185f4aa.sandbox.novita.ai
```

### **Páginas Importantes**
- **Home**: `/`
- **Login**: `/login` (✅ PADRONIZADA)
- **Cadastro**: `/cadastro`
- **Buscar Imóveis**: `/imoveis`
- **Cadastrar Imóvel**: `/cadastrar-imovel` (✅ Story 1 - Wizard)
- **Dashboard**: `/dashboard` (✅ Story 4)
- **Admin**: `/admin`

### **GitHub**
```
https://github.com/antoniocruz2776/GOCASA360_GEN
```

---

## 🧪 TESTE RECOMENDADO

Use o usuário **João Silva (proprietário)** para testar todas as funcionalidades:

1. **Login** (página padronizada)
   - Acesse: `/login`
   - Email: `joao.silva@email.com`
   - Senha: `senha123`

2. **Dashboard** (Story 4)
   - Veja métricas: Total Imóveis, Views, Favoritos, Visitas
   - Liste imóveis cadastrados
   - Ações: Ver, Editar, Pausar, Excluir

3. **Cadastrar Imóvel** (Story 1 - Wizard)
   - Clique em "Anunciar Imóvel"
   - Preencha o Wizard de 5 etapas
   - Salve como rascunho ou publique

---

## 🔒 NOTA DE SEGURANÇA

**⚠️ IMPORTANTE**: Esta é uma senha de desenvolvimento. 

- **Ambiente**: Apenas desenvolvimento local
- **Hash**: SHA-256 (simplificado para dev)
- **Produção**: Deve usar bcrypt ou argon2

**Hash SHA-256 de "senha123"**:
```
55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251
```

---

## 📊 DADOS DE TESTE

O banco de dados local contém:
- ✅ 6 usuários de teste
- ✅ 6 imóveis em destaque
- ✅ Dados de favoritos
- ✅ Dados de visitas
- ✅ Mensagens exemplo

---

## 🛠️ TROUBLESHOOTING

### Problema: "Email ou senha incorretos"

**Solução**: Atualizar senhas no banco local:
```bash
cd /home/user/webapp
npx wrangler d1 execute gocasa360it-production --local --command="UPDATE usuarios SET senha_hash = '55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251'"
```

### Problema: Página não carrega

**Solução**: Reiniciar serviço:
```bash
cd /home/user/webapp
pm2 restart gocasa360it
```

---

## ✅ STATUS DO PROJETO

**Páginas Padronizadas**:
- ✅ `/login` - Login com toast notifications
- ✅ `/cadastrar-imovel` - Wizard 5 etapas (Story 1)
- ✅ `/dashboard` - Dashboard proprietário (Story 4)

**Pendentes**:
- ⏳ `/cadastro` - Formulário de cadastro
- ⏳ `/imoveis` - Listagem de imóveis
- ⏳ `/` - Home page

**Progresso Geral**: 45% (3/10 páginas + infraestrutura)

---

**Última Atualização**: 28/12/2025  
**Versão**: 1.0
