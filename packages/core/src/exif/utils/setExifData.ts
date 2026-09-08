import { extname } from "@std/path";
import { fileTypeFromBlob } from "file-type";
import { ExifData } from "libexif-wasm";
import { lookup } from "mrmime";

import { jpeg_set_exif_data, png_set_exif_data } from "@exifi/image-utils";

const setExifData = async (file: File, exifData: ExifData): Promise<File> => {
  const fileType =
    (await fileTypeFromBlob(file))?.mime ?? lookup(extname(file.name));
  const fileBytes = await file.bytes();
  const exifDataBytes = exifData.saveData();

  if (fileType === "image/jpeg") {
    const newFileBytes = jpeg_set_exif_data(fileBytes.slice(), exifDataBytes);

    return new File([newFileBytes.slice()], file.name, {
      type: fileType,
      lastModified: new Date().getTime(),
    });
  } else if (fileType === "image/png") {
    const newFileBytes = png_set_exif_data(fileBytes, exifDataBytes);

    return new File([newFileBytes.slice()], file.name, {
      type: fileType,
      lastModified: new Date().getTime(),
    });
  }

  return file;
};

export { setExifData };
