'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CheckEmailView() {
  const params = useSearchParams()
  const email = params.get('email') || 'your inbox'
  const [devLink, setDevLink] = useState('')
  const [resent, setResent] = useState('')

  // DEV modda signup response'taki link sessionStorage'a konur (gerçek mail gitmez)
  useEffect(() => {
    try {
      const l = sessionStorage.getItem('zaza-dev-verify')
      if (l) setDevLink(l)
    } catch {}
  }, [])

  async function resend() {
    setResent('')
    const res = await fetch('/api/auth/resend-verification', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setResent('A new confirmation email has been sent.')
      if (data.devVerifyLink) {
        setDevLink(data.devVerifyLink)
        try { sessionStorage.setItem('zaza-dev-verify', data.devVerifyLink) } catch {}
      }
    } else {
      setResent(data.error || 'Could not resend right now.')
    }
  }

  return (
    <div className="auth">
      <h1>Check your email</h1>
      <p className="sub">
        We sent a confirmation link to <strong>{email}</strong>.
        Click it to complete your account — the link expires in 24 hours.
      </p>
      <p className="alt">
        Didn&apos;t get it?{' '}
        <button type="button" className="linkish" onClick={resend}>Resend email</button>
      </p>
      {resent && <div className="notice" role="status">{resent}</div>}
      {devLink && (
        <div className="notice" style={{ marginTop: 16 }}>
          <strong>DEV MODE</strong> — e-posta servisi bağlı değil, test için doğrulama linki:{' '}
          <a href={devLink} style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>{devLink}</a>
        </div>
      )}
    </div>
  )
}
