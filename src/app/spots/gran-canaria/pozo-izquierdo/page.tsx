import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import SpotLegend from '../../../components/spot-legend'

import NavbarLight from '../../../components/navbar/navbar-light'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import YouTubeEmbed from '../../../components/youtube-embed'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Pozo Izquierdo, Gran Canaria - Windsurf Spot Guide & Forecast',
  description: 'Pozo Izquierdo windsurf spot guide in Gran Canaria, Spain. PWA World Tour venue with reliable 25-35 knot trade winds. Forecast, live webcams, and wind map.',
  openGraph: {
    title: 'Pozo Izquierdo, Gran Canaria - Windsurf Spot Guide & Forecast',
    description: 'Pozo Izquierdo windsurf spot guide in Gran Canaria, Spain. PWA World Tour venue with reliable 25-35 knot trade winds.',
    url: 'https://www.windyspot.com/spots/gran-canaria/pozo-izquierdo',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pozo-izquierdo.jpeg', width: 1200, height: 630, alt: 'Pozo Izquierdo Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pozo Izquierdo, Gran Canaria - Windsurf Spot Guide & Forecast',
    description: 'Pozo Izquierdo windsurf spot guide in Gran Canaria, Spain. PWA World Tour venue with reliable 25-35 knot trade winds.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pozo-izquierdo.jpeg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/gran-canaria/pozo-izquierdo',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Pozo Izquierdo',
  description: 'Pozo Izquierdo windsurf spot guide in Gran Canaria, Spain. PWA World Tour venue with reliable 25-35 knot trade winds. Forecast, live webcams, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pozo-izquierdo.jpeg',
  url: 'https://www.windyspot.com/spots/gran-canaria/pozo-izquierdo',
  containedInPlace: {
    '@type': 'Place',
    name: 'Gran Canaria, Spain',
  },
}

export default function PozoIzquierdo() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pozo-izquierdo.jpeg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Pozo Izquierdo</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Gran Canaria, Spain</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={1} />
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
                                    <WeatherForecastTable lat={27.840} lon={-15.382} />
                                </div>

                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="webcams">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#webcamsPanel" aria-controls="webcamsPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Webcams</h4></Link>
                            </div>
                            <div id="webcamsPanel" className="panel-collapse collapse show">
                            <div className="card-body p-4 pt-2">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <YouTubeEmbed videoId="ElZh1azg7c4" title="Pozo Izquierdo Webcam" />
                                    </div>
                                    <div className="col-md-6">
                                        <YouTubeEmbed videoId="qZ0RmfinBC8" title="Pozo Izquierdo Webcam 2" />
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={27.840} lon={-15.382} title="Pozo Izquierdo Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>The spot in short: Pozo Izquierdo in southeast Gran Canaria offers reliable wind and waves throughout the year and is on the PWA Windsurfing World Tour. The island has produced riders like the Dunkerbeck family and Philip Köster, who collectively hold almost 100 world championship titles between them.</p>
                                    <p>Conditions: Winds regularly reach 25 to 35 knots, and the geography helps — Pozo's exposed coastline means nothing stands between the village and the powerful Atlantic breeze. The guard-rail effect of the island's interior can accelerate the air up to 50 knots, though this only works very locally.</p>
                                    <p>Season: From April until September, the trade wind (Alisio, NE) gives almost daily very strong side-onshore conditions for sail sizes 3.4–4.2. During the rest of the year the trade winds are often a little lighter (4.2–5.3), but often with bigger ground swells that make the winter season epic for those who want bigger waves.</p>
                                    <p>Hazards: In many areas of Pozo Izquierdo the bottom is rock. When the tide is high, the waves break on the shore — booties and a helmet are strongly recommended, especially for less experienced riders.</p>
                                    <p>The guide also includes nearby spots (Bahía de Formas, Salinas, Vargas, Ojos de Garza), skill level ratings, pro tips, and practical info on getting there and facilities.</p>
                                </div>
                            </div>
                        </div>

                        <SpotLegend createdBy="user_3AB9Qy8Jp6dB0b9JEvR2FUIrTG8" />

                    </div>
                </div>
            </div>
        </section>

        <Footer/>
        <BackToTop/>
    </>
  )
}
