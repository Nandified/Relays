import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
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
