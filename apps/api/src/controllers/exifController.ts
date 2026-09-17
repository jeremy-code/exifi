import { zValidator } from "@hono/zod-validator";
import { fileTypeFromBlob } from "file-type";
import { accepts } from "hono/accepts";
import { createFactory } from "hono/factory";
import { ExifIfd } from "libexif-wasm";
import * as z from "zod";

import { serializeExifData } from "@exifi/core/exif/utils";
import { getExifData } from "@exifi/core/exif/utils/getExifData";
import { assertNever } from "@exifi/utils/assertNever";

import type { AppEnv } from "../interfaces/api";

const exifFactory = createFactory<AppEnv>();

const getExifDataHandlers = exifFactory.createHandlers(
  zValidator(
    "query",
    z.strictObject({
      format: z.enum(["json", "raw"]).default("json"),
    }),
  ),
  async (context) => {
    const query = context.req.valid("query");
    const accept = accepts(context, {
      header: "Accept",
      supports: ["application/octet-stream", "application/json"],
      default:
        query.format === "json"
          ? "application/json"
          : query.format === "raw"
            ? "application/octet-stream"
            : assertNever(query.format),
    });

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
      return accept === "application/json"
        ? context.json({})
        : context.body(null, 204 /* No Content */, {
            "Content-Type": "application/octet-stream",
          });
    }

    if (accept === "application/json") {
      const exifDataObject = serializeExifData(exifData);
      exifData.free();
      return context.json(exifDataObject);
    } else if (accept === "application/octet-stream") {
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

const getThumbnailHandlers = exifFactory.createHandlers(async (context) => {
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

const getMakerNoteDataHandlers = exifFactory.createHandlers(
  zValidator(
    "query",
    z.strictObject({
      format: z.enum(["json", "raw"]).default("json"),
    }),
  ),
  async (context) => {
    const query = context.req.valid("query");
    const accept = accepts(context, {
      header: "Accept",
      supports: ["application/octet-stream", "application/json"],
      default:
        query.format === "json"
          ? "application/json"
          : query.format === "raw"
            ? "application/octet-stream"
            : assertNever(query.format),
    });

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

    if (makerNoteEntry === null || makerNoteEntry.size === 0) {
      exifData.free();

      context.status(204 /* No Content */);

      return accept === "application/json"
        ? context.json({})
        : context.body(null, undefined, {
            "Content-Type": "application/octet-stream",
          });
    }

    if (accept === "application/json") {
      const makerNoteJson = exifData.mnoteData?.data;
      exifData.free();

      return makerNoteJson !== undefined
        ? context.json(makerNoteJson)
        : context.json(
            { error: "Unprocessable entity" },
            422 /* Unprocessable entity */,
          );
    } else if (accept === "application/octet-stream") {
      const makerNoteData = makerNoteEntry.data.slice();
      exifData.free();

      return context.body(makerNoteData, 200, {
        "Content-Type": "application/octet-stream",
      });
    }

    console.log(accept);

    exifData.free();
    return context.json(
      { error: "Internal server error" },
      500 /* Internal Server Error */,
    );
  },
);

const exifController = {
  getExifData: getExifDataHandlers,
  getThumbnail: getThumbnailHandlers,
  getMakerNoteData: getMakerNoteDataHandlers,
};

export { exifController };
