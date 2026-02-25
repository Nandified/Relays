import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google Place / Business photos (often returned by Outscraper)
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh4.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh6.googleusercontent.com", pathname: "/**" },

      // Google Street View thumbnail endpoint (also common in our enrichment)
      { protocol: "https", hostname: "streetviewpixels-pa.googleapis.com", pathname: "/**" },
    ],
  },
  /**
   * Keep local raw datasets out of the serverless bundle.
   * Production search now uses Supabase; bundling ./data/** will exceed Vercel limits.
   */
  outputFileTracingExcludes: {
    "*": ["./data/**"],
  },
};

export default nextConfig;
