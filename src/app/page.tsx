import React from 'react'
import Link from 'next/link'

import { BsMouse } from 'react-icons/bs'

import NavbarLight from './components/navbar/navbar-light'
import SpotSearch from './components/spot-search'
import ExploreListingOne from './components/explore-listing-one'
import ExploreCity from './components/explore-city'
import Footer from './components/footer/footer'
import BackToTop from './components/back-to-top'

import { getSpots, getFeaturedSpots, getLocationsWithSpots } from './lib/spots'

export default async function IndexTen() {
  const [spots, featuredSpots, locationsWithSpots] = await Promise.all([
    getSpots(),
    getFeaturedSpots(),
    getLocationsWithSpots(),
  ])
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Windy Spot',
    url: 'https://www.windyspot.com',
    description: 'Discover the best windsurf spots worldwide with detailed forecast, live wind stations, webcams, and spot guides.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.windyspot.com/spots?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>

     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
     />

     <NavbarLight/>

    <div className="image-cover hero-header bg-primary position-relative" style={{backgroundImage:`url('https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg')`}} data-overlay="6">
        <div className="container position-relative z-1">
            <div className="row justify-content-center align-items-center mb-5 pt-lg-0 pt-5">
                <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
                    <div className="position-relative text-center">
                        <h1>WE LOVE WIND</h1>
                        <p className="fs-5 fw-light">all we want for life is some knots</p>
                    </div>
                </div>
            </div>

            <div className="row align-items-start justify-content-center mb-lg-5 mb-4">
                <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
                    <SpotSearch spots={spots} />
                </div>
            </div>
        </div>
        <div className="mousedrop z-1"><Link href="#mains" className="mousewheel center"><BsMouse/></Link></div>
    </div>

    <section>
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                    <div className="secHeading-wrap text-center">
                        <h3 className="sectionHeading">Explore Trending <span className="text-primary">Spots</span></h3>
                        <p>Detailed Spot Guides with Forecast, Live Stations and Webcams</p>
                    </div>
                </div>
            </div>

            <ExploreListingOne spots={featuredSpots} />

            <div className="row align-items-center justify-content-center mt-5">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    <div className="text-center"><Link href="/spots" className="btn btn-light-primary fw-medium rounded-pill px-md-5">explore more spots</Link></div>
                </div>
            </div>
        </div>
    </section>

    <section className="bg-light">
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                    <div className="secHeading-wrap text-center">
                        <h3 className="sectionHeading">Explore Spots By <span className="text-primary">Cities</span></h3>
                        <p>Browse windsurf spots by region and find your next session</p>
                    </div>
                </div>
            </div>
            <ExploreCity locations={locationsWithSpots} />
        </div>
    </section>

    <section className="bg-cover bg-primary-2 position-relative py-5" style={{backgroundImage:`url('/img/brand-section.png')`}}>
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12 text-center">
                    <h4 className="text-white mb-3">Want to add a spot?</h4>
                    <p className="text-white opacity-75 mb-0">If you want to add or update any of the spots, you can just <Link href="/contact-me" className="text-white fw-medium text-decoration-underline">contact me</Link>.</p>
                </div>
            </div>
        </div>
    </section>

    <Footer/>

    <BackToTop/>

    </>
  )
}
