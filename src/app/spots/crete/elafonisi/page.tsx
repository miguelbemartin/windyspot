import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import WindguruLive from '../../../components/windguru-live'

import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Elafonisi, Crete - Windsurf Spot Guide & Forecast',
  description: 'Elafonisi windsurf spot guide in Crete, Greece. Pink-sand beach with Meltemi winds, flat-water lagoon, live station, forecast, and wind map.',
  openGraph: {
    title: 'Elafonisi, Crete - Windsurf Spot Guide & Forecast',
    description: 'Elafonisi windsurf spot guide in Crete, Greece. Pink-sand beach with Meltemi winds, flat-water lagoon, live station, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/crete/elafonisi',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg', width: 1200, height: 630, alt: 'Elafonisi Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elafonisi, Crete - Windsurf Spot Guide & Forecast',
    description: 'Elafonisi windsurf spot guide in Crete, Greece. Pink-sand beach with Meltemi winds, flat-water lagoon, live station, and forecast.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/crete/elafonisi',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Elafonisi',
  description: 'Elafonisi windsurf spot guide in Crete, Greece. Pink-sand beach with Meltemi winds, flat-water lagoon, live station, forecast, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/crete/elafonisi',
  containedInPlace: {
    '@type': 'Place',
    name: 'Crete, Greece',
  },
}

export default function Elafonisi() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/dimitris-kiriakakis-yGA8EEV2xtU-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Elafonisi</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Crete, Greece</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={17} />
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

                        <div className="listingSingleblock mb-4" id="forecast">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#forecastPanel" aria-controls="forecastPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Forecast</h4></Link>
                            </div>
                            <div id="forecastPanel" className="panel-collapse collapse show">
                            <div className="card-body p-4 pt-2">
                                <div className="mb-4">
                                    <WeatherForecastTable lat={35.272} lon={23.541} />
                                </div>

                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="4122" uid="wglive_4122_elafonisi" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={35.272} lon={23.541} title="Elafonisi Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>The spot in short: Elafonisi is a stunning pink-sand beach on the southwest coast of Crete, connected to a small island by a shallow lagoon. The combination of crystal-clear turquoise water, reliable Meltemi winds, and a natural flat-water lagoon makes it an exceptional windsurfing spot.</p>
                                    <p>Conditions: The dominant wind is the Meltemi (northwesterly), which funnels along the west coast of Crete and hits the beach side-shore to side-onshore. The shallow lagoon between the beach and Elafonisi island provides flat water ideal for freestyle and freeride, while the open sea beyond offers small to medium wave sailing.</p>
                                    <p>Season: The Meltemi season runs from June to September, with July and August being the most consistent months. Wind typically builds from late morning, reaching 15-25 knots by early afternoon, with stronger days pushing into the low 30s. Sail sizes range from 4.5 to 6.0 depending on the day.</p>
                                    <p>Hazards: The lagoon is very shallow in places — watch for rocky patches and sea urchins. The beach is a protected Natura 2000 site, so respect the environment and stay within designated launch areas. The drive to Elafonisi is along narrow mountain roads, so plan extra travel time.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <Footer/>
        <BackToTop/>
    </>
  )
}
