import { describe, it, expect } from "vitest";

import { EXIF_HEADER, JpegMarker, MARKER_FIRST_BYTE } from "./constants";
import { writeExifData } from "./index";
import { createSegment } from "./jpeg/createSegment";
import { concatUint8Arrays } from "./utils/concatUint8Arrays";

const SOI = new Uint8Array([MARKER_FIRST_BYTE, JpegMarker.SOI]);
const EOI = new Uint8Array([MARKER_FIRST_BYTE, JpegMarker.EOI]);
const VALID_EXIF = concatUint8Arrays([
  EXIF_HEADER,
  new Uint8Array([
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00,
  ]),
]);

describe("writeExifData()", () => {
  it("throws if image does not start with SOI", () => {
    const image = new Uint8Array([0, 0, 0]);

    expect(() => writeExifData(image, VALID_EXIF)).toThrow();
  });

  it("throws if exif header is invalid", () => {
    const image = concatUint8Arrays([SOI, EOI]);
    const invalidExif = new Uint8Array([1, 2, 3]);

    expect(() => writeExifData(image, invalidExif)).toThrow();
  });

  it("inserts EXIF after APP0", () => {
    const app0 = createSegment(JpegMarker.APP0, new Uint8Array([1, 2]));
    const image = concatUint8Arrays([SOI, app0, EOI]);
    const result = writeExifData(image, VALID_EXIF);

    expect(result).toStrictEqual(
      concatUint8Arrays([
        SOI,
        app0,
        createSegment(JpegMarker.APP1, VALID_EXIF),
        EOI,
      ]),
    );
  });

  it("replaces existing EXIF segment", () => {
    const image = concatUint8Arrays([
      SOI,
      createSegment(JpegMarker.APP1, VALID_EXIF),
      EOI,
    ]);
    const newExifSegment = new Uint8Array([...VALID_EXIF, 9, 9]);
    const result = writeExifData(image, newExifSegment);

    expect(result).toStrictEqual(
      concatUint8Arrays([
        SOI,
        createSegment(JpegMarker.APP1, newExifSegment),
        EOI,
      ]),
    );
  });

  it("inserts after last APP1 if APP1 exists but not EXIF", () => {
    const app1 = createSegment(JpegMarker.APP1, new Uint8Array([9, 9, 9]));
    const image = concatUint8Arrays([SOI, app1, EOI]);
    const result = writeExifData(image, VALID_EXIF);

    expect(result).toStrictEqual(
      concatUint8Arrays([
        SOI,
        app1,
        createSegment(JpegMarker.APP1, VALID_EXIF),
        EOI,
      ]),
    );
  });

  it("inserts after SOI if no APP segments exist", () => {
    const image = concatUint8Arrays([SOI, EOI]);
    const result = writeExifData(image, VALID_EXIF);

    expect(result).toStrictEqual(
      concatUint8Arrays([SOI, createSegment(JpegMarker.APP1, VALID_EXIF), EOI]),
    );
  });
});
