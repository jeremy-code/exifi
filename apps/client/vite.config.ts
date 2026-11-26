import { paraglideVitePlugin } from "@inlang/paraglide-js";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { serwist } from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fontless } from "fontless";
import { Features } from "lightningcss";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import * as z from "zod";

import inlangSettings from "./project.inlang/settings.json" with { type: "json" };

const isAnalyzerEnabled = z
  .stringbool()
  .default(false)
  .parse(process.env.ANALYZE);

const url = z
  .string()
  .default(
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "http://localhost:4173",
  )
  .parse(process.env.URL);

const localesWithoutBaseLocale = inlangSettings.locales.filter(
  (locale) => locale !== inlangSettings.baseLocale,
);

const viteConfig = defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["url", "baseLocale"],
      isServer: "import.meta.env.SSR",
      emitTsDeclarations: true,
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ...localesWithoutBaseLocale.map<[string, string]>((locale) => [
              locale,
              `/${locale}/:path(.*)?`,
            ]),
            [inlangSettings.baseLocale, "/:path(.*)?"],
          ],
        },
      ],
      lazyUrlPatternPolyfill: true,
    }),
    tanstackStart({
      router: {
        generatedRouteTree: "generated/routeTree.gen.ts",
      },
      // https://github.com/TanStack/router/discussions/3394#discussioncomment-16523892
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoSubfolderIndex: true,
      },
      pages: [
        { path: "/404", sitemap: { exclude: true } },
        ...localesWithoutBaseLocale.flatMap((locale) =>
          ["/", "/editor", "/viewer", "/status", "/tags", "/404"].map(
            (path) => ({
              path: `/${locale}${path}`,
              sitemap: { exclude: path === "/404" },
            }),
          ),
        ),
      ],
      sitemap: {
        enabled: true,
        host: url,
      },
    }),
    react({ compiler: true }),
    tailwindcss({ optimize: { minify: true } }),
    optimizeLocales.vite({
      locales: ["en-US", "de-DE", "es-ES", "fr-FR", "ja-JP"],
    }),
    fontless(),
    devtools(),
    serwist({
      // See WorkerGlobalScope.__SW_MANIFEST in src/sw.ts
      injectionPoint: "self.__SW_MANIFEST",
      swSrc: "src/sw.ts",
      // Otherwise, it attempts to to output it in dist/server/sw.js
      swDest: new URL("dist/client/sw.js", import.meta.url).pathname,
      swUrl: "/sw.js",
      globDirectory: "dist/client",
      globPatterns: ["**/*.{js,css,html,png,svg,json,md,txt,ico,woff2,wasm}"],
      rollupFormat: "es",
      type: "module",
    }),
    ...(isAnalyzerEnabled ? [analyzer({ analyzerPort: "auto" })] : []),
  ],
  define: {
    __BUILD_TIMESTAMP__: Date.now(),
    __LIBEXIF_WASM_VERSION__: JSON.stringify(
      (await import("libexif-wasm/package.json", { with: { type: "json" } }))
        .version,
    ),
    "import.meta.env.COMMIT_REF": JSON.stringify(
      process.env.COMMIT_REF ?? null,
    ),
    "import.meta.env.URL": JSON.stringify(url),
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  build: {
    target: "baseline-widely-available",
    cssCodeSplit: true,
    cssMinify: "lightningcss",
    minify: "oxc",
    rolldownOptions: {
      transform: {
        inject: {
          Temporal: ["temporal-polyfill", "Temporal"],
        },
      },
    },
    license: { fileName: "license.md" },
  },
  /**
   * Otherwise, Vite errors `[commonjs--resolver] Module format "iife"
   * does not support top-level await. Use the "es" or "system" output formats
   * rather.` while building from libexif-wasm/dist/output/libexif.js
   **/
  worker: { format: "es" },
  optimizeDeps: {
    include: [
      // virtual:serwist imports "@serwist/window"
      "@serwist/window",
    ],
  },
});

export default viteConfig;
