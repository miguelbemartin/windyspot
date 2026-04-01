import { Metadata } from 'next'
import LocationsList from './locations-list'
import { getLocations } from '../lib/spots'

export const metadata: Metadata = {
  title: 'Explore Windsurf Locations Worldwide',
  description: 'Browse all windsurf locations worldwide. Discover regions with the best wind conditions and find your next windsurf destination.',
  keywords: ['windsurf locations', 'windsurf destinations', 'windsurf regions', 'windsurf spots', 'wind conditions', 'kitesurf locations', 'windsurfing'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Explore Windsurf Locations Worldwide',
    description: 'Browse all windsurf locations worldwide. Discover regions with the best wind conditions and find your next windsurf destination.',
    url: 'https://www.windyspot.com/locations',
    type: 'website',
    siteName: 'Windy Spot',
    locale: 'en_US',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg', width: 1200, height: 630, alt: 'Windy Spot - Explore Windsurf Locations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Windsurf Locations Worldwide',
    description: 'Browse all windsurf locations worldwide. Discover regions with the best wind conditions and find your next windsurf destination.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/locations',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Explore Windsurf Locations Worldwide',
  description: 'Browse all windsurf locations worldwide. Discover regions with the best wind conditions and find your next windsurf destination.',
  url: 'https://www.windyspot.com/locations',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Windy Spot',
    url: 'https://www.windyspot.com',
  },
}

export default async function Page() {
    const locations = await getLocations()
    return (
        <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocationsList locations={locations} />
        </>
    )
}
