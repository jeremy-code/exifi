import { zValidator } from "@hono/zod-validator";
import { fileTypeFromBlob } from "file-type";
import type { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import * as z from "zod";

import { serializeExifData } from "@exifi/core/exif/utils";
import { getExifData } from "@exifi/core/exif/utils/getExifData";

import type { AppEnv } from "../interfaces/api";

const setupExifRoutes = (app: Hono<AppEnv>): void => {
  app.post(
    "/exif",
    zValidator(
      "query",
      z.strictObject({
        format: z.enum(["json", "raw"]).default("json"),
      }),
    ),
    bodyLimit({
      maxSize: 10 * 1024 * 1024, // 10 MiB
      onError: (context) => {
        return context.json(
          { error: "Content too large" },
          413 /* Content Too Large */,
        );
      },
    }),
    async (context) => {
      const { format } = context.req.valid("query");
      const blob = await context.req.blob();

      const fileType = await fileTypeFromBlob(blob, {
        signal: context.req.raw.signal,
      });

      if (fileType === undefined) {
        return context.json(
          { error: "Unsupported media type" },
          415 /* Unsupported Media Type */,
        );
      }

      const file = new File([blob], `_.${fileType.ext}`, {
        type: fileType.mime,
      });
      const exifData = await getExifData(file);

      if (exifData === null) {
        return format === "json"
          ? context.json({})
          : context.body(null, 204 /* No Content */, {
              application: "application/octet-stream",
            });
      }

      if (format === "json") {
        const exifDataObject = serializeExifData(exifData);
        exifData.free();
        return context.json(exifDataObject);
      } else if (format === "raw") {
        const exifDataBytes = exifData.saveData();
        exifData.free();
        return context.body(
          // Remove Exif header
          exifDataBytes.slice("Exif\0\0".length),
          200,
          { "Content-Type": "application/octet-stream" },
        );
      }

      exifData.free();
      return context.json(
        { error: "Internal server error" },
        500 /* Internal Server Error */,
      );
    },
  );
};

export { setupExifRoutes };
