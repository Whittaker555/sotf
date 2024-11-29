import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'image-cdn-ak.spotifycdn.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'mosaic.scdn.co',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'i.scdn.co',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
