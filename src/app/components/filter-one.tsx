'use client'
import React from "react";
import Link from "next/link";
import { BsFunnel, BsGeoAlt, BsList, BsSearch, BsUiRadiosGrid } from 'react-icons/bs'


interface FilterOneProps {
    list: boolean;
    showToggle?: boolean;
    locations?: string[];
    selectedLocations?: string[];
    onLocationChange?: (locations: string[]) => void;
    rentalFilter?: boolean | null;
    onRentalChange?: (value: boolean | null) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export default function FilterOne({list, showToggle = true, locations = [], selectedLocations = [], onLocationChange, rentalFilter = null, onRentalChange, searchQuery = '', onSearchChange}:FilterOneProps) {

  const handleLocationToggle = (location: string) => {
    if (!onLocationChange) return
    if (selectedLocations.includes(location)) {
        onLocationChange(selectedLocations.filter(l => l !== location))
    } else {
        onLocationChange([...selectedLocations, location])
    }
  }

  const handleClearAll = () => {
    if (onLocationChange) onLocationChange([])
  }

  return (
    <>
        <div className="container">
            <div className="row justify-content-between align-items-center g-3">
                <div className="col-auto">
                    <div className="position-relative">
                        <BsSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted"/>
                        <input
                            type="text"
                            className="form-control ps-5 rounded-pill"
                            placeholder="Search spots..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            style={{minWidth: '220px'}}
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="filterOptions-wrap d-flex justify-content-end align-items-center gap-2">
                        <div className="filter-mobile d-lg-none">
                            <Link href="#filterSlider" data-bs-toggle="offcanvas" data-bs-target="#filterSlider" aria-controls="filterSlider" className="btn btn-md btn-light-primary rounded-pill"><BsFunnel className="me-2"/>Filter Option</Link>
                        </div>

                        <div className="filter-desktop d-none d-lg-block">
                            <div className="dropdown d-inline-flex p-0 me-1">
                                <Link href="#dropdown" className="py-2 px-3 dropdown-toggle toogleDrops" id="catsfilter" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                    <BsGeoAlt className="me-1"/>Location{selectedLocations.length > 0 ? ` (${selectedLocations.length})` : ''}
                                </Link>
                                <div className="dropdown-menu border shadow-sm">
                                    <div className="card rounded-3">
                                        <div className="card-body p-4">
                                            {selectedLocations.length > 0 && (
                                                <div className="mb-3">
                                                    <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={handleClearAll}>Clear all</button>
                                                </div>
                                            )}
                                            <div className="row align-items-start gy-2">
                                                {locations.map((location) => (
                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6" key={location}>
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`loc-${location}`}
                                                                checked={selectedLocations.includes(location)}
                                                                onChange={() => handleLocationToggle(location)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`loc-${location}`}>{location}</label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="dropdown d-inline-flex p-0 me-1">
                                <Link href="#dropdown" className="py-2 px-3 dropdown-toggle toogleDrops" id="rentalfilter" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                    Rental{rentalFilter !== null ? (rentalFilter ? ' (Yes)' : ' (No)') : ''}
                                </Link>
                                <div className="dropdown-menu border shadow-sm">
                                    <div className="card rounded-3">
                                        <div className="card-body p-4">
                                            <div className="filterButton">
                                                <div className="filterFlex">
                                                    <input type="radio" className="btn-check" name="rentalfilter" id="rental-all" checked={rentalFilter === null} onChange={() => onRentalChange?.(null)}/>
                                                    <label className="btn" htmlFor="rental-all">All</label>
                                                </div>
                                                <div className="filterFlex">
                                                    <input type="radio" className="btn-check" name="rentalfilter" id="rental-yes" checked={rentalFilter === true} onChange={() => onRentalChange?.(true)}/>
                                                    <label className="btn" htmlFor="rental-yes">With Rental</label>
                                                </div>
                                                <div className="filterFlex">
                                                    <input type="radio" className="btn-check" name="rentalfilter" id="rental-no" checked={rentalFilter === false} onChange={() => onRentalChange?.(false)}/>
                                                    <label className="btn" htmlFor="rental-no">Without Rental</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {showToggle && <div className="col">
                    <ul className="nav nav-pills nav-fill gap-2 small d-inline-flex lightprimary border border-2 rounded-pill p-1 float-end">
                        <li className="nav-item" role="presentation">
                            <Link href="/list-layout-02" className={`nav-link rounded-pill d-flex align-items-center ${list ? 'active' : ''}`} id="buy1"><BsList className="me-2"/>List</Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <Link href="/grid-layout-02" className={`nav-link rounded-pill d-flex align-items-center ${!list ? 'active' : ''}`} id="rent1"><BsUiRadiosGrid className="me-2"/>Grid</Link>
                        </li>
                    </ul>
                </div>}
            </div>
        </div>

        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id="filterSlider" aria-labelledby="filterSliderLabel">
            <div className="offcanvas-header border-bottom py-3">
                <h3 className="h5">Filters</h3>
                <button type="button" className="btn-close text-sm d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#filterSidebar" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body overflow-x-hidden p-4 p-lg-0" id="filterSliderLabel">

                <div className="searchInner">
                    <div className="search-inner">

                        <div className="filter-search-box mb-4">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search spots..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-search-box mb-4">
                            <div className="filtersearch-title"><h6 className="mb-2 lh-base text-sm text-uppercase fw-medium">Location</h6></div>
                            <div className="row align-items-center justify-content-between gy-2">
                                <div className="col-xl-12 col-lg-12 col-md-12">
                                    <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
                                        {locations.map((location) => (
                                            <div className="form-checks flex-fill" key={location}>
                                                <input
                                                    type="checkbox"
                                                    className="btn-check"
                                                    id={`loc-m-${location}`}
                                                    checked={selectedLocations.includes(location)}
                                                    onChange={() => handleLocationToggle(location)}
                                                />
                                                <label className="btn btn-sm btn-secondary rounded-1 fw-medium full-width" htmlFor={`loc-m-${location}`}>{location}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="filter-search-box mb-4">
                            <div className="filtersearch-title"><h6 className="mb-2 lh-base text-sm text-uppercase fw-medium">Rental</h6></div>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <div className="form-checks flex-fill">
                                    <input type="radio" className="btn-check" name="rentalfilter-m" id="rental-m-all" checked={rentalFilter === null} onChange={() => onRentalChange?.(null)}/>
                                    <label className="btn btn-sm btn-secondary rounded-1 fw-medium full-width" htmlFor="rental-m-all">All</label>
                                </div>
                                <div className="form-checks flex-fill">
                                    <input type="radio" className="btn-check" name="rentalfilter-m" id="rental-m-yes" checked={rentalFilter === true} onChange={() => onRentalChange?.(true)}/>
                                    <label className="btn btn-sm btn-secondary rounded-1 fw-medium full-width" htmlFor="rental-m-yes">With Rental</label>
                                </div>
                                <div className="form-checks flex-fill">
                                    <input type="radio" className="btn-check" name="rentalfilter-m" id="rental-m-no" checked={rentalFilter === false} onChange={() => onRentalChange?.(false)}/>
                                    <label className="btn btn-sm btn-secondary rounded-1 fw-medium full-width" htmlFor="rental-m-no">Without Rental</label>
                                </div>
                            </div>
                        </div>

                        {(selectedLocations.length > 0 || rentalFilter !== null) && (
                            <div className="form-group filter_button mb-0">
                                <button type="button" className="btn btn-primary fw-medium full-width" onClick={() => { handleClearAll(); onRentalChange?.(null); }}>Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    </>
  )
}
