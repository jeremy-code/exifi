import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const JAVASCRIPT_GLOB_PATTERNS = ["**/*.{js,cjs,jsx,mjs}"];

/**
 * Since sometimes configuring typed rules later will re-enable them, disables
 * are given their ESLint config, so it can be re-used
 */
const disablesConfig = defineConfig({
  name: "@exiftools/eslint-config/disables.js",
  files: JAVASCRIPT_GLOB_PATTERNS,
  extends: [
    tseslint["configs"].disableTypeChecked,
    eslintReact.configs["disable-type-checked"],
  ],
});

export default disablesConfig;
