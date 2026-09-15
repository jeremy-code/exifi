import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig } from "oxlint";

import baseConfig from "@exifi/oxlint-config";

const reactConfig = defineConfig({
  extends: [baseConfig],
  plugins: ["react"],
  jsPlugins: [
    "@tanstack/eslint-plugin-query",
    "@tanstack/eslint-plugin-router",
  ],
  env: {
    browser: true,
    builtin: true,
    es2024: true,
  },
  ignorePatterns: ["src/generated/"],
  rules: {
    /**
     * Not necessary, since using JSX runtime
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope}
     */
    "react/react-in-jsx-scope": "off",

    ...pluginQuery.configs["flat/recommended"][0]?.rules,
    ...pluginRouter.configs["flat/recommended"][0]?.rules,
  },
  settings: {
    react: {
      version: "19.2.8",
    },
  },
});

export default reactConfig;
