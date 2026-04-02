import {
  ExifContent,
  ExifData,
  ExifEntry,
  exifFormatGetSize,
} from "libexif-wasm";
import { describe, expect, it } from "vitest";

import { Rational } from "#lib/math/Rational";

import { getEntryValue } from "./getEntryValue";

const RATIONAL_SIZE = exifFormatGetSize("RATIONAL");

const RATIONALS_TABLE = [
  {
    data: new Uint8Array([
      0, 0, 0, 33, 0, 0, 0, 1, 0, 0, 0, 45, 0, 0, 0, 1, 0, 0, 15, 175, 0, 0, 0,
      100,
    ]),
    byteOrder: "MOTOROLA",
    expected: [
      new Rational(33, 1),
      new Rational(45, 1),
      new Rational(4015, 100),
    ],
  },
  {
    data: new Uint8Array([
      0, 0, 0, 117, 0, 0, 0, 1, 0, 0, 0, 58, 0, 0, 0, 1, 0, 0, 4, 1, 0, 0, 0,
      200,
    ]),
    byteOrder: "MOTOROLA",
    expected: [
      new Rational(117, 1),
      new Rational(58, 1),
      new Rational(1025, 200),
    ],
  },

  {
    data: new Uint8Array([0, 0, 14, 159, 0, 0, 0, 200]),
    byteOrder: "MOTOROLA",
    expected: [new Rational(3743, 200)],
  },
  {
    data: new Uint8Array([
      26, 0, 0, 0, 1, 0, 0, 0, 70, 85, 5, 0, 16, 39, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0,
    ]),

    byteOrder: "INTEL",
    expected: [
      new Rational(26, 1),
      new Rational(349510, 10000),
      new Rational(0, 1),
    ],
  },
  {
    data: new Uint8Array([
      80, 0, 0, 0, 1, 0, 0, 0, 76, 213, 1, 0, 16, 39, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0,
    ]),
    byteOrder: "INTEL",
    expected: [
      new Rational(80, 1),
      new Rational(120140, 10000),
      new Rational(0, 1),
    ],
  },
  {
    data: new Uint8Array([
      33, 0, 0, 0, 1, 0, 0, 0, 44, 0, 0, 0, 1, 0, 0, 0, 170, 15, 0, 0, 100, 0,
      0, 0,
    ]),
    byteOrder: "INTEL",
    expected: [
      new Rational(33, 1),
      new Rational(44, 1),
      new Rational(4010, 100),
    ],
  },
  {
    data: new Uint8Array([
      117, 0, 0, 0, 1, 0, 0, 0, 58, 0, 0, 0, 1, 0, 0, 0, 59, 3, 0, 0, 100, 0, 0,
      0,
    ]),
    byteOrder: "INTEL",
    expected: [
      new Rational(117, 1),
      new Rational(58, 1),
      new Rational(827, 100),
    ],
  },
  {
    data: new Uint8Array([95, 7, 0, 0, 100, 0, 0, 0]),
    byteOrder: "INTEL",
    expected: [new Rational(1887, 100)],
  },
] as const;

describe("getEntryValue()", () => {
  describe("parses ExifEntry rationals", () => {
    it.each(RATIONALS_TABLE)(
      "should return the correct value for data $data and order $byteOrder",
      ({ data, byteOrder, expected }) => {
        const exifData = ExifData.new();
        exifData.setByteOrder(byteOrder);
        const exifContent = ExifContent.new();
        exifContent.parent = exifData;
        const exifEntry = ExifEntry.new();
        exifContent.addEntry(exifEntry);
        exifEntry.tag = "LATITUDE";
        exifEntry.format = "RATIONAL";
        exifEntry.data = data;
        exifEntry.components = data.length / RATIONAL_SIZE;
        exifEntry.size = data.length;

        expect(getEntryValue(exifEntry)).toStrictEqual(expected);

        exifEntry.free();
        exifContent.free();
        exifData.free();
      },
    );
  });
});
