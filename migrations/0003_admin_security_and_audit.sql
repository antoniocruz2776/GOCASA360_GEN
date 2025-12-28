-- ============================================
-- GOCASA360IT - Admin Security and Audit System
-- Migration 003: Add authentication and audit tables
-- ============================================

-- Tabela de Audit Logs (Auditoria de Ações Administrativas)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', 'block', 'unblock'
  resource_type TEXT NOT NULL, -- 'user', 'property', 'proposal', 'visit', 'report'
  resource_id TEXT NOT NULL,
  old_value TEXT, -- JSON com valores antigos
  new_value TEXT, -- JSON com valores novos
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Denúncias/Reports
CREATE TABLE IF NOT EXISTS denuncias (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL CHECK(tipo IN ('usuario', 'imovel', 'proposta', 'mensagem')),
  denunciante_id TEXT NOT NULL,
  denunciado_id TEXT, -- ID do usuário denunciado
  resource_id TEXT, -- ID do imóvel, proposta ou mensagem
  motivo TEXT NOT NULL CHECK(motivo IN ('fraude', 'spam', 'conteudo_inapropriado', 'informacao_falsa', 'assedio', 'outro')),
  descricao TEXT NOT NULL,
  evidencias TEXT, -- JSON array com URLs de prints/provas
  status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'em_analise', 'resolvida', 'rejeitada')),
  admin_responsavel_id TEXT,
  resolucao TEXT, -- Descrição da resolução
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (denunciante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (denunciado_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de Blacklist
CREATE TABLE IF NOT EXISTS blacklist (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL CHECK(tipo IN ('email', 'cpf_cnpj', 'ip', 'telefone')),
  valor TEXT NOT NULL UNIQUE,
  motivo TEXT NOT NULL,
  admin_id TEXT NOT NULL,
  permanente INTEGER DEFAULT 0, -- 0 = temporário, 1 = permanente
  data_expiracao TEXT, -- NULL se permanente
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Aprovação de Imóveis
CREATE TABLE IF NOT EXISTS aprovacao_imoveis (
  id TEXT PRIMARY KEY,
  imovel_id TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'aprovado', 'rejeitado', 'revisao_necessaria')),
  admin_id TEXT,
  motivo_rejeicao TEXT,
  observacoes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de Permissões Admin (Roles and Capabilities)
CREATE TABLE IF NOT EXISTS admin_permissoes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE, -- 'super_admin', 'moderador', 'suporte', 'financeiro'
  descricao TEXT,
  permissoes TEXT NOT NULL, -- JSON array: ['users.read', 'users.write', 'properties.approve', etc]
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de Associação Admin-Permissão
CREATE TABLE IF NOT EXISTS usuarios_permissoes (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  permissao_id TEXT NOT NULL,
  concedido_por TEXT NOT NULL, -- ID do admin que concedeu
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (permissao_id) REFERENCES admin_permissoes(id) ON DELETE CASCADE,
  FOREIGN KEY (concedido_por) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, permissao_id)
);

-- Tabela de Notificações Admin
CREATE TABLE IF NOT EXISTS notificacoes_admin (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL CHECK(tipo IN ('nova_denuncia', 'nova_proposta', 'documento_pendente', 'imovel_pendente', 'atividade_suspeita')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  link TEXT, -- URL para ação relacionada
  prioridade TEXT DEFAULT 'media' CHECK(prioridade IN ('baixa', 'media', 'alta', 'critica')),
  lida INTEGER DEFAULT 0,
  admin_id TEXT, -- NULL = todos os admins
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Adicionar campos ao usuário para controle de segurança
ALTER TABLE usuarios ADD COLUMN ultimo_login TEXT;
ALTER TABLE usuarios ADD COLUMN tentativas_login INTEGER DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN bloqueado_ate TEXT;
ALTER TABLE usuarios ADD COLUMN ip_cadastro TEXT;

-- ============================================
-- ÍNDICES para melhor performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_denuncias_status ON denuncias(status);
CREATE INDEX IF NOT EXISTS idx_denuncias_tipo ON denuncias(tipo);
CREATE INDEX IF NOT EXISTS idx_denuncias_denunciante ON denuncias(denunciante_id);
CREATE INDEX IF NOT EXISTS idx_denuncias_admin ON denuncias(admin_responsavel_id);

CREATE INDEX IF NOT EXISTS idx_blacklist_tipo_valor ON blacklist(tipo, valor);
CREATE INDEX IF NOT EXISTS idx_blacklist_expiracao ON blacklist(data_expiracao);

CREATE INDEX IF NOT EXISTS idx_aprovacao_status ON aprovacao_imoveis(status);
CREATE INDEX IF NOT EXISTS idx_aprovacao_imovel ON aprovacao_imoveis(imovel_id);

CREATE INDEX IF NOT EXISTS idx_notificacoes_admin ON notificacoes_admin(admin_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes_admin(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_prioridade ON notificacoes_admin(prioridade);

-- ============================================
-- SEED DATA - Permissões Padrão
-- ============================================

-- Super Admin (todas as permissões)
INSERT OR IGNORE INTO admin_permissoes (id, nome, descricao, permissoes) VALUES
('perm-super-admin', 'Super Admin', 'Acesso total ao sistema', 
 '["*"]');

-- Moderador (gerenciar usuários e imóveis)
INSERT OR IGNORE INTO admin_permissoes (id, nome, descricao, permissoes) VALUES
('perm-moderador', 'Moderador', 'Gerenciar usuários, imóveis e denúncias',
 '["users.read","users.update","users.block","properties.read","properties.update","properties.approve","reports.read","reports.update"]');

-- Suporte (visualização e suporte aos usuários)
INSERT OR IGNORE INTO admin_permissoes (id, nome, descricao, permissoes) VALUES
('perm-suporte', 'Suporte', 'Visualizar informações e dar suporte',
 '["users.read","properties.read","proposals.read","visits.read","reports.read"]');

-- Financeiro (gerenciar propostas e transações)
INSERT OR IGNORE INTO admin_permissoes (id, nome, descricao, permissoes) VALUES
('perm-financeiro', 'Financeiro', 'Gerenciar propostas e transações financeiras',
 '["proposals.read","proposals.update","users.read","properties.read","analytics.read"]');
