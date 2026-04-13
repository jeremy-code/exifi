import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";

// https://vitest.dev/config/include.html#include
const TEST_GLOB_PATTERNS = ["**/*.{test,spec}.?(c|m)[jt]s?(x)"];

const testConfig = defineConfig({
  name: "@exiftools/eslint-config/test.js",
  extends: [vitest.configs.recommended],
  files: TEST_GLOB_PATTERNS,
  rules: {
    /**
     * @see {@link https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-importing-vitest-globals.md}
     */
    "vitest/prefer-importing-vitest-globals": "error",
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
});

export default testConfig;
