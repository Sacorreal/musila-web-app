import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/auth-required/', 
        '/music/mi-perfil/', 
        '/music/mi-musica/', 
        '/music/solicitudes/',
        '/music/publicar/'
      ],
    },
    sitemap: 'https://musila.co/sitemap.xml',
  }
}
