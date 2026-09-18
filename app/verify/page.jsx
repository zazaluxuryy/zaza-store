import { Suspense } from 'react'
import VerifyView from '@/components/VerifyView'

export const metadata = { title: 'Confirm Email', robots: { index: false } }

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="auth"><h1>Confirming…</h1></div>}>
      <VerifyView />
    </Suspense>
  )
}
