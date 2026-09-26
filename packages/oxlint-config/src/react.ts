import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import pluginZod from "eslint-plugin-zod";
import { defineConfig } from "oxlint";

import baseConfig from "@exifi/oxlint-config";

const reactConfig = defineConfig({
  extends: [baseConfig],
  plugins: ["react"],
  jsPlugins: [
    "@tanstack/eslint-plugin-query",
    "@tanstack/eslint-plugin-router",
    "oxlint-tailwindcss",
    "eslint-plugin-zod",
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
    ...pluginZod.configs.recommended.rules,

    // Correctness
    "tailwindcss/no-unknown-classes": "error",
    "tailwindcss/no-duplicate-classes": "error",
    "tailwindcss/no-conflicting-classes": "error",
    "tailwindcss/no-deprecated-classes": "error",
    "tailwindcss/no-unnecessary-whitespace": "error",

    /**
     * Not necessary, since using JSX runtime
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope}
     */
    "react/react-in-jsx-scope": "off",

    /**
     * In most instances, Zod string schemas do not need to be trimmed or not
     * trimming may be intended
     *
     * @see {@link https://github.com/marcalexiei/eslint-zod/blob/HEAD/plugins/eslint-plugin-zod/docs/rules/prefer-string-schema-with-trim.md}
     */
    "zod/prefer-string-schema-with-trim": "off",
  },
  settings: {
    react: {
      version: "19.2.8",
    },
    tailwindcss: {
      entryPoint: "packages/ui/src/globals.css",
    },
  },
});

export default reactConfig;
