// İnce çizgili, tek renk (terracotta) editorial ikonlar — policy/pillar başlıkları için.
// Jenerik ikon seti hissi vermesin diye stroke ince (1.4) ve set tutarlı.
const PATHS = {
  // Kargo — kutu + kabin + tekerlek
  truck: (
    <>
      <path d="M2 6.5h10.5v9H2z" />
      <path d="M12.5 9.5h3.7l3.3 3.3v2.7h-7z" />
      <circle cx="6" cy="17.6" r="1.7" />
      <circle cx="16.5" cy="17.6" r="1.7" />
    </>
  ),
  // İade — dönüş oku
  returns: (
    <>
      <path d="M4 5.5v5h5" />
      <path d="M4.2 10.5a8 8 0 1 1-1.2 5.2" />
    </>
  ),
  // Garanti — rozet/mühür + kurdele
  seal: (
    <>
      <circle cx="12" cy="9.5" r="6" />
      <path d="M12 6.4l1.25 2.1 2.35.36-1.7 1.7.4 2.36L12 11.75l-2.3 1.17.4-2.36-1.7-1.7 2.35-.36z" />
      <path d="M9 14.6 7.4 20l4.6-2.1 4.6 2.1-1.6-5.4" />
    </>
  ),
  // Teknoloji — büyüteç (sitedeki arama ikonuyla aynı dil)
  scope: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <line x1="15" y1="15" x2="20" y2="20" />
    </>
  ),
  // Uzman onayı — kalkan + tik
  shield: (
    <>
      <path d="M12 3l7 2.5v5.6c0 4.4-3 7.4-7 8.9-4-1.5-7-4.5-7-8.9V5.5z" />
      <path d="M9 11.5l2 2 4-4.4" />
    </>
  ),
  // COA — sertifika belgesi + mühür
  certificate: (
    <>
      <path d="M6 3h7.5L18 7.5V21H6z" />
      <path d="M13.5 3v4.5H18" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="14" x2="12.5" y2="14" />
      <circle cx="15" cy="17" r="2.1" />
      <path d="M13.4 18.4 12.8 21l2.2-1.1 2.2 1.1-.6-2.6" />
    </>
  ),
}

export default function PolicyIcon({ name, className = '' }) {
  const paths = PATHS[name]
  if (!paths) return null
  return (
    <span className={`pillar-icon ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 24 24" width="30" height="30" fill="none"
        stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round"
      >
        {paths}
      </svg>
    </span>
  )
}
