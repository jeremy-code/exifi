import { defineConfig } from "oxlint";

const baseConfig = defineConfig({
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  plugins: ["eslint", "typescript", "import", "promise", "vitest"],
  jsPlugins: ["eslint-plugin-turbo"],
  rules: {
    // eslint-plugin-turbo.configs["flat/recommended"]
    "turbo/no-undeclared-env-vars": "error",

    // TODO: Rules that seemingly conflict with previous ESLint config. Will
    // fix/adjust as needed later
    "eslint/no-shadow": "off",
    "typescript/consistent-return": "off",
    "typescript/no-unsafe-type-assertion": "off",

    /**
     * I intend to use TypeScript enums like "a namespaced bag of values"
     *
     * @see {@link https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-enum-comparison.html}
     */
    "typescript/no-unsafe-enum-comparison": "off",
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
