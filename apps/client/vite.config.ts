/// <reference types="vitest" />
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    netlifyReactRouter({ edge: true }),
  ],
  esbuild: {
    supported: {
      "top-level-await": true, // https://emscripten.org/docs/tools_reference/settings_reference.html#modularize
    },
  },
  /**
   * Otherwise, Vite errors `[commonjs--resolver] Module format "iife"
   * does not support top-level await. Use the "es" or "system" output formats
   * rather.` while building from libexif-wasm/dist/output/libexif.js
   **/
  worker: { format: "es" },
  // Otherwise, "wasm streaming compile failed" error
  optimizeDeps: { exclude: ["libexif-wasm"] },
});
