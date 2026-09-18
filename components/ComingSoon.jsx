'use client'

// Anasayfa "yakında" teaser'ı — Chanel fotoğrafının üstünde karizmatik yazı + bülten kaydı.
// COMING_SOON kapanınca (deploy'da) tam mağaza geri gelir.
import NewsletterForm from '@/components/NewsletterForm'

export default function ComingSoon() {
  return (
    <section className="coming">
      <div className="coming-inner">
        <img src="/logo-full.png" alt="Zaza Luxury" className="coming-logo" />
        <h1>
          Something rare<br />
          is <span className="accent">coming</span>
        </h1>
        <p className="coming-lead">
          Authenticated pre-owned luxury — each piece one of one.
          Our doors open soon. Join the list to step inside first.
        </p>
        <div className="coming-news">
          <NewsletterForm />
        </div>
        <div className="coming-hint">Authenticated · One of one</div>
      </div>
    </section>
  )
}
