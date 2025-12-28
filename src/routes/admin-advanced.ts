import { Hono } from 'hono'
import type { Context } from 'hono'
import { 
  requireAdmin, 
  requirePermission, 
  logAdminAction,
  createAdminNotification,
  isBlacklisted
} from '../utils/auth'

type Bindings = {
  DB: D1Database
}

const adminAdvanced = new Hono<{ Bindings: Bindings }>()

// Apply admin authentication middleware
adminAdvanced.use('/*', requireAdmin)

// ============================================
// SISTEMA DE DENÚNCIAS
// ============================================

// Listar denúncias
adminAdvanced.get('/denuncias', async (c) => {
  try {
    const { DB } = c.env
    const status = c.req.query('status')
    const tipo = c.req.query('tipo')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        d.*,
        u1.nome_completo as denunciante_nome,
        u1.email as denunciante_email,
        u2.nome_completo as denunciado_nome,
        u2.email as denunciado_email,
        admin.nome_completo as admin_nome
      FROM denuncias d
      LEFT JOIN usuarios u1 ON d.denunciante_id = u1.id
      LEFT JOIN usuarios u2 ON d.denunciado_id = u2.id
      LEFT JOIN usuarios admin ON d.admin_responsavel_id = admin.id
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      query += ' AND d.status = ?'
      params.push(status)
    }

    if (tipo) {
      query += ' AND d.tipo = ?'
      params.push(tipo)
    }

    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const denuncias = await DB.prepare(query).bind(...params).all()

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM denuncias WHERE 1=1'
    const countParams: any[] = []

    if (status) {
      countQuery += ' AND status = ?'
      countParams.push(status)
    }
    if (tipo) {
      countQuery += ' AND tipo = ?'
      countParams.push(tipo)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: denuncias.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar denúncias:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar denúncias',
      error: error.message 
    }, 500)
  }
})

// Atualizar status de denúncia
adminAdvanced.put('/denuncias/:id', async (c) => {
  try {
    const { DB } = c.env
    const denunciaId = c.req.param('id')
    const { status, resolucao } = await c.req.json()
    const user = c.get('user')

    const oldDenuncia = await DB.prepare('SELECT * FROM denuncias WHERE id = ?')
      .bind(denunciaId)
      .first()

    if (!oldDenuncia) {
      return c.json({ success: false, message: 'Denúncia não encontrada' }, 404)
    }

    await DB.prepare(`
      UPDATE denuncias 
      SET status = ?, resolucao = ?, admin_responsavel_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, resolucao, user.userId, denunciaId).run()

    // Log da ação
    await logAdminAction(
      DB,
      user.userId,
      'update',
      'denuncia',
      denunciaId,
      oldDenuncia,
      { status, resolucao }
    )

    return c.json({
      success: true,
      message: 'Denúncia atualizada com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar denúncia:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao atualizar denúncia',
      error: error.message 
    }, 500)
  }
})

// Criar denúncia (endpoint público - não requer admin)
adminAdvanced.post('/denuncias/criar', async (c) => {
  try {
    const { DB } = c.env
    const { tipo, denunciante_id, denunciado_id, resource_id, motivo, descricao, evidencias } = await c.req.json()

    const id = `denuncia-${Date.now()}-${Math.random().toString(36).substring(7)}`

    await DB.prepare(`
      INSERT INTO denuncias (id, tipo, denunciante_id, denunciado_id, resource_id, motivo, descricao, evidencias, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).bind(id, tipo, denunciante_id, denunciado_id, resource_id, motivo, descricao, evidencias ? JSON.stringify(evidencias) : null).run()

    // Criar notificação para admins
    await createAdminNotification(
      DB,
      'nova_denuncia',
      'Nova Denúncia Recebida',
      `Denúncia de ${tipo}: ${motivo}`,
      `/admin#denuncias`,
      'alta'
    )

    return c.json({
      success: true,
      message: 'Denúncia criada com sucesso',
      data: { id }
    })
  } catch (error: any) {
    console.error('Erro ao criar denúncia:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao criar denúncia',
      error: error.message 
    }, 500)
  }
})

// ============================================
// SISTEMA DE APROVAÇÃO DE IMÓVEIS
// ============================================

// Listar imóveis pendentes de aprovação
adminAdvanced.get('/aprovacoes', async (c) => {
  try {
    const { DB } = c.env
    const status = c.req.query('status') || 'pendente'
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    const query = `
      SELECT 
        ap.*,
        i.titulo as imovel_titulo,
        i.endereco_cidade,
        i.preco_aluguel,
        i.preco_venda,
        u.nome_completo as proprietario_nome,
        admin.nome_completo as admin_nome
      FROM aprovacao_imoveis ap
      JOIN imoveis i ON ap.imovel_id = i.id
      JOIN usuarios u ON i.proprietario_id = u.id
      LEFT JOIN usuarios admin ON ap.admin_id = admin.id
      WHERE ap.status = ?
      ORDER BY ap.created_at DESC
      LIMIT ? OFFSET ?
    `

    const aprovacoes = await DB.prepare(query).bind(status, limit, offset).all()

    // Contar total
    const countResult = await DB.prepare(
      'SELECT COUNT(*) as total FROM aprovacao_imoveis WHERE status = ?'
    ).bind(status).first()

    return c.json({
      success: true,
      data: aprovacoes.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar aprovações:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar aprovações',
      error: error.message 
    }, 500)
  }
})

// Aprovar/Rejeitar imóvel
adminAdvanced.put('/aprovacoes/:id', async (c) => {
  try {
    const { DB } = c.env
    const aprovacaoId = c.req.param('id')
    const { status, motivo_rejeicao, observacoes } = await c.req.json()
    const user = c.get('user')

    const aprovacao = await DB.prepare('SELECT * FROM aprovacao_imoveis WHERE id = ?')
      .bind(aprovacaoId)
      .first()

    if (!aprovacao) {
      return c.json({ success: false, message: 'Aprovação não encontrada' }, 404)
    }

    await DB.prepare(`
      UPDATE aprovacao_imoveis 
      SET status = ?, motivo_rejeicao = ?, observacoes = ?, admin_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, motivo_rejeicao, observacoes, user.userId, aprovacaoId).run()

    // Se aprovado, atualizar imóvel para disponível
    if (status === 'aprovado') {
      await DB.prepare('UPDATE imoveis SET disponivel = 1 WHERE id = ?')
        .bind(aprovacao.imovel_id)
        .run()
    }

    // Log da ação
    await logAdminAction(
      DB,
      user.userId,
      status === 'aprovado' ? 'approve' : 'reject',
      'imovel',
      aprovacao.imovel_id as string,
      aprovacao,
      { status, motivo_rejeicao, observacoes }
    )

    // Notificar proprietário
    const imovel = await DB.prepare('SELECT proprietario_id FROM imoveis WHERE id = ?')
      .bind(aprovacao.imovel_id)
      .first()

    if (imovel) {
      await createAdminNotification(
        DB,
        'imovel_pendente',
        status === 'aprovado' ? 'Imóvel Aprovado' : 'Imóvel Rejeitado',
        status === 'aprovado' 
          ? 'Seu imóvel foi aprovado e está disponível para visualização'
          : `Seu imóvel foi rejeitado. Motivo: ${motivo_rejeicao}`,
        `/imovel/${aprovacao.imovel_id}`,
        'alta',
        imovel.proprietario_id as string
      )
    }

    return c.json({
      success: true,
      message: `Imóvel ${status === 'aprovado' ? 'aprovado' : 'rejeitado'} com sucesso`
    })
  } catch (error: any) {
    console.error('Erro ao atualizar aprovação:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao atualizar aprovação',
      error: error.message 
    }, 500)
  }
})

// ============================================
// SISTEMA DE BLACKLIST
// ============================================

// Listar blacklist
adminAdvanced.get('/blacklist', async (c) => {
  try {
    const { DB } = c.env
    const tipo = c.req.query('tipo')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        b.*,
        u.nome_completo as admin_nome
      FROM blacklist b
      LEFT JOIN usuarios u ON b.admin_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (tipo) {
      query += ' AND b.tipo = ?'
      params.push(tipo)
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const blacklist = await DB.prepare(query).bind(...params).all()

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM blacklist WHERE 1=1'
    const countParams: any[] = []

    if (tipo) {
      countQuery += ' AND tipo = ?'
      countParams.push(tipo)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: blacklist.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar blacklist:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar blacklist',
      error: error.message 
    }, 500)
  }
})

// Adicionar à blacklist
adminAdvanced.post('/blacklist', async (c) => {
  try {
    const { DB } = c.env
    const { tipo, valor, motivo, permanente, data_expiracao } = await c.req.json()
    const user = c.get('user')

    const id = `blacklist-${Date.now()}-${Math.random().toString(36).substring(7)}`

    await DB.prepare(`
      INSERT INTO blacklist (id, tipo, valor, motivo, admin_id, permanente, data_expiracao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, tipo, valor, motivo, user.userId, permanente ? 1 : 0, data_expiracao).run()

    // Log da ação
    await logAdminAction(
      DB,
      user.userId,
      'block',
      'blacklist',
      id,
      null,
      { tipo, valor, motivo, permanente }
    )

    return c.json({
      success: true,
      message: 'Adicionado à blacklist com sucesso',
      data: { id }
    })
  } catch (error: any) {
    console.error('Erro ao adicionar à blacklist:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao adicionar à blacklist',
      error: error.message 
    }, 500)
  }
})

// Remover da blacklist
adminAdvanced.delete('/blacklist/:id', async (c) => {
  try {
    const { DB } = c.env
    const blacklistId = c.req.param('id')
    const user = c.get('user')

    const item = await DB.prepare('SELECT * FROM blacklist WHERE id = ?')
      .bind(blacklistId)
      .first()

    if (!item) {
      return c.json({ success: false, message: 'Item não encontrado' }, 404)
    }

    await DB.prepare('DELETE FROM blacklist WHERE id = ?')
      .bind(blacklistId)
      .run()

    // Log da ação
    await logAdminAction(
      DB,
      user.userId,
      'unblock',
      'blacklist',
      blacklistId,
      item,
      null
    )

    return c.json({
      success: true,
      message: 'Removido da blacklist com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao remover da blacklist:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao remover da blacklist',
      error: error.message 
    }, 500)
  }
})

// ============================================
// NOTIFICAÇÕES ADMIN
// ============================================

// Listar notificações
adminAdvanced.get('/notificacoes', async (c) => {
  try {
    const { DB } = c.env
    const user = c.get('user')
    const lida = c.req.query('lida')
    const prioridade = c.req.query('prioridade')
    const limit = parseInt(c.req.query('limit') || '50')

    let query = `
      SELECT * FROM notificacoes_admin 
      WHERE (admin_id = ? OR admin_id IS NULL)
    `
    const params: any[] = [user.userId]

    if (lida !== undefined) {
      query += ' AND lida = ?'
      params.push(parseInt(lida))
    }

    if (prioridade) {
      query += ' AND prioridade = ?'
      params.push(prioridade)
    }

    query += ' ORDER BY created_at DESC LIMIT ?'
    params.push(limit)

    const notificacoes = await DB.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      data: notificacoes.results
    })
  } catch (error: any) {
    console.error('Erro ao listar notificações:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar notificações',
      error: error.message 
    }, 500)
  }
})

// Marcar notificação como lida
adminAdvanced.put('/notificacoes/:id/lida', async (c) => {
  try {
    const { DB } = c.env
    const notifId = c.req.param('id')

    await DB.prepare('UPDATE notificacoes_admin SET lida = 1 WHERE id = ?')
      .bind(notifId)
      .run()

    return c.json({
      success: true,
      message: 'Notificação marcada como lida'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar notificação:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao atualizar notificação',
      error: error.message 
    }, 500)
  }
})

// ============================================
// AUDIT LOGS
// ============================================

// Listar logs de auditoria
adminAdvanced.get('/audit-logs', async (c) => {
  try {
    const { DB } = c.env
    const adminId = c.req.query('admin_id')
    const resourceType = c.req.query('resource_type')
    const actionType = c.req.query('action_type')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        a.*,
        u.nome_completo as admin_nome,
        u.email as admin_email
      FROM audit_logs a
      LEFT JOIN usuarios u ON a.admin_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (adminId) {
      query += ' AND a.admin_id = ?'
      params.push(adminId)
    }

    if (resourceType) {
      query += ' AND a.resource_type = ?'
      params.push(resourceType)
    }

    if (actionType) {
      query += ' AND a.action_type = ?'
      params.push(actionType)
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const logs = await DB.prepare(query).bind(...params).all()

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM audit_logs WHERE 1=1'
    const countParams: any[] = []

    if (adminId) {
      countQuery += ' AND admin_id = ?'
      countParams.push(adminId)
    }
    if (resourceType) {
      countQuery += ' AND resource_type = ?'
      countParams.push(resourceType)
    }
    if (actionType) {
      countQuery += ' AND action_type = ?'
      countParams.push(actionType)
    }

    const countResult = await DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      success: true,
      data: logs.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro ao listar logs:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar logs',
      error: error.message 
    }, 500)
  }
})

// ============================================
// PERMISSÕES E ROLES
// ============================================

// Listar todas as permissões disponíveis
adminAdvanced.get('/permissoes', async (c) => {
  try {
    const { DB } = c.env

    const permissoes = await DB.prepare('SELECT * FROM admin_permissoes ORDER BY nome')
      .all()

    return c.json({
      success: true,
      data: permissoes.results
    })
  } catch (error: any) {
    console.error('Erro ao listar permissões:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao listar permissões',
      error: error.message 
    }, 500)
  }
})

// Conceder permissão a um usuário
adminAdvanced.post('/usuarios/:userId/permissoes', async (c) => {
  try {
    const { DB } = c.env
    const userId = c.req.param('userId')
    const { permissao_id } = await c.req.json()
    const user = c.get('user')

    const id = `user-perm-${Date.now()}-${Math.random().toString(36).substring(7)}`

    await DB.prepare(`
      INSERT INTO usuarios_permissoes (id, usuario_id, permissao_id, concedido_por)
      VALUES (?, ?, ?, ?)
    `).bind(id, userId, permissao_id, user.userId).run()

    // Log da ação
    await logAdminAction(
      DB,
      user.userId,
      'grant_permission',
      'user',
      userId,
      null,
      { permissao_id }
    )

    return c.json({
      success: true,
      message: 'Permissão concedida com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao conceder permissão:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao conceder permissão',
      error: error.message 
    }, 500)
  }
})

// Revogar permissão de um usuário
adminAdvanced.delete('/usuarios/:userId/permissoes/:permissaoId', async (c) => {
  try {
    const { DB } = c.env
    const userId = c.req.param('userId')
    const permissaoId = c.req.param('permissaoId')
    const user = c.get('user')

    await DB.prepare('DELETE FROM usuarios_permissoes WHERE usuario_id = ? AND permissao_id = ?')
      .bind(userId, permissaoId)
      .run()

    // Log da ação
    await logAdminAction(
      DB,
      user.userId,
      'revoke_permission',
      'user',
      userId,
      { permissao_id: permissaoId },
      null
    )

    return c.json({
      success: true,
      message: 'Permissão revogada com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao revogar permissão:', error)
    return c.json({ 
      success: false, 
      message: 'Erro ao revogar permissão',
      error: error.message 
    }, 500)
  }
})

export default adminAdvanced
