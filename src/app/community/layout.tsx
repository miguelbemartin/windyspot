import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Windsurf Community & Social Feed',
  description: 'Join the Windy Spot community. Share sessions, post photos, follow other windsurfers, and stay connected with the global windsurf scene.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://www.windyspot.com/community',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
