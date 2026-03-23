import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import WindguruLive from '../../../components/windguru-live'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Risco del Paso, Fuerteventura - Windsurf Spot Guide & Forecast',
  description: 'Risco del Paso windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map for this flat water paradise near Sotavento.',
  openGraph: {
    title: 'Risco del Paso, Fuerteventura - Windsurf Spot Guide & Forecast',
    description: 'Risco del Paso windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map for this flat water paradise near Sotavento.',
    url: 'https://www.windyspot.com/spots/fuerteventura/risco-del-paso',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg', width: 1200, height: 630, alt: 'Risco del Paso Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Risco del Paso, Fuerteventura - Windsurf Spot Guide & Forecast',
    description: 'Risco del Paso windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/fuerteventura/risco-del-paso',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Risco del Paso',
  description: 'Risco del Paso windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map for this flat water paradise near Sotavento.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/fuerteventura/risco-del-paso',
  containedInPlace: {
    '@type': 'Place',
    name: 'Fuerteventura, Spain',
  },
}

export default function RiscoDelPaso() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Risco del Paso</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Fuerteventura, Spain</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={11} />
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
                                    <WeatherForecastTable lat={28.074} lon={-14.215} />
                                </div>
                                <WindguruWidget spotId="207001" uid="wg_fwdg_207001_risco_del_paso" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="373" uid="wglive_373_risco_del_paso" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={28.048} lon={-14.250} title="Risco del Paso Wind Map" />
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
