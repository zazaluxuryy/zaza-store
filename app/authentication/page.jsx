import Link from 'next/link'
import PolicyIcon from '@/components/PolicyIcon'

export const metadata = {
  title: 'Authentication — Our Promise',
  description:
    'Every Zaza Luxury piece is verified with state-of-the-art authentication technology and reviewed by industry experts. Each item ships with a Certificate of Authenticity (COA).',
}

export default function AuthenticationPage() {
  return (
    <div className="authpage">
      {/* ── Giriş ── */}
      <section className="authpage-hero">
        <div className="container">
          <span className="kicker">Our Promise</span>
          <h1>Authenticity, <span className="accent">guaranteed</span></h1>
          <p className="sub">
            The first question in pre-owned luxury is always the same: <em>is it real?</em>
            <br />At Zaza Luxury, that question is answered before a piece ever reaches the shelf.
          </p>
        </div>
      </section>

      {/* ── Üç taahhüt ── */}
      <section className="container authpage-pillars">
        <div className="pillar">
          <PolicyIcon name="scope" />
          <span className="num">01</span>
          <h2>State-of-the-art technology</h2>
          <p>
            Every piece is examined with the latest authentication technology —
            high-magnification imaging and material analysis that verify stitching,
            hardware, stamps and date codes against the maison&apos;s originals.
          </p>
        </div>
        <div className="pillar">
          <PolicyIcon name="shield" />
          <span className="num">02</span>
          <h2>Verified by industry experts</h2>
          <p>
            Technology never works alone. We partner with professional authenticators —
            experts who have handled thousands of genuine pieces — and no item is listed
            until it passes their review.
          </p>
        </div>
        <div className="pillar">
          <PolicyIcon name="certificate" />
          <span className="num">03</span>
          <h2>Certificate of Authenticity</h2>
          <p>
            Every single piece ships with its own Certificate of Authenticity (COA) —
            your document of proof, included with your order at no extra cost.
          </p>
        </div>
      </section>

      {/* ── Süreç ── */}
      <section className="authpage-process">
        <div className="container">
          <h3>From sourcing to your door</h3>
          <ol className="steps">
            <li><span>Sourced</span>Hand-picked, one piece at a time</li>
            <li><span>Inspected</span>Technology-assisted examination</li>
            <li><span>Expert-verified</span>Reviewed by professional authenticators</li>
            <li><span>Certified</span>COA issued for the piece</li>
            <li><span>Shipped</span>Insured, tracked delivery</li>
          </ol>
        </div>
      </section>

      {/* ── Orijinallik garantisi ── */}
      <section className="container guarantee">
        <div className="guarantee-box">
          <span className="kicker">Our Guarantee</span>
          <h3>Authenticity, or your money back</h3>
          <p>
            If the authenticity of a piece is ever in question — supported by a reputable
            authenticator&apos;s assessment — we refund you in full, including shipping.
            No time limit, no fine print. See{' '}
            <Link href="/shipping">Shipping &amp; Returns</Link> for details.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container authpage-cta">
        <p>Every piece in the collection has already earned its certificate.</p>
        <Link href="/#collection" className="btn terra">Shop with confidence</Link>
      </section>
    </div>
  )
}
