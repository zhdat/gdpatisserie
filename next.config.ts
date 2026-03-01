import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      // {
      //   protocol: "https",
      //   hostname: "gdpatisserie.fr", // Pour la prod
      // },
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
