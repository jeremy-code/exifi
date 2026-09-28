import { ExifData } from "libexif-wasm";
import { describe, expect, test as baseTest } from "vitest";
import { render } from "vitest-browser-react";

import { getFixture } from "@exifi/test-fixtures";

import { MakerNoteAccordion } from "./MakerNoteAccordion";

const test = baseTest.extend("plainJpgWithMnoteExif", () =>
  getFixture("plain-jpg-with-mnote-exif"),
);

describe("MakerNoteAccordion", () => {
  test("correctly displays MakerNote data of Exif metadata", async ({
    plainJpgWithMnoteExif,
  }) => {
    using exifData = ExifData.newFromData(plainJpgWithMnoteExif.image);

    const screen = await render(<MakerNoteAccordion exifData={exifData} />);

    exifData.mnoteData?.data
      .filter((mnoteDatum) => mnoteDatum.title !== null)
      .forEach((mnoteDatum) => {
        expect(screen.getByTerm(mnoteDatum.title!)).toMatchTextContent(
          mnoteDatum.value?.trim() ?? "",
        );
      });
  });
});
