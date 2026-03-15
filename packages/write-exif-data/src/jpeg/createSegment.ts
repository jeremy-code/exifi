import { MARKER_FIRST_BYTE, type JpegMarker } from "../constants";

const createSegment = (
  marker: Exclude<
    JpegMarker,
    | JpegMarker.SOI
    | JpegMarker.EOI
    | JpegMarker.RST1
    | JpegMarker.RST2
    | JpegMarker.RST3
    | JpegMarker.RST4
    | JpegMarker.RST5
    | JpegMarker.RST6
    | JpegMarker.RST7
  >,
  payload: ArrayLike<number>,
) => {
  const segmentLength = payload.length + 2; // includes segmentLength itself
  const segment = new Uint8Array(segmentLength + 2 /* including marker */);

  segment[0] = MARKER_FIRST_BYTE;
  segment[1] = marker;
  // Convert to big-endian Uint16 value
  segment[2] = (segmentLength >> 8) & 0xff;
  segment[3] = segmentLength & 0xff;

  segment.set(payload, 4);

  return segment;
};

export { createSegment };
