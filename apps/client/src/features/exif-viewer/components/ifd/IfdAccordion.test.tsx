import { ExifData } from "libexif-wasm";
import { describe, expect, test as baseTest } from "vitest";
import { render } from "vitest-browser-react";
import { locators } from "vitest/browser";

import { getFixture } from "@exifi/test-fixtures";

import { IfdAccordion } from "./IfdAccordion";

const test = baseTest.extend("plainJpgWithExif", () =>
  getFixture("plain-jpg-with-exif"),
);

locators.extend({
  getByTerm(term) {
    return `dt:has-text("${term}") + dd`;
  },
});

describe("IfdAccordion", () => {
  test("correctly displays IFDs of Exif metadata", async ({
    plainJpgWithExif,
  }) => {
    using exifData = ExifData.newFromData(plainJpgWithExif.image);

    const screen = await render(<IfdAccordion exifData={exifData} />);

    await expect
      .element(screen.getByTerm("X-Resolution"))
      .toMatchTextContent("72");
    await expect
      .element(screen.getByTerm("Y-Resolution"))
      .toMatchTextContent("72");
    await expect
      .element(screen.getByTerm("Resolution Unit"))
      .toMatchTextContent("Inch");
    await expect
      .element(screen.getByTerm("Exif Version"))
      .toMatchTextContent("Exif Version 2.1");
    await expect
      .element(screen.getByTerm("FlashPixVersion"))
      .toMatchTextContent("FlashPix Version 1.0");
    await expect
      .element(screen.getByTerm("Color Space"))
      .toMatchTextContent("Uncalibrated");
  });
});
