import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fontless } from "fontless";
import { Features } from "lightningcss";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { z } from "zod";

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
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host:
          process.env.URL !== undefined ? process.env.URL : "http://localhost/",
      },
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    fontless(),
    devtools(),
    nodePolyfills({
      // Polyfill `buffer` for `iconv-lite`. Global not necessary because
      // safer-buffer imports the package
      include: ["buffer"],
    }),
    ...(isAnalyzerEnabled
      ? [
          analyzer({
            analyzerPort: "auto",
          }),
        ]
      : []),
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
});

export default viteConfig;
