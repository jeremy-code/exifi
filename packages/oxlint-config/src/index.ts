import turbo from "eslint-plugin-turbo";
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
  jsPlugins: ["eslint-plugin-turbo"],
  rules: {
    // While in runtime, eslint-plugin-turbo always returns a single config,
    // TypeScript does not know that. Use `.flat()` to always get an array
    ...[turbo.configs?.["flat/recommended"]].flat()[0]?.rules,

    "import/namespace": "allow",

    /**
     * Prefer TypeScript's `noImplicitReturns`
     *
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-return.html}
     */
    "typescript/consistent-return": "off",
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
