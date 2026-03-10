import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {FaFacebookF, FaHeart, FaInstagram, FaTwitter} from 'react-icons/fa'

export default function Footer() {
  return (
        <footer className="footer skin-dark-footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-5 col-lg-6 col-xl-4 d-flex align-items-end justify-content-center justify-content-md-start">
                        <div className="footer-widget pe-xl-4 mb-5 text-center text-md-start">
                            <div className="footerLogo"><Image src='/images/windy-spot-logo.png' width={0} height={0} sizes='100vw' style={{width:'160px', height:'auto'}} className="img-fluid"  alt="Footer Logo"/></div>
                            <div className="footerText"><p>Built with <FaHeart className="ms-1 text-danger"></FaHeart> by <Link href="/about-me" className="text-light">a Windsurfer</Link></p></div>
                            {/* <div className="footerSocialwrap">
                                <ul className="footersocial">
                                    <li><Link href="#" className="social-link"><FaFacebookF className=""/></Link></li>
                                    <li><Link href="#" className="social-link"><FaTwitter className=""/></Link></li>
                                    <li><Link href="#" className="social-link"><FaInstagram className=""/></Link></li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3 col-xl-2 ms-auto d-flex align-items-end justify-content-center justify-content-md-end">
                        <div className="footer-widget mb-5 text-center text-md-start">
                            <h4 className="widget-title">Explore</h4>
                            <ul className="footer-menu">
                                {/* <li><Link href="/resources">Resources</Link></li> */}
                                <li><Link href="/spots">Spots</Link></li>
                                {/* <li><Link href="/cities">Cities</Link></li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3 col-xl-2 d-flex align-items-end justify-content-center justify-content-md-end">
                        <div className="footer-widget mb-5 text-center text-md-start">
                            <h4 className="widget-title">About</h4>
                            <ul className="footer-menu">
                                <li><Link href="/about-me">About Me</Link></li>
                                <li><Link href="/contact-me">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row border-top border-secondary pt-4">
                    <div className="col-12 col-md-6 text-center text-md-start">
                        <p className="text-light opacity-75 small mb-2 mb-md-0">© {new Date().getFullYear()} windyspot.com. All rights reserved.</p>
                    </div>
                    <div className="col-12 col-md-6 text-center text-md-end">
                        <Link href="/privacy" className="text-light opacity-75 small me-3">Privacy</Link>
                        <Link href="/terms-and-conditions" className="text-light opacity-75 small">Terms and Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
  )
}
