import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "gdpatisserie.fr",
      },
      {
        protocol: "https",
        hostname: "www.gdpatisserie.fr",
      },
    ],
  },
};

export default nextConfig;
