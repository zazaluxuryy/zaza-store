import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { rateLimit, clientIp } from '@/lib/ratelimit'
import { DATA_DIR } from '@/lib/paths'
import { sendMail, isMailLive } from '@/lib/mailer'

const SITE = process.env.SITE_URL || 'https://zazaluxury.com'
function welcomeHtml() {
  return `<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;color:#2B211C">
    <h1 style="font-size:24px;font-weight:500">Welcome to Zaza Luxury</h1>
    <p style="font-size:15px;line-height:1.6;color:#5a4f45">Thank you for joining. Use the code below for <b>15% off</b> your first one-of-one piece — and you'll be first to see new arrivals.</p>
    <p style="font-size:20px;letter-spacing:2px;background:#FAF6F0;border:1px solid #E7DDCE;padding:14px;text-align:center;border-radius:2px"><b>WELCOME15</b></p>
    <p><a href="${SITE}" style="display:inline-block;background:#2B211C;color:#FAF6F0;text-decoration:none;padding:12px 26px;border-radius:2px;font-size:13px;letter-spacing:1px">SHOP THE COLLECTION</a></p>
    <p style="font-size:12px;color:#9a8d7f;margin-top:24px">Authenticated · One of one · Zaza Luxury</p>
  </div>`
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const FILE = join(DATA_DIR, 'newsletter.json')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readSubs() {
  if (!existsSync(FILE)) return []
  try { return JSON.parse(readFileSync(FILE, 'utf8')) } catch { return [] }
}

export async function POST(req) {
  // IP başına saatte 5 kayıt denemesi
  const rl = rateLimit(`newsletter:${clientIp(req)}`, { max: 5, windowMs: 3600_000 })
  if (!rl.ok) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const email = String(body?.email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  const subs = readSubs()
  // Zaten kayıtlıysa da başarı dön — e-posta varlığını sızdırma, çift kayıt da olmaz
  const isNew = !subs.some(s => s.email === email)
  if (isNew) {
    subs.push({ email, createdAt: new Date().toISOString() })
    writeFileSync(FILE, JSON.stringify(subs, null, 2))
    // Hoş geldin maili (Resend canlıysa) — isteği bloklama/çökertme
    if (isMailLive()) {
      try { await sendMail({ to: email, subject: 'Welcome to Zaza Luxury — 15% off your first piece', html: welcomeHtml() }) } catch {}
    }
  }

  return NextResponse.json({ ok: true })
}
