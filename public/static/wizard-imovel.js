// WIZARD DE CADASTRO DE IMÓVEL - 5 ETAPAS
// GoCasa360IT - Story 1 do DoR

class WizardImovel {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = {
      // Etapa 1: Tipo + Endereço
      tipo: '',
      finalidade: '',
      titulo: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_complemento: '',
      endereco_bairro: '',
      endereco_cidade: '',
      endereco_estado: '',
      endereco_cep: '',
      endereco_latitude: null,
      endereco_longitude: null,
      
      // Etapa 2: Características
      quartos: 0,
      banheiros: 0,
      vagas_garagem: 0,
      area_util: 0,
      area_total: 0,
      mobiliado: false,
      pet_friendly: false,
      comodidades: [],
      
      // Etapa 3: Fotos
      fotos: [],
      foto_capa: '',
      
      // Etapa 4: Certificações
      classe_energetica: '',
      condominio: 0,
      iptu: 0,
      
      // Etapa 5: Valores + Descrição
      preco_aluguel: null,
      preco_venda: null,
      descricao: '',
      disponivel: true,
      destaque: false
    };
    
    this.init();
  }
  
  init() {
    this.renderWizard();
    this.attachEventListeners();
    this.updateProgressBar();
  }
  
  renderWizard() {
    const container = document.getElementById('wizardContainer');
    if (!container) return;
    
    container.innerHTML = `
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Etapa <span id="currentStepNum">${this.currentStep}</span> de ${this.totalSteps}</span>
          <span class="text-sm font-medium text-primary"><span id="progressPercent">20</span>%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div id="progressBar" class="bg-primary h-2.5 rounded-full transition-all duration-300" style="width: 20%"></div>
        </div>
        
        <!-- Step Indicators -->
        <div class="flex justify-between mt-4">
          ${Array.from({length: this.totalSteps}, (_, i) => i + 1).map(step => `
            <div class="flex flex-col items-center step-indicator ${step === this.currentStep ? 'active' : ''} ${step < this.currentStep ? 'completed' : ''}" data-step="${step}">
              <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === this.currentStep ? 'border-primary bg-primary text-white' : step < this.currentStep ? 'border-success bg-success text-white' : 'border-gray-300 bg-white text-gray-400'}">
                ${step < this.currentStep ? '<i class="fas fa-check"></i>' : step}
              </div>
              <span class="text-xs mt-1 ${step === this.currentStep ? 'text-primary font-bold' : 'text-gray-500'}">${this.getStepLabel(step)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Step Content -->
      <div id="stepContent" class="mb-8">
        ${this.renderStep(this.currentStep)}
      </div>
      
      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center pt-6 border-t">
        <button type="button" id="btnVoltar" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition ${this.currentStep === 1 ? 'invisible' : ''}">
          <i class="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        
        <div class="flex space-x-3">
          <button type="button" id="btnRascunho" class="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition">
            <i class="fas fa-save mr-2"></i> Salvar Rascunho
          </button>
          
          <button type="button" id="btnProximo" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
            ${this.currentStep === this.totalSteps ? '<i class="fas fa-check mr-2"></i> Publicar' : 'Próximo <i class="fas fa-arrow-right ml-2"></i>'}
          </button>
        </div>
      </div>
    `;
  }
  
  getStepLabel(step) {
    const labels = {
      1: 'Tipo',
      2: 'Características',
      3: 'Fotos',
      4: 'Certificações',
      5: 'Valores'
    };
    return labels[step] || '';
  }
  
  renderStep(step) {
    switch(step) {
      case 1: return this.renderStep1();
      case 2: return this.renderStep2();
      case 3: return this.renderStep3();
      case 4: return this.renderStep4();
      case 5: return this.renderStep5();
      default: return '';
    }
  }
  
  renderStep1() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Informações Básicas</h2>
          <p class="text-gray-600">Comece informando o tipo e localização do imóvel</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Imóvel *</label>
            <select id="tipo" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="kitnet">Kitnet/Studio</option>
              <option value="cobertura">Cobertura</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Finalidade *</label>
            <select id="finalidade" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              <option value="aluguel">Locazione (Aluguel)</option>
              <option value="venda">Vendita (Venda)</option>
              <option value="ambos">Entrambi (Ambos)</option>
            </select>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Título do Anúncio *</label>
            <input type="text" id="titulo" required maxlength="100" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="Ex: Appartamento moderno con 2 camere a Roma">
            <p class="text-xs text-gray-500 mt-1"><span id="tituloCount">0</span>/100 caracteres</p>
          </div>
        </div>
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Endereço</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Rua/Via *</label>
              <input type="text" id="endereco_rua" required 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                     placeholder="Via del Corso">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Número *</label>
              <input type="text" id="endereco_numero" required 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                     placeholder="123">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
              <input type="text" id="endereco_complemento" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                     placeholder="Apto 45, Bloco B">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">CEP/CAP *</label>
              <input type="text" id="endereco_cep" required maxlength="10"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                     placeholder="00100">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
              <input type="text" id="endereco_bairro" required 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                     placeholder="Centro Storico">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
              <input type="text" id="endereco_cidade" required 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                     placeholder="Roma">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado/Região *</label>
              <select id="endereco_estado" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                <option value="">Selecione...</option>
                <option value="Lazio">Lazio</option>
                <option value="Lombardia">Lombardia</option>
                <option value="Campania">Campania</option>
                <option value="Sicilia">Sicilia</option>
                <option value="Veneto">Veneto</option>
                <option value="Piemonte">Piemonte</option>
                <option value="Emilia-Romagna">Emilia-Romagna</option>
                <option value="Toscana">Toscana</option>
              </select>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <i class="fas fa-info-circle mr-2"></i>
              <strong>Nota:</strong> Integração com Google Maps será adicionada em breve (autocomplete de endereços)
            </p>
          </div>
        </div>
      </div>
    `;
  }
  
  renderStep2() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Características do Imóvel</h2>
          <p class="text-gray-600">Descreva as principais características</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quartos/Camere *</label>
            <select id="quartos" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}${n === 5 ? '+' : ''}</option>`).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Banheiros/Bagni *</label>
            <select id="banheiros" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}${n === 5 ? '+' : ''}</option>`).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Vagas Garagem</label>
            <select id="vagas_garagem" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}${n === 5 ? '+' : ''}</option>`).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Área Útil (m²) *</label>
            <input type="number" id="area_util" required min="1" max="10000" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="85">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Área Total (m²)</label>
            <input type="number" id="area_total" min="1" max="10000" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="100">
          </div>
        </div>
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Características Adicionais</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" id="mobiliado" class="w-5 h-5 text-primary">
              <div>
                <div class="font-medium text-gray-900">Mobiliado/Arredato</div>
                <div class="text-sm text-gray-500">Imóvel já possui móveis</div>
              </div>
            </label>
            
            <label class="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" id="pet_friendly" class="w-5 h-5 text-primary">
              <div>
                <div class="font-medium text-gray-900">Aceita Pets/Animali</div>
                <div class="text-sm text-gray-500">Permite animais de estimação</div>
              </div>
            </label>
          </div>
        </div>
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Comodidades/Comfort</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            ${[
              {id: 'ar_condicionado', icon: 'snowflake', label: 'Ar Condicionado'},
              {id: 'piscina', icon: 'swimming-pool', label: 'Piscina'},
              {id: 'academia', icon: 'dumbbell', label: 'Academia'},
              {id: 'elevador', icon: 'building', label: 'Elevador'},
              {id: 'portaria', icon: 'user-shield', label: 'Portaria 24h'},
              {id: 'playground', icon: 'child', label: 'Playground'},
              {id: 'churrasqueira', icon: 'fire', label: 'Churrasqueira'},
              {id: 'salao_festas', icon: 'glass-cheers', label: 'Salão de Festas'},
              {id: 'varanda', icon: 'door-open', label: 'Varanda'}
            ].map(item => `
              <label class="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" class="comodidade w-4 h-4 text-primary" data-id="${item.id}">
                <i class="fas fa-${item.icon} text-gray-600"></i>
                <span class="text-sm">${item.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderStep3() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Fotos do Imóvel</h2>
          <p class="text-gray-600">Adicione no mínimo 3 fotos de alta qualidade</p>
        </div>
        
        <div id="uploadArea" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-blue-50 transition cursor-pointer">
          <input type="file" id="fileInput" multiple accept="image/jpeg,image/png" class="hidden">
          <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
          <p class="text-lg font-medium text-gray-700 mb-2">Arraste fotos aqui ou clique para selecionar</p>
          <p class="text-sm text-gray-500">JPG ou PNG, máximo 10MB por foto</p>
          <p class="text-sm text-gray-500 mt-1">Mínimo 3 fotos, máximo 20 fotos</p>
        </div>
        
        <div id="photoGrid" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Fotos adicionadas aparecerão aqui -->
        </div>
        
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <strong>Integração Cloudflare R2:</strong> Upload real de fotos será implementado em breve. Por enquanto, use placeholders.
          </p>
        </div>
      </div>
    `;
  }
  
  renderStep4() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Certificações e Documentos</h2>
          <p class="text-gray-600">Informações sobre certificação energética e custos</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Classe Energética APE</label>
            <select id="classe_energetica" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              <option value="A+">A+ (Ottimo)</option>
              <option value="A">A (Eccellente)</option>
              <option value="B">B (Buono)</option>
              <option value="C">C (Medio)</option>
              <option value="D">D (Sufficiente)</option>
              <option value="E">E (Basso)</option>
              <option value="F">F (Molto Basso)</option>
              <option value="G">G (Scarso)</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Certificado de Desempenho Energético (APE)</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Spese Condominiali (€/mês)</label>
            <input type="number" id="condominio" min="0" max="10000" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="150">
            <p class="text-xs text-gray-500 mt-1">Despesas de condomínio mensais</p>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">IPTU/IMU Anual (€)</label>
            <input type="number" id="iptu" min="0" max="100000" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="800">
            <p class="text-xs text-gray-500 mt-1">Imposto Municipal Único (IMU) - valor anual</p>
          </div>
        </div>
        
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            <i class="fas fa-info-circle mr-2"></i>
            <strong>Informação:</strong> O certificado APE é obrigatório na Itália para anunciar imóveis. Esses dados aumentam a confiança dos interessados.
          </p>
        </div>
      </div>
    `;
  }
  
  renderStep5() {
    const finalidadeValue = this.formData.finalidade || '';
    const showAluguel = finalidadeValue === 'aluguel' || finalidadeValue === 'ambos';
    const showVenda = finalidadeValue === 'venda' || finalidadeValue === 'ambos';
    
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Valores e Descrição</h2>
          <p class="text-gray-600">Defina os preços e descreva o imóvel</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${showAluguel ? `
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preço Aluguel (€/mês) *</label>
            <input type="number" id="preco_aluguel" ${finalidadeValue === 'aluguel' ? 'required' : ''} min="1" max="100000" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="1200">
          </div>
          ` : ''}
          
          ${showVenda ? `
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preço Venda (€) *</label>
            <input type="number" id="preco_venda" ${finalidadeValue === 'venda' ? 'required' : ''} min="1" max="10000000" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                   placeholder="350000">
          </div>
          ` : ''}
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada *</label>
          <textarea id="descricao" required minlength="100" maxlength="2000" rows="6"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Descreva o imóvel de forma detalhada e atrativa. Mencione diferenciais, proximidade de pontos de interesse, estado de conservação, etc."></textarea>
          <p class="text-xs text-gray-500 mt-1"><span id="descricaoCount">0</span>/2000 caracteres (mínimo 100)</p>
        </div>
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Preview do Anúncio</h3>
          
          <div id="preview" class="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div class="flex items-start space-x-4">
              <div class="w-48 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                <i class="fas fa-image text-gray-500 text-3xl"></i>
              </div>
              
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2" id="previewTitulo">Título do imóvel aparecerá aqui</h3>
                <p class="text-gray-600 text-sm mb-2" id="previewEndereco">Endereço completo aparecerá aqui</p>
                <div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span id="previewQuartos"><i class="fas fa-bed mr-1"></i> 0 quartos</span>
                  <span id="previewBanheiros"><i class="fas fa-bath mr-1"></i> 0 banheiros</span>
                  <span id="previewArea"><i class="fas fa-ruler-combined mr-1"></i> 0 m²</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-2xl font-bold text-primary" id="previewPreco">€ 0</span>
                  <span class="text-sm text-gray-500" id="previewFinalidade"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <input type="checkbox" id="disponivel" checked class="w-5 h-5 text-primary">
          <label for="disponivel" class="text-sm text-green-800">
            <i class="fas fa-check-circle mr-2"></i>
            <strong>Publicar como disponível</strong> - O imóvel ficará visível nas buscas imediatamente
          </label>
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    // Botão Próximo
    document.getElementById('btnProximo')?.addEventListener('click', () => {
      if (this.validateStep(this.currentStep)) {
        this.saveStepData(this.currentStep);
        
        if (this.currentStep === this.totalSteps) {
          this.submitForm(false); // Publicar
        } else {
          this.currentStep++;
          this.renderWizard();
          this.updateProgressBar();
          this.loadStepData(this.currentStep);
          window.scrollTo(0, 0);
        }
      }
    });
    
    // Botão Voltar
    document.getElementById('btnVoltar')?.addEventListener('click', () => {
      this.saveStepData(this.currentStep);
      this.currentStep--;
      this.renderWizard();
      this.updateProgressBar();
      this.loadStepData(this.currentStep);
      window.scrollTo(0, 0);
    });
    
    // Botão Salvar Rascunho
    document.getElementById('btnRascunho')?.addEventListener('click', () => {
      this.saveStepData(this.currentStep);
      this.submitForm(true); // Salvar como rascunho
    });
    
    // Event listeners específicos por etapa
    this.attachStepListeners(this.currentStep);
  }
  
  attachStepListeners(step) {
    switch(step) {
      case 1:
        // Contador de título
        document.getElementById('titulo')?.addEventListener('input', (e) => {
          document.getElementById('tituloCount').textContent = e.target.value.length;
        });
        break;
        
      case 2:
        // Checkboxes de comodidades
        document.querySelectorAll('.comodidade').forEach(checkbox => {
          checkbox.addEventListener('change', (e) => {
            const comodidadeId = e.target.dataset.id;
            if (e.target.checked) {
              if (!this.formData.comodidades.includes(comodidadeId)) {
                this.formData.comodidades.push(comodidadeId);
              }
            } else {
              this.formData.comodidades = this.formData.comodidades.filter(c => c !== comodidadeId);
            }
          });
        });
        break;
        
      case 3:
        // Upload de fotos (placeholder)
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea?.addEventListener('click', () => fileInput?.click());
        
        fileInput?.addEventListener('change', (e) => {
          const files = Array.from(e.target.files);
          this.handlePhotoUpload(files);
        });
        
        // Drag and drop
        uploadArea?.addEventListener('dragover', (e) => {
          e.preventDefault();
          uploadArea.classList.add('border-primary', 'bg-blue-50');
        });
        
        uploadArea?.addEventListener('dragleave', () => {
          uploadArea.classList.remove('border-primary', 'bg-blue-50');
        });
        
        uploadArea?.addEventListener('drop', (e) => {
          e.preventDefault();
          uploadArea.classList.remove('border-primary', 'bg-blue-50');
          const files = Array.from(e.dataTransfer.files);
          this.handlePhotoUpload(files);
        });
        break;
        
      case 5:
        // Contador de descrição
        document.getElementById('descricao')?.addEventListener('input', (e) => {
          document.getElementById('descricaoCount').textContent = e.target.value.length;
          this.updatePreview();
        });
        
        // Atualizar preview em tempo real
        ['titulo', 'quartos', 'banheiros', 'area_util', 'preco_aluguel', 'preco_venda'].forEach(fieldId => {
          const field = document.getElementById(fieldId);
          if (field) {
            field.addEventListener('input', () => this.updatePreview());
          }
        });
        
        // Inicializar preview
        this.updatePreview();
        break;
    }
  }
  
  handlePhotoUpload(files) {
    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.showAlert('Apenas arquivos JPG e PNG são permitidos', 'error');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.showAlert(`Arquivo ${file.name} muito grande (máximo 10MB)`, 'error');
        return false;
      }
      return true;
    });
    
    if (this.formData.fotos.length + validFiles.length > 20) {
      this.showAlert('Máximo de 20 fotos permitidas', 'error');
      return;
    }
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = {
          url: e.target.result,
          name: file.name,
          size: file.size
        };
        
        this.formData.fotos.push(photoData);
        
        // Se for a primeira foto, marcar como capa
        if (this.formData.fotos.length === 1) {
          this.formData.foto_capa = photoData.url;
        }
        
        this.renderPhotoGrid();
      };
      reader.readAsDataURL(file);
    });
  }
  
  renderPhotoGrid() {
    const grid = document.getElementById('photoGrid');
    if (!grid) return;
    
    grid.innerHTML = this.formData.fotos.map((photo, index) => `
      <div class="relative group">
        <img src="${photo.url}" alt="${photo.name}" class="w-full h-32 object-cover rounded-lg border-2 ${photo.url === this.formData.foto_capa ? 'border-primary' : 'border-gray-300'}">
        
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-lg flex items-center justify-center">
          <div class="opacity-0 group-hover:opacity-100 flex space-x-2">
            <button type="button" class="p-2 bg-white rounded-full hover:bg-gray-100" onclick="wizard.setPhotoCapa(${index})">
              <i class="fas fa-star text-yellow-500"></i>
            </button>
            <button type="button" class="p-2 bg-white rounded-full hover:bg-gray-100" onclick="wizard.removePhoto(${index})">
              <i class="fas fa-trash text-red-500"></i>
            </button>
          </div>
        </div>
        
        ${photo.url === this.formData.foto_capa ? '<div class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold"><i class="fas fa-star mr-1"></i> Capa</div>' : ''}
      </div>
    `).join('');
  }
  
  setPhotoCapa(index) {
    this.formData.foto_capa = this.formData.fotos[index].url;
    this.renderPhotoGrid();
  }
  
  removePhoto(index) {
    const isPhotoCapa = this.formData.fotos[index].url === this.formData.foto_capa;
    this.formData.fotos.splice(index, 1);
    
    // Se removeu a foto capa, marcar a primeira como nova capa
    if (isPhotoCapa && this.formData.fotos.length > 0) {
      this.formData.foto_capa = this.formData.fotos[0].url;
    }
    
    this.renderPhotoGrid();
  }
  
  updatePreview() {
    document.getElementById('previewTitulo').textContent = this.formData.titulo || 'Título do imóvel aparecerá aqui';
    
    const endereco = [
      this.formData.endereco_rua,
      this.formData.endereco_numero,
      this.formData.endereco_bairro,
      this.formData.endereco_cidade
    ].filter(Boolean).join(', ') || 'Endereço completo aparecerá aqui';
    document.getElementById('previewEndereco').textContent = endereco;
    
    document.getElementById('previewQuartos').innerHTML = `<i class="fas fa-bed mr-1"></i> ${this.formData.quartos} quartos`;
    document.getElementById('previewBanheiros').innerHTML = `<i class="fas fa-bath mr-1"></i> ${this.formData.banheiros} banheiros`;
    document.getElementById('previewArea').innerHTML = `<i class="fas fa-ruler-combined mr-1"></i> ${this.formData.area_util} m²`;
    
    let preco = 'Não definido';
    let finalidade = '';
    
    if (this.formData.finalidade === 'aluguel' && this.formData.preco_aluguel) {
      preco = `€ ${parseInt(this.formData.preco_aluguel).toLocaleString('it-IT')}`;
      finalidade = '/mês';
    } else if (this.formData.finalidade === 'venda' && this.formData.preco_venda) {
      preco = `€ ${parseInt(this.formData.preco_venda).toLocaleString('it-IT')}`;
      finalidade = '';
    } else if (this.formData.finalidade === 'ambos') {
      if (this.formData.preco_aluguel) {
        preco = `€ ${parseInt(this.formData.preco_aluguel).toLocaleString('it-IT')}`;
        finalidade = '/mês aluguel';
      }
    }
    
    document.getElementById('previewPreco').textContent = preco;
    document.getElementById('previewFinalidade').textContent = finalidade;
  }
  
  validateStep(step) {
    const requiredFields = {
      1: ['tipo', 'finalidade', 'titulo', 'endereco_rua', 'endereco_numero', 'endereco_cep', 'endereco_bairro', 'endereco_cidade', 'endereco_estado'],
      2: ['quartos', 'banheiros', 'area_util'],
      3: [], // Fotos são opcionais por enquanto (mínimo seria 3)
      4: [], // Certificações são opcionais
      5: ['descricao']
    };
    
    const fields = requiredFields[step] || [];
    const missing = [];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && !field.value) {
        missing.push(fieldId);
        field.classList.add('border-red-500');
      } else if (field) {
        field.classList.remove('border-red-500');
      }
    });
    
    // Validações específicas
    if (step === 3 && this.formData.fotos.length < 3) {
      this.showAlert('Adicione no mínimo 3 fotos do imóvel', 'error');
      return false;
    }
    
    if (step === 5) {
      const descricao = document.getElementById('descricao')?.value || '';
      if (descricao.length < 100) {
        this.showAlert('A descrição deve ter no mínimo 100 caracteres', 'error');
        document.getElementById('descricao')?.classList.add('border-red-500');
        return false;
      }
      
      // Validar preços baseado na finalidade
      if (this.formData.finalidade === 'aluguel' && !document.getElementById('preco_aluguel')?.value) {
        this.showAlert('Informe o preço de aluguel', 'error');
        return false;
      }
      
      if (this.formData.finalidade === 'venda' && !document.getElementById('preco_venda')?.value) {
        this.showAlert('Informe o preço de venda', 'error');
        return false;
      }
    }
    
    if (missing.length > 0) {
      this.showAlert('Preencha todos os campos obrigatórios marcados com *', 'error');
      return false;
    }
    
    return true;
  }
  
  saveStepData(step) {
    const fieldMap = {
      1: ['tipo', 'finalidade', 'titulo', 'endereco_rua', 'endereco_numero', 'endereco_complemento', 'endereco_bairro', 'endereco_cidade', 'endereco_estado', 'endereco_cep'],
      2: ['quartos', 'banheiros', 'vagas_garagem', 'area_util', 'area_total', 'mobiliado', 'pet_friendly'],
      3: [], // Fotos já são salvas em handlePhotoUpload
      4: ['classe_energetica', 'condominio', 'iptu'],
      5: ['preco_aluguel', 'preco_venda', 'descricao', 'disponivel']
    };
    
    const fields = fieldMap[step] || [];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        if (field.type === 'checkbox') {
          this.formData[fieldId] = field.checked;
        } else if (field.type === 'number') {
          this.formData[fieldId] = field.value ? parseFloat(field.value) : null;
        } else {
          this.formData[fieldId] = field.value;
        }
      }
    });
    
    // Salvar comodidades (Etapa 2)
    if (step === 2) {
      this.formData.comodidades = Array.from(document.querySelectorAll('.comodidade:checked')).map(cb => cb.dataset.id);
    }
  }
  
  loadStepData(step) {
    const fieldMap = {
      1: ['tipo', 'finalidade', 'titulo', 'endereco_rua', 'endereco_numero', 'endereco_complemento', 'endereco_bairro', 'endereco_cidade', 'endereco_estado', 'endereco_cep'],
      2: ['quartos', 'banheiros', 'vagas_garagem', 'area_util', 'area_total', 'mobiliado', 'pet_friendly'],
      3: [],
      4: ['classe_energetica', 'condominio', 'iptu'],
      5: ['preco_aluguel', 'preco_venda', 'descricao', 'disponivel']
    };
    
    const fields = fieldMap[step] || [];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && this.formData[fieldId] !== undefined) {
        if (field.type === 'checkbox') {
          field.checked = this.formData[fieldId];
        } else {
          field.value = this.formData[fieldId] || '';
        }
      }
    });
    
    // Carregar comodidades (Etapa 2)
    if (step === 2 && this.formData.comodidades) {
      this.formData.comodidades.forEach(comodidadeId => {
        const checkbox = document.querySelector(`.comodidade[data-id="${comodidadeId}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    
    // Carregar fotos (Etapa 3)
    if (step === 3) {
      this.renderPhotoGrid();
    }
    
    // Atualizar contadores e preview
    if (step === 1) {
      const titulo = document.getElementById('titulo');
      if (titulo) {
        document.getElementById('tituloCount').textContent = titulo.value.length;
      }
    }
    
    if (step === 5) {
      const descricao = document.getElementById('descricao');
      if (descricao) {
        document.getElementById('descricaoCount').textContent = descricao.value.length;
      }
      this.updatePreview();
    }
  }
  
  updateProgressBar() {
    const percent = (this.currentStep / this.totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressPercent').textContent = Math.round(percent);
    document.getElementById('currentStepNum').textContent = this.currentStep;
  }
  
  async submitForm(isDraft) {
    try {
      // Salvar dados da etapa atual
      this.saveStepData(this.currentStep);
      
      // Preparar payload
      const payload = {
        ...this.formData,
        comodidades: JSON.stringify(this.formData.comodidades),
        fotos: JSON.stringify(this.formData.fotos.map(f => f.url)),
        draft: isDraft
      };
      
      // Remover campos vazios
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === '' || payload[key] === undefined) {
          delete payload[key];
        }
      });
      
      const token = localStorage.getItem('token');
      if (!token) {
        this.showAlert('Você precisa estar logado para cadastrar um imóvel', 'error');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }
      
      const response = await fetch('/api/imoveis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.showAlert(
          isDraft ? 'Rascunho salvo com sucesso!' : 'Imóvel publicado com sucesso!',
          'success'
        );
        
        setTimeout(() => {
          // Redirecionar para dashboard ou página do imóvel
          window.location.href = isDraft ? '/dashboard' : `/imoveis/${data.data.id}`;
        }, 2000);
      } else {
        this.showAlert(data.message || 'Erro ao salvar imóvel', 'error');
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      this.showAlert('Erro ao comunicar com o servidor', 'error');
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
    
    alertDiv.className = `p-4 border rounded-lg ${colors[type]}`;
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

// Inicializar wizard quando página carregar
let wizard;
document.addEventListener('DOMContentLoaded', () => {
  wizard = new WizardImovel();
});
