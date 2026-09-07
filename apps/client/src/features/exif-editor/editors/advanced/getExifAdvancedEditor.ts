import type { AdvancedEditorResolver } from "./interfaces";
import { resolveAscii } from "./resolvers/resolveAscii";
import { resolveNumeric } from "./resolvers/resolveNumeric";
import { resolveRational } from "./resolvers/resolveRational";
import { resolveUserComment } from "./resolvers/resolveUserComment";
import { resolveXp } from "./resolvers/resolveXp";

const resolvers: AdvancedEditorResolver[] = [
  resolveUserComment, // tag === "USER_COMMENT"
  resolveXp,
  resolveAscii, // format === "ASCII"
  resolveNumeric, // format is numeric
  resolveRational, // format is rational
];

const getExifAdvancedEditor: AdvancedEditorResolver = (
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

export { getExifAdvancedEditor };
