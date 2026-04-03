import { MetadataRoute } from 'next'
import { getSpots, getLocations } from './lib/spots'
import { resourcesData } from './data/data'

const BASE_URL = 'https://www.windyspot.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [spots, locations] = await Promise.all([getSpots(), getLocations()])
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/spots`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/forecast`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/activity`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/community`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/about-me`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact-me`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified, changeFrequency: 'monthly', priority: 0.2 },
  ]

  const spotPages: MetadataRoute.Sitemap = spots.map((spot) => ({
    url: `${BASE_URL}/spots/${spot.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const resourcePages: MetadataRoute.Sitemap = resourcesData.map((resource) => ({
    url: `${BASE_URL}/resources/${resource.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${BASE_URL}/locations/${location.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...locationPages, ...spotPages, ...resourcePages]
}
