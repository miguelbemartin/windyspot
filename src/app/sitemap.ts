import { MetadataRoute } from 'next'
import { getSpots } from './lib/spots'
import { resourcesData } from './data/data'

const BASE_URL = 'https://www.windyspot.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spots = await getSpots()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/spots`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/about-me`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact-me`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE_URL}/terms-and-conditions`, changeFrequency: 'monthly', priority: 0.2 },
  ]

  const spotPages: MetadataRoute.Sitemap = spots.map((spot) => ({
    url: spot.custom_page
      ? `${BASE_URL}/spots/${spot.slug}`
      : `${BASE_URL}/spot/${spot.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const resourcePages: MetadataRoute.Sitemap = resourcesData.map((resource) => ({
    url: `${BASE_URL}/resources/${resource.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...spotPages, ...resourcePages]
}
