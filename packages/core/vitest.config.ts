import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    name: "@exifi/core/exif",
    clearMocks: true,
  },
});

export default vitestConfig;
