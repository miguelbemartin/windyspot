import { SignIn } from '@clerk/nextjs'
import React from 'react'
import NavbarLight from '../../components/navbar/navbar-light'

export default function Login() {
  return (
    <>
    <NavbarLight/>
    <section style={{backgroundImage:`url('https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg')`, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}} data-overlay="6">
      <div className="container position-relative z-1">
        <div className="row align-items-center justify-content-center" style={{minHeight: '100vh'}}>
          <div className="col-xl-5 col-lg-7 col-md-9">
            <div className="authWrap d-flex justify-content-center">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
