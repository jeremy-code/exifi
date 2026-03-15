import { JpegMarker } from "../constants";
import { assertEndsWithEOI } from "./assertEndsWithEOI";
import { assertMarker } from "./assertMarker";

const splitJpegIntoSegments = (jpegImage: Uint8Array): Uint8Array[] => {
  const dataView = new DataView(jpegImage.buffer);

  const segments: Uint8Array[] = [];
  let byteOffset = 0;

  while (byteOffset < jpegImage.length) {
    assertMarker(jpegImage, byteOffset);
    const markerSecondByte = dataView.getUint8(byteOffset + 1);

    if (
      markerSecondByte === JpegMarker.SOI ||
      markerSecondByte === JpegMarker.EOI
    ) {
      segments.push(jpegImage.subarray(byteOffset, byteOffset + 2));
      byteOffset += 2;
      continue;
    } else if (
      // RST0–RST7
      markerSecondByte >= JpegMarker.RST0 &&
      markerSecondByte <= JpegMarker.RST7
    ) {
      segments.push(jpegImage.subarray(byteOffset, byteOffset + 2));
      byteOffset += 2;
      continue;
    } else if (markerSecondByte === JpegMarker.SOS) {
      // Start of Scan (scan data until next marker)
      assertEndsWithEOI(jpegImage);
      segments.push(jpegImage.subarray(byteOffset, jpegImage.length - 2));
      segments.push(jpegImage.subarray(jpegImage.length - 2)); // Append EOI
      break;
    }

    const chunkLength = dataView.getUint16(byteOffset + 2, false);
    const endOfChunkIndex = byteOffset + 2 + chunkLength;

    segments.push(jpegImage.subarray(byteOffset, endOfChunkIndex));
    byteOffset = endOfChunkIndex;
  }

  return segments;
};

export { splitJpegIntoSegments };
