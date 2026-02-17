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
  // Exclude large data files from serverless function bundles
  outputFileTracingExcludes: {
    "*": [
      "./data/**",
    ],
  },
};

export default nextConfig;
