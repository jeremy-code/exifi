import { ExifData } from "libexif-wasm";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { ExifEditorProvider } from "#features/exif-editor/contexts/ExifEditorContext";

import { ExifEntryAddForm } from "./ExifEntryAddForm";

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useBlocker: () => ({ status: "idle" }),
}));

describe("ExifEntryAddForm", () => {
  test("adds ASCII entries", async () => {
    const expectedImageDescription = "This is an image description";

    using exifData = ExifData.new();
    const screen = await render(<ExifEntryAddForm />, {
      wrapper: ({ children }) => (
        <ExifEditorProvider exifData={exifData}>{children}</ExifEditorProvider>
      ),
    });

    await userEvent.fill(
      screen
        .getByLabelText("Tag")
        // Otherwise, the button is also included in the locator
        .and(screen.getByRole("combobox")),
      "ImageDescription",
    );
    await userEvent.click(
      screen.getByRole("option").filter({ hasText: "ImageDescription" }),
    );
    await userEvent.click(screen.getByLabelText("Image File Domain"));
    await userEvent.click(screen.getByRole("option").filter({ hasText: "0" }));
    await userEvent.click(screen.getByLabelText("Format"));
    await userEvent.click(
      screen.getByRole("option").filter({ hasText: "ASCII" }),
    );
    await userEvent.fill(
      screen.getByLabelText("Value"),
      expectedImageDescription,
    );
    await userEvent.click(screen.getByText("Submit"));

    const imageDescriptionEntry = exifData.ifd[0].getEntry("IMAGE_DESCRIPTION");
    expect.assert(imageDescriptionEntry !== null);
    expect(imageDescriptionEntry.toString()).toBe(expectedImageDescription);
  });
});
