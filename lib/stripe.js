import Stripe from 'stripe'

// Stripe anahtarı varsa client döner, yoksa null (mock/dev modu).
let _stripe = null
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!_stripe) _stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' })
  return _stripe
}

// Mock checkout aktif mi? (Stripe anahtarı yok VE dev-mock açık)
export function isMockCheckout() {
  return !process.env.STRIPE_SECRET_KEY && process.env.STORE_DEV_MOCK_CHECKOUT === '1'
}
