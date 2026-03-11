'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useSupabase } from '../lib/supabase'

import NavMinimal from '../components/navbar/nav-minimal'
import MapKitMap from '../components/mapkit-map'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { FaLocationDot } from 'react-icons/fa6'
import { BsPersonCheck } from 'react-icons/bs'

interface UserSpot {
    spot_id: number
    spots: {
        id: number
        slug: string
        title: string
        image: string
        location_id: number
        locations: {
            name: string
        }
    }
}

export default function AuthorProfile() {
  const { isSignedIn, user } = useUser()
  const supabase = useSupabase()
  const [userSpots, setUserSpots] = useState<UserSpot[]>([])

  useEffect(() => {
      if (!isSignedIn || !user) return

      async function fetchUserSpots() {
          const { data } = await supabase
              .from('user_spots')
              .select('spot_id, spots(id, slug, title, image, location_id, locations(name))')
              .eq('user_id', user!.id)

          if (data) setUserSpots(data as unknown as UserSpot[])
      }

      fetchUserSpots()
  }, [isSignedIn, user, supabase])

  return (
    <>
    <NavMinimal/>

    <section className="bg-light py-5">
        <div className="container">
            <div className="row g-4">

            <div className="col-xl-4 col-lg-4 col-md-12">
                    <div className="sidebarGroups d-flex flex-column gap-4">

                        <div className="card">
                            <div className="card-body p-0">
                                <div className="avatarBox my-4">
                                    <div className="square--100 circle mx-auto mb-2">{user?.imageUrl && <Image src={user.imageUrl} width={100} height={100} className="img-fluid circle" alt="Avatar"/>}</div>
                                    <div className="listingInfo text-center">
                                        <h6 className="mb-0">{user?.fullName || ''}</h6>
                                        {/* <div className="mt-3">
                                            <Link href="#" className="btn btn-sm btn-primary fw-medium rounded-pill"><BsPersonCheck className="me-2"/>Follow</Link>
                                        </div> */}
                                    </div>
                                    <div className="followButtons d-block mt-4">
                                        <div className="d-flex align-items-center justify-content-center gap-3 px-4">
                                            <div className="authPlaces text-center flex-fill">
                                                <h5 className="mb-0 ctr">{userSpots.length}</h5>
                                                <p className="text-muted m-0">Sailed spots</p>
                                            </div>
                                            {/* <div className="authFollowers text-center flex-fill">
                                                <h5 className="mb-0 ctr">435</h5>
                                                <p className="text-muted m-0">Followers</p>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="avatarInfo mb-2">
                                    <div className="py-3 px-3 border-top">
                                        <p className="text-muted lh-base mb-0">Passionate windsurfer chasing wind across Europe. From lake thermals to ocean storms, always looking for the next session.</p>
                                    </div>
                                    <div className="py-3 px-3 border-top d-flex align-items-center justify-content-between">
                                        <p className="text-muted lh-base mb-0">Sailing since</p>
                                        <p className="text-dark lh-base fw-semibold fs-6 mb-0">2012</p>
                                    </div>
                                    <div className="py-3 px-3 border-top d-flex align-items-center justify-content-between">
                                        <p className="text-muted lh-base mb-0">Sponsored by</p>
                                        <p className="text-dark lh-base fw-semibold fs-6 mb-0">Severne</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>


                    </div>
                </div>

                <div className="col-xl-8 col-lg-8 col-md-12 pt-lg-0 pt-5">
                    <div className="authorBoxesGroups d-flex align-items-start flex-column gap-4 w-100">

                        {/* <div className="w-100">
                            <MapKitMap spots={[
                                { title: 'Pozo Izquierdo', lat: 27.840, lon: -15.382 },
                                { title: 'Tarifa', lat: 36.014, lon: -5.604 },
                                { title: 'Flüelen', lat: 46.928, lon: 8.604 },
                                { title: 'Hookipa', lat: 20.934, lon: -156.356 },
                            ]} />
                        </div> */}

                        <div className="singleauthorBox d-block w-100">

                            <div className="mb-4">
                                <h6 className="fw-medium mb-0">Sailed in {userSpots.length} spots</h6>
                            </div>

                            <div className="row align-items-center justify-content-center g-2">
                                {userSpots.map((item)=>{
                                    const spot = item.spots
                                    return(
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12" key={spot.id}>
                                            <div className="listingCard listLayouts card rounded-3 border-0">
                                                <div className="row align-items-center justify-content-start g-3">

                                                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12">
                                                        <div className="listThumb overflow-hidden position-relative" style={{height:'80px'}}>
                                                            <Link href={`/spots/${spot.slug}`} className="d-block h-100"><Image src={spot.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid object-fit-cover rounded-3" alt="Listing Img"/></Link>
                                                        </div>
                                                    </div>

                                                    <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12">
                                                        <div className="listCaption px-2 py-2">
                                                            <div className="d-flex align-items-start justify-content-between gap-2">
                                                                <div className="flex-first">
                                                                    <h6 className="listItemtitle mb-1 fs-6"><Link href={`/spots/${spot.slug}`}>{spot.title}</Link></h6>
                                                                    <div className="d-flex align-items-center justify-content-start flex-wrap gap-3">
                                                                        <div className="flex-start"><div className="list-location text-muted text-sm"><span><FaLocationDot className="me-1"/>{spot.locations?.name}</span></div></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                    )
                                })}

                            </div>


                        </div>

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
