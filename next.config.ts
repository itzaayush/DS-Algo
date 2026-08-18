import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // three.js ships untranspiled ESM add-ons used by R3F/drei.
  transpilePackages: ["three"],
  experimental: {
    // Keep heavy 3D/visualization libs efficiently imported.
    optimizePackageImports: ["lucide-react", "@react-three/drei", "d3"],
  },
};

export default nextConfig;
