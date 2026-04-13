import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fontless } from "fontless";
import { Features } from "lightningcss";
import { defineConfig } from "vite";

const viteConfig = defineConfig({
  plugins: [
    tanstackStart({
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
  css: {
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  /**
   * Otherwise, Vite errors `[commonjs--resolver] Module format "iife"
   * does not support top-level await. Use the "es" or "system" output formats
   * rather.` while building from libexif-wasm/dist/output/libexif.js
   **/
  worker: { format: "es" },
});

export default viteConfig;
