-- Criar usuário admin de teste
INSERT OR IGNORE INTO usuarios (id, email, senha_hash, nome_completo, tipo, telefone, ativo, created_at)
VALUES (
  'admin-001',
  'admin@gocasa360.com',
  '55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251', -- senha: Admin@123
  'Administrador Sistema',
  'admin',
  '11999999999',
  1,
  datetime('now')
);

-- Conceder permissão de Super Admin
INSERT OR IGNORE INTO usuarios_permissoes (id, usuario_id, permissao_id, concedido_por)
VALUES ('user-perm-admin-001', 'admin-001', 'perm-super-admin', 'admin-001');
