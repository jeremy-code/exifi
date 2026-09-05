import type { ExifVersion } from "./interfaces";

const parseExifVersion = (
  exifVersion: ArrayLike<number>,
): ExifVersion | null => {
  if (exifVersion.length !== 4) {
    return null;
  }

  const exifVersionString = new TextDecoder().decode(
    new Uint8Array(exifVersion),
  );

  if (exifVersionString === "") {
    return null;
  }

  // Everything seems to make sense except 0230 === 2.3?
  const major = parseInt(exifVersionString.slice(0, 2));
  const minor = parseInt(exifVersionString.slice(2));

  if (Number.isNaN(major) || Number.isNaN(minor)) {
    return null;
  }

  return { major, minor };
};

export { parseExifVersion };
