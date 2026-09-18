'use client'

// WELCOME = INTRO: ilk girişte sadece hero görünür (header/footer/koleksiyon gizli,
// kaydırma kilitli). "Explore" → site açılır. Aynı oturumda intro bir daha gelmez.
// İşaret sessionStorage'da → sekme kapanınca sıfırlanır, yeni ziyarette intro yine oynar.
import { useLayoutEffect } from 'react'

const KEY = 'zaza-hero-seen'
const html = () => document.documentElement

function seen() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}
function markSeen() {
  try { sessionStorage.setItem(KEY, '1') } catch {}
}

// Ana sayfaya her gelişte (hard load + SPA geçişi) doğru modu uygular.
export function IntroController() {
  useLayoutEffect(() => {
    if (seen()) {
      html().classList.add('zaza-hero-seen')   // hero gizli, site normal
      html().classList.remove('zaza-intro')
    } else {
      html().classList.add('zaza-intro')       // intro modu
    }
    return () => { html().classList.remove('zaza-intro') } // sayfadan çıkınca kilidi bırak
  }, [])
  return null
}

export function ExploreLink({ children }) {
  function enter(e) {
    e.preventDefault()
    markSeen()
    html().classList.remove('zaza-intro')
    html().classList.add('zaza-hero-seen')     // hero kapanır, site görünür
    requestAnimationFrame(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'auto', block: 'start' })
      window.scrollTo({ top: 0 })              // koleksiyon zaten üstte — en üste al
    })
  }
  return (
    <a href="#collection" className="btn" onClick={enter}>
      {children}
    </a>
  )
}
