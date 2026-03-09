import React from 'react'
import { FaEnvelope } from 'react-icons/fa6'
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

        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-8 col-md-10 text-center">
                        <div className="p-5 rounded-4 shadow-sm" style={{backgroundColor:'#f8f9fa'}}>
                            <div className="mb-4">
                                <FaEnvelope className="text-primary" size={48} />
                            </div>
                            <h3 className="fw-bold mb-3">Get in Touch</h3>
                            <p className="text-muted mb-4">
                                Have a question about a spot, want to suggest a new one, or just want to say hi? Feel free to reach out!
                            </p>
                            <p>If you want to add or update a spot, send me an email. I am still working on this, but in the near future, you could just create an account and add yourself. </p>
                            <a
                                href="mailto:miguel@miguelangelmartin.me"
                                className="btn btn-primary btn-lg rounded-pill px-4"
                            >
                                <FaEnvelope className="me-2" />
                                miguel@miguelangelmartin.me
                            </a>
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
