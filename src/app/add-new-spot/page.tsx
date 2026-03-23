'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const Select = dynamic(() => import('react-select'), { ssr: false })
const Editor = dynamic(() => import('react-simple-wysiwyg').then(mod => mod.default), { ssr: false })

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { FaFile } from 'react-icons/fa6'
import { BsGeoAlt, BsWind, BsArrowRightCircle, BsImage } from 'react-icons/bs'

interface Location {
    id: number
    name: string
    country: string | null
}

interface SelectOption {
    value: string
    label: string
}

export default function AddNewSpot() {
    const router = useRouter()
    const [locations, setLocations] = useState<Location[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [spotGuide, setSpotGuide] = useState('')
    const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null)
    const [isNewLocation, setIsNewLocation] = useState(false)
    const [newLocationName, setNewLocationName] = useState('')
    const [newLocationCountry, setNewLocationCountry] = useState('')
    const [windguruForecastId, setWindguruForecastId] = useState('')
    const [windguruLiveStationId, setWindguruLiveStationId] = useState('')
    const [lat, setLat] = useState('')
    const [lon, setLon] = useState('')
    const [geoQuery, setGeoQuery] = useState('')
    const [geoResults, setGeoResults] = useState<{ display_name: string; lat: string; lon: string }[]>([])
    const [geoSearching, setGeoSearching] = useState(false)
    const [spotImage, setSpotImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchLocations() {
            const res = await fetch('/api/locations')
            if (res.ok) {
                const data = await res.json()
                setLocations(data)
            }
        }
        fetchLocations()
    }, [])

    const locationOptions: SelectOption[] = locations.map((loc) => ({
        value: String(loc.id),
        label: loc.country ? `${loc.name}, ${loc.country}` : loc.name,
    }))

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setSpotImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    async function searchLocation() {
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
        setLat(result.lat)
        setLon(result.lon)
        setGeoResults([])
        setGeoQuery(result.display_name)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        let imageUrl: string | null = null
        if (spotImage) {
            const formData = new FormData()
            formData.append('file', spotImage)
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
            if (uploadRes.ok) {
                const { url } = await uploadRes.json()
                imageUrl = url
            }
        }

        const payload: Record<string, unknown> = {
            title,
            description,
            image: imageUrl,
            spot_guide: spotGuide || null,
            windguru_forecast_id: windguruForecastId || null,
            windguru_live_station_id: windguruLiveStationId || null,
            lat: lat ? parseFloat(lat) : null,
            lon: lon ? parseFloat(lon) : null,
        }

        if (isNewLocation) {
            payload.new_location_name = newLocationName
            payload.new_location_country = newLocationCountry || null
        } else {
            payload.location_id = selectedLocation ? Number(selectedLocation.value) : null
        }

        try {
            const res = await fetch('/api/spots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }

            const spot = await res.json()
            router.push(`/spots/${spot.slug}`)
        } catch {
            setError('Something went wrong')
            setSubmitting(false)
        }
    }

    return (
        <>
            <NavbarLight />

            <section className="pb-0">
                <div className="container">
                    <div className="row align-items-center justify-content-center pt-5">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h3 className="sectionHeading">Add a New Spot</h3>
                                <p className="fs-6">Share a windsurf spot with the community.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-md-12">

                            <form onSubmit={handleSubmit}>
                                <div className="card rounded-3 shadow-sm mb-4">
                                    <div className="card-header py-4 px-4">
                                        <h4 className="fs-5 fw-medium mb-0"><FaFile className="text-primary me-2" />Basic Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Spot Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g. Valdevaqueros"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Description</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="Short description of the spot"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Photo</label>
                                                    <input
                                                        ref={imageInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="d-none"
                                                        onChange={handleImageSelect}
                                                    />
                                                    {imagePreview ? (
                                                        <div className="position-relative rounded-3 overflow-hidden mb-2" style={{ height: '200px' }}>
                                                            <Image src={imagePreview} fill className="object-fit-cover rounded-3" alt="Spot preview" sizes="600px" />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-dark rounded-circle position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                                                                style={{ width: 28, height: 28, padding: 0 }}
                                                                onClick={() => { setSpotImage(null); setImagePreview(null); if (imageInputRef.current) imageInputRef.current.value = '' }}
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="border rounded-3 d-flex align-items-center justify-content-center text-muted"
                                                            style={{ height: '120px', cursor: 'pointer', borderStyle: 'dashed' }}
                                                            onClick={() => imageInputRef.current?.click()}
                                                        >
                                                            <div className="text-center">
                                                                <BsImage size={24} className="mb-2" />
                                                                <div style={{ fontSize: '0.9rem' }}>Click to add a photo</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Spot Guide</label>
                                                    <Editor
                                                        value={spotGuide}
                                                        onChange={(e: { target: { value: string } }) => setSpotGuide(e.target.value)}
                                                        style={{ minHeight: '150px' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card rounded-3 shadow-sm mb-4">
                                    <div className="card-header py-4 px-4">
                                        <h4 className="fs-5 fw-medium mb-0"><BsGeoAlt className="text-primary me-2" />Location</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <div className="form-check">
                                                    <input
                                                        id="existingLocation"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="locationType"
                                                        checked={!isNewLocation}
                                                        onChange={() => setIsNewLocation(false)}
                                                    />
                                                    <label htmlFor="existingLocation" className="form-check-label">Choose existing location</label>
                                                </div>
                                                <div className="form-check mt-2">
                                                    <input
                                                        id="newLocation"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="locationType"
                                                        checked={isNewLocation}
                                                        onChange={() => setIsNewLocation(true)}
                                                    />
                                                    <label htmlFor="newLocation" className="form-check-label">Create new location</label>
                                                </div>
                                            </div>

                                            {!isNewLocation ? (
                                                <div className="col-12">
                                                    <div className="form-group form-border">
                                                        <label className="lableTitle">Location</label>
                                                        <div className="selects">
                                                            <Select
                                                                placeholder="Select a location..."
                                                                options={locationOptions}
                                                                className="location form-control"
                                                                value={selectedLocation}
                                                                onChange={(val) => setSelectedLocation(val as SelectOption)}
                                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="col-xl-6 col-lg-6 col-md-12">
                                                        <div className="form-group form-border">
                                                            <label className="lableTitle">Location Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control rounded"
                                                                placeholder="e.g. Cadiz"
                                                                value={newLocationName}
                                                                onChange={(e) => setNewLocationName(e.target.value)}
                                                                required={isNewLocation}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-6 col-lg-6 col-md-12">
                                                        <div className="form-group form-border">
                                                            <label className="lableTitle">Country</label>
                                                            <input
                                                                type="text"
                                                                className="form-control rounded"
                                                                placeholder="e.g. Spain"
                                                                value={newLocationCountry}
                                                                onChange={(e) => setNewLocationCountry(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="card rounded-3 shadow-sm mb-4">
                                    <div className="card-header py-4 px-4">
                                        <h4 className="fs-5 fw-medium mb-0"><BsGeoAlt className="text-primary me-2" />Coordinates</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Search for a place</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control rounded-start"
                                                            placeholder="e.g. Valdevaqueros, Tarifa"
                                                            value={geoQuery}
                                                            onChange={(e) => setGeoQuery(e.target.value)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchLocation() } }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={searchLocation}
                                                            disabled={geoSearching || !geoQuery.trim()}
                                                        >
                                                            {geoSearching ? 'Searching...' : 'Search'}
                                                        </button>
                                                    </div>
                                                </div>
                                                {geoResults.length > 0 && (
                                                    <div className="list-group mt-2">
                                                        {geoResults.map((r, i) => (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                className="list-group-item list-group-item-action"
                                                                style={{ fontSize: '0.9rem' }}
                                                                onClick={() => selectGeoResult(r)}
                                                            >
                                                                <div>{r.display_name}</div>
                                                                <small className="text-muted">{r.lat}, {r.lon}</small>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Latitude</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g. 36.0345"
                                                        value={lat}
                                                        onChange={(e) => setLat(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Longitude</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g. -5.6084"
                                                        value={lon}
                                                        onChange={(e) => setLon(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card rounded-3 shadow-sm mb-4">
                                    <div className="card-header py-4 px-4">
                                        <h4 className="fs-5 fw-medium mb-0"><BsWind className="text-primary me-2" />Windguru Integration</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-6 col-md-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Windguru Forecast ID</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g. 43723"
                                                        value={windguruForecastId}
                                                        onChange={(e) => setWindguruForecastId(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-12">
                                                <div className="form-group form-border">
                                                    <label className="lableTitle">Windguru Live Station ID</label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        placeholder="e.g. 1234"
                                                        value={windguruLiveStationId}
                                                        onChange={(e) => setWindguruLiveStationId(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-pill fw-medium"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Add Spot'}
                                        {!submitting && <BsArrowRightCircle className="ms-2" />}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <BackToTop />
        </>
    )
}
