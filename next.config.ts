import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    LOCK_SECRET: process.env.LOCK_SECRET,
  },
};

export default nextConfig;
