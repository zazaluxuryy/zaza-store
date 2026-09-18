// Müşteri hesapları — SADECE server tarafında kullanılır.
// Şifreler scrypt ile hash'lenir; oturum HMAC imzalı httpOnly cookie'dir.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { scryptSync, randomBytes, timingSafeEqual, createHmac, createHash } from 'crypto'
import { DATA_DIR } from './paths'
const FILE = join(DATA_DIR, 'shoppers.json')
const SECRET = process.env.STORE_SECRET || 'dev-secret-change-me'

function ensure() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(FILE)) writeFileSync(FILE, '[]')
}

export function readShoppers() {
  ensure()
  try { return JSON.parse(readFileSync(FILE, 'utf8')) } catch { return [] }
}
export function writeShoppers(list) {
  ensure()
  writeFileSync(FILE, JSON.stringify(list, null, 2))
}

// ── Şifre hash ──────────────────────────────────────────────
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}
export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  const calc = scryptSync(password, salt, 64)
  const orig = Buffer.from(hash, 'hex')
  return calc.length === orig.length && timingSafeEqual(calc, orig)
}

// ── Oturum token (imzalı) ───────────────────────────────────
export function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(body).digest('base64url')
  return `${body}.${sig}`
}
export function verifySession(token) {
  const [body, sig] = String(token || '').split('.')
  if (!body || !sig) return null
  const expect = createHmac('sha256', SECRET).update(body).digest('base64url')
  const a = Buffer.from(sig), b = Buffer.from(expect)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch { return null }
}

export const SESSION_COOKIE = 'zaza_session'
export const SESSION_DAYS = 30

export function publicUser(u) {
  return u ? { id: u.id, name: u.name || '', email: u.email, emailVerified: !!u.emailVerified } : null
}

// ── E-posta doğrulama token'ları ────────────────────────────
// Ham token e-postaya gider; DB'de sadece SHA-256 hash'i saklanır
// (dosya sızsa bile token'lar kullanılamaz).
export function createVerifyToken(user) {
  const raw = randomBytes(32).toString('base64url')
  user.verifyTokenHash = createHash('sha256').update(raw).digest('hex')
  user.verifyExpires = Date.now() + 24 * 3600 * 1000 // 24 saat
  return raw
}

// Token'ı doğrula → kullanıcıyı verified yap. Başarıda user döner.
export function consumeVerifyToken(rawToken) {
  if (!rawToken) return null
  const hash = createHash('sha256').update(String(rawToken)).digest('hex')
  const list = readShoppers()
  const u = list.find(x => x.verifyTokenHash === hash)
  if (!u) return null
  if (!u.verifyExpires || Date.now() > u.verifyExpires) return null
  u.emailVerified = true
  u.verifiedAt = new Date().toISOString()
  delete u.verifyTokenHash
  delete u.verifyExpires
  writeShoppers(list)
  return u
}

// Route handler'lar için: cookie'den kullanıcıyı çöz
export function userFromRequest(req) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const payload = verifySession(token)
  if (!payload?.uid) return null
  const u = readShoppers().find(x => x.id === payload.uid)
  return publicUser(u)
}
