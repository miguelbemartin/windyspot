'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { BsPencilSquare } from 'react-icons/bs'

import SpotGuideEditor from './spot-guide-editor'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface LocationOption {
    value: string
    label: string
}

interface EditSpotContextValue {
    editing: boolean
    setEditing: (v: boolean) => void
}

const EditSpotContext = createContext<EditSpotContextValue>({ editing: false, setEditing: () => {} })

interface EditSpotProviderProps {
    children: ReactNode
    createdBy: string | null
}

export function EditSpotProvider({ children, createdBy }: EditSpotProviderProps) {
    const { user } = useUser()
    const [editing, setEditing] = useState(false)
    const isAdmin = user?.publicMetadata?.role === 'admin'

    if (!user || (!isAdmin && user.id !== createdBy)) return <>{children}</>

    return (
        <EditSpotContext.Provider value={{ editing, setEditing }}>
            {children}
        </EditSpotContext.Provider>
    )
}

export function EditSpotButton() {
    const { user } = useUser()
    const { editing, setEditing } = useContext(EditSpotContext)

    if (!user || editing) return null

    return (
        <button
            className="btn btn-sm btn-outline-light rounded-pill fw-medium"
            onClick={() => setEditing(true)}
        >
            <BsPencilSquare className="me-1" /> Edit
        </button>
    )
}

export function EditSpotGuideForm({ spotId, initialSpotGuide }: { spotId: number; initialSpotGuide: string | null }) {
    const { user } = useUser()
    const router = useRouter()
    const [editing, setEditing] = useState(false)
    const [spotGuide, setSpotGuide] = useState(initialSpotGuide || '')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    if (!user) return null

    if (!editing) {
        if (!initialSpotGuide) {
            return (
                <div
                    className="border rounded-3 d-flex flex-column align-items-center justify-content-center text-muted"
                    style={{ height: '150px', cursor: 'pointer', borderStyle: 'dashed' }}
                    onClick={() => setEditing(true)}
                >
                    <BsPencilSquare size={24} className="mb-2" />
                    <span style={{ fontSize: '0.9rem' }}>Be the first to write a spot guide!</span>
                </div>
            )
        }
        return (
            <>
                <div dangerouslySetInnerHTML={{ __html: initialSpotGuide }} />
                <div className="d-flex justify-content-end mt-3">
                    <button
                        className="btn btn-link btn-sm text-muted text-decoration-none p-0"
                        onClick={() => setEditing(true)}
                    >
                        <BsPencilSquare className="me-1" /> Edit spot guide
                    </button>
                </div>
            </>
        )
    }

    async function handleSave() {
        setError('')
        setSubmitting(true)
        try {
            const res = await fetch('/api/spots/guide', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: spotId, spot_guide: spotGuide }),
            })
            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }
            setEditing(false)
            setSubmitting(false)
            router.refresh()
        } catch {
            setError('Something went wrong')
            setSubmitting(false)
        }
    }

    return (
        <div className="mt-3">
            <div className="form-group form-border mb-3">
                <SpotGuideEditor
                    value={spotGuide}
                    onChange={setSpotGuide}
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-primary rounded-pill fw-medium"
                    onClick={handleSave}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                    className="btn btn-sm btn-outline-secondary rounded-pill fw-medium"
                    onClick={() => { setEditing(false); setSpotGuide(initialSpotGuide || ''); setError('') }}
                    disabled={submitting}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

interface EditSpotFormProps {
    spotId: number
    initialTitle: string
    initialDescription: string
    initialSpotGuide: string | null
    initialWindguruLiveStationId: string | null
    initialLocationId: number
    initialLocationName: string
}

export function EditSpotForm({ spotId, initialTitle, initialDescription, initialSpotGuide, initialWindguruLiveStationId, initialLocationId, initialLocationName }: EditSpotFormProps) {
    const router = useRouter()
    const { editing, setEditing } = useContext(EditSpotContext)
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState(initialDescription)
    const [spotGuide, setSpotGuide] = useState(initialSpotGuide || '')
    const [windguruLiveStationId, setWindguruLiveStationId] = useState(initialWindguruLiveStationId || '')
    const [locations, setLocations] = useState<{ id: number; name: string; country: string | null }[]>([])
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>({ value: String(initialLocationId), label: initialLocationName })
    const [isNewLocation, setIsNewLocation] = useState(false)
    const [newLocationName, setNewLocationName] = useState('')
    const [newLocationCountry, setNewLocationCountry] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!editing) return
        async function fetchLocations() {
            const res = await fetch('/api/locations')
            if (res.ok) {
                const data = await res.json()
                setLocations(data)
            }
        }
        fetchLocations()
    }, [editing])

    const locationOptions: LocationOption[] = locations.map((loc) => ({
        value: String(loc.id),
        label: loc.country ? `${loc.name}, ${loc.country}` : loc.name,
    }))

    if (!editing) return null

    async function handleSave() {
        setError('')
        setSubmitting(true)

        try {
            const payload: Record<string, unknown> = {
                id: spotId,
                title,
                description,
                spot_guide: spotGuide,
                windguru_live_station_id: windguruLiveStationId,
            }

            if (isNewLocation) {
                payload.new_location_name = newLocationName
                payload.new_location_country = newLocationCountry || null
            } else if (selectedLocation) {
                payload.location_id = Number(selectedLocation.value)
            }

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

            setEditing(false)
            setSubmitting(false)
            router.refresh()
        } catch {
            setError('Something went wrong')
            setSubmitting(false)
        }
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header py-3 px-4">
                <h5 className="fw-medium mb-0">Edit Spot</h5>
            </div>
            <div className="card-body">
                <div className="form-group form-border mb-3">
                    <label className="form-label fw-medium">Title</label>
                    <input
                        type="text"
                        className="form-control rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group form-border mb-3">
                    <label className="form-label fw-medium">Description</label>
                    <input
                        type="text"
                        className="form-control rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group form-border mb-3">
                    <label className="form-label fw-medium">Spot Guide</label>
                    <SpotGuideEditor
                        value={spotGuide}
                        onChange={setSpotGuide}
                    />
                </div>
                <div className="form-group form-border mb-3">
                    <label className="form-label fw-medium">Location</label>
                    <div className="mb-2">
                        <div className="form-check form-check-inline">
                            <input
                                id="editExistingLocation"
                                className="form-check-input"
                                type="radio"
                                name="editLocationType"
                                checked={!isNewLocation}
                                onChange={() => setIsNewLocation(false)}
                            />
                            <label htmlFor="editExistingLocation" className="form-check-label">Existing location</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                id="editNewLocation"
                                className="form-check-input"
                                type="radio"
                                name="editLocationType"
                                checked={isNewLocation}
                                onChange={() => setIsNewLocation(true)}
                            />
                            <label htmlFor="editNewLocation" className="form-check-label">New location</label>
                        </div>
                    </div>
                    {!isNewLocation ? (
                        <div className="selects">
                            <Select
                                placeholder="Select a location..."
                                options={locationOptions}
                                className="location form-control"
                                value={selectedLocation}
                                onChange={(val) => setSelectedLocation(val as LocationOption)}
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control rounded"
                                    placeholder="Location name"
                                    value={newLocationName}
                                    onChange={(e) => setNewLocationName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control rounded"
                                    placeholder="Country"
                                    value={newLocationCountry}
                                    onChange={(e) => setNewLocationCountry(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group form-border mb-3">
                    <label className="form-label fw-medium">Windguru Live Station ID</label>
                    <input
                        type="text"
                        className="form-control rounded"
                        value={windguruLiveStationId}
                        onChange={(e) => setWindguruLiveStationId(e.target.value)}
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary rounded-pill fw-medium"
                        onClick={handleSave}
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        className="btn btn-outline-secondary rounded-pill fw-medium"
                        onClick={() => {
                            setEditing(false)
                            setTitle(initialTitle)
                            setDescription(initialDescription)
                            setSpotGuide(initialSpotGuide || '')
                            setWindguruLiveStationId(initialWindguruLiveStationId || '')
                            setSelectedLocation({ value: String(initialLocationId), label: initialLocationName })
                            setIsNewLocation(false)
                            setNewLocationName('')
                            setNewLocationCountry('')
                            setError('')
                        }}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
