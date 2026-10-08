import { ExifData, getExifTagTable } from "libexif-wasm";
import { it, expect, describe } from "vitest";

import { getFixture } from "@exifi/test-fixtures";

import { mnoteDataEntrySchema, tagEntrySchema } from "./libexif";

describe("tagEntrySchema", () => {
  it("is valid schema", () => {
    getExifTagTable().forEach((tagEntry) => {
      expect(tagEntry).toEqual(expect.schemaMatching(tagEntrySchema));
    });
  });
});

describe("mnoteDataEntrySchema", () => {
  it("is valid schema", async () => {
    using exifData = ExifData.newFromData(
      await getFixture("plain-jpg-with-mnote-exif").then(
        (fixture) => fixture.image,
      ),
    );

    const mnoteDataEntries = exifData.mnoteData?.data;

    // oxlint-disable-next-line vitest/valid-expect -- This is definitely real, I am not sure why Vitest thinks it's wrong
    expect.assert.isDefined(mnoteDataEntries);
    mnoteDataEntries.forEach((mnoteDataEntry) => {
      expect(mnoteDataEntry).toEqual(
        expect.schemaMatching(mnoteDataEntrySchema),
      );
    });
  });
});
