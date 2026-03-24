'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import NavbarLight from '../components/navbar/navbar-light'
import FilterOne from '../components/filter-one'
import MapKitMap from '../components/mapkit-map'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import type { SpotWithLocation, Location } from '../lib/spots'
import { DEFAULT_SPOT_IMAGE } from '../lib/constants'

import { BsGeoAlt } from 'react-icons/bs'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

const ITEMS_PER_PAGE = 9

interface SpotsListProps {
    page: number
    spots: SpotWithLocation[]
    locations: Location[]
}

export default function SpotsList({ page, spots, locations }: SpotsListProps) {
    const searchParams = useSearchParams()
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [rentalFilter, setRentalFilter] = useState<boolean | null>(null)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

    const locationNames = useMemo(() => locations.map(c => c.name), [locations])

    const filteredSpots = useMemo(() => {
        let result = spots
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(s =>
                s.title.toLowerCase().includes(q) ||
                (s.description || '').toLowerCase().includes(q) ||
                s.location.name.toLowerCase().includes(q) ||
                (s.location.country || '').toLowerCase().includes(q)
            )
        }
        if (selectedLocations.length > 0) {
            result = result.filter(s => selectedLocations.includes(s.location.name))
        }
        if (rentalFilter !== null) {
            result = result.filter(s => s.rental_place === rentalFilter)
        }
        return result
    }, [searchQuery, selectedLocations, rentalFilter, spots])

    const mapMarkers = useMemo(() =>
        filteredSpots
            .filter((s) => s.lat != null && s.lon != null)
            .map((s) => ({ title: s.title, slug: s.slug, lat: s.lat!, lon: s.lon! })),
        [filteredSpots]
    )

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

            <section className="p-0" >
                <MapKitMap spots={mapMarkers} />
            </section>

            <div className="bg-white py-3 sticky-lg-top z-3" style={{ top: '54px' }}>
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
                                        <div className="position-relative overflow-hidden rounded-4 explore-listing-card">
                                            <Image src={item.image || DEFAULT_SPOT_IMAGE} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%', objectFit:'cover'}} className="img-fluid" alt={item.title}/>
                                            <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)', paddingTop: '80px'}}>
                                                <h5 className="text-white fw-bold mb-1">{item.title}</h5>
                                                <p className="mb-1 small" style={{color: 'rgba(255,255,255,0.85)'}}>{item.description}</p>
                                                <div className="d-flex align-items-center small" style={{color: 'rgba(255,255,255,0.8)'}}>
                                                    <BsGeoAlt className="me-1"/>{item.location.name}
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
