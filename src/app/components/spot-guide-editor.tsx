'use client'

import { useRef, useState, lazy, Suspense, useEffect } from 'react'
import { BsImage } from 'react-icons/bs'

const LazyEditor = lazy(() => import('./spot-guide-editor-inner'))

interface SpotGuideEditorProps {
    value: string
    onChange: (value: string) => void
    style?: React.CSSProperties
}

export default function SpotGuideEditor({ value, onChange, style }: SpotGuideEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) {
                const data = await res.json()
                alert(data.error || 'Failed to upload image')
                return
            }
            const { url } = await res.json()
            onChange(value + `<img src="${url}" alt="" style="max-width:100%;height:auto;" />`)
        } catch {
            alert('Failed to upload image')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const imageButton = (
        <button
            type="button"
            title="Insert image"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', opacity: uploading ? 0.5 : 1 }}
        >
            <BsImage size={14} />
        </button>
    )

    return (
        <div style={{ position: 'relative' }}>
            {mounted ? (
                <Suspense fallback={<div style={{ minHeight: '150px', border: '1px solid #dee2e6', borderRadius: '4px' }} />}>
                    <LazyEditor value={value} onChange={onChange} style={style} imageButton={imageButton} />
                </Suspense>
            ) : (
                <div style={{ minHeight: '150px', border: '1px solid #dee2e6', borderRadius: '4px' }} />
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
            {uploading && <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>Uploading image...</div>}
        </div>
    )
}
