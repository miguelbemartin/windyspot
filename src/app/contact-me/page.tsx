import React from 'react'
import { FaBriefcase, FaDribbble, FaFacebookF, FaGlobe, FaHeadset, FaInstagram, FaPaperPlane, FaTwitter } from 'react-icons/fa6'
import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

export default function ContactUs() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative" style={{backgroundColor:'#212529'}} >
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
                        <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                            <h1 className="text-light xl-heading">Contact Me</h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="pb-5">
            <div className="container">
                <div className="row align-items-center justify-content-between g-4">
                    <div className="col-xl-7 col-lg-7 col-md-12">

                    </div>
                    <div className="col-xl-5 col-lg-5 col-md-12">
                    </div>
                </div>
            </div>
        </section>

        <Footer/>
        <BackToTop/>
    </>
  )
}
