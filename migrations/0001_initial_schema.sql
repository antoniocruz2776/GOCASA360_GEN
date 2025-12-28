-- ============================================
-- GOCASA360IT - Schema do Banco de Dados
-- Plataforma de Aluguel e Venda de Imóveis
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  nome_completo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('proprietario', 'inquilino', 'corretor', 'admin')),
  telefone TEXT,
  cpf_cnpj TEXT UNIQUE,
  foto_perfil TEXT,
  documentos_verificados INTEGER DEFAULT 0,
  ativo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS imoveis (
  id TEXT PRIMARY KEY,
  proprietario_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK(tipo IN ('apartamento', 'casa', 'kitnet', 'cobertura', 'terreno', 'comercial', 'rural')),
  finalidade TEXT NOT NULL CHECK(finalidade IN ('aluguel', 'venda', 'ambos')),
  preco_aluguel REAL,
  preco_venda REAL,
  condominio REAL DEFAULT 0,
  iptu REAL DEFAULT 0,
  
  -- Endereço (campos separados para melhor busca)
  endereco_rua TEXT NOT NULL,
  endereco_numero TEXT NOT NULL,
  endereco_complemento TEXT,
  endereco_bairro TEXT NOT NULL,
  endereco_cidade TEXT NOT NULL,
  endereco_estado TEXT NOT NULL,
  endereco_cep TEXT NOT NULL,
  endereco_latitude REAL,
  endereco_longitude REAL,
  
  -- Características
  quartos INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  vagas_garagem INTEGER DEFAULT 0,
  area_util REAL,
  area_total REAL,
  mobiliado INTEGER DEFAULT 0,
  pet_friendly INTEGER DEFAULT 0,
  
  -- Comodidades (JSON array)
  comodidades TEXT, -- ['piscina', 'academia', 'churrasqueira']
  
  -- Fotos (JSON array de URLs)
  fotos TEXT, -- ['url1', 'url2', 'url3']
  foto_capa TEXT,
  
  -- Status
  disponivel INTEGER DEFAULT 1,
  destaque INTEGER DEFAULT 0,
  visualizacoes INTEGER DEFAULT 0,
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (proprietario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  imovel_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, imovel_id)
);

-- Tabela de Visitas Agendadas
CREATE TABLE IF NOT EXISTS visitas (
  id TEXT PRIMARY KEY,
  imovel_id TEXT NOT NULL,
  usuario_id TEXT NOT NULL,
  proprietario_id TEXT NOT NULL,
  data_hora TEXT NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'confirmada', 'cancelada', 'realizada')),
  observacoes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (proprietario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Mensagens/Chat
CREATE TABLE IF NOT EXISTS mensagens (
  id TEXT PRIMARY KEY,
  remetente_id TEXT NOT NULL,
  destinatario_id TEXT NOT NULL,
  imovel_id TEXT,
  mensagem TEXT NOT NULL,
  lida INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE SET NULL
);

-- Tabela de Propostas
CREATE TABLE IF NOT EXISTS propostas (
  id TEXT PRIMARY KEY,
  imovel_id TEXT NOT NULL,
  usuario_id TEXT NOT NULL,
  proprietario_id TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('aluguel', 'compra')),
  valor_proposto REAL NOT NULL,
  mensagem TEXT,
  status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'aceita', 'recusada', 'contra_proposta')),
  valor_contra_proposta REAL,
  mensagem_resposta TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (proprietario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Sessões (para JWT tokens)
CREATE TABLE IF NOT EXISTS sessoes (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================
-- ÍNDICES para melhor performance
-- ============================================

-- Índices para Usuários
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf_cnpj ON usuarios(cpf_cnpj);

-- Índices para Imóveis
CREATE INDEX IF NOT EXISTS idx_imoveis_proprietario ON imoveis(proprietario_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_tipo ON imoveis(tipo);
CREATE INDEX IF NOT EXISTS idx_imoveis_finalidade ON imoveis(finalidade);
CREATE INDEX IF NOT EXISTS idx_imoveis_cidade ON imoveis(endereco_cidade);
CREATE INDEX IF NOT EXISTS idx_imoveis_estado ON imoveis(endereco_estado);
CREATE INDEX IF NOT EXISTS idx_imoveis_bairro ON imoveis(endereco_bairro);
CREATE INDEX IF NOT EXISTS idx_imoveis_preco_aluguel ON imoveis(preco_aluguel);
CREATE INDEX IF NOT EXISTS idx_imoveis_preco_venda ON imoveis(preco_venda);
CREATE INDEX IF NOT EXISTS idx_imoveis_disponivel ON imoveis(disponivel);
CREATE INDEX IF NOT EXISTS idx_imoveis_destaque ON imoveis(destaque);

-- Índices para Favoritos
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_imovel ON favoritos(imovel_id);

-- Índices para Visitas
CREATE INDEX IF NOT EXISTS idx_visitas_imovel ON visitas(imovel_id);
CREATE INDEX IF NOT EXISTS idx_visitas_usuario ON visitas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_visitas_proprietario ON visitas(proprietario_id);
CREATE INDEX IF NOT EXISTS idx_visitas_status ON visitas(status);
CREATE INDEX IF NOT EXISTS idx_visitas_data ON visitas(data_hora);

-- Índices para Mensagens
CREATE INDEX IF NOT EXISTS idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_imovel ON mensagens(imovel_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_lida ON mensagens(lida);

-- Índices para Propostas
CREATE INDEX IF NOT EXISTS idx_propostas_imovel ON propostas(imovel_id);
CREATE INDEX IF NOT EXISTS idx_propostas_usuario ON propostas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_propostas_proprietario ON propostas(proprietario_id);
CREATE INDEX IF NOT EXISTS idx_propostas_status ON propostas(status);

-- Índices para Sessões
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token);
