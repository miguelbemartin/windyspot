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
  title: 'Balneario (Playa Chica), Tarifa - Windsurf Spot Guide & Forecast',
  description: 'Balneario (Playa Chica) windsurf spot guide in Tarifa, Spain. Levante flat water and wave conditions where the Mediterranean meets the Atlantic.',
  openGraph: {
    title: 'Balneario (Playa Chica), Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Balneario (Playa Chica) windsurf spot guide in Tarifa, Spain. Levante flat water and wave conditions where the Mediterranean meets the Atlantic.',
    url: 'https://www.windyspot.com/spots/cadiz/balneario',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg', width: 1200, height: 630, alt: 'Balneario Windsurf Spot, Tarifa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balneario (Playa Chica), Tarifa - Windsurf Spot Guide & Forecast',
    description: 'Balneario windsurf spot guide in Tarifa, Spain. Levante flat water and wave conditions.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/cadiz/balneario',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Balneario',
  description: 'Balneario (Playa Chica) windsurf spot guide in Tarifa, Spain. Levante flat water and wave conditions where the Mediterranean meets the Atlantic.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/david-vives-zD6sFNw__u4-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/cadiz/balneario',
  containedInPlace: {
    '@type': 'Place',
    name: 'Tarifa, Cadiz',
  },
}

export default function Balneario() {
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
                                                <h2 className="fw-semibold text-light mb-0">Balneario</h2>
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
                                    <AddToMySpotsButton spotId={18} />
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
                                <WindguruWidget spotId="43" uid="wg_fwdg_43_100_balneario" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="2667" uid="wglive_2667_balneario" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={36.014} lon={-5.604} title="Balneario Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Also known as Playa Chica, Balneario is the easternmost spot in the Bay of Tarifa, sitting right where the Mediterranean meets the Atlantic. On one side you have the Mediterranean Sea and on the other side of the small island is the Atlantic Ocean.</p>
                                    <p>Best wind: Levante (side-offshore from the left). During Levante, the wind blows over the rocks and is relatively steady and not too gusty. Right in front of the beach you get extremely flat water, which is perfect for freestyling and speed runs. Balneario often catches the strongest wind in the bay during Levante conditions.</p>
                                    <p>Waves: When the Levante is strong and pushing across the Mediterranean, waves break right on the rocks and can be the biggest in the whole Bay of Tarifa. The waves break very hollow, making it tricky to get in and out. This is a spot for experts only during swell &mdash; the ramps for jumping only appear when the Levante is strong, typically in winter.</p>
                                    <p>During the main season (June-July onwards), sailing is not allowed here due to swimmers. In Poniente wind, it is straight onshore and best to choose another spot.</p>
                                    <p>Parking: Limited. You only have a narrow street with parking on the side or another lot around the corner. Not the best parking situation in Tarifa.</p>
                                    <p>Hazards: Rocks, hollow shore break, kite surfers training for Big Air (watch out for landings). The short sailing distance before hitting the wind shadow of the town means this is not a spot for every day, but it is quite unique.</p>
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
