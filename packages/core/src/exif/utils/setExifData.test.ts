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
  .extend("plainJpgWithExifXmpIim", () =>
    getFixture("plain-jpg-with-exif-xmp-iim"),
  )
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
    using exifData = ExifData.newFromData(exifBytesWithHeader);

    const newFile = await setExifData(file, exifData);

    expect.assert(newFile !== null);
    expect(await newFile.bytes()).toStrictEqual(plainJpgWithExif.image);

    using newExifData = await getExifData(newFile);

    expect.assert(newExifData !== null);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
  });

  test("set Exif data for JPG without removing other metadata", async ({
    plainJpgWithExifXmpIim,
  }) => {
    const file = new File(
      [plainJpgWithExifXmpIim.image],
      "plain-jpg-with-exif-xmp-iim.jpg",
    );
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainJpgWithExifXmpIim.exifBytes!,
    ]);
    using exifData = ExifData.newFromData(exifBytesWithHeader);
    const newFile = await setExifData(file, exifData);

    expect.assert(newFile !== null);
    expect(await newFile.bytes()).toStrictEqual(plainJpgWithExifXmpIim.image);
  });

  test("set Exif data for PNG", async ({ plainPng, plainPngWithExif }) => {
    const file = new File([plainPng.image], "plain-png.png");
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainPngWithExif.exifBytes!,
    ]);
    using exifData = ExifData.newFromData(exifBytesWithHeader);

    const newFile = await setExifData(file, exifData);

    expect.assert(newFile !== null);
    expect(await newFile?.bytes()).toStrictEqual(plainPngWithExif.image);

    using newExifData = await getExifData(newFile);

    expect.assert(newExifData !== null);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
  });

  test("set Exif data for Exif", async ({
    plainJpgWithExif,
    plainPngWithExif,
  }) => {
    const file = new File(
      [plainJpgWithExif.exifBytes!],
      "plain-jpeg-with-exif.exif",
    );
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainPngWithExif.exifBytes!,
    ]);
    using exifData = ExifData.newFromData(exifBytesWithHeader);
    const newFile = await setExifData(file, exifData);

    expect.assert(newFile !== null);
    expect(await newFile?.bytes()).toStrictEqual(plainPngWithExif.exifBytes!);

    using newExifData = await getExifData(newFile);
    expect.assert(newExifData !== null);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
  });

  test("set Exif data for WebP", async ({ plainWebp, plainWebpWithExif }) => {
    const file = new File([plainWebp.image], "plain-webp-with-exif.webp");
    const exifBytesWithHeader = concatUint8Arrays([
      EXIF_HEADER,
      plainWebpWithExif.exifBytes!,
    ]);
    using exifData = ExifData.newFromData(exifBytesWithHeader);

    const newFile = await setExifData(file, exifData);

    expect.assert(newFile !== null);
    expect(await newFile.bytes()).toStrictEqual(plainWebpWithExif.image);

    using newExifData = await getExifData(newFile);
    expect.assert(newExifData !== null);
    expect(newExifData.saveData()).toEqual(exifBytesWithHeader);
  });
});
