import React from 'react'
import Image from 'next/image'
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
  title: 'Paloma Baja (Las Dunas), Tarifa - Windsurf Spot Guide & Forecast',
  description: 'Paloma Baja (Las Dunas) windsurf spot guide in Tarifa, Spain. Wave-protected slalom spot near Punta Paloma with live station, forecast, and wind map.',
  openGraph: {
    title: 'Paloma Baja (Las Dunas), Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Paloma Baja (Las Dunas) windsurf spot guide in Tarifa, Spain. Wave-protected slalom spot near Punta Paloma.',
    url: 'https://www.windyspot.com/spots/cadiz/paloma-baja',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', width: 1200, height: 630, alt: 'Paloma Baja Windsurf Spot, Tarifa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paloma Baja (Las Dunas), Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Paloma Baja windsurf spot guide in Tarifa, Spain. Wave-protected slalom spot near Punta Paloma.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/cadiz/paloma-baja',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Paloma Baja',
  description: 'Paloma Baja (Las Dunas) windsurf spot guide in Tarifa, Spain. Wave-protected slalom spot near Punta Paloma with live station, forecast, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/cadiz/paloma-baja',
  containedInPlace: {
    '@type': 'Place',
    name: 'Tarifa, Cadiz',
  },
}

export default function PalomaBaja() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Paloma Baja</h2>
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
                                    <AddToMySpotsButton spotId={23} />
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
                                <WindguruWidget spotId="43" uid="wg_fwdg_43_100_palomabaja" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="2667" uid="wglive_2667_palomabaja" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Paloma Baja Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Paloma Baja, also known as Las Dunas, is the last spot inside the Bay of Tarifa. Sitting right in the dunes near Punta Paloma, the cape at the western end of the bay provides natural wave protection that makes this spot unique.</p>
                                    <p>Best wind: Both Poniente and Levante work here. During Poniente, the cape and dune sometimes accelerate the wind, giving you the strongest Poniente conditions in the bay with surprisingly flat water despite the onshore direction. During Levante, you get side-shore conditions similar to the Bibo area, though the wind can be slightly stalled right in front of the dune.</p>
                                    <p>Wave protection: The big advantage of this spot is that the cape protects the bay from Atlantic swell. When all the other spots have gnarly shore break that makes getting in and out nearly impossible, Paloma Baja often has much smaller waves and an easier launch. This makes it the go-to for slalom sailors on wavy days who want to avoid destroying their gear in the shore break.</p>
                                    <p>Levante: The Levante here bends around the mountain and comes in more side-shore than at the other Tarifa spots where it is more offshore. This also smoothens the wind somewhat. When the Poniente is weak in town, you can get it a bit stronger here.</p>
                                    <p>Beach walk: Long walk over the beach to the water, plus you have to cross a small river mouth (sometimes called the &ldquo;stinky river&rdquo;). The water level of the river varies.</p>
                                    <p>Parking: Height restriction of about 2.20 metres, so campers cannot enter. However, parking is free, unlike at nearby Bibo. Most of the time the spot is not too crowded &mdash; only when conditions are really firing do you see many people here.</p>
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
