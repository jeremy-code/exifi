import { describe, test as baseTest, expect } from "vitest";

import { getFixture } from "@exifi/test-fixtures";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

import { getExifData } from "./getExifData";

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // Exif\0\0

const test = baseTest
  .extend("plainJpgWithExif", () => getFixture("plain-jpg-with-exif"))
  .extend("plainPngWithExif", () => getFixture("plain-png-with-exif"));

describe("getExifData", () => {
  test("gets Exif data from JPG", async ({ plainJpgWithExif }) => {
    const file = new File([plainJpgWithExif.image], "plain-jpg-with-exif.jpg");

    const exifData = await getExifData(file);

    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainJpgWithExif.exifBytes!]),
    );

    exifData.free();
  });

  test("gets Exif data from PNG", async ({ plainPngWithExif }) => {
    const file = new File([plainPngWithExif.image], "plain-png-with-exif.png");

    const exifData = await getExifData(file);

    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainPngWithExif.exifBytes!]),
    );

    exifData.free();
  });
});
