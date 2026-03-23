import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Costa Calma, Fuerteventura - Windsurf Spot Guide & Forecast',
  description: 'Costa Calma windsurf spot guide in Fuerteventura, Spain. Forecast and wind map for this beginner-friendly trade wind beach.',
  openGraph: {
    title: 'Costa Calma, Fuerteventura - Windsurf Spot Guide & Forecast',
    description: 'Costa Calma windsurf spot guide in Fuerteventura, Spain. Forecast and wind map for this beginner-friendly trade wind beach.',
    url: 'https://www.windyspot.com/spots/fuerteventura/costa-calma',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/paul-treubrodt-6CIQG_tIQAk-unsplash.jpg', width: 1200, height: 630, alt: 'Costa Calma Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Costa Calma, Fuerteventura - Windsurf Spot Guide & Forecast',
    description: 'Costa Calma windsurf spot guide in Fuerteventura, Spain. Forecast and wind map for this beginner-friendly trade wind beach.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/paul-treubrodt-6CIQG_tIQAk-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/fuerteventura/costa-calma',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Costa Calma',
  description: 'Costa Calma windsurf spot guide in Fuerteventura, Spain. Forecast and wind map for this beginner-friendly trade wind beach.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/paul-treubrodt-6CIQG_tIQAk-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/fuerteventura/costa-calma',
  containedInPlace: {
    '@type': 'Place',
    name: 'Fuerteventura, Spain',
  },
}

export default function CostaCalma() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/paul-treubrodt-6CIQG_tIQAk-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Costa Calma</h1>
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
                                    <AddToMySpotsButton spotId={10} />
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
                                    <WeatherForecastTable lat={28.157} lon={-14.228} />
                                </div>
                                <WindguruWidget spotId="206998" uid="wg_fwdg_206998_costa_calma" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={28.155} lon={-14.228} title="Costa Calma Wind Map" />
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
