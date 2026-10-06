import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    projects: ["apps/*", "packages/*"],
    fsModuleCache: true,
    coverage: {
      include: ["{apps,packages}/*/src/*.{ts,tsx}"],
      exclude: ["packages/oxlint-config/src/*.ts"],
    },
  },
});

export default vitestConfig;
