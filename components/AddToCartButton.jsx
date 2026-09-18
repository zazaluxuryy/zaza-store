'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

export default function AddToCartButton({ product }) {
  const { add, has, ready } = useCart()
  const router = useRouter()
  const inCart = ready && has(product.id)

  if (inCart) {
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn outline" disabled>In your cart ✓</button>
        <button className="btn terra" onClick={() => router.push('/cart')}>Go to cart</button>
      </div>
    )
  }
  return (
    <button className="btn block terra" onClick={() => { add(product); router.push('/cart') }}>
      Add to cart
    </button>
  )
}
