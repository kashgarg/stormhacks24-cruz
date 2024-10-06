/** @type {import('next').NextConfig} */
const nextConfig = {};

import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  cacheOnFrontendNav: true,
  aggressiveFrontendNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default pwaConfig(nextConfig);
