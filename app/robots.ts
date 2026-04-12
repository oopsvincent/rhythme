import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://rhythme.amplecen.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/settings/',
          '/onboarding/',
          '/account/',
          '/api/',
          '/offline/',
          '/logout/',
          '/auth/',
          '/user/',
        ],
      },
      // Block aggressive SEO scrapers / AI scrapers that ignore robots.txt
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai'],
        disallow: ['/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
