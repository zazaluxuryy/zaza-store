import { NextResponse } from 'next/server'

// PIN doğrula → doğruysa httpOnly cookie set et (30 gün). Middleware bu cookie'yi kontrol eder.
export async function POST(req) {
  const { pin } = await req.json().catch(() => ({}))
  const expected = process.env.PREVIEW_PIN || '1907'
  if (String(pin || '') !== expected) {
    return NextResponse.json({ error: 'bad pin' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('zaza_preview', expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
