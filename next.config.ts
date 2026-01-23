import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Tell Next.js/Turbopack to load Prisma as a standard Node module
  serverExternalPackages: ["@prisma/client"],

  turbopack: {},

  // 3. Keep webpack for production builds/backwards compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
