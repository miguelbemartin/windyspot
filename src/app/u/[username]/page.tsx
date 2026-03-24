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

const DEFAULT_SPOT_IMAGE = 'https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/akira-hojo-ZxGdri2EWzk-unsplash.jpg'
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

interface UserLocation {
    text?: string
    lat?: number
    lon?: number
}

interface ProfileUser {
    id: string
    fullName: string | null
    imageUrl: string
    username: string
    location: UserLocation | null
}

export default function UserProfile() {
  const params = useParams()
  const username = params.username as string
  const { user: currentUser } = useUser()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [userSpots, setUserSpots] = useState<UserSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [followLoading, setFollowLoading] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationText, setLocationText] = useState('')
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLon, setLocationLon] = useState<number | null>(null)
  const [geoQuery, setGeoQuery] = useState('')
  const [geoResults, setGeoResults] = useState<{ display_name: string; lat: string; lon: string }[]>([])
  const [geoSearching, setGeoSearching] = useState(false)
  const [locationSaving, setLocationSaving] = useState(false)
  const [nearbySpots, setNearbySpots] = useState<{ id: number; slug: string; title: string; image: string; distance_km: number; location_name: string }[]>([])
  const [nearbyLoading, setNearbyLoading] = useState(false)

  const isOwner = currentUser?.username === username || currentUser?.id === username

  useEffect(() => {
      async function fetchProfile() {
          const res = await fetch(`/api/users/${username}/spots`)
          if (res.ok) {
              const data = await res.json()
              setProfileUser(data.user)
              setUserSpots(data.spots)

              if (data.user?.id) {
                  const followRes = await fetch(`/api/follows?user_id=${data.user.id}`)
                  if (followRes.ok) {
                      const followData = await followRes.json()
                      setIsFollowing(followData.is_following)
                      setFollowersCount(followData.followers_count)
                      setFollowingCount(followData.following_count)
                  }
              }
          }
          setLoading(false)
      }
      fetchProfile()
  }, [username])

  useEffect(() => {
      if (!profileUser?.location?.lat || !profileUser?.location?.lon) return
      setNearbyLoading(true)
      fetch(`/api/spots/nearby?lat=${profileUser.location.lat}&lon=${profileUser.location.lon}&limit=5`)
          .then(r => r.ok ? r.json() : [])
          .then(setNearbySpots)
          .catch(() => {})
          .finally(() => setNearbyLoading(false))
  }, [profileUser?.location?.lat, profileUser?.location?.lon])

  async function toggleFollow() {
      if (!profileUser || isOwner || followLoading) return
      setFollowLoading(true)
      const res = await fetch('/api/follows', {
          method: isFollowing ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ following_id: profileUser.id }),
      })
      if (res.ok || res.status === 409) {
          setIsFollowing(!isFollowing)
          setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)
      }
      setFollowLoading(false)
  }

  function openLocationEditor() {
      const loc = profileUser?.location
      setLocationText(loc?.text || '')
      setLocationLat(loc?.lat ?? null)
      setLocationLon(loc?.lon ?? null)
      setGeoQuery(loc?.text || '')
      setGeoResults([])
      setEditingLocation(true)
  }

  async function searchGeo() {
      const q = geoQuery.trim()
      if (!q) return
      setGeoSearching(true)
      setGeoResults([])
      try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`, {
              headers: { 'User-Agent': 'WindySpot/1.0' },
          })
          if (res.ok) {
              const data = await res.json()
              setGeoResults(data)
          }
      } catch { /* ignore */ }
      setGeoSearching(false)
  }

  function selectGeoResult(result: { display_name: string; lat: string; lon: string }) {
      setLocationText(result.display_name)
      setLocationLat(parseFloat(result.lat))
      setLocationLon(parseFloat(result.lon))
      setGeoQuery(result.display_name)
      setGeoResults([])
  }

  async function saveLocation() {
      if (!currentUser) return
      setLocationSaving(true)
      try {
          await currentUser.update({
              unsafeMetadata: {
                  ...currentUser.unsafeMetadata,
                  location: {
                      text: locationText || undefined,
                      lat: locationLat ?? undefined,
                      lon: locationLon ?? undefined,
                  },
              },
          })
          setProfileUser(prev => prev ? {
              ...prev,
              location: {
                  text: locationText || undefined,
                  lat: locationLat ?? undefined,
                  lon: locationLon ?? undefined,
              },
          } : prev)
          setEditingLocation(false)
      } catch {
          // silently fail
      }
      setLocationSaving(false)
  }

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
                    .map((s) => ({ title: s.spots.title, slug: s.spots.slug, lat: s.spots.lat!, lon: s.spots.lon! }))}
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
                                        {editingLocation ? (
                                            <div className="mt-2 px-3">
                                                <div className="input-group input-group-sm mb-1">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search for a place..."
                                                        value={geoQuery}
                                                        onChange={(e) => setGeoQuery(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchGeo() } }}
                                                    />
                                                    <button className="btn btn-outline-secondary" type="button" onClick={searchGeo} disabled={geoSearching || !geoQuery.trim()}>
                                                        {geoSearching ? '...' : 'Search'}
                                                    </button>
                                                </div>
                                                {geoResults.length > 0 && (
                                                    <div className="list-group mb-1" style={{ maxHeight: '160px', overflowY: 'auto', fontSize: '12px' }}>
                                                        {geoResults.map((r, i) => (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                className="list-group-item list-group-item-action py-1 px-2"
                                                                onClick={() => selectGeoResult(r)}
                                                            >
                                                                {r.display_name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {locationText && (
                                                    <p className="text-muted mb-1" style={{ fontSize: '11px' }}>
                                                        <FaLocationDot className="me-1" />{locationText}
                                                    </p>
                                                )}
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <button className="btn btn-sm btn-primary" onClick={saveLocation} disabled={locationSaving || !locationText}>
                                                        {locationSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingLocation(false)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            profileUser.location?.text ? (
                                                <p className="text-muted m-0 mt-1" style={{ fontSize: '13px' }}>
                                                    <FaLocationDot className="me-1" />
                                                    {profileUser.location.text}
                                                    {isOwner && (
                                                        <button className="btn btn-link btn-sm p-0 ms-1 text-muted" style={{ fontSize: '11px' }} onClick={openLocationEditor}>Edit</button>
                                                    )}
                                                </p>
                                            ) : isOwner ? (
                                                <button className="btn btn-link btn-sm text-muted p-0 mt-1" style={{ fontSize: '12px' }} onClick={openLocationEditor}>
                                                    <FaLocationDot className="me-1" />Add your location
                                                </button>
                                            ) : null
                                        )}
                                    </div>
                                    <div className="followButtons d-block mt-4">
                                        <div className="d-flex align-items-center justify-content-center gap-3 px-4">
                                            <div className="authPlaces text-center flex-fill">
                                                <h5 className="mb-0 ctr">{followersCount}</h5>
                                                <p className="text-muted m-0">Followers</p>
                                            </div>
                                            <div className="authPlaces text-center flex-fill">
                                                <h5 className="mb-0 ctr">{followingCount}</h5>
                                                <p className="text-muted m-0">Following</p>
                                            </div>
                                            <div className="authPlaces text-center flex-fill">
                                                <h5 className="mb-0 ctr">{userSpots.length}</h5>
                                                <p className="text-muted m-0">Spots</p>
                                            </div>
                                        </div>
                                        {!isOwner && currentUser && (
                                            <div className="d-flex justify-content-center mt-3 px-4">
                                                <button
                                                    className={`btn btn-sm rounded-pill px-4 ${isFollowing ? 'btn-outline-secondary' : 'btn-primary'}`}
                                                    onClick={toggleFollow}
                                                    disabled={followLoading}
                                                >
                                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {profileUser.location?.lat && nearbySpots.length > 0 && (
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="fw-medium mb-3">Nearby Spots</h6>
                                    {nearbyLoading ? (
                                        <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary" role="status" /></div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2">
                                            {nearbySpots.map((spot) => (
                                                <Link
                                                    key={spot.id}
                                                    href={`/spots/${spot.slug}`}
                                                    className="d-flex align-items-center gap-2 text-decoration-none"
                                                    style={{ color: '#333' }}
                                                >
                                                    {spot.image && (
                                                        <Image
                                                            src={spot.image || DEFAULT_SPOT_IMAGE}
                                                            width={50}
                                                            height={35}
                                                            className="rounded-2 object-fit-cover"
                                                            alt={spot.title}
                                                            style={{ width: '50px', height: '35px' }}
                                                        />
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{spot.title}</div>
                                                        <div style={{ fontSize: '11px', color: '#777' }}>
                                                            <FaLocationDot className="me-1" />{spot.location_name} &middot; {Math.round(spot.distance_km)} km
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
                                                            <Link href={`/spots/${spot.slug}`} className="d-block h-100"><Image src={spot.image || DEFAULT_SPOT_IMAGE} width={0} height={0} sizes='100vw' style={{width:'100%', height:'100%'}} className="img-fluid object-fit-cover rounded-3" alt="Listing Img"/></Link>
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
