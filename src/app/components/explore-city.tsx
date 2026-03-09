import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import type { Location, Spot } from '../lib/spots'

type LocationWithSpots = Location & { spots: Spot[] }

export default function ExploreCity({ locations }: { locations: LocationWithSpots[] }) {
  const featured = locations.filter(item => item.featured)
  return (
    <div className="row align-items-center justify-content-center g-4">
        {featured.map((item, index) => {
            return(
                <div className={item.big ? 'col-xl-6 col-lg-6 col-md-4 col-sm-6' : 'col-xl-3 col-lg-3 col-md-4 col-sm-6'} key={index}>
                    <div className="position-relative overflow-hidden rounded-4" style={{height: '300px'}}>
                        <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%', objectFit:'cover'}} className="img-fluid" alt={item.name}/>
                        <div className="position-absolute top-0 end-0 mt-3 me-3 z-1">
                            <span className="badge badge-xs bg-light text-dark rounded-pill">{item.spots.length} {item.spots.length === 1 ? 'Spot' : 'Spots'}</span>
                        </div>
                        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)', paddingTop: '80px'}}>
                            <h4 className="text-white fw-bold mb-1">{item.name}</h4>
                            <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                                {item.spots.map((spot, i) => (
                                    <Link href={`/spots/${spot.slug}`} className="badge badge-xs badge-transparent rounded-pill text-decoration-none" key={i}>{spot.title}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}

    </div>
  )
}
