import turbo from "eslint-plugin-turbo";
import pluginZod from "eslint-plugin-zod";
import { defineConfig } from "oxlint";

const baseConfig = defineConfig({
  // https://oxc.rs/docs/guide/usage/linter/config.html#enable-groups-of-rules-with-categories
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  env: {
    builtin: true,
    es2024: true,
  },
  plugins: [
    "eslint",
    "typescript",
    "unicorn",
    "oxc",
    "import",
    "jsdoc",
    "node",
    "promise",
    "vitest",
  ],
  jsPlugins: ["eslint-plugin-turbo", "eslint-plugin-zod"],
  rules: {
    // While in runtime, eslint-plugin-turbo always returns a single config,
    // TypeScript does not know that. Use `.flat()` to always get an array
    ...[turbo.configs?.["flat/recommended"]].flat()[0]?.rules,
    ...pluginZod.configs.recommended.rules,

    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-exports.html}
     */
    "typescript/consistent-type-exports": "error",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-imports.html}
     */
    "typescript/consistent-type-imports": [
      "deny",
      { disallowTypeAnnotations: false },
    ],
    /**
     * Prefer TypeScript's `noImplicitReturns`
     *
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-return.html}
     */
    "typescript/consistent-return": "off",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/dot-notation.html}
     */
    "typescript/dot-notation": "warn",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-explicit-any.html}
     */
    "typescript/no-explicit-any": "warn",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-require-imports.html}
     */
    "typescript/no-require-imports": "error",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-function-type.html}
     */
    "typescript/no-unsafe-function-type": "error",
    /**
     * I intend to use TypeScript enums like "a namespaced bag of values"
     *
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-enum-comparison.html}
     */
    "typescript/no-unsafe-enum-comparison": "off",
    /**
     * I prefer to use type assertions when it is guaranteed in runtime to be a
     * specific type but TypeScript cannot infer that
     *
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-type-assertion}
     */
    "typescript/no-unsafe-type-assertion": "off",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/import/exports-last}
     */
    "import/exports-last": "deny",
    /**
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/import/group-exports}
     */
    "import/group-exports": "deny",
    /**
     * Otherwise, the rule falsely errors when extending `test`
     *
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-standalone-expect}
     */
    "vitest/no-standalone-expect": [
      "error",
      { additionalTestBlockFunctions: ["test"] },
    ],
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
});

export default baseConfig;
