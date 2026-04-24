import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fontless } from "fontless";
import { Features } from "lightningcss";
import { defineConfig } from "vite";

import { dependencies } from "./package.json";

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
      pages: [{ path: "/" }, { path: "/tags" }],
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    fontless(),
    devtools(),
  ],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().getTime()),
    __LIBEXIF_WASM_VERSION__: JSON.stringify(dependencies["libexif-wasm"]),
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
