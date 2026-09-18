'use client'

// Galeri + zoom:
//  - Desktop: ana görsel üstünde hover → imleci takip eden büyüteç zoom
//  - Tık → tam ekran lightbox (ok tuşları, sayaç, tıkla-yakınlaş)
import { useCallback, useEffect, useRef, useState } from 'react'

export default function ProductGallery({ photos = [], alt }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // hover zoom durumu
  const [hoverZoom, setHoverZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  // lightbox içi zoom
  const [lbZoom, setLbZoom] = useState(false)
  const [lbOrigin, setLbOrigin] = useState('50% 50%')

  const list = photos.length ? photos : ['']
  const main = list[active] || ''
  const many = list.length > 1

  const prev = useCallback(() => setActive(a => (a - 1 + list.length) % list.length), [list.length])
  const next = useCallback(() => setActive(a => (a + 1) % list.length), [list.length])

  // Lightbox açıkken: ESC/ok tuşları + body scroll kilidi
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft' && many) { setLbZoom(false); prev() }
      if (e.key === 'ArrowRight' && many) { setLbZoom(false); next() }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox, many, prev, next])

  function pctOrigin(e, el) {
    const r = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100))
    return `${x}% ${y}%`
  }

  return (
    <div className="gallery">
      <div
        className={'main zoomable' + (hoverZoom ? ' zooming' : '')}
        onMouseEnter={() => setHoverZoom(true)}
        onMouseLeave={() => setHoverZoom(false)}
        onMouseMove={(e) => setOrigin(pctOrigin(e, e.currentTarget))}
        onClick={() => { if (main) { setLbZoom(false); setLightbox(true) } }}
        role="button" tabIndex={0} aria-label="Open full-screen photo"
        onKeyDown={(e) => { if (e.key === 'Enter' && main) setLightbox(true) }}
      >
        {main
          ? <img src={main} alt={alt} style={hoverZoom ? { transformOrigin: origin } : undefined} />
          : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#C4B5A4' }}>No image</div>}
        {main && <span className="zoom-hint" aria-hidden>⊕ Zoom</span>}
      </div>

      {many && (
        <div className="thumbs">
          {list.map((p, i) => (
            <button
              key={i}
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={p} alt="" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)} role="dialog" aria-modal="true" aria-label="Photo viewer">
          <button className="lb-close" aria-label="Close" onClick={() => setLightbox(false)}>✕</button>
          {many && (
            <button className="lb-arrow left" aria-label="Previous photo"
              onClick={(e) => { e.stopPropagation(); setLbZoom(false); prev() }}>‹</button>
          )}
          <img
            src={main}
            alt={alt}
            className={lbZoom ? 'zoomed' : ''}
            style={lbZoom ? { transformOrigin: lbOrigin } : undefined}
            onClick={(e) => {
              e.stopPropagation()
              if (!lbZoom) setLbOrigin(pctOrigin(e, e.currentTarget))
              setLbZoom(z => !z)
            }}
            onMouseMove={(e) => { if (lbZoom) setLbOrigin(pctOrigin(e, e.currentTarget)) }}
          />
          {many && (
            <button className="lb-arrow right" aria-label="Next photo"
              onClick={(e) => { e.stopPropagation(); setLbZoom(false); next() }}>›</button>
          )}
          <div className="lb-counter" aria-hidden>{active + 1} / {list.length}</div>
        </div>
      )}
    </div>
  )
}
