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
  title: 'Campo de Fútbol, Tarifa - Windsurf Spot Guide & Forecast',
  description: 'Campo de Fútbol windsurf spot guide in Tarifa, Spain. Flat water paradise for speed runs and freestyle during Levante conditions.',
  openGraph: {
    title: 'Campo de Fútbol, Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Campo de Fútbol windsurf spot guide in Tarifa, Spain. Flat water paradise for speed runs and freestyle during Levante conditions.',
    url: 'https://www.windyspot.com/spots/cadiz/campo',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', width: 1200, height: 630, alt: 'Campo de Fútbol Windsurf Spot, Tarifa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campo de Fútbol, Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Campo de Fútbol windsurf spot guide in Tarifa, Spain. Flat water paradise for speed runs and freestyle.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/cadiz/campo',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Campo de Fútbol',
  description: 'Campo de Fútbol windsurf spot guide in Tarifa, Spain. Flat water paradise for speed runs and freestyle during Levante conditions.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/cadiz/campo',
  containedInPlace: {
    '@type': 'Place',
    name: 'Tarifa, Cadiz',
  },
}

export default function Campo() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Campo</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Tarifa, Cadiz</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={19} />
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
                                    <WeatherForecastTable lat={36.025} lon={-5.618} />
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
                                    <WindguruLive spotId="2667" uid="wglive_2667_campo" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Campo Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Campo de Fútbol is the flat water paradise of Tarifa, located at the Los Lances beach right where the town ends, next to the football stadium. It is the last spot still inside the town of Tarifa.</p>
                                    <p>Best wind: Levante (side-offshore). During Levante you get beautiful flat water conditions with a 2 km long speed strip stretching all the way to Agua Chiringuito. Pros use this strip for 40+ knot speed runs along the beach. The wind flows freely over the beach with no buildings or trees blocking it, so it is less gusty than behind the town.</p>
                                    <p>Poniente conditions: During Poniente (side-onshore from the right) you get typical onshore wavy conditions, similar to most other spots along this coast.</p>
                                    <p>Beach walk: The main downside is the long walk from parking to water &mdash; roughly 300 metres, the furthest walk of any spot in Tarifa. Rigging is half grass, half sand.</p>
                                    <p>Parking: Cars higher than 2 metres cannot enter the parking area (barrier at the entrance). If you have a taller vehicle, you need to park further back, adding about 100 metres to the walk.</p>
                                    <p>Hazards: During Levante, the wind is offshore &mdash; if your gear breaks, the next stop is Madeira or America. Always have someone on the beach and take your phone. Atlantic swell can still push waves onshore, making it hard to get out on some days. On the town side of the beach, windsurfing is restricted due to the swimmers area.</p>
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
