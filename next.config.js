/** @type {import('next').NextConfig} */

// Panel backend origin — ürünler ve /uploads görselleri buradan gelir.
const PANEL_ORIGIN = process.env.PANEL_ORIGIN || 'http://localhost:3002'
let panel
try { panel = new URL(PANEL_ORIGIN) } catch { panel = new URL('http://localhost:3002') }

const isProd = process.env.NODE_ENV === 'production'

// ── Güvenlik başlıkları ──────────────────────────────────────
// CSP: sadece kendi kaynaklarımız + Google Fonts + panel görselleri.
const csp = [
  "default-src 'self'",
  // Next.js hydration inline script'leri gerektirir
  "script-src 'self' 'unsafe-inline'" + (isProd ? '' : " 'unsafe-eval'"),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Görseller: kendi origin + panel + Cloudflare R2 (r2.dev + varsa özel CDN domaini)
  `img-src 'self' data: ${panel.origin} https://*.r2.dev${process.env.PHOTO_CDN_ORIGIN ? ' ' + process.env.PHOTO_CDN_ORIGIN : ''}`,
  "connect-src 'self'",
  "frame-ancestors 'none'",   // clickjacking koruması
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // HSTS sadece canlıda (https) anlamlı
  ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // "X-Powered-By: Next.js" başlığını gizle
  images: {
    remotePatterns: [
      {
        protocol: panel.protocol.replace(':', ''),
        hostname: panel.hostname,
        port: panel.port || '',
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
