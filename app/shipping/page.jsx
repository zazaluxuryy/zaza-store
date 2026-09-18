import Link from 'next/link'
import PolicyIcon from '@/components/PolicyIcon'

export const metadata = {
  title: 'Shipping & Returns',
  description:
    'Insured, tracked shipping on every Zaza Luxury order. 7-day returns and a lifetime authenticity guarantee — full refund if authenticity is ever in question.',
}

export default function ShippingPage() {
  return (
    <div className="authpage">
      <section className="authpage-hero">
        <div className="container">
          <span className="kicker">Client Care</span>
          <h1>Shipping <span className="accent">&</span> Returns</h1>
          <p className="sub">
            Every piece is one of one — so we pack, insure and ship each order
            as carefully as we sourced it.
          </p>
        </div>
      </section>

      {/* ── Kargo ── */}
      <section className="container authpage-pillars policy">
        <div className="pillar">
          <PolicyIcon name="truck" />
          <span className="num">Shipping</span>
          <h2>Insured &amp; tracked, always</h2>
          <p>
            Orders are dispatched within <strong>2 business days</strong>. Every shipment
            is fully insured and tracked door to door — you&apos;ll receive the tracking
            number by email as soon as your piece is on its way. Each order includes
            its <Link href="/authentication">Certificate of Authenticity</Link>.
          </p>
        </div>
        <div className="pillar">
          <PolicyIcon name="returns" />
          <span className="num">Returns</span>
          <h2>7-day return window</h2>
          <p>
            You have <strong>7 days from delivery</strong> to initiate a return.
            The piece must be in the exact condition it arrived in, with the COA
            and all included items. Once we receive and inspect it, your refund is
            issued to the original payment method. Return shipping is the buyer&apos;s
            responsibility, except for authenticity claims.
          </p>
        </div>
        <div className="pillar">
          <PolicyIcon name="seal" />
          <span className="num">Guarantee</span>
          <h2>Authenticity, or your money back</h2>
          <p>
            If the authenticity of a piece is ever in question, supported by a
            reputable authenticator&apos;s assessment, we refund you in full —
            including all shipping costs. No time limit.
            Read more on <Link href="/authentication">Our Promise</Link>.
          </p>
        </div>
      </section>

      {/* ── Nasıl iade edilir ── */}
      <section className="authpage-process">
        <div className="container">
          <h3>How to start a return</h3>
          <ol className="steps">
            <li><span>Reach out</span>Reply to your order email within 7 days of delivery</li>
            <li><span>Ship it back</span>Use tracked, insured shipping</li>
            <li><span>Inspection</span>We verify the piece on arrival</li>
            <li><span>Refund</span>Issued to your original payment method</li>
          </ol>
        </div>
      </section>

      <section className="container authpage-cta">
        <p>Questions about an order? Just reply to your confirmation email — a real person answers.</p>
        <Link href="/#collection" className="btn terra">Back to the collection</Link>
      </section>
    </div>
  )
}
