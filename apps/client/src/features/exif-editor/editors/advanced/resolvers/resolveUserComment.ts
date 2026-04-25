import type { AdvancedEditorResolver } from "../types";

const resolveUserComment: AdvancedEditorResolver = (
  exifEntryObject,
  value,
  onValueChange,
) => {
  if (exifEntryObject.tag === "USER_COMMENT") {
    return {
      kind: "userComment",
      exifEntryObject,
      value,
      onValueChange: (value) => onValueChange(value),
    };
  }

  return null;
};

export { resolveUserComment };
