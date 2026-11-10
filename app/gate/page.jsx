'use client'

import { useState } from 'react'

// Önizleme kapısı: PIN gir → doğruysa siteyi müşteri gibi gör.
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F3EE', padding: 24 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <img src="/logo-full.png" alt="Zaza Luxury" style={{ height: 54, marginBottom: 28, opacity: 0.95 }} />
        <h1 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#2b2622', margin: '0 0 6px' }}>Private preview</h1>
        <p style={{ fontSize: '0.85rem', color: '#8a7d6f', margin: '0 0 22px' }}>Enter the access PIN to view the store.</p>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          autoFocus
          style={{ width: '100%', padding: '12px 14px', fontSize: '1rem', textAlign: 'center', letterSpacing: 4, border: '1px solid #d8cdbf', borderRadius: 6, background: '#fff', color: '#2b2622', outline: 'none' }}
        />
        {err && <p style={{ color: '#b4463a', fontSize: '0.82rem', margin: '10px 0 0' }}>{err}</p>}
        <button
          type="submit"
          disabled={busy || !pin.trim()}
          style={{ width: '100%', marginTop: 16, padding: '12px 14px', fontSize: '0.95rem', fontWeight: 600, color: '#fff', background: busy ? '#b7a890' : '#2b2622', border: 'none', borderRadius: 6, cursor: busy ? 'default' : 'pointer' }}
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
