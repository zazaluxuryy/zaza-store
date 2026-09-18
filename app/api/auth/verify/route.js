import { NextResponse } from 'next/server'
import { consumeVerifyToken, publicUser } from '@/lib/shoppers'
import { rateLimit, clientIp } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req) {
  const rl = rateLimit(`verify:${clientIp(req)}`, { max: 20, windowMs: 15 * 60_000 })
  if (!rl.ok) return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const user = consumeVerifyToken(String(body?.token || ''))
  if (!user) {
    return NextResponse.json({ error: 'This confirmation link is invalid or has expired.' }, { status: 400 })
  }
  return NextResponse.json({ ok: true, user: publicUser(user) })
}
