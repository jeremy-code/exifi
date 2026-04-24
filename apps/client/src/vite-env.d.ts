/// <reference types="vite/client" />

declare const __LIBEXIF_WASM_VERSION__: string;
declare const __BUILD_TIMESTAMP__: number;

interface ImportMetaEnv {
  readonly URL: string;
  readonly COMMIT_REF: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
