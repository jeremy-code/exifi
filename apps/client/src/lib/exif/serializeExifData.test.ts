import { ExifData } from "libexif-wasm";
import { describe, it, expect } from "vitest";

import { MOCK_EXIF_DATA_OBJECT } from "#__mocks__/mockExifDataObjects";
import { MOCK_JPEG_EXIF_IMAGE_1 } from "#__mocks__/mockImages";

import { serializeExifData } from "./serializeExifData";

describe("serializeExifData", () => {
  it("serializes ExifData into ExifDataObject", () => {
    const buffer = MOCK_JPEG_EXIF_IMAGE_1.buffer;
    const exifData = ExifData.from(buffer);
    const exifDataObject = serializeExifData(exifData);
    expect(exifDataObject).toStrictEqual(MOCK_EXIF_DATA_OBJECT);
    exifData.free();
  });
});
