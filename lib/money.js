// Fiyatlar panelde USD tam sayı/ondalık olarak tutuluyor (ör. 505 = $505).
export function formatUSD(v) {
  const n = Number(v)
  if (!isFinite(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n)
}

// Stripe cent ister (integer). $505.00 → 50500
export function toCents(v) {
  return Math.round((Number(v) || 0) * 100)
}
