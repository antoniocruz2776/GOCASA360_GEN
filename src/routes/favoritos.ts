import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const favoritos = new Hono<{ Bindings: Bindings }>()

// Função para gerar ID único
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Função para obter usuário do token
async function getUserFromToken(token: string, DB: D1Database): Promise<any> {
  const sessao = await DB.prepare(`
    SELECT s.*, u.*
    FROM sessoes s
    JOIN usuarios u ON s.usuario_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).bind(token).first()
  
  return sessao
}

// GET /api/favoritos - Listar favoritos do usuário
favoritos.get('/', async (c) => {
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
    const usuario = await getUserFromToken(token, DB)
    
    if (!usuario) {
      return c.json({
        success: false,
        error: 'Sessão inválida ou expirada'
      }, 401)
    }
    
    // Buscar favoritos com informações dos imóveis
    const result = await DB.prepare(`
      SELECT 
        f.id as favorito_id,
        f.created_at as favoritado_em,
        i.*,
        u.nome_completo as proprietario_nome
      FROM favoritos f
      JOIN imoveis i ON f.imovel_id = i.id
      LEFT JOIN usuarios u ON i.proprietario_id = u.id
      WHERE f.usuario_id = ?
      ORDER BY f.created_at DESC
    `).bind(usuario.usuario_id).all()
    
    const favoritos = result.results.map((fav: any) => ({
      ...fav,
      comodidades: fav.comodidades ? JSON.parse(fav.comodidades) : [],
      fotos: fav.fotos ? JSON.parse(fav.fotos) : []
    }))
    
    return c.json({
      success: true,
      data: favoritos
    })
    
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar favoritos'
    }, 500)
  }
})

// POST /api/favoritos - Adicionar imóvel aos favoritos
favoritos.post('/', async (c) => {
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
    const usuario = await getUserFromToken(token, DB)
    
    if (!usuario) {
      return c.json({
        success: false,
        error: 'Sessão inválida ou expirada'
      }, 401)
    }
    
    const body = await c.req.json()
    const { imovel_id } = body
    
    if (!imovel_id) {
      return c.json({
        success: false,
        error: 'ID do imóvel é obrigatório'
      }, 400)
    }
    
    // Verificar se imóvel existe
    const imovel = await DB.prepare(`
      SELECT id FROM imoveis WHERE id = ?
    `).bind(imovel_id).first()
    
    if (!imovel) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    // Verificar se já está favoritado
    const favoritoExistente = await DB.prepare(`
      SELECT id FROM favoritos WHERE usuario_id = ? AND imovel_id = ?
    `).bind(usuario.usuario_id, imovel_id).first()
    
    if (favoritoExistente) {
      return c.json({
        success: false,
        error: 'Imóvel já está nos favoritos'
      }, 409)
    }
    
    // Adicionar aos favoritos
    const favoritoId = generateId('fav')
    await DB.prepare(`
      INSERT INTO favoritos (id, usuario_id, imovel_id)
      VALUES (?, ?, ?)
    `).bind(favoritoId, usuario.usuario_id, imovel_id).run()
    
    return c.json({
      success: true,
      message: 'Imóvel adicionado aos favoritos',
      data: {
        favorito_id: favoritoId
      }
    }, 201)
    
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error)
    return c.json({
      success: false,
      error: 'Erro ao adicionar favorito'
    }, 500)
  }
})

// DELETE /api/favoritos/:imovel_id - Remover imóvel dos favoritos
favoritos.delete('/:imovel_id', async (c) => {
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
    const usuario = await getUserFromToken(token, DB)
    
    if (!usuario) {
      return c.json({
        success: false,
        error: 'Sessão inválida ou expirada'
      }, 401)
    }
    
    const imovel_id = c.req.param('imovel_id')
    
    // Remover dos favoritos
    const result = await DB.prepare(`
      DELETE FROM favoritos 
      WHERE usuario_id = ? AND imovel_id = ?
    `).bind(usuario.usuario_id, imovel_id).run()
    
    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: 'Favorito não encontrado'
      }, 404)
    }
    
    return c.json({
      success: true,
      message: 'Imóvel removido dos favoritos'
    })
    
  } catch (error) {
    console.error('Erro ao remover favorito:', error)
    return c.json({
      success: false,
      error: 'Erro ao remover favorito'
    }, 500)
  }
})

// GET /api/favoritos/check/:imovel_id - Verificar se imóvel está favoritado
favoritos.get('/check/:imovel_id', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: true,
        favoritado: false
      })
    }
    
    const token = authHeader.substring(7)
    const usuario = await getUserFromToken(token, DB)
    
    if (!usuario) {
      return c.json({
        success: true,
        favoritado: false
      })
    }
    
    const imovel_id = c.req.param('imovel_id')
    
    const favorito = await DB.prepare(`
      SELECT id FROM favoritos WHERE usuario_id = ? AND imovel_id = ?
    `).bind(usuario.usuario_id, imovel_id).first()
    
    return c.json({
      success: true,
      favoritado: !!favorito
    })
    
  } catch (error) {
    console.error('Erro ao verificar favorito:', error)
    return c.json({
      success: true,
      favoritado: false
    })
  }
})

export default favoritos
