import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import Descriptions from '../../../components/list-detail/descriptions'
import WindguruWidget from '../../../components/windguru-widget'
import WindguruLive from '../../../components/windguru-live'
import YouTubeEmbed from '../../../components/youtube-embed'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'El Médano, Tenerife - Windsurf Spot Guide & Forecast',
  openGraph: {
    images: ['/images/spots/michal-hejmann--oBMHfF2R18-unsplash.jpg'],
  },
}

export default function ElMedano() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('/images/spots/michal-hejmann--oBMHfF2R18-unsplash.jpg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">El Médano</h2>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Tenerife, Spain</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                <WindguruWidget spotId="1279560" uid="wg_fwdg_TODO_100_elmedano" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="14924" uid="wglive_14924_elmedano" />
                                </div>
                            </div>
                        </div>


                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={28.276} lon={-15.831} title="El Médano Wind Map" />
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
