'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const Select = dynamic(() => import('react-select'), { ssr: false })
const Editor = dynamic(() => import('react-simple-wysiwyg').then(mod => mod.default), { ssr: false })

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import BackToTop from '../components/back-to-top'

import { FaFile } from 'react-icons/fa6'
import { BsGeoAlt, BsWind, BsArrowRightCircle } from 'react-icons/bs'

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
    const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null)
    const [isNewLocation, setIsNewLocation] = useState(false)
    const [newLocationName, setNewLocationName] = useState('')
    const [newLocationCountry, setNewLocationCountry] = useState('')
    const [windguruForecastId, setWindguruForecastId] = useState('')
    const [windguruLiveStationId, setWindguruLiveStationId] = useState('')
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        const payload: Record<string, unknown> = {
            title,
            description,
            windguru_forecast_id: windguruForecastId || null,
            windguru_live_station_id: windguruLiveStationId || null,
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

            <section className="bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10 col-md-12">

                            <div className="mb-4">
                                <h1 className="fw-semibold">Add a New Spot</h1>
                                <p className="text-muted">Share a windsurf spot with the community.</p>
                            </div>

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
                                                    <Editor
                                                        value={description}
                                                        onChange={(e: { target: { value: string } }) => setDescription(e.target.value)}
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
