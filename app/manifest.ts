import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rhythmé',
    short_name: 'Rhythmé',
    description: 'Premium productivity OS — tasks, habits, emotional awareness',
    // @ts-expect-error -- 'version' is not in the Next.js Manifest type but is recognized by mobile browsers
    version: '0.67.0',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FF6B35',
    icons: [
      {
        src: '/splash_screens/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/splash_screens/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
