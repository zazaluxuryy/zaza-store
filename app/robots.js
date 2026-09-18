const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/cart', '/success', '/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
