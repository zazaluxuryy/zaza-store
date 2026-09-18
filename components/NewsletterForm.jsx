'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | ok | error
  const [message, setMessage] = useState('')

  async function submit(e) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setState('ok')
      setMessage('Welcome — new pieces will reach your inbox first.')
      setEmail('')
    } catch (err) {
      setState('error')
      setMessage(err.message)
    }
  }

  if (state === 'ok') {
    return <p className="nl-done" role="status">✦ {message}</p>
  }

  return (
    <form className="nl-form" onSubmit={submit}>
      <input
        type="email" required placeholder="Your email address"
        value={email} onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address for the newsletter"
      />
      <button className="btn terra sm" disabled={state === 'loading'}>
        {state === 'loading' ? '…' : 'Join'}
      </button>
      {state === 'error' && <p className="nl-error" role="alert">{message}</p>}
    </form>
  )
}
