import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { i18nCode, translations } from './i18n-data'
import imoveis from './routes/imoveis'
import pages from './routes/pages'
import auth from './routes/auth'
import favoritos from './routes/favoritos'
import visitas from './routes/visitas'
import propostas from './routes/propostas'
import admin from './routes/admin'
import adminAdvanced from './routes/admin-advanced'
import dashboard from './routes/dashboard'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Serve i18n JavaScript file
app.get('/i18n.js', (c) => {
  return c.text(i18nCode, 200, { 
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public, max-age=3600'
  })
})

// Serve i18n translation files
app.get('/i18n/:locale', (c) => {
  let locale = c.req.param('locale')
  
  // Remove .json extension if present
  locale = locale.replace('.json', '') as 'pt-BR' | 'it-IT' | 'en-US'
  
  const data = translations[locale]
  
  if (!data) {
    return c.json({ error: 'Locale not found' }, 404)
  }
  
  return c.json(data, 200, {
    'Cache-Control': 'public, max-age=3600'
  })
})

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
app.route('/api/auth', auth)
app.route('/api/imoveis', imoveis)
app.route('/api/favoritos', favoritos)
app.route('/api/visitas', visitas)
app.route('/api/propostas', propostas)
app.route('/api/dashboard', dashboard)
app.route('/api/admin', admin)
app.route('/api/admin', adminAdvanced)

// Page Routes
app.route('/', pages)

export default app
