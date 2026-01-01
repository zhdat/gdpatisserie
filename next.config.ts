import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Autoriser Cloudinary
      },
      {
        protocol: "https",
        hostname: "unsplash.com", // Autoriser Unsplash (pour tes seeds)
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Autoriser Unsplash (pour tes seeds)
      },
    ],
  },
};

export default nextConfig;
