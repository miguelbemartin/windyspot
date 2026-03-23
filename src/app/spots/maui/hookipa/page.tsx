import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import WindguruLive from '../../../components/windguru-live'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Hookipa, Maui - Windsurf Spot Guide & Forecast',
  description: 'Hookipa windsurf spot guide in Maui, Hawaii. The most iconic wave sailing spot in the world with live station, forecast, wind map, and expert spot guide.',
  openGraph: {
    title: 'Hookipa, Maui - Windsurf Spot Guide & Forecast',
    description: 'Hookipa windsurf spot guide in Maui, Hawaii. The most iconic wave sailing spot in the world with live station, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/maui/hookipa',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg', width: 1200, height: 630, alt: 'Hookipa Windsurf Spot, Maui' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hookipa, Maui - Windsurf Spot Guide & Forecast',
    description: 'Hookipa windsurf spot guide in Maui, Hawaii. The most iconic wave sailing spot in the world.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/maui/hookipa',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Hookipa',
  description: 'Hookipa windsurf spot guide in Maui, Hawaii. The most iconic wave sailing spot in the world with live station, forecast, wind map, and expert spot guide.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/maui/hookipa',
  containedInPlace: {
    '@type': 'Place',
    name: 'Maui, Hawaii',
  },
}

export default function Hookipa() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/luke-scarpino-ngRNC_h2G8E-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Hookipa</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Maui, Hawaii</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={24} />
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
                                <div className="mb-4">
                                    <WeatherForecastTable lat={20.934} lon={-156.356} />
                                </div>
                                <WindguruWidget spotId="26144" uid="wg_fwdg_26144_100_hookipa" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="5931" uid="wglive_5931_hookipa" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={20.934} lon={-156.356} title="Hookipa Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Hookipa Beach Park on Maui's north shore is the most iconic wave sailing spot in the world. This is where modern windsurfing wave riding was born in the 1980s, and it remains the ultimate proving ground for the sport's best sailors.</p>
                                    <p>Wind: The trade winds blow cross-shore from the right (northeast) at 15-30 knots, typically filling in around midday and lasting through the afternoon. The trades are most consistent from April through September, with the summer months offering the most reliable daily sessions. Winter can bring lighter or variable winds, but also bigger swells.</p>
                                    <p>Waves: Hookipa picks up powerful north and northwest Pacific swells that wrap around the headland. Winter swells regularly produce mast-high to double-mast-high waves, while summer brings smaller but still fun surf. The reef break produces fast, hollow waves with multiple sections for riding, and the inside section near the rocks can be very challenging.</p>
                                    <p>Sailing area: The main sailing area stretches from the point on the right to the middle of the bay. Riders launch from the eastern end of the beach, using the channel between the reef sections to get out. The wave face on the main peak offers long rides with critical top turns and aerials. Jumping is best further out where the swell hits the outer reef.</p>
                                    <p>Level: Expert only. Hookipa demands strong wave riding skills, the ability to handle powerful shore break, and confidence in overhead-plus surf. The reef is shallow in places, currents can be strong, and the inside rocks punish mistakes. Even getting in and out through the shore break requires experience.</p>
                                    <p>Access: Windsurfers typically sail in the afternoon after surfers have had their morning sessions &mdash; an unwritten but deeply respected local rule. The beach park has parking, restrooms, and a grassy area for rigging. Respect the lineup and the locals.</p>
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
