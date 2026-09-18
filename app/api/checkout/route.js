import { NextResponse } from 'next/server'
import { getProductFresh, recordSale } from '@/lib/panel'
import { getStripe, isMockCheckout } from '@/lib/stripe'
import { toCents } from '@/lib/money'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

export async function POST(req) {
  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const ids = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : []
  if (ids.length === 0) return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })

  // Fiyata client'a GÜVENME → her ürünü panelden taze oku ve hâlâ satılık mı doğrula.
  const products = []
  for (const id of ids) {
    const p = await getProductFresh(id)
    if (!p) {
      return NextResponse.json(
        { error: 'One or more items are no longer available and were likely just sold. Please review your cart.' },
        { status: 409 },
      )
    }
    if (p.price == null || Number(p.price) <= 0) {
      return NextResponse.json({ error: `"${p.title || p.brand}" is not available for online purchase.` }, { status: 409 })
    }
    products.push(p)
  }

  const stripe = getStripe()

  // ── Gerçek Stripe Checkout (hosted) ────────────────────────────────────────
  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: products.map((p) => ({
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: toCents(p.price),
            product_data: {
              name: p.title || [p.brand, p.subtype].filter(Boolean).join(' '),
              description: [p.brand, p.type, p.subtype].filter(Boolean).join(' · '),
              images: (p.photos || []).slice(0, 1)
                .map((u) => (/^https?:\/\//i.test(u) ? u : null)).filter(Boolean),
              metadata: { productId: p.id },
            },
          },
        })),
        // Ürün id'lerini metadata'ya koy → webhook satışı bu id'lerle kaydeder.
        metadata: { productIds: products.map((p) => p.id).join(',') },
        payment_intent_data: { metadata: { productIds: products.map((p) => p.id).join(',') } },
        shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'TR', 'DE', 'FR', 'AE'] },
        phone_number_collection: { enabled: true },
        success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/cart`,
      })
      return NextResponse.json({ url: session.url })
    } catch (e) {
      return NextResponse.json({ error: 'Payment could not be started. Please try again.' }, { status: 502 })
    }
  }

  // ── DEV MOCK: Stripe anahtarı yok → ödemeyi simüle et, satışı panele yaz ────
  // SADECE local test. Gerçek para alınmaz. Canlıda STRIPE anahtarları zorunlu.
  if (isMockCheckout()) {
    try {
      await recordSale({
        idempotencyKey: 'mock_' + ids.slice().sort().join('_'),
        paymentRef: 'DEV-MOCK',
        items: products.map((p) => ({ productId: p.id, price: p.price })),
        buyer: { name: 'Test Buyer', email: 'test@example.com' },
      })
      return NextResponse.json({ url: `${SITE_URL}/success?mock=1` })
    } catch (e) {
      return NextResponse.json({ error: e.message || 'Mock checkout failed.' }, { status: 500 })
    }
  }

  return NextResponse.json(
    { error: 'Payments are not configured yet. Add your Stripe keys to enable checkout.' },
    { status: 503 },
  )
}
