-- ============================================
-- GOCASA360IT - Dados de Teste (Seed)
-- ============================================

-- Inserir usuários de teste
INSERT OR IGNORE INTO usuarios (id, email, senha_hash, nome_completo, tipo, telefone, cpf_cnpj, documentos_verificados) VALUES 
  ('user-001', 'joao.silva@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'João Silva', 'proprietario', '(11) 98765-4321', '123.456.789-00', 1),
  ('user-002', 'maria.santos@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Maria Santos', 'inquilino', '(11) 91234-5678', '987.654.321-00', 1),
  ('user-003', 'carlos.corretor@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carlos Oliveira', 'corretor', '(11) 99999-8888', '456.789.123-00', 1),
  ('user-004', 'ana.proprietaria@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ana Costa', 'proprietario', '(11) 97777-6666', '321.654.987-00', 1),
  ('user-005', 'admin@gocasa360it.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin GOCASA', 'admin', '(11) 3000-0000', '111.222.333-44', 1);

-- Senha de todos os usuários de teste: "senha123"

-- Inserir imóveis de teste
INSERT OR IGNORE INTO imoveis (
  id, proprietario_id, titulo, descricao, tipo, finalidade, 
  preco_aluguel, preco_venda, condominio, iptu,
  endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, 
  endereco_cidade, endereco_estado, endereco_cep,
  quartos, banheiros, vagas_garagem, area_util, area_total,
  mobiliado, pet_friendly, comodidades, foto_capa, disponivel, destaque
) VALUES 
  (
    'imovel-001', 'user-001', 
    'Apartamento Moderno na Vila Madalena', 
    'Lindo apartamento de 2 quartos em excelente localização. Próximo ao metrô, comércio e áreas de lazer. Prédio com segurança 24h.',
    'apartamento', 'aluguel',
    2800.00, NULL, 650.00, 120.00,
    'Rua Harmonia', '123', 'Apto 45', 'Vila Madalena',
    'São Paulo', 'SP', '05435-000',
    2, 1, 1, 65.0, 75.0,
    0, 1, '["piscina","academia","churrasqueira","salao_festas"]',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    1, 1
  ),
  (
    'imovel-002', 'user-001',
    'Casa Espaçosa em Condomínio Fechado',
    'Casa com 3 suítes, quintal amplo e área gourmet. Condomínio com segurança, clube e área verde.',
    'casa', 'venda',
    NULL, 850000.00, 450.00, 200.00,
    'Rua das Flores', '456', NULL, 'Jardim Paulista',
    'São Paulo', 'SP', '01452-000',
    3, 3, 2, 180.0, 250.0,
    0, 1, '["piscina","churrasqueira","quintal","area_gourmet","playground"]',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    1, 1
  ),
  (
    'imovel-003', 'user-004',
    'Kitnet Mobiliada - Centro',
    'Kitnet totalmente mobiliada próxima à Av. Paulista. Ideal para estudantes ou profissionais.',
    'kitnet', 'aluguel',
    1200.00, NULL, 180.00, 50.00,
    'Rua Augusta', '789', 'Apto 12', 'Consolação',
    'São Paulo', 'SP', '01305-000',
    1, 1, 0, 28.0, 30.0,
    1, 0, '["portaria_24h","elevador"]',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    1, 0
  ),
  (
    'imovel-004', 'user-004',
    'Cobertura Duplex com Vista Panorâmica',
    'Cobertura luxuosa com piscina privativa, churrasqueira e vista deslumbrante da cidade.',
    'cobertura', 'ambos',
    8500.00, 2500000.00, 1500.00, 800.00,
    'Av. Brigadeiro Faria Lima', '2000', 'Cobertura', 'Jardim Paulistano',
    'São Paulo', 'SP', '01451-000',
    4, 5, 4, 320.0, 450.0,
    1, 1, '["piscina_privativa","sauna","academia_privativa","churrasqueira","adega","home_theater"]',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    1, 1
  ),
  (
    'imovel-005', 'user-001',
    'Apartamento Studio - Brooklin',
    'Studio compacto e funcional, perfeito para quem busca praticidade e boa localização.',
    'apartamento', 'aluguel',
    1800.00, NULL, 320.00, 80.00,
    'Rua Funchal', '350', 'Apto 203', 'Brooklin',
    'São Paulo', 'SP', '04551-060',
    1, 1, 1, 35.0, 40.0,
    1, 1, '["academia","coworking","lavanderia"]',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    1, 0
  ),
  (
    'imovel-006', 'user-004',
    'Casa Térrea com Piscina - Morumbi',
    'Casa ampla com 4 quartos, piscina aquecida e jardim. Rua tranquila e arborizada.',
    'casa', 'venda',
    NULL, 1200000.00, 0, 350.00,
    'Rua Giovanni Gronchi', '1500', NULL, 'Morumbi',
    'São Paulo', 'SP', '05724-002',
    4, 3, 3, 280.0, 450.0,
    0, 1, '["piscina","churrasqueira","quintal","area_gourmet","despensa"]',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    1, 0
  );

-- Inserir alguns favoritos
INSERT OR IGNORE INTO favoritos (id, usuario_id, imovel_id) VALUES
  ('fav-001', 'user-002', 'imovel-001'),
  ('fav-002', 'user-002', 'imovel-003'),
  ('fav-003', 'user-002', 'imovel-005');

-- Inserir visitas agendadas
INSERT OR IGNORE INTO visitas (id, imovel_id, usuario_id, proprietario_id, data_hora, status, observacoes) VALUES
  ('visita-001', 'imovel-001', 'user-002', 'user-001', '2024-12-30 14:00:00', 'confirmada', 'Interessado em alugar a partir de janeiro'),
  ('visita-002', 'imovel-003', 'user-002', 'user-004', '2024-12-29 10:00:00', 'pendente', 'Preciso saber se aceita pet');

-- Inserir algumas mensagens
INSERT OR IGNORE INTO mensagens (id, remetente_id, destinatario_id, imovel_id, mensagem) VALUES
  ('msg-001', 'user-002', 'user-001', 'imovel-001', 'Olá! Tenho interesse no apartamento. Ele está disponível para janeiro?'),
  ('msg-002', 'user-001', 'user-002', 'imovel-001', 'Olá Maria! Sim, o apartamento está disponível. Gostaria de agendar uma visita?'),
  ('msg-003', 'user-002', 'user-001', 'imovel-001', 'Sim, por favor! Tenho disponibilidade na sexta-feira à tarde.');

-- Inserir propostas
INSERT OR IGNORE INTO propostas (id, imovel_id, usuario_id, proprietario_id, tipo, valor_proposto, mensagem, status) VALUES
  ('prop-001', 'imovel-002', 'user-002', 'user-001', 'compra', 800000.00, 'Gostaria de fazer uma proposta. Tenho entrada de 30%.', 'pendente'),
  ('prop-002', 'imovel-004', 'user-002', 'user-004', 'aluguel', 8000.00, 'Interessado no imóvel, mas gostaria de negociar o valor.', 'contra_proposta');

-- Atualizar visualizações dos imóveis
UPDATE imoveis SET visualizacoes = 145 WHERE id = 'imovel-001';
UPDATE imoveis SET visualizacoes = 89 WHERE id = 'imovel-002';
UPDATE imoveis SET visualizacoes = 234 WHERE id = 'imovel-003';
UPDATE imoveis SET visualizacoes = 67 WHERE id = 'imovel-004';
UPDATE imoveis SET visualizacoes = 178 WHERE id = 'imovel-005';
UPDATE imoveis SET visualizacoes = 92 WHERE id = 'imovel-006';
