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
      // The OpenSEO audit crawler. A crawler that matches a group of its own ignores the general one,
      // so every disallow above is repeated here, plus the internal placement links (from=, whether it is
      // the first query parameter or a later one).
      {
        userAgent: 'OpenSEO-Audit',
        allow: '/',
        disallow: ['/api/', '/studio', '/studio/', '/admin/', '/*?from=', '/*&from='],
      },
    ],
    sitemap: 'https://studios.houseofsingh.com/sitemap.xml',
  }
}
