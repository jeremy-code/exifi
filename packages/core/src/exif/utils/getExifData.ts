import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

import {
  png_get_exif_data,
  webp_get_exif_data,
  heic_get_exif_data,
} from "@exifi/image-utils";
import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // Exif\0\0

// For a JPEG, the maximum size for a marker in a JPEG file is 65,533 bytes (64
// KiB - 2) because the segment length field uses a 16-bit integer (and is
// counted in the size)
// https://github.com/winlibs/libjpeg/blob/66ef88ad97f3c47eb1c7b85f2637ff1073ebce9b/doc/libjpeg.txt#L2691
const MAX_APP1_SEGMENT_SIZE = 65_535;

const getExifData = async (file: File): Promise<ExifData | null> => {
  const fileExtension = extname(file.name).toLowerCase();
  const mimeType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(fileExtension);

  if (mimeType === "image/jpeg") {
    try {
      const exifData = await ExifData.fromReadableStream(file.stream());
      return exifData;
    } catch (e) {
      console.error(e);
      return null;
    }
  } else if (mimeType === "image/tiff" && file.size <= MAX_APP1_SEGMENT_SIZE) {
    // Raw Exif also uses the TIFF header
    const fileBytes = await file.bytes();
    if (EXIF_HEADER.every((value, index) => fileBytes.at(index) === value)) {
      return ExifData.newFromData(fileBytes);
    }
    return ExifData.newFromData(concatUint8Arrays([EXIF_HEADER, fileBytes]));
  }
  const fileBytes = await file.bytes();
  const exifData =
    mimeType === "image/png"
      ? png_get_exif_data(fileBytes)
      : mimeType === "image/webp"
        ? webp_get_exif_data(fileBytes)
        : mimeType === "image/heif" ||
            mimeType === "image/heic" ||
            mimeType === "image/avif"
          ? heic_get_exif_data(fileBytes)
          : undefined;

  if (exifData !== undefined) {
    return ExifData.newFromData(exifData);
  }

  return null;
};

export { getExifData };
