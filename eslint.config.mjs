import { globalIgnores, defineConfig } from "eslint/config";

import baseConfig from "@exiftools/eslint-config";

export default defineConfig(
  globalIgnores([
    "apps/*",
    "packages/*",
    "!packages/eslint-config", // The ESLint configs themselves do not have a eslint.config.js
  ]),
  baseConfig,
);
