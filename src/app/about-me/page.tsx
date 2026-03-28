import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

export const metadata: Metadata = {
  title: 'About Me - The Story Behind Windy Spot',
  description: 'Learn about the windsurfer behind Windy Spot — why I started this project, my passion for windsurfing, and the motivation to build the spot guide I wished existed.',
  openGraph: {
    title: 'About Me - The Story Behind Windy Spot',
    description: 'Learn about the windsurfer behind Windy Spot — why I started this project and my passion for windsurfing.',
    url: 'https://www.windyspot.com/about-me',
    images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/about-me/miguel-02.jpg', width: 1200, height: 630, alt: 'About Windy Spot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Me - The Story Behind Windy Spot',
    description: 'Learn about the windsurfer behind Windy Spot — why I started this project and my passion for windsurfing.',
    images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/about-me/about-me-miguel-02.jpg'],
  },
  alternates: {
    canonical: 'https://www.windyspot.com/about-me',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Miguel',
    description: 'Windsurfer and creator of Windy Spot — a windsurf spot guide with forecasts, live stations, and webcams.',
    url: 'https://www.windyspot.com/about-me',
    image: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/about-me/about-me-miguel-02.jpg',
  },
}

export default function AboutUs() {
  return (
    <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <NavbarLight/>

        <section className="pb-0">
            <div className="container">
                <div className="row align-items-center justify-content-center pt-5">
                    <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                        <div className="secHeading-wrap text-center">
                            <h3 className="sectionHeading">About <span className="text-primary">Me</span></h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="position-relative" style={{ backgroundColor:'#ffffff' }} data-overlay="5">
            <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/about-me/about-me-miguel-02.jpg" alt="Miguel windsurfing" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            <div className="container position-relative z-1">
                <div className="row">
                    <div className="row justify-content-center align-items-center mb-0">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="position-relative py-2">
                                <div className="promoHeading mb-5 mt-0">
                                    <h2 className="text-light">It was never part of the plan</h2>
                                    <h5 className="text-light">I wasn't supposed to fall in love with windsurfing.</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <section className="pb-5 pt-5">
            <div className="container">
                <div className="row">
                    <div className="row justify-content-between align-items-top g-4 mb-5">
                        <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12">
                            <div className="missioncaps">
                                <p>I was on vacation in the South of France, in the postcard-perfect village of Les Salles-sur-Verdon. The lake was calm, framed by cliffs and summer light, when I noticed a few windsurfers gliding across the water. They looked weightless, almost unreal, balancing between air and lake.</p>
                                <p>My first thought was simple: That looks impossible.</p>
                                <p>This was not part of the plan. We were there for camping, swimming, long lunches — not extreme sports. But my wife, who knows me better than I know myself, insisted I try it “just for fun.” So I booked a lesson for that afternoon.</p>
                                <p>My instructor was a seasonal windsurfer from Fuerteventura, sunburned, relaxed, the kind of person who makes hard things look easy. He took me out in a small motorboat and introduced me to the basics: how to stand, how to hold the sail, how to find the wind. It felt awkward, unstable, and slightly ridiculous.</p>
                                <p>And completely exhilarating.</p>
                                <p>The next day, convinced I had understood more than I actually had, I rented a board on my own to practice. Confidence can be a dangerous thing. A few shaky maneuvers later, I found myself drifting farther and farther from shore. I had missed one small but critical detail: I didn't know how to sail upwind.</p>
                                <p>I returned to the beach swimming, lying across the board, humbled but laughing.</p>
                                <p>At that point, I thought windsurfing would remain nothing more than a funny vacation story, a summer experiment filed away with other holiday memories.</p>
                                <p>But coincidences have a strange way of rewriting plans.</p>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12">
                            <div className="missionImg">
                                <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/about-me/about-me-miguel-03.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid" alt="Miguel, windsurfer and creator of Windy Spot" loading="lazy"/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section className="position-relative" style={{ backgroundColor:'#ffffff' }} data-overlay="1">
            <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/about-me/about-me-almanarre.png" alt="Windsurfing at Almanarre beach in Hyeres" fill sizes="100vw" style={{ objectFit: 'cover' }} loading="lazy" />
            <div className="container position-relative z-1">
                <div className="row">
                    <div className="row justify-content-center align-items-center mb-5">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="position-relative text-end py-5">
                                <div className="promoHeading mb-5 mt-4">
                                    <h5 className="text-light">Next stop, Almanarre. I had no idea that this stretch of coastline was a legendary windsurfing spot</h5>
                                    <h6 className="text-light">home to icons like Eric Thiémé (FRA 808). To me, it was just another beautiful beach.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="pb-5 pt-5">
            <div className="container">
                <div className="row">
                    <div className="row justify-content-center align-items-center g-4 mb-5">

                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="missioncaps">
                                <p>By chance, I walked into his windsurfing school. Eric was there, relaxed and preparing for a session. I asked, half shy, half hopeful, whether I could take another lesson. His son, Jimmy Thiémé (FR888), stepped in to help.</p>
                                <p>That afternoon the wind was strong. I was given a tiny 2.0 sail, which felt enormous in my hands. Jimmy followed me in a small motorboat, shouting instructions over the wind. The water was choppy, unpredictable, nothing like the calm lake where I had started.</p>
                                <p>And then it happened.</p>
                                <p>For a brief moment, everything aligned: the wind filled the sail, the board lifted, and I wasn't fighting the water anymore, I was moving with it. The board skimmed over the surface, light and fast. My heart pounded. The noise of the wind wrapped around me.</p>
                                <p>That was the first time I felt it. The magic.</p>
                                <p className="fs-5">Not just balance. Not just speed.</p>
                                <p className="fs-4">Freedom.</p>
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
