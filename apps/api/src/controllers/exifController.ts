import { fileTypeFromBlob } from "file-type";
import { describeRoute, resolver, validator } from "hono-openapi";
import { accepts } from "hono/accepts";
import { createFactory } from "hono/factory";
import { ExifIfd } from "libexif-wasm";
import * as z from "zod";

import { serializeExifData } from "@exifi/core/exif/utils";
import { getExifData } from "@exifi/core/exif/utils/getExifData";
import { exifDataObjectSchema } from "@exifi/schemas/exif";
import { mnoteDataEntrySchema } from "@exifi/schemas/libexif";
import { assertNever } from "@exifi/utils/assertNever";

import type { AppEnv } from "../interfaces/api";
import { appErrorSchema } from "../schemas/common";

const exifFactory = createFactory<AppEnv>();

const getExifDataHandlers = exifFactory.createHandlers(
  describeRoute({
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(exifDataObjectSchema),
          },
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      204: {
        description: "No content",
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      404: {
        description: "Not found",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
      415: {
        description: "Unsupported media type",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
      500: {
        description: "Internal server error",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
    },
  }),
  validator(
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
      return context.json({ error: "Unsupported media type" }, 415);
    }

    const file = new File([blob], `_.${fileType.ext}`, {
      type: fileType.mime,
    });
    const exifData = await getExifData(file);

    if (exifData === null) {
      return accept === "application/json"
        ? context.json({ error: "Not found" }, 404)
        : context.body(null, 204, {
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
    return context.json({ error: "Internal server error" }, 500);
  },
);

const getThumbnailHandlers = exifFactory.createHandlers(
  describeRoute({
    responses: {
      200: {
        description: "OK",
        content: {
          "image/jpeg": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      204: {
        description: "No content",
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      415: {
        description: "Unsupported media type",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
    },
  }),
  async (context) => {
    const blob = await context.req.blob();
    const { signal } = context.req.raw;

    const fileType = await fileTypeFromBlob(blob, { signal });

    if (fileType === undefined) {
      return context.json({ error: "Unsupported media type" }, 415);
    }

    const file = new File([blob], `_.${fileType.ext}`, {
      type: fileType.mime,
    });
    const exifData = await getExifData(file);

    if (exifData === null) {
      return context.json({ error: "Unsupported media type" }, 415);
    }

    if (exifData.data.length === 0) {
      exifData.free();
      return context.body(null, 204, {
        "Content-Type": "application/octet-stream",
      });
    }
    const thumbnail = exifData.data.slice();
    exifData.free();

    return context.body(thumbnail, 200, { "Content-Type": "image/jpeg" });
  },
);

const getMakerNoteDataHandlers = exifFactory.createHandlers(
  describeRoute({
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: resolver(z.array(mnoteDataEntrySchema)),
          },
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      204: {
        description: "No content",
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      },
      404: {
        description: "Not found",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
      415: {
        description: "Unsupported media type",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
      422: {
        description: "Unprocessable entity",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
      500: {
        description: "Internal server error",
        content: { "application/json": { schema: resolver(appErrorSchema) } },
      },
    },
  }),
  validator(
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
      return context.json({ error: "Unsupported media type" }, 415);
    }

    const file = new File([blob], `_.${fileType.ext}`, {
      type: fileType.mime,
    });
    const exifData = await getExifData(file);

    if (exifData === null) {
      return context.json({ error: "Unsupported media type" }, 415);
    }

    const makerNoteEntry = exifData.ifd[ExifIfd.EXIF].getEntry("MAKER_NOTE");

    if (makerNoteEntry === null || makerNoteEntry.size === 0) {
      exifData.free();

      return accept === "application/json"
        ? context.json({ error: "Not found" }, 404)
        : context.body(null, 204, {
            "Content-Type": "application/octet-stream",
          });
    }

    if (accept === "application/json") {
      const makerNoteJson = exifData.mnoteData?.data;
      exifData.free();

      return makerNoteJson !== undefined
        ? context.json(makerNoteJson)
        : context.json({ error: "Unprocessable entity" }, 422);
    } else if (accept === "application/octet-stream") {
      const makerNoteData = makerNoteEntry.data.slice();
      exifData.free();

      return context.body(makerNoteData, 200, {
        "Content-Type": "application/octet-stream",
      });
    }

    exifData.free();
    return context.json({ error: "Internal server error" }, 500);
  },
);

const exifController = {
  getExifData: getExifDataHandlers,
  getThumbnail: getThumbnailHandlers,
  getMakerNoteData: getMakerNoteDataHandlers,
};

export { exifController };
