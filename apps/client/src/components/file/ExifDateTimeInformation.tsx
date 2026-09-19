import { type ExifData } from "libexif-wasm";
import { useDateFormatter } from "react-aria/useDateFormatter";

import { parseDateTimeEntries } from "#lib/exif/parseDateTimeEntries";
import { parseGpsDateTimeEntries } from "#lib/exif/parseGpsDateTimeEntries";
import { m } from "#paraglide/messages";
import {
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";
import {
  Tooltip,
  TooltipTarget,
  TooltipTrigger,
} from "@exifi/ui/components/Tooltip";

type ExifDateTimeInformationProps = {
  exifData: ExifData;
};

type DateTimeItem = { label: string; value: Temporal.ZonedDateTime };

const ExifDateTimeInformation = ({
  exifData,
}: ExifDateTimeInformationProps) => {
  const dateFormatter = useDateFormatter();

  const dateTimeItems = Array.from(
    [
      {
        label: m["exifInformation.dateAndTime"](),
        value: parseDateTimeEntries(exifData, "DATE_TIME"),
      },
      {
        label: m["exifInformation.dateAndTimeOriginal"](),
        value: parseDateTimeEntries(exifData, "DATE_TIME_ORIGINAL"),
      },
      {
        label: m["exifInformation.dateAndTimeDigitized"](),
        value: parseDateTimeEntries(exifData, "DATE_TIME_DIGITIZED"),
      },
      {
        label: m["exifInformation.dateAndTimeGps"](),
        value: parseGpsDateTimeEntries(exifData),
      },
    ]
      .reduce((acc, { label, value }) => {
        if (value !== null) {
          const key = dateFormatter.format(value.toInstant());
          // Deduplicate entries, priority goes to the first encountered
          if (!acc.has(key)) {
            acc.set(key, { label, value });
          }
        }
        return acc;
      }, new Map<string, DateTimeItem>())
      .values(),
  );

  return dateTimeItems.map(({ label, value }) => (
    <DataListItem key={label}>
      <DataListItemLabel>{label}</DataListItemLabel>
      <DataListItemValue>
        <TooltipTrigger>
          <TooltipTarget>
            <span role="button">
              <time dateTime={value.toString()}>
                {dateFormatter.format(value.toInstant())}
              </time>
            </span>
          </TooltipTarget>
          <Tooltip>{value.toLocaleString()}</Tooltip>
        </TooltipTrigger>
      </DataListItemValue>
    </DataListItem>
  ));
};

export { ExifDateTimeInformation, type ExifDateTimeInformationProps };
