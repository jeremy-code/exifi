import { ExifData } from "libexif-wasm";
import { describe, test as baseTest, expect } from "vitest";

import { getFixture } from "@exifi/test-fixtures";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

import { getExifData } from "./getExifData";
import { setExifData } from "./setExifData";

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // Exif\0\0

const test = baseTest
  .extend("plainJpg", () => getFixture("plain-jpg"))
  .extend("plainJpgWithExif", () => getFixture("plain-jpg-with-exif"))
  .extend("plainPng", () => getFixture("plain-png"))
  .extend("plainPngWithExif", () => getFixture("plain-png-with-exif"))
  .extend("plainWebp", () => getFixture("plain-webp"))
  .extend("plainWebpWithExif", () => getFixture("plain-webp-with-exif"));

describe("setExifData", () => {
  test("set Exif data for JPG", async ({ plainJpg, plainJpgWithExif }) => {
    const file = new File([plainJpg.image], "plain-jpg.jpg");
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainJpgWithExif.exifBytes!,
    ]);
    const exifData = ExifData.newFromData(exifBytesWithHeader);

    const newFile = await setExifData(file, exifData);

    expect(await newFile.bytes()).toStrictEqual(plainJpgWithExif.image);
    exifData.free();

    const newExifData = await getExifData(newFile);

    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
    newExifData.free();
  });

  test("set Exif data for PNG", async ({ plainPng, plainPngWithExif }) => {
    const file = new File([plainPng.image], "plain-png.png");
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainPngWithExif.exifBytes!,
    ]);
    const exifData = ExifData.newFromData(exifBytesWithHeader);

    const newFile = await setExifData(file, exifData);

    expect(await newFile.bytes()).toStrictEqual(plainPngWithExif.image);

    exifData.free();

    const newExifData = await getExifData(newFile);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
    newExifData.free();
  });

  test("set Exif data for Exif", async ({
    plainJpgWithExif,
    plainPngWithExif,
  }) => {
    const file = new File(
      [plainJpgWithExif.exifBytes!],
      "plain-jpeg-with-exif.exif",
    );
    const exifData = ExifData.newFromData(
      concatUint8Arrays([EXIF_HEADER, plainPngWithExif.exifBytes!]),
    );

    const newFile = await setExifData(file, exifData);
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainPngWithExif.exifBytes!,
    ]);

    expect(await newFile.bytes()).toStrictEqual(exifBytesWithHeader);

    exifData.free();

    const newExifData = await getExifData(newFile);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
    newExifData.free();
  });

  test("set Exif data for Webp", async ({ plainWebp, plainWebpWithExif }) => {
    const file = new File([plainWebp.image], "plain-webp-with-exif.webp");
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainWebpWithExif.exifBytes!,
    ]);
    const exifData = ExifData.newFromData(exifBytesWithHeader);

    const newFile = await setExifData(file, exifData);

    expect(await newFile.bytes()).toStrictEqual(plainWebpWithExif.image);

    exifData.free();

    const newExifData = await getExifData(newFile);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
    newExifData.free();
  });
});
