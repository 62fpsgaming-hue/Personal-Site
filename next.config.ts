import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // Prevent clickjacking
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent MIME-type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Control referrer info sent with requests
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Restrict browser feature access
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Force HTTPS for 1 year, include subdomains
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    // Content Security Policy
    // Allows: same-origin scripts, Google Fonts, inline styles (needed for Next.js)
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev + GSAP
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "media-src 'self' blob: data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Optimize video caching
        source: "/black-hole-opt.(webm|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "video/webm; video/mp4",
          },
        ],
      },
    ];
  },
  // Compress responses
  compress: true,
  // Power by header disabled — don't leak Next.js version
  poweredByHeader: false,
  // Optimize images and media
  images: {
    remotePatterns: [],
  },
  // Enable SWR (Stale While Revalidate) for better caching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
