import { Suspense } from 'react'
import { Metadata } from 'next'
import SpotsList from './spots-list'
import { getSpots, getLocations } from '../lib/spots'

export const metadata: Metadata = {
  title: 'All Windsurf Spots - Browse by Location & Conditions',
  description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides. Filter by location and find your next session.',
  openGraph: {
    title: 'All Windsurf Spots - Browse by Location & Conditions',
    description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides. Filter by location and find your next session.',
    url: 'https://www.windyspot.com/spots',
    images: [{ url: '/images/homepage.jpg', width: 1200, height: 630, alt: 'Windy Spot - Browse Windsurf Spots' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Windsurf Spots - Browse by Location & Conditions',
    description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides.',
    images: ['/images/homepage.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots',
  },
}

export default async function Page() {
    const [spots, locations] = await Promise.all([getSpots(), getLocations()])
    return (
        <Suspense>
            <SpotsList page={1} spots={spots} locations={locations} />
        </Suspense>
    )
}
