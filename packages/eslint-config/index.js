import { defineConfig } from "@eslint/config-helpers";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslint from "@eslint/js";
import globals from "globals";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginImportX, { createNodeResolver } from "eslint-plugin-import-x";
import pluginPromise from "eslint-plugin-promise";
import turbo from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

import disables from "./disables.js";

export const baseConfig = defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  comments.recommended,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  pluginPromise.configs["flat/recommended"],
  turbo.configs["flat/recommended"],
  {
    name: "@exiftools/eslint-config/index.js",
    languageOptions: {
      parserOptions: {
        /**
         * Automatically load `tsconfig.json` files for typed linting rules
         *
         * @see {@link https://typescript-eslint.io/packages/parser/#projectservice}
         */
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node },
    },
    rules: {
      "import-x/newline-after-import": ["error", { considerComments: true }],
      /**
       * @see {@link https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md}
       */
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            { pattern: "#*", group: "internal" },
            {
              pattern: "react{,-dom{,/server,/client,/static}}",
              group: "builtin",
            },
          ],
          pathGroupsExcludedImportTypes: ["object"],
          distinctGroup: false,
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
    settings: {
      /**
       * @see {@link https://github.com/un-ts/eslint-plugin-import-x#import-xinternal-regex}
       */
      "import-x/internal-regex": "^@exiftools/",
      /**
       * @see {@link https://github.com/un-ts/eslint-plugin-import-x/tree/master/resolvers}
       */
      "import-x/resolver-next": [
        createTypeScriptImportResolver({ alwaysTryTypes: true }),
        createNodeResolver(),
      ],
    },
  },
);

export default baseConfig.concat(disables);
