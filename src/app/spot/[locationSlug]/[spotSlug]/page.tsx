import React from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WindguruLive from '../../../components/windguru-live'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

import { getSpotBySlug } from '../../../lib/spots'

interface PageProps {
  params: Promise<{ locationSlug: string; spotSlug: string }>
}

function buildSlug(locationSlug: string, spotSlug: string) {
  return `${locationSlug}/${spotSlug}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationSlug, spotSlug } = await params
  const spot = await getSpotBySlug(buildSlug(locationSlug, spotSlug))
  if (!spot) return {}

  const title = `${spot.title}, ${spot.location.name} - Windsurf Spot Guide & Forecast`
  const description = `${spot.title} windsurf spot guide in ${spot.location.name}${spot.location.country ? ', ' + spot.location.country : ''}. Forecast, live wind station, and conditions for this windsurf spot.`
  const url = `https://www.windyspot.com/spot/${spot.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: spot.image, width: 1200, height: 630, alt: `${spot.title} Windsurf Spot` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [spot.image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function SpotPage({ params }: PageProps) {
  const { locationSlug, spotSlug } = await params
  const spot = await getSpotBySlug(buildSlug(locationSlug, spotSlug))

  if (!spot) notFound()
  if (spot.custom_page) redirect(`/spots/${spot.slug}`)

  const locationLabel = spot.location.country
    ? `${spot.location.name}, ${spot.location.country}`
    : spot.location.name

  const spotUrl = `https://www.windyspot.com/spot/${spot.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: spot.title,
    description: spot.description || `${spot.title} windsurf spot in ${locationLabel}.`,
    image: `https://www.windyspot.com${spot.image}`,
    url: spotUrl,
    containedInPlace: {
      '@type': 'Place',
      name: locationLabel,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <NavbarLight />

      <section className="bg-cover position-relative ht-200 py-0" style={{ backgroundImage: `url('${spot.image}')` }} data-overlay="4">
        <div className="container h-100">
          <div className="row align-items-start">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
              <div className="mainlistingInfo">
                <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                  <div className="firstColumn">
                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                      <div className="listingCaptioninfo">
                        <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                          <h2 className="fw-semibold text-light mb-0">{spot.title}</h2>
                        </div>
                        <div className="listingsbasicInfo">
                          <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                            <div className="flexItem me-2">
                              <span className="text-md fw-medium text-light">
                                <FaLocationDot className="me-2" />{locationLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <AddToMySpotsButton spotId={spot.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gray-simple pt-4 pt-xl-5">
        <div className="container">
          <div className="row align-items-start g-4">
            <div className="col-12">

              {spot.windguru_forecast_id && (
                <div className="listingSingleblock mb-4" id="forecast">
                  <div className="SingleblockHeader">
                    <Link data-bs-toggle="collapse" data-bs-target="#forecastPanel" aria-controls="forecastPanel" href="#" aria-expanded="false" className="collapsed">
                      <h4 className="listingcollapseTitle">Forecast</h4>
                    </Link>
                  </div>
                  <div id="forecastPanel" className="panel-collapse collapse show">
                    <div className="card-body p-4 pt-2">
                      <WindguruWidget spotId={spot.windguru_forecast_id} uid={`wg_fwdg_${spot.windguru_forecast_id}_${spot.slug.replace('/', '_')}`} />
                    </div>
                  </div>
                </div>
              )}

              {spot.windguru_live_station_id && (
                <div className="listingSingleblock mb-4" id="livestation">
                  <div className="SingleblockHeader">
                    <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed">
                      <h4 className="listingcollapseTitle">Live Station</h4>
                    </Link>
                  </div>
                  <div id="livestationPanel" className="panel-collapse collapse show">
                    <div className="card-body p-4 pt-2">
                      <WindguruLive spotId={spot.windguru_live_station_id} uid={`wglive_${spot.windguru_live_station_id}_${spot.slug.replace('/', '_')}`} />
                    </div>
                  </div>
                </div>
              )}

              {spot.description && (
                <div className="listingSingleblock mb-4" id="descriptions">
                  <div className="SingleblockHeader">
                    <Link data-bs-toggle="collapse" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed">
                      <h4 className="listingcollapseTitle">About this Spot</h4>
                    </Link>
                  </div>
                  <div id="description" className="panel-collapse collapse show">
                    <div className="card-body p-4 pt-2">
                      <p>{spot.description}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  )
}
