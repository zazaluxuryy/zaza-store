'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Sosyal ikonlar (inline SVG — dış istek yok)
const GoogleIcon = () => (
  <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
)
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#1877F2" d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12z"/>
  </svg>
)

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showEmail, setShowEmail] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  function social() {
    setNotice('Social sign-in is coming soon — please continue with email for now.')
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setNotice('')
    try {
      const res = await fetch(`/api/auth/${isSignup ? 'signup' : 'signin'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      window.dispatchEvent(new Event('zaza-auth')) // header'ı tazele
      if (isSignup && data.needsVerification) {
        // DEV modda doğrulama linkini check-email sayfasına taşı
        try {
          if (data.devVerifyLink) sessionStorage.setItem('zaza-dev-verify', data.devVerifyLink)
          else sessionStorage.removeItem('zaza-dev-verify')
        } catch {}
        router.push(`/check-email?email=${encodeURIComponent(email)}`)
        return
      }
      router.push('/')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <h1>{isSignup ? 'Join Zaza Luxury' : 'Welcome back'}</h1>
      <p className="sub">
        {isSignup
          ? 'Create an account to follow one-of-one pieces and check out faster.'
          : 'Sign in to your Zaza Luxury account.'}
      </p>

      <div className="socials">
        <button type="button" className="btn-social" onClick={social}>
          <GoogleIcon /> <span>Continue with Google</span>
        </button>
        <button type="button" className="btn-social" onClick={social}>
          <AppleIcon /> <span>Continue with Apple</span>
        </button>
        <button type="button" className="btn-social" onClick={social}>
          <FacebookIcon /> <span>Continue with Facebook</span>
        </button>
      </div>

      {notice && <div className="notice" role="status">{notice}</div>}

      {!showEmail ? (
        <p className="alt">
          Or {isSignup ? 'register' : 'sign in'} with{' '}
          <button type="button" className="linkish" onClick={() => setShowEmail(true)}>email</button>
        </p>
      ) : (
        <form onSubmit={submit} className="email-form">
          {isSignup && (
            <label>
              <span>Name</span>
              <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Your name" />
            </label>
          )}
          <label>
            <span>Email</span>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder={isSignup ? 'At least 8 characters' : 'Your password'} />
          </label>
          {error && <div className="notice error">{error}</div>}
          <button className="btn terra block" disabled={loading}>
            {loading ? 'Please wait…' : (isSignup ? 'Create account' : 'Sign in')}
          </button>
        </form>
      )}

      <p className="alt">
        {isSignup
          ? <>Already have an account? <Link href="/signin">Log in</Link></>
          : <>New to Zaza Luxury? <Link href="/signup">Create an account</Link></>}
      </p>
    </div>
  )
}
