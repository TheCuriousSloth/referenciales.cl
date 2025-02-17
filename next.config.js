/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'referenciales.cl',
      }
    ],
  },
  reactStrictMode: true,
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://vercel.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://*.googleusercontent.com https://authjs.dev https://*.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org`,
      "font-src 'self' data:",
      `connect-src 'self' https://*.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://accounts.google.com https://va.vercel-scripts.com`,
      "frame-src 'self' https://accounts.google.com"
    ];

    if (isDev) {
      cspDirectives.push("connect-src 'self' *");
      cspDirectives.push("img-src 'self' data: blob: *");
    }

    const headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ];

    return headers;
  }
};

module.exports = nextConfig;