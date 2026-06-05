import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Músila',
    short_name: 'Músila',
    description: '¨Plataforma digital para el descubrimiento de canciones inéditas de todos los géneros musicales.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#d4a853',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
