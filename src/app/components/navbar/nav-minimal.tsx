'use client'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { BsPersonCircle, BsPersonPlus } from "react-icons/bs";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


export default function NavMinimal() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);

    const location = usePathname();


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

  return (
    <>
        <div className={`header header-dark navdark ${scroll ? 'header-fixed' : ''}`} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : "navigation navigation-portrait"}>
                    <div className="nav-header">
                        <Link className="nav-brand" href="/"><img src='/windy-spot-logo.png' style={{width:'166px', height:'auto'}} className="logo" alt=""/></Link>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <ul className="nav-menu nav-menu-social align-to-right">
                            <SignedOut>
                                <li>
                                    <Link href="/login" className="d-flex align-items-center"><BsPersonCircle className="fs-6 me-1"/><span className="navCl">Login</span></Link>
                                </li>
                                <li className="list-buttons light">
                                    <Link href="/register"><BsPersonPlus className="fs-6 me-1"/>Sign Up</Link>
                                </li>
                            </SignedOut>
                            <SignedIn>
                                <li className="d-flex align-items-center px-3 pt-2">
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
    </>
  )
}
