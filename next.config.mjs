/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow randomuser.me avatars
    domains: ["randomuser.me"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
