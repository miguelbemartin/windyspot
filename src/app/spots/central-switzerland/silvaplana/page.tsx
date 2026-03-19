import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'

import WindguruWidget from '../../../components/windguru-widget'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Silvaplana, Engadin - Windsurf Spot Guide & Forecast',
  description: 'Silvaplana windsurf spot guide in Engadin, Switzerland. Alpine lake windsurfing with Maloja wind, forecast, and wind map.',
  openGraph: {
    title: 'Silvaplana, Engadin - Windsurf Spot Guide & Forecast',
    description: 'Silvaplana windsurf spot guide in Engadin, Switzerland. Alpine lake windsurfing with Maloja wind, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/central-switzerland/silvaplana',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg', width: 1200, height: 630, alt: 'Silvaplana Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvaplana, Engadin - Windsurf Spot Guide & Forecast',
    description: 'Silvaplana windsurf spot guide in Engadin, Switzerland. Alpine lake windsurfing with Maloja wind.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/central-switzerland/silvaplana',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Silvaplana',
  description: 'Silvaplana windsurf spot guide in Engadin, Switzerland. Alpine lake windsurfing with Maloja wind, forecast, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/central-switzerland/silvaplana',
  containedInPlace: {
    '@type': 'Place',
    name: 'Silvaplana, Engadin, Switzerland',
  },
}

export default function Silvaplana() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/uwe-conrad-MralC-Em90w-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Silvaplana</h2>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Silvaplana, Engadin, Switzerland</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={25} />
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
                                <WindguruWidget spotId="1584" uid="wg_fwdg_1584_100_silvaplana" />
                                <div className="row g-4 mt-3">
                                    <div className="col-md-6">
                                        <img src="https://profiwetter.ch/wind_foehn_ch_en.png" alt="Foehn Wind Map" className="img-fluid" />
                                    </div>
                                    <div className="col-md-6">
                                        <img src="https://profiwetter.ch/wind_bise_en.png" alt="Bise Wind Map" className="img-fluid" />
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
                                    <WindyEmbed lat={46.458} lon={9.795} title="Silvaplana Wind Map" />
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
