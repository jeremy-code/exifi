import {
  ExifData,
  ExifTagInfo,
  type ExifIfdKey,
  type ExifTagKey,
} from "libexif-wasm";
import { describe, expect, it } from "vitest";

import { mapExifData, type ExifDataObject } from "./mapExifData";

const mapTestObjectToExifDataObject = (
  testObject: Record<
    Exclude<ExifIfdKey, "COUNT">,
    Partial<Record<ExifTagKey, string | null>> | null
  >,
) =>
  Object.fromEntries(
    (
      Object.entries(testObject) as [
        ExifIfdKey,
        Record<ExifTagKey, string | null> | null,
      ][]
    ).map(([ifd, exifTagMap]) => {
      return exifTagMap === null ?
          [ifd, exifTagMap]
        : [
            ifd,
            (
              Object.entries(exifTagMap) as [ExifTagKey, string | null][]
            ).reduce<NonNullable<NonNullable<ExifDataObject>[string]>>(
              (acc, [exifTagKey, exifTagValue]) => {
                if (exifTagKey)
                  acc[exifTagKey] = {
                    name: ExifTagInfo.getNameInIfd(exifTagKey, ifd),
                    title: ExifTagInfo.getTitleInIfd(exifTagKey, ifd),
                    description: ExifTagInfo.getDescriptionInIfd(
                      exifTagKey,
                      ifd,
                    ),
                    value: exifTagValue,
                  };
                return acc;
              },
              {},
            ),
          ];
    }),
  ) as ExifDataObject;

const MIN_JPEG = new Uint8Array([0xff, 0xd8]);
const MIN_JPEG_WITH_EXIF = new Uint8Array([
  ...MIN_JPEG,
  ...[
    0xff, 0xe1, 0x00, 0x16, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x4d, 0x4d,
    0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xff, 0xd9,
  ],
]);

describe("mapExifData()", () => {
  describe("maps ExifData to object", () => {
    it.each([
      [
        ExifData.newFromData(MIN_JPEG),
        {
          IFD_0: null,
          IFD_1: null,
          EXIF: null,
          GPS: null,
          INTEROPERABILITY: null,
        },
      ],
      [
        ExifData.newFromData(MIN_JPEG_WITH_EXIF),
        mapTestObjectToExifDataObject({
          IFD_0: {
            RESOLUTION_UNIT: "Inch",
            X_RESOLUTION: "72",
            Y_RESOLUTION: "72",
          },
          IFD_1: null,
          EXIF: {
            COLOR_SPACE: "Uncalibrated",
            EXIF_VERSION: "Exif Version 2.1",
            FLASH_PIX_VERSION: "FlashPix Version 1.0",
          },
          GPS: null,
          INTEROPERABILITY: null,
        }),
      ],
    ])("maps %i ExifData correctly", (input, expected) => {
      expect(mapExifData(input)).toStrictEqual(expected);
    });
  });
});
