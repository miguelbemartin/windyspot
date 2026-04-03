'use client'

import mixpanel from 'mixpanel-browser'
import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  mixpanel.init('e262eb847484033e2f8c05c345812fda', {
    autocapture: true,
    record_sessions_percent: 100,
    api_host: 'https://api-eu.mixpanel.com',
  })
}

export default function MixpanelProvider() {
  const { isSignedIn, user } = useUser()
  const identified = useRef(false)

  useEffect(() => {
    if (isProduction && isSignedIn && user && !identified.current) {
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
