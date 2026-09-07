import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

import imageUtilsFactory from "@exifi/image-utils";

const imageUtils = await imageUtilsFactory();

const getExifData = async (file: File): Promise<ExifData> => {
  const mimeType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(extname(file.name));
  const fileBytes = await file.bytes();

  if (mimeType === "image/jpeg") {
    return ExifData.newFromData(fileBytes);
  } else if (mimeType === "image/png") {
    const exifData = imageUtils.png_get_exif_data(fileBytes);

    if (exifData !== undefined) {
      return ExifData.newFromData(exifData);
    }
  } else if (mimeType === "image/webp") {
    const exifData = imageUtils.webp_get_exif_data(fileBytes);

    if (exifData !== undefined) {
      return ExifData.newFromData(exifData);
    }
  }

  return ExifData.newFromData(fileBytes);
};

export { getExifData };
