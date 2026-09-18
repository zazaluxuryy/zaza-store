import { NextResponse } from 'next/server'
import {
  readShoppers, verifyPassword,
  signSession, publicUser, SESSION_COOKIE, SESSION_DAYS,
} from '@/lib/shoppers'
import { rateLimit, clientIp } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req) {
  // Rate limit: IP başına 15 dakikada 10 deneme (brute force koruması)
  const rl = rateLimit(`signin:${clientIp(req)}`, { max: 10, windowMs: 15 * 60_000 })
  if (!rl.ok) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')

  const user = readShoppers().find(u => u.email === email)
  // Aynı hata mesajı → e-posta var mı yok mu sızdırmayız
  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
  }

  const token = signSession({ uid: user.id, exp: Date.now() + SESSION_DAYS * 864e5 })
  const res = NextResponse.json({ user: publicUser(user) })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    maxAge: SESSION_DAYS * 86400,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
