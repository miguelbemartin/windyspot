import { Metadata } from 'next'
import { clerkClient } from '@clerk/nextjs/server'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { username } = await params

  try {
    const client = await clerkClient()
    const users = await client.users.getUserList({ username: [username], limit: 1 })

    if (users.data.length === 0) {
      return {
        title: 'User Not Found',
        robots: { index: false, follow: false },
      }
    }

    const user = users.data[0]
    const displayName = user.fullName || username
    const title = `${displayName} - Windsurf Profile`
    const description = `Check out ${displayName}'s windsurf spots and profile on Windy Spot.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.windyspot.com/u/${username}`,
        images: user.imageUrl ? [{ url: user.imageUrl, width: 200, height: 200, alt: displayName }] : [],
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
