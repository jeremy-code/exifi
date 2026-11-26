import { getExifTagTitle } from "#lib/exif/labels";
import { m } from "#paraglide/messages";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

const getEntryLabel = (exifEntryObject: Partial<ExifEntryObject>) => {
  if (exifEntryObject.tag === undefined) {
    return m.editor_unknown_tag();
  }

  return getExifTagTitle(exifEntryObject.tag, exifEntryObject.ifd);
};

export { getEntryLabel };
