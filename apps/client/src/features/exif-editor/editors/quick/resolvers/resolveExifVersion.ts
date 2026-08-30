import type { QuickEditorResolver } from "../types";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const resolveExifVersion: QuickEditorResolver = (
  exifEntryObject,
  onValueChange,
) => {
  if (
    exifEntryObject.tag === "EXIF_VERSION" &&
    exifEntryObject.format === "UNDEFINED" &&
    exifEntryObject.size === 4 &&
    exifEntryObject.components === 4
  ) {
    const exifVersionString = textDecoder.decode(
      new Uint8Array(exifEntryObject.value),
    );
    // Everything seems to make sense except 0230 === 2.3?
    const major = parseInt(exifVersionString.slice(0, 2));
    const minor = parseInt(exifVersionString.slice(2));

    return {
      kind: "exifVersion",
      exifEntryObject,
      value: { major, minor },
      onValueChange: (value) =>
        onValueChange(
          textEncoder.encode(
            value.major.toString().padStart(2, "0") +
              value.minor.toString().padStart(2, "0"),
          ),
        ),
    };
  }

  return null;
};

export { resolveExifVersion };
