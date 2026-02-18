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
   * The /api/professionals endpoint reads normalized CSVs from ./data at runtime
   * (for licensed professional search + suggestions). Next.js output tracing will
   * NOT reliably include dynamically-read files unless we explicitly include them.
   */
  outputFileTracingIncludes: {
    "*": ["./data/**"],
  },
};

export default nextConfig;
