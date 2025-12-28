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

export default pages
