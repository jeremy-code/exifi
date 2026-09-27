import { describe, expect, test as baseTest } from "vitest";
import { render } from "vitest-browser-react";

import { formatBytes } from "#utils/formatBytes";
import { getFixture } from "@exifi/test-fixtures";

import { FileInformation } from "./FileInformation";

const test = baseTest.extend("plainJpgWithExif", () =>
  getFixture("plain-jpg-with-exif"),
);

describe("FileInformation", () => {
  test("renders file information", async ({ plainJpgWithExif }) => {
    const file = new File([plainJpgWithExif.image], "plain-jpg-with-exif.jpg", {
      type: "image/jpeg",
    });

    const screen = await render(<FileInformation file={file} />);

    expect(screen.getByText("File information")).toBeInTheDocument();

    expect(
      // Matches both "File" and "File size", so filter to the correct element
      screen.getByTerm("File").filter({ hasText: file.name }),
    ).toMatchTextContent(file.name);
    expect(screen.getByTerm("File size")).toMatchTextContent(
      formatBytes(file.size, undefined, { maximumFractionDigits: 1 }),
    );
    expect(screen.getByTerm("Last modified").getByRole("time")).toHaveAttribute(
      "datetime",
      Temporal.Instant.fromEpochMilliseconds(file.lastModified).toString(),
    );
    await expect
      .element(screen.getByTerm("Dimensions"))
      .toHaveTextContent("1px \u00d7 1px");
  });
});
