import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Windsurf, Wingfoil and Windfoil Sessions & Activity',
  description: 'Log your windsurf sessions, track your stats, import GPX files, and visualize your progress over time. See distance, speed, heart rate, and spots visited.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://www.windyspot.com/activity',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
