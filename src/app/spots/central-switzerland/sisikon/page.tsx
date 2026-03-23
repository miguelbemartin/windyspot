import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Sisikon, Uri - Windsurf Spot Guide & Forecast',
  description: 'Sisikon windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with forecast, spot guide, and wind map.',
  openGraph: {
    title: 'Sisikon, Uri - Windsurf Spot Guide & Forecast',
    description: 'Sisikon windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with forecast, spot guide, and wind map.',
    url: 'https://www.windyspot.com/spots/central-switzerland/sisikon',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg', width: 1200, height: 630, alt: 'Sisikon Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sisikon, Uri - Windsurf Spot Guide & Forecast',
    description: 'Sisikon windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with forecast and spot guide.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/central-switzerland/sisikon',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Sisikon',
  description: 'Sisikon windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with forecast, spot guide, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg',
  url: 'https://www.windyspot.com/spots/central-switzerland/sisikon',
  containedInPlace: {
    '@type': 'Place',
    name: 'Uri, Switzerland',
  },
}

export default function Sisikon() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Sisikon</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Uri, Switzerland</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={15} />
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
                                    <WeatherForecastTable lat={46.940} lon={8.658} />
                                </div>
                                <WindguruWidget spotId="57010" uid="wg_fwdg_57010_100_sisikon" />
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={46.945} lon={8.648} title="Sisikon Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>The spot in short: Sisikon sits on the eastern shore of the Urnersee, the southernmost arm of Lake Lucerne. Surrounded by steep alpine walls, it benefits from the same Foehn wind system as the nearby Isleten and Urnersee spots, with the narrow valley acting as a natural wind funnel.</p>
                                    <p>Conditions: The main wind is the Foehn (south), a warm, dry wind that accelerates through the alpine valleys and can reach 30-50 knots. Sessions are typically gusty with strong thermals. The lake provides flat to lightly choppy water, ideal for freeride and slalom sailing.</p>
                                    <p>Season: Foehn events occur year-round but are most frequent in spring (March-May) and autumn (October-November). These events can last from a few hours to several days. Summer thermals provide lighter but more consistent afternoon winds for recreational sailing.</p>
                                    <p>Hazards: Foehn conditions can change rapidly — always monitor weather forecasts closely. The lake is deep and cold, especially outside summer months. Strong gusts can appear suddenly near the valley walls. A wetsuit is recommended year-round.</p>
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
