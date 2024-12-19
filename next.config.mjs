/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint for builds
  },
  experimental: {
    missingSuspenseWithCSRBailout: false, // Disable the warning for useSearchParams
    ignorePrerenderErrors: true, // Disable prerender errors
  },
};

export default nextConfig;
