import type { AddEditorResolver } from "../types";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const resolveExifVersion: AddEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (exifEntryObject.tag === "EXIF_VERSION") {
    const isEmpty = exifEntryObject.value.length === 0;

    const exifVersionString = isEmpty
      ? undefined
      : textDecoder.decode(new Uint8Array(exifEntryObject.value));
    // Everything seems to make sense except 0230 === 2.3?
    const major = exifVersionString
      ? parseInt(exifVersionString.slice(0, 2))
      : undefined;
    const minor = exifVersionString
      ? parseInt(exifVersionString.slice(2))
      : undefined;

    return {
      kind: "exifVersion",
      exifEntryObject,
      value: major && minor ? { major, minor } : undefined,
      onValueChange: (value) =>
        onValueChange(
          Array.from(
            textEncoder.encode(
              value.major.toString().padStart(2, "0") +
                value.minor.toString().padStart(2, "0"),
            ),
          ),
        ),
    };
  }

  return null;
};

export { resolveExifVersion };
