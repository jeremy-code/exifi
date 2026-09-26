import type {
  CalendarDate,
  CalendarDateTime,
  Time,
} from "@internationalized/date";
import { toCalendarDateTime } from "@internationalized/date";
import { ExifData, type RationalObject } from "libexif-wasm";
import { describe, expect, test as baseTest } from "vitest";
import { render } from "vitest-browser-react";
import { locators } from "vitest/browser";

import { parseDateStamp } from "@exifi/core/exif/date/dateStamp";
import { parseDateTime } from "@exifi/core/exif/date/dateTime";
import { parseTimeStamp } from "@exifi/core/exif/date/timeStamp";
import type { ExifDataObject } from "@exifi/core/exif/interfaces";
import { heic_get_exif_data } from "@exifi/image-utils";
import { getFixture } from "@exifi/test-fixtures";

import { ExifDateTimeInformation } from "./ExifDateTimeInformation";

const test = baseTest.extend("plainAvifWithExif", () =>
  getFixture("plain-avif-with-exif"),
);

locators.extend({
  getByTerm(term) {
    return `dt:has-text("${term}") + dd`;
  },
});

const parseRawDateTimeEntryObjects = (
  dateTimeEntry?: CalendarDateTime,
  offsetTime?: string,
  subSecTime?: number,
) =>
  dateTimeEntry === undefined
    ? undefined
    : Temporal.ZonedDateTime.from({
        year: dateTimeEntry.year,
        month: dateTimeEntry.month,
        day: dateTimeEntry.day,
        hour: dateTimeEntry.hour,
        minute: dateTimeEntry.minute,
        second: dateTimeEntry.second,
        millisecond:
          subSecTime !== undefined && !Number.isNaN(subSecTime)
            ? subSecTime
            : dateTimeEntry.millisecond,
        timeZone: offsetTime ?? "UTC",
      });

const parseDateTimeEntryObjects = (
  exifDataObject: ExifDataObject,
): Record<
  "dateTime" | "dateTimeOriginal" | "dateTimeDigitized" | "dateTimeGps",
  Temporal.ZonedDateTime | undefined
> => {
  const rawDateTimeEntries = Object.values(exifDataObject.ifd)
    .flat()
    .reduce<
      Partial<{
        DATE_TIME: CalendarDateTime;
        DATE_TIME_ORIGINAL: CalendarDateTime;
        DATE_TIME_DIGITIZED: CalendarDateTime;
        OFFSET_TIME: string;
        OFFSET_TIME_ORIGINAL: string;
        OFFSET_TIME_DIGITIZED: string;
        SUB_SEC_TIME: number;
        SUB_SEC_TIME_ORIGINAL: number;
        SUB_SEC_TIME_DIGITIZED: number;
        TIME_STAMP: Time;
        DATE_STAMP: CalendarDate;
      }>
    >((acc, entry) => {
      if (
        entry.tag === "DATE_TIME" ||
        entry.tag === "DATE_TIME_ORIGINAL" ||
        entry.tag === "DATE_TIME_DIGITIZED"
      ) {
        acc[entry.tag] = parseDateTime(entry.formattedValue!);
      } else if (
        entry.tag === "OFFSET_TIME" ||
        entry.tag === "OFFSET_TIME_ORIGINAL" ||
        entry.tag === "OFFSET_TIME_DIGITIZED"
      ) {
        acc[entry.tag] = entry.formattedValue!;
      } else if (
        entry.tag === "SUB_SEC_TIME" ||
        entry.tag === "SUB_SEC_TIME_ORIGINAL" ||
        entry.tag === "SUB_SEC_TIME_DIGITIZED"
      ) {
        acc[entry.tag] = Number(entry.formattedValue!);
      } else if (entry.tag === "TIME_STAMP") {
        acc[entry.tag] = parseTimeStamp(entry.value as RationalObject[]);
      } else if (entry.tag === "DATE_STAMP") {
        acc[entry.tag] = parseDateStamp(entry.formattedValue!);
      }

      return acc;
    }, {});

  return {
    dateTime: parseRawDateTimeEntryObjects(
      rawDateTimeEntries.DATE_TIME,
      rawDateTimeEntries.OFFSET_TIME,
      rawDateTimeEntries.SUB_SEC_TIME,
    ),
    dateTimeOriginal: parseRawDateTimeEntryObjects(
      rawDateTimeEntries.DATE_TIME_ORIGINAL,
      rawDateTimeEntries.OFFSET_TIME_ORIGINAL,
      rawDateTimeEntries.SUB_SEC_TIME_ORIGINAL,
    ),
    dateTimeDigitized: parseRawDateTimeEntryObjects(
      rawDateTimeEntries.DATE_TIME_DIGITIZED,
      rawDateTimeEntries.OFFSET_TIME_DIGITIZED,
      rawDateTimeEntries.SUB_SEC_TIME_DIGITIZED,
    ),
    dateTimeGps: parseRawDateTimeEntryObjects(
      rawDateTimeEntries.DATE_STAMP !== undefined &&
        rawDateTimeEntries.TIME_STAMP !== undefined
        ? toCalendarDateTime(
            rawDateTimeEntries.DATE_STAMP,
            rawDateTimeEntries.TIME_STAMP,
          )
        : undefined,
    ),
  };
};

describe("ExifDateTimeInformation", () => {
  test("renders date and time information with Exif data", async ({
    plainAvifWithExif,
  }) => {
    using exifData = ExifData.newFromData(
      heic_get_exif_data(plainAvifWithExif.image)!,
    );

    const screen = await render(
      <ExifDateTimeInformation exifData={exifData} />,
    );

    const { dateTime, dateTimeOriginal, dateTimeGps } =
      parseDateTimeEntryObjects(plainAvifWithExif.json as ExifDataObject);

    await expect
      .element(screen.getByTerm("Date and Time").first().getByRole("time"))
      .toHaveAttribute("datetime", dateTime?.toString());
    await expect
      .element(screen.getByTerm("Date and Time (Original)").getByRole("time"))
      .toHaveAttribute("datetime", dateTimeOriginal?.toString());
    // While DATE_TIME_DIGITIZED exists, it is exactly the same as
    // DATE_TIME_ORIGINAL; hence, it shouldn't be included
    await expect
      .element(screen.getByTerm("Date and Time (Digitized)"))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByTerm("Date and Time (GPS)").getByRole("time"))
      .toHaveAttribute("datetime", dateTimeGps?.toString());
  });
});
