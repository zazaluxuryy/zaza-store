// E-posta gönderimi — canlıda Resend API (RESEND_API_KEY), yoksa DEV modu:
// gönderilecek mail data/outbox.json'a yazılır ve link response'ta döner (sadece local test).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { DATA_DIR } from './paths'

const OUTBOX = join(DATA_DIR, 'outbox.json')
const FROM = process.env.MAIL_FROM || 'Zaza Luxury <noreply@zazaluxury.com>'

export function isMailLive() {
  return !!process.env.RESEND_API_KEY
}

// Doğrulama linkini API cevabında döndürmek SADECE local geliştirmede serbest.
// Canlıda (production) Resend anahtarı eksik olsa bile link asla dönmez — yoksa
// herkes başkasının e-postasıyla hesap açıp "doğrulanmış" gösterebilirdi.
export function exposeDevLinks() {
  return !isMailLive() && process.env.NODE_ENV !== 'production'
}

export async function sendMail({ to, subject, html }) {
  if (isMailLive()) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    })
    if (!res.ok) {
      const err = await res.text().catch(() => '')
      throw new Error(`Mail send failed (${res.status}): ${err.slice(0, 200)}`)
    }
    return { live: true }
  }
  // DEV: diske yaz (gerçek gönderim yok)
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  let list = []
  try { list = JSON.parse(readFileSync(OUTBOX, 'utf8')) } catch {}
  list.unshift({ to, subject, html, at: new Date().toISOString() })
  writeFileSync(OUTBOX, JSON.stringify(list.slice(0, 50), null, 2))
  return { live: false }
}

// Doğrulama e-postası şablonu (marka paletinde, tablo tabanlı — mail istemcisi uyumlu)
export function verifyEmailHtml({ name, link }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#FAF6F0;font-family:Georgia,serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF6F0;padding:40px 16px;">
<tr><td align="center">
  <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background:#FFFDF9;border:1px solid #E7DDCE;border-radius:4px;padding:40px 36px;">
    <tr><td align="center" style="font-size:22px;letter-spacing:5px;color:#2B211C;padding-bottom:6px;">ZAZA LUXURY</td></tr>
    <tr><td align="center" style="font-size:10px;letter-spacing:4px;color:#B5511F;font-family:Arial,sans-serif;padding-bottom:28px;">AUTHENTICATED PRE-OWNED</td></tr>
    <tr><td style="font-size:16px;color:#2B211C;padding-bottom:14px;">Hello${name ? ' ' + name : ''},</td></tr>
    <tr><td style="font-size:14px;line-height:1.6;color:#7A6A5F;font-family:Arial,sans-serif;padding-bottom:26px;">
      Welcome to Zaza Luxury. Please confirm your email address to complete your account.
    </td></tr>
    <tr><td align="center" style="padding-bottom:26px;">
      <a href="${link}" style="background:#D96835;color:#ffffff;text-decoration:none;padding:14px 34px;border-radius:3px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;">CONFIRM EMAIL</a>
    </td></tr>
    <tr><td style="font-size:12px;line-height:1.6;color:#7A6A5F;font-family:Arial,sans-serif;">
      This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`
}
