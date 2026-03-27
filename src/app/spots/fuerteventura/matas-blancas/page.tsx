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
  title: 'Matas Blancas, Fuerteventura - Windsurf Spot Guide & Forecast',
  description: 'Matas Blancas windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map for this consistent trade wind spot.',
  openGraph: {
    title: 'Matas Blancas, Fuerteventura - Windsurf Spot Guide & Forecast',
    description: 'Matas Blancas windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map for this consistent trade wind spot.',
    url: 'https://www.windyspot.com/spots/fuerteventura/matas-blancas',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/matas-blancas-fuerteventura.png', width: 1200, height: 630, alt: 'Matas Blancas Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matas Blancas, Fuerteventura - Windsurf Spot Guide & Forecast',
    description: 'Matas Blancas windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/matas-blancas-fuerteventura.png'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/fuerteventura/matas-blancas',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Matas Blancas',
  description: 'Matas Blancas windsurf spot guide in Fuerteventura, Spain. Live station, forecast, and wind map for this consistent trade wind spot.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/matas-blancas-fuerteventura.png',
  url: 'https://www.windyspot.com/spots/fuerteventura/matas-blancas',
  containedInPlace: {
    '@type': 'Place',
    name: 'Fuerteventura, Spain',
  },
}

export default function MatasBlancas() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/matas-blancas-fuerteventura.png" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Matas Blancas</h1>
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
                                    <AddToMySpotsButton spotId={9} />
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
                                    <WeatherForecastTable lat={28.113} lon={-14.197} />
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
                                    <WindguruLive spotId="3428" uid="wglive_3428_matas_blancas" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={28.130} lon={-14.220} title="Matas Blancas Wind Map" />
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
