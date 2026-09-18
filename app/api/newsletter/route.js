import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { rateLimit, clientIp } from '@/lib/ratelimit'
import { DATA_DIR } from '@/lib/paths'

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
  if (!subs.some(s => s.email === email)) {
    subs.push({ email, createdAt: new Date().toISOString() })
    writeFileSync(FILE, JSON.stringify(subs, null, 2))
  }

  return NextResponse.json({ ok: true })
}
