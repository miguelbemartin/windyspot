import { Metadata } from 'next'
import SpotsList from '../spots-list'
import { getSpots, getLocations } from '../../lib/spots'

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params
  return {
    title: `All Windsurf Spots - Page ${page}`,
    description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides. Filter by location and find your next session.',
    openGraph: {
      title: `All Windsurf Spots - Page ${page}`,
      description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides.',
      url: `https://www.windyspot.com/spots/${page}`,
      images: [{ url: '/images/homepage.jpg', width: 1200, height: 630, alt: 'Windy Spot - Browse Windsurf Spots' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `All Windsurf Spots - Page ${page}`,
      description: 'Browse all windsurf spots worldwide with forecast, live wind stations, webcams, and detailed spot guides.',
      images: ['/images/homepage.jpg'],
    },
    alternates: {
      canonical: `https://www.windyspot.com/spots/${page}`,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params
    const [spots, locations] = await Promise.all([getSpots(), getLocations()])
    return <SpotsList page={Number(page) || 1} spots={spots} locations={locations} />
}
