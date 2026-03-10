import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WindguruLive from '../../../components/windguru-live'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Tarifa, Cadiz - Windsurf Spot Guide & Forecast',
  openGraph: {
    images: ['/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg'],
  },
}

export default function Tarifa() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Tarifa</h2>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Cadiz, Spain</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={7} />
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
                                <WindguruWidget spotId="43" uid="wg_fwdg_43_100_tarifa" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="2667" uid="wglive_2667_tarifa" />
                                </div>
                            </div>
                        </div>


                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Tarifa Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>The spot in short: Tarifa sits at the southernmost tip of continental Europe, where the Atlantic meets the Mediterranean. The Strait of Gibraltar funnels wind between two continents, making Tarifa one of the windiest places in Europe and a world-renowned windsurfing destination.</p>
                                    <p>Conditions: The two dominant winds are the Levante (easterly) and the Poniente (westerly). The Levante is the stronger of the two, often gusting 30-50 knots, and creates choppy conditions on the Atlantic-facing beaches. The Poniente is lighter and steadier, typically 15-25 knots, with cleaner wave conditions. Both winds can blow for days at a time.</p>
                                    <p>Season: Tarifa offers wind year-round. The peak season runs from April to October, when thermal effects reinforce the synoptic winds and sessions with 4.0-5.3 sails are almost daily. Winter brings less consistent but sometimes very strong Levante events with bigger Atlantic swells.</p>
                                    <p>Spots: The main beaches stretch along the Atlantic coast — Playa de Los Lances is the most popular, offering a huge sandy beach with flat-water areas in the lagoon at low tide and small waves further out. Valdevaqueros, a few kilometres north, is the go-to for wave sailing when the Poniente blows. Hurricane Hotel (Playa de Balneario) works best with Levante for side-offshore wave riding.</p>
                                    <p>Hazards: Strong currents in the Strait can push riders towards Morocco. The Levante can be very gusty near the coastline due to the surrounding mountains. Beginners should stick to the flat-water lagoon at Los Lances during manageable Poniente days.</p>
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
