import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: process.env.GITHUB_ACTIONS ? "/avtorska-programa" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/avtorska-programa/" : "",
};

export default nextConfig;
