import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import NavbarLight from '../../components/navbar/navbar-light'
import Footer from '../../components/footer/footer'
import BackToTop from '../../components/back-to-top'

import { getLocationBySlug, getSpotsByLocationId } from '../../lib/spots'
import { DEFAULT_SPOT_IMAGE } from '../../lib/constants'

import { BsGeoAlt } from 'react-icons/bs'
import { FaLocationDot } from 'react-icons/fa6'


interface PageProps {
    params: Promise<{ slug: string }>
}

async function getLocation(slug: string) {
    return getLocationBySlug(slug)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const location = await getLocation(slug)
    if (!location) return {}

    const displayName = `${location.name}${location.country ? `, ${location.country}` : ''}`
    const title = `${displayName} - Windsurf Spots & Guide`
    const description = location.description
        ? location.description.slice(0, 160)
        : `Explore windsurf spots in ${displayName}. Find forecasts, live wind stations, and spot guides.`
    const url = `https://www.windyspot.com/locations/${location.slug}`

    return {
        title,
        description,
        keywords: ['windsurf', location.name, location.country, 'windsurf spots', 'wind forecast', 'spot guide', 'windsurfing'].filter(Boolean) as string[],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            siteName: 'Windy Spot',
            locale: 'en_US',
            ...(location.image && { images: [{ url: location.image, width: 1200, height: 630, alt: `${displayName} - Windsurf Spots` }] }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(location.image && { images: [location.image] }),
        },
        alternates: {
            canonical: url,
        },
    }
}

export default async function LocationPage({ params }: PageProps) {
    const { slug } = await params
    const location = await getLocation(slug)
    if (!location) notFound()

    const spots = await getSpotsByLocationId(location.id)

    const displayName = `${location.name}${location.country ? `, ${location.country}` : ''}`

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: displayName,
        description: location.description || `Windsurf spots in ${displayName}.`,
        ...(location.image && { image: location.image }),
        url: `https://www.windyspot.com/locations/${location.slug}`,
        ...(location.country && {
            containedInPlace: {
                '@type': 'Country',
                name: location.country,
            },
        }),
        isPartOf: {
            '@type': 'WebSite',
            name: 'Windy Spot',
            url: 'https://www.windyspot.com',
        },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <NavbarLight />

            <section className="position-relative ht-200 py-0" style={{ backgroundColor: '#1a2332' }} data-overlay="4">
                <Image src={location.image || DEFAULT_SPOT_IMAGE} alt={location.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="container h-100">
                    <div className="row align-items-start">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                            <div className="mainlistingInfo">
                                <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                                    <div className="firstColumn">
                                        <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                            <div className="listingCaptioninfo">
                                                <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                                                    <h1 className="fw-semibold text-light mb-0 fs-2">{location.name}</h1>
                                                </div>
                                                {location.country && (
                                                    <div className="listingsbasicInfo">
                                                        <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                                            <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2" />{location.country}</span></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-light py-5">
                <div className="container">
                    {location.description && (
                        <div className="mb-4">
                            <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line' }}>{location.description}</p>
                        </div>
                    )}

                    <div className="row align-items-center justify-content-between mb-4">
                        <div className="col">
                            <h6 className="fw-medium text-md mb-0">{spots.length} spots in {location.name}</h6>
                        </div>
                    </div>

                    <div className="row align-items-center justify-content-center g-xl-4 g-3">
                        {spots.map((spot) => (
                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={spot.id}>
                                <Link href={`/spots/${spot.slug}`} className="text-decoration-none">
                                    <div className="position-relative overflow-hidden rounded-4 explore-listing-card">
                                        <Image src={spot.image || DEFAULT_SPOT_IMAGE} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%', objectFit:'cover'}} className="img-fluid" alt={spot.title}/>
                                        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)', paddingTop: '80px'}}>
                                            <h5 className="text-white fw-bold mb-1">{spot.title}</h5>
                                            <p className="mb-1 small" style={{color: 'rgba(255,255,255,0.85)'}}>{spot.description}</p>
                                            <div className="d-flex align-items-center small" style={{color: 'rgba(255,255,255,0.8)'}}>
                                                <BsGeoAlt className="me-1"/>{location.name}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {spots.length === 0 && (
                        <div className="text-center py-5">
                            <p className="text-muted">No spots added in this location yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
            <BackToTop />
        </>
    )
}
