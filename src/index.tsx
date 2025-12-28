import { Hono } from 'hono'
import { cors } from 'hono/cors'
import imoveis from './routes/imoveis'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// API Health Check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'healthy',
    service: 'GOCASA360IT',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.route('/api/imoveis', imoveis)

// Main Landing Page
app.get('/', (c) => {
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
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-home text-3xl text-primary"></i>
                        <span class="text-2xl font-bold text-dark">GOCASA<span class="text-primary">360IT</span></span>
                    </div>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#buscar" class="text-gray-700 hover:text-primary transition">Buscar Imóveis</a>
                        <a href="#anunciar" class="text-gray-700 hover:text-primary transition">Anunciar</a>
                        <a href="#sobre" class="text-gray-700 hover:text-primary transition">Sobre</a>
                        <a href="#contato" class="text-gray-700 hover:text-primary transition">Contato</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="text-primary hover:text-secondary transition font-semibold">
                            Entrar
                        </button>
                        <button class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition font-semibold">
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-pattern py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center text-white">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">
                        Encontre Seu Lar Ideal
                    </h1>
                    <p class="text-xl md:text-2xl mb-12 text-blue-100">
                        Aluguel e venda de imóveis com tecnologia e segurança
                    </p>
                    
                    <!-- Search Bar -->
                    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="md:col-span-2">
                                <input type="text" placeholder="Cidade, bairro ou endereço..." 
                                       class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-gray-700">
                            </div>
                            <div>
                                <select class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-gray-700">
                                    <option>Tipo de Imóvel</option>
                                    <option>Apartamento</option>
                                    <option>Casa</option>
                                    <option>Kitnet</option>
                                    <option>Cobertura</option>
                                </select>
                            </div>
                            <div>
                                <button class="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition font-semibold">
                                    <i class="fas fa-search mr-2"></i> Buscar
                                </button>
                            </div>
                        </div>
                        
                        <!-- Quick Filters -->
                        <div class="flex flex-wrap gap-3 mt-6 justify-center">
                            <button class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-dollar-sign mr-1"></i> Até R$ 1.500
                            </button>
                            <button class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-bed mr-1"></i> 2 Quartos
                            </button>
                            <button class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
                                <i class="fas fa-car mr-1"></i> Com Garagem
                            </button>
                            <button class="bg-blue-50 text-primary px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm font-medium">
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
                            <li><a href="#" class="hover:text-white transition">Alugar</a></li>
                            <li><a href="#" class="hover:text-white transition">Comprar</a></li>
                            <li><a href="#" class="hover:text-white transition">Anunciar</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-bold mb-4">Empresa</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition">Sobre Nós</a></li>
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
        </script>
    </body>
    </html>
  `)
})

export default app
