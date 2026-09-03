/** @import { Configuration } from "lint-staged" */

/**
 * @satisfies {Configuration}
 */
const lintStagedConfig = {
  /**
   * Prevents turbo from seeing the filenames as tasks and instead passes them
   * as arguments.
   *
   * @see {@link https://turborepo.dev/docs/reference/run}
   */
  "*.{js,mjs,cjs,ts,tsx,mts,cts}": ["turbo run lint --", "oxfmt --check"],
  "*.{c,cpp,h}": "clang-format --Werror --dry-run --style=LLVM",
  "*.{json,md,yaml,yml}": "oxfmt --check",
};

export default lintStagedConfig;
