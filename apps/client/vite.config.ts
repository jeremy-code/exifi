import {
  createApi,
  createContext,
  dev as serwistDev,
  main as serwistMain,
  type PluginOptions,
  type SerwistViteApi,
  type SerwistViteContext,
} from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fontless } from "fontless";
import { Features } from "lightningcss";
import { defineConfig, type Plugin } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { z } from "zod";

const serwistBuild = (ctx: SerwistViteContext, api: SerwistViteApi): Plugin => {
  return {
    name: "@serwist/vite:build",
    enforce: "post",
    apply: "build",
    // Only run in client environment
    applyToEnvironment(environment) {
      return environment.name === "client";
    },
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.options.disable) {
          await api.generateSW();
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};

const serwist = (userOptions: PluginOptions): Plugin[] => {
  const ctx = createContext(userOptions, undefined);
  const api = createApi(ctx);
  return [serwistMain(ctx, api), serwistBuild(ctx, api), serwistDev(ctx, api)];
};

const isAnalyzerEnabled =
  process.env.ANALYZE !== undefined &&
  z.stringbool().parse(process.env.ANALYZE);

const viteConfig = defineConfig({
  plugins: [
    tanstackStart({
      router: {
        generatedRouteTree: "generated/routeTree.gen.ts",
      },
      // https://github.com/TanStack/router/discussions/3394#discussioncomment-16523892
      prerender: {
        enabled: true,
        crawlLinks: false,
      },
      sitemap: {
        enabled: true,
        host:
          process.env.URL !== undefined
            ? process.env.URL
            : "http://localhost:4173/",
      },
    }),
    react({ compiler: true }),
    tailwindcss({ optimize: { minify: true } }),
    fontless(),
    devtools(),
    nodePolyfills({
      // Polyfill `buffer` for `iconv-lite`. Global not necessary because
      // safer-buffer imports the package
      include: ["buffer"],
      globals: {
        process: false,
      },
    }),
    serwist({
      swSrc: "src/sw.ts",
      // Otherwise, it attempts to to output it in dist/server/sw.js
      swDest: new URL("dist/client/sw.js", import.meta.url).pathname,
      swUrl: "/sw.js",
      globDirectory: "dist/client",
      globPatterns: ["**/*.{js,css,html,png,svg,json,ico,woff2,wasm}"],
      rollupFormat: "iife",
    }),
    ...(isAnalyzerEnabled ? [analyzer({ analyzerPort: "auto" })] : []),
  ],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().getTime()),
    __LIBEXIF_WASM_VERSION__: JSON.stringify(
      (await import("libexif-wasm/package.json", { with: { type: "json" } }))
        .version,
    ),
    "import.meta.env.COMMIT_REF": JSON.stringify(process.env.COMMIT_REF),
    "import.meta.env.URL": JSON.stringify(process.env.URL),
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  build: {
    cssMinify: "lightningcss",
    license: true,
  },
  /**
   * Otherwise, Vite errors `[commonjs--resolver] Module format "iife"
   * does not support top-level await. Use the "es" or "system" output formats
   * rather.` while building from libexif-wasm/dist/output/libexif.js
   **/
  worker: { format: "es" },
  optimizeDeps: {
    include: ["@serwist/window"],
  },
});

export default viteConfig;
