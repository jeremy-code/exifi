import { zValidator } from "@hono/zod-validator";
import { fileTypeFromBlob } from "file-type";
import type { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { ExifData } from "libexif-wasm";
import * as z from "zod";

import { serializeExifData } from "@exifi/core/exif/utils";
import { getExifData } from "@exifi/core/exif/utils/getExifData";
import {
  heic_get_exif_data,
  png_get_exif_data,
  webp_get_exif_data,
} from "@exifi/image-utils";

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

      if (format === "json") {
        const exifData = await getExifData(file);
        const exifDataObject = serializeExifData(exifData);
        exifData.free();
        return context.json(exifDataObject);
      } else if (format === "raw") {
        let exifDataBytes: Uint8Array | undefined;
        const fileBytes = await file.bytes();

        if (fileType.mime === "image/jpeg") {
          const exifData = ExifData.newFromData(fileBytes);
          exifDataBytes = exifData.saveData();
          exifData.free();
        } else {
          exifDataBytes =
            fileType.mime === "image/png"
              ? png_get_exif_data(fileBytes)
              : fileType.mime === "image/webp"
                ? webp_get_exif_data(fileBytes)
                : fileType.mime === "image/heif" ||
                    fileType.mime === "image/heic" ||
                    fileType.mime === "image/avif"
                  ? heic_get_exif_data(fileBytes)
                  : undefined;
        }

        if (exifDataBytes !== undefined) {
          return context.body(
            // Remove Exif header
            exifDataBytes.slice("Exif\0\0".length),
            200,
            { "Content-Type": "application/octet-stream" },
          );
        }
        return context.body(null, 204, {
          application: "application/octet-stream",
        });
      }

      return context.json({ error: "Internal server error" }, 500);
    },
  );
};

export { setupExifRoutes };
