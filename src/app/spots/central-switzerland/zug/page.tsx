import React from 'react'
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
  title: 'Zug, Switzerland - Windsurf Spot Guide & Forecast',
  description: 'Zug windsurf spot guide on Lake Zug, Switzerland. Webcams, forecast, and wind map for this central Swiss lake windsurfing spot.',
  openGraph: {
    title: 'Zug, Switzerland - Windsurf Spot Guide & Forecast',
    description: 'Zug windsurf spot guide on Lake Zug, Switzerland. Webcams, forecast, and wind map for this central Swiss lake windsurfing spot.',
    url: 'https://www.windyspot.com/spots/central-switzerland/zug',
    images: [{ url: '/images/spots/louis-droege-k6rwCx5oAS8-unsplash.jpg', width: 1200, height: 630, alt: 'Zug Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zug, Switzerland - Windsurf Spot Guide & Forecast',
    description: 'Zug windsurf spot guide on Lake Zug, Switzerland. Webcams, forecast, and wind map.',
    images: ['/images/spots/louis-droege-k6rwCx5oAS8-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/central-switzerland/zug',
  },
}

export default function Zug() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('/images/spots/louis-droege-k6rwCx5oAS8-unsplash.jpg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Zug</h2>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Zug, Switzerland</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={14} />
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
                                <WindguruWidget spotId="57008" uid="wg_fwdg_57008_100_zug" />
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
                                                <img src="https://www.barile.ch/yczug/yczug/cam1.jpg" alt="Zug Webcam" className="object-fit-cover" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="ratio ratio-16x9">
                                                <img src="http://www.webcam.scc.ch/image.jpg" alt="Zug Webcam 2" className="object-fit-cover" />
                                            </div>
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
                                    <WindyEmbed lat={47.166} lon={8.516} title="Zug Wind Map" />
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
