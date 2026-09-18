'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyView() {
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [state, setState] = useState('working') // working | ok | fail

  useEffect(() => {
    if (!token) { setState('fail'); return }
    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok }) => {
        setState(ok ? 'ok' : 'fail')
        if (ok) window.dispatchEvent(new Event('zaza-auth'))
      })
      .catch(() => setState('fail'))
  }, [token])

  if (state === 'working') {
    return <div className="auth"><h1>Confirming…</h1><p className="sub">One moment, please.</p></div>
  }
  if (state === 'ok') {
    return (
      <div className="success">
        <div className="check">✓</div>
        <h1>Email confirmed</h1>
        <p>Your account is fully verified. Welcome to Zaza Luxury.</p>
        <div style={{ marginTop: 30 }}>
          <Link href="/" className="btn">Explore the collection</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="auth">
      <h1>Link invalid or expired</h1>
      <p className="sub">This confirmation link is no longer valid. Sign in and request a new one.</p>
      <div style={{ marginTop: 24 }}>
        <Link href="/signin" className="btn">Sign in</Link>
      </div>
    </div>
  )
}
