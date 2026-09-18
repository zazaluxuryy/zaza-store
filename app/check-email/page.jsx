import { Suspense } from 'react'
import CheckEmailView from '@/components/CheckEmailView'

export const metadata = { title: 'Check Your Email', robots: { index: false } }

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div className="auth"><h1>Check your email</h1></div>}>
      <CheckEmailView />
    </Suspense>
  )
}
