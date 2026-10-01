import { ExifData } from "libexif-wasm";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { ExifEditorProvider } from "#features/exif-editor/contexts/ExifEditorContext";
import { getOrInsertEntry, serializeExifEntry } from "@exifi/core/exif/utils";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";

import { ExifEntryInspector } from "./ExifEntryInspector";

describe("ExifEntryInspector", () => {
  test("edits ASCII entries", async () => {
    const initialImageDescription = "This is the initial image description";
    const expectedImageDescription = "This is the expected image description";

    using exifData = ExifData.new();
    const entry = getOrInsertEntry(exifData.ifd[0], "IMAGE_DESCRIPTION");
    entry.format = "ASCII";
    entry.fromTypedArray(encodeStringToUtf8(initialImageDescription));

    const exifEntryObject = serializeExifEntry(entry);
    expect.assert(exifEntryObject !== null);
    const screen = await render(
      <ExifEntryInspector exifEntryObject={exifEntryObject} />,
      {
        wrapper: ({ children }) => (
          <ExifEditorProvider exifData={exifData}>
            {children}
          </ExifEditorProvider>
        ),
      },
    );

    await userEvent.fill(
      screen.getByLabelText("Image Description"),
      expectedImageDescription,
    );
    await userEvent.click(screen.getByText("Save changes"));

    const imageDescriptionEntry = exifData.ifd[0].getEntry("IMAGE_DESCRIPTION");
    expect(imageDescriptionEntry).not.toBe(null);
    expect(imageDescriptionEntry?.toString()).toBe(expectedImageDescription);
  });
});
