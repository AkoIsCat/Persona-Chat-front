import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision: "1" }],
  globPublicPatterns: ["icons/**/*"],
  disable: process.env.NODE_ENV === "development",
});

const backendProxyTarget = process.env.API_PROXY_TARGET?.trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    proxyTimeout: 300_000,
  },
  async rewrites() {
    if (!backendProxyTarget) {
      return [];
    }

    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendProxyTarget}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendProxyTarget}/uploads/:path*`,
      },
    ];
  },
};

export default withSerwist(nextConfig);
