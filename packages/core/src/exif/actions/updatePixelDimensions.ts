import type { ImageType } from "image-dimensions";
import { ExifIfd, type ExifData } from "libexif-wasm";

import { getOrInsertEntry } from "../utils/getOrInsertEntry";

const updatePixelDimensions = (
  exifData: ExifData,
  imageDimensions: {
    width: number;
    height: number;
    type: ImageType;
  },
) => {
  const exifIfd = exifData.ifd[ExifIfd.EXIF];

  const imageWidthEntry = getOrInsertEntry(exifIfd, "PIXEL_X_DIMENSION");
  const imageHeightEntry = getOrInsertEntry(exifIfd, "PIXEL_Y_DIMENSION");

  imageWidthEntry.format = "SHORT";
  imageHeightEntry.format = "SHORT";

  imageWidthEntry.fromTypedArray(new Uint16Array([imageDimensions.width]));
  imageHeightEntry.fromTypedArray(new Uint16Array([imageDimensions.height]));
};

export { updatePixelDimensions };
