import { MARKER_FIRST_BYTE, JpegMarker } from "./constants";
import { isValidExif } from "./exif/isValidExif";
import { assertMarker } from "./jpeg/assertMarker";
import { createSegment } from "./jpeg/createSegment";
import { splitJpegIntoSegments } from "./jpeg/splitJpegIntoSegments";
import { concatUint8Arrays } from "./utils/concatUint8Arrays";

type SegmentIndexes = {
  exif?: number;
  lastAPP0?: number;
  lastAPP1?: number;
};

const findSegmentIndexes = (segments: Uint8Array[]): SegmentIndexes => {
  return segments.reduce<SegmentIndexes>((acc, segment, index) => {
    assertMarker(segment, 0);
    const marker = segment[1];

    if (marker === JpegMarker.APP0) {
      acc.lastAPP0 = index;
    } else if (marker === JpegMarker.APP1) {
      acc.lastAPP1 = index;
      if (isValidExif(segment.subarray(4 /* Exclude marker, length */))) {
        acc.exif = index;
      }
    }
    return acc;
  }, {});
};

const writeExifData = (image: Uint8Array, exif: Uint8Array): Uint8Array => {
  assertMarker(image, 0);
  if (image[0] !== MARKER_FIRST_BYTE || image[1] !== JpegMarker.SOI) {
    throw new Error("First two bytes is not a SOI marker");
  }

  if (!isValidExif(exif)) {
    throw new Error("Invalid Exif data provided");
  }

  const segments = splitJpegIntoSegments(image);
  const indexes = findSegmentIndexes(segments);
  const exifSegment = createSegment(JpegMarker.APP1, exif);

  if (indexes.exif !== undefined) {
    // Replace previous Exif data
    segments[indexes.exif] = exifSegment;
  } else if (indexes.lastAPP1 !== undefined) {
    // Append after last APP1 segment (do not overwrite XMP)
    segments.splice(indexes.lastAPP1 + 1, 0, exifSegment);
  } else if (indexes.lastAPP0 !== undefined) {
    // Append after last APP0 (JFIF requires APP0 after SOI)
    segments.splice(indexes.lastAPP0 + 1, 0, exifSegment);
  } else {
    // Add immediately after SOI
    segments.splice(1, 0, exifSegment);
  }

  return concatUint8Arrays(segments);
};

export { writeExifData };
