import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()'
  },
  // HSTS hanya di production (HTTPS)
  ...(process.env.NODE_ENV === 'production' ? [{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }] : [])
]

// Content Security Policy - disesuaikan dengan dependencies
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://*.cloudinary.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
  "media-src 'self'",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mtsn1pacitan.sch.id',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy
          }
        ]
      }
    ]
  }
};

export default nextConfig;
