'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import type { Location } from '../lib/spots'
import { DEFAULT_SPOT_IMAGE } from '../lib/constants'

import { BsGeoAlt, BsSearch } from 'react-icons/bs'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

const ITEMS_PER_PAGE = 12

interface LocationsListProps {
    locations: Location[]
}

export default function LocationsList({ locations }: LocationsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredLocations = useMemo(() => {
        if (!searchQuery.trim()) return locations
        const q = searchQuery.toLowerCase()
        return locations.filter(l =>
            l.name.toLowerCase().includes(q) ||
            (l.country || '').toLowerCase().includes(q)
        )
    }, [searchQuery, locations])

    const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE)
    const page = Math.min(Math.max(1, currentPage), totalPages || 1)
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const paginatedData = filteredLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    function handleSearchChange(q: string) {
        setSearchQuery(q)
        setCurrentPage(1)
    }

    return (
        <>
            <NavbarLight/>

            <section className="bg-cover position-relative ht-41 py-0" style={{backgroundColor:'#2b2b2b'}} data-overlay="4">
                <div className="container h-100">
                    <div className="row align-items-start">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                            <div className="mainlistingInfo">
                                <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                    <div className="firstColumn">
                                        <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                            <div className="listingCaptioninfo">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bg-white py-3 sticky-lg-top z-3" style={{ top: '54px' }}>
                <div className="container">
                    <div className="row align-items-center g-2">
                        <div className="col-lg-4 col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><BsSearch /></span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search locations..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-light">
                <div className="container">
                    <div className="row align-items-center justify-content-between mb-4">
                        <div className="col-xl-5 col-lg-5 col-md-5 col-sm-6 col-6">
                            <div className="totalListingshow">
                                <h6 className="fw-medium text-md mb-0">{filteredLocations.length} locations found</h6>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center justify-content-center g-xl-4 g-3">
                         {paginatedData.map((item) => (
                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={item.id}>
                                <Link href={`/locations/${item.slug}`} className="text-decoration-none">
                                    <div className="position-relative overflow-hidden rounded-4 explore-listing-card">
                                        <Image src={item.image || DEFAULT_SPOT_IMAGE} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%', objectFit:'cover'}} className="img-fluid" alt={item.name}/>
                                        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)', paddingTop: '80px'}}>
                                            <h5 className="text-white fw-bold mb-1">{item.name}</h5>
                                            {item.country && (
                                                <div className="d-flex align-items-center small" style={{color: 'rgba(255,255,255,0.8)'}}>
                                                    <BsGeoAlt className="me-1"/>{item.country}
                                                </div>
                                            )}
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
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(page - 1)}><FaArrowLeft/></button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <li className={`page-item ${p === page ? 'active' : ''}`} key={p}>
                                                <button className="page-link" onClick={() => setCurrentPage(p)}>{p}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(page + 1)}><FaArrowRight/></button>
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
