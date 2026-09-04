import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    name: "@exifi/utils",
    clearMocks: true,
  },
});

export default vitestConfig;
