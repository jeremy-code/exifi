import { ExifIfd, type ExifData } from "libexif-wasm";
import { v4 as uuidv4 } from "uuid";

import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import { getOrInsertEntry } from "../utils/getOrInsertEntry";

const addImageUniqueId = (exifData: ExifData) => {
  const exifDataExifIfd = exifData.ifd[ExifIfd.EXIF];
  const imageUniqueIdEntry = getOrInsertEntry(
    exifDataExifIfd,
    "IMAGE_UNIQUE_ID",
  );

  // Both uuidv4 and imageUniqueId have 128-bit fixed length
  const imageUniqueId = uuidv4().split("-").join("");

  // Per JEITA CP-3451 (p. 45), unique ID must be 33 bytes (including null
  // terminator)
  if (imageUniqueId.length !== 32) {
    throw new Error("Failed to generate unique ID");
  }

  imageUniqueIdEntry.format = "ASCII";
  imageUniqueIdEntry.fromTypedArray(encodeStringToUtf8(imageUniqueId));
};

export { addImageUniqueId };
