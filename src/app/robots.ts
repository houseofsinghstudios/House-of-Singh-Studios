import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // "/studio/" alone does not cover the Studio's own address, /studio.
          '/studio',
          '/studio/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://studios.houseofsingh.com/sitemap.xml',
  }
}
