import { fileURLToPath } from "node:url";

import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const WASM_FILE_SPECIFIERS = [
  "libexif-wasm/output/libexif.wasm",
  "@exifi/image-utils/imageUtils.wasm",
];

const viteConfig = defineConfig(({ command }) => {
  return {
    plugins: [
      nitro({
        replace: {
          /**
           * In production, during the build step, if a module is found in
           * node_modules, it becomes a chunk in "_libs/*"; otherwise, it is
           * considered a local file and bundled in "server/main.mjs." Hence,
           * due to pnpm workspaces, `@exifi/image-utils` resolving as
           * "../../packages/image-utils", it is considered a local file. Since
           * Node.js Emscripten modules find the Wasm binary relative to
           * `import.meta.url`, it will search for the Wasm binary in
           * `.netlify/functions-internal/server/imageUtils.wasm`. Rewrite the
           * import to the correct path
           *
           * @see {@link https://github.com/nitrojs/nitro/blob/4f90285191f80157d80c88c516b43aa1b744dc55/src/build/chunks.ts#L11}
           */
          ...(command === "build"
            ? { "imageUtils.wasm": "_libs/imageUtils.wasm" }
            : undefined),
        },
      }),
      /**
       * Since Vite is unable to figure out how to bundle Wasm files due to
       * `import.meta.url` only functioning correctly in client environments. Copy
       * them to the build directory manually
       *
       * @see {@link https://vite.dev/guide/assets#new-url-url-import-meta-url}
       */
      viteStaticCopy({
        targets: [
          {
            src: WASM_FILE_SPECIFIERS.map((wasmFileSpecifier) =>
              fileURLToPath(import.meta.resolve(wasmFileSpecifier)),
            ),
            // Move to Nitro external library chunk
            dest: "../.netlify/functions-internal/server/_libs",
            rename: { stripBase: true },
          },
        ],
        // Nitro environment is called nitro
        // https://github.com/nitrojs/nitro/blob/4f90285191f80157d80c88c516b43aa1b744dc55/src/build/vite/plugin.ts#L116
        environment: "nitro",
      }),
    ],
  };
});

export default viteConfig;
