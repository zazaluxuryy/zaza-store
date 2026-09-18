import Link from 'next/link'
import { formatUSD } from '@/lib/money'

export default function ProductCard({ product }) {
  const { id, brand, subtype, type, title, price, photos } = product
  const img = (photos && photos[0]) || ''
  const name = title || [brand, subtype].filter(Boolean).join(' ')
  return (
    <Link href={`/product/${id}`} className="card">
      <div className="thumb">
        {img
          ? <img src={img} alt={name} loading="lazy" />
          : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#C4B5A4' }}>No image</div>}
      </div>
      <div className="body">
        {brand && <span className="brand-line">{brand}</span>}
        <span className="title">{name}</span>
        <span className="meta">{[type, subtype].filter(Boolean).join(' · ')}</span>
        <div className="price-row">
          <span className="price">{price != null ? formatUSD(price) : 'Inquire'}</span>
          <span className="view">View →</span>
        </div>
      </div>
    </Link>
  )
}
