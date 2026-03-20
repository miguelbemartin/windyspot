import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/add-spot',
        destination: '/add-new-spot',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'orwtlksbpmgpijcdtngr.supabase.co',
      },
    ],
  },
};

export default nextConfig;
