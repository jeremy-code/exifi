import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import pluginTailwindcss from "eslint-plugin-tailwindcss";
import { defineConfig } from "oxlint";

import baseConfig from "@exifi/oxlint-config";

const reactConfig = defineConfig({
  extends: [baseConfig],
  plugins: ["react", "react-perf"],
  jsPlugins: [
    "@tanstack/eslint-plugin-query",
    "@tanstack/eslint-plugin-router",
    "eslint-plugin-tailwindcss",
  ],
  env: {
    browser: true,
    builtin: true,
    es2024: true,
  },
  ignorePatterns: ["src/generated/"],
  rules: {
    ...pluginQuery.configs["flat/recommended"][0]?.rules,
    ...pluginRouter.configs["flat/recommended"][0]?.rules,
    ...[pluginTailwindcss.configs.recommended].flat()[0]?.rules,

    /**
     * Not necessary, since using JSX runtime
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope}
     */
    "react/react-in-jsx-scope": "off",

    /**
     * Use subpath imports for react-aria packages for smaller bundles
     *
     * @see {@link https://react-aria.adobe.com/releases/v1-17-0#using-sub-paths}
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports.html}
     */
    "no-restricted-imports": [
      "error",
      { paths: ["react-aria", "react-aria-components"] },
    ],
  },
  settings: {
    react: {
      version: "19.2.8",
    },
    tailwindcss: {
      cssConfigPath: "../../packages/ui/src/globals.css",
    },
  },
});

export default reactConfig;
