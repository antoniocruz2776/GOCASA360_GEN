import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const dashboard = new Hono<{ Bindings: Bindings }>()

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

// GET /api/dashboard/metrics - Métricas do Dashboard do Proprietário
dashboard.get('/metrics', async (c) => {
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
    
    if (usuario.tipo !== 'proprietario' && usuario.tipo !== 'corretor') {
      return c.json({
        success: false,
        error: 'Apenas proprietários e corretores têm acesso ao dashboard'
      }, 403)
    }
    
    // 1. Total de imóveis do proprietário
    const totalImoveis = await DB.prepare(`
      SELECT COUNT(*) as total FROM imoveis 
      WHERE proprietario_id = ?
    `).bind(usuario.id).first()
    
    // 2. Total de imóveis disponíveis (não pausados)
    const imoveisDisponiveis = await DB.prepare(`
      SELECT COUNT(*) as total FROM imoveis 
      WHERE proprietario_id = ? AND disponivel = 1
    `).bind(usuario.id).first()
    
    // 3. Total de imóveis em rascunho
    const imoveisRascunho = await DB.prepare(`
      SELECT COUNT(*) as total FROM imoveis 
      WHERE proprietario_id = ? AND (descricao IS NULL OR descricao = '')
    `).bind(usuario.id).first()
    
    // 4. Visualizações totais (soma de todos os imóveis)
    const visualizacoesResult = await DB.prepare(`
      SELECT SUM(visualizacoes) as total FROM imoveis 
      WHERE proprietario_id = ?
    `).bind(usuario.id).first()
    const visualizacoes30d = visualizacoesResult?.total || 0
    
    // 5. Total de favoritos em todos os imóveis
    const favoritosResult = await DB.prepare(`
      SELECT COUNT(*) as total FROM favoritos 
      WHERE imovel_id IN (
        SELECT id FROM imoveis WHERE proprietario_id = ?
      )
    `).bind(usuario.id).first()
    const favoritosTotal = favoritosResult?.total || 0
    
    // 6. Visitas agendadas (futuras ou pendentes)
    const visitasResult = await DB.prepare(`
      SELECT COUNT(*) as total FROM visitas 
      WHERE proprietario_id = ? 
        AND status IN ('pendente', 'confirmada')
        AND data_hora >= datetime('now')
    `).bind(usuario.id).first()
    const visitasAgendadas = visitasResult?.total || 0
    
    // 7. Mensagens não lidas (destinatário é o proprietário)
    const mensagensResult = await DB.prepare(`
      SELECT COUNT(*) as total FROM mensagens 
      WHERE destinatario_id = ? AND lida = 0
    `).bind(usuario.id).first()
    const mensagensNaoLidas = mensagensResult?.total || 0
    
    // 8. Propostas pendentes
    const propostasResult = await DB.prepare(`
      SELECT COUNT(*) as total FROM propostas 
      WHERE proprietario_id = ? AND status = 'pendente'
    `).bind(usuario.id).first()
    const propostasPendentes = propostasResult?.total || 0
    
    // 9. Chart de visualizações (últimos 7 dias) - placeholder
    // Em produção, isso seria calculado por dia
    const chartViews = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      chartViews.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10 // Placeholder
      })
    }
    
    return c.json({
      success: true,
      data: {
        total_imoveis: totalImoveis?.total || 0,
        imoveis_disponiveis: imoveisDisponiveis?.total || 0,
        imoveis_rascunho: imoveisRascunho?.total || 0,
        visualizacoes_30d: visualizacoes30d,
        favoritos_total: favoritosTotal,
        visitas_agendadas: visitasAgendadas,
        mensagens_nao_lidas: mensagensNaoLidas,
        propostas_pendentes: propostasPendentes,
        chart_views: chartViews
      }
    })
    
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar métricas do dashboard'
    }, 500)
  }
})

// GET /api/dashboard/imoveis - Lista de imóveis do proprietário (incluindo rascunhos)
dashboard.get('/imoveis', async (c) => {
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
    
    // Buscar todos os imóveis do proprietário (incluindo rascunhos)
    const imoveis = await DB.prepare(`
      SELECT 
        i.*,
        (SELECT COUNT(*) FROM favoritos WHERE imovel_id = i.id) as favoritos_count,
        (SELECT COUNT(*) FROM visitas WHERE imovel_id = i.id) as visitas_count,
        (SELECT COUNT(*) FROM mensagens WHERE imovel_id = i.id AND lida = 0) as mensagens_count
      FROM imoveis i
      WHERE i.proprietario_id = ?
      ORDER BY i.created_at DESC
    `).bind(usuario.id).all()
    
    // Processar resultados
    const imoveisProcessados = imoveis.results.map((imovel: any) => ({
      ...imovel,
      comodidades: imovel.comodidades ? JSON.parse(imovel.comodidades) : [],
      fotos: imovel.fotos ? JSON.parse(imovel.fotos) : [],
      // Determinar status (disponível, pausado, rascunho)
      status_display: !imovel.descricao || imovel.descricao === '' ? 'rascunho' : 
                      imovel.disponivel ? 'disponivel' : 'pausado'
    }))
    
    return c.json({
      success: true,
      data: imoveisProcessados
    })
    
  } catch (error) {
    console.error('Erro ao buscar imóveis do dashboard:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar imóveis'
    }, 500)
  }
})

// GET /api/dashboard/visitas - Próximas visitas do proprietário
dashboard.get('/visitas', async (c) => {
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
    
    // Buscar próximas visitas (futuras e pendentes/confirmadas)
    const visitas = await DB.prepare(`
      SELECT 
        v.*,
        i.titulo as imovel_titulo,
        i.endereco_cidade,
        i.endereco_bairro,
        u.nome_completo as inquilino_nome,
        u.telefone as inquilino_telefone,
        u.email as inquilino_email
      FROM visitas v
      JOIN imoveis i ON v.imovel_id = i.id
      JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.proprietario_id = ?
        AND v.status IN ('pendente', 'confirmada')
        AND v.data_hora >= datetime('now')
      ORDER BY v.data_hora ASC
      LIMIT 10
    `).bind(usuario.id).all()
    
    return c.json({
      success: true,
      data: visitas.results
    })
    
  } catch (error) {
    console.error('Erro ao buscar visitas do dashboard:', error)
    return c.json({
      success: false,
      error: 'Erro ao buscar visitas'
    }, 500)
  }
})

export default dashboard
