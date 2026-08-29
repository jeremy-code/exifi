import { ExifData } from "libexif-wasm";
import { describe, test, expect } from "vitest";

import { serializeExifData } from "./serializeExifData";
import { EXIF_DATA_OBJECT } from "../../__fixtures__/exifDataObject";
import { JPEG_EXIF_IMAGE_1 } from "../../__fixtures__/image";

describe("serializeExifData", () => {
  test("serializes ExifData into ExifDataObject", () => {
    const exifData = ExifData.from(JPEG_EXIF_IMAGE_1.buffer);
    const exifDataObject = serializeExifData(exifData);
    expect(exifDataObject).toStrictEqual(EXIF_DATA_OBJECT);
    exifData.free();
  });
});
