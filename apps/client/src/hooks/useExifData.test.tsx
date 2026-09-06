import { ExifData } from "libexif-wasm";
import { describe, expect, test as baseTest } from "vitest";
import { renderHook } from "vitest-browser-react";

import { AppProvider } from "#components/misc/AppProvider";
import { serializeExifData } from "@exifi/core/exif/utils/serializeExifData";
import { getFixture } from "@exifi/test-fixtures";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

import { useExifData } from "./useExifData";

const test = baseTest
  .extend("plainJpg", () => getFixture("plain-jpg"))
  .extend("plainJpgWithExif", () => getFixture("plain-jpg-with-exif"));

const renderUseExifData = (file: File) =>
  renderHook(
    // @ts-expect-error -- think the types are wrong
    useExifData,
    { initialProps: file, wrapper: AppProvider },
  );

describe("useExifData", () => {
  test("creates ExifData from exif data", async ({ plainJpgWithExif }) => {
    const exifDataFile = new File(
      ["Exif\0\0", plainJpgWithExif.exifBytes!.slice()],
      "plain-jpg-with-exif.exif",
    );

    const { result } = await renderUseExifData(exifDataFile);

    await expect.poll(() => result.current).not.toBeNull();
    const exifData = result.current;

    expect(exifData).toBeInstanceOf(ExifData);
    expect(exifData.saveData()).toStrictEqual(await exifDataFile.bytes());
    expect(serializeExifData(exifData)).toStrictEqual(plainJpgWithExif.json);

    result.current.free();
  });

  test("creates ExifData from jpeg image", async ({ plainJpg }) => {
    const exifDataFile = new File([plainJpg.image.slice()], "plain-jpg.jpeg");

    const { result } = await renderUseExifData(exifDataFile);
    await expect.poll(() => result.current).not.toBeNull();
    const exifData = result.current;

    expect(exifData).toBeInstanceOf(ExifData);

    // expect()
    expect(serializeExifData(exifData)).toStrictEqual({
      byteOrder: "MOTOROLA",
      data: [],
      dataType: "UNKNOWN",
      ifd: { EXIF: [], GPS: [], IFD_0: [], IFD_1: [], INTEROPERABILITY: [] },
    });

    exifData.free();
  });

  test("creates ExifData from jpeg image with exif data", async ({
    plainJpgWithExif,
  }) => {
    const exifDataFile = new File(
      [plainJpgWithExif.image],
      "plain-jpg-with-exif.jpg",
    );

    const { result } = await renderUseExifData(exifDataFile);
    await expect.poll(() => result.current).not.toBeNull();

    const exifData = result.current;

    expect(exifData).toBeInstanceOf(ExifData);
    expect(exifData.saveData()).toStrictEqual(
      concatUint8Arrays([
        new TextEncoder().encode("Exif\0\0"),
        plainJpgWithExif.exifBytes!,
      ]),
    );
    expect(serializeExifData(exifData)).toStrictEqual(plainJpgWithExif.json);

    exifData.free();
  });
});
