import { defineConfig } from "@hey-api/openapi-ts";

const openApiConfig = defineConfig({
  input:
    "https://sparkfabrik.github.io/nominatim-openapi/nominatim.openapi.json",
  output: "src/generated/nominatim",
  plugins: ["@tanstack/react-query"],
});

export default openApiConfig;
