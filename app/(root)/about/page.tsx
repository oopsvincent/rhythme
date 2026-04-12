import AboutPage from '@/components/landing/about'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind Rhythmé — the premium productivity ecosystem built by Amplecen. Our mission is to help you align habits, focus, and goals into one unified experience.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Rhythmé",
    description:
      "The story, mission, and team behind the productivity OS that helps you find your rhythm.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Rhythmé",
    description:
      "The story, mission, and team behind the productivity OS that helps you find your rhythm.",
  },
}

const page = () => {
  return (
    <div className='mt-20 font-marketing'>
        <AboutPage />
    </div>
  )
}

export default page 
