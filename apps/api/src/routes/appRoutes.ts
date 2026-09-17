import { Hono } from "hono";

import type { AppEnv } from "../interfaces/api";
import { exifRoutes } from "./exifRoutes";

const appRoutes = new Hono<AppEnv>();

appRoutes.get("/health", async (context) => {
  return context.json({ status: "OK" });
});

appRoutes.route("/exif", exifRoutes);

export { appRoutes };
