import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import SpotLegend from '../../../components/spot-legend'

import NavbarLight from '../../../components/navbar/navbar-light'

import WeatherForecastTable from '../../../components/weather-forecast-table'
import WindguruLive from '../../../components/windguru-live'

import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Gruissan, France - Windsurf Spot Guide & Forecast',
  description: 'Gruissan windsurf spot guide in South of France. Live station, webcams, forecast, and wind map for this popular Mediterranean windsurfing destination.',
  openGraph: {
    title: 'Gruissan, France - Windsurf Spot Guide & Forecast',
    description: 'Gruissan windsurf spot guide in South of France. Live station, webcams, forecast, and wind map for this popular Mediterranean windsurfing destination.',
    url: 'https://www.windyspot.com/spots/south-of-france/gruissan',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg', width: 1200, height: 630, alt: 'Gruissan Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gruissan, France - Windsurf Spot Guide & Forecast',
    description: 'Gruissan windsurf spot guide in South of France. Live station, webcams, forecast, and wind map.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/south-of-france/gruissan',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Gruissan',
  description: 'Gruissan windsurf spot guide in South of France. Live station, webcams, forecast, and wind map for this popular Mediterranean windsurfing destination.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/south-of-france/gruissan',
  containedInPlace: {
    '@type': 'Place',
    name: 'Gruissan, France',
  },
}

export default function Gruissan() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/pierre-cazenave-kaufman-yLU-JkF5yjk-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Gruissan</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Gruissan, France</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={5} />
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
                                    <WeatherForecastTable lat={43.104} lon={3.103} />
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
                                    <WindguruLive spotId="14601" uid="wglive_14601_gruissan" />
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
                                        <div className="ratio ratio-16x9">
                                            <iframe src="https://www.skaping.com/gruissan/plagedeschalets" title="Gruissan Beach Chalets Webcam" allow="autoplay" allowFullScreen></iframe>
                                        </div>
                                        <p className="text-small mt-1">Plage des Chalets</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ratio ratio-16x9">
                                            <iframe src="https://www.skaping.com/gruissan/village/" title="Gruissan Village Webcam" allow="autoplay" allowFullScreen></iframe>
                                        </div>
                                        <p className="text-small mt-1">Village</p>
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
                                    <WindyEmbed lat={43.105} lon={3.098} title="Gruissan Wind Map" />
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
