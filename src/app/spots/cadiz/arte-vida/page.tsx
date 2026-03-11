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
  title: 'Arte Vida, Tarifa - Windsurf Spot Guide & Forecast',
  openGraph: {
    images: ['/images/spots/david-vives-zD6sFNw__u4-unsplash.jpg'],
  },
}

export default function ArteVida() {
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
                                                <h2 className="fw-semibold text-light mb-0">Arte Vida</h2>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Tarifa, Cadiz</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={21} />
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
                                <WindguruWidget spotId="43" uid="wg_fwdg_43_100_artevida" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="2667" uid="wglive_2667_artevida" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Arte Vida Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Arte Vida is one of the most beautiful spots along the Tarifa coastline, located at the very end of the Los Lances beach near the hotel of the same name. The scenery is stunning &mdash; after every session you just stand there and admire the view.</p>
                                    <p>Best wind: Poniente (side-onshore from the right). Arte Vida really is a Poniente spot. In winter, the wind is sometimes better here than further down the beach. The Poniente comes around the corner which accelerates it a little, so when the Poniente is weak in town, you can get it a bit stronger here. One of the most popular spots in Tarifa on windy Poniente days.</p>
                                    <p>Levante conditions: When the wind is offshore (Levante), it is way too gusty &mdash; nobody really goes out here. However, on days when the Levante blows more from the south, you can get side-shore conditions that are super nice.</p>
                                    <p>Beach &amp; rigging: Super nice sandy beach with one of the shortest car-to-water distances in Tarifa. If you get a prime parking spot right in front, it is only about 50 metres to the water. A few dark spots in the water indicate some rocks, usually not a big problem but something to keep in mind.</p>
                                    <p>Parking: Plenty of parking spots, but on a windy Poniente day it gets absolutely packed. In the off season and when you come early enough, you can even get a spot right next to the grass fields where you can rig on grass &mdash; the best rigging situation in all of Tarifa. From June-August, you can sail in board shorts or a shorty.</p>
                                    <p>Hazards: Some rocks in the water (visible as dark spots). Can be very crowded with kite surfers on the beach and water.</p>
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
