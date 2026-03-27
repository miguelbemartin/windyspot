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
    const url = `https://www.windyspot.com/resources/${resource.slug}`
    return {
        title: resource.title,
        description: resource.desc,
        openGraph: {
            title: resource.title,
            description: resource.desc,
            url,
            type: 'article',
            publishedTime: resource.date,
            authors: ['Windy Spot'],
            images: [{ url: resource.image, width: 1200, height: 630, alt: resource.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: resource.title,
            description: resource.desc,
            images: [resource.image],
        },
        alternates: {
            canonical: url,
        },
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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: resource.title,
        description: resource.desc,
        image: resource.image,
        datePublished: resource.date,
        author: {
            '@type': 'Organization',
            name: 'Windy Spot',
            url: 'https://www.windyspot.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Windy Spot',
            url: 'https://www.windyspot.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.windyspot.com/resources/${resource.slug}`,
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <NavbarLight/>

            <section className="position-relative" style={{ height: '320px' }}>
                <Image
                    src={resource.image}
                    fill
                    className="object-fit-cover"
                    alt={resource.title}
                    sizes="100vw"
                    priority
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.6))' }} />
                <div className="container position-relative h-100">
                    <div className="row align-items-end h-100">
                        <div className="col-xl-8 col-lg-10 col-md-12 col-12 pb-4">
                            <span className="badge bg-primary rounded-pill mb-2">{resource.tag}</span>
                            <h1 className="text-white fw-bold mb-0">{resource.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="gray-simple pt-4 pt-xl-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-md-12">

                            <article className="card shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4 p-md-5">
                                    <p className="lead mb-4">{resource.desc}</p>
                                    {resource.content.map((paragraph, i) => (
                                        <p key={i} className={i === resource.content.length - 1 ? 'mb-0' : 'mb-3'}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </article>

                            {relatedArticles.length > 0 && (
                                <div className="mt-4 mb-4">
                                    <h2 className="fw-semibold fs-5 mb-3">Related Articles</h2>
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
