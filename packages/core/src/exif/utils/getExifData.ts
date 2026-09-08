import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

import { concatUint8Arrays } from "@exifi/utils/concatUint8Arrays";

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // Exif\0\0

const getExifData = async (file: File): Promise<ExifData> => {
  const fileExtension = extname(file.name);
  const mimeType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(fileExtension);
  const fileBytes = await file.bytes();

  console.log(mimeType);
  if (mimeType === "image/jpeg") {
    return ExifData.newFromData(fileBytes);
  } else if (mimeType === "image/tiff" && fileExtension === ".exif") {
    // Raw Exif also uses the TIFF header, so we check if the file extension is also .exif
    return ExifData.newFromData(concatUint8Arrays([EXIF_HEADER, fileBytes]));
  } else if (mimeType === "image/png") {
    const { png_get_exif_data } = await import("@exifi/image-utils");

    const exifData = png_get_exif_data(fileBytes);

    if (exifData !== undefined) {
      return ExifData.newFromData(exifData);
    }
  }

  return ExifData.newFromData(fileBytes);
};

export { getExifData };
