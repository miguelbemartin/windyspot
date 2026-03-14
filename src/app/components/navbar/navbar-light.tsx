'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import type { SpotWithLocation } from '../../lib/spots'

import { BsPersonCircle,BsBasket2,BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX, } from "react-icons/bs";
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';


export default function NavbarLight() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [spots, setSpots] = useState<SpotWithLocation[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    const location = usePathname();
    const router = useRouter();

    const fuse = useMemo(
        () => new Fuse(spots, { keys: ['title', 'location.name', 'location.country'], threshold: 0.4 }),
        [spots]
    )
    const searchResults = searchQuery.length > 0 ? fuse.search(searchQuery, { limit: 8 }) : []

    useEffect(()=>{
            if (typeof window === "undefined") return;
            window.scrollTo(0,0)
            setCurrent(location)

            const handlerScroll=()=>{
                if(window.scrollY > 50){
                    setScroll(true)
                }else{setScroll(false)}
            }

            if (typeof window !== "undefined") {
                setWindowWidth(window.innerWidth);
            }

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                };

            window.addEventListener('scroll',handlerScroll)
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('scroll',handlerScroll)
                window.removeEventListener('resize', handleResize);
                };
        },[windowWidth])

    useEffect(() => {
        fetch('/api/spots').then(r => r.json()).then(setSpots).catch(() => {})
    }, [])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') setSearchOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

  return (
    <>
        <div className={`header header-transparent dark navdark header-fixed `} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : "navigation navigation-portrait"}>
                    <div className="nav-header ">
                        <Link href="/"><Image src='/windy-spot-logo.png' width={0} height={0} sizes='100vw' style={{width:'100px', height:'auto'}} className="logo" alt=""/></Link>
                        <div className="d-flex d-lg-none align-items-center gap-2" style={{ position: 'absolute', left: '120px', top: '50%', transform: 'translateY(-50%)' }}>
                            <style>{`.nav-search-mobile, .nav-search-mobile:focus { background: transparent !important; box-shadow: none !important; color: #fff !important; } .nav-search-mobile::placeholder { color: rgba(255,255,255,0.5) !important; }`}</style>
                            <div ref={searchRef} style={{ position: 'relative' }}>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm rounded-pill pe-4 nav-search-mobile"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                                        onFocus={() => { if (searchQuery.length > 0) setSearchOpen(true) }}
                                        style={{ width: '140px', fontSize: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                                    />
                                    <BsSearch className="position-absolute top-50 end-0 translate-middle-y me-2" style={{ fontSize: '11px', color: '#fff', opacity: 0.5, pointerEvents: 'none' }} />
                                </div>
                                {searchOpen && searchResults.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 6px)',
                                        right: 0,
                                        width: '280px',
                                        zIndex: 1000,
                                        maxHeight: '320px',
                                        overflowY: 'auto',
                                        borderRadius: '10px',
                                        background: '#fff',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    }}>
                                        {searchResults.map(({ item }) => (
                                            <Link
                                                key={item.id}
                                                href={`/spots/${item.slug}`}
                                                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '8px 14px',
                                                    textDecoration: 'none',
                                                    color: '#333',
                                                    borderBottom: '1px solid #f0f0f0',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</div>
                                                    <div style={{ fontSize: '11px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <BsGeoAlt /> {item.location.name}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="d-flex d-lg-none align-items-center gap-2" style={{ position: 'absolute', right: '0px', top: '50%', transform: 'translateY(-50%)' }}>
                            <SignedIn>
                                <UserButton afterSignOutUrl="/">
                                    <UserButton.MenuItems>
                                        <UserButton.Link label="My Profile" labelIcon={<BsPersonCircle />} href="/profile" />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </SignedIn>
                            <SignedOut>
                                <Link href="/login" className="d-flex align-items-center" style={{ color: '#fff' }}><BsPersonCircle className="fs-5"/></Link>
                            </SignedOut>
                        </div>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <div className='mobLogos'>
                            <Image src='/ws.png' width={0} height={0} sizes='100vw' style={{width:'50px', height:'auto'}} className='img-fluid lightLogo' alt='Logo'/>
                        </div>
                        <span className='nav-menus-wrapper-close-button'  onClick={()=>setIsToggle(!toggle)}>✕</span>

                        <ul className="nav-menu">
                            <li className="d-none d-lg-flex align-items-center">
                                <style>{`.nav-search-input, .nav-search-input:focus { background: transparent !important; box-shadow: none !important; color: #fff !important; } .nav-search-input::placeholder { color: rgba(255,255,255,0.5) !important; }`}</style>
                                <div ref={searchRef} style={{ position: 'relative' }}>
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm rounded-pill pe-4 nav-search-input"
                                            placeholder="Search spots..."
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                                            onFocus={() => { if (searchQuery.length > 0) setSearchOpen(true) }}
                                            style={{ width: '180px', fontSize: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                                        />
                                        <BsSearch className="position-absolute top-50 end-0 translate-middle-y me-2" style={{ fontSize: '11px', color: '#fff', opacity: 0.5, pointerEvents: 'none' }} />
                                    </div>
                                    {searchOpen && searchResults.length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 6px)',
                                            left: 0,
                                            width: '280px',
                                            zIndex: 1000,
                                            maxHeight: '320px',
                                            overflowY: 'auto',
                                            borderRadius: '10px',
                                            background: '#fff',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                        }}>
                                            {searchResults.map(({ item }) => (
                                                <Link
                                                    key={item.id}
                                                    href={`/spots/${item.slug}`}
                                                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '8px 14px',
                                                        textDecoration: 'none',
                                                        color: '#333',
                                                        borderBottom: '1px solid #f0f0f0',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                                >
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</div>
                                                        <div style={{ fontSize: '11px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <BsGeoAlt /> {item.location.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                            {/* <li className={`${current === '/' ? 'active' : ''}`}><Link href="/">Home</Link></li>
                            <li className={`${current === '/spots' ? 'active' : ''}`}><Link href="/spots">Spots</Link></li> */}
                        </ul>

                        <ul className="nav-menu nav-menu-social align-to-right">

                            <SignedOut>
                                <li>
                                    <Link href="/login" className="d-flex align-items-center"><BsPersonCircle className="fs-6 me-1"/><span className="navCl">Login</span></Link>
                                </li>
                            </SignedOut>
                            <SignedIn>
                                <li className="d-flex align-items-center px-0">
                                    <UserButton afterSignOutUrl="/">
                                        <UserButton.MenuItems>
                                            <UserButton.Link label="My Profile" labelIcon={<BsPersonCircle />} href="/profile" />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </li>
                            </SignedIn>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div className="clearfix"></div>


        <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex={-1} id="cartSlider" aria-labelledby="cartSliderLabel">
            <div className="offcanvas-header border-bottom d-flex justify-content-between">
                <h6 className="offcanvas-title" id="cartSliderLabel">Your cart Items</h6>
                <Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><FiX className=""/></Link>
            </div>
            <div className="offcanvas-body">
                <div className="cartItems w-100">
                    <div className="d-flex align-items-center justify-content-start flex-column gap-3">

                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-4 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><Image src='/img/list-3.jpg' width={0} height={0} sizes='100vw' style={{width:'60px', height:'auto'}} className="img-fluid rounded-2"  alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Spicy Burger</h6>
                                    <p className="m-0">1x$25.50</p>
                                </div>
                            </div>

                            <div className="removeItemcart"><Link href="#" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>

                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><Image src='/img/list-4.jpg' width={0} height={0} sizes='100vw' style={{width:'60px', height:'auto'}} className="img-fluid rounded-2"  alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Premium Package</h6>
                                    <p className="m-0">1x$22.10</p>
                                </div>
                            </div>

                            <div className="removeItemcart"><Link href="#" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>

                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><Image src='/img/list-5.jpg' width={0} height={0} sizes='100vw' style={{width:'60px', height:'auto'}} className="img-fluid rounded-2"  alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Platinum Plaster</h6>
                                    <p className="m-0">1x$17.40</p>
                                </div>
                            </div>

                            <div className="removeItemcart"><Link href="" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>

                    </div>

                    <div className="cartSubtotal w-100 py-3 border-top mt-3">
                        <h6 className="m-0">Subtotal: $128.75</h6>
                    </div>

                </div>

                <div className="cartButtons w-100 py-2">
                    <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                        <a href="/viewcart" className="btn btn-md btn-light-primary fw-medium flex-fill">View Cart</a>
                        <a href="/checkout-page" className="btn btn-md btn-primary fw-medium flex-fill">Checkout</a>
                    </div>
                </div>
            </div>
        </div>
        <div className="offcanvas offcanvas-top h-auto" tabIndex={-1} id="searchSlider" aria-labelledby="searchSliderLabel">
            <div className="offcanvas-body" id="searchSliderLabel">
                <div className="searchForm w-100 mb-3">
                    <div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
                        <div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
                        <div className="flex-fill"><input type="search" className="form-control border-0 ps-0" placeholder="What are you looking for?"/></div>
                        <div className="closeSlides"><Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><BsX /></Link></div>
                    </div>
                </div>
                <div className="popularSearches d-flex align-items-center justify-content-center gap-2 flex-wrap">
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Real Estate</Link></div>
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Eat & Drink</Link></div>
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Shopping</Link></div>
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Nightlife</Link></div>
                    <div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Services</Link></div>
                </div>
            </div>
        </div>
    </>
  )
}
