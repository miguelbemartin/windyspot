'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { BsSearch, BsGeoAlt } from 'react-icons/bs'
import type { SpotWithLocation } from '../lib/spots'

interface SpotSearchProps {
  spots: SpotWithLocation[]
}

export default function SpotSearch({ spots }: SpotSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fuse = useMemo(
    () =>
      new Fuse(spots, {
        keys: ['title', 'location.name'],
        threshold: 0.4,
      }),
    [spots]
  )

  const results = query.length > 0 ? fuse.search(query) : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="heroSearch rounded-search style-01" style={{ position: 'relative' }}>
      <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">
        <div className="col-xl-10 col-lg-9 col-md-8 col-sm-12">
          <div className="form-group position-relative">
            <input
              type="text"
              className="form-control fs-6 fw-medium border-0"
              placeholder="Search spots by name or location..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => { if (query.length > 0) setOpen(true) }}
            />
            <div className="position-absolute top-50 end-0 translate-middle-y d-md-block d-none">
              <span className="badge badge-xs badge-primary rounded-pill">
                {query.length > 0 ? `${results.length} match${results.length !== 1 ? 'es' : ''}` : `${spots.length} spots`}
              </span>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-12">
          <div className="form-group">
            <button
              type="button"
              className="btn btn-primary full-width fw-medium rounded-pill"
              onClick={() => { if (query.length > 0) setOpen(!open) }}
            >
              <BsSearch className="me-2" />Search
            </button>
          </div>
        </div>
      </div>

      {open && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: '320px',
            overflowY: 'auto',
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          {results.map(({ item }) => (
            <Link
              key={item.id}
              href={`/spots/${item.slug}`}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                textDecoration: 'none',
                color: '#333',
                borderBottom: '1px solid #f0f0f0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BsGeoAlt /> {item.location.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
