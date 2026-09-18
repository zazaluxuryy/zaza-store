import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { recordSale } from '@/lib/panel'

// Webhook imzası ham gövde ister → dinamik + Node runtime.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const sig = req.headers.get('stripe-signature')
  const raw = await req.text() // HAM gövde (parse etme!)

  let event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
  }

  // Ödeme tamamlandı → satışı panele yaz (ürünler 'sold' olur).
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    // Sadece gerçekten ödendiyse işle.
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true, skipped: 'unpaid' })
    }

    const productIds = String(session.metadata?.productIds || '')
      .split(',').map((s) => s.trim()).filter(Boolean)
    if (productIds.length === 0) {
      return NextResponse.json({ received: true, skipped: 'no productIds' })
    }

    const cd = session.customer_details || {}
    const buyer = {
      name: cd.name || '',
      email: cd.email || '',
      phone: cd.phone || '',
      address: cd.address || null,
    }

    try {
      await recordSale({
        idempotencyKey: session.id, // Stripe aynı event'i tekrar gönderirse çift satış olmaz
        paymentRef: session.payment_intent || session.id,
        items: productIds.map((id) => ({ productId: id })),
        buyer,
      })
    } catch (e) {
      // Panel geçici olarak ulaşılamazsa 500 dön → Stripe otomatik yeniden dener.
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
