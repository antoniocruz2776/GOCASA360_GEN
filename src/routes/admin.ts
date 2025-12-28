import { Hono } from 'hono'
import type { Context } from 'hono'
import { 
  requireAdmin, 
  requirePermission, 
  logAdminAction,
  getUserPermissions,
  createAdminNotification,
  isBlacklisted
} from '../utils/auth'

type Bindings = {
  DB: D1Database
}

const admin = new Hono<{ Bindings: Bindings }>()

// Apply admin authentication middleware to all routes
admin.use('/*', requireAdmin)

// ============================================
// DASHBOARD - Estatísticas Gerais
// ============================================
admin.get('/stats', async (c) => {
  try {
    const { DB } = c.env

    // Total de usuários por tipo
    const usuarios = await DB.prepare(`
      SELECT tipo, COUNT(*) as total 
      FROM usuarios 
      GROUP BY tipo
    `).all()

    // Total de imóveis por status
    const imoveis = await DB.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN disponivel = 1 THEN 1 ELSE 0 END) as disponiveis,
        SUM(CASE WHEN destaque = 1 THEN 1 ELSE 0 END) as destaque,
        SUM(visualizacoes) as visualizacoes_total
      FROM imoveis
    `).first()

    // Propostas por status
    const propostas = await DB.prepare(`
      SELECT status, COUNT(*) as total 
      FROM propostas 
      GROUP BY status
    `).all()

    // Visitas por status
    const visitas = await DB.prepare(`
      SELECT status, COUNT(*) as total 
      FROM visitas 
      GROUP BY status
    `).all()

    // Últimos registros (últimos 30 dias)
    const ultimos30dias = await DB.prepare(`
      SELECT 
        DATE(created_at) as data,
        COUNT(*) as novos_usuarios
      FROM usuarios
      WHERE created_at >= date('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY data DESC
    `).all()

    return c.json({
      success: true,
      data: {
        usuarios: usuarios.results,
        imoveis: imoveis,
        propostas: propostas.results,
        visitas: visitas.results,
        crescimento: ultimos30dias.results
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao buscar estatísticas',
      error: error.message 
    }, 500)
  }
})

// ============================================
// GERENCIAMENTO DE USUÁRIOS
// ============================================

// Listar todos os usuários com filtros
admin.get('/usuarios', async (c) => {
  try {
    const { DB } = c.env
    const tipo = c.req.query('tipo')
    const ativo = c.req.query('ativo')
    const search = c.req.query('search')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM usuarios WHERE 1=1'
    const params: any[] = []

    if (tipo) {
      query += ' AND tipo = ?'
      params.push(tipo)
    }

    if (ativo !== undefined) {
      query += ' AND ativo = ?'
      params.push(parseInt(ativo))
    }

    if (search) {
      query += ' AND (nome_completo LIKE ? OR email LIKE ? OR cpf_cnpj LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const usuarios = await DB.prepare(query).bind(...params).all()

    // Contar total para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM usuarios WHERE 1=1'
    const countParams: any[] = []

    if (tipo) {
      countQuery += ' AND tipo = ?'
      countParams.push(tipo)
    }
    if (ativo !== undefined) {
      countQuery += ' AND ativo = ?'
      countParams.push(parseInt(ativo))
    }
    if (search) {
      countQuery += ' AND (nome_completo LIKE ? OR email LIKE ? OR cpf_cnpj LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: usuarios.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar usuários',
      error: error.message 
    }, 500)
  }
})

// Atualizar usuário (ativar/desativar, mudar tipo, etc)
admin.put('/usuarios/:id', async (c) => {
  try {
    const { DB } = c.env
    const userId = c.req.param('id')
    const { tipo, ativo, documentos_verificados } = await c.req.json()

    const updates: string[] = []
    const params: any[] = []

    if (tipo !== undefined) {
      updates.push('tipo = ?')
      params.push(tipo)
    }
    if (ativo !== undefined) {
      updates.push('ativo = ?')
      params.push(ativo ? 1 : 0)
    }
    if (documentos_verificados !== undefined) {
      updates.push('documentos_verificados = ?')
      params.push(documentos_verificados ? 1 : 0)
    }

    if (updates.length === 0) {
      return c.json({ success: false, message: 'Nenhum campo para atualizar' }, 400)
    }

    updates.push('updated_at = datetime("now")')
    params.push(userId)

    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`
    const result = await DB.prepare(query).bind(...params).run()

    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'Usuário não encontrado' }, 404)
    }

    return c.json({
      success: true,
      message: 'Usuário atualizado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao atualizar usuário',
      error: error.message 
    }, 500)
  }
})

// Deletar usuário
admin.delete('/usuarios/:id', async (c) => {
  try {
    const { DB } = c.env
    const userId = c.req.param('id')

    const result = await DB.prepare('DELETE FROM usuarios WHERE id = ?')
      .bind(userId)
      .run()

    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'Usuário não encontrado' }, 404)
    }

    return c.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao deletar usuário',
      error: error.message 
    }, 500)
  }
})

// ============================================
// GERENCIAMENTO DE IMÓVEIS
// ============================================

// Listar todos os imóveis com filtros avançados
admin.get('/imoveis', async (c) => {
  try {
    const { DB } = c.env
    const disponivel = c.req.query('disponivel')
    const destaque = c.req.query('destaque')
    const tipo = c.req.query('tipo')
    const search = c.req.query('search')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT i.*, u.nome_completo as proprietario_nome, u.email as proprietario_email 
      FROM imoveis i
      LEFT JOIN usuarios u ON i.proprietario_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (disponivel !== undefined) {
      query += ' AND i.disponivel = ?'
      params.push(parseInt(disponivel))
    }

    if (destaque !== undefined) {
      query += ' AND i.destaque = ?'
      params.push(parseInt(destaque))
    }

    if (tipo) {
      query += ' AND i.tipo = ?'
      params.push(tipo)
    }

    if (search) {
      query += ' AND (i.titulo LIKE ? OR i.endereco_cidade LIKE ? OR i.endereco_bairro LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const imoveis = await DB.prepare(query).bind(...params).all()

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM imoveis WHERE 1=1'
    const countParams: any[] = []

    if (disponivel !== undefined) {
      countQuery += ' AND disponivel = ?'
      countParams.push(parseInt(disponivel))
    }
    if (destaque !== undefined) {
      countQuery += ' AND destaque = ?'
      countParams.push(parseInt(destaque))
    }
    if (tipo) {
      countQuery += ' AND tipo = ?'
      countParams.push(tipo)
    }
    if (search) {
      countQuery += ' AND (titulo LIKE ? OR endereco_cidade LIKE ? OR endereco_bairro LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: imoveis.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar imóveis:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar imóveis',
      error: error.message 
    }, 500)
  }
})

// Atualizar imóvel (disponibilidade, destaque, etc)
admin.put('/imoveis/:id', async (c) => {
  try {
    const { DB } = c.env
    const imovelId = c.req.param('id')
    const { disponivel, destaque } = await c.req.json()

    const updates: string[] = []
    const params: any[] = []

    if (disponivel !== undefined) {
      updates.push('disponivel = ?')
      params.push(disponivel ? 1 : 0)
    }
    if (destaque !== undefined) {
      updates.push('destaque = ?')
      params.push(destaque ? 1 : 0)
    }

    if (updates.length === 0) {
      return c.json({ success: false, message: 'Nenhum campo para atualizar' }, 400)
    }

    updates.push('updated_at = datetime("now")')
    params.push(imovelId)

    const query = `UPDATE imoveis SET ${updates.join(', ')} WHERE id = ?`
    const result = await DB.prepare(query).bind(...params).run()

    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'Imóvel não encontrado' }, 404)
    }

    return c.json({
      success: true,
      message: 'Imóvel atualizado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar imóvel:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao atualizar imóvel',
      error: error.message 
    }, 500)
  }
})

// Deletar imóvel
admin.delete('/imoveis/:id', async (c) => {
  try {
    const { DB } = c.env
    const imovelId = c.req.param('id')

    const result = await DB.prepare('DELETE FROM imoveis WHERE id = ?')
      .bind(imovelId)
      .run()

    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'Imóvel não encontrado' }, 404)
    }

    return c.json({
      success: true,
      message: 'Imóvel deletado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao deletar imóvel:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao deletar imóvel',
      error: error.message 
    }, 500)
  }
})

// ============================================
// GERENCIAMENTO DE PROPOSTAS
// ============================================

admin.get('/propostas', async (c) => {
  try {
    const { DB } = c.env
    const status = c.req.query('status')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        p.*,
        i.titulo as imovel_titulo,
        u.nome_completo as usuario_nome,
        prop.nome_completo as proprietario_nome
      FROM propostas p
      LEFT JOIN imoveis i ON p.imovel_id = i.id
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN usuarios prop ON p.proprietario_id = prop.id
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      query += ' AND p.status = ?'
      params.push(status)
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const propostas = await DB.prepare(query).bind(...params).all()

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM propostas WHERE 1=1'
    const countParams: any[] = []

    if (status) {
      countQuery += ' AND status = ?'
      countParams.push(status)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: propostas.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar propostas:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar propostas',
      error: error.message 
    }, 500)
  }
})

// ============================================
// GERENCIAMENTO DE VISITAS
// ============================================

admin.get('/visitas', async (c) => {
  try {
    const { DB } = c.env
    const status = c.req.query('status')
    const data = c.req.query('data')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        v.*,
        i.titulo as imovel_titulo,
        i.endereco_cidade as imovel_cidade,
        u.nome_completo as usuario_nome,
        prop.nome_completo as proprietario_nome
      FROM visitas v
      LEFT JOIN imoveis i ON v.imovel_id = i.id
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      LEFT JOIN usuarios prop ON v.proprietario_id = prop.id
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      query += ' AND v.status = ?'
      params.push(status)
    }

    if (data) {
      query += ' AND DATE(v.data_hora) = ?'
      params.push(data)
    }

    query += ' ORDER BY v.data_hora ASC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const visitas = await DB.prepare(query).bind(...params).all()

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM visitas WHERE 1=1'
    const countParams: any[] = []

    if (status) {
      countQuery += ' AND status = ?'
      countParams.push(status)
    }
    if (data) {
      countQuery += ' AND DATE(data_hora) = ?'
      countParams.push(data)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: visitas.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar visitas:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar visitas',
      error: error.message 
    }, 500)
  }
})

export default admin
