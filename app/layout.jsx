import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WelcomeOffer from '@/components/WelcomeOffer'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zaza Luxury — Authenticated Pre-Owned Designer',
    template: '%s · Zaza Luxury',
  },
  description:
    'Curated, authenticated pre-owned luxury handbags, wallets and accessories from Louis Vuitton, Gucci, Prada, Fendi and more. Each piece one-of-one.',
  openGraph: {
    title: 'Zaza Luxury',
    description: 'Authenticated pre-owned designer pieces. Each one-of-one.',
    type: 'website',
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
}

const COMING_SOON = process.env.COMING_SOON === '1'

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: intro script'i boyamadan önce <html>'e sınıf ekler;
    // React'in bu bilinçli farkı hydration hatası sayması engellenir (yalnızca bu etiket).
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Welcome = intro (oturumda bir kez). Coming-soon modunda intro çalışmaz. */}
        {!COMING_SOON && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "try{var s=sessionStorage.getItem('zaza-hero-seen'),h=document.documentElement;if(s){h.classList.add('zaza-hero-seen')}else if(location.pathname==='/'){h.classList.add('zaza-intro')}}catch(e){}",
            }}
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {!COMING_SOON && <Header />}
          <main>{children}</main>
          {!COMING_SOON && <Footer />}
          {!COMING_SOON && <WelcomeOffer />}
        </CartProvider>
      </body>
    </html>
  )
}
