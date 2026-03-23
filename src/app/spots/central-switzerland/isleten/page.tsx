import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'

import WindguruWidget from '../../../components/windguru-widget'
import WeatherForecastTable from '../../../components/weather-forecast-table'
import YouTubeEmbed from '../../../components/youtube-embed'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Isleten, Uri - Windsurf Spot Guide & Forecast',
  description: 'Isleten windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with webcams, forecast, and wind map.',
  openGraph: {
    title: 'Isleten, Uri - Windsurf Spot Guide & Forecast',
    description: 'Isleten windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with webcams, forecast, and wind map.',
    url: 'https://www.windyspot.com/spots/central-switzerland/isleten',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg', width: 1200, height: 630, alt: 'Isleten Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isleten, Uri - Windsurf Spot Guide & Forecast',
    description: 'Isleten windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with webcams and forecast.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/central-switzerland/isleten',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Isleten',
  description: 'Isleten windsurf spot guide on Urnersee, Uri, Switzerland. Foehn wind conditions with webcams, forecast, and wind map.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/isleten.jpg',
  url: 'https://www.windyspot.com/spots/central-switzerland/isleten',
  containedInPlace: {
    '@type': 'Place',
    name: 'Isenthal, Uri, Switzerland',
  },
}

export default function Isleten() {
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
                                                <h1 className="fw-semibold text-light mb-0">Isleten</h1>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Isenthal, Uri, Switzerland</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={13} />
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
                                    <WeatherForecastTable lat={46.933} lon={8.605} />
                                </div>
                                <WindguruWidget spotId="988948" uid="wg_fwdg_620377_100_1772444520906" />
                                <div className="row g-4 mt-3">
                                    <div className="col-md-12">
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

                        <div className="listingSingleblock mb-4" id="webcams">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#webcamsPanel" aria-controls="webcamsPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Live Webcams</h4></Link>
                            </div>
                            <div id="webcamsPanel" className="panel-collapse collapse show">
                            <div className="card-body p-4 pt-2">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="ratio ratio-16x9">
                                            <img src="https://elbeato.bplaced.net/webcamSurfclub/webcam_bucht.jpg" alt="Urnersee Webcam" className="object-fit-cover" />
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
                                            <img src="https://imgproxy.windy.com/_/full/plain/current/1644230887/original.jpg" alt="Urnersee Webcam 3" className="object-fit-cover" />
                                        </div>
                                        <p className="text-small">Isleten Webcam (source: windy.com)</p>
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
                                    <WindyEmbed lat={46.938} lon={8.619} title="Isleten Wind Map" />
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>

                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Isleten is a small bay on the western shore of the Urnersee, tucked into the entrance of the Isenthal valley. It is one of the most popular windsurfing spots in Central Switzerland and a classic Foehn riding location alongside Flüelen and Sisikon.</p>
                                    <p>Conditions: The Foehn (south) is the main wind, channelled by the steep alpine terrain surrounding the Urnersee. It typically arrives as a steady 20–35 knot breeze with stronger gusts near the valley walls. The lake surface stays relatively flat, offering clean freeride and slalom conditions. A light northerly (Bise) can also work here on occasion.</p>
                                    <p>Season: Peak Foehn season is spring (March–May) and autumn (October–November). Summer brings lighter thermal winds in the afternoon, suitable for recreational sailing and foiling. Winter Foehn events are rarer but can be exceptionally strong.</p>
                                    <p>Hazards: The water temperature is cold year-round — a good wetsuit is essential, especially outside summer. Foehn gusts can be violent and unpredictable near the cliffs. The launch area is small and can get busy; be considerate of other sailors. Always check the Foehn forecast before heading out, as conditions can change rapidly.</p>
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
