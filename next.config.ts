import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/privacy-policy-generator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
