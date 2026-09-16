import { defineConfig } from "nitro";

// https://nitro.build/config
const nitroConfig = defineConfig({
  /* General */
  preset: "netlify",
  compatibilityDate: "2026-09-15",

  /* Dev */
  devServer: {
    port: 3001,
  },

  /* Routing */
  serverEntry: "./src/server.ts",

  /* Build */
  builder: "vite",
  minify: true,
  // It is false by default but do NOT set to true due to the Wasm handling in
  // vite.config.ts
  inlineDynamicImports: false,
  node: true,
});

export default nitroConfig;
