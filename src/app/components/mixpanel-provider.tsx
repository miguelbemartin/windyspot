'use client'

import mixpanel from 'mixpanel-browser'
import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

const MAIN_DOMAIN = 'www.windyspot.com'

function isMainDomain() {
  return typeof window !== 'undefined' && window.location.hostname === MAIN_DOMAIN
}

export default function MixpanelProvider() {
  const { isSignedIn, user } = useUser()
  const initialized = useRef(false)
  const identified = useRef(false)

  useEffect(() => {
    if (!isMainDomain()) return

    if (!initialized.current) {
      mixpanel.init('e262eb847484033e2f8c05c345812fda', {
        autocapture: true,
        record_sessions_percent: 100,
        api_host: 'https://api-eu.mixpanel.com',
      })
      initialized.current = true
    }

    if (isSignedIn && user && !identified.current) {
      mixpanel.identify(user.id)
      mixpanel.people.set({
        $email: user.primaryEmailAddress?.emailAddress,
        $name: user.fullName || undefined,
      })
      identified.current = true
    }
  }, [isSignedIn, user])

  return null
}
