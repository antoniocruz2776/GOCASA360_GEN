import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const imoveis = new Hono<{ Bindings: Bindings }>()

// GET /api/imoveis - Listar todos os imóveis
imoveis.get('/', async (c) => {
  try {
    const { DB } = c.env
    
    // Query parameters para filtros
    const finalidade = c.req.query('finalidade') // aluguel, venda, ambos
    const tipo = c.req.query('tipo') // apartamento, casa, etc
    const cidade = c.req.query('cidade')
    const estado = c.req.query('estado')
    const bairro = c.req.query('bairro')
    const precoMin = c.req.query('preco_min')
    const precoMax = c.req.query('preco_max')
    const quartos = c.req.query('quartos')
    const vagas = c.req.query('vagas')
    const petFriendly = c.req.query('pet_friendly')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '12')
    const offset = (page - 1) * limit

    // Construir query dinâmica
    let query = `
      SELECT 
        i.*,
        u.nome_completo as proprietario_nome,
        u.telefone as proprietario_telefone,
        u.email as proprietario_email
      FROM imoveis i
      LEFT JOIN usuarios u ON i.proprietario_id = u.id
      WHERE i.disponivel = 1
    `
    
    const params: any[] = []
    
    if (finalidade && finalidade !== 'todos') {
      query += ` AND (i.finalidade = ? OR i.finalidade = 'ambos')`
      params.push(finalidade)
    }
    
    if (tipo) {
      query += ` AND i.tipo = ?`
      params.push(tipo)
    }
    
    if (cidade) {
      query += ` AND LOWER(i.endereco_cidade) LIKE LOWER(?)`
      params.push(`%${cidade}%`)
    }
    
    if (estado) {
      query += ` AND UPPER(i.endereco_estado) = UPPER(?)`
      params.push(estado)
    }
    
    if (bairro) {
      query += ` AND LOWER(i.endereco_bairro) LIKE LOWER(?)`
      params.push(`%${bairro}%`)
    }
    
    if (precoMin && finalidade === 'aluguel') {
      query += ` AND i.preco_aluguel >= ?`
      params.push(parseFloat(precoMin))
    }
    
    if (precoMax && finalidade === 'aluguel') {
      query += ` AND i.preco_aluguel <= ?`
      params.push(parseFloat(precoMax))
    }
    
    if (precoMin && finalidade === 'venda') {
      query += ` AND i.preco_venda >= ?`
      params.push(parseFloat(precoMin))
    }
    
    if (precoMax && finalidade === 'venda') {
      query += ` AND i.preco_venda <= ?`
      params.push(parseFloat(precoMax))
    }
    
    if (quartos) {
      query += ` AND i.quartos >= ?`
      params.push(parseInt(quartos))
    }
    
    if (vagas) {
      query += ` AND i.vagas_garagem >= ?`
      params.push(parseInt(vagas))
    }
    
    if (petFriendly === '1') {
      query += ` AND i.pet_friendly = 1`
    }
    
    // Contar total de resultados
    const countQuery = `SELECT COUNT(*) as total FROM (${query})`
    const countResult = await DB.prepare(countQuery).bind(...params).first()
    const total = countResult?.total || 0
    
    // Adicionar ordenação e paginação
    query += ` ORDER BY i.destaque DESC, i.created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)
    
    const result = await DB.prepare(query).bind(...params).all()
    
    // Parse JSON fields
    const imoveis = result.results.map((imovel: any) => ({
      ...imovel,
      comodidades: imovel.comodidades ? JSON.parse(imovel.comodidades) : [],
      fotos: imovel.fotos ? JSON.parse(imovel.fotos) : []
    }))
    
    return c.json({
      success: true,
      data: imoveis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar imóveis'
    }, 500)
  }
})

// GET /api/imoveis/:id - Buscar imóvel por ID
imoveis.get('/:id', async (c) => {
  try {
    const { DB } = c.env
    const id = c.req.param('id')
    
    const query = `
      SELECT 
        i.*,
        u.nome_completo as proprietario_nome,
        u.telefone as proprietario_telefone,
        u.email as proprietario_email,
        u.foto_perfil as proprietario_foto
      FROM imoveis i
      LEFT JOIN usuarios u ON i.proprietario_id = u.id
      WHERE i.id = ?
    `
    
    const result = await DB.prepare(query).bind(id).first()
    
    if (!result) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    // Incrementar visualizações
    await DB.prepare(`
      UPDATE imoveis 
      SET visualizacoes = visualizacoes + 1 
      WHERE id = ?
    `).bind(id).run()
    
    // Parse JSON fields
    const imovel = {
      ...result,
      comodidades: result.comodidades ? JSON.parse(result.comodidades) : [],
      fotos: result.fotos ? JSON.parse(result.fotos) : []
    }
    
    return c.json({
      success: true,
      data: imovel
    })
    
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar imóvel'
    }, 500)
  }
})

// GET /api/imoveis/destaque/list - Listar imóveis em destaque
imoveis.get('/destaque/list', async (c) => {
  try {
    const { DB } = c.env
    const limit = parseInt(c.req.query('limit') || '6')
    
    const query = `
      SELECT 
        i.*,
        u.nome_completo as proprietario_nome
      FROM imoveis i
      LEFT JOIN usuarios u ON i.proprietario_id = u.id
      WHERE i.disponivel = 1 AND i.destaque = 1
      ORDER BY i.visualizacoes DESC, i.created_at DESC
      LIMIT ?
    `
    
    const result = await DB.prepare(query).bind(limit).all()
    
    const imoveis = result.results.map((imovel: any) => ({
      ...imovel,
      comodidades: imovel.comodidades ? JSON.parse(imovel.comodidades) : [],
      fotos: imovel.fotos ? JSON.parse(imovel.fotos) : []
    }))
    
    return c.json({
      success: true,
      data: imoveis
    })
    
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar imóveis em destaque'
    }, 500)
  }
})

export default imoveis
