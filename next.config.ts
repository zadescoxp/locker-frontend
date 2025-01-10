import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    LOCK_SECRET: process.env.LOCK_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vouz-files.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
