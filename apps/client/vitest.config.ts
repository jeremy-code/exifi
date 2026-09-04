import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vite";
import { configDefaults, defineConfig } from "vitest/config";

import viteConfig from "./vite.config.js";

const vitestConfig = defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "./src/generated/**"],
    name: "@exifi/client",
    clearMocks: true,
    typecheck: {
      enabled: true,
    },
    browser: {
      enabled: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
