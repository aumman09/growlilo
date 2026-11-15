/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["@growlilo/game-core"],
  poweredByHeader: false,
  reactStrictMode: true,
};
export default nextConfig;
