// JWT and Authentication Helper Functions
import { sign, verify } from 'hono/jwt'
import type { Context } from 'hono'

type Bindings = {
  DB: D1Database
}

export interface JWTPayload {
  userId: string
  email: string
  tipo: string
  iat?: number
  exp?: number
}

export interface AdminPermissions {
  id: string
  nome: string
  permissoes: string[]
}

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = 60 * 60 * 24 * 7 // 7 days

/**
 * Generate JWT token for user
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const token = await sign(
    {
      ...payload,
      iat: now,
      exp: now + JWT_EXPIRES_IN
    },
    JWT_SECRET
  )
  return token
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET) as JWTPayload
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(c: Context): string | null {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

/**
 * Middleware: Require authentication
 */
export async function requireAuth(c: Context, next: Function) {
  const token = extractToken(c)
  
  if (!token) {
    return c.json({ success: false, message: 'Token não fornecido' }, 401)
  }
  
  const payload = await verifyToken(token)
  
  if (!payload) {
    return c.json({ success: false, message: 'Token inválido ou expirado' }, 401)
  }
  
  // Store user info in context
  c.set('user', payload)
  
  await next()
}

/**
 * Middleware: Require admin role
 */
export async function requireAdmin(c: Context<{ Bindings: Bindings }>, next: Function) {
  const token = extractToken(c)
  
  if (!token) {
    return c.json({ success: false, message: 'Token não fornecido' }, 401)
  }
  
  const payload = await verifyToken(token)
  
  if (!payload) {
    return c.json({ success: false, message: 'Token inválido ou expirado' }, 401)
  }
  
  // Check if user is admin
  if (payload.tipo !== 'admin') {
    return c.json({ success: false, message: 'Acesso negado. Privilégios de administrador necessários.' }, 403)
  }
  
  // Verify user still exists and is active
  const { DB } = c.env
  const user = await DB.prepare('SELECT * FROM usuarios WHERE id = ? AND ativo = 1')
    .bind(payload.userId)
    .first()
  
  if (!user) {
    return c.json({ success: false, message: 'Usuário não encontrado ou inativo' }, 403)
  }
  
  // Store user info in context
  c.set('user', payload)
  c.set('adminUser', user)
  
  await next()
}

/**
 * Middleware: Check specific permission
 */
export async function requirePermission(permission: string) {
  return async (c: Context<{ Bindings: Bindings }>, next: Function) => {
    const user = c.get('user') as JWTPayload
    
    if (!user) {
      return c.json({ success: false, message: 'Não autenticado' }, 401)
    }
    
    // Super admin has all permissions
    if (user.tipo === 'admin') {
      const { DB } = c.env
      
      // Check user permissions
      const userPermissions = await DB.prepare(`
        SELECT ap.permissoes 
        FROM usuarios_permissoes up
        JOIN admin_permissoes ap ON up.permissao_id = ap.id
        WHERE up.usuario_id = ?
      `).bind(user.userId).all()
      
      // Check if user has the required permission
      let hasPermission = false
      
      for (const perm of userPermissions.results) {
        const permArray = JSON.parse(perm.permissoes as string)
        
        // "*" means all permissions
        if (permArray.includes('*')) {
          hasPermission = true
          break
        }
        
        // Check specific permission
        if (permArray.includes(permission)) {
          hasPermission = true
          break
        }
        
        // Check wildcard (e.g., "users.*" includes "users.read", "users.write")
        const permParts = permission.split('.')
        if (permParts.length === 2) {
          const wildcard = `${permParts[0]}.*`
          if (permArray.includes(wildcard)) {
            hasPermission = true
            break
          }
        }
      }
      
      if (!hasPermission) {
        return c.json({ 
          success: false, 
          message: `Permissão negada. Permissão necessária: ${permission}` 
        }, 403)
      }
    }
    
    await next()
  }
}

/**
 * Get user permissions
 */
export async function getUserPermissions(DB: D1Database, userId: string): Promise<string[]> {
  const result = await DB.prepare(`
    SELECT ap.permissoes 
    FROM usuarios_permissoes up
    JOIN admin_permissoes ap ON up.permissao_id = ap.id
    WHERE up.usuario_id = ?
  `).bind(userId).all()
  
  let allPermissions: string[] = []
  
  for (const row of result.results) {
    const perms = JSON.parse(row.permissoes as string)
    allPermissions = [...allPermissions, ...perms]
  }
  
  return [...new Set(allPermissions)] // Remove duplicates
}

/**
 * Hash password using Web Crypto API (Cloudflare Workers compatible)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Log admin action to audit log
 */
export async function logAdminAction(
  DB: D1Database,
  adminId: string,
  actionType: string,
  resourceType: string,
  resourceId: string,
  oldValue: any = null,
  newValue: any = null,
  ipAddress: string | null = null,
  userAgent: string | null = null
) {
  const id = `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  await DB.prepare(`
    INSERT INTO audit_logs (id, admin_id, action_type, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    adminId,
    actionType,
    resourceType,
    resourceId,
    oldValue ? JSON.stringify(oldValue) : null,
    newValue ? JSON.stringify(newValue) : null,
    ipAddress,
    userAgent
  ).run()
}

/**
 * Check if email/cpf is blacklisted
 */
export async function isBlacklisted(DB: D1Database, tipo: string, valor: string): Promise<boolean> {
  const result = await DB.prepare(`
    SELECT * FROM blacklist 
    WHERE tipo = ? AND valor = ? 
    AND (permanente = 1 OR data_expiracao > datetime('now'))
  `).bind(tipo, valor).first()
  
  return result !== null
}

/**
 * Create admin notification
 */
export async function createAdminNotification(
  DB: D1Database,
  tipo: string,
  titulo: string,
  mensagem: string,
  link: string | null = null,
  prioridade: string = 'media',
  adminId: string | null = null
) {
  const id = `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  await DB.prepare(`
    INSERT INTO notificacoes_admin (id, tipo, titulo, mensagem, link, prioridade, admin_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, tipo, titulo, mensagem, link, prioridade, adminId).run()
}
