// DASHBOARD PROPRIETÁRIO - Story 4
// GoCasa360IT

class DashboardProprietario {
  constructor() {
    this.metrics = null;
    this.imoveis = [];
    this.visitas = [];
    this.init();
  }
  
  async init() {
    // Verificar se está logado
    const token = localStorage.getItem('token');
    if (!token) {
      this.showAlert('Você precisa estar logado', 'error');
      setTimeout(() => window.location.href = '/login', 2000);
      return;
    }
    
    // Carregar dados
    await Promise.all([
      this.loadMetrics(),
      this.loadImoveis(),
      this.loadVisitas()
    ]);
    
    // Renderizar
    this.renderMetrics();
    this.renderImoveis();
    this.renderVisitas();
    
    // Event listeners
    this.attachEventListeners();
  }
  
  async loadMetrics() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.metrics = data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      this.showAlert('Erro ao carregar métricas', 'error');
    }
  }
  
  async loadImoveis() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/imoveis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.imoveis = data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      this.showAlert('Erro ao carregar imóveis', 'error');
    }
  }
  
  async loadVisitas() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/visitas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.visitas = data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
      // Não mostrar erro se não houver visitas
    }
  }
  
  renderMetrics() {
    if (!this.metrics) return;
    
    const container = document.getElementById('metricsContainer');
    if (!container) return;
    
    const m = this.metrics;
    
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        ${this.renderMetricCard('Total de Imóveis', m.total_imoveis, 'building', 'primary', `/dashboard#imoveis`)}
        ${this.renderMetricCard('Visualizações (30d)', m.visualizacoes_30d, 'eye', 'secondary', null)}
        ${this.renderMetricCard('Favoritos', m.favoritos_total, 'heart', 'danger', null)}
        ${this.renderMetricCard('Visitas Agendadas', m.visitas_agendadas, 'calendar-check', 'success', `/dashboard#visitas`)}
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        ${this.renderSubMetricCard('Disponíveis', m.imoveis_disponiveis, 'check-circle', 'success')}
        ${this.renderSubMetricCard('Rascunhos', m.imoveis_rascunho, 'file', 'secondary')}
        ${this.renderSubMetricCard('Mensagens', m.mensagens_nao_lidas, 'envelope', m.mensagens_nao_lidas > 0 ? 'danger' : 'secondary')}
      </div>
    `;
  }
  
  renderMetricCard(title, value, icon, color, link) {
    const colorClasses = {
      primary: 'bg-blue-50 text-primary border-blue-200',
      secondary: 'bg-cyan-50 text-secondary border-cyan-200',
      danger: 'bg-red-50 text-danger border-red-200',
      success: 'bg-green-50 text-success border-green-200'
    };
    
    const cardContent = `
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 ${colorClasses[color]} hover:shadow-lg transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">${title}</p>
            <p class="text-3xl font-bold text-gray-900">${value}</p>
          </div>
          <div class="p-4 ${colorClasses[color]} rounded-full">
            <i class="fas fa-${icon} text-2xl"></i>
          </div>
        </div>
      </div>
    `;
    
    return link ? `<a href="${link}">${cardContent}</a>` : cardContent;
  }
  
  renderSubMetricCard(title, value, icon, color) {
    const colorClasses = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      danger: 'text-danger',
      success: 'text-success'
    };
    
    return `
      <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div class="flex items-center space-x-3">
          <i class="fas fa-${icon} text-xl ${colorClasses[color]}"></i>
          <div>
            <p class="text-sm text-gray-600">${title}</p>
            <p class="text-2xl font-bold text-gray-900">${value}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  renderImoveis() {
    const container = document.getElementById('imoveisContainer');
    if (!container) return;
    
    if (this.imoveis.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <i class="fas fa-home text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Nenhum imóvel cadastrado</h3>
          <p class="text-gray-600 mb-6">Comece anunciando seu primeiro imóvel</p>
          <a href="/cadastrar-imovel" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-plus mr-2"></i> Anunciar Imóvel
          </a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <div class="grid grid-cols-1 gap-6">
        ${this.imoveis.map(imovel => this.renderImovelCard(imovel)).join('')}
      </div>
    `;
  }
  
  renderImovelCard(imovel) {
    const statusConfig = {
      disponivel: { label: 'Disponível', color: 'bg-green-100 text-green-800 border-green-300', icon: 'check-circle' },
      pausado: { label: 'Pausado', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: 'pause-circle' },
      rascunho: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800 border-gray-300', icon: 'file' }
    };
    
    const status = statusConfig[imovel.status_display] || statusConfig.rascunho;
    const fotoCapa = imovel.foto_capa || (imovel.fotos && imovel.fotos[0]) || '';
    
    // Determinar preço exibido
    let preco = 'Não definido';
    if (imovel.finalidade === 'aluguel' && imovel.preco_aluguel) {
      preco = `€ ${parseFloat(imovel.preco_aluguel).toLocaleString('it-IT')}/mês`;
    } else if (imovel.finalidade === 'venda' && imovel.preco_venda) {
      preco = `€ ${parseFloat(imovel.preco_venda).toLocaleString('it-IT')}`;
    } else if (imovel.finalidade === 'ambos') {
      if (imovel.preco_aluguel) {
        preco = `€ ${parseFloat(imovel.preco_aluguel).toLocaleString('it-IT')}/mês`;
      } else if (imovel.preco_venda) {
        preco = `€ ${parseFloat(imovel.preco_venda).toLocaleString('it-IT')}`;
      }
    }
    
    return `
      <div class="bg-white rounded-lg shadow hover:shadow-lg transition">
        <div class="flex flex-col md:flex-row">
          <!-- Foto -->
          <div class="md:w-64 h-48 bg-gray-300 rounded-l-lg overflow-hidden flex-shrink-0">
            ${fotoCapa ? 
              `<img src="${fotoCapa}" alt="${imovel.titulo}" class="w-full h-full object-cover">` :
              `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-image text-5xl text-gray-400"></i></div>`
            }
          </div>
          
          <!-- Conteúdo -->
          <div class="flex-1 p-6">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-1">${imovel.titulo || 'Sem título'}</h3>
                <p class="text-sm text-gray-600">
                  <i class="fas fa-map-marker-alt mr-1"></i>
                  ${imovel.endereco_cidade || 'Localização não definida'}, ${imovel.endereco_bairro || ''}
                </p>
              </div>
              
              <span class="px-3 py-1 rounded-full text-xs font-semibold border ${status.color}">
                <i class="fas fa-${status.icon} mr-1"></i> ${status.label}
              </span>
            </div>
            
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              ${imovel.quartos ? `<span><i class="fas fa-bed mr-1"></i> ${imovel.quartos} quartos</span>` : ''}
              ${imovel.banheiros ? `<span><i class="fas fa-bath mr-1"></i> ${imovel.banheiros} banheiros</span>` : ''}
              ${imovel.area_util ? `<span><i class="fas fa-ruler-combined mr-1"></i> ${imovel.area_util} m²</span>` : ''}
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-2xl font-bold text-primary">${preco}</div>
              
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <span title="Visualizações"><i class="fas fa-eye mr-1"></i> ${imovel.visualizacoes || 0}</span>
                <span title="Favoritos"><i class="fas fa-heart mr-1"></i> ${imovel.favoritos_count || 0}</span>
                <span title="Mensagens"><i class="fas fa-envelope mr-1"></i> ${imovel.mensagens_count || 0}</span>
              </div>
            </div>
          </div>
          
          <!-- Ações -->
          <div class="flex md:flex-col items-center md:items-stretch gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-200">
            <a href="/imoveis/${imovel.id}" class="btn-action btn-primary" title="Ver Detalhes">
              <i class="fas fa-eye"></i>
            </a>
            <button onclick="dashboard.editarImovel('${imovel.id}')" class="btn-action btn-secondary" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="dashboard.toggleStatus('${imovel.id}', ${imovel.disponivel ? 'false' : 'true'})" 
                    class="btn-action ${imovel.disponivel ? 'btn-warning' : 'btn-success'}" 
                    title="${imovel.disponivel ? 'Pausar' : 'Reativar'}">
              <i class="fas fa-${imovel.disponivel ? 'pause' : 'play'}"></i>
            </button>
            <button onclick="dashboard.confirmarExclusao('${imovel.id}', '${imovel.titulo}')" class="btn-action btn-danger" title="Excluir">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  renderVisitas() {
    const container = document.getElementById('visitasContainer');
    if (!container) return;
    
    if (this.visitas.length === 0) {
      container.innerHTML = `
        <p class="text-gray-500 text-center py-8">Nenhuma visita agendada</p>
      `;
      return;
    }
    
    container.innerHTML = `
      <div class="space-y-4">
        ${this.visitas.map(visita => this.renderVisitaCard(visita)).join('')}
      </div>
    `;
  }
  
  renderVisitaCard(visita) {
    const dataHora = new Date(visita.data_hora);
    const dataFormatada = dataHora.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const horaFormatada = dataHora.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const statusColors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      realizada: 'bg-blue-100 text-blue-800'
    };
    
    return `
      <div class="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">${visita.imovel_titulo}</h4>
            <p class="text-sm text-gray-600 mb-2">
              <i class="fas fa-map-marker-alt mr-1"></i>
              ${visita.endereco_cidade}, ${visita.endereco_bairro}
            </p>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span><i class="fas fa-calendar mr-1"></i> ${dataFormatada}</span>
              <span><i class="fas fa-clock mr-1"></i> ${horaFormatada}</span>
            </div>
            <p class="text-sm text-gray-700 mt-2">
              <i class="fas fa-user mr-1"></i>
              <strong>${visita.inquilino_nome}</strong> - ${visita.inquilino_telefone}
            </p>
          </div>
          
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColors[visita.status] || statusColors.pendente}">
            ${visita.status}
          </span>
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    // Event listeners globais
  }
  
  async toggleStatus(imovelId, novoStatus) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/imoveis/${imovelId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ disponivel: novoStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.showAlert(data.message, 'success');
        // Recarregar dados
        await this.loadMetrics();
        await this.loadImoveis();
        this.renderMetrics();
        this.renderImoveis();
      } else {
        this.showAlert(data.error, 'error');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      this.showAlert('Erro ao alterar status do imóvel', 'error');
    }
  }
  
  editarImovel(imovelId) {
    // Por enquanto, redirecionar para wizard (futura: pré-preencher wizard com dados)
    window.location.href = `/cadastrar-imovel?edit=${imovelId}`;
  }
  
  confirmarExclusao(imovelId, titulo) {
    const modal = document.getElementById('modalExcluir');
    if (!modal) return;
    
    document.getElementById('modalExcluirTitulo').textContent = titulo;
    document.getElementById('btnConfirmarExclusao').onclick = () => this.excluirImovel(imovelId);
    
    modal.classList.remove('hidden');
  }
  
  async excluirImovel(imovelId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/imoveis/${imovelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.showAlert(data.message, 'success');
        // Fechar modal
        document.getElementById('modalExcluir').classList.add('hidden');
        // Recarregar dados
        await this.loadMetrics();
        await this.loadImoveis();
        this.renderMetrics();
        this.renderImoveis();
      } else {
        this.showAlert(data.error, 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      this.showAlert('Erro ao excluir imóvel', 'error');
    }
  }
  
  showAlert(message, type = 'info') {
    const alertDiv = document.getElementById('alert');
    if (!alertDiv) return;
    
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      info: 'info-circle'
    };
    
    alertDiv.className = `p-4 border rounded-lg ${colors[type]} mb-6`;
    alertDiv.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${icons[type]} mr-3 text-xl"></i>
        <span>${message}</span>
      </div>
    `;
    alertDiv.classList.remove('hidden');
    
    setTimeout(() => {
      alertDiv.classList.add('hidden');
    }, 5000);
  }
}

// Inicializar dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new DashboardProprietario();
});

// Funções globais para fechar modais
function fecharModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
}
