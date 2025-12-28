-- ============================================
-- GDPR Compliance Tables - GoCasa360IT
-- Conformidade com RGPD (Regulamento UE 2016/679)
-- ============================================

-- Tabela de Consentimentos GDPR
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  consented_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  
  -- Finalidades (purposes)
  necessary INTEGER DEFAULT 1, -- Sempre true
  marketing INTEGER DEFAULT 0,
  analytics INTEGER DEFAULT 0,
  third_party INTEGER DEFAULT 0,
  profiling INTEGER DEFAULT 0,
  
  -- Direitos
  right_to_access INTEGER DEFAULT 1,
  right_to_rectification INTEGER DEFAULT 1,
  right_to_erasure INTEGER DEFAULT 1,
  right_to_restriction INTEGER DEFAULT 1,
  right_to_portability INTEGER DEFAULT 1,
  right_to_object INTEGER DEFAULT 1,
  
  -- Retenção de dados
  data_retention_years INTEGER DEFAULT 10,
  
  -- Revogação
  withdrawn_at TEXT,
  withdrawn_reason TEXT,
  
  last_updated TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Solicitações GDPR (Direitos dos Usuários)
CREATE TABLE IF NOT EXISTS gdpr_data_requests (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK(request_type IN (
    'access',           -- Direito de acesso
    'rectification',    -- Direito de retificação
    'erasure',          -- Direito ao esquecimento
    'restriction',      -- Direito de limitação
    'portability',      -- Direito de portabilidade
    'objection'         -- Direito de objeção
  )),
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'rejected')),
  completed_at TEXT,
  notes TEXT,
  documents TEXT, -- JSON array de URLs
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Violações de Dados (Data Breaches)
CREATE TABLE IF NOT EXISTS gdpr_data_breaches (
  id TEXT PRIMARY KEY,
  detected_at TEXT NOT NULL DEFAULT (datetime('now')),
  reported_to_garante_at TEXT, -- Deve ser em 72h
  severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  affected_users TEXT NOT NULL, -- JSON array de user IDs
  data_categories TEXT NOT NULL, -- JSON array de categorias
  description TEXT NOT NULL,
  mitigation_actions TEXT, -- JSON array de ações
  notified_users INTEGER DEFAULT 0,
  status TEXT DEFAULT 'detected' CHECK(status IN ('detected', 'investigating', 'mitigated', 'closed')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de Histórico de Consentimentos (Audit Trail)
CREATE TABLE IF NOT EXISTS gdpr_consent_history (
  id TEXT PRIMARY KEY,
  consent_id TEXT NOT NULL,
  usuario_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('created', 'updated', 'withdrawn', 'renewed')),
  old_values TEXT, -- JSON com valores antigos
  new_values TEXT, -- JSON com valores novos
  ip_address TEXT,
  user_agent TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (consent_id) REFERENCES gdpr_consents(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Agendamento de Exclusão de Dados
CREATE TABLE IF NOT EXISTS gdpr_data_deletion_schedule (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  data_category TEXT NOT NULL,
  retention_years INTEGER NOT NULL,
  scheduled_deletion_date TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'executed', 'cancelled')),
  executed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Dados Anonimizados (quando não pode excluir)
CREATE TABLE IF NOT EXISTS gdpr_anonymized_data (
  id TEXT PRIMARY KEY,
  original_user_id TEXT NOT NULL UNIQUE,
  anonymized_id TEXT NOT NULL UNIQUE,
  anonymized_at TEXT NOT NULL DEFAULT (datetime('now')),
  reason TEXT NOT NULL, -- Por que foi anonimizado ao invés de excluído
  retained_categories TEXT, -- JSON array de categorias mantidas
  legal_basis TEXT -- Base legal para retenção
);

-- ============================================
-- ÍNDICES para performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_gdpr_consents_usuario ON gdpr_consents(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_withdrawn ON gdpr_consents(withdrawn_at);
CREATE INDEX IF NOT EXISTS idx_gdpr_data_requests_usuario ON gdpr_data_requests(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_data_requests_status ON gdpr_data_requests(status);
CREATE INDEX IF NOT EXISTS idx_gdpr_data_requests_type ON gdpr_data_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_gdpr_breaches_severity ON gdpr_data_breaches(severity);
CREATE INDEX IF NOT EXISTS idx_gdpr_breaches_status ON gdpr_data_breaches(status);
CREATE INDEX IF NOT EXISTS idx_gdpr_consent_history_consent ON gdpr_consent_history(consent_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_deletion_schedule_date ON gdpr_data_deletion_schedule(scheduled_deletion_date);
CREATE INDEX IF NOT EXISTS idx_gdpr_deletion_schedule_status ON gdpr_data_deletion_schedule(status);
CREATE INDEX IF NOT EXISTS idx_gdpr_anonymized_original ON gdpr_anonymized_data(original_user_id);
