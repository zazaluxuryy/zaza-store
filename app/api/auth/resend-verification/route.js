import { NextResponse } from 'next/server'
import { readShoppers, writeShoppers, createVerifyToken, userFromRequest } from '@/lib/shoppers'
import { sendMail, verifyEmailHtml, exposeDevLinks } from '@/lib/mailer'
import { rateLimit, clientIp } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

export async function POST(req) {
  // Sıkı limit: IP başına saatte 3 yeniden gönderim
  const rl = rateLimit(`resend:${clientIp(req)}`, { max: 3, windowMs: 3600_000 })
  if (!rl.ok) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })

  // Sadece oturumlu kullanıcı kendi doğrulamasını yeniden isteyebilir
  const me = userFromRequest(req)
  if (!me) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  if (me.emailVerified) return NextResponse.json({ ok: true, already: true })

  const list = readShoppers()
  const user = list.find(u => u.id === me.id)
  const rawToken = createVerifyToken(user)
  writeShoppers(list)

  const link = `${SITE_URL}/verify?token=${rawToken}`
  try {
    await sendMail({
      to: user.email,
      subject: 'Confirm your email — Zaza Luxury',
      html: verifyEmailHtml({ name: user.name, link }),
    })
  } catch {
    return NextResponse.json({ error: 'Could not send email right now. Please try again later.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, ...(exposeDevLinks() ? { devVerifyLink: link } : {}) })
}
