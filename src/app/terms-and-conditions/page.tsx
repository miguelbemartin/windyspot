import React from 'react'
import { Metadata } from 'next'
import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Windy Spot terms and conditions of use.',
  alternates: {
    canonical: 'https://www.windyspot.com/terms-and-conditions',
  },
}

export default function TermsAndConditions() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative" style={{backgroundColor:'#212529'}} >
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
                        <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                            <h1 className="text-light xl-heading">Terms & Conditions</h1>
                            <p className="text-light">Last updated: March 6th, 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="pb-5">
            <div className="container">
                <div className="row justify-content-center g-4">
                    <div className="col-xl-8 col-lg-10 col-md-12">
                        <article className="article">
                            <p>Welcome to Windy Spot. By accessing and using our website windyspot.com (the "Site"), you agree to be bound by the following terms and conditions. If you do not agree with any part of these terms, please do not use the Site.</p>

                            <h4 className="fs-4 mt-5">Use of the Site</h4>
                            <p>Windy Spot provides windsurf spot guides, weather forecasts, webcam feeds, and wind maps for informational purposes only. The information on this Site is not a substitute for professional weather advice or local safety guidelines. You are solely responsible for assessing conditions and making decisions about whether it is safe to windsurf at any given spot.</p>

                            <h4 className="fs-4 mt-5">User accounts</h4>
                            <p>You may create an account to access certain features of the Site. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and up-to-date information when creating your account. We reserve the right to suspend or terminate accounts that violate these terms.</p>

                            <h4 className="fs-4 mt-5">Intellectual property</h4>
                            <p>All content on this Site, including text, graphics, logos, and software, is the property of Windy Spot or its content providers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this Site without prior written permission. Spot photos used on the Site are sourced from Unsplash and are used in accordance with the Unsplash License.</p>

                            <h4 className="fs-4 mt-5">Third-party content</h4>
                            <p>The Site embeds content from third-party services including Windguru, YouTube, Windy.com, and various webcam providers. We do not control and are not responsible for the content, accuracy, or availability of these third-party services. Your use of embedded third-party content is subject to the respective terms and conditions of those services.</p>

                            <h4 className="fs-4 mt-5">Disclaimer of warranties</h4>
                            <p>The Site and all information provided on it are offered "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or timeliness of any forecast, webcam, or spot information. Weather conditions can change rapidly and unpredictably — always verify conditions independently before heading out on the water.</p>

                            <h4 className="fs-4 mt-5">Limitation of liability</h4>
                            <p>To the fullest extent permitted by law, Windy Spot and its creator shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site or reliance on any information provided on it. This includes, but is not limited to, damages resulting from personal injury, property damage, or loss of data.</p>

                            <h4 className="fs-4 mt-5">Changes to these terms</h4>
                            <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Site after any changes constitutes your acceptance of the updated terms. We encourage you to review this page periodically.</p>
                        </article>
                    </div>
                </div>

            </div>
        </section>

        <Footer/>
        <BackToTop/>
    </>
  )
}
