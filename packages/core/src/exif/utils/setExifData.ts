import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

import {
  jpeg_set_exif_data,
  png_set_exif_data,
  webp_set_exif_data,
} from "@exifi/image-utils";

const setExifData = async (file: File, exifData: ExifData): Promise<File> => {
  const fileExtension = extname(file.name);
  const fileType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(fileExtension);
  const fileBytes = await file.bytes();
  const exifDataBytes = exifData.saveData();

  if (fileType === "image/tiff" && fileExtension === ".exif") {
    return new File([exifDataBytes.slice()], file.name, {
      type: fileType,
      lastModified: new Date().getTime(),
    });
  }

  const newFileBytes =
    fileType === "image/jpeg"
      ? jpeg_set_exif_data(fileBytes.slice(), exifDataBytes)
      : fileType === "image/png"
        ? png_set_exif_data(fileBytes.slice(), exifDataBytes)
        : fileType === "image/webp"
          ? webp_set_exif_data(fileBytes.slice(), exifDataBytes)
          : undefined;

  if (newFileBytes === undefined) {
    return file;
  }

  return new File([newFileBytes.slice()], file.name, {
    type: fileType,
    lastModified: new Date().getTime(),
  });
};

export { setExifData };
