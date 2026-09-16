import type { Hono } from "hono";

import type { AppEnv } from "../interfaces/api";
import { setupExifRoutes } from "./exifRoutes";

const setupRoutes = (app: Hono<AppEnv>): void => {
  app.get("/health", async (context) => {
    return context.json({ status: "OK" });
  });

  setupExifRoutes(app);
};

export { setupRoutes };
