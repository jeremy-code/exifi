import { defineConfig } from "oxlint";

import baseConfig from "@exifi/oxlint-config";

export default defineConfig({
  extends: [baseConfig],
  options: {
    reportUnusedDisableDirectives: "warn",
    typeAware: true,
    typeCheck: true,
  },
});
