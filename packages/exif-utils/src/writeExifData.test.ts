import { describe, test as baseTest, expect } from "vitest";

import { getFixture } from "@exifi/test-fixtures";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

import { EXIF_HEADER, JpegMarker, MARKER_FIRST_BYTE } from "./constants";
import { createSegment } from "./jpeg/createSegment";
import { writeExifData } from "./writeExifData";

const SOI = new Uint8Array([MARKER_FIRST_BYTE, JpegMarker.SOI]);
const EOI = new Uint8Array([MARKER_FIRST_BYTE, JpegMarker.EOI]);

const test = baseTest
  .extend("plainJpg", () => getFixture("plain-jpg"))
  .extend("plainJpgWithExif", () => getFixture("plain-jpg-with-exif"));

describe("writeExifData()", () => {
  test("throws if image does not start with SOI", ({ plainJpgWithExif }) => {
    const image = new Uint8Array([0, 0, 0]);

    expect(() =>
      writeExifData(
        image,
        concatUint8Arrays([EXIF_HEADER, plainJpgWithExif.exifBytes!]),
      ),
    ).toThrow(
      "Invalid JPEG marker at offset 0. Marker does not start with 0xff",
    );
  });

  test("throws if exif header is invalid", () => {
    const image = concatUint8Arrays([SOI, EOI]);
    const invalidExif = new Uint8Array([1, 2, 3]);

    expect(() => writeExifData(image, invalidExif)).toThrow(
      "Invalid Exif data provided",
    );
  });

  test("inserts EXIF after APP0", ({ plainJpgWithExif }) => {
    const app0 = createSegment(JpegMarker.APP0, new Uint8Array([1, 2]));
    const image = concatUint8Arrays([SOI, app0, EOI]);
    const exifData = concatUint8Arrays([
      EXIF_HEADER,
      plainJpgWithExif.exifBytes!,
    ]);

    const result = writeExifData(image, exifData);

    expect(result).toStrictEqual(
      concatUint8Arrays([
        SOI,
        app0,
        createSegment(JpegMarker.APP1, exifData),
        EOI,
      ]),
    );
  });

  test("replaces existing EXIF segment", ({ plainJpgWithExif }) => {
    const exifData = concatUint8Arrays([
      EXIF_HEADER,
      plainJpgWithExif.exifBytes!,
    ]);
    const image = concatUint8Arrays([
      SOI,
      createSegment(JpegMarker.APP1, exifData),
      EOI,
    ]);
    const newExifSegment = new Uint8Array([...exifData, 9, 9]);
    const result = writeExifData(image, newExifSegment);

    expect(result).toStrictEqual(
      concatUint8Arrays([
        SOI,
        createSegment(JpegMarker.APP1, newExifSegment),
        EOI,
      ]),
    );
  });

  test("inserts after last APP1 if APP1 exists but not EXIF", ({
    plainJpgWithExif,
  }) => {
    const exifData = concatUint8Arrays([
      EXIF_HEADER,
      plainJpgWithExif.exifBytes!,
    ]);
    const app1 = createSegment(JpegMarker.APP1, new Uint8Array([9, 9, 9]));
    const image = concatUint8Arrays([SOI, app1, EOI]);
    const result = writeExifData(image, exifData);

    expect(result).toStrictEqual(
      concatUint8Arrays([
        SOI,
        app1,
        createSegment(JpegMarker.APP1, exifData),
        EOI,
      ]),
    );
  });

  test("inserts after SOI if no APP segments exist", ({ plainJpgWithExif }) => {
    const exifData = concatUint8Arrays([
      EXIF_HEADER,
      plainJpgWithExif.exifBytes!,
    ]);
    const image = concatUint8Arrays([SOI, EOI]);
    const result = writeExifData(image, exifData);

    expect(result).toStrictEqual(
      concatUint8Arrays([SOI, createSegment(JpegMarker.APP1, exifData), EOI]),
    );
  });

  test("correctly adds exif data to plain-jpg.jpg", ({
    plainJpg,
    plainJpgWithExif,
  }) => {
    expect(
      writeExifData(
        plainJpg.image,
        concatUint8Arrays([EXIF_HEADER, plainJpgWithExif.exifBytes!]),
      ),
    ).toStrictEqual(plainJpgWithExif.image);
  });
});
