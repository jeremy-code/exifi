import { ExifData } from "libexif-wasm";
import { describe, expect, test as baseTest } from "vitest";
import { render } from "vitest-browser-react";
import { locators } from "vitest/browser";

import { getFixture } from "@exifi/test-fixtures";

import { ExifInformation } from "./ExifInformation";

const test = baseTest.extend("plainJpgWithExif", () =>
  getFixture("plain-jpg-with-exif"),
);

locators.extend({
  getByTerm(term) {
    return `dt:has-text("${term}") + dd`;
  },
});

describe("ExifInformation", () => {
  test("renders information with Exif data", async ({ plainJpgWithExif }) => {
    using exifData = ExifData.newFromData(plainJpgWithExif.image);

    const screen = await render(<ExifInformation exifData={exifData} />);

    await expect
      .element(screen.getByText("Exif information"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByTerm("Byte order"))
      .toHaveTextContent("Big-endian");
    await expect
      .element(screen.getByTerm("Data type"))
      .toHaveTextContent("Unknown");
    await expect
      .element(screen.getByTerm("Makernote"))
      .toHaveTextContent("Does not exist");
    await expect
      .element(screen.getByTerm("Number of entries"))
      .toHaveTextContent("6");
  });

  test("renders information with no Exif data", async () => {
    using exifData = ExifData.new();

    const screen = await render(<ExifInformation exifData={exifData} />);

    await expect
      .element(screen.getByText("Exif information"))
      .toBeInTheDocument();

    await expect
      .element(screen.getByTerm("Byte order"))
      .toHaveTextContent("Big-endian");
    await expect
      .element(screen.getByTerm("Data type"))
      .toHaveTextContent("Unknown");
    await expect
      .element(screen.getByTerm("Makernote"))
      .toHaveTextContent("Does not exist");
    await expect
      .element(screen.getByTerm("Number of entries"))
      .toHaveTextContent("0");
  });
});
