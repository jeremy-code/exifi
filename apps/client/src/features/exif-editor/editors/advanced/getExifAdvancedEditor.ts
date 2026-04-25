import { resolveAscii } from "./resolvers/resolveAscii";
import { resolveNumeric } from "./resolvers/resolveNumeric";
import { resolveRational } from "./resolvers/resolveRational";
import { resolveUserComment } from "./resolvers/resolveUserComment";
import type { AdvancedEditorResolver } from "./types";

const resolvers: AdvancedEditorResolver[] = [
  resolveUserComment, // tag === "USER_COMMENT"
  resolveAscii, // format === "ASCII"
  resolveNumeric, // format is numeric
  resolveRational, // format is rational
];

const getExifAdvancedEditor: AdvancedEditorResolver = (
  exifEntryObject,
  value,
  onValueChange,
) => {
  for (const resolver of resolvers) {
    const result = resolver(exifEntryObject, value, onValueChange);
    if (result !== null) {
      return result;
    }
  }
  return null;
};

export { getExifAdvancedEditor };
