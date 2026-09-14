/// <reference lib="webworker" />

import { defaultCache } from "@serwist/vite/worker";
import {
  ExpirationPlugin,
  Serwist,
  StaleWhileRevalidate,
  type PrecacheEntry,
  type SerwistGlobalConfig,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // https://serwist.pages.dev/docs/build/configuring/injection-point
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const runtimeCaching = [
  ...defaultCache,
  {
    matcher: /\.(?:wasm)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: "static-wasm-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
];

const serwist = new Serwist({
  // oxlint-disable-next-line no-underscore-dangle -- This is the convention
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  navigationPreload: true,
  clientsClaim: true,
  runtimeCaching,
  offlineAnalyticsConfig: false,
});

serwist.addEventListeners();
