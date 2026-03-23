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
  title: 'Sempach, Lucerne - Windsurf Spot Guide & Forecast',
  description: 'Sempach windsurf spot guide on Lake Sempach, Lucerne, Switzerland. Live station, webcams, forecast, and wind map.',
  openGraph: {
    title: 'Sempach, Lucerne - Windsurf Spot Guide & Forecast',
    description: 'Sempach windsurf spot guide on Lake Sempach, Lucerne, Switzerland. Live station, webcams, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/central-switzerland/sempach',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/marvin-meyer-ua_tu9vqLAU-unsplash.jpg', width: 1200, height: 630, alt: 'Sempach Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sempach, Lucerne - Windsurf Spot Guide & Forecast',
    description: 'Sempach windsurf spot guide on Lake Sempach, Lucerne, Switzerland. Live station, webcams, and forecast.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/marvin-meyer-ua_tu9vqLAU-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/central-switzerland/sempach',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Sempach',
  description: 'Sempach windsurf spot guide on Lake Sempach, Lucerne, Switzerland. Live station, webcams, forecast, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/marvin-meyer-ua_tu9vqLAU-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/central-switzerland/sempach',
  containedInPlace: {
    '@type': 'Place',
    name: 'Sempach, Lucerne, Switzerland',
  },
}

export default function Sempach() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/marvin-meyer-ua_tu9vqLAU-unsplash.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h1 className="fw-semibold text-light mb-0">Sempach</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Sempach, Lucerne, Switzerland</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={16} />
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
                                    <WeatherForecastTable lat={47.131} lon={8.192} />
                                </div>
                                <WindguruWidget spotId="905886" uid="wg_fwdg_TODO_100_sempach" />
                                <div className="row g-4 mt-3">
                                    <div className="col-md-12">
                                        <img src="https://profiwetter.ch/mos_06648.svg?t=1772464868" alt="Wind Map" className="img-fluid" />
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
                                    <WindguruLive spotId="2223" uid="wglive_2223_sempach" />
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
                                    <div className="col-12">
                                        <div className="ratio ratio-16x9">
                                            <img src="https://img.destination.one/remote/.webp?url=https%3A%2F%2Fwindsurfclubeich.ch%2Fwebcam%2Fhikvision_current.jpg&scale=both&mode=crop&quality=90&width=2560&height=1440&cacheduration=600" alt="Sempach Webcam" className="object-fit-cover" />
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
                                    <WindyEmbed lat={47.132} lon={8.190} title="Sempach Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Lake Sempach is a small, scenic lake in the canton of Lucerne, popular with local windsurfers and foilers. The lake is relatively shallow and warms up quickly in summer, making it one of the more comfortable inland spots in Central Switzerland.</p>
                                    <p>Conditions: The main winds are the Bise (northeast) and westerly/southwesterly breezes, typically ranging from 12–20 knots. The lake's compact size means short, choppy waves rather than swell — good for freeride and foiling. Stronger wind days are less frequent than on the larger alpine lakes but can still deliver solid sessions.</p>
                                    <p>Season: The best wind months are spring (March–May) when frontal systems bring stronger westerlies and Bise events. Summer thermals provide lighter afternoon winds. Autumn can also be good, particularly during Bise episodes. The lake is sailable year-round for those with the right gear.</p>
                                    <p>Hazards: The lake is relatively safe with no strong currents. The main concern is boat traffic during summer weekends. The water can be shallow near the edges — watch for weed patches. A wetsuit is recommended outside the peak summer months.</p>
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
