'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { spots } from '../data/data'

import { BsGeoAlt } from 'react-icons/bs'

interface ListData{
    id: number;
    slug?: string;
    image: string;
    featured: boolean;
    title: string;
    desc: string;
    loction: string;
    tag: string;
}

export default function ExploreListingOne() {
  return (
        <div className="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-1 align-items-center justify-content-center g-4">
            {spots.filter((item:ListData) => item.featured).slice(0,6).map((item:ListData,index:number)=>{
                return(
                    <div className="col" key={index}>
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
  )
}
