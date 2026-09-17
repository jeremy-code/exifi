import { Hono } from "hono";
import { describeRoute, openAPIRouteHandler, resolver } from "hono-openapi";
import * as z from "zod";

import type { AppEnv } from "../interfaces/api";
import { exifRoutes } from "./exifRoutes";

const appRoutes = new Hono<AppEnv>();

appRoutes.get(
  "/health",
  describeRoute({
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(z.object({ status: z.literal("OK") })),
          },
        },
      },
    },
  }),
  async (context) => {
    return context.json({ status: "OK" }, 200);
  },
);

appRoutes.route("/exif", exifRoutes);

appRoutes.get(
  "/openapi.json",
  openAPIRouteHandler(appRoutes, {
    documentation: {
      info: { title: "exifi API", version: "0.0.0" },
      servers: [{ url: "https://api.exifi.io" }],
    },
  }),
);

export { appRoutes };
