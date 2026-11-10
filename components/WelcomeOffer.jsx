'use client'

// İlk ziyarette açılan karşılama kartı: email topla → %15 indirim + new arrivals önceliği.
// Ziyaretçi başına bir kez (localStorage). Email /api/newsletter'a kaydedilir.
import { useEffect, useState } from 'react'

const SEEN = 'zaza-offer-seen'
const serif = '"Cormorant Garamond", Georgia, serif'

export default function WelcomeOffer() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(SEEN) === '1' } catch {}
    if (seen) return
    const t = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(t)
  }, [])

  function close() {
    setOpen(false)
    try { localStorage.setItem(SEEN, '1') } catch {}
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) { setDone(true); try { localStorage.setItem(SEEN, '1') } catch {} }
      else { const d = await res.json().catch(() => ({})); setErr(d.error || 'Please try again.') }
    } catch { setErr('Something went wrong.') }
    finally { setBusy(false) }
  }

  if (!open) return null

  return (
    <div onClick={close}
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(43,33,28,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 440, background: '#FAF6F0', borderRadius: 3, padding: '40px 32px 34px', textAlign: 'center', boxShadow: '0 24px 60px rgba(43,33,28,0.3)' }}>
        <button onClick={close} aria-label="Close"
          style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', fontSize: 22, lineHeight: 1, color: '#B7A890', cursor: 'pointer' }}>×</button>

        {!done ? (
          <>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.42em', color: '#D96835', fontWeight: 500, textTransform: 'uppercase', marginBottom: 14 }}>Join the list</div>
            <h2 style={{ fontFamily: serif, fontSize: '2rem', lineHeight: 1.12, color: '#2B211C', margin: '0 0 10px' }}>15% off your<br />first piece</h2>
            <p style={{ fontSize: '0.92rem', color: '#7A6A5F', lineHeight: 1.55, margin: '0 0 22px' }}>
              Plus first access to new arrivals — our one-of-one pieces reach your inbox before anyone else.
            </p>
            <form onSubmit={submit}>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address" autoFocus
                style={{ width: '100%', padding: '13px 15px', fontSize: '0.95rem', textAlign: 'center', border: '1px solid #E7DDCE', borderRadius: 2, background: '#FFFDF9', color: '#2B211C', outline: 'none' }}
              />
              {err && <p style={{ color: '#9a2c2c', fontSize: '0.8rem', margin: '10px 0 0' }}>{err}</p>}
              <button type="submit" disabled={busy}
                style={{ width: '100%', marginTop: 14, padding: '13px 15px', fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FAF6F0', background: busy ? '#C9BBAA' : '#2B211C', border: 'none', borderRadius: 2, cursor: busy ? 'default' : 'pointer' }}>
                {busy ? 'Claiming…' : 'Claim my 15%'}
              </button>
            </form>
            <button onClick={close} style={{ marginTop: 14, background: 'none', border: 'none', fontSize: '0.78rem', color: '#B7A890', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>No thanks</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.42em', color: '#D96835', fontWeight: 500, textTransform: 'uppercase', marginBottom: 14 }}>You're in</div>
            <h2 style={{ fontFamily: serif, fontSize: '1.8rem', lineHeight: 1.15, color: '#2B211C', margin: '0 0 12px' }}>Welcome to Zaza Luxury</h2>
            <p style={{ fontSize: '0.95rem', color: '#7A6A5F', lineHeight: 1.6, margin: '0 0 18px' }}>
              Use code <b style={{ color: '#2B211C', letterSpacing: '0.08em' }}>WELCOME15</b> for 15% off your first piece. New arrivals will land in your inbox first.
            </p>
            <button onClick={close}
              style={{ padding: '12px 28px', fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FAF6F0', background: '#2B211C', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
              Start browsing
            </button>
          </>
        )}
      </div>
    </div>
  )
}
