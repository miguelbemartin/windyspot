import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import NavbarLight from '../../../components/navbar/navbar-light'
import WindguruWidget from '../../../components/windguru-widget'
import WindyEmbed from '../../../components/windy-embed'
import Footer from '../../../components/footer/footer'
import BackToTop from '../../../components/back-to-top'

import AddToMySpotsButton from '../../../components/add-to-my-spots-button'
import { FaLocationDot } from 'react-icons/fa6'

export const metadata: Metadata = {
  title: 'Falasarna, Crete - Windsurf Spot Guide & Forecast',
  description: 'Falasarna windsurf spot guide in Crete, Greece. Meltemi wind conditions with forecast, spot guide, and wind map for this sandy beach on the northwest coast.',
  openGraph: {
    title: 'Falasarna, Crete - Windsurf Spot Guide & Forecast',
    description: 'Falasarna windsurf spot guide in Crete, Greece. Meltemi wind conditions with forecast, spot guide, and wind map.',
    url: 'https://www.windyspot.com/spots/crete/falasarna',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg', width: 1200, height: 630, alt: 'Falasarna Windsurf Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Falasarna, Crete - Windsurf Spot Guide & Forecast',
    description: 'Falasarna windsurf spot guide in Crete, Greece. Meltemi wind conditions with forecast, spot guide, and wind map.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/spots/crete/falasarna',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'SportsActivityLocation'],
  name: 'Falasarna',
  description: 'Falasarna windsurf spot guide in Crete, Greece. Meltemi wind conditions with forecast, spot guide, and wind map for this sandy beach on the northwest coast.',
  image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg',
  url: 'https://www.windyspot.com/spots/crete/falasarna',
  containedInPlace: {
    '@type': 'Place',
    name: 'Crete, Greece',
  },
}

export default function Falasarna() {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavbarLight/>

        <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/spots/evangelos-mpikakis-Kq5zEZgz-MM-unsplash.jpg')`}} data-overlay="4">
            <div className="container h-100">
                <div className="row align-items-start">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="mainlistingInfo">
                            <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                <div className="firstColumn">
                                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                        <div className="listingCaptioninfo">
                                            <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                <h2 className="fw-semibold text-light mb-0">Falasarna</h2>
                                            </div>
                                            <div className="listingsbasicInfo">
                                                <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                    <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2"/>Crete, Greece</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddToMySpotsButton spotId={12} />
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
                                    <WindguruWidget spotId="49269" uid="wg_fwdg_49269_100_falasarna" />
                                </div>
                            </div>
                        </div>


                        <div className="listingSingleblock mb-4" id="descriptions">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-parent="#description" data-bs-target="#description" aria-controls="description" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Spot Guide</h4></Link>
                            </div>
                            <div id="description" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <p>Falasarna is a long sandy beach on the northwest tip of Crete, facing west into the open Mediterranean. The spot is best known for its consistent Meltemi wind — the strong northerly thermal wind that blows across the Aegean from June through September, funnelling along the coast and arriving as cross-shore from the right.</p>
                                    <p>Conditions: The Meltemi typically builds from midday and can reach 20–30 knots by afternoon, making it ideal for freeride and wave sailing on 4.0–5.5 sails. The sandy bottom and gradual depth make it forgiving for all levels. On bigger Meltemi days, a decent shore break develops that offers fun bump-and-jump conditions.</p>
                                    <p>Season: Peak wind season runs from mid-June to mid-September, with July and August being the most reliable months. Outside the Meltemi season, occasional westerly and southwesterly storms can bring rideable conditions, though they are less predictable.</p>
                                    <p>Hazards: The beach is generally very safe with a sandy bottom and no rocks. The main thing to watch for is the shore break on strong wind days, which can make waterstarting tricky close to shore. The current can run parallel to the beach on bigger days — stay aware of your position relative to the launch point.</p>
                                    <p>Getting there: Falasarna is about 50 km west of Chania, roughly a one-hour drive. The beach has parking, a few tavernas, and basic facilities. The nearest windsurf/kite centre operates seasonally. Chania airport (CHQ) has direct flights from most European cities during summer.</p>
                                </div>
                            </div>
                        </div>

                        <div className="listingSingleblock mb-4" id="windy">
                            <div className="SingleblockHeader">
                                <Link data-bs-toggle="collapse" data-bs-target="#windyPanel" aria-controls="windyPanel" href="#" aria-expanded="false" className="collapsed"><h4 className="listingcollapseTitle">Wind Map</h4></Link>
                            </div>
                            <div id="windyPanel" className="panel-collapse collapse show">
                                <div className="card-body p-4 pt-2">
                                    <WindyEmbed lat={35.492} lon={23.569} title="Falasarna Wind Map" />
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
