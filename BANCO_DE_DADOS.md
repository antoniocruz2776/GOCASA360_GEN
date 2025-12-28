# 🗄️ BANCO DE DADOS - GOCASA360IT

## 📍 Onde os dados estão sendo gravados?

### **Ambiente de Desenvolvimento (Local)**
Os dados estão armazenados em um banco **SQLite local** gerenciado pelo Wrangler (Cloudflare):

```
📂 /home/user/webapp/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/
└── e21793b1023ce945b7f083d782f1f706ac4acd316a9642bb6124581ec1529375.sqlite
```

**Tamanho atual**: ~360 KB

---

## 🔧 Como acessar os dados?

### **1. Via Wrangler CLI (Recomendado)**
```bash
# Listar todos os usuários
npx wrangler d1 execute gocasa360it-production --local --command="SELECT * FROM usuarios;"

# Listar todos os imóveis
npx wrangler d1 execute gocasa360it-production --local --command="SELECT * FROM imoveis;"

# Contar registros
npx wrangler d1 execute gocasa360it-production --local --command="SELECT COUNT(*) FROM imoveis;"
```

### **2. Via APIs REST**
```bash
# Listar imóveis (sem autenticação)
curl http://localhost:3000/api/imoveis?limit=10

# Login como admin
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gocasa360.com","senha":"Admin@123"}'

# Listar usuários (requer autenticação admin)
curl http://localhost:3000/api/admin/usuarios?limit=10 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### **3. Via SQLite direto**
```bash
# Abrir o banco com sqlite3
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite

# Comandos SQLite
.tables              # Listar tabelas
.schema usuarios     # Ver estrutura da tabela
SELECT * FROM imoveis LIMIT 5;
```

---

## 📊 Estrutura do Banco de Dados

### **Tabelas Principais (7)**

#### 1. **usuarios** 👥
- `id`, `email`, `senha_hash`, `nome_completo`
- `tipo`: 'proprietario', 'inquilino', 'corretor', 'admin'
- `cpf_cnpj`, `telefone`, `foto_perfil`
- `documentos_verificados`, `ativo`
- **Registros atuais**: 6 usuários

#### 2. **imoveis** 🏠
- `id`, `proprietario_id`, `titulo`, `descricao`
- `tipo`: 'apartamento', 'casa', 'kitnet', 'cobertura', 'terreno', 'comercial', 'rural'
- `finalidade`: 'aluguel', 'venda', 'ambos'
- `preco_aluguel`, `preco_venda`, `condominio`, `iptu`
- `endereco_*` (rua, numero, bairro, cidade, estado, cep)
- `quartos`, `banheiros`, `vagas_garagem`, `area_util`
- `mobiliado`, `pet_friendly`, `comodidades` (JSON)
- `fotos` (JSON), `foto_capa`, `disponivel`, `destaque`
- **Registros atuais**: 6 imóveis

#### 3. **favoritos** ⭐
- Relacionamento usuário ↔ imóvel
- `usuario_id`, `imovel_id`

#### 4. **visitas** 📅
- `imovel_id`, `usuario_id`, `proprietario_id`
- `data_hora`, `status`, `observacoes`
- Status: 'pendente', 'confirmada', 'cancelada', 'realizada'
- **Registros atuais**: 2 visitas

#### 5. **mensagens** 💬
- `remetente_id`, `destinatario_id`, `imovel_id`
- `mensagem`, `lida`

#### 6. **propostas** 💰
- `imovel_id`, `usuario_id`, `proprietario_id`
- `tipo`: 'aluguel', 'compra'
- `valor_proposto`, `status`, `mensagem`
- Status: 'pendente', 'aceita', 'recusada', 'contra_proposta'
- **Registros atuais**: 2 propostas

#### 7. **sessoes** 🔐
- `usuario_id`, `token`, `expires_at`
- Para autenticação JWT

---

### **Tabelas de Segurança e Administração (7)**

#### 8. **audit_logs** 📝
- Log completo de todas as ações administrativas
- `usuario_id`, `action`, `entity_type`, `entity_id`
- `old_value`, `new_value`, `ip_address`

#### 9. **denuncias** 🚨
- Sistema de denúncias de usuários/imóveis
- `tipo`: 'usuario', 'imovel', 'proposta', 'mensagem'
- `motivo`: 'spam', 'conteudo_inapropriado', 'fraude', 'golpe', 'dados_incorretos', 'outro'
- `status`: 'pendente', 'em_analise', 'resolvida', 'rejeitada'

#### 10. **blacklist** ⛔
- Bloqueio de usuários/emails/CPFs/IPs
- `tipo`: 'email', 'cpf_cnpj', 'ip', 'usuario'
- `motivo`, `expira_em`

#### 11. **aprovacao_imoveis** ✅
- Workflow de aprovação de anúncios
- `imovel_id`, `admin_id`, `status`, `motivo_rejeicao`

#### 12. **admin_permissoes** 👮
- Permissões granulares para admins
- 4 roles: Super Admin, Moderador, Suporte, Financeiro

#### 13. **usuarios_permissoes** 🔑
- Relacionamento usuários ↔ permissões

#### 14. **notificacoes_admin** 🔔
- Sistema de notificações em tempo real
- `tipo`: 'nova_denuncia', 'imovel_pendente', 'atividade_suspeita', etc.
- `prioridade`: 'baixa', 'media', 'alta', 'urgente'

---

## 📈 Estatísticas Atuais

```bash
# Verificar quantidade de dados
npx wrangler d1 execute gocasa360it-production --local --command="
  SELECT 'Usuários' as tabela, COUNT(*) as total FROM usuarios
  UNION ALL
  SELECT 'Imóveis', COUNT(*) FROM imoveis
  UNION ALL
  SELECT 'Propostas', COUNT(*) FROM propostas
  UNION ALL
  SELECT 'Visitas', COUNT(*) FROM visitas;
"
```

**Resultado atual**:
- ✅ **6 usuários** (1 admin, 2 proprietários, 2 inquilinos, 1 corretor)
- ✅ **6 imóveis** (apartamentos, casas, kitnets)
- ✅ **2 propostas**
- ✅ **2 visitas agendadas**

---

## 🚀 Ambientes

### **Desenvolvimento (Atual)**
- **Localização**: `.wrangler/state/v3/d1/`
- **Tipo**: SQLite local
- **Comando**: `npm run dev:d1` ou `wrangler pages dev dist --d1=gocasa360it-production --local`

### **Produção (Cloudflare)**
- **Localização**: Cloudflare D1 (nuvem)
- **Database ID**: `to-be-created` (precisa ser criado)
- **Comando**: `wrangler d1 create gocasa360it-production`

Para fazer deploy em produção:
```bash
# 1. Criar banco de dados remoto
npx wrangler d1 create gocasa360it-production

# 2. Copiar o database_id retornado para wrangler.jsonc

# 3. Aplicar migrations na produção
npx wrangler d1 migrations apply gocasa360it-production --remote

# 4. Fazer deploy
npm run deploy
```

---

## 🔄 Sincronização de Dados

### **Backup do banco local**
```bash
# Fazer backup
cp .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite ./backup-$(date +%Y%m%d).sqlite

# Exportar para SQL
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite .dump > backup.sql
```

### **Popular banco com dados de teste**
```bash
# Resetar e repopular
npm run db:reset

# Ou manualmente
npx wrangler d1 execute gocasa360it-production --local --file=./seed.sql
```

---

## 📖 Exemplos de Consultas SQL

```sql
-- 1. Listar imóveis disponíveis para aluguel em São Paulo
SELECT titulo, preco_aluguel, endereco_bairro 
FROM imoveis 
WHERE finalidade IN ('aluguel', 'ambos') 
  AND disponivel = 1 
  AND endereco_cidade = 'São Paulo'
ORDER BY preco_aluguel ASC;

-- 2. Encontrar proprietários com mais imóveis
SELECT u.nome_completo, COUNT(i.id) as total_imoveis
FROM usuarios u
LEFT JOIN imoveis i ON u.id = i.proprietario_id
WHERE u.tipo = 'proprietario'
GROUP BY u.id
ORDER BY total_imoveis DESC;

-- 3. Visitas pendentes de confirmação
SELECT 
  v.data_hora,
  i.titulo as imovel,
  u.nome_completo as visitante
FROM visitas v
JOIN imoveis i ON v.imovel_id = i.id
JOIN usuarios u ON v.usuario_id = u.id
WHERE v.status = 'pendente'
ORDER BY v.data_hora ASC;

-- 4. Propostas aguardando resposta
SELECT 
  p.valor_proposto,
  i.titulo as imovel,
  u.nome_completo as proponente,
  p.created_at
FROM propostas p
JOIN imoveis i ON p.imovel_id = i.id
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.status = 'pendente'
ORDER BY p.created_at DESC;
```

---

## 🛡️ Segurança

- ✅ **Senhas**: Hashed com bcrypt (não armazenadas em texto)
- ✅ **JWT**: Tokens com expiração de 7 dias
- ✅ **Audit Logs**: Todas as ações administrativas são registradas
- ✅ **Validação**: CPF/CNPJ únicos, emails únicos
- ✅ **LGPD**: Controle de documentos verificados

---

## 📞 Suporte

Para mais informações sobre o banco de dados:
- **Documentação Cloudflare D1**: https://developers.cloudflare.com/d1/
- **Schema completo**: Ver `migrations/0001_initial_schema.sql`
- **Dados de teste**: Ver `seed.sql`

---

**Última atualização**: 2024-12-28
**Versão**: 1.0.0
