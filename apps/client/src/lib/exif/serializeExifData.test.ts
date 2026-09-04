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
    exifData.fix();
    const exifDataObject = serializeExifData(exifData);
    expect(exifDataObject).toStrictEqual(plainJpgWithExif.json);
    exifData.free();
  });
  test("serializes empty ExifData into ExifDataObject", () => {
    const exifData = ExifData.new();
    const exifDataObject = serializeExifData(exifData);
    expect(exifDataObject).toStrictEqual({
      data: [],
      ifd: {
        IFD_0: [],
        IFD_1: [],
        EXIF: [],
        GPS: [],
        INTEROPERABILITY: [],
      },
      dataType: "UNKNOWN",
      byteOrder: "MOTOROLA",
    });
    exifData.free();
  });
});
