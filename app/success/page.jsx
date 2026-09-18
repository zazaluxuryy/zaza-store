import { Suspense } from 'react'
import SuccessView from '@/components/SuccessView'

export const metadata = { title: 'Order Confirmed', robots: { index: false } }

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 0' }} />}>
      <SuccessView />
    </Suspense>
  )
}
