'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { BsPencilSquare } from 'react-icons/bs'

const Editor = dynamic(() => import('react-simple-wysiwyg').then(mod => mod.default), { ssr: false })

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

    if (!user || user.id !== createdBy) return <>{children}</>

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

interface EditSpotFormProps {
    spotId: number
    initialTitle: string
    initialDescription: string
    initialSpotGuide: string | null
    initialWindguruForecastId: string | null
    initialWindguruLiveStationId: string | null
}

export function EditSpotForm({ spotId, initialTitle, initialDescription, initialSpotGuide, initialWindguruForecastId, initialWindguruLiveStationId }: EditSpotFormProps) {
    const router = useRouter()
    const { editing, setEditing } = useContext(EditSpotContext)
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState(initialDescription)
    const [spotGuide, setSpotGuide] = useState(initialSpotGuide || '')
    const [windguruForecastId, setWindguruForecastId] = useState(initialWindguruForecastId || '')
    const [windguruLiveStationId, setWindguruLiveStationId] = useState(initialWindguruLiveStationId || '')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    if (!editing) return null

    async function handleSave() {
        setError('')
        setSubmitting(true)

        try {
            const res = await fetch('/api/spots', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: spotId,
                    title,
                    description,
                    spot_guide: spotGuide,
                    windguru_forecast_id: windguruForecastId,
                    windguru_live_station_id: windguruLiveStationId,
                }),
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
                <div className="mb-3">
                    <label className="form-label fw-medium">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-medium">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-medium">Spot Guide</label>
                    <Editor
                        value={spotGuide}
                        onChange={(e: { target: { value: string } }) => setSpotGuide(e.target.value)}
                        style={{ minHeight: '150px' }}
                    />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">Windguru Forecast ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={windguruForecastId}
                            onChange={(e) => setWindguruForecastId(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">Windguru Live Station ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={windguruLiveStationId}
                            onChange={(e) => setWindguruLiveStationId(e.target.value)}
                        />
                    </div>
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
                            setWindguruForecastId(initialWindguruForecastId || '')
                            setWindguruLiveStationId(initialWindguruLiveStationId || '')
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
