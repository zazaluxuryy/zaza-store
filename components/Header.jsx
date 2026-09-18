'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { useCart } from '@/lib/cart-context'

export default function Header() {
  const { count, ready } = useCart()
  const [user, setUser] = useState(null)

  const refresh = useCallback(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('zaza-auth', refresh)
    return () => window.removeEventListener('zaza-auth', refresh)
  }, [refresh])

  async function signOut() {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }

  const needsVerify = user && !user.emailVerified

  return (
    <header className="site-header">
      {needsVerify && (
        <div className="verify-bar">
          Please confirm your email address —{' '}
          <a href={`/check-email?email=${encodeURIComponent(user.email)}`}>resend link</a>
        </div>
      )}
      <div className="container bar">
        <Link href="/" className="brand" aria-label="Zaza Luxury — home">
          <img src="/logo-mark.png" alt="" className="brand-mark" />
          <span className="brand-text">
            Zaza Luxury
            <small>Authenticated Pre-Owned</small>
          </span>
        </Link>
        <nav className="nav-actions">
          <Link href="/#collection">Shop</Link>
          <Link href="/authentication">Our Promise</Link>
          {user ? (
            <span className="account">
              <span className="hello">{user.name || user.email.split('@')[0]}</span>
              <button className="linkish" onClick={signOut}>Sign out</button>
            </span>
          ) : (
            <Link href="/signin">Sign In</Link>
          )}
          <Link href="/cart" className="cart-link">
            Cart
            {ready && count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
