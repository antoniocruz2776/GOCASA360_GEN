import { Hono } from 'hono'

const pages = new Hono()

// Página de listagem de imóveis
pages.get('/imoveis', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Buscar Imóveis - GOCASA360IT</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#2563eb',
                  secondary: '#0ea5e9',
                  accent: '#f59e0b',
                  dark: '#1e293b',
                  light: '#f1f5f9'
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
          
          .property-card {
            transition: all 0.3s ease;
          }
          
          .property-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          
          .skeleton {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
            background-size: 200% 100%;
          }
          
          @keyframes pulse {
            0%, 100% { background-position: 200% 0; }
            50% { background-position: 0 0; }
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="/" class="flex items-center space-x-2">
                        <i class="fas fa-home text-3xl text-primary"></i>
                        <span class="text-2xl font-bold text-dark">GOCASA<span class="text-primary">360IT</span></span>
                    </a>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="/imoveis" class="text-primary font-semibold">Buscar Imóveis</a>
                        <a href="#" class="text-gray-700 hover:text-primary transition">Anunciar</a>
                        <a href="#" class="text-gray-700 hover:text-primary transition">Sobre</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="text-primary hover:text-secondary transition font-semibold">Entrar</button>
                        <button class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition font-semibold">Cadastrar</button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Filtros -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 class="text-2xl font-bold text-dark mb-4">Buscar Imóveis</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Finalidade</label>
                        <select id="finalidade" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                            <option value="todos">Todos</option>
                            <option value="aluguel">Aluguel</option>
                            <option value="venda">Venda</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Imóvel</label>
                        <select id="tipo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                            <option value="">Todos</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="casa">Casa</option>
                            <option value="kitnet">Kitnet</option>
                            <option value="cobertura">Cobertura</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                        <input type="text" id="cidade" placeholder="Ex: São Paulo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
                        <select id="quartos" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                            <option value="">Todos</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Preço Mínimo</label>
                        <input type="number" id="preco_min" placeholder="R$ 0" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Preço Máximo</label>
                        <input type="number" id="preco_max" placeholder="R$ 10.000" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Vagas de Garagem</label>
                        <select id="vagas" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none">
                            <option value="">Todas</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                        </select>
                    </div>
                    
                    <div class="flex items-end">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" id="pet_friendly" class="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded">
                            <span class="text-sm font-medium text-gray-700">Pet Friendly</span>
                        </label>
                    </div>
                </div>
                
                <div class="mt-6">
                    <button onclick="buscarImoveis()" class="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition font-semibold">
                        <i class="fas fa-search mr-2"></i> Buscar Imóveis
                    </button>
                    <button onclick="limparFiltros()" class="w-full md:w-auto ml-0 md:ml-4 mt-4 md:mt-0 border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold">
                        <i class="fas fa-times mr-2"></i> Limpar Filtros
                    </button>
                </div>
            </div>
            
            <!-- Resultados -->
            <div class="mb-6 flex justify-between items-center">
                <h3 id="resultados-titulo" class="text-xl font-bold text-dark">Carregando imóveis...</h3>
                <div id="paginacao" class="flex space-x-2"></div>
            </div>
            
            <div id="imoveis-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Skeleton Loading -->
                ${Array(6).fill(0).map(() => `
                    <div class="bg-white rounded-xl shadow-md overflow-hidden skeleton">
                        <div class="h-48 bg-gray-200"></div>
                        <div class="p-4">
                            <div class="h-6 bg-gray-200 rounded mb-2"></div>
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div class="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <script>
          let currentPage = 1;
          let totalPages = 1;
          
          // Buscar imóveis ao carregar a página
          document.addEventListener('DOMContentLoaded', () => {
            buscarImoveis();
          });
          
          async function buscarImoveis(page = 1) {
            currentPage = page;
            
            // Pegar valores dos filtros
            const finalidade = document.getElementById('finalidade').value;
            const tipo = document.getElementById('tipo').value;
            const cidade = document.getElementById('cidade').value;
            const quartos = document.getElementById('quartos').value;
            const precoMin = document.getElementById('preco_min').value;
            const precoMax = document.getElementById('preco_max').value;
            const vagas = document.getElementById('vagas').value;
            const petFriendly = document.getElementById('pet_friendly').checked ? '1' : '';
            
            // Construir query params
            const params = new URLSearchParams();
            if (finalidade && finalidade !== 'todos') params.append('finalidade', finalidade);
            if (tipo) params.append('tipo', tipo);
            if (cidade) params.append('cidade', cidade);
            if (quartos) params.append('quartos', quartos);
            if (precoMin) params.append('preco_min', precoMin);
            if (precoMax) params.append('preco_max', precoMax);
            if (vagas) params.append('vagas', vagas);
            if (petFriendly) params.append('pet_friendly', petFriendly);
            params.append('page', page);
            params.append('limit', '12');
            
            try {
              const response = await fetch(\`/api/imoveis?\${params.toString()}\`);
              const data = await response.json();
              
              if (data.success) {
                renderImoveis(data.data);
                renderPaginacao(data.pagination);
                
                const total = data.pagination.total;
                document.getElementById('resultados-titulo').textContent = 
                  \`\${total} \${total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}\`;
              }
            } catch (error) {
              console.error('Erro ao buscar imóveis:', error);
              document.getElementById('imoveis-grid').innerHTML = 
                '<div class="col-span-3 text-center py-12 text-gray-500">Erro ao carregar imóveis. Tente novamente.</div>';
            }
          }
          
          function renderImoveis(imoveis) {
            const grid = document.getElementById('imoveis-grid');
            
            if (imoveis.length === 0) {
              grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">Nenhum imóvel encontrado com os filtros selecionados.</div>';
              return;
            }
            
            grid.innerHTML = imoveis.map(imovel => {
              const preco = imovel.finalidade === 'venda' || (imovel.finalidade === 'ambos' && imovel.preco_venda) 
                ? \`R$ \${formatNumber(imovel.preco_venda)}\`
                : \`R$ \${formatNumber(imovel.preco_aluguel)}/mês\`;
              
              const tipoLabel = imovel.finalidade === 'aluguel' ? 'Aluguel' : imovel.finalidade === 'venda' ? 'Venda' : 'Aluguel/Venda';
              
              return \`
                <div class="bg-white rounded-xl shadow-md overflow-hidden property-card cursor-pointer" onclick="window.location.href='/imoveis/\${imovel.id}'">
                  <div class="relative">
                    <img src="\${imovel.foto_capa}" alt="\${imovel.titulo}" class="w-full h-48 object-cover">
                    <span class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      \${tipoLabel}
                    </span>
                    \${imovel.destaque ? '<span class="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold"><i class="fas fa-star mr-1"></i> Destaque</span>' : ''}
                  </div>
                  
                  <div class="p-4">
                    <h4 class="text-lg font-bold text-dark mb-2 line-clamp-2">\${imovel.titulo}</h4>
                    <p class="text-gray-600 text-sm mb-3">
                      <i class="fas fa-map-marker-alt mr-1"></i>
                      \${imovel.endereco_bairro}, \${imovel.endereco_cidade} - \${imovel.endereco_estado}
                    </p>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span><i class="fas fa-bed mr-1"></i> \${imovel.quartos}</span>
                      <span><i class="fas fa-bath mr-1"></i> \${imovel.banheiros}</span>
                      <span><i class="fas fa-car mr-1"></i> \${imovel.vagas_garagem}</span>
                      <span><i class="fas fa-ruler-combined mr-1"></i> \${imovel.area_util}m²</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-2xl font-bold text-primary">\${preco}</span>
                      <button class="text-gray-400 hover:text-red-500 transition">
                        <i class="far fa-heart text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
          }
          
          function renderPaginacao(pagination) {
            const container = document.getElementById('paginacao');
            totalPages = pagination.totalPages;
            
            if (totalPages <= 1) {
              container.innerHTML = '';
              return;
            }
            
            let html = '';
            
            // Botão anterior
            if (currentPage > 1) {
              html += \`<button onclick="buscarImoveis(\${currentPage - 1})" class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">Anterior</button>\`;
            }
            
            // Números das páginas
            for (let i = 1; i <= totalPages; i++) {
              if (i === currentPage) {
                html += \`<button class="px-4 py-2 bg-primary text-white rounded-lg">\${i}</button>\`;
              } else {
                html += \`<button onclick="buscarImoveis(\${i})" class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">\${i}</button>\`;
              }
            }
            
            // Botão próximo
            if (currentPage < totalPages) {
              html += \`<button onclick="buscarImoveis(\${currentPage + 1})" class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">Próximo</button>\`;
            }
            
            container.innerHTML = html;
          }
          
          function limparFiltros() {
            document.getElementById('finalidade').value = 'todos';
            document.getElementById('tipo').value = '';
            document.getElementById('cidade').value = '';
            document.getElementById('quartos').value = '';
            document.getElementById('preco_min').value = '';
            document.getElementById('preco_max').value = '';
            document.getElementById('vagas').value = '';
            document.getElementById('pet_friendly').checked = false;
            buscarImoveis();
          }
          
          function formatNumber(num) {
            return new Intl.NumberFormat('pt-BR').format(num);
          }
        </script>
    </body>
    </html>
  `)
})

// Home Page
pages.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GOCASA360IT - Sua Casa, Nossa Tecnologia</title>
        <meta name="description" content="Plataforma completa para aluguel e venda de imóveis. Encontre seu lar ideal com tecnologia e segurança.">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#2563eb',
                  secondary: '#0ea5e9',
                  accent: '#f59e0b',
                  dark: '#1e293b',
                  light: '#f1f5f9'
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
          
          .gradient-bg {
            background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
          }
          
          .card-hover {
            transition: all 0.3s ease;
          }
          
          .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          
          .hero-pattern {
            background-color: #2563eb;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }

          .stat-number {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="/" class="flex items-center space-x-2">
                        <i class="fas fa-home text-3xl text-primary"></i>
                        <span class="text-2xl font-bold text-dark">GOCASA<span class="text-primary">360IT</span></span>
                    </a>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="/imoveis" class="text-gray-700 hover:text-primary transition">Buscar Imóveis</a>
                        <a href="#anunciar" class="text-gray-700 hover:text-primary transition">Anunciar</a>
                        <a href="#sobre" class="text-gray-700 hover:text-primary transition">Sobre</a>
                        <a href="#contato" class="text-gray-700 hover:text-primary transition">Contato</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="text-primary hover:text-secondary transition font-semibold">Entrar</button>
                        <button class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition font-semibold">Cadastrar</button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-pattern py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center text-white">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">Encontre Seu Lar Ideal</h1>
                    <p class="text-xl md:text-2xl mb-12 text-blue-100">Aluguel e venda de imóveis com tecnologia e segurança</p>
                    
                    <!-- Search Bar -->
                    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="md:col-span-2">
                                <input type="text" id="search-cidade" placeholder="Cidade, bairro ou endereço..." 
                                       class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-gray-700">
                            </div>
                            <div>
                                <select id="search-tipo" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-gray-700">
                                    <option value="">Tipo de Imóvel</option>
                                    <option value="apartamento">Apartamento</option>
                                    <option value="casa">Casa</option>
                                    <option value="kitnet">Kitnet</option>
                                    <option value="cobertura">Cobertura</option>
                                </select>
                            </div>
                            <div>
                                <button onclick="buscarHomePage()" class="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition font-semibold">
                                    <i class="fas fa-search mr-2"></i> Buscar
                                </button>
                            </div>
                        </div>
                        
                        <!-- Quick Filters -->
                        <div class="flex flex-wrap gap-3 mt-6 justify-center">
                            <button onclick="aplicarFiltroRapido('preco_max', '1500')" class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-dollar-sign mr-1"></i> Até R$ 1.500
                            </button>
                            <button onclick="aplicarFiltroRapido('quartos', '2')" class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-bed mr-1"></i> 2 Quartos
                            </button>
                            <button onclick="aplicarFiltroRapido('vagas', '1')" class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-car mr-1"></i> Com Garagem
                            </button>
                            <button onclick="aplicarFiltroRapido('pet_friendly', '1')" class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-paw mr-1"></i> Pet Friendly
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div class="stat-number">10K+</div>
                        <p class="text-gray-600 mt-2">Imóveis Disponíveis</p>
                    </div>
                    <div>
                        <div class="stat-number">50K+</div>
                        <p class="text-gray-600 mt-2">Usuários Ativos</p>
                    </div>
                    <div>
                        <div class="stat-number">98%</div>
                        <p class="text-gray-600 mt-2">Satisfação</p>
                    </div>
                    <div>
                        <div class="stat-number">24/7</div>
                        <p class="text-gray-600 mt-2">Suporte</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="sobre" class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-dark mb-4">Por Que Escolher a GOCASA360IT?</h2>
                    <p class="text-xl text-gray-600">Tecnologia e inovação para sua experiência imobiliária</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-8 rounded-2xl shadow-lg card-hover">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-shield-alt text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-dark mb-4">Segurança Total</h3>
                        <p class="text-gray-600">Verificação de documentos, contratos digitais e pagamentos seguros</p>
                    </div>
                    
                    <div class="bg-white p-8 rounded-2xl shadow-lg card-hover">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-mobile-alt text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-dark mb-4">100% Digital</h3>
                        <p class="text-gray-600">Do anúncio ao contrato, tudo online sem burocracia</p>
                    </div>
                    
                    <div class="bg-white p-8 rounded-2xl shadow-lg card-hover">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-headset text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-dark mb-4">Suporte Dedicado</h3>
                        <p class="text-gray-600">Equipe especializada para te ajudar em todas as etapas</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section id="anunciar" class="py-20 gradient-bg">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <h2 class="text-4xl font-bold mb-6">Tem um Imóvel para Alugar ou Vender?</h2>
                <p class="text-xl mb-8 text-blue-100">Anuncie gratuitamente e alcance milhares de interessados</p>
                <button class="bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition font-bold text-lg shadow-xl">
                    <i class="fas fa-plus-circle mr-2"></i> Anunciar Imóvel Grátis
                </button>
            </div>
        </section>

        <!-- Footer -->
        <footer id="contato" class="bg-dark text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div class="flex items-center space-x-2 mb-4">
                            <i class="fas fa-home text-2xl text-primary"></i>
                            <span class="text-xl font-bold">GOCASA<span class="text-primary">360IT</span></span>
                        </div>
                        <p class="text-gray-400">Sua casa, nossa tecnologia</p>
                    </div>
                    
                    <div>
                        <h4 class="font-bold mb-4">Imóveis</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/imoveis?finalidade=aluguel" class="hover:text-white transition">Alugar</a></li>
                            <li><a href="/imoveis?finalidade=venda" class="hover:text-white transition">Comprar</a></li>
                            <li><a href="#anunciar" class="hover:text-white transition">Anunciar</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-bold mb-4">Empresa</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#sobre" class="hover:text-white transition">Sobre Nós</a></li>
                            <li><a href="#" class="hover:text-white transition">Carreiras</a></li>
                            <li><a href="#" class="hover:text-white transition">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-bold mb-4">Contato</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><i class="fas fa-envelope mr-2"></i> contato@gocasa360it.com</li>
                            <li><i class="fas fa-phone mr-2"></i> (11) 3000-0000</li>
                            <li class="flex space-x-4 mt-4">
                                <a href="#" class="hover:text-primary transition"><i class="fab fa-facebook text-xl"></i></a>
                                <a href="#" class="hover:text-primary transition"><i class="fab fa-instagram text-xl"></i></a>
                                <a href="#" class="hover:text-primary transition"><i class="fab fa-linkedin text-xl"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 GOCASA360IT. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>

        <script>
          // Smooth scroll para âncoras
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          });
          
          // Buscar da home page
          function buscarHomePage() {
            const cidade = document.getElementById('search-cidade').value;
            const tipo = document.getElementById('search-tipo').value;
            
            let url = '/imoveis?';
            if (cidade) url += \`cidade=\${encodeURIComponent(cidade)}&\`;
            if (tipo) url += \`tipo=\${tipo}&\`;
            
            window.location.href = url;
          }
          
          // Filtros rápidos
          function aplicarFiltroRapido(param, value) {
            window.location.href = \`/imoveis?\${param}=\${value}&finalidade=aluguel\`;
          }
        </script>
    </body>
    </html>
  `)
})

// Página de Login
pages.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - GOCASA360IT</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#2563eb',
                  secondary: '#0ea5e9'
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <a href="/" class="flex items-center justify-center space-x-2 mb-6">
                        <i class="fas fa-home text-4xl text-primary"></i>
                        <span class="text-3xl font-bold text-dark">GOCASA<span class="text-primary">360IT</span></span>
                    </a>
                    <h2 class="text-3xl font-bold text-gray-900">Entrar na sua conta</h2>
                    <p class="mt-2 text-sm text-gray-600">
                        Ou <a href="/cadastro" class="font-medium text-primary hover:text-secondary">crie uma conta nova</a>
                    </p>
                </div>
                
                <div id="alert" class="hidden"></div>
                
                <form id="loginForm" class="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg">
                    <div class="space-y-4">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input id="email" name="email" type="email" required 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="seu@email.com">
                        </div>
                        <div>
                            <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                            <input id="senha" name="senha" type="password" required 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="••••••••">
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="lembrar" name="lembrar" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                            <label for="lembrar" class="ml-2 block text-sm text-gray-900">Lembrar-me</label>
                        </div>
                        <div class="text-sm">
                            <a href="#" class="font-medium text-primary hover:text-secondary">Esqueceu a senha?</a>
                        </div>
                    </div>

                    <button type="submit" id="submitBtn"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Entrar
                    </button>
                </form>
                
                <p class="mt-4 text-center text-sm text-gray-600">
                    <a href="/" class="font-medium text-primary hover:text-secondary">
                        <i class="fas fa-arrow-left mr-1"></i> Voltar para home
                    </a>
                </p>
            </div>
        </div>

        <script>
          const form = document.getElementById('loginForm');
          const alertDiv = document.getElementById('alert');
          const submitBtn = document.getElementById('submitBtn');

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
            // Desabilitar botão
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Entrando...';
            
            try {
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
              });
              
              const data = await response.json();
              
              if (data.success) {
                // Salvar token no localStorage
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
                
                // Mostrar sucesso
                showAlert('Login realizado com sucesso! Redirecionando...', 'success');
                
                // Redirecionar baseado no tipo de usuário
                setTimeout(() => {
                  if (data.data.usuario.tipo === 'proprietario') {
                    window.location.href = '/dashboard/proprietario';
                  } else if (data.data.usuario.tipo === 'inquilino') {
                    window.location.href = '/imoveis';
                  } else {
                    window.location.href = '/';
                  }
                }, 1500);
              } else {
                showAlert(data.error || 'Erro ao fazer login', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Entrar';
              }
            } catch (error) {
              console.error('Erro:', error);
              showAlert('Erro ao fazer login. Tente novamente.', 'error');
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Entrar';
            }
          });
          
          function showAlert(message, type) {
            const alertDiv = document.getElementById('alert');
            const bgColor = type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200';
            alertDiv.className = \`border rounded-lg p-4 mb-4 \${bgColor}\`;
            alertDiv.innerHTML = message;
            alertDiv.classList.remove('hidden');
          }
        </script>
    </body>
    </html>
  `)
})

// Página de Cadastro
pages.get('/cadastro', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro - GOCASA360IT</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#2563eb',
                  secondary: '#0ea5e9'
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <a href="/" class="flex items-center justify-center space-x-2 mb-6">
                        <i class="fas fa-home text-4xl text-primary"></i>
                        <span class="text-3xl font-bold text-dark">GOCASA<span class="text-primary">360IT</span></span>
                    </a>
                    <h2 class="text-3xl font-bold text-gray-900">Criar conta</h2>
                    <p class="mt-2 text-sm text-gray-600">
                        Já tem uma conta? <a href="/login" class="font-medium text-primary hover:text-secondary">Faça login</a>
                    </p>
                </div>
                
                <div id="alert" class="hidden"></div>
                
                <form id="cadastroForm" class="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg">
                    <div class="space-y-4">
                        <div>
                            <label for="nome_completo" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                            <input id="nome_completo" name="nome_completo" type="text" required 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="João Silva">
                        </div>
                        
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input id="email" name="email" type="email" required 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="seu@email.com">
                        </div>
                        
                        <div>
                            <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                            <input id="telefone" name="telefone" type="tel" 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="(11) 98765-4321">
                        </div>
                        
                        <div>
                            <label for="cpf_cnpj" class="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ</label>
                            <input id="cpf_cnpj" name="cpf_cnpj" type="text" 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="000.000.000-00">
                        </div>
                        
                        <div>
                            <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário</label>
                            <select id="tipo" name="tipo" required 
                                    class="appearance-none relative block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                                <option value="">Selecione...</option>
                                <option value="inquilino">Inquilino / Comprador</option>
                                <option value="proprietario">Proprietário</option>
                                <option value="corretor">Corretor de Imóveis</option>
                            </select>
                            <p class="mt-2 text-xs text-gray-500">
                                <span id="tipo-help"></span>
                            </p>
                        </div>
                        
                        <div>
                            <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                            <input id="senha" name="senha" type="password" required 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="••••••••">
                            <p class="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
                        </div>
                        
                        <div>
                            <label for="senha_confirm" class="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                            <input id="senha_confirm" name="senha_confirm" type="password" required 
                                   class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                   placeholder="••••••••">
                        </div>
                    </div>

                    <div class="flex items-center">
                        <input id="termos" name="termos" type="checkbox" required class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                        <label for="termos" class="ml-2 block text-sm text-gray-900">
                            Concordo com os <a href="#" class="text-primary hover:text-secondary">Termos de Uso</a> e 
                            <a href="#" class="text-primary hover:text-secondary">Política de Privacidade</a>
                        </label>
                    </div>

                    <button type="submit" id="submitBtn"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                        <i class="fas fa-user-plus mr-2"></i>
                        Criar Conta
                    </button>
                </form>
                
                <p class="mt-4 text-center text-sm text-gray-600">
                    <a href="/" class="font-medium text-primary hover:text-secondary">
                        <i class="fas fa-arrow-left mr-1"></i> Voltar para home
                    </a>
                </p>
            </div>
        </div>

        <script>
          const form = document.getElementById('cadastroForm');
          const alertDiv = document.getElementById('alert');
          const submitBtn = document.getElementById('submitBtn');
          const tipoSelect = document.getElementById('tipo');
          const tipoHelp = document.getElementById('tipo-help');
          
          // Mensagens de ajuda
          const tipoHelpTexts = {
            inquilino: 'Buscar imóveis para alugar ou comprar',
            proprietario: 'Anunciar e gerenciar seus imóveis',
            corretor: 'Intermediar negócios imobiliários'
          };
          
          tipoSelect.addEventListener('change', (e) => {
            tipoHelp.textContent = tipoHelpTexts[e.target.value] || '';
          });

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome_completo = document.getElementById('nome_completo').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const cpf_cnpj = document.getElementById('cpf_cnpj').value;
            const tipo = document.getElementById('tipo').value;
            const senha = document.getElementById('senha').value;
            const senha_confirm = document.getElementById('senha_confirm').value;
            
            // Validações
            if (senha.length < 6) {
              showAlert('A senha deve ter no mínimo 6 caracteres', 'error');
              return;
            }
            
            if (senha !== senha_confirm) {
              showAlert('As senhas não coincidem', 'error');
              return;
            }
            
            // Desabilitar botão
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Criando conta...';
            
            try {
              const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  nome_completo, 
                  email, 
                  telefone, 
                  cpf_cnpj, 
                  tipo, 
                  senha 
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                // Salvar token no localStorage
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
                
                // Mostrar sucesso
                showAlert('Conta criada com sucesso! Redirecionando...', 'success');
                
                // Redirecionar baseado no tipo de usuário
                setTimeout(() => {
                  if (tipo === 'proprietario') {
                    window.location.href = '/dashboard/proprietario';
                  } else if (tipo === 'inquilino') {
                    window.location.href = '/imoveis';
                  } else {
                    window.location.href = '/';
                  }
                }, 1500);
              } else {
                showAlert(data.error || 'Erro ao criar conta', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i> Criar Conta';
              }
            } catch (error) {
              console.error('Erro:', error);
              showAlert('Erro ao criar conta. Tente novamente.', 'error');
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i> Criar Conta';
            }
          });
          
          function showAlert(message, type) {
            const alertDiv = document.getElementById('alert');
            const bgColor = type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200';
            alertDiv.className = \`border rounded-lg p-4 mb-4 \${bgColor}\`;
            alertDiv.innerHTML = message;
            alertDiv.classList.remove('hidden');
          }
        </script>
    </body>
    </html>
  `)
})

// Página de Detalhes do Imóvel
pages.get('/imoveis/:id', (c) => {
  const imovelId = c.req.param('id')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detalhes do Imóvel - GOCASA360IT</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#2563eb',
                  secondary: '#0ea5e9'
                }
              }
            }
          }
        </script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
          
          .gallery-img {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .gallery-img:hover {
            transform: scale(1.05);
          }
          
          /* Lightbox styles */
          .lightbox {
            display: none;
            position: fixed;
            z-index: 999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
          }
          
          .lightbox.active {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .lightbox-content {
            max-width: 90%;
            max-height: 90%;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="/" class="flex items-center space-x-2">
                        <i class="fas fa-home text-3xl text-primary"></i>
                        <span class="text-2xl font-bold text-dark">GOCASA<span class="text-primary">360IT</span></span>
                    </a>
                    <div class="flex items-center space-x-4">
                        <a href="/imoveis" class="text-gray-700 hover:text-primary transition">
                            <i class="fas fa-arrow-left mr-2"></i> Voltar
                        </a>
                        <a href="/login" id="loginBtn" class="text-primary hover:text-secondary transition font-semibold">Entrar</a>
                        <a href="/cadastro" id="cadastroBtn" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition font-semibold hidden">Cadastrar</a>
                        <div id="userMenu" class="hidden">
                            <button id="logoutBtn" class="text-red-600 hover:text-red-800 transition font-semibold">
                                <i class="fas fa-sign-out-alt mr-1"></i> Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Loading State -->
        <div id="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
            <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
            <p class="mt-4 text-gray-600">Carregando imóvel...</p>
        </div>

        <!-- Content -->
        <div id="content" class="hidden">
            <!-- Hero/Gallery Section -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2">
                        <img id="mainImage" src="" alt="" class="w-full h-96 object-cover rounded-xl cursor-pointer" onclick="openLightbox(this.src)">
                        <div id="thumbs" class="grid grid-cols-4 gap-2 mt-4">
                            <!-- Thumbnails will be inserted here -->
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div id="priceSection"></div>
                        
                        <button id="favoritoBtn" class="w-full mt-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold">
                            <i class="far fa-heart mr-2"></i> <span id="favoritoText">Favoritar</span>
                        </button>
                        
                        <button onclick="mostrarAgendarVisita()" class="w-full mt-2 py-3 bg-secondary text-white rounded-lg hover:bg-blue-600 transition font-semibold">
                            <i class="fas fa-calendar-check mr-2"></i> Agendar Visita
                        </button>
                        
                        <button onclick="mostrarFazerProposta()" class="w-full mt-2 py-3 bg-accent text-white rounded-lg hover:bg-yellow-600 transition font-semibold">
                            <i class="fas fa-hand-holding-usd mr-2"></i> Fazer Proposta
                        </button>
                        
                        <div class="mt-6 pt-6 border-t">
                            <h4 class="font-bold text-gray-900 mb-3">Proprietário</h4>
                            <div id="proprietarioInfo"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Details Section -->
            <div class="bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2">
                            <h1 id="titulo" class="text-4xl font-bold text-gray-900 mb-4"></h1>
                            <p id="endereco" class="text-xl text-gray-600 mb-6">
                                <i class="fas fa-map-marker-alt mr-2"></i>
                            </p>
                            
                            <div id="caracteristicas" class="flex flex-wrap gap-6 mb-8">
                                <!-- Características serão inseridas aqui -->
                            </div>
                            
                            <div class="prose max-w-none">
                                <h2 class="text-2xl font-bold text-gray-900 mb-4">Sobre este imóvel</h2>
                                <p id="descricao" class="text-gray-700 leading-relaxed"></p>
                            </div>
                            
                            <div id="comodidades" class="mt-8">
                                <h3 class="text-2xl font-bold text-gray-900 mb-4">Comodidades</h3>
                                <div id="comodidadesList" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <!-- Comodidades serão inseridas aqui -->
                                </div>
                            </div>
                            
                            <!-- Mapa -->
                            <div class="mt-8">
                                <h3 class="text-2xl font-bold text-gray-900 mb-4">Localização</h3>
                                <div id="mapa" class="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
                                    <div class="text-center">
                                        <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                                        <p class="text-gray-600" id="enderecoCompleto"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="bg-gray-50 rounded-xl p-6 sticky top-24">
                                <h3 class="text-xl font-bold text-gray-900 mb-4">Informações Adicionais</h3>
                                <div id="infoAdicional" class="space-y-3 text-sm">
                                    <!-- Info adicional será inserida aqui -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lightbox -->
        <div id="lightbox" class="lightbox" onclick="closeLightbox()">
            <span class="absolute top-4 right-4 text-white text-4xl cursor-pointer">&times;</span>
            <img id="lightboxImg" class="lightbox-content" src="" alt="">
        </div>

        <!-- Modal Agendar Visita -->
        <div id="modalVisita" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Agendar Visita</h3>
                <form id="formVisita">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Data e Hora</label>
                        <input type="datetime-local" id="dataHoraVisita" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                        <textarea id="observacoesVisita" rows="3"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                  placeholder="Deixe um comentário (opcional)"></textarea>
                    </div>
                    <div class="flex space-x-3">
                        <button type="button" onclick="fecharModal('modalVisita')"
                                class="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            Cancelar
                        </button>
                        <button type="submit"
                                class="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">
                            Agendar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Fazer Proposta -->
        <div id="modalProposta" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-md w-full p-6" onclick="event.stopPropagation()">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Fazer Proposta</h3>
                <form id="formProposta">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select id="tipoProposta" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                            <option value="">Selecione...</option>
                            <option value="aluguel">Aluguel</option>
                            <option value="compra">Compra</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Valor Proposto (R$)</label>
                        <input type="number" id="valorProposta" required step="0.01"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                               placeholder="0.00">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                        <textarea id="mensagemProposta" rows="3"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                  placeholder="Deixe um comentário (opcional)"></textarea>
                    </div>
                    <div class="flex space-x-3">
                        <button type="button" onclick="fecharModal('modalProposta')"
                                class="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            Cancelar
                        </button>
                        <button type="submit"
                                class="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-yellow-600 transition">
                            Enviar Proposta
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script>
          const imovelId = '${imovelId}';
          let imovelData = null;
          let usuario = null;
          let token = null;

          // Verificar autenticação
          document.addEventListener('DOMContentLoaded', () => {
            const storedToken = localStorage.getItem('token');
            const storedUsuario = localStorage.getItem('usuario');
            
            if (storedToken && storedUsuario) {
              token = storedToken;
              usuario = JSON.parse(storedUsuario);
              document.getElementById('loginBtn').classList.add('hidden');
              document.getElementById('cadastroBtn').classList.add('hidden');
              document.getElementById('userMenu').classList.remove('hidden');
            }
            
            carregarImovel();
            
            if (token) {
              verificarFavorito();
            }
          });

          // Logout
          document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            if (token) {
              await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': \`Bearer \${token}\` }
              });
            }
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/';
          });

          async function carregarImovel() {
            try {
              const response = await fetch(\`/api/imoveis/\${imovelId}\`);
              const data = await response.json();
              
              if (data.success) {
                imovelData = data.data;
                renderImovel(imovelData);
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('content').classList.remove('hidden');
              } else {
                alert('Imóvel não encontrado');
                window.location.href = '/imoveis';
              }
            } catch (error) {
              console.error('Erro:', error);
              alert('Erro ao carregar imóvel');
            }
          }

          function renderImovel(imovel) {
            // Título e endereço
            document.getElementById('titulo').textContent = imovel.titulo;
            document.getElementById('endereco').innerHTML = \`
              <i class="fas fa-map-marker-alt mr-2"></i>
              \${imovel.endereco_bairro}, \${imovel.endereco_cidade} - \${imovel.endereco_estado}
            \`;
            
            // Preço
            const priceHtml = imovel.finalidade === 'venda' || (imovel.finalidade === 'ambos' && imovel.preco_venda)
              ? \`<div class="text-3xl font-bold text-primary">R$ \${formatNumber(imovel.preco_venda)}</div>
                 <div class="text-sm text-gray-600 mt-1">Venda</div>\`
              : \`<div class="text-3xl font-bold text-primary">R$ \${formatNumber(imovel.preco_aluguel)}/mês</div>
                 <div class="text-sm text-gray-600 mt-1">Aluguel</div>\`;
            
            if (imovel.condominio > 0) {
              document.getElementById('priceSection').innerHTML = priceHtml + \`
                <div class="text-sm text-gray-600 mt-2">+ R$ \${formatNumber(imovel.condominio)} condomínio</div>
              \`;
            } else {
              document.getElementById('priceSection').innerHTML = priceHtml;
            }
            
            // Galeria
            const fotos = [imovel.foto_capa];
            document.getElementById('mainImage').src = fotos[0];
            
            // Características
            document.getElementById('caracteristicas').innerHTML = \`
              <div class="flex items-center text-gray-700">
                <i class="fas fa-bed text-2xl text-primary mr-2"></i>
                <div>
                  <div class="text-2xl font-bold">\${imovel.quartos}</div>
                  <div class="text-sm">Quartos</div>
                </div>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-bath text-2xl text-primary mr-2"></i>
                <div>
                  <div class="text-2xl font-bold">\${imovel.banheiros}</div>
                  <div class="text-sm">Banheiros</div>
                </div>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-car text-2xl text-primary mr-2"></i>
                <div>
                  <div class="text-2xl font-bold">\${imovel.vagas_garagem}</div>
                  <div class="text-sm">Vagas</div>
                </div>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-ruler-combined text-2xl text-primary mr-2"></i>
                <div>
                  <div class="text-2xl font-bold">\${imovel.area_util}m²</div>
                  <div class="text-sm">Área Útil</div>
                </div>
              </div>
            \`;
            
            // Descrição
            document.getElementById('descricao').textContent = imovel.descricao;
            
            // Comodidades
            if (imovel.comodidades && imovel.comodidades.length > 0) {
              document.getElementById('comodidadesList').innerHTML = imovel.comodidades.map(c => \`
                <div class="flex items-center text-gray-700">
                  <i class="fas fa-check-circle text-primary mr-2"></i>
                  <span>\${formatComodidade(c)}</span>
                </div>
              \`).join('');
            } else {
              document.getElementById('comodidades').classList.add('hidden');
            }
            
            // Proprietário
            document.getElementById('proprietarioInfo').innerHTML = \`
              <p class="font-medium text-gray-900">\${imovel.proprietario_nome}</p>
              <p class="text-gray-600 text-sm mt-1">
                <i class="fas fa-phone mr-1"></i> \${imovel.proprietario_telefone || 'Não informado'}
              </p>
            \`;
            
            // Info adicional
            document.getElementById('infoAdicional').innerHTML = \`
              <div><strong>Tipo:</strong> \${formatTipo(imovel.tipo)}</div>
              <div><strong>Finalidade:</strong> \${formatFinalidade(imovel.finalidade)}</div>
              <div><strong>Área Total:</strong> \${imovel.area_total}m²</div>
              <div><strong>Mobiliado:</strong> \${imovel.mobiliado ? 'Sim' : 'Não'}</div>
              <div><strong>Pet Friendly:</strong> \${imovel.pet_friendly ? 'Sim' : 'Não'}</div>
              <div><strong>IPTU:</strong> R$ \${formatNumber(imovel.iptu)}/mês</div>
              <div><strong>Visualizações:</strong> \${imovel.visualizacoes}</div>
            \`;
            
            // Endereço completo
            document.getElementById('enderecoCompleto').textContent = 
              \`\${imovel.endereco_rua}, \${imovel.endereco_numero} - \${imovel.endereco_bairro}, \${imovel.endereco_cidade}/\${imovel.endereco_estado}\`;
          }

          async function verificarFavorito() {
            try {
              const response = await fetch(\`/api/favoritos/check/\${imovelId}\`, {
                headers: { 'Authorization': \`Bearer \${token}\` }
              });
              const data = await response.json();
              
              if (data.favoritado) {
                document.getElementById('favoritoBtn').innerHTML = '<i class="fas fa-heart mr-2"></i> Favoritado';
                document.getElementById('favoritoBtn').classList.remove('border-primary', 'text-primary');
                document.getElementById('favoritoBtn').classList.add('bg-red-500', 'text-white', 'border-red-500');
              }
            } catch (error) {
              console.error('Erro ao verificar favorito:', error);
            }
          }

          document.getElementById('favoritoBtn').addEventListener('click', async () => {
            if (!token) {
              alert('Você precisa estar logado para favoritar imóveis');
              window.location.href = '/login';
              return;
            }
            
            const btn = document.getElementById('favoritoBtn');
            const isFavorited = btn.innerHTML.includes('Favoritado');
            
            try {
              if (isFavorited) {
                await fetch(\`/api/favoritos/\${imovelId}\`, {
                  method: 'DELETE',
                  headers: { 'Authorization': \`Bearer \${token}\` }
                });
                btn.innerHTML = '<i class="far fa-heart mr-2"></i> Favoritar';
                btn.classList.add('border-primary', 'text-primary');
                btn.classList.remove('bg-red-500', 'text-white', 'border-red-500');
              } else {
                await fetch('/api/favoritos', {
                  method: 'POST',
                  headers: { 
                    'Authorization': \`Bearer \${token}\`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ imovel_id: imovelId })
                });
                btn.innerHTML = '<i class="fas fa-heart mr-2"></i> Favoritado';
                btn.classList.remove('border-primary', 'text-primary');
                btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
              }
            } catch (error) {
              console.error('Erro:', error);
              alert('Erro ao processar favorito');
            }
          });

          function mostrarAgendarVisita() {
            if (!token) {
              alert('Você precisa estar logado para agendar visitas');
              window.location.href = '/login';
              return;
            }
            document.getElementById('modalVisita').classList.remove('hidden');
          }

          function mostrarFazerProposta() {
            if (!token) {
              alert('Você precisa estar logado para fazer propostas');
              window.location.href = '/login';
              return;
            }
            document.getElementById('modalProposta').classList.remove('hidden');
          }

          function fecharModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
          }

          document.getElementById('formVisita').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const dataHora = document.getElementById('dataHoraVisita').value;
            const observacoes = document.getElementById('observacoesVisita').value;
            
            try {
              const response = await fetch('/api/visitas', {
                method: 'POST',
                headers: {
                  'Authorization': \`Bearer \${token}\`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  imovel_id: imovelId,
                  data_hora: dataHora,
                  observacoes: observacoes
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                alert('Visita agendada com sucesso!');
                fecharModal('modalVisita');
                document.getElementById('formVisita').reset();
              } else {
                alert(data.error || 'Erro ao agendar visita');
              }
            } catch (error) {
              console.error('Erro:', error);
              alert('Erro ao agendar visita');
            }
          });

          document.getElementById('formProposta').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const tipo = document.getElementById('tipoProposta').value;
            const valor = document.getElementById('valorProposta').value;
            const mensagem = document.getElementById('mensagemProposta').value;
            
            try {
              const response = await fetch('/api/propostas', {
                method: 'POST',
                headers: {
                  'Authorization': \`Bearer \${token}\`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  imovel_id: imovelId,
                  tipo: tipo,
                  valor_proposto: parseFloat(valor),
                  mensagem: mensagem
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                alert('Proposta enviada com sucesso!');
                fecharModal('modalProposta');
                document.getElementById('formProposta').reset();
              } else {
                alert(data.error || 'Erro ao enviar proposta');
              }
            } catch (error) {
              console.error('Erro:', error);
              alert('Erro ao enviar proposta');
            }
          });

          function openLightbox(src) {
            document.getElementById('lightboxImg').src = src;
            document.getElementById('lightbox').classList.add('active');
          }

          function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
          }

          function formatNumber(num) {
            return new Intl.NumberFormat('pt-BR').format(num);
          }

          function formatTipo(tipo) {
            const tipos = {
              apartamento: 'Apartamento',
              casa: 'Casa',
              kitnet: 'Kitnet',
              cobertura: 'Cobertura',
              terreno: 'Terreno',
              comercial: 'Comercial',
              rural: 'Rural'
            };
            return tipos[tipo] || tipo;
          }

          function formatFinalidade(finalidade) {
            const finalidades = {
              aluguel: 'Aluguel',
              venda: 'Venda',
              ambos: 'Aluguel e Venda'
            };
            return finalidades[finalidade] || finalidade;
          }

          function formatComodidade(comodidade) {
            const comodidades = {
              piscina: 'Piscina',
              academia: 'Academia',
              churrasqueira: 'Churrasqueira',
              salao_festas: 'Salão de Festas',
              playground: 'Playground',
              quadra: 'Quadra Esportiva',
              elevador: 'Elevador',
              portaria_24h: 'Portaria 24h',
              quintal: 'Quintal',
              area_gourmet: 'Área Gourmet',
              coworking: 'Coworking',
              lavanderia: 'Lavanderia',
              sauna: 'Sauna',
              piscina_privativa: 'Piscina Privativa',
              academia_privativa: 'Academia Privativa',
              adega: 'Adega',
              home_theater: 'Home Theater',
              despensa: 'Despensa'
            };
            return comodidades[comodidade] || comodidade;
          }
        </script>
    </body>
    </html>
  `)
})

export default pages
