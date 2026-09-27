import { ExifData } from "libexif-wasm";
import { describe, expect, test as baseTest } from "vitest";
import { render } from "vitest-browser-react";

import { getFixture } from "@exifi/test-fixtures";

import { ExifInformation } from "./ExifInformation";

const test = baseTest.extend("plainJpgWithExif", () =>
  getFixture("plain-jpg-with-exif"),
);

describe("ExifInformation", () => {
  test("renders information with Exif data", async ({ plainJpgWithExif }) => {
    using exifData = ExifData.newFromData(plainJpgWithExif.image);

    const screen = await render(<ExifInformation exifData={exifData} />);

    expect(screen.getByText("Exif information")).toBeInTheDocument();
    expect(screen.getByTerm("Byte order")).toHaveTextContent("Big-endian");
    expect(screen.getByTerm("Data type")).toHaveTextContent("Unknown");
    expect(screen.getByTerm("Makernote")).toHaveTextContent("Does not exist");
    expect(screen.getByTerm("Number of entries")).toHaveTextContent("6");
  });

  test("renders information with no Exif data", async () => {
    using exifData = ExifData.new();

    const screen = await render(<ExifInformation exifData={exifData} />);

    expect(screen.getByText("Exif information")).toBeInTheDocument();

    expect(screen.getByTerm("Byte order")).toHaveTextContent("Big-endian");
    expect(screen.getByTerm("Data type")).toHaveTextContent("Unknown");
    expect(screen.getByTerm("Makernote")).toHaveTextContent("Does not exist");
    expect(screen.getByTerm("Number of entries")).toHaveTextContent("0");
  });
});
