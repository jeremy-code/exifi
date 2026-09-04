import { ExifData } from "libexif-wasm";
import { describe, test as baseTest, expect } from "vitest";

import { getFixture } from "@exifi/test-fixtures";

import { serializeExifData } from "./serializeExifData";

const test = baseTest.extend("plainJpgWithExif", () =>
  getFixture("plain-jpg-with-exif"),
);

describe("serializeExifData", () => {
  test("serializes ExifData into ExifDataObject", ({ plainJpgWithExif }) => {
    const exifData = ExifData.newFromData(plainJpgWithExif.image);
    const exifDataObject = serializeExifData(exifData);
    expect(exifDataObject).toStrictEqual(plainJpgWithExif.json);
    exifData.free();
  });
});
