import eslintReact from "@eslint-react/eslint-plugin";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig, globalIgnores } from "eslint/config";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import disablesConfig from "./disables.js";
import baseConfig from "./index.js";

const reactConfig = defineConfig(
  // Ignore TanStack Router filesystem route tree
  globalIgnores(["dist", "src/routeTree.gen.ts"]),
  baseConfig,
  eslintReact.configs["recommended-type-checked"],
  pluginQuery.configs["flat/recommended"],
  reactCompiler["configs"].recommended,
  reactHooks.configs.flat["recommended-latest"],
  pluginRouter.configs["flat/recommended"],
  {
    name: "@exiftools/eslint-config/react.js",
    rules: {
      /**
       * Server actions must be async functions and may be passed to `action`
       * and `onSubmit` props, which return `void` and not `Promise<void>`. This
       * triggers `no-misused-promises`. However, making it synchronous throws
       * "Functions cannot be directly passed unless explicitly exposed with
       * 'use server'".
       *
       * @see {@link https://typescript-eslint.io/rules/no-misused-promises/#checksvoidreturn}
       * @see {@link https://react.dev/reference/rsc/server-actions}
       */
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      /**
       * @see {@link https://typescript-eslint.io/rules/only-throw-error/}
       * @see {@link https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router#typescript-eslint}
       */
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              package: "@tanstack/router-core",
              name: ["Redirect", "NotFoundError"],
            },
          ],
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
      },
    },
  },
  disablesConfig,
);

export default reactConfig;
