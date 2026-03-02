import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function Login() {
  return (
    <section style={{backgroundImage:`url('/img/auth-bg.png')`, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundColor:'#ffe8ee', backgroundSize:'cover'}}>
      <div className="container">
        <div className="row align-items-center justify-content-center" style={{minHeight: '100vh'}}>
          <div className="col-xl-5 col-lg-7 col-md-9">
            <div className="authWrap d-flex justify-content-center">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
