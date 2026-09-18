import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

// Site menüsü — yeni sayfalar geldikçe buraya eklenir.
const MENU = [
  {
    title: 'Shop',
    links: [
      { href: '/#collection', label: 'The Collection' },
      { href: '/cart', label: 'Shopping Cart' },
    ],
  },
  {
    title: 'Client Care',
    links: [
      { href: '/authentication', label: 'Authentication · Our Promise' },
      { href: '/shipping', label: 'Shipping & Returns' },
      // { href: '/contact', label: 'Contact' },   ← sayfa hazır olunca aç
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/signin', label: 'Sign In' },
      { href: '/signup', label: 'Create Account' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo-full.png" alt="Zaza Luxury" />
          <p>Authenticated pre-owned luxury. Every piece one of one — chosen with intention.</p>
        </div>

        {MENU.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer-col footer-news">
          <h4>Newsletter</h4>
          <p>Be the first to see new one-of-one pieces — once they&apos;re gone, they&apos;re gone.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container inner">
          <span>© 2026 Zaza Luxury · All rights reserved</span>
          <span>Authenticated with COA · Secure checkout by Stripe</span>
        </div>
      </div>
    </footer>
  )
}
