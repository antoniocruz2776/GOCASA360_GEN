import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const visitas = new Hono<{ Bindings: Bindings }>()

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

// POST /api/visitas - Agendar uma visita
visitas.post('/', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'É necessário estar logado para agendar visitas'
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
    const { imovel_id, data_hora, observacoes } = body
    
    if (!imovel_id || !data_hora) {
      return c.json({
        success: false,
        error: 'ID do imóvel e data/hora são obrigatórios'
      }, 400)
    }
    
    // Buscar imóvel e proprietário
    const imovel = await DB.prepare(`
      SELECT id, proprietario_id, titulo FROM imoveis WHERE id = ?
    `).bind(imovel_id).first()
    
    if (!imovel) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    // Criar agendamento
    const visitaId = generateId('visita')
    await DB.prepare(`
      INSERT INTO visitas (
        id, imovel_id, usuario_id, proprietario_id, 
        data_hora, observacoes, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'pendente')
    `).bind(
      visitaId, 
      imovel_id, 
      usuario.usuario_id, 
      imovel.proprietario_id,
      data_hora,
      observacoes || null
    ).run()
    
    return c.json({
      success: true,
      message: 'Visita agendada com sucesso',
      data: {
        visita_id: visitaId,
        imovel_titulo: imovel.titulo,
        data_hora: data_hora,
        status: 'pendente'
      }
    }, 201)
    
  } catch (error) {
    console.error('Erro ao agendar visita:', error)
    return c.json({
      success: false,
      error: 'Erro ao agendar visita'
    }, 500)
  }
})

// GET /api/visitas - Listar visitas do usuário
visitas.get('/', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'É necessário estar logado'
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
    
    // Buscar visitas (como visitante ou como proprietário)
    const result = await DB.prepare(`
      SELECT 
        v.*,
        i.titulo as imovel_titulo,
        i.endereco_rua, i.endereco_numero, i.endereco_bairro,
        i.endereco_cidade, i.endereco_estado,
        u1.nome_completo as visitante_nome,
        u1.telefone as visitante_telefone,
        u2.nome_completo as proprietario_nome,
        u2.telefone as proprietario_telefone
      FROM visitas v
      JOIN imoveis i ON v.imovel_id = i.id
      JOIN usuarios u1 ON v.usuario_id = u1.id
      JOIN usuarios u2 ON v.proprietario_id = u2.id
      WHERE v.usuario_id = ? OR v.proprietario_id = ?
      ORDER BY v.data_hora DESC
    `).bind(usuario.usuario_id, usuario.usuario_id).all()
    
    return c.json({
      success: true,
      data: result.results
    })
    
  } catch (error) {
    console.error('Erro ao buscar visitas:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar visitas'
    }, 500)
  }
})

// PUT /api/visitas/:id - Atualizar status da visita
visitas.put('/:id', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'É necessário estar logado'
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
    
    const visitaId = c.req.param('id')
    const body = await c.req.json()
    const { status } = body
    
    const statusValidos = ['pendente', 'confirmada', 'cancelada', 'realizada']
    if (!status || !statusValidos.includes(status)) {
      return c.json({
        success: false,
        error: 'Status inválido'
      }, 400)
    }
    
    // Verificar se usuário é proprietário da visita
    const visita = await DB.prepare(`
      SELECT * FROM visitas WHERE id = ?
    `).bind(visitaId).first()
    
    if (!visita) {
      return c.json({
        success: false,
        error: 'Visita não encontrada'
      }, 404)
    }
    
    if (visita.proprietario_id !== usuario.usuario_id && visita.usuario_id !== usuario.usuario_id) {
      return c.json({
        success: false,
        error: 'Sem permissão para atualizar esta visita'
      }, 403)
    }
    
    // Atualizar status
    await DB.prepare(`
      UPDATE visitas SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, visitaId).run()
    
    return c.json({
      success: true,
      message: 'Status da visita atualizado',
      data: {
        visita_id: visitaId,
        status: status
      }
    })
    
  } catch (error) {
    console.error('Erro ao atualizar visita:', error)
    return c.json({
      success: false,
      error: 'Erro ao atualizar visita'
    }, 500)
  }
})

export default visitas
