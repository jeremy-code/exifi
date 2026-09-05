/** @import { UserConfig } from "@commitlint/types" */

import { RuleConfigSeverity } from "@commitlint/types";

/**
 * @satisfies {UserConfig}
 */
const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      // https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "scope-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "client",
        "core",
        "exif-utils",
        "oxlint-config",
        "test-fixtures",
        "tsconfig",
        "ui",
        "utils",
      ],
    ],
  },
};

export default commitlintConfig;
