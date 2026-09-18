import Link from 'next/link'
import { getProducts } from '@/lib/panel'
import CollectionBrowser from '@/components/CollectionBrowser'
import { ExploreLink, IntroController } from '@/components/HeroGate'
import ComingSoon from '@/components/ComingSoon'

// ISR: sayfa 60 sn'de bir yeniden üretilir (panelde yayın/satış değişince güncellenir).
export const revalidate = 60

const COMING_SOON = process.env.COMING_SOON === '1'

export default async function HomePage() {
  // "Yakında" modu: ürünler yüklenene / açılışa kadar teaser göster
  if (COMING_SOON) return <ComingSoon />

  const products = await getProducts()

  return (
    <>
      {/* ── Hero: TAM ekran fotoğraf, içerik alt-solda ── */}
      <section className="hero">
        <div className="hero-inner">
          <img src="/logo-full.png" alt="Zaza Luxury" className="hero-logo" />
          <h1>
            Pre-owned luxury,<br />
            chosen with <span className="accent">intention</span>
          </h1>
          <p className="lead">
            Authenticated designer pieces, curated one by one.
            Each is the only one — once it finds its home, it&apos;s gone.
          </p>
          <div className="hero-cta">
            <ExploreLink>Explore the collection</ExploreLink>
          </div>
          <div className="hero-hint">Authenticated · One of one</div>
        </div>
      </section>
      <IntroController />

      {/* ── Sessiz güvence satırı ── */}
      <div className="assure-line">
        <span>Authenticated by specialists</span>
        <span>One of one</span>
        <span>Secure checkout · Stripe</span>
        <span>Insured shipping</span>
      </div>

      {/* ── Collection ── */}
      <section className="container" id="collection">
        <div className="section-title">
          <h2>The Collection</h2>
        </div>

        {products.length === 0 ? (
          <div className="empty">
            <h2>The collection is being refreshed</h2>
            <p>New authenticated pieces are added regularly. Please check back soon.</p>
          </div>
        ) : (
          <CollectionBrowser products={products} />
        )}
      </section>
    </>
  )
}
