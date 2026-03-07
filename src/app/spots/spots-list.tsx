'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import NavLightTwo from '../components/navbar/nav-light-two'
import FilterOne from '../components/filter-one'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { spots, locations as locationsData } from '../data/data'

import { BsGeoAlt } from 'react-icons/bs'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

const ITEMS_PER_PAGE = 9

export default function SpotsList({ page }: { page: number }) {
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [rentalFilter, setRentalFilter] = useState<boolean | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const locationNames = useMemo(() => locationsData.map(c => c.name), [])

    const spotToCityMap = useMemo(() => {
        const map: Record<number, string> = {}
        for (const spot of spots) {
            const city = locationsData.find(c => c.spots.includes(spot.title))
            if (city) map[spot.id] = city.name
        }
        return map
    }, [])

    const filteredSpots = useMemo(() => {
        let result = spots
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.desc.toLowerCase().includes(q) ||
                s.loction.toLowerCase().includes(q)
            )
        }
        if (selectedLocations.length > 0) {
            result = result.filter(s => selectedLocations.includes(spotToCityMap[s.id] || ''))
        }
        if (rentalFilter !== null) {
            result = result.filter(s => s.rentalPlace === rentalFilter)
        }
        return result
    }, [searchQuery, selectedLocations, rentalFilter, spotToCityMap])

    const totalPages = Math.ceil(filteredSpots.length / ITEMS_PER_PAGE)
    const currentPage = Math.min(Math.max(1, page), totalPages || 1)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedData = filteredSpots.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    const pageLink = (p: number) => p === 1 ? '/spots' : `/spots/${p}`

    return (
        <>
            <NavLightTwo/>

            <div className="bg-white py-3 sticky-lg-top z-3">
                <FilterOne
                    list={false}
                    showToggle={false}
                    locations={locationNames}
                    selectedLocations={selectedLocations}
                    onLocationChange={setSelectedLocations}
                    rentalFilter={rentalFilter}
                    onRentalChange={setRentalFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            <section className="bg-light">
                <div className="container">
                    <div className="row align-items-center justify-content-between mb-4">
                        <div className="col-xl-5 col-lg-5 col-md-5 col-sm-6 col-6">
                            <div className="totalListingshow">
                                <h6 className="fw-medium text-md mb-0">{filteredSpots.length} spots found</h6>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center justify-content-center g-xl-4 g-3">
                         {paginatedData.map((item, index) => {
                            return(
                                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={index}>
                                    <Link href={`/spots/${item.slug}`} className="text-decoration-none">
                                        <div className="position-relative overflow-hidden rounded-4" style={{height: '280px'}}>
                                            <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%', objectFit:'cover'}} className="img-fluid" alt={item.title}/>
                                            <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)', paddingTop: '80px'}}>
                                                <h5 className="text-white fw-bold mb-1">{item.title}</h5>
                                                <p className="mb-1 small" style={{color: 'rgba(255,255,255,0.85)'}}>{item.desc}</p>
                                                <div className="d-flex align-items-center small" style={{color: 'rgba(255,255,255,0.8)'}}>
                                                    <BsGeoAlt className="me-1"/>{item.loction}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                         })}
                    </div>

                    {totalPages > 1 && (
                        <div className="row align-items-center justify-content-center mt-5">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <Link href={pageLink(currentPage - 1)} className="page-link"><FaArrowLeft/></Link>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <li className={`page-item ${p === currentPage ? 'active' : ''}`} key={p}>
                                                <Link href={pageLink(p)} className="page-link">{p}</Link>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <Link href={pageLink(currentPage + 1)} className="page-link"><FaArrowRight/></Link>
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
