import { NextResponse } from 'next/server'

// Önizleme kilidi: PREVIEW_GATE=1 iken site PIN'siz görülemez (public değil).
// Doğru PIN → zaza_preview cookie'si → tam müşteri görünümü. Prod'da açılınca PREVIEW_GATE=0.
const COOKIE = 'zaza_preview'
const expectedPin = () => process.env.PREVIEW_PIN || '1907'

export function middleware(req) {
  if (process.env.PREVIEW_GATE !== '1') return NextResponse.next()   // kilit kapalı → herkese açık
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/gate') || pathname.startsWith('/api/gate')) return NextResponse.next()
  if (req.cookies.get(COOKIE)?.value === expectedPin()) return NextResponse.next()
  const url = req.nextUrl.clone()
  url.pathname = '/gate'
  url.search = pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|logo-full.png|robots.txt|sitemap.xml).*)'],
}
