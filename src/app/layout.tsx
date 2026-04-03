import {Metadata} from 'next';
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/next"
import GoogleAnalytics from './components/google-analytics'
import MixpanelProvider from './components/mixpanel-provider'
import 'bootstrap/dist/css/bootstrap.css'
import './style/scss/style.scss'
import 'animate.css/animate.css'


export const metadata: Metadata = {
  metadataBase: new URL('https://www.windyspot.com'),
  title: {
    default: "Windy Spot - Find the Best Windsurf Forecast & Spot Guides",
    template: "%s | Windy Spot",
  },
  description: "Discover the best windsurf spots worldwide with detailed forecast, live wind stations, webcams, and spot guides. Find your next windsurf session today.",
  keywords: ["windsurf", "windsurf spots", "wind forecast", "windsurf forecast", "kitesurf", "windsurf guide", "windsurf locations", "wind conditions", "windsurfing"],
  authors: [{ name: "Windy Spot" }],
  creator: "Windy Spot",
  publisher: "Windy Spot",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.windyspot.com",
    siteName: "Windy Spot",
    title: "Windy Spot - Find the Best Windsurf Forecast & Spot Guides",
    description: "Discover the best windsurf spots worldwide with detailed forecast, live wind stations, webcams, and spot guides. Find your next windsurf session today.",
    images: [
      {
        url: "https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Windy Spot - Windsurf Spot Finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Windy Spot - Find the Best Windsurf Forecast & Spot Guides",
    description: "Discover the best windsurf spots worldwide with detailed forecast, live wind stations, webcams, and spot guides.",
    images: ["https://orwtlksbpmgpijcdtngr.supabase.co/storage/v1/object/public/public-images/resources/windy-spot-homepage.jpg"],
  },
  alternates: {
    canonical: "https://www.windyspot.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
         <head>
           <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
           <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
           <link rel="preconnect" href="https://orwtlksbpmgpijcdtngr.supabase.co" crossOrigin="anonymous" />
           <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" as="style" />
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
         </head>
        <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Windy Spot',
              url: 'https://www.windyspot.com',
              logo: 'https://www.windyspot.com/windy-spot-logo.png',
              description: 'Discover the best windsurf spots worldwide with detailed forecast, live wind stations, webcams, and spot guides.',
              sameAs: [],
            }) }}
          />

          <main>{children}</main>

          <GoogleAnalytics />
          <MixpanelProvider />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
