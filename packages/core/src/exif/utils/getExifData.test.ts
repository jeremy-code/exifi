import { describe, test as baseTest, expect } from "vitest";

import { getFixture } from "@exifi/test-fixtures";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

import { getExifData } from "./getExifData";

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // Exif\0\0

const test = baseTest
  .extend("plainJpgWithExif", () => getFixture("plain-jpg-with-exif"))
  .extend("plainPngWithExif", () => getFixture("plain-png-with-exif"))
  .extend("plainWebpWithExif", () => getFixture("plain-webp-with-exif"))
  .extend("plainHeicWithExif", () => getFixture("plain-heic-with-exif"))
  .extend("plainAvifWithExif", () => getFixture("plain-avif-with-exif"));

describe("getExifData", () => {
  test("gets Exif data from JPG", async ({ plainJpgWithExif }) => {
    const file = new File([plainJpgWithExif.image], "plain-jpg-with-exif.jpg");

    using exifData = await getExifData(file);

    expect.assert(exifData !== null);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainJpgWithExif.exifBytes!]),
    );
  });

  test("gets Exif data from PNG", async ({ plainPngWithExif }) => {
    const file = new File([plainPngWithExif.image], "plain-png-with-exif.png");

    using exifData = await getExifData(file);

    expect.assert(exifData !== null);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainPngWithExif.exifBytes!]),
    );
  });

  test("gets Exif data from raw Exif", async ({ plainJpgWithExif }) => {
    const file = new File(
      [plainJpgWithExif.exifBytes!],
      "plain-jpg-with-exif.exif",
    );

    using exifData = await getExifData(file);

    expect.assert(exifData !== null);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainJpgWithExif.exifBytes!]),
    );
  });

  test("gets Exif data from WebP", async ({ plainWebpWithExif }) => {
    const file = new File(
      [plainWebpWithExif.image],
      "plain-webp-with-exif.webp",
    );

    using exifData = await getExifData(file);

    expect.assert(exifData !== null);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainWebpWithExif.exifBytes!]),
    );
  });

  test("gets Exif data from HEIC", async ({ plainHeicWithExif }) => {
    const file = new File(
      [plainHeicWithExif.image],
      "plain-heic-with-exif.heic",
    );

    using exifData = await getExifData(file);

    expect.assert(exifData !== null);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainHeicWithExif.exifBytes!]),
    );
  });

  test("gets Exif data from AVIF", async ({ plainAvifWithExif }) => {
    const file = new File(
      [plainAvifWithExif.image],
      "plain-avif-with-exif.avif",
    );

    using exifData = await getExifData(file);

    expect.assert(exifData !== null);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([EXIF_HEADER, plainAvifWithExif.exifBytes!]),
    );
  });
});
