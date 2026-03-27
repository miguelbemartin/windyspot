import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wind Forecast & Live Conditions',
  description: 'Check the latest wind forecast, live weather conditions, and nearby windsurf spots. Plan your next session with real-time data.',
  openGraph: {
    title: 'Wind Forecast & Live Conditions',
    description: 'Check the latest wind forecast, live weather conditions, and nearby windsurf spots. Plan your next session with real-time data.',
    url: 'https://www.windyspot.com/forecast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wind Forecast & Live Conditions',
    description: 'Check the latest wind forecast, live weather conditions, and nearby windsurf spots.',
  },
  alternates: {
    canonical: 'https://www.windyspot.com/forecast',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
