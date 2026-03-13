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
  title: 'Agua Chiringuito, Tarifa - Windsurf Spot Guide & Forecast',
  description: 'Agua Chiringuito windsurf spot guide in Tarifa, Spain. Side-shore Levante conditions with live station, forecast, and wind map.',
  openGraph: {
    title: 'Agua Chiringuito, Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Agua Chiringuito windsurf spot guide in Tarifa, Spain. Side-shore Levante conditions with live station, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/cadiz/agua',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', width: 1200, height: 630, alt: 'Agua Chiringuito Windsurf Spot, Tarifa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agua Chiringuito, Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Agua Chiringuito windsurf spot guide in Tarifa, Spain. Side-shore Levante conditions with live station and forecast.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/cadiz/agua',
  },
}

export default function Agua() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Agua</h2>
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
                                    <AddToMySpotsButton spotId={20} />
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
                                <WindguruWidget spotId="43" uid="wg_fwdg_43_100_agua" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="2667" uid="wglive_2667_agua" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Agua Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Agua (Agua Chiringuito) is the first beach spot outside the town of Tarifa, located along a couple of small bars &mdash; one of which gives the spot its name. It sits just beyond Campo, where the town ends and the wind becomes free.</p>
                                    <p>Best wind: Levante. Similar to Campo but the wind comes a little bit more side-shore already, as it is not as purely offshore. There are no buildings behind the beach, just some small trees, so the wind arrives fairly undisturbed. You still get a speed strip, but it is a bit more choppy than at Campo.</p>
                                    <p>Poniente conditions: Pretty much the same as at Campo &mdash; typical onshore wavy conditions. Depending on the exact wind direction, you sometimes get very flat water and sometimes more side-shore chop with nice ramps.</p>
                                    <p>Beach walk: Shorter than Campo, roughly 150-200 metres instead of 250-300. There is some nice grass to rig on and a small bar for basic infrastructure.</p>
                                    <p>Parking: No height restriction for vehicles &mdash; campers and cars higher than 2 metres can park here, unlike at Campo. Parking is usually free, though occasionally someone collects a euro.</p>
                                    <p>The further you go along the coast from Tarifa, the more the town&rsquo;s wind shadow fades and the conditions open up. Agua is a good Levante option when you want slightly less offshore conditions and more side-shore sailing than at Campo.</p>
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
