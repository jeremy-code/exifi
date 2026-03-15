import { MARKER_FIRST_BYTE } from "../constants";

/**
 * For the definition of a marker, see ISO/IEC 10918-1 : 1993(E), 3.1.85.
 *
 * @see {@link https://www.w3.org/Graphics/JPEG/itu-t81.pdf#page=9}
 */
const assertMarker = (data: Uint8Array, offset: number) => {
  if (data.length < offset + 1) {
    throw new RangeError(
      `Invalid JPEG marker at offset ${offset}. Bytes at offset do not exist`,
    );
  }

  if (data[offset] !== MARKER_FIRST_BYTE) {
    throw new Error(
      `Invalid JPEG marker at offset ${offset}. Marker does not start with 0xff`,
    );
  } else if (
    data[offset] === MARKER_FIRST_BYTE &&
    (data[offset + 1] === 0x00 || data[offset + 1] === 0xff)
  ) {
    throw new Error(
      `Invalid JPEG marker at offset ${offset}. Second byte of marker must be between 1 and 0xFE, inclusive`,
    );
  }
};

export { assertMarker };
