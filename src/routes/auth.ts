import { Hono } from 'hono'
import { sign } from 'hono/jwt'

type Bindings = {
  DB: D1Database;
}

const auth = new Hono<{ Bindings: Bindings }>()

// Função auxiliar para hash de senha (simples - em produção usar bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Função para gerar ID único
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// POST /api/auth/register - Registro de novo usuário
auth.post('/register', async (c) => {
  try {
    const { DB } = c.env
    const body = await c.req.json()
    
    const { email, senha, nome_completo, tipo, telefone, cpf_cnpj } = body
    
    // Validações básicas
    if (!email || !senha || !nome_completo || !tipo) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: email, senha, nome_completo, tipo'
      }, 400)
    }
    
    // Validar tipo de usuário
    const tiposValidos = ['proprietario', 'inquilino', 'corretor']
    if (!tiposValidos.includes(tipo)) {
      return c.json({
        success: false,
        error: 'Tipo deve ser: proprietario, inquilino ou corretor'
      }, 400)
    }
    
    // Verificar se email já existe
    const existente = await DB.prepare(`
      SELECT id FROM usuarios WHERE email = ?
    `).bind(email).first()
    
    if (existente) {
      return c.json({
        success: false,
        error: 'Email já cadastrado'
      }, 409)
    }
    
    // Hash da senha
    const senhaHash = await hashPassword(senha)
    
    // Criar usuário
    const userId = generateId('user')
    await DB.prepare(`
      INSERT INTO usuarios (
        id, email, senha_hash, nome_completo, tipo, 
        telefone, cpf_cnpj, documentos_verificados, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)
    `).bind(userId, email, senhaHash, nome_completo, tipo, telefone || null, cpf_cnpj || null).run()
    
    // Gerar JWT token
    const JWT_SECRET = 'gocasa360it-secret-key-change-in-production'
    const token = await sign({
      sub: userId,
      email: email,
      tipo: tipo,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 dias
    }, JWT_SECRET)
    
    // Salvar sessão
    const sessionId = generateId('session')
    await DB.prepare(`
      INSERT INTO sessoes (id, usuario_id, token, expires_at)
      VALUES (?, ?, ?, datetime('now', '+7 days'))
    `).bind(sessionId, userId, token).run()
    
    return c.json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: {
        usuario: {
          id: userId,
          email: email,
          nome_completo: nome_completo,
          tipo: tipo
        },
        token: token
      }
    }, 201)
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return c.json({
      success: false,
      error: 'Erro ao registrar usuário'
    }, 500)
  }
})

// POST /api/auth/login - Login de usuário
auth.post('/login', async (c) => {
  try {
    const { DB } = c.env
    const body = await c.req.json()
    
    const { email, senha } = body
    
    if (!email || !senha) {
      return c.json({
        success: false,
        error: 'Email e senha são obrigatórios'
      }, 400)
    }
    
    // Buscar usuário
    const usuario = await DB.prepare(`
      SELECT * FROM usuarios WHERE email = ? AND ativo = 1
    `).bind(email).first()
    
    if (!usuario) {
      return c.json({
        success: false,
        error: 'Email ou senha incorretos'
      }, 401)
    }
    
    // Verificar senha
    const senhaHash = await hashPassword(senha)
    if (senhaHash !== usuario.senha_hash) {
      return c.json({
        success: false,
        error: 'Email ou senha incorretos'
      }, 401)
    }
    
    // Gerar JWT token
    const JWT_SECRET = 'gocasa360it-secret-key-change-in-production'
    const token = await sign({
      sub: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 dias
    }, JWT_SECRET)
    
    // Salvar sessão
    const sessionId = generateId('session')
    await DB.prepare(`
      INSERT INTO sessoes (id, usuario_id, token, expires_at)
      VALUES (?, ?, ?, datetime('now', '+7 days'))
    `).bind(sessionId, usuario.id, token).run()
    
    return c.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nome_completo: usuario.nome_completo,
          tipo: usuario.tipo,
          telefone: usuario.telefone,
          foto_perfil: usuario.foto_perfil
        },
        token: token
      }
    })
    
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return c.json({
      success: false,
      error: 'Erro ao fazer login'
    }, 500)
  }
})

// GET /api/auth/me - Obter dados do usuário logado
auth.get('/me', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'Token não fornecido'
      }, 401)
    }
    
    const token = authHeader.substring(7)
    
    // Verificar se sessão existe
    const sessao = await DB.prepare(`
      SELECT s.*, u.*
      FROM sessoes s
      JOIN usuarios u ON s.usuario_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first()
    
    if (!sessao) {
      return c.json({
        success: false,
        error: 'Sessão inválida ou expirada'
      }, 401)
    }
    
    return c.json({
      success: true,
      data: {
        id: sessao.usuario_id,
        email: sessao.email,
        nome_completo: sessao.nome_completo,
        tipo: sessao.tipo,
        telefone: sessao.telefone,
        cpf_cnpj: sessao.cpf_cnpj,
        foto_perfil: sessao.foto_perfil,
        documentos_verificados: sessao.documentos_verificados
      }
    })
    
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return c.json({
      success: false,
      error: 'Erro ao obter dados do usuário'
    }, 500)
  }
})

// POST /api/auth/logout - Logout do usuário
auth.post('/logout', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'Token não fornecido'
      }, 401)
    }
    
    const token = authHeader.substring(7)
    
    // Remover sessão
    await DB.prepare(`
      DELETE FROM sessoes WHERE token = ?
    `).bind(token).run()
    
    return c.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })
    
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return c.json({
      success: false,
      error: 'Erro ao fazer logout'
    }, 500)
  }
})

// POST /api/auth/admin/login - Login específico para admin
auth.post('/admin/login', async (c) => {
  try {
    const { DB } = c.env
    const { email, senha } = await c.req.json()
    
    // Validações
    if (!email || !senha) {
      return c.json({
        success: false,
        message: 'Email e senha são obrigatórios'
      }, 400)
    }
    
    // Buscar usuário admin
    const usuario = await DB.prepare(`
      SELECT * FROM usuarios 
      WHERE email = ? AND tipo = 'admin' AND ativo = 1
    `).bind(email).first()
    
    if (!usuario) {
      return c.json({
        success: false,
        message: 'Email ou senha inválidos ou usuário não é administrador'
      }, 401)
    }
    
    // Verificar senha
    const senhaHash = await hashPassword(senha)
    if (senhaHash !== usuario.senha_hash) {
      // Incrementar tentativas de login
      await DB.prepare(`
        UPDATE usuarios 
        SET tentativas_login = tentativas_login + 1
        WHERE id = ?
      `).bind(usuario.id).run()
      
      return c.json({
        success: false,
        message: 'Email ou senha inválidos'
      }, 401)
    }
    
    // Verificar se está bloqueado
    if (usuario.bloqueado_ate) {
      const now = new Date()
      const bloqueadoAte = new Date(usuario.bloqueado_ate as string)
      
      if (now < bloqueadoAte) {
        return c.json({
          success: false,
          message: 'Conta bloqueada temporariamente. Tente novamente mais tarde.'
        }, 403)
      }
    }
    
    // Gerar JWT token
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
      nome: usuario.nome_completo
    }
    
    const secret = 'your-secret-key-change-in-production' // Deve vir de variável de ambiente
    const token = await sign(payload, secret)
    
    // Criar sessão
    const sessionId = generateId('session')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 dias
    
    await DB.prepare(`
      INSERT INTO sessoes (id, usuario_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(sessionId, usuario.id, token, expiresAt.toISOString()).run()
    
    // Atualizar último login e resetar tentativas
    await DB.prepare(`
      UPDATE usuarios 
      SET ultimo_login = datetime('now'), tentativas_login = 0
      WHERE id = ?
    `).bind(usuario.id).run()
    
    // Buscar permissões do admin
    const permissoes = await DB.prepare(`
      SELECT ap.nome, ap.permissoes
      FROM usuarios_permissoes up
      JOIN admin_permissoes ap ON up.permissao_id = ap.id
      WHERE up.usuario_id = ?
    `).bind(usuario.id).all()
    
    return c.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome_completo,
          email: usuario.email,
          tipo: usuario.tipo,
          foto_perfil: usuario.foto_perfil
        },
        permissoes: permissoes.results
      }
    })
    
  } catch (error) {
    console.error('Erro ao fazer login admin:', error)
    return c.json({
      success: false,
      message: 'Erro ao fazer login'
    }, 500)
  }
})

export default auth
