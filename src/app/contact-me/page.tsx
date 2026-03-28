import React from 'react'
import { Metadata } from 'next'
import { FaEnvelope } from 'react-icons/fa6'
import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

export const metadata: Metadata = {
  title: 'Contact Me - Suggest a Spot or Say Hi',
  description: 'Get in touch to suggest a new windsurf spot, update an existing one, or just say hi. Reach out via email.',
  openGraph: {
    title: 'Contact Me - Suggest a Spot or Say Hi',
    description: 'Get in touch to suggest a new windsurf spot, update an existing one, or just say hi.',
    url: 'https://www.windyspot.com/contact-me',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Me - Suggest a Spot or Say Hi',
    description: 'Get in touch to suggest a new windsurf spot, update an existing one, or just say hi.',
  },
  alternates: {
    canonical: 'https://www.windyspot.com/contact-me',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Windy Spot',
  description: 'Get in touch to suggest a new windsurf spot, update an existing one, or just say hi.',
  url: 'https://www.windyspot.com/contact-me',
}

export default function ContactUs() {
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
                            <h3 className="sectionHeading">Contact Me</h3>
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
