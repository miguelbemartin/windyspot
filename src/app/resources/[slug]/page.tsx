import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import NavbarLight from '../../components/navbar/navbar-light'
import Footer from '../../components/footer/footer'
import BackToTop from '../../components/back-to-top'

import { resourcesData } from '../../data/data'

import { BsArrowLeft } from 'react-icons/bs'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return resourcesData.map((resource) => ({
        slug: resource.slug,
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const resource = resourcesData.find((r) => r.slug === slug)
    if (!resource) return { title: 'Resource Not Found' }
    return {
        title: `${resource.title} - Windy Spots`,
        description: resource.desc,
    }
}

export default async function ResourceDetail({ params }: Props) {
    const { slug } = await params
    const resource = resourcesData.find((r) => r.slug === slug)

    if (!resource) {
        notFound()
    }

    const sameTag = resourcesData.filter((r) => r.slug !== slug && r.tag === resource.tag)
    const others = resourcesData.filter((r) => r.slug !== slug && r.tag !== resource.tag)
    const relatedArticles = [...sameTag, ...others].slice(0, 3)

    return (
        <>
            <NavbarLight/>

            <section className="bg-cover position-relative ht-200 py-0" style={{backgroundImage:`url('${resource.image}')`}} data-overlay="5">
                <div className="container h-100">
                    <div className="row align-items-end h-100">
                        <div className="col-xl-8 col-lg-10 col-md-12 col-12 pb-4">
                            <h1 className="text-white fw-bold mb-2">{resource.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gray-simple pt-4 pt-xl-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-md-12">

                            <div className="card shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4 p-md-5">
                                    <p className="lead mb-4">{resource.desc}</p>
                                    <p className="text-muted">Full article content coming soon. Stay tuned for an in-depth guide on this topic.</p>
                                </div>
                            </div>

                            <div className="d-inline-flex mb-4">
                                <span className="badge badge-xs bg-primary rounded-pill">{resource.tag}</span>
                            </div>

                            {relatedArticles.length > 0 && (
                                <div className="mt-4 mb-4">
                                    <h5 className="fw-semibold mb-3">Related Articles</h5>
                                    <div className="row g-3">
                                        {relatedArticles.map((item) => (
                                            <div className="col-md-4" key={item.id}>
                                                <Link href={`/resources/${item.slug}`} className="text-decoration-none">
                                                    <div className="card rounded-4 shadow-sm h-100">
                                                        <div className="overflow-hidden rounded-top" style={{height: '140px'}}>
                                                            <Image src={item.image} width={0} height={0} sizes="100vw" style={{width:'100%', height:'100%', objectFit:'cover'}} alt={item.title}/>
                                                        </div>
                                                        <div className="card-body p-3">
                                                            <span className="badge badge-xs badge-primary rounded-pill mb-2">{item.tag}</span>
                                                            <h6 className="fw-semibold fs-6 lh-base mb-0">{item.title}</h6>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-5">
                                <Link href="/resources" className="btn btn-outline-primary rounded-pill">
                                    <BsArrowLeft className="me-2"/>Back to Resources
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Footer/>
            <BackToTop/>
        </>
    )
}
