// Panel backend'iyle konuşan sunucu tarafı yardımcılar.
// SADECE server component / route handler içinde çağrılır — origin ve secret sızmaz.

export const PANEL_ORIGIN = process.env.PANEL_ORIGIN || 'http://localhost:3002'

// Relative "/uploads/..." fotoğraf url'sini panel origin'iyle mutlak hale getir.
export function photoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return PANEL_ORIGIN.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url)
}

// Bir ürünün gösterilecek fotoğraflarını mutlak url dizisine çevir.
export function withAbsolutePhotos(product) {
  if (!product) return product
  return { ...product, photos: (product.photos || []).map(photoUrl) }
}

// Yayınlanmış tüm ürünler. Katalog için. ISR ile tazelenir.
export async function getProducts() {
  try {
    const res = await fetch(`${PANEL_ORIGIN}/api/store/products`, {
      next: { revalidate: 60 }, // ISR: 60 sn'de bir yeniden doğrula
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.products || []).map(withAbsolutePhotos)
  } catch {
    // Panel kapalıysa mağaza çökmesin — boş katalog dön.
    return []
  }
}

// Tek ürün (detay sayfası). Yoksa null.
export async function getProduct(id) {
  try {
    const res = await fetch(`${PANEL_ORIGIN}/api/store/products/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.product ? withAbsolutePhotos(data.product) : null
  } catch {
    return null
  }
}

// Checkout anında ürünün GÜNCEL / otoriter halini al (fiyata client'a güvenme).
// Cache YOK — her seferinde panelden taze oku.
export async function getProductFresh(id) {
  try {
    const res = await fetch(`${PANEL_ORIGIN}/api/store/products/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.product || null
  } catch {
    return null
  }
}

// Panele satışı kaydet (ödeme doğrulandıktan SONRA). Ürünleri 'sold' yapar.
export async function recordSale({ idempotencyKey, paymentRef, items, buyer }) {
  const res = await fetch(`${PANEL_ORIGIN}/api/store/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Store-Secret': process.env.STORE_SECRET || '',
    },
    body: JSON.stringify({ idempotencyKey, paymentRef, items, buyer }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Panel sale failed (${res.status})`)
  return data
}
