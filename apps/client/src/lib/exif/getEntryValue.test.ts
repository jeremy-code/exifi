import {
  ExifContent,
  ExifData,
  ExifEntry,
  exifFormatGetSize,
} from "libexif-wasm";
import { describe, expect, it } from "vitest";

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
      { numerator: 33, denominator: 1 },
      { numerator: 45, denominator: 1 },
      { numerator: 4015, denominator: 100 },
    ],
  },
  {
    data: new Uint8Array([
      0, 0, 0, 117, 0, 0, 0, 1, 0, 0, 0, 58, 0, 0, 0, 1, 0, 0, 4, 1, 0, 0, 0,
      200,
    ]),
    byteOrder: "MOTOROLA",
    expected: [
      { numerator: 117, denominator: 1 },
      { numerator: 58, denominator: 1 },
      { numerator: 1025, denominator: 200 },
    ],
  },

  {
    data: new Uint8Array([0, 0, 14, 159, 0, 0, 0, 200]),
    byteOrder: "MOTOROLA",
    expected: [{ numerator: 3743, denominator: 200 }],
  },
  {
    data: new Uint8Array([
      26, 0, 0, 0, 1, 0, 0, 0, 70, 85, 5, 0, 16, 39, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0,
    ]),

    byteOrder: "INTEL",
    expected: [
      { numerator: 26, denominator: 1 },
      { numerator: 349510, denominator: 10000 },
      { numerator: 0, denominator: 1 },
    ],
  },
  {
    data: new Uint8Array([
      80, 0, 0, 0, 1, 0, 0, 0, 76, 213, 1, 0, 16, 39, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0,
    ]),
    byteOrder: "INTEL",
    expected: [
      { numerator: 80, denominator: 1 },
      { numerator: 120140, denominator: 10000 },
      { numerator: 0, denominator: 1 },
    ],
  },
  {
    data: new Uint8Array([
      33, 0, 0, 0, 1, 0, 0, 0, 44, 0, 0, 0, 1, 0, 0, 0, 170, 15, 0, 0, 100, 0,
      0, 0,
    ]),
    byteOrder: "INTEL",
    expected: [
      { numerator: 33, denominator: 1 },
      { numerator: 44, denominator: 1 },
      { numerator: 4010, denominator: 100 },
    ],
  },
  {
    data: new Uint8Array([
      117, 0, 0, 0, 1, 0, 0, 0, 58, 0, 0, 0, 1, 0, 0, 0, 59, 3, 0, 0, 100, 0, 0,
      0,
    ]),
    byteOrder: "INTEL",
    expected: [
      { numerator: 117, denominator: 1 },
      { numerator: 58, denominator: 1 },
      { numerator: 827, denominator: 100 },
    ],
  },
  {
    data: new Uint8Array([95, 7, 0, 0, 100, 0, 0, 0]),
    byteOrder: "INTEL",
    expected: [{ numerator: 1887, denominator: 100 }],
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
