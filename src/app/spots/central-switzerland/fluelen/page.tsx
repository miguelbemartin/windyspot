import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'

import WindguruLive from '../../../components/windguru-live'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import YouTubeEmbed from '../../../components/youtube-embed'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Flüelen, Uri - Windsurf Spot Guide & Forecast',
  description: 'Flüelen windsurf spot guide on Lake Uri, Switzerland. Foehn wind conditions with live station, webcams, forecast, and wind map.',
  openGraph: {
    title: 'Flüelen, Uri - Windsurf Spot Guide & Forecast',
    description: 'Flüelen windsurf spot guide on Lake Uri, Switzerland. Foehn wind conditions with live station, webcams, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/central-switzerland/fluelen',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg', width: 1200, height: 630, alt: 'Flüelen Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flüelen, Uri - Windsurf Spot Guide & Forecast',
    description: 'Flüelen windsurf spot guide on Lake Uri, Switzerland. Foehn wind conditions with live station, webcams, forecast, and wind map.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/central-switzerland/fluelen',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Flüelen',
  description: 'Flüelen windsurf spot guide on Lake Uri, Switzerland. Foehn wind conditions with live station, webcams, forecast, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg',
  url: 'https://www.windyspot.com/spots/central-switzerland/fluelen',
  containedInPlace: {
    '@type': 'Place',
    name: 'Flüelen, Uri, Switzerland',
  },
}

export default function Fluelen() {
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
                                                <h1 className="fw-semibold text-light mb-0">Flüelen</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Flüelen, Uri, Switzerland</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={4} />
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
                                    <WeatherForecastTable lat={46.907} lon={8.627} />
                                </div>
                                <div className="row g-4 mt-3">
                                    <div className="col-md-12 text-center">
                                        <img src="https://profiwetter.ch/mos_06672.svg?t=1699802746" alt="Wind Map" className="img-fluid" style={{maxWidth:'100%', width:'900px'}} />
                                    </div>
                                    <div className="col-md-6">
                                        <img src="https://profiwetter.ch/wind_foehn_ch_en.png" alt="Foehn Wind Map" className="img-fluid" />
                                    </div>
                                    <div className="col-md-6">
                                        <img src="https://profiwetter.ch/wind_bise_en.png" alt="Bise Wind Map" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="livestation">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#livestationPanel" aria-controls="livestationPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Station</h4></Link>
                            </div>
                            <div id="livestationPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindguruLive spotId="772" uid="wglive_772_fluelen" />
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
                                        <div className="ratio ratio-16x9">
                                            <img src="https://elbeato.bplaced.net/webcamSurfclub/webcam_bucht.jpg" alt="Gruonbach Webcam" className="object-fit-cover" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="ratio ratio-16x9">
                                            <img src="https://elbeato.bplaced.net/webcamSurfclub/webcam_axenegg.jpg" alt="Axenegg Webcam" className="object-fit-cover" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-4 mt-0">
                                    <div className="col-12">
                                        <div className="ratio ratio-16x9">
                                            <img src="https://imgproxy.windy.com/_/full/plain/current/1644230887/original.jpg" alt="Urnersee Webcam" className="object-fit-cover" />
                                        </div>
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
                                    <WindyEmbed lat={46.928} lon={8.604} title="Flüelen Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Flüelen sits at the southern tip of the Urnersee, where the Reuss valley opens into the lake. Together with Isleten and Sisikon, it forms part of the Urnersee windsurfing triangle — one of the best inland sailing areas in Switzerland, powered by the Foehn.</p>
                                    <p>Conditions: The primary wind is the Foehn (south), which funnels through the Reuss valley and accelerates over the lake. Speeds of 25–40 knots are common during events, with gusts potentially exceeding 50 knots. The water is flat to lightly choppy, perfect for freeride and slalom. On lighter days, a lake thermal can provide gentle afternoon winds.</p>
                                    <p>Season: Foehn events are most frequent in spring (March–May) and autumn (October–November) but can occur any time of year. Events typically last a few hours to several days. Summer thermals offer lighter but more predictable afternoon sessions.</p>
                                    <p>Hazards: Foehn conditions can escalate quickly — always check the forecast and watch for darkening skies over the southern mountains. The lake is deep and cold year-round; a wetsuit is essential. Strong gusts can roll off the valley walls without warning. The launch area can get crowded on strong Foehn days.</p>
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
