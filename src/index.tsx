import { Hono } from 'hono'
import { cors } from 'hono/cors'
import imoveis from './routes/imoveis'
import pages from './routes/pages'

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

// Page Routes
app.route('/', pages)

export default app
