import { JpegMarker } from "../constants";
import { assertMarker } from "./assertMarker";

const splitJpegIntoSegments = (jpegImage: Uint8Array): Uint8Array[] => {
  const dataView = new DataView(
    jpegImage.buffer,
    jpegImage.byteOffset,
    jpegImage.byteLength,
  );

  const segments: Uint8Array[] = [];
  let byteOffset = 0;

  while (byteOffset < jpegImage.length) {
    assertMarker(jpegImage, byteOffset);
    const markerSecondByte = dataView.getUint8(byteOffset + 1);

    switch (markerSecondByte) {
      case JpegMarker.SOI:
      case JpegMarker.EOI:
        segments.push(jpegImage.subarray(byteOffset, byteOffset + 2));
        byteOffset += 2;
        break;
      case JpegMarker.RST0:
      case JpegMarker.RST1:
      case JpegMarker.RST2:
      case JpegMarker.RST3:
      case JpegMarker.RST4:
      case JpegMarker.RST5:
      case JpegMarker.RST6:
      case JpegMarker.RST7:
        segments.push(jpegImage.subarray(byteOffset, byteOffset + 2));
        byteOffset += 2;
        break;
      case JpegMarker.SOS:
        segments.push(jpegImage.subarray(byteOffset, jpegImage.length - 2));
        byteOffset = jpegImage.length - 2;
        break;
      default: {
        // Big Endian https://github.com/corkami/formats/blob/master/image/jpeg.md#structure
        const segmentLength = dataView.getUint16(byteOffset + 2, false);
        // Length includes itself, so must be at least 2
        if (segmentLength < 2) {
          throw new Error("Invalid segment: segment length was less than two");
        }

        const endOfSegmentIndex = byteOffset + 2 + segmentLength;

        segments.push(jpegImage.subarray(byteOffset, endOfSegmentIndex));
        byteOffset = endOfSegmentIndex;
        break;
      }
    }
  }

  return segments;
};

export { splitJpegIntoSegments };
