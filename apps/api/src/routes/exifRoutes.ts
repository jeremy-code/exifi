import { zValidator } from "@hono/zod-validator";
import { fileTypeFromBlob } from "file-type";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { ExifIfd } from "libexif-wasm";
import * as z from "zod";

import { serializeExifData } from "@exifi/core/exif/utils";
import { getExifData } from "@exifi/core/exif/utils/getExifData";

import type { AppEnv } from "../interfaces/api";

const setupExifRoutes = (app: Hono<AppEnv>): void => {
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

  exifRoutes.post(
    "/",
    zValidator(
      "query",
      z.strictObject({
        format: z.enum(["json", "raw"]).default("json"),
      }),
    ),
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
              "Content-Type": "application/octet-stream",
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

  exifRoutes.post("/thumbnail", async (context) => {
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
      return context.json(
        { error: "Unsupported media type" },
        415 /* Unsupported Media Type */,
      );
    }

    if (exifData.data.length === 0) {
      exifData.free();
      return context.body(null, 204 /* No Content */, {
        "Content-Type": "application/octet-stream",
      });
    }
    const thumbnail = exifData.data.slice();
    exifData.free();

    return context.body(thumbnail, 200, {
      "Content-Type": "image/jpeg",
    });
  });

  exifRoutes.post("/makernote", async (context) => {
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
      return context.json(
        { error: "Unsupported media type" },
        415 /* Unsupported Media Type */,
      );
    }

    const makerNoteEntry = exifData.ifd[ExifIfd.EXIF].getEntry("MAKER_NOTE");

    if (makerNoteEntry?.data === undefined) {
      exifData.free();
      return context.body(null, 204 /* No Content */, {
        "Content-Type": "application/octet-stream",
      });
    }

    const makerNoteData = makerNoteEntry.data.slice();
    exifData.free();

    return context.body(makerNoteData, 200, {
      "Content-Type": "application/octet-stream",
    });
  });

  app.route("/exif", exifRoutes);
};

export { setupExifRoutes };
