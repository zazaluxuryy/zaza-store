'use client'

// Mağaza vitrini: solda marka/kategori filtreleri, üstte sıralama.
// Katalog küçük → filtre/sort client-side (anında). İlk render sunucudan gelir (SEO korunur).
import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'

const SORTS = [
  { key: 'new', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'brand', label: 'Brand: A–Z' },
]

function countBy(list, key) {
  const m = new Map()
  for (const p of list) {
    const v = (p[key] || '').trim()
    if (!v) continue
    m.set(v, (m.get(v) || 0) + 1)
  }
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

// API zaten en yeni (no'su büyük) üstte veriyor → orijinal sıra = eklenme tarihi
function recency(p, products) { return products.indexOf(p) }

// Bir ürünün aranabilir metni (kartta görünen başlık dahil)
function haystack(p) {
  return [p.brand, p.type, p.subtype, p.title].filter(Boolean).join(' ').toLowerCase()
}

export default function CollectionBrowser({ products }) {
  const [brand, setBrand] = useState(null)   // null = All
  const [type, setType] = useState(null)
  const [sort, setSort] = useState('new')
  const [query, setQuery] = useState('')

  const brands = useMemo(() => countBy(products, 'brand'), [products])
  const types = useMemo(() => countBy(products, 'type'), [products])

  const shown = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    let list = products.filter(p => {
      if (brand && p.brand !== brand) return false
      if (type && p.type !== type) return false
      if (terms.length) {
        const hay = haystack(p)
        if (!terms.every(t => hay.includes(t))) return false
      }
      return true
    })
    switch (sort) {
      case 'price-asc':  list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break
      case 'price-desc': list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1)); break
      case 'brand':      list = [...list].sort((a, b) => (a.brand || '').localeCompare(b.brand || '')); break
      default:           list = [...list].sort((a, b) => recency(a, products) - recency(b, products))
    }
    return list
  }, [products, brand, type, sort, query])

  const hasFilter = brand || type || query.trim()
  function clearAll() { setBrand(null); setType(null); setQuery('') }

  return (
    <div className="shop">
      {/* ── Sol filtre sütunu ── */}
      <aside className="filters">
        <div className="fgroup">
          <h4>Maison</h4>
          <ul>
            <li>
              <button className={!brand ? 'active' : ''} onClick={() => setBrand(null)}>
                All <span>{products.length}</span>
              </button>
            </li>
            {brands.map(([b, n]) => (
              <li key={b}>
                <button className={brand === b ? 'active' : ''} onClick={() => setBrand(brand === b ? null : b)}>
                  {b} <span>{n}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="fgroup">
          <h4>Category</h4>
          <ul>
            <li>
              <button className={!type ? 'active' : ''} onClick={() => setType(null)}>
                All <span>{products.length}</span>
              </button>
            </li>
            {types.map(([t, n]) => (
              <li key={t}>
                <button className={type === t ? 'active' : ''} onClick={() => setType(type === t ? null : t)}>
                  {t} <span>{n}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Ürünler ── */}
      <div className="shop-main">
        {/* Mobil filtre çubuğu — dar ekranda çip yığını yerine kompakt açılır menüler.
            Masaüstünde gizli (soldaki kenar çubuğu kullanılır). */}
        <div className="mfilters">
          <label>
            <span>Maison</span>
            <select value={brand ?? ''} onChange={(e) => setBrand(e.target.value || null)} aria-label="Filter by maison">
              <option value="">All maisons ({products.length})</option>
              {brands.map(([b, n]) => <option key={b} value={b}>{b} ({n})</option>)}
            </select>
          </label>
          <label>
            <span>Category</span>
            <select value={type ?? ''} onChange={(e) => setType(e.target.value || null)} aria-label="Filter by category">
              <option value="">All categories ({products.length})</option>
              {types.map(([t, n]) => <option key={t} value={t}>{t} ({n})</option>)}
            </select>
          </label>
        </div>

        {/* Arama kutusu */}
        <div className="searchbar">
          <svg className="s-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand, style or keyword…"
            aria-label="Search the collection"
          />
          {query && (
            <button className="s-clear" onClick={() => setQuery('')} aria-label="Clear search">✕</button>
          )}
        </div>

        <div className="toolbar">
          <span className="count">
            {shown.length} piece{shown.length === 1 ? '' : 's'}
            {hasFilter && (
              <button className="clear" onClick={clearAll}>
                Clear all ✕
              </button>
            )}
          </span>
          <label className="sort">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
        </div>

        {shown.length === 0 ? (
          <div className="empty">
            <h2>No pieces match</h2>
            <p>
              {query.trim()
                ? <>Nothing matches “{query.trim()}”. Try a different search or <button className="linklike" onClick={clearAll}>clear all</button>.</>
                : <>Try clearing the filters to see the full collection.</>}
            </p>
          </div>
        ) : (
          <div className="grid">
            {shown.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
