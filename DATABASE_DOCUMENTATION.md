# 📊 BANCO DE DADOS GOCASA360IT - DOCUMENTAÇÃO COMPLETA

## 🗄️ ONDE OS DADOS ESTÃO SENDO GRAVADOS

### **Tipo de Banco de Dados: Cloudflare D1 (SQLite)**

O projeto utiliza **Cloudflare D1**, que é um banco de dados SQLite distribuído globalmente na edge da Cloudflare.

---

## 📍 LOCALIZAÇÃO DOS DADOS

### **1. Ambiente de Desenvolvimento (Local)**

**Caminho físico:**
```
/home/user/webapp/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/
```

**Como funciona:**
- Durante o desenvolvimento (`npm run dev:d1`), o Wrangler cria um banco SQLite local
- Os dados são armazenados em arquivos `.sqlite` na pasta `.wrangler`
- Este banco é **temporário** e usado apenas para desenvolvimento/testes
- **Flag usada:** `--local` (exemplo: `npx wrangler d1 execute DB_NAME --local`)

### **2. Ambiente de Produção (Cloudflare)**

**Localização:**
- Banco de dados hospedado na infraestrutura Cloudflare
- Distribuído globalmente para baixa latência
- Replicado automaticamente em múltiplas regiões

**Como acessar produção:**
```bash
# Criar banco de produção (fazer apenas 1x)
npx wrangler d1 create gocasa360it-production

# Aplicar migrations em produção
npx wrangler d1 migrations apply gocasa360it-production

# Executar comandos em produção (SEM --local)
npx wrangler d1 execute gocasa360it-production --command="SELECT * FROM usuarios"
```

---

## 🗂️ ESTRUTURA DO BANCO DE DADOS

### **Total de Tabelas: 14**

#### **Tabelas Principais (7):**

1. **`usuarios`** - Usuários da plataforma
   - Tipos: proprietario, inquilino, corretor, admin
   - Campos: id, email, senha_hash, nome_completo, tipo, telefone, cpf_cnpj, etc.
   - **Dados atuais: 6 usuários**

2. **`imoveis`** - Catálogo de imóveis
   - Tipos: apartamento, casa, kitnet, cobertura, terreno, comercial, rural
   - Finalidade: aluguel, venda, ambos
   - Campos: titulo, descricao, tipo, preco_aluguel, preco_venda, endereco completo, quartos, banheiros, vagas, área, etc.
   - **Dados atuais: 6 imóveis**

3. **`favoritos`** - Imóveis favoritados pelos usuários
   - Relaciona: usuario_id + imovel_id

4. **`visitas`** - Agendamento de visitas aos imóveis
   - Status: pendente, confirmada, cancelada, realizada
   - Campos: imovel_id, usuario_id, proprietario_id, data_hora, observacoes
   - **Dados atuais: 2 visitas**

5. **`propostas`** - Propostas de aluguel/compra
   - Status: pendente, aceita, recusada, contra_proposta
   - Campos: imovel_id, usuario_id, tipo, valor_proposto, mensagem
   - **Dados atuais: 2 propostas**

6. **`mensagens`** - Sistema de chat entre usuários
   - Campos: remetente_id, destinatario_id, imovel_id, mensagem, lida

7. **`sessoes`** - Controle de autenticação JWT
   - Campos: usuario_id, token, expires_at

#### **Tabelas de Segurança e Administração (7):**

8. **`audit_logs`** - Logs de auditoria de ações admin
   - Campos: admin_id, action_type, resource_type, resource_id, old_value, new_value, ip_address
   - **Dados atuais: 0 logs (sistema novo)**

9. **`denuncias`** - Denúncias de usuários/imóveis
   - Tipos: usuario, imovel, proposta, mensagem
   - Motivos: fraude, spam, conteudo_inapropriado, informacao_falsa, assedio, outro
   - Status: pendente, em_analise, resolvida, rejeitada
   - **Dados atuais: 0 denúncias**

10. **`aprovacao_imoveis`** - Workflow de aprovação de imóveis
    - Status: pendente, aprovado, rejeitado, revisao_necessaria
    - **Dados atuais: 0 aprovações pendentes**

11. **`blacklist`** - Lista de bloqueio
    - Tipos: email, cpf_cnpj, ip, telefone
    - **Dados atuais: 0 bloqueios**

12. **`admin_permissoes`** - Roles e permissões
    - Roles pré-configurados: super_admin, moderador, suporte, financeiro
    - **Dados atuais: 4 roles**

13. **`usuarios_permissoes`** - Associação usuário-permissão
    - Relaciona: usuario_id + permissao_id

14. **`notificacoes_admin`** - Notificações para admins
    - Tipos: nova_denuncia, nova_proposta, documento_pendente, imovel_pendente
    - Prioridades: baixa, media, alta, critica
    - **Dados atuais: 0 notificações**

---

## 📊 DADOS ATUAIS NO BANCO (DESENVOLVIMENTO)

### **Resumo:**
```
✅ Usuários:      6 registros
✅ Imóveis:       6 registros
✅ Propostas:     2 registros
✅ Visitas:       2 registros
✅ Permissões:    4 roles
✅ Favoritos:     0 registros
✅ Mensagens:     0 registros
✅ Denúncias:     0 registros
✅ Audit Logs:    0 registros
✅ Blacklist:     0 registros
```

### **Exemplos de Dados:**

**Usuários cadastrados:**
1. João Silva (proprietario) - joao.silva@email.com
2. Maria Santos (inquilino) - maria.santos@email.com
3. Carlos Oliveira (corretor) - carlos.corretor@email.com
4. Admin Sistema (admin) - admin@gocasa360.com ← **VOCÊ PODE FAZER LOGIN**
5. Outros usuários de teste...

**Imóveis cadastrados:**
1. Apartamento Moderno na Vila Madalena - Aluguel - São Paulo
2. Casa Espaçosa em Condomínio Fechado - Venda - São Paulo
3. Kitnet Mobiliada - Centro - Aluguel - São Paulo
4. Cobertura Duplex com Vista Panorâmica - Ambos - São Paulo
5. Outros imóveis de teste...

---

## 🔧 CONFIGURAÇÃO NO CÓDIGO

### **Arquivo: `wrangler.jsonc`**
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "gocasa360it-production",
      "database_id": "to-be-created"
    }
  ]
}
```

**O que significa:**
- `binding: "DB"` - Variável usada no código: `c.env.DB`
- `database_name` - Nome do banco
- `database_id: "to-be-created"` - Será gerado ao criar banco de produção

### **Como o código acessa o banco:**
```typescript
// Exemplo de rota que usa o banco
app.get('/api/imoveis', async (c) => {
  const { DB } = c.env  // ← Acessa o banco aqui
  
  const imoveis = await DB.prepare('SELECT * FROM imoveis').all()
  
  return c.json(imoveis.results)
})
```

---

## 📝 MIGRATIONS (HISTÓRICO DE MUDANÇAS)

### **Migrations aplicadas:**

1. **`0001_initial_schema.sql`**
   - Criação das 7 tabelas principais
   - Índices para performance
   - Schema completo do sistema

2. **`0003_admin_security_and_audit.sql`**
   - Criação das 7 tabelas de segurança
   - 4 roles pré-configurados
   - Sistema de auditoria completo

**Como aplicar migrations:**
```bash
# Local (desenvolvimento)
npx wrangler d1 migrations apply gocasa360it-production --local

# Produção (após criar banco)
npx wrangler d1 migrations apply gocasa360it-production
```

---

## 🌱 SEED DATA (DADOS DE TESTE)

### **Arquivos de seed:**

1. **`seed.sql`** - Dados principais de teste
   - 6 usuários
   - 6 imóveis
   - 2 propostas
   - 2 visitas

2. **`seed-admin.sql`** - Usuário admin
   - Email: admin@gocasa360.com
   - Senha: Admin@123
   - Role: Super Admin

**Como popular o banco:**
```bash
# Aplicar seed principal
npx wrangler d1 execute gocasa360it-production --local --file=./seed.sql

# Aplicar seed admin
npx wrangler d1 execute gocasa360it-production --local --file=./seed-admin.sql
```

---

## 🔍 COMANDOS ÚTEIS PARA CONSULTAR O BANCO

### **1. Listar todas as tabelas:**
```bash
npx wrangler d1 execute gocasa360it-production --local \
  --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### **2. Contar registros de uma tabela:**
```bash
npx wrangler d1 execute gocasa360it-production --local \
  --command="SELECT COUNT(*) FROM usuarios"
```

### **3. Ver dados de uma tabela:**
```bash
npx wrangler d1 execute gocasa360it-production --local \
  --command="SELECT * FROM imoveis LIMIT 5"
```

### **4. Buscar usuário específico:**
```bash
npx wrangler d1 execute gocasa360it-production --local \
  --command="SELECT * FROM usuarios WHERE email='admin@gocasa360.com'"
```

### **5. Inserir novo imóvel:**
```bash
npx wrangler d1 execute gocasa360it-production --local \
  --command="INSERT INTO imoveis (id, proprietario_id, titulo, tipo, finalidade, preco_aluguel, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep) VALUES ('novo-001', 'user-001', 'Meu Imóvel', 'apartamento', 'aluguel', 1500, 'Rua ABC', '123', 'Centro', 'São Paulo', 'SP', '01000-000')"
```

---

## 🚀 DEPLOY PARA PRODUÇÃO

### **Passo a passo para criar banco de produção:**

1. **Criar banco na Cloudflare:**
```bash
npx wrangler d1 create gocasa360it-production
```

2. **Copiar o database_id** retornado e atualizar `wrangler.jsonc`

3. **Aplicar migrations:**
```bash
npx wrangler d1 migrations apply gocasa360it-production
```

4. **Popular com dados de teste (opcional):**
```bash
npx wrangler d1 execute gocasa360it-production --file=./seed.sql
npx wrangler d1 execute gocasa360it-production --file=./seed-admin.sql
```

5. **Deploy da aplicação:**
```bash
npm run build
npx wrangler pages deploy dist --project-name gocasa360it
```

---

## ⚠️ IMPORTANTE

### **Diferença Local vs Produção:**

| Aspecto | Local (--local) | Produção |
|---------|----------------|----------|
| Localização | `.wrangler/state/v3/d1/` | Cloudflare Cloud |
| Comando | `--local` flag | Sem flag |
| Dados | Temporários | Persistentes |
| Performance | Rápido | Distribuído globalmente |
| Custo | Grátis | Grátis até 5GB |

### **Dados são persistentes?**

✅ **SIM** - em produção (após deploy)  
⚠️ **NÃO** - em desenvolvimento local (podem ser resetados)

Para garantir persistência dos dados locais durante desenvolvimento:
- Não deletar a pasta `.wrangler/`
- Fazer backup com: `cp -r .wrangler/state/v3/d1/ backup/`

---

## 📋 RESUMO

**✅ SIM, JÁ EXISTE BANCO DE DADOS FUNCIONANDO!**

- **Tipo:** Cloudflare D1 (SQLite)
- **Localização Local:** `.wrangler/state/v3/d1/`
- **Tabelas:** 14 tabelas (7 principais + 7 admin)
- **Dados:** 6 usuários, 6 imóveis, 2 propostas, 2 visitas
- **Admin:** admin@gocasa360.com / Admin@123
- **Status:** ✅ Totalmente funcional

**Como testar:**
1. Inicie o servidor: `npm run dev:d1`
2. Acesse: http://localhost:3000
3. Dados carregados automaticamente das tabelas!

**GitHub:** Tudo commitado em https://github.com/antoniocruz2776/GOCASA360_GEN
