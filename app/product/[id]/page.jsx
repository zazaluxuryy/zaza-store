import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/panel'
import { formatUSD } from '@/lib/money'
import ProductGallery from '@/components/ProductGallery'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 60

// Yayınlanmış ürünleri statik üret (SEO + hız). Yenileri ISR ile eklenir.
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ id: p.id }))
}

// Her ürün için başlık/açıklama/OG görseli → Google & sosyal paylaşım.
export async function generateMetadata({ params }) {
  const { id } = await params
  const p = await getProduct(id)
  if (!p) return { title: 'Product not found' }
  const name = p.title || [p.brand, p.subtype].filter(Boolean).join(' ')
  const desc = (p.description && p.description.slice(0, 160)) || `${name}${p.price != null ? ` · ${formatUSD(p.price)}` : ''}. Authenticated pre-owned luxury at Zaza Luxury.`
  return {
    title: name,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      images: p.photos?.length ? [{ url: p.photos[0] }] : [],
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const p = await getProduct(id)
  if (!p) notFound()

  const name = p.title || [p.brand, p.subtype].filter(Boolean).join(' ')

  // Ürün için yapılandırılmış veri (Google Rich Results / Merchant)
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image: p.photos || [],
    brand: { '@type': 'Brand', name: p.brand || 'Zaza Luxury' },
    category: [p.type, p.subtype].filter(Boolean).join(' / '),
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: p.price ?? undefined,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
    },
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/">Shop</Link> &nbsp;/&nbsp; {p.brand} &nbsp;/&nbsp; <span>{name}</span>
      </div>

      <div className="pdp">
        <ProductGallery photos={p.photos} alt={name} />

        <div className="info">
          {p.brand && <span className="brand-line">{p.brand}</span>}
          <h1>{name}</h1>
          <div className="price">{p.price != null ? formatUSD(p.price) : 'Price on request'}</div>

          {p.description && <p style={{ margin: '0 0 1.5rem', lineHeight: 1.65, color: '#4a4038' }}>{p.description}</p>}

          <AddToCartButton product={p} />

          <div className="specs">
            {p.brand && <div><div className="k">Maison</div>{p.brand}</div>}
            {p.model && <div><div className="k">Model</div>{p.model}</div>}
            {p.type && <div><div className="k">Category</div>{p.type}</div>}
            {p.subtype && <div><div className="k">Style</div>{p.subtype}</div>}
            {p.color && <div><div className="k">Colour</div>{p.color}</div>}
            {p.material && <div><div className="k">Material</div>{p.material}</div>}
            {p.condition && <div><div className="k">Condition</div>{p.condition}</div>}
            {p.measurements && <div><div className="k">Dimensions</div>{p.measurements}</div>}
            {p.dateCode && <div><div className="k">Date code</div>{p.dateCode}</div>}
            {p.era && <div><div className="k">Era</div>{p.era}</div>}
            {p.completeness && <div><div className="k">Included</div>{p.completeness}</div>}
          </div>

          {p.conditionNotes && (
            <div style={{ margin: '0.25rem 0 1.5rem' }}>
              <div className="k" style={{ marginBottom: 4 }}>Condition notes</div>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#6b5f52', fontSize: '0.92rem' }}>{p.conditionNotes}</p>
            </div>
          )}

          <div className="assurance">
            <span><i>✦</i> <Link href="/authentication" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>Expert-authenticated — ships with COA</Link></span>
            <span><i>✦</i> One-of-one — only a single unit available</span>
            <span><i>✦</i> Secure card checkout via Stripe</span>
            <span><i>✦</i> Insured, tracked worldwide shipping</span>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
