import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rhythmé',
    short_name: 'Rhythmé',
    description: 'Premium productivity OS — tasks, habits, emotional awareness',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FF6B35',
    icons: [
      {
        src: '/rhythme.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/rhythme.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
