import FeaturesSection from '@/components/landing/features'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore Rhythmé's powerful features — habit tracking, focus timer, journaling, goal planning, mood awareness, and weekly reviews. Everything you need to stay productive.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features | Rhythmé",
    description:
      "Habit tracking, focus sessions, journaling, goals, and more — discover every feature of the productivity ecosystem.",
    url: "/features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features | Rhythmé",
    description:
      "Habit tracking, focus sessions, journaling, goals, and more — discover every feature of the productivity ecosystem.",
  },
}

const page = () => {
  return (
    <div className='mt-30'>
        <FeaturesSection />
    </div>
  )
}

export default page
