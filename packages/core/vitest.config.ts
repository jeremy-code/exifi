import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    name: "@exifi/core",
    clearMocks: true,
  },
});

export default vitestConfig;
