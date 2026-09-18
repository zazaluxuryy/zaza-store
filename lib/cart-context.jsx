'use client'

// Sepet: auth yok → tamamen tarayıcıda (localStorage). Her ürün tekil (adet=1),
// çünkü envanterde her parçadan bir tane var (satılınca düşer).
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CartCtx = createContext(null)
const KEY = 'zaza-cart-v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [ready, setReady] = useState(false)

  // İlk yüklemede localStorage'dan oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setReady(true)
  }, [])

  // Değişince kaydet
  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
  }, [items, ready])

  const add = useCallback((product) => {
    setItems((prev) => (prev.some((p) => p.id === product.id)
      ? prev
      : [...prev, {
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          photo: (product.photos && product.photos[0]) || '',
        }]))
  }, [])

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const has = useCallback((id) => items.some((p) => p.id === id), [items])

  const total = items.reduce((s, p) => s + (Number(p.price) || 0), 0)

  return (
    <CartCtx.Provider value={{ items, add, remove, clear, has, total, count: items.length, ready }}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
