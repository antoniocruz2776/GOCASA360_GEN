import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const imoveis = new Hono<{ Bindings: Bindings }>()

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

// POST /api/imoveis - Cadastrar novo imóvel (proprietários)
imoveis.post('/', async (c) => {
  try {
    const { DB } = c.env
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'É necessário estar logado para cadastrar imóveis'
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
    
    if (usuario.tipo !== 'proprietario' && usuario.tipo !== 'corretor') {
      return c.json({
        success: false,
        error: 'Apenas proprietários e corretores podem cadastrar imóveis'
      }, 403)
    }
    
    const body = await c.req.json()
    const {
      titulo, descricao, tipo, finalidade,
      preco_aluguel, preco_venda, condominio, iptu,
      endereco_rua, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
      quartos, banheiros, vagas_garagem, area_util, area_total,
      mobiliado, pet_friendly, comodidades, foto_capa,
      destaque  // Nova flag de destaque
    } = body
    
    // Validações básicas
    if (!titulo || !tipo || !finalidade || !endereco_rua || !endereco_cidade || !endereco_estado) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: titulo, tipo, finalidade, endereço completo'
      }, 400)
    }
    
    // Validar tipo
    const tiposValidos = ['apartamento', 'casa', 'kitnet', 'cobertura', 'terreno', 'comercial', 'rural']
    if (!tiposValidos.includes(tipo)) {
      return c.json({
        success: false,
        error: 'Tipo inválido'
      }, 400)
    }
    
    // Validar finalidade
    const finalidadesValidas = ['aluguel', 'venda', 'ambos']
    if (!finalidadesValidas.includes(finalidade)) {
      return c.json({
        success: false,
        error: 'Finalidade inválida'
      }, 400)
    }
    
    // Criar imóvel
    const imovelId = generateId('imovel')
    await DB.prepare(`
      INSERT INTO imoveis (
        id, proprietario_id, titulo, descricao, tipo, finalidade,
        preco_aluguel, preco_venda, condominio, iptu,
        endereco_rua, endereco_numero, endereco_complemento,
        endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
        quartos, banheiros, vagas_garagem, area_util, area_total,
        mobiliado, pet_friendly, comodidades, foto_capa,
        destaque, disponivel
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, 1
      )
    `).bind(
      imovelId, usuario.usuario_id, titulo, descricao || null, tipo, finalidade,
      preco_aluguel || null, preco_venda || null, condominio || 0, iptu || 0,
      endereco_rua, endereco_numero, endereco_complemento || null,
      endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
      quartos || 0, banheiros || 0, vagas_garagem || 0, area_util || 0, area_total || 0,
      mobiliado ? 1 : 0, pet_friendly ? 1 : 0,
      comodidades ? JSON.stringify(comodidades) : null,
      foto_capa || null,
      destaque ? 1 : 0  // Salvar flag de destaque
    ).run()
    
    return c.json({
      success: true,
      message: 'Imóvel cadastrado com sucesso',
      data: {
        imovel_id: imovelId,
        titulo: titulo,
        destaque: destaque ? true : false
      }
    }, 201)
    
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error)
    return c.json({
      success: false,
      error: 'Erro ao cadastrar imóvel'
    }, 500)
  }
})

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


// PUT /api/imoveis/:id - Atualizar imóvel (proprietários)
imoveis.put('/:id', async (c) => {
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
    
    const imovelId = c.req.param('id')
    
    // Verificar se o imóvel existe e pertence ao usuário
    const imovel = await DB.prepare(`
      SELECT * FROM imoveis WHERE id = ?
    `).bind(imovelId).first()
    
    if (!imovel) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    if (imovel.proprietario_id !== usuario.id && usuario.tipo !== 'admin') {
      return c.json({
        success: false,
        error: 'Você não tem permissão para editar este imóvel'
      }, 403)
    }
    
    const body = await c.req.json()
    const {
      titulo, descricao, tipo, finalidade,
      preco_aluguel, preco_venda, condominio, iptu,
      endereco_rua, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
      endereco_latitude, endereco_longitude,
      quartos, banheiros, vagas_garagem, area_util, area_total,
      mobiliado, pet_friendly, comodidades, fotos, foto_capa,
      classe_energetica, disponivel, destaque
    } = body
    
    // Atualizar apenas campos fornecidos
    const updates = []
    const params = []
    
    if (titulo !== undefined) { updates.push('titulo = ?'); params.push(titulo) }
    if (descricao !== undefined) { updates.push('descricao = ?'); params.push(descricao) }
    if (tipo !== undefined) { updates.push('tipo = ?'); params.push(tipo) }
    if (finalidade !== undefined) { updates.push('finalidade = ?'); params.push(finalidade) }
    if (preco_aluguel !== undefined) { updates.push('preco_aluguel = ?'); params.push(preco_aluguel) }
    if (preco_venda !== undefined) { updates.push('preco_venda = ?'); params.push(preco_venda) }
    if (condominio !== undefined) { updates.push('condominio = ?'); params.push(condominio) }
    if (iptu !== undefined) { updates.push('iptu = ?'); params.push(iptu) }
    if (endereco_rua !== undefined) { updates.push('endereco_rua = ?'); params.push(endereco_rua) }
    if (endereco_numero !== undefined) { updates.push('endereco_numero = ?'); params.push(endereco_numero) }
    if (endereco_complemento !== undefined) { updates.push('endereco_complemento = ?'); params.push(endereco_complemento) }
    if (endereco_bairro !== undefined) { updates.push('endereco_bairro = ?'); params.push(endereco_bairro) }
    if (endereco_cidade !== undefined) { updates.push('endereco_cidade = ?'); params.push(endereco_cidade) }
    if (endereco_estado !== undefined) { updates.push('endereco_estado = ?'); params.push(endereco_estado) }
    if (endereco_cep !== undefined) { updates.push('endereco_cep = ?'); params.push(endereco_cep) }
    if (endereco_latitude !== undefined) { updates.push('endereco_latitude = ?'); params.push(endereco_latitude) }
    if (endereco_longitude !== undefined) { updates.push('endereco_longitude = ?'); params.push(endereco_longitude) }
    if (quartos !== undefined) { updates.push('quartos = ?'); params.push(quartos) }
    if (banheiros !== undefined) { updates.push('banheiros = ?'); params.push(banheiros) }
    if (vagas_garagem !== undefined) { updates.push('vagas_garagem = ?'); params.push(vagas_garagem) }
    if (area_util !== undefined) { updates.push('area_util = ?'); params.push(area_util) }
    if (area_total !== undefined) { updates.push('area_total = ?'); params.push(area_total) }
    if (mobiliado !== undefined) { updates.push('mobiliado = ?'); params.push(mobiliado ? 1 : 0) }
    if (pet_friendly !== undefined) { updates.push('pet_friendly = ?'); params.push(pet_friendly ? 1 : 0) }
    if (comodidades !== undefined) { updates.push('comodidades = ?'); params.push(comodidades) }
    if (fotos !== undefined) { updates.push('fotos = ?'); params.push(fotos) }
    if (foto_capa !== undefined) { updates.push('foto_capa = ?'); params.push(foto_capa) }
    if (classe_energetica !== undefined) { updates.push('classe_energetica = ?'); params.push(classe_energetica) }
    if (disponivel !== undefined) { updates.push('disponivel = ?'); params.push(disponivel ? 1 : 0) }
    if (destaque !== undefined) { updates.push('destaque = ?'); params.push(destaque ? 1 : 0) }
    
    updates.push('updated_at = datetime("now")')
    params.push(imovelId)
    
    const query = `
      UPDATE imoveis 
      SET ${updates.join(', ')}
      WHERE id = ?
    `
    
    await DB.prepare(query).bind(...params).run()
    
    // Buscar imóvel atualizado
    const imovelAtualizado = await DB.prepare(`
      SELECT * FROM imoveis WHERE id = ?
    `).bind(imovelId).first()
    
    return c.json({
      success: true,
      message: 'Imóvel atualizado com sucesso',
      data: {
        ...imovelAtualizado,
        comodidades: imovelAtualizado.comodidades ? JSON.parse(imovelAtualizado.comodidades) : [],
        fotos: imovelAtualizado.fotos ? JSON.parse(imovelAtualizado.fotos) : []
      }
    })
    
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    return c.json({
      success: false,
      error: 'Erro ao atualizar imóvel'
    }, 500)
  }
})

// DELETE /api/imoveis/:id - Deletar imóvel (proprietários)
imoveis.delete('/:id', async (c) => {
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
    
    const imovelId = c.req.param('id')
    
    // Verificar se o imóvel existe e pertence ao usuário
    const imovel = await DB.prepare(`
      SELECT * FROM imoveis WHERE id = ?
    `).bind(imovelId).first()
    
    if (!imovel) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    if (imovel.proprietario_id !== usuario.id && usuario.tipo !== 'admin') {
      return c.json({
        success: false,
        error: 'Você não tem permissão para excluir este imóvel'
      }, 403)
    }
    
    // Deletar imóvel (cascade delete irá remover favoritos, visitas, mensagens, propostas)
    await DB.prepare(`
      DELETE FROM imoveis WHERE id = ?
    `).bind(imovelId).run()
    
    return c.json({
      success: true,
      message: 'Imóvel excluído com sucesso'
    })
    
  } catch (error) {
    console.error('Erro ao deletar imóvel:', error)
    return c.json({
      success: false,
      error: 'Erro ao deletar imóvel'
    }, 500)
  }
})

// PATCH /api/imoveis/:id/status - Alterar status (disponível/pausado)
imoveis.patch('/:id/status', async (c) => {
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
    
    const imovelId = c.req.param('id')
    const { disponivel } = await c.req.json()
    
    // Verificar se o imóvel existe e pertence ao usuário
    const imovel = await DB.prepare(`
      SELECT * FROM imoveis WHERE id = ?
    `).bind(imovelId).first()
    
    if (!imovel) {
      return c.json({
        success: false,
        error: 'Imóvel não encontrado'
      }, 404)
    }
    
    if (imovel.proprietario_id !== usuario.id && usuario.tipo !== 'admin') {
      return c.json({
        success: false,
        error: 'Você não tem permissão para alterar este imóvel'
      }, 403)
    }
    
    await DB.prepare(`
      UPDATE imoveis 
      SET disponivel = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(disponivel ? 1 : 0, imovelId).run()
    
    return c.json({
      success: true,
      message: disponivel ? 'Imóvel ativado com sucesso' : 'Imóvel pausado com sucesso',
      data: { disponivel }
    })
    
  } catch (error) {
    console.error('Erro ao alterar status do imóvel:', error)
    return c.json({
      success: false,
      error: 'Erro ao alterar status do imóvel'
    }, 500)
  }
})

export default imoveis
