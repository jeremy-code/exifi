import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    projects: ["apps/*", "packages/*"],
    fsModuleCache: true,
  },
});

export default vitestConfig;
