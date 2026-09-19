import { paraglideVitePlugin } from "@inlang/paraglide-js";
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
import { z } from "zod";

// https://github.com/serwist/serwist/blob/adf0d79ae8ba7d87cce2251ffc29526955511a2b/packages/vite/src/plugins/build.ts
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
        // ctx.viteConfig.build.ssr is always true
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

// https://github.com/serwist/serwist/blob/adf0d79ae8ba7d87cce2251ffc29526955511a2b/packages/vite/src/index.ts
const serwist = (userOptions: PluginOptions): Plugin[] => {
  const ctx = createContext(userOptions, undefined);
  const api = createApi(ctx);
  return [serwistMain(ctx, api), serwistBuild(ctx, api), serwistDev(ctx, api)];
};

const isAnalyzerEnabled =
  process.env.ANALYZE !== undefined &&
  z.stringbool().parse(process.env.ANALYZE);

const url = z
  .string()
  .default(
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "http://localhost:4173",
  )
  .parse(process.env.URL);

const viteConfig = defineConfig({
  plugins: [
    // https://paraglidejs.com/docs/build-tools/vite
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      emitTsDeclarations: true,
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["cookie", "baseLocale"],
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
      sitemap: {
        enabled: true,
        host: url,
      },
    }),
    react({ compiler: true }),
    tailwindcss({ optimize: { minify: true } }),
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
      globPatterns: ["**/*.{js,css,html,png,svg,json,xml,txt,ico,woff2,wasm}"],
      rollupFormat: "es",
      type: "module",
    }),
    ...(isAnalyzerEnabled ? [analyzer({ analyzerPort: "auto" })] : []),
  ],
  define: {
    __BUILD_TIMESTAMP__: new Date().getTime(),
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
    cssMinify: "lightningcss",
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
