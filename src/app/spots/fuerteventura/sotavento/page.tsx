import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WindguruLive from '../../../components/windguru-live'
import YouTubeEmbed from '../../../components/youtube-embed'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Sotavento, Fuerteventura - Windsurf Spot Guide & Forecast',
  openGraph: {
    images: ['/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg'],
  },
}

export default function Sotavento() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('/images/spots/michele-marchesi-o3ys6oKoHtA-unsplash.jpg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Sotavento</h2>
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
                                    <AddToMySpotsButton spotId={8} />
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
                                <WindguruWidget spotId="559365" uid="wg_fwdg_559365_sotavento" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="373" uid="wglive_373_sotavento" />
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
                                        <YouTubeEmbed videoId="DeU_ojR72B4" title="Sotavento Webcam" />
                                    </div>
                                    <div className="col-md-6">
                                        {/* TODO: Add second webcam when available */}
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
                                    <WindyEmbed lat={28.065} lon={-14.234} title="Sotavento Wind Map" />
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
