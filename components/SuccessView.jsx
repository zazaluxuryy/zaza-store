'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart-context'

export default function SuccessView() {
  const { clear } = useCart()
  // Ödeme başarıyla döndü → sepeti temizle.
  useEffect(() => { clear() }, [clear])

  return (
    <div className="container success">
      <div className="check">✓</div>
      <h1>Thank you for your order</h1>
      <p>
        Your payment was received and your order is confirmed. A receipt has been sent to your email.
        Our team will authenticate, carefully pack and ship your piece with insured tracking.
      </p>
      <div style={{ marginTop: 30 }}>
        <Link href="/" className="btn">Continue shopping</Link>
      </div>
    </div>
  )
}
