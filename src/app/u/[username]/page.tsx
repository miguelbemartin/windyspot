'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

import NavbarLight from '../../components/navbar/navbar-light'
import MapKitMap from '../../components/mapkit-map'
import Footer from '../../components/footer/footer'
import BackToTop from '../../components/back-to-top'

import { FaLocationDot } from 'react-icons/fa6'
import { BsThreeDots } from 'react-icons/bs'
import { FaRegTrashCan } from 'react-icons/fa6'

interface SpotData {
    id: number
    slug: string
    title: string
    image: string
    location_id: number
    lat: number | null
    lon: number | null
    locations: {
        name: string
    }
}

interface UserSpot {
    spot_id: number
    spots: SpotData
}

interface ProfileUser {
    fullName: string | null
    imageUrl: string
    username: string
}

export default function UserProfile() {
  const params = useParams()
  const username = params.username as string
  const { user: currentUser } = useUser()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [userSpots, setUserSpots] = useState<UserSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const isOwner = currentUser?.username === username || currentUser?.id === username

  useEffect(() => {
      async function fetchProfile() {
          const res = await fetch(`/api/users/${username}/spots`)
          if (res.ok) {
              const data = await res.json()
              setProfileUser(data.user)
              setUserSpots(data.spots)
          }
          setLoading(false)
      }
      fetchProfile()
  }, [username])

  async function removeSpot(spotId: number) {
      if (!isOwner) return
      const res = await fetch(`/api/users/${username}/spots`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spot_id: spotId }),
      })
      if (res.ok) {
          setUserSpots((prev) => prev.filter((s) => s.spot_id !== spotId))
      }
      setOpenMenuId(null)
  }

  useEffect(() => {
      if (openMenuId === null) return
      function handleClick() { setOpenMenuId(null) }
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
  }, [openMenuId])

  if (loading) {
      return (
          <>
              <NavbarLight />
              <section className="bg-light py-5">
                  <div className="container text-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                  </div>
              </section>
              <Footer />
          </>
      )
  }

  if (!profileUser) {
      return (
          <>
              <NavbarLight />
              <section className="bg-light py-5">
                  <div className="container text-center py-5">
                      <h3>User not found</h3>
                  </div>
              </section>
              <Footer />
          </>
      )
  }

  return (
    <>
    <NavbarLight/>

    <section className="bg-light py-5">
        <div className="ro">
            <div className="w-100">
                <MapKitMap spots={userSpots
                    .filter((s) => s.spots.lat != null && s.spots.lon != null)
                    .map((s) => ({ title: s.spots.title, lat: s.spots.lat!, lon: s.spots.lon! }))}
                />
            </div>
        </div>
        <div className="container">
            <div className="row g-4 mt-3">
                <div className="col-xl-4 col-lg-4 col-md-12">
                    <div className="sidebarGroups d-flex flex-column gap-4">

                        <div className="card">
                            <div className="card-body p-0">
                                <div className="avatarBox my-4">
                                    <div className="square--100 circle mx-auto mb-2">
                                        {profileUser.imageUrl && <Image src={profileUser.imageUrl} width={100} height={100} className="img-fluid circle" alt="Avatar"/>}
                                    </div>
                                    <div className="listingInfo text-center">
                                        <h6 className="mb-0">{profileUser.fullName || profileUser.username}</h6>
                                    </div>
                                    <div className="followButtons d-block mt-4">
                                        <div className="d-flex align-items-center justify-content-center gap-3 px-4">
                                            <div className="authPlaces text-center flex-fill">
                                                <h5 className="mb-0 ctr">{userSpots.length}</h5>
                                                <p className="text-muted m-0">Sailed spots</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="col-xl-8 col-lg-8 col-md-12 pt-lg-0 pt-5">
                    <div className="authorBoxesGroups d-flex align-items-start flex-column gap-4 w-100">

                        <div className="singleauthorBox d-block w-100">

                            <div className="mb-4">
                                <h6 className="fw-medium mb-0">Sailed in {userSpots.length} spots</h6>
                            </div>

                            <div className="row align-items-center justify-content-center g-2">
                                {userSpots.map((item)=>{
                                    const spot = item.spots
                                    return(
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12" key={spot.id} style={{ position: 'relative', zIndex: openMenuId === spot.id ? 10 : 'auto' }}>
                                            <div className="listingCard listLayouts card rounded-3 border-0" style={{ overflow: 'visible' }}>
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
                                                                {isOwner && (
                                                                    <div className="position-relative">
                                                                        <button
                                                                            className="btn btn-sm border rounded-3 d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px', padding: 0, backgroundColor: '#f8f9fa' }}
                                                                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === spot.id ? null : spot.id) }}
                                                                        >
                                                                            <BsThreeDots size={16} className="text-muted" />
                                                                        </button>
                                                                        {openMenuId === spot.id && (
                                                                            <div
                                                                                className="position-absolute end-0 bg-white rounded-4 py-2"
                                                                                style={{ minWidth: '180px', marginTop: '4px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <button
                                                                                    className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent text-danger px-3 py-2"
                                                                                    style={{ fontSize: '14px' }}
                                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                                    onClick={() => removeSpot(spot.id)}
                                                                                >
                                                                                    <FaRegTrashCan size={14} />
                                                                                    Remove spot
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
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
