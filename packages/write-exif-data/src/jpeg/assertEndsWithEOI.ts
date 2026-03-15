import { JpegMarker, MARKER_FIRST_BYTE } from "../constants";

const assertEndsWithEOI = (data: Uint8Array) => {
  const lastTwoBytes = data.subarray(-2);

  if (
    lastTwoBytes[0] !== MARKER_FIRST_BYTE ||
    lastTwoBytes[1] !== JpegMarker.EOI
  ) {
    throw new Error(
      "Invalid JPEG: last two bytes are not EOI (end of image) marker",
    );
  }
};

export { assertEndsWithEOI };
