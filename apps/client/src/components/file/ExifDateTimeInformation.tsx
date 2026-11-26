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
import { focusRing } from "@exifi/ui/utils/focusRing";

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
        label: m.files_exif_date_time(),
        value: parseDateTimeEntries(exifData, "DATE_TIME"),
      },
      {
        label: m.files_exif_date_time_original(),
        value: parseDateTimeEntries(exifData, "DATE_TIME_ORIGINAL"),
      },
      {
        label: m.files_exif_date_time_digitized(),
        value: parseDateTimeEntries(exifData, "DATE_TIME_DIGITIZED"),
      },
      {
        label: m.files_exif_date_time_gps(),
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
            <span
              className={focusRing({ className: "focus-visible:outline-2" })}
              role="button"
            >
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
