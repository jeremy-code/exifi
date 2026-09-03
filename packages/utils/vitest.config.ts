import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    clearMocks: true,
  },
});

export default vitestConfig;
