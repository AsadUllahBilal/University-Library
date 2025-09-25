import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["m.media-amazon.com"]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
