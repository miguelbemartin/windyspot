import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Windsurf Community & Social Feed',
  description: 'Join the Windy Spot community. Share sessions, post photos, follow other windsurfers, and stay connected with the global windsurf scene.',
  openGraph: {
    title: 'Windsurf Community & Social Feed',
    description: 'Join the Windy Spot community. Share sessions, post photos, follow other windsurfers, and stay connected with the global windsurf scene.',
    url: 'https://www.windyspot.com/community',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Windsurf Community & Social Feed',
    description: 'Join the Windy Spot community. Share sessions, post photos, and follow other windsurfers.',
  },
  alternates: {
    canonical: 'https://www.windyspot.com/community',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
