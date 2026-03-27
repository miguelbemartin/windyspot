import { Suspense } from 'react'
import { Metadata } from 'next'
import SpotsList from './spots-list'
import { getSpots, getLocations } from '../lib/spots'

export const metadata: Metadata = {
  title: 'Explore Windsurf Spots Worldwide',
  description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides. Filter by location and find your next session.',
  openGraph: {
    title: 'Explore Windsurf Spots Worldwide',
    description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides. Filter by location and find your next session.',
    url: 'https://www.windyspot.com/spots',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg', width: 1200, height: 630, alt: 'Windy Spot - Explore Windsurf Spots' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Windsurf Spots Worldwide',
    description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg'],
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
