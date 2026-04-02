'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

declare global {
  interface Window {
    mixpanel?: {
      identify: (id: string) => void
      people: {
        set: (props: Record<string, string | undefined>) => void
      }
    }
  }
}

export default function MixpanelIdentify() {
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (isSignedIn && user && window.mixpanel) {
      window.mixpanel.identify(user.id)
      window.mixpanel.people.set({
        $email: user.primaryEmailAddress?.emailAddress,
        $name: user.fullName || undefined,
      })
    }
  }, [isSignedIn, user])

  return null
}
