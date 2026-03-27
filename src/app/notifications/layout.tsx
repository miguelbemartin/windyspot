import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Windsurf Notifications & Updates',
  description: 'Stay up to date with likes, comments, and new followers on Windy Spot. Never miss what is happening in the windsurf community.',
  openGraph: {
    title: 'Windsurf Notifications & Updates',
    description: 'Stay up to date with likes, comments, and new followers on Windy Spot.',
    url: 'https://www.windyspot.com/notifications',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Windsurf Notifications & Updates',
    description: 'Stay up to date with likes, comments, and new followers on Windy Spot.',
  },
  alternates: {
    canonical: 'https://www.windyspot.com/notifications',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
