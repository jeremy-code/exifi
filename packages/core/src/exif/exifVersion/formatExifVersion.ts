/// <reference lib="DOM" />
// https://github.com/microsoft/TypeScript/issues/31535

import type { ExifVersion } from "./interfaces";

const formatExifVersion = (exifVersion: ExifVersion): Uint8Array => {
  return new TextEncoder().encode(
    exifVersion.major.toString().padStart(2, "0") +
      exifVersion.minor.toString().padStart(2, "0"),
  );
};

export { formatExifVersion };
