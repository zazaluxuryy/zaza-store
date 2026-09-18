'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { formatUSD } from '@/lib/money'

export default function CartView() {
  const { items, remove, total, ready } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!ready) return <div className="container" style={{ padding: '60px 0' }} />

  if (items.length === 0) {
    return (
      <div className="container empty">
        <h2>Your cart is empty</h2>
        <p>Discover authenticated one-of-one pieces.</p>
        <div style={{ marginTop: 26 }}>
          <Link href="/" className="btn">Browse the collection</Link>
        </div>
      </div>
    )
  }

  async function checkout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: items.map((i) => i.id) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout could not be started.')
      if (data.url) {
        window.location.href = data.url // Stripe hosted checkout (veya mock success)
        return
      }
      throw new Error('No checkout URL returned.')
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-head"><h1>Shopping Cart</h1></div>
      <div className="cart-layout">
        <div>
          {items.map((it) => (
            <div className="cart-row" key={it.id}>
              <Link href={`/product/${it.id}`} className="cimg">
                {it.photo ? <img src={it.photo} alt={it.title} /> : null}
              </Link>
              <div>
                {it.brand && <div className="cbrand">{it.brand}</div>}
                <Link href={`/product/${it.id}`} className="ctitle">{it.title}</Link>
                <div><button className="link-danger" onClick={() => remove(it.id)}>Remove</button></div>
              </div>
              <div className="cprice" style={{ fontWeight: 600 }}>{formatUSD(it.price)}</div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Order Summary</h3>
          <div className="line"><span>Subtotal ({items.length})</span><span>{formatUSD(total)}</span></div>
          <div className="line"><span>Shipping</span><span>Calculated at checkout</span></div>
          <div className="line total"><span>Total</span><span>{formatUSD(total)}</span></div>
          {error && <div className="notice error" style={{ marginTop: 16 }}>{error}</div>}
          <button className="btn block terra" style={{ marginTop: 18 }} onClick={checkout} disabled={loading}>
            {loading ? 'Starting secure checkout…' : 'Checkout'}
          </button>
          <p className="note">Secure card payment powered by Stripe. Your card details never touch our servers.</p>
        </aside>
      </div>
    </div>
  )
}
