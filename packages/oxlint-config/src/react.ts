import { defineConfig } from "oxlint";

import baseConfig from "@exifi/oxlint-config";

const reactConfig = defineConfig({
  extends: [baseConfig],
  plugins: ["react"],
  jsPlugins: [
    "@tanstack/eslint-plugin-query",
    "@tanstack/eslint-plugin-router",
  ],
  ignorePatterns: ["src/generated", "dist"],
  rules: {
    /**
     * Not necessary, since using JSX runtime
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope}
     */
    "react/react-in-jsx-scope": "off",

    // @tanstack/eslint-plugin-query.configs["flat/recommended"]
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/no-rest-destructuring": "warn",
    "@tanstack/query/stable-query-client": "error",
    "@tanstack/query/no-unstable-deps": "error",
    "@tanstack/query/infinite-query-property-order": "error",
    "@tanstack/query/no-void-query-fn": "error",
    "@tanstack/query/mutation-property-order": "error",

    // @tanstack/eslint-plugin-router.configs["flat/recommended"]
    "@tanstack/router/create-route-property-order": "warn",
    "@tanstack/router/route-param-names": "error",
  },
  settings: {
    react: {
      version: "19.2.8",
    },
  },
});

export default reactConfig;
