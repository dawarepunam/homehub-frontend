/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Production — Render backend (HTTPS)
      {
        protocol: "https",
        hostname: "homehub-backend-kpfk.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Fallback — allow any path from the production backend
      // (covers edge cases where Strapi serves from root)
      {
        protocol: "https",
        hostname: "homehub-backend-kpfk.onrender.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;