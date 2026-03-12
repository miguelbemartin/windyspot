import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { MdArrowForwardIos } from 'react-icons/md'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Windy Spot privacy policy — how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://www.windyspot.com/privacy',
  },
}

export default function PrivacyPolicy() {
  return (
    <>
        <NavbarLight/>

        <section className="bg-cover position-relative" style={{backgroundColor:'#212529'}} >
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
                        <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                            <h1 className="text-light xl-heading">Privacy</h1>
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
                            <p>At Windy Spot ("we", "us", or "our"), we respect your privacy and are committed to protecting any personal information you share with us. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data when you use our website windyspot.com (the "Site").</p>

                            <h4 className="fs-4 mt-5">Information we collect</h4>
                            <p>When you create an account on our Site, we collect your name and email address through our authentication provider (Clerk). We do not store passwords directly — authentication is handled securely by Clerk. We do not collect billing information, mailing addresses, or any other personal details beyond what is needed to identify your account.</p>

                            <h4 className="fs-4 mt-5">How we use your information</h4>
                            <p>We use the information we collect solely to provide and improve our services. This includes identifying you when you sign in, saving your preferences and bookmarked spots, and communicating with you if you contact us for support. We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

                            <h4 className="fs-4 mt-5">Cookies and analytics</h4>
                            <p>We use cookies to keep you signed in and to remember your preferences. We may use analytics tools such as Google Analytics to understand how visitors interact with our Site. These tools collect anonymous usage data such as pages visited, time spent on the site, and general geographic location. You can opt out of analytics tracking by using browser extensions or adjusting your cookie settings.</p>

                            <h4 className="fs-4 mt-5">Embedded content from other websites</h4>
                            <p>Our spot pages include embedded content from third-party services such as Windguru (forecasts and live stations), YouTube (webcams), Windy.com (wind maps), and other webcam providers. These embeds may collect data about you, use cookies, and monitor your interaction with the embedded content. We recommend reviewing the privacy policies of these third-party services for more information.</p>

                            <h4 className="fs-4 mt-5">Data retention</h4>
                            <p>We retain your account information for as long as your account is active. If you wish to delete your account and all associated data, please contact us and we will process your request promptly. Anonymous analytics data is retained in aggregated form and cannot be linked back to individual users.</p>

                            <h4 className="fs-4 mt-5">Your rights</h4>
                            <p>You have the right to access, correct, or delete your personal data at any time. If you are located in the European Union, you have additional rights under the GDPR, including the right to data portability and the right to restrict processing. To exercise any of these rights, please contact us at the email address provided on our contact page.</p>

                            <h4 className="fs-4 mt-5">Changes to this privacy policy</h4>
                            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this page periodically to stay informed about how we protect your information.</p>
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
