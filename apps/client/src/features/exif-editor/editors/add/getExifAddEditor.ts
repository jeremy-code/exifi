import type { AddEditorResolver } from "./interfaces";
import { resolveAscii } from "./resolvers/resolveAscii";
import { resolveDateStamp } from "./resolvers/resolveDateStamp";
import { resolveDateTime } from "./resolvers/resolveDateTime";
import { resolveEnum } from "./resolvers/resolveEnum";
import { resolveEnumAscii } from "./resolvers/resolveEnumAscii";
import { resolveExifVersion } from "./resolvers/resolveExifVersion";
import { resolveNumeric } from "./resolvers/resolveNumeric";
import { resolveRational } from "./resolvers/resolveRational";
import { resolveTimeStamp } from "./resolvers/resolveTimeStamp";
import { resolveUserComment } from "./resolvers/resolveUserComment";
import { resolveVersionId } from "./resolvers/resolveVersionId";
import { resolveXp } from "./resolvers/resolveXp";

const resolvers: AddEditorResolver[] = [
  resolveEnum, // Based on EXIF_TAG_MAP
  resolveEnumAscii,
  resolveDateStamp, // tag === "DATE_STAMP"
  resolveDateTime, // tag === "DATE_TIME"
  resolveExifVersion, // tag === "EXIF_VERSION"
  resolveVersionId, // tag === "VERSION_ID"
  resolveTimeStamp, // tag === "TIME_STAMP"
  resolveUserComment, // tag === "USER_COMMENT"
  resolveXp, // tag is in XP_TAGS
  resolveAscii, // format === "ASCII"
  resolveNumeric, // format is numeric
  resolveRational, // format is rational
];

const getExifAddEditor: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  for (const resolver of resolvers) {
    const result = resolver(exifEntryObject, onValueChange);
    if (result !== null) {
      return result;
    }
  }
  return null;
};

export { getExifAddEditor };
