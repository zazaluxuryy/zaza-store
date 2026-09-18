// Basit bellek-içi rate limiter (sliding window).
// Tek sunucu için yeterli; ölçeklenince Redis'e taşınır.
const buckets = new Map()

// key başına: windowMs içinde en fazla max istek
export function rateLimit(key, { max = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now()
  const arr = (buckets.get(key) || []).filter(t => now - t < windowMs)
  if (arr.length >= max) {
    buckets.set(key, arr)
    return { ok: false, retryAfterSec: Math.ceil((arr[0] + windowMs - now) / 1000) }
  }
  arr.push(now)
  buckets.set(key, arr)
  // hafıza şişmesin
  if (buckets.size > 10000) {
    for (const [k, v] of buckets) if (v.every(t => now - t > windowMs)) buckets.delete(k)
  }
  return { ok: true }
}

export function clientIp(req) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
         req.headers.get('x-real-ip') || 'local'
}
