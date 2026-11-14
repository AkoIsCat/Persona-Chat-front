/// <reference lib="esnext" />
/// <reference lib="webworker" />

import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const DAY_SECONDS = 24 * 60 * 60;

function isSensitiveRequest(url: URL, request: Request) {
  return url.pathname.startsWith("/api") || url.pathname.startsWith("/uploads") || request.headers.has("authorization");
}

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ url, request }) => isSensitiveRequest(url, request),
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ url, request, sameOrigin }) =>
      sameOrigin &&
      !isSensitiveRequest(url, request) &&
      (request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "font" ||
        request.destination === "image" ||
        url.pathname.startsWith("/_next/static") ||
        url.pathname.startsWith("/icons/")),
    handler: new CacheFirst({
      cacheName: "static-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 30 * DAY_SECONDS,
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
  {
    matcher: ({ url, request, sameOrigin }) =>
      sameOrigin &&
      !isSensitiveRequest(url, request) &&
      (request.mode === "navigate" || request.headers.get("RSC") === "1"),
    handler: new NetworkFirst({
      cacheName: "app-shell",
      networkTimeoutSeconds: 3,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: DAY_SECONDS,
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
