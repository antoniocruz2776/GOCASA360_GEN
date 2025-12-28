import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const propostas = new Hono<{ Bindings: Bindings }>()

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

// POST /api/propostas - Criar nova proposta
propostas.post('/', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'É necessário estar logado para fazer propostas'
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
    const { imovel_id, tipo, valor_proposto, mensagem } = body
    
    if (!imovel_id || !tipo || !valor_proposto) {
      return c.json({
        success: false,
        error: 'ID do imóvel, tipo e valor são obrigatórios'
      }, 400)
    }
    
    const tiposValidos = ['aluguel', 'compra']
    if (!tiposValidos.includes(tipo)) {
      return c.json({
        success: false,
        error: 'Tipo deve ser: aluguel ou compra'
      }, 400)
    }
    
    // Buscar imóvel e proprietário
    const imovel = await DB.prepare(`
      SELECT id, proprietario_id, titulo, finalidade, preco_aluguel, preco_venda 
      FROM imoveis WHERE id = ?
    `).bind(imovel_id).first()
    
    if (!imovel) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    // Validar tipo de proposta vs finalidade do imóvel
    if (tipo === 'aluguel' && imovel.finalidade === 'venda') {
      return c.json({
        success: false,
        error: 'Este imóvel está disponível apenas para venda'
      }, 400)
    }
    
    if (tipo === 'compra' && imovel.finalidade === 'aluguel') {
      return c.json({
        success: false,
        error: 'Este imóvel está disponível apenas para aluguel'
      }, 400)
    }
    
    // Criar proposta
    const propostaId = generateId('prop')
    await DB.prepare(`
      INSERT INTO propostas (
        id, imovel_id, usuario_id, proprietario_id, 
        tipo, valor_proposto, mensagem, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).bind(
      propostaId, 
      imovel_id, 
      usuario.usuario_id, 
      imovel.proprietario_id,
      tipo,
      valor_proposto,
      mensagem || null
    ).run()
    
    return c.json({
      success: true,
      message: 'Proposta enviada com sucesso',
      data: {
        proposta_id: propostaId,
        imovel_titulo: imovel.titulo,
        tipo: tipo,
        valor_proposto: valor_proposto,
        status: 'pendente'
      }
    }, 201)
    
  } catch (error) {
    console.error('Erro ao criar proposta:', error)
    return c.json({
      success: false,
      error: 'Erro ao criar proposta'
    }, 500)
  }
})

// GET /api/propostas - Listar propostas do usuário
propostas.get('/', async (c) => {
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
    
    // Buscar propostas (feitas ou recebidas)
    const result = await DB.prepare(`
      SELECT 
        p.*,
        i.titulo as imovel_titulo,
        i.foto_capa as imovel_foto,
        i.endereco_cidade, i.endereco_estado,
        u1.nome_completo as proponente_nome,
        u1.telefone as proponente_telefone,
        u1.email as proponente_email,
        u2.nome_completo as proprietario_nome
      FROM propostas p
      JOIN imoveis i ON p.imovel_id = i.id
      JOIN usuarios u1 ON p.usuario_id = u1.id
      JOIN usuarios u2 ON p.proprietario_id = u2.id
      WHERE p.usuario_id = ? OR p.proprietario_id = ?
      ORDER BY p.created_at DESC
    `).bind(usuario.usuario_id, usuario.usuario_id).all()
    
    return c.json({
      success: true,
      data: result.results
    })
    
  } catch (error) {
    console.error('Erro ao buscar propostas:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar propostas'
    }, 500)
  }
})

// PUT /api/propostas/:id - Responder a uma proposta (aceitar, recusar, contra-proposta)
propostas.put('/:id', async (c) => {
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
    
    const propostaId = c.req.param('id')
    const body = await c.req.json()
    const { status, valor_contra_proposta, mensagem_resposta } = body
    
    const statusValidos = ['pendente', 'aceita', 'recusada', 'contra_proposta']
    if (!status || !statusValidos.includes(status)) {
      return c.json({
        success: false,
        error: 'Status inválido'
      }, 400)
    }
    
    // Verificar se usuário é proprietário
    const proposta = await DB.prepare(`
      SELECT * FROM propostas WHERE id = ?
    `).bind(propostaId).first()
    
    if (!proposta) {
      return c.json({
        success: false,
        error: 'Proposta não encontrada'
      }, 404)
    }
    
    if (proposta.proprietario_id !== usuario.usuario_id) {
      return c.json({
        success: false,
        error: 'Apenas o proprietário pode responder à proposta'
      }, 403)
    }
    
    // Atualizar proposta
    await DB.prepare(`
      UPDATE propostas 
      SET status = ?, 
          valor_contra_proposta = ?,
          mensagem_resposta = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, valor_contra_proposta || null, mensagem_resposta || null, propostaId).run()
    
    return c.json({
      success: true,
      message: 'Proposta atualizada com sucesso',
      data: {
        proposta_id: propostaId,
        status: status
      }
    })
    
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error)
    return c.json({
      success: false,
      error: 'Erro ao atualizar proposta'
    }, 500)
  }
})

export default propostas
