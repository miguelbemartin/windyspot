'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { resourcesData } from '../data/data'

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

const ITEMS_PER_PAGE = 6

export default function Resources() {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(resourcesData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedData = resourcesData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <>
            <NavbarLight/>

            <section className="bg-cover position-relative" style={{backgroundColor:'#212529'}} >
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
                            <div className="position-relative text-center mb-5 pt-5 pt-lg-0">
                                <h1 className="text-light xl-heading">Resources</h1>
                                <p className="text-light">Guide, tips and resources</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-5">

                <div className="container">
                    <div className="row align-items-center justify-content-between mb-4">
                        <div className="col">
                            <h6 className="fw-medium text-md mb-0">{resourcesData.length} resources</h6>
                        </div>
                    </div>

                    <div className="row justify-content-center g-4">
                        {paginatedData.map((item) => (
                            <div className="col-xl-4 col-lg-4 col-md-6" key={item.id}>
                                <Link href={`/resources/${item.slug}`} className="text-decoration-none h-100 d-block">
                                    <div className="card rounded-4 shadow-sm h-100">
                                        <div className="d-block bg-gradient rounded-top overflow-hidden" style={{height: '200px'}}>
                                            <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%', objectFit:'cover'}} className="card-img-top" alt={item.title}/>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-inline-flex mb-2">
                                                <span className="badge badge-xs badge-primary rounded-pill">{item.tag}</span>
                                            </div>
                                            <h4 className="fw-semibold fs-5 lh-base mb-3">{item.title}</h4>
                                            <p className="text-muted">{item.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="row align-items-center justify-content-center mt-5">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(currentPage - 1)}><FaArrowLeft/></button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <li className={`page-item ${p === currentPage ? 'active' : ''}`} key={p}>
                                                <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(currentPage + 1)}><FaArrowRight/></button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer/>
            <BackToTop/>
        </>
    )
}
