import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { bodyLimit } from "hono/body-limit";

import { exifController } from "../controllers/exifController";
import type { AppEnv } from "../interfaces/api";
import { appErrorSchema } from "../schemas/common";

const exifRoutes = new Hono<AppEnv>();

exifRoutes.use(
  describeRoute({
    responses: {
      413: {
        description: "Content too large",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
    },
  }),
  bodyLimit({
    maxSize: 10 * 1024 * 1024, // 10 MiB
    onError: (context) => {
      return context.json({ error: "Content too large" }, 413);
    },
  }),
);

exifRoutes.post("/", ...exifController.getExifData);
exifRoutes.post("/thumbnail", ...exifController.getThumbnail);
exifRoutes.post("/makernote", ...exifController.getMakerNoteData);

export { exifRoutes };
