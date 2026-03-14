import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import Descriptions from '../../../components/list-detail/descriptions'
import WindguruWidget from '../../../components/windguru-widget'


import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Bahía de Formas, Gran Canaria - Windsurf Spot Guide & Forecast',
  description: 'Bahía de Formas windsurf spot guide in Gran Canaria, Spain. Forecast, wind map, and conditions for this sheltered bay near Pozo Izquierdo.',
  openGraph: {
    title: 'Bahía de Formas, Gran Canaria - Windsurf Spot Guide & Forecast',
    description: 'Bahía de Formas windsurf spot guide in Gran Canaria, Spain. Forecast, wind map, and conditions for this sheltered bay near Pozo Izquierdo.',
    url: 'https://www.windyspot.com/spots/gran-canaria/bahia-de-formas',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/bahia-de-formas.jpeg', width: 1200, height: 630, alt: 'Bahía de Formas Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bahía de Formas, Gran Canaria - Windsurf Spot Guide & Forecast',
    description: 'Bahía de Formas windsurf spot guide in Gran Canaria, Spain. Forecast, wind map, and conditions for this sheltered bay near Pozo Izquierdo.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/bahia-de-formas.jpeg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/gran-canaria/bahia-de-formas',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Bahía de Formas',
  description: 'Bahía de Formas windsurf spot guide in Gran Canaria, Spain. Forecast, wind map, and conditions for this sheltered bay near Pozo Izquierdo.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/bahia-de-formas.jpeg',
  url: 'https://www.windyspot.com/spots/gran-canaria/bahia-de-formas',
  containedInPlace: {
    '@type': 'Place',
    name: 'Gran Canaria, Spain',
  },
}

export default function BahiaDeFormas() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/bahia-de-formas.jpeg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Bahía de Formas</h2>
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
                                    <AddToMySpotsButton spotId={2} />
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
                                <WindguruWidget spotId="49346" uid="wg_fwdg_TODO_100_bahiadeformas" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={27.794} lon={-15.432} title="Bahía de Formas Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Bahía de Formas is a sheltered bay on the southeast coast of Gran Canaria, just south of the famous Pozo Izquierdo. The bay offers flatter water than its neighbour, making it a great alternative when Pozo is too gnarly or when you want a more relaxed freeride session.</p>
                                    <p>Conditions: The trade wind (Alisio) blows side-shore from the northeast, typically 15–25 knots during the season. The bay's shape provides natural protection from the bigger swells, resulting in choppy but manageable water conditions. Sail sizes range from 4.5 to 6.0 depending on the day.</p>
                                    <p>Season: The main wind season runs from April to September, with the strongest and most consistent trade winds from June through August. Winter months can still deliver good sessions, particularly during stronger trade wind episodes or with westerly swells.</p>
                                    <p>Hazards: The bottom is a mix of sand and rock — booties are recommended. The bay is relatively safe, but watch for currents near the rocky edges. The area can get gusty when the trade wind accelerates around the headlands.</p>
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
