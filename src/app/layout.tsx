import {Metadata} from 'next';
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import 'bootstrap/dist/css/bootstrap.css'
import './style/scss/style.scss'
import 'animate.css/animate.css'


export const metadata: Metadata = {
  metadataBase: new URL('https://www.windyspot.com'),
  title: "Windy Spots - Find the best forecast to windsurf",
  description: "Windy Spots - Find the best forecast to windsurf",
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
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
         </head>
        <body>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-XRCNG25M9V" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XRCNG25M9V');
            `}
          </Script>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
