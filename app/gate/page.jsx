'use client'

import { useState } from 'react'

// Önizleme kapısı: PIN gir → doğruysa siteyi müşteri gibi gör. Marka diliyle (serif + terra).
export default function GatePage() {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (res.ok) {
        const next = new URLSearchParams(window.location.search).get('next') || '/'
        window.location.href = next
      } else {
        setErr('Incorrect PIN'); setBusy(false)
      }
    } catch {
      setErr('Something went wrong'); setBusy(false)
    }
  }

  const serif = '"Cormorant Garamond", Georgia, serif'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF6F0', padding: 24, overflow: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <img src="/logo-mark.png" alt="" style={{ height: 68, width: 'auto', margin: '0 auto 18px', display: 'block' }} />
        <div style={{ fontFamily: serif, fontSize: '2rem', lineHeight: 1.1, color: '#2B211C', letterSpacing: '0.02em' }}>Zaza Luxury</div>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.42em', color: '#D96835', fontWeight: 500, marginTop: 8, textTransform: 'uppercase' }}>Private Preview</div>

        <div style={{ height: 1, background: '#E7DDCE', margin: '28px auto', width: 64 }} />

        <p style={{ fontSize: '0.9rem', color: '#7A6A5F', margin: '0 0 24px', lineHeight: 1.55 }}>
          This boutique is not open to the public yet.<br />Enter the access PIN to preview the collection.
        </p>

        <form onSubmit={submit}>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="• • • •"
            autoFocus
            style={{ width: '100%', padding: '14px 16px', fontSize: '1.05rem', textAlign: 'center', letterSpacing: '0.5em', border: '1px solid #E7DDCE', borderRadius: 2, background: '#FFFDF9', color: '#2B211C', outline: 'none', fontFamily: serif }}
          />
          {err && <p style={{ color: '#9a2c2c', fontSize: '0.82rem', margin: '12px 0 0' }}>{err}</p>}
          <button
            type="submit"
            disabled={busy || !pin.trim()}
            style={{ width: '100%', marginTop: 16, padding: '14px 16px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FAF6F0', background: busy || !pin.trim() ? '#C9BBAA' : '#2B211C', border: 'none', borderRadius: 2, cursor: busy || !pin.trim() ? 'default' : 'pointer', transition: 'background 0.2s' }}
          >
            {busy ? 'Entering…' : 'Enter'}
          </button>
        </form>

        <div style={{ fontSize: '0.68rem', color: '#B7A890', marginTop: 28, letterSpacing: '0.04em' }}>Authenticated · One of one</div>
      </div>
    </div>
  )
}
