"use client"
import React from 'react'
import Link from 'next/link'

import CountUp from 'react-countup'

import { counterData, workData } from '../data/data'

import { MdArrowForwardIos } from 'react-icons/md'
import { BsCaretRight, BsPlayCircleFill } from 'react-icons/bs'

import NavbarLight from '../components/navbar/navbar-light'
import ClientOne from '../components/client-one'
import TeamOne from '../components/team-one'
import FooterTop from '../components/footer-top'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'
import Image from 'next/image'
import { IconType } from 'react-icons'

interface CounterData{
    number: number;
    symbol: string;
    title: string;
}

interface WorkData{
    icon: IconType;
    title: string;
    desc: string;
}

export default function AboutUs() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative" style={{backgroundImage:`url('/images/about-me/miguel-02.jpg')`}} data-overlay="6">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
                        <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                            <h1 className="text-light xl-heading">About Me</h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="pb-5">
            <div className="container">
                <div className="row">

                    <div className="row justify-content-between align-items-center g-4 mb-5">
                        {/* <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12">
                            <div className="missionImg">
                                <Image src="/img/side-img.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid" alt=""/>
                            </div>
                        </div> */}
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="missioncaps">
                                <div className="d-block mb-4">
                                    <h2>Why I love windsurfing</h2>
                                </div>
                                <p>There is something deeply addictive about windsurfing. It is one of the few sports where you are completely at the mercy of nature — the wind, the waves, the currents — and yet, when everything clicks, you feel an incredible sense of control and freedom. Every session is different. The same spot can feel like a completely new playground depending on the conditions.</p>
                                <p>I love the fact that it forces you to disconnect. When you are on the water, there is no phone, no screen, no notifications. It is just you, the sail, the board, and the elements. It is physically demanding but also meditative. After a good session, I feel recharged in a way that nothing else can replicate. The community is also amazing — windsurfers are some of the most laid-back, passionate people you will ever meet.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section className="bg-cover" style={{backgroundImage:`url('/images/about-me/miguel-01.png')`, backgroundColor:'#ffffff'}} data-overlay="1">
            <div className="container">
                <div className="row">
                    <div className="row justify-content-center align-items-center mb-5">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="position-relative text-end py-5">
                                <div className="promoHeading mb-5 mt-4">
                                    <h5 className="text-light">The best sessions are the ones you almost skipped.</h5>
                                    <h6 className="text-light">Chase the wind, discover new spots, and let the water remind you what freedom feels like.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="pb-5">
            <div className="container">
                <div className="row">
                    <div className="row justify-content-between align-items-center g-4 mb-5">

                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="missioncaps">
                                <div className="d-block mb-4">
                                    <h2>The motivation to start this project</h2>
                                </div>
                                <p>When I moved to Switzerland, I quickly realized that windsurfing on lakes is a completely different world compared to the ocean. The wind patterns are complex — foehn, bise, thermals — and each lake has its own microclimate. Information was scattered across local club websites, forums in German, and word of mouth. As a newcomer, it was incredibly hard to figure out where to go, when to go, and what to expect.</p>
                                <p>That frustration became the spark for Windy Spots. I wanted to build the resource I wished I had when I arrived: a single place where you can check the forecast, see live conditions, watch webcams, and read a proper spot guide — all in one page. Whether you are a local looking for a quick session or a traveler planning a windsurf trip, the goal is to make it simple to find your next spot and get on the water with confidence.</p>
                            </div>
                        </div>

                        {/* <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12">
                            <div className="missionImg">
                                <Image src="/img/side-img.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid" alt=""/>
                            </div>
                        </div> */}
                    </div>

                </div>
            </div>
        </section>

        <section className="pb-5">
            <div className="container">
                <div className="row">

                    <div className="row justify-content-between align-items-center g-4 mb-5">
                        {/* <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12">
                            <div className="missionImg">
                                <Image src="/img/side-img.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid" alt=""/>
                            </div>
                        </div> */}
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="missioncaps">
                                <div className="d-block mb-4">
                                    <h2>How I started</h2>
                                </div>
                                <p>It all began about five years ago on a beach in the south of France. I was on holiday and saw a windsurfing school offering beginner lessons. On a whim, I signed up — no expectations, just curiosity. The first few hours were humbling: falling constantly, struggling to hold the sail, wondering how anyone makes it look easy. But then came that one moment where the wind filled the sail, the board started gliding, and everything just clicked.</p>
                                <p>I was hooked from that very first run. Back home, I started chasing every windy day I could find, slowly upgrading gear and pushing myself to sail in stronger conditions. When I moved to Switzerland, the lakes became my new playground. The learning curve was steep — lake sailing has its own rules — but the passion only grew stronger. What started as a casual holiday activity turned into a way of life.</p>
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
