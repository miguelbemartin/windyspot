import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

import NavMinimal from './components/navbar/nav-minimal'
import Footer from './components/footer/footer'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found. Head back to the homepage to explore windsurf spots worldwide.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <NavMinimal />

      <section className="image-cover position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }} data-overlay="5">
        <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/mark-mc-neill-O3Gb3J2HSdA-unsplash.jpg" alt="Ocean waves background" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="container position-relative z-1">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-6 col-lg-8 col-md-10 text-center">
              <h1 className="display-1 fw-bold text-white mb-3">404</h1>
              <h2 className="fw-semibold text-white mb-3">Page Not Found</h2>
              <p className="fs-5 text-white opacity-75 mb-4">Looks like something went wrong. Let's get you back on track.</p>
              <Link href="/" className="btn btn-lg btn-primary fw-medium rounded-pill px-5">Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
