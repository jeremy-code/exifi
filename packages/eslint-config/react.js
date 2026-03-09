import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import eslintReact from "@eslint-react/eslint-plugin";
import globals from "globals";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";

import { baseConfig } from "./index.js";
import disables from "./disables.js";

export const reactConfig = defineConfig(
  globalIgnores(["dist"]),
  baseConfig,
  eslintReact.configs["recommended-type-checked"],
  reactCompiler.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  {
    name: "@exiftools/eslint-config/react.js",
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
      },
    },
  },
);

export default reactConfig.concat(disables);
