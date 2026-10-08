import { ExifData } from "libexif-wasm";
import { describe, it, expect } from "vitest";

import { serializeExifData } from "@exifi/core/exif/utils";
import { getFixture } from "@exifi/test-fixtures";

import { exifDataObjectSchema } from "./exif";

describe("exifDataObjectSchema", () => {
  it("is valid schema", async () => {
    using exifData = ExifData.newFromData(
      await getFixture("plain-jpg-with-exif").then((fixture) => fixture.image),
    );

    expect(serializeExifData(exifData)).toEqual(
      expect.schemaMatching(exifDataObjectSchema),
    );
  });
});
