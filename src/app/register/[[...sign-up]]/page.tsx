import { SignUp } from '@clerk/nextjs'
import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import NavbarLight from '../../components/navbar/navbar-light'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function Register() {
  return (
    <>

    <NavbarLight/>

    <section className="position-relative" data-overlay="6">
      <Image src="https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
      <div className="container position-relative z-1">
        <div className="row align-items-center justify-content-center" style={{minHeight: '100vh'}}>
          <div className="col-xl-5 col-lg-7 col-md-9">
            <div className="authWrap d-flex justify-content-center">
              <SignUp />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
