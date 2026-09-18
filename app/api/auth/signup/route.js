import { NextResponse } from 'next/server'
import {
  readShoppers, writeShoppers, hashPassword, createVerifyToken,
  signSession, publicUser, SESSION_COOKIE, SESSION_DAYS,
} from '@/lib/shoppers'
import { sendMail, verifyEmailHtml, exposeDevLinks } from '@/lib/mailer'
import { rateLimit, clientIp } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

export async function POST(req) {
  // Rate limit: IP başına saatte 5 kayıt
  const rl = rateLimit(`signup:${clientIp(req)}`, { max: 5, windowMs: 3600_000 })
  if (!rl.ok) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const name = String(body?.name || '').trim().slice(0, 80)
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

  const list = readShoppers()
  if (list.some(u => u.email === email)) {
    return NextResponse.json({ error: 'An account with this email already exists. Try signing in.' }, { status: 409 })
  }

  const user = {
    id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name, email,
    password: hashPassword(password),
    emailVerified: false,
    createdAt: new Date().toISOString(),
  }
  const rawToken = createVerifyToken(user)
  list.push(user)
  writeShoppers(list)

  // Doğrulama e-postası gönder (dev modda outbox'a yazılır)
  const link = `${SITE_URL}/verify?token=${rawToken}`
  try {
    await sendMail({
      to: email,
      subject: 'Confirm your email — Zaza Luxury',
      html: verifyEmailHtml({ name, link }),
    })
  } catch {
    // mail servisi geçici düşse bile kayıt tamamlanır; kullanıcı "resend" yapabilir
  }

  const token = signSession({ uid: user.id, exp: Date.now() + SESSION_DAYS * 864e5 })
  const res = NextResponse.json({
    user: publicUser(user),
    needsVerification: true,
    // SADECE dev modda: gerçek mail gitmediği için linki test amaçlı döneriz
    ...(exposeDevLinks() ? { devVerifyLink: link } : {}),
  }, { status: 201 })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    maxAge: SESSION_DAYS * 86400,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
