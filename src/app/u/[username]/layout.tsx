import { Metadata } from 'next'
import { createAdminClient } from '../../lib/supabase-server'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { username } = await params

  try {
    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, avatar_url')
      .eq('username', username)
      .single()

    if (!profile) {
      return {
        title: 'User Not Found',
        robots: { index: false, follow: false },
      }
    }

    const displayName = profile.full_name || username
    const title = `${displayName} - Windsurf Profile`
    const description = `Check out ${displayName}'s windsurf spots and profile on Windy Spot.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.windyspot.com/u/${username}`,
        images: profile.avatar_url ? [{ url: profile.avatar_url, width: 200, height: 200, alt: displayName }] : [],
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
      alternates: {
        canonical: `https://www.windyspot.com/u/${username}`,
      },
    }
  } catch {
    return {
      title: username,
    }
  }
}

export default function UserProfileLayout({ children }: LayoutProps) {
  return <>{children}</>
}
