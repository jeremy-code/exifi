import { EXIF_HEADER } from "../constants";

/**
 * Returns whether {@link data} begins with {@link EXIF_HEADER} (Exif\0\0)
 * bytes. Does not expect segment marker
 */
const isValidExif = (data: Uint8Array) =>
  EXIF_HEADER.every((byte, index) => data[index] === byte);

export { isValidExif };
