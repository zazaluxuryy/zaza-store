import { getProducts } from '@/lib/panel'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

export default async function sitemap() {
  const products = await getProducts()
  const now = new Date()
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/authentication`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/shipping`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...products.map((p) => ({
      url: `${SITE_URL}/product/${p.id}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })),
  ]
}
