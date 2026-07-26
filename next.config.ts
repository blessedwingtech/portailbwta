import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/uploads/:path*',
          destination: '/api/files/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
