import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import Image from 'next/image'
import NavbarLight from '../../components/navbar/navbar-light'
import WindguruLive from '../../components/windguru-live'
import WeatherForecastTable from '../../components/weather-forecast-table'
import WindyEmbed from '../../components/windy-embed'
import Footer from '../../components/footer/footer'
import BackToTop from '../../components/back-to-top'
import AddToMySpotsButton from '../../components/add-to-my-spots-button'
import { EditSpotProvider, EditSpotButton, EditSpotForm } from '../../components/edit-spot-button'

import { getSpotBySlug } from '../../lib/spots'
import { DEFAULT_SPOT_IMAGE } from '../../lib/constants'
import { FaLocationDot } from 'react-icons/fa6'

interface PageProps {
    params: Promise<{ slug: string[] }>
}

async function getSpot(slug: string[]) {
    if (slug.length !== 2) return null
    const fullSlug = slug.join('/')
    return getSpotBySlug(fullSlug)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const spot = await getSpot(slug)
    if (!spot) return {}

    const locationName = spot.location?.name || ''
    const title = `${spot.title}, ${locationName} - Windsurf Spot Guide & Forecast`
    const description = spot.description?.slice(0, 160) || `${spot.title} windsurf spot guide in ${locationName}.`
    const url = `https://www.windyspot.com/spots/${spot.slug}`
    const image = spot.image || undefined

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            ...(image && { images: [{ url: image, width: 1200, height: 630, alt: `${spot.title} Windsurf Spot` }] }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(image && { images: [image] }),
        },
        alternates: {
            canonical: url,
        },
    }
}

export default async function SpotPage({ params }: PageProps) {
    const { slug } = await params
    const spot = await getSpot(slug)
    if (!spot) notFound()

    const locationName = spot.location?.name || ''
    const spotSlug = slug[1]

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': ['TouristAttraction', 'SportsActivityLocation'],
        name: spot.title,
        description: spot.description,
        ...(spot.image && { image: spot.image }),
        url: `https://www.windyspot.com/spots/${spot.slug}`,
        containedInPlace: {
            '@type': 'Place',
            name: locationName,
        },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <NavbarLight />

            <EditSpotProvider createdBy={spot.created_by}>
            <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src={spot.image || DEFAULT_SPOT_IMAGE} alt={spot.title} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="container h-100">
                    <div className="row align-items-start">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                            <div className="mainlistingInfo">
                                <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                    <div className="firstColumn">
                                        <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                            <div className="listingCaptioninfo">
                                                <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                    <h1 className="fw-semibold text-light mb-0 fs-2">{spot.title}</h1>
                                                </div>
                                                <div className="listingsbasicInfo">
                                                    <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                        <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2" />{locationName}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <EditSpotButton />
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

                            <EditSpotForm
                                spotId={spot.id}
                                initialTitle={spot.title}
                                initialDescription={spot.description}
                                initialSpotGuide={spot.spot_guide}
                                initialWindguruForecastId={spot.windguru_forecast_id}
                                initialWindguruLiveStationId={spot.windguru_live_station_id}
                            />

                            {spot.lat && spot.lon && (
                                <div className="listingSingleblock mb-4" id="weather-forecast">
                                    <div className="SingleblockHeader">
                                        <Link data-bs-toggle="collapse" data-bs-target="#weatherForecastPanel" aria-controls="weatherForecastPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Weather Forecast</h4></Link>
                                    </div>
                                    <div id="weatherForecastPanel" className="panel-collapse collapse show">
                                        <div className="card-body p-4 pt-2">
                                            <WeatherForecastTable lat={spot.lat} lon={spot.lon} />
                                        </div>
                                    </div>
                                </div>
                            )}


                            {spot.windguru_live_station_id && (
                                <div className="listingSingleblock mb-4" id="livestation">
                                    <div className="SingleblockHeader">
                                        <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                                    </div>
                                    <div id="livestationPanel" className="panel-collapse collapse show">
                                        <div className="card-body p-4 pt-2">
                                            <WindguruLive spotId={spot.windguru_live_station_id} uid={`wglive_${spot.windguru_live_station_id}_${spotSlug}`} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {spot.lat && spot.lon && (
                                <div className="listingSingleblock mb-4" id="windy">
                                    <div className="SingleblockHeader">
                                        <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                                    </div>
                                    <div id="windyPanel" className="panel-collapse collapse show">
                                        <div className="card-body p-4 pt-2">
                                            <WindyEmbed lat={spot.lat} lon={spot.lon} title={`${spot.title} Wind Map`} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(spot.spot_guide || spot.description) && (
                            <div className="listingSingleblock mb-4" id="descriptions">
                                <div className="SingleblockHeader">
                                    <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                                </div>
                                <div id="description" className="panel-collapse collapse show">
                                    <div className="card-body p-4 pt-2">
                                        <div dangerouslySetInnerHTML={{ __html: spot.spot_guide || spot.description || '' }} />
                                    </div>
                                </div>
                            </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            </EditSpotProvider>

            <Footer />
            <BackToTop />
        </>
    )
}
