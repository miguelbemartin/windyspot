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
  title: 'Valdevaqueros, Tarifa - Windsurf Spot Guide & Forecast',
}

export default function Valdevaqueros() {
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
                                                <h2 className="fw-semibold text-light mb-0">Valdevaqueros</h2>
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
                                    <AddToMySpotsButton spotId={22} />
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
                                <WindguruWidget spotId="48772" uid="wg_fwdg_48772_100_valdevaqueros" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="269" uid="wglive_269_valdevaqueros" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Valdevaqueros Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Valdevaqueros (also referred to as the Bibo / Hurricane area) is one of the most popular and lifestyle-rich spots in Tarifa, about halfway along the bay. Many of the windsurfing videos from Tarifa are filmed right here. The spot sits near the Arte Vida hotel area and features a beach bar, a nice lawn for rigging, and a vibrant atmosphere on weekends.</p>
                                    <p>Best wind: Poniente (side-onshore from the right). A small hill on the western side of the bay accelerates the Poniente wind, making this often the strongest Poniente spot. You get onshore waves that are fun for jumping and riding &mdash; not the cleanest breaks, but great for one or two turns and small jumps. In summer, a thermal effect makes the wind come in strongest here. Also excellent for slalom and foiling when the waves are not too big.</p>
                                    <p>Levante conditions: Side-shore, unlike the more offshore spots closer to town. The dune at the western end provides safety &mdash; if your gear breaks, you get swept to shore rather than out to sea. In Levante, this area (Bibo) is the go-to for choppy slalom training, offering gnarly conditions similar to PWA racing venues.</p>
                                    <p>Rigging &amp; infrastructure: Nice lawn for rigging (no sand on your gear). There is a beach bar and the hotel nearby for food and facilities. You do have to pay for parking since recently &mdash; roughly a few euros for a session. The walk to the water is still fairly long.</p>
                                    <p>Parking: Paid parking. The bigger parking area makes this a good option in summer when other spots are packed. Cars higher than 2 metres may have restrictions.</p>
                                    <p>Hazards: Can be very crowded with kite surfers both on the beach and on the water, especially in summer. Waves break hollow near the beach &mdash; not recommended for wave sailing. When the wind is 5-10 knots less than in Tarifa town, it can be a good option for those wanting lighter conditions.</p>
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
