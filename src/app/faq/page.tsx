import React from 'react'
import { Metadata } from 'next'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about Windy Spot — how the wind forecast works, how to import sessions, which spots are covered, and how to get started.',
    openGraph: {
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions about Windy Spot — how the wind forecast works, how to import sessions, which spots are covered, and how to get started.',
        url: 'https://www.windyspot.com/faq',
    },
    twitter: {
        card: 'summary',
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions about Windy Spot — forecasts, session tracking, spots, and more.',
    },
    alternates: {
        canonical: 'https://www.windyspot.com/faq',
    },
}

const faqs = [
    {
        question: 'What is Windy Spot?',
        answer: 'Windy Spot is a free platform for windsurfers, wingfoilers, and windfoilers. It helps you find the best spots, check wind forecasts, track your sessions, and connect with other riders around the world.',
    },
    {
        question: 'How does the wind forecast work?',
        answer: 'When you set your location, Windy Spot finds the nearest windsurf spots and shows you a multi-day wind forecast for each one. The forecast includes wind speed, gusts, direction, temperature, and general weather conditions. You can set your location from the forecast page — no account needed.',
    },
    {
        question: 'Do I need an account to use Windy Spot?',
        answer: 'No. You can browse all spots, read spot guides, check the wind forecast, and read articles without an account. Creating a free account unlocks session tracking, the community feed, and notifications.',
    },
    {
        question: 'How do I import a windsurf session?',
        answer: 'Go to the Activity page and click "Import Session". You can upload GPX files exported from apps like WaterSpeed, Strava, or any GPS watch. Windy Spot automatically extracts your GPS track, speed, heart rate, duration, and matches your session to the nearest known spot.',
    },
    {
        question: 'Which GPS devices and apps are supported?',
        answer: 'Any device or app that exports standard GPX files works with Windy Spot. This includes Garmin watches, Apple Watch (via third-party apps), Coros, Suunto, and apps like WaterSpeed and Strava. Support for Garmin FIT files and direct Strava sync is coming soon.',
    },
    {
        question: 'What spots are available on Windy Spot?',
        answer: 'Windy Spot covers windsurf spots across Europe and beyond, including popular destinations like Tarifa, Fuerteventura, Lake Garda, Almanarre, Gruissan, and the Greek islands. New spots are added regularly — you can also suggest a spot from your profile.',
    },
    {
        question: 'What are spot guides?',
        answer: 'Spot guides are detailed pages for popular windsurf destinations. Each guide covers wind conditions, best seasons, nearby spots, rental options, and local tips. They are written to help you plan a windsurf trip or make the most of a spot you are visiting for the first time.',
    },
    {
        question: 'How does session tracking work?',
        answer: 'After importing a GPX file, Windy Spot creates a session with your GPS track displayed on a map, colored by speed. You can see stats like total distance, max speed, average speed, heart rate, and duration. All your sessions appear in your activity page with a heatmap showing your consistency over time.',
    },
    {
        question: 'What is the community feed?',
        answer: 'The community feed is a social space where riders share sessions, post photos, and write about conditions. You can follow other windsurfers, like and comment on posts, and discover new spots through what others share.',
    },
    {
        question: 'Is Windy Spot free?',
        answer: 'Yes. Windy Spot is completely free to use, including all spot guides, forecasts, session tracking, and the community features.',
    },
    {
        question: 'Can I use Windy Spot for wingfoiling or kitesurfing?',
        answer: 'Yes. Windy Spot supports windsurfing, wingfoiling, windfoiling, kitesurfing, and parawing. When importing a session, you can select the sport type. The spots and forecasts are relevant for all wind sports.',
    },
    {
        question: 'How can I suggest a new spot or report an issue?',
        answer: 'You can add a new spot directly from your profile if you are logged in. For corrections or general feedback, use the contact page to get in touch.',
    },
]

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
}

export default function FaqPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <NavbarLight />

            <section className="pt-5 mt-5">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h1 className="sectionHeading">Frequently Asked <span className="text-primary">Questions</span></h1>
                                <p>Everything you need to know about Windy Spot.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-md-12">
                            <div className="accordion" id="faqAccordion">
                                {faqs.map((faq, i) => (
                                    <div className="accordion-item border-0 mb-3 rounded-4 shadow-sm overflow-hidden" key={i}>
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button ${i !== 0 ? 'collapsed' : ''} fw-semibold`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#faq-${i}`}
                                                aria-expanded={i === 0 ? 'true' : 'false'}
                                                aria-controls={`faq-${i}`}
                                            >
                                                {faq.question}
                                            </button>
                                        </h2>
                                        <div
                                            id={`faq-${i}`}
                                            className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                                            data-bs-parent="#faqAccordion"
                                        >
                                            <div className="accordion-body text-muted">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <BackToTop />
        </>
    )
}
