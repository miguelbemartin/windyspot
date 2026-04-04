'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsPlus, BsPencilSquare, BsUpload, BsXCircle } from 'react-icons/bs'

import NavbarLight from '../components/navbar/navbar-light'
import Footer from '../components/footer/footer'
import { useIsAdmin } from '../lib/use-is-admin'
import { DEFAULT_SPOT_IMAGE } from '../lib/constants'

interface Location {
    id: number
    name: string
    slug: string
    image: string
    country: string | null
    description: string | null
    featured: boolean
}

interface Spot {
    id: number
    slug: string
    title: string
    image: string
    featured: boolean
    location_id: number
    tag: string
    windguru_forecast_id: string | null
    windguru_live_station_id: string | null
    custom_page: boolean
    lat: number | null
    lon: number | null
    location: Location
}

type Tab = 'locations' | 'spots'

async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
    const formData = new FormData()
    formData.append('file', file)
    try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) {
            try {
                const data = await res.json()
                return { error: data.error || 'Image upload failed' }
            } catch {
                return { error: `Image upload failed (${res.status})` }
            }
        }
        const { url } = await res.json()
        return { url }
    } catch {
        return { error: 'Image upload failed' }
    }
}

function ImageUploadField({ currentImage, imageFile, imagePreview, fileInputRef, onFileChange, onClear }: {
    currentImage?: string
    imageFile: File | null
    imagePreview: string | null
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
}) {
    return (
        <>
            <div className="d-flex align-items-center gap-3 mb-2">
                {(imagePreview || currentImage) && (
                    <Image
                        src={imagePreview || currentImage || DEFAULT_SPOT_IMAGE}
                        alt="Preview"
                        width={80}
                        height={54}
                        style={{ objectFit: 'cover', borderRadius: '6px' }}
                    />
                )}
                {imageFile && (
                    <button type="button" className="btn btn-sm btn-outline-danger rounded-pill" onClick={onClear}>
                        <BsXCircle className="me-1" /> Remove
                    </button>
                )}
            </div>
            <label className="btn btn-sm btn-outline-secondary rounded-pill fw-medium mb-0" style={{ cursor: 'pointer' }}>
                <BsUpload className="me-1" /> {imageFile ? 'Change' : 'Upload'}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="d-none"
                    onChange={onFileChange}
                />
            </label>
        </>
    )
}

export default function AdminPage() {
    const isAdmin = useIsAdmin()
    const [tab, setTab] = useState<Tab>('locations')
    const [locations, setLocations] = useState<Location[]>([])
    const [spots, setSpots] = useState<Spot[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const [locRes, spotRes] = await Promise.all([
                fetch('/api/locations'),
                fetch('/api/spots'),
            ])
            if (locRes.ok) setLocations(await locRes.json())
            if (spotRes.ok) setSpots(await spotRes.json())
            setLoading(false)
        }
        fetchData()
    }, [])

    if (isAdmin === false) {
        return (
            <>
                <NavbarLight />
                <section className="py-5">
                    <div className="container text-center py-5">
                        <h3>Access Denied</h3>
                        <p className="text-muted">You need admin permissions to view this page.</p>
                    </div>
                </section>
                <Footer />
            </>
        )
    }

    return (
        <>
            <NavbarLight />

            <section className="bg-light py-5 mt-5" style={{ minHeight: '80vh' }}>
                <div className="container">
                    <h3 className="fw-semibold mb-4">Admin</h3>

                    <ul className="nav nav-tabs mb-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${tab === 'locations' ? 'active' : ''}`}
                                onClick={() => setTab('locations')}
                            >
                                Locations ({locations.length})
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${tab === 'spots' ? 'active' : ''}`}
                                onClick={() => setTab('spots')}
                            >
                                Spots ({spots.length})
                            </button>
                        </li>
                    </ul>

                    {loading ? (
                        <p className="text-muted">Loading...</p>
                    ) : tab === 'locations' ? (
                        <LocationsTab locations={locations} setLocations={setLocations} />
                    ) : (
                        <SpotsTab spots={spots} setSpots={setSpots} locations={locations} />
                    )}
                </div>
            </section>

            <Footer />
        </>
    )
}

// ─── Locations Tab ───────────────────────────────────────────────────────────

function LocationsTab({ locations, setLocations }: { locations: Location[]; setLocations: (l: Location[]) => void }) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                {!showForm && !editingId && (
                    <button className="btn btn-primary btn-sm rounded-pill fw-medium" onClick={() => setShowForm(true)}>
                        <BsPlus size={18} className="me-1" /> Add Location
                    </button>
                )}
            </div>

            {showForm && (
                <AddLocationForm
                    onCreated={(loc) => {
                        setLocations([...locations, loc].sort((a, b) => a.name.localeCompare(b.name)))
                        setShowForm(false)
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingId && (
                <EditLocationForm
                    location={locations.find((l) => l.id === editingId)!}
                    onSaved={(updated) => {
                        setLocations(locations.map((l) => (l.id === updated.id ? updated : l)))
                        setEditingId(null)
                    }}
                    onCancel={() => setEditingId(null)}
                />
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle bg-white rounded shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: 60 }}></th>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Slug</th>
                            <th className="text-center">Featured</th>
                            <th style={{ width: 50 }}>ID</th>
                            <th style={{ width: 50 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((loc) => (
                            <tr key={loc.id}>
                                <td>
                                    <Image src={loc.image || DEFAULT_SPOT_IMAGE} alt={loc.name} width={48} height={32} style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>
                                    <Link href={`/locations/${loc.slug}`} className="fw-medium text-decoration-none">{loc.name}</Link>
                                </td>
                                <td className="text-muted">{loc.country || '—'}</td>
                                <td><code className="text-muted small">{loc.slug}</code></td>
                                <td className="text-center">{loc.featured ? 'Yes' : '—'}</td>
                                <td className="text-muted small">{loc.id}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-link text-muted p-0"
                                        title="Edit"
                                        onClick={() => { setEditingId(loc.id); setShowForm(false) }}
                                    >
                                        <BsPencilSquare />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

function AddLocationForm({ onCreated, onCancel }: { onCreated: (loc: Location) => void; onCancel: () => void }) {
    const [name, setName] = useState('')
    const [country, setCountry] = useState('')
    const [description, setDescription] = useState('')
    const [featured, setFeatured] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function clearFile() {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            let imageUrl = ''
            if (imageFile) {
                const result = await uploadImage(imageFile)
                if (result.error) { setError(result.error); setSubmitting(false); return }
                imageUrl = result.url!
            }

            const res = await fetch('/api/locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, country: country || null, description: description || null, image: imageUrl, featured }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }

            onCreated(await res.json())
        } catch {
            setError('Something went wrong')
        }
        setSubmitting(false)
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header py-3 px-4"><h5 className="fw-medium mb-0">New Location</h5></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Name</label>
                                <input type="text" className="form-control rounded" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Country</label>
                                <input type="text" className="form-control rounded" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-border mb-3">
                        <label className="form-label fw-medium">Description</label>
                        <textarea className="form-control rounded" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group form-border mb-3">
                        <label className="form-label fw-medium">Image</label>
                        <ImageUploadField
                            imageFile={imageFile}
                            imagePreview={imagePreview}
                            fileInputRef={fileInputRef}
                            onFileChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }}
                            onClear={clearFile}
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input id="addLocationFeatured" className="form-check-input" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                        <label htmlFor="addLocationFeatured" className="form-check-label">Featured</label>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill fw-medium" onClick={onCancel} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary rounded-pill fw-medium" disabled={submitting}>{submitting ? 'Creating...' : 'Create Location'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EditLocationForm({ location, onSaved, onCancel }: { location: Location; onSaved: (loc: Location) => void; onCancel: () => void }) {
    const [name, setName] = useState(location.name)
    const [country, setCountry] = useState(location.country || '')
    const [description, setDescription] = useState(location.description || '')
    const [featured, setFeatured] = useState(location.featured)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function clearFile() {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            let imageUrl: string | undefined
            if (imageFile) {
                const result = await uploadImage(imageFile)
                if (result.error) { setError(result.error); setSubmitting(false); return }
                imageUrl = result.url!
            }

            const payload: Record<string, unknown> = {
                id: location.id,
                name,
                country: country || null,
                description: description || null,
                featured,
            }
            if (imageUrl) payload.image = imageUrl

            const res = await fetch('/api/locations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }

            onSaved(await res.json())
        } catch {
            setError('Something went wrong')
        }
        setSubmitting(false)
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header py-3 px-4"><h5 className="fw-medium mb-0">Edit Location — {location.name}</h5></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Name</label>
                                <input type="text" className="form-control rounded" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Country</label>
                                <input type="text" className="form-control rounded" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-border mb-3">
                        <label className="form-label fw-medium">Description</label>
                        <textarea className="form-control rounded" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group form-border mb-3">
                        <label className="form-label fw-medium">Image</label>
                        <ImageUploadField
                            currentImage={location.image}
                            imageFile={imageFile}
                            imagePreview={imagePreview}
                            fileInputRef={fileInputRef}
                            onFileChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }}
                            onClear={clearFile}
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input id="editFeatured" className="form-check-input" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                        <label htmlFor="editFeatured" className="form-check-label">Featured</label>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill fw-medium" onClick={onCancel} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary rounded-pill fw-medium" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Spots Tab ───────────────────────────────────────────────────────────────

function SpotsTab({ spots, setSpots, locations }: { spots: Spot[]; setSpots: (s: Spot[]) => void; locations: Location[] }) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                {!showForm && !editingId && (
                    <button className="btn btn-primary btn-sm rounded-pill fw-medium" onClick={() => setShowForm(true)}>
                        <BsPlus size={18} className="me-1" /> Add Spot
                    </button>
                )}
            </div>

            {showForm && (
                <AddSpotForm
                    locations={locations}
                    onCreated={async () => {
                        const res = await fetch('/api/spots')
                        if (res.ok) setSpots(await res.json())
                        setShowForm(false)
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingId && (
                <EditSpotForm
                    spot={spots.find((s) => s.id === editingId)!}
                    locations={locations}
                    onSaved={async () => {
                        const res = await fetch('/api/spots')
                        if (res.ok) setSpots(await res.json())
                        setEditingId(null)
                    }}
                    onCancel={() => setEditingId(null)}
                />
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle bg-white rounded shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: 60 }}></th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Slug</th>
                            <th className="text-center">Featured</th>
                            <th className="text-center">Custom Page</th>
                            <th>Coords</th>
                            <th style={{ width: 50 }}>ID</th>
                            <th style={{ width: 50 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {spots.map((spot) => (
                            <tr key={spot.id}>
                                <td>
                                    <Image src={spot.image || DEFAULT_SPOT_IMAGE} alt={spot.title} width={48} height={32} style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>
                                    <Link href={`/spots/${spot.slug}`} className="fw-medium text-decoration-none">{spot.title}</Link>
                                </td>
                                <td className="text-muted">
                                    {spot.location?.name || '—'}
                                    {spot.location?.country && <span className="small">, {spot.location.country}</span>}
                                </td>
                                <td><code className="text-muted small">{spot.slug}</code></td>
                                <td className="text-center">{spot.featured ? 'Yes' : '—'}</td>
                                <td className="text-center">{spot.custom_page ? 'Yes' : '—'}</td>
                                <td className="text-muted small">
                                    {spot.lat && spot.lon ? `${spot.lat.toFixed(2)}, ${spot.lon.toFixed(2)}` : '—'}
                                </td>
                                <td className="text-muted small">{spot.id}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-link text-muted p-0"
                                        title="Edit"
                                        onClick={() => { setEditingId(spot.id); setShowForm(false) }}
                                    >
                                        <BsPencilSquare />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

function AddSpotForm({ locations, onCreated, onCancel }: { locations: Location[]; onCreated: () => void; onCancel: () => void }) {
    const [title, setTitle] = useState('')
    const [locationId, setLocationId] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function clearFile() {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            let imageUrl = ''
            if (imageFile) {
                const result = await uploadImage(imageFile)
                if (result.error) { setError(result.error); setSubmitting(false); return }
                imageUrl = result.url!
            }

            const res = await fetch('/api/spots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, location_id: Number(locationId), image: imageUrl }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }

            onCreated()
        } catch {
            setError('Something went wrong')
        }
        setSubmitting(false)
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header py-3 px-4"><h5 className="fw-medium mb-0">New Spot</h5></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Title</label>
                                <input type="text" className="form-control rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Location</label>
                                <select className="form-select rounded" value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                                    <option value="">Select a location...</option>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>{loc.name}{loc.country ? `, ${loc.country}` : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-border mb-3">
                        <label className="form-label fw-medium">Image</label>
                        <ImageUploadField
                            imageFile={imageFile}
                            imagePreview={imagePreview}
                            fileInputRef={fileInputRef}
                            onFileChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }}
                            onClear={clearFile}
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill fw-medium" onClick={onCancel} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary rounded-pill fw-medium" disabled={submitting}>{submitting ? 'Creating...' : 'Create Spot'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EditSpotForm({ spot, locations, onSaved, onCancel }: { spot: Spot; locations: Location[]; onSaved: () => void; onCancel: () => void }) {
    const [title, setTitle] = useState(spot.title)
    const [locationId, setLocationId] = useState(String(spot.location_id))
    const [featured, setFeatured] = useState(spot.featured)
    const [windguruForecastId, setWindguruForecastId] = useState(spot.windguru_forecast_id || '')
    const [windguruLiveStationId, setWindguruLiveStationId] = useState(spot.windguru_live_station_id || '')
    const [lat, setLat] = useState(spot.lat != null ? String(spot.lat) : '')
    const [lon, setLon] = useState(spot.lon != null ? String(spot.lon) : '')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function clearFile() {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            let imageUrl: string | undefined
            if (imageFile) {
                const result = await uploadImage(imageFile)
                if (result.error) { setError(result.error); setSubmitting(false); return }
                imageUrl = result.url!
            }

            const payload: Record<string, unknown> = {
                id: spot.id,
                title,
                location_id: Number(locationId),
                windguru_forecast_id: windguruForecastId || null,
                windguru_live_station_id: windguruLiveStationId || null,
            }
            if (imageUrl) payload.image = imageUrl
            if (lat && lon) { payload.lat = parseFloat(lat); payload.lon = parseFloat(lon) }

            const res = await fetch('/api/spots', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }

            onSaved()
        } catch {
            setError('Something went wrong')
        }
        setSubmitting(false)
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header py-3 px-4"><h5 className="fw-medium mb-0">Edit Spot — {spot.title}</h5></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Title</label>
                                <input type="text" className="form-control rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Location</label>
                                <select className="form-select rounded" value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>{loc.name}{loc.country ? `, ${loc.country}` : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-border mb-3">
                        <label className="form-label fw-medium">Image</label>
                        <ImageUploadField
                            currentImage={spot.image}
                            imageFile={imageFile}
                            imagePreview={imagePreview}
                            fileInputRef={fileInputRef}
                            onFileChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }}
                            onClear={clearFile}
                        />
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Windguru Forecast ID</label>
                                <input type="text" className="form-control rounded" value={windguruForecastId} onChange={(e) => setWindguruForecastId(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Windguru Live Station ID</label>
                                <input type="text" className="form-control rounded" value={windguruLiveStationId} onChange={(e) => setWindguruLiveStationId(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Latitude</label>
                                <input type="text" className="form-control rounded" value={lat} onChange={(e) => setLat(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-border">
                                <label className="form-label fw-medium">Longitude</label>
                                <input type="text" className="form-control rounded" value={lon} onChange={(e) => setLon(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-check mb-3">
                        <input id="editSpotFeatured" className="form-check-input" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                        <label htmlFor="editSpotFeatured" className="form-check-label">Featured</label>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill fw-medium" onClick={onCancel} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary rounded-pill fw-medium" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
