import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";

import { exifController } from "../controllers/exifController";
import type { AppEnv } from "../interfaces/api";

const exifRoutes = new Hono<AppEnv>();

exifRoutes.use(
  bodyLimit({
    maxSize: 10 * 1024 * 1024, // 10 MiB
    onError: (context) => {
      return context.json(
        { error: "Content too large" },
        413 /* Content Too Large */,
      );
    },
  }),
);

exifRoutes.post("/", ...exifController.getExifData);
exifRoutes.post("/thumbnail", ...exifController.getThumbnail);
exifRoutes.post("/makernote", ...exifController.getMakerNoteData);

export { exifRoutes };
