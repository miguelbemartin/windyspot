import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

import { resourcesData } from '../data/data'

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'
import { RESOURCES_PAGE_SIZE } from '../lib/constants'

export const metadata: Metadata = {
    title: 'Windsurf Articles, Guides & Resources',
    description: 'Read in-depth articles on wind forecasting, sail and gear selection, wave sailing technique, and the best windsurf travel destinations across Europe and beyond.',
    openGraph: {
        title: 'Windsurf Articles, Guides & Resources',
        description: 'Read in-depth articles on wind forecasting, sail and gear selection, wave sailing technique, and the best windsurf travel destinations across Europe and beyond.',
        url: 'https://www.windyspot.com/resources',
        images: [{ url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg', width: 1200, height: 630, alt: 'Windy Spot - Windsurf Resources' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Windsurf Articles, Guides & Resources',
        description: 'Read in-depth articles on wind forecasting, gear selection, wave sailing technique, and the best windsurf destinations.',
        images: ['https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg'],
    },
    alternates: {
        canonical: 'https://www.windyspot.com/resources',
    },
}

interface Props {
    searchParams: Promise<{ page?: string }>
}

export default async function Resources({ searchParams }: Props) {
    const { page } = await searchParams
    const totalPages = Math.ceil(resourcesData.length / RESOURCES_PAGE_SIZE)
    const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages)
    const startIndex = (currentPage - 1) * RESOURCES_PAGE_SIZE
    const paginatedData = resourcesData.slice(startIndex, startIndex + RESOURCES_PAGE_SIZE)

    const pageLink = (p: number) => p === 1 ? '/resources' : `/resources?page=${p}`

    return (
        <>
            <NavbarLight/>

            <section className="pt-5 mt-5">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h1 className="sectionHeading">Articles & <span className="text-primary">Resources</span></h1>
                                <p>Guides, tips and resources for windsurfing, wingfoil and windfoil.</p>
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
