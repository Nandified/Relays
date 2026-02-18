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
   * NOTE:
   * We intentionally DO NOT exclude ./data/** from output file tracing.
   * The /api/professionals endpoint reads normalized CSVs from ./data at runtime
   * (for licensed professional search + suggestions). If these files are excluded,
   * search returns 0 results in production.
   */
};

export default nextConfig;
