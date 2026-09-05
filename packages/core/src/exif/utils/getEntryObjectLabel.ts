import { ExifTagInfo } from "libexif-wasm";

import type { ExifEntryObject } from "../interfaces";

const getEntryObjectLabel = (exifEntryObject: Partial<ExifEntryObject>) => {
  if (exifEntryObject.tag === undefined) {
    return "Unknown tag";
  }

  if (exifEntryObject.ifd === undefined) {
    return exifEntryObject.tag;
  }

  const title = ExifTagInfo.getTitleInIfd(
    exifEntryObject.tag,
    exifEntryObject.ifd,
  );

  if (title === "") {
    const name = ExifTagInfo.getNameInIfd(
      exifEntryObject.tag,
      exifEntryObject.ifd,
    );

    return name !== "" ? name : exifEntryObject.tag;
  }
  return title;
};

export { getEntryObjectLabel };
