import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { getValueFromExifEntryObject } from "#lib/exif/getValueFromExifEntryObject";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";

type ExifEntryValidityProps = {
  exifEntryObject: ExifEntryObject;
  draft: number[];
} & ComponentPropsWithRef<"span">;

const ExifEntryValidity = ({
  className,
  exifEntryObject,
  draft,
  ...props
}: ExifEntryValidityProps) => {
  const expectedValue = getValueFromExifEntryObject({
    ...exifEntryObject,
    value: draft,
  });
  const isEmptyString = expectedValue === "";

  return (
    <span
      className={cn(
        { "text-muted-foreground italic": isEmptyString },
        className,
      )}
      {...props}
    >
      {!isEmptyString ? expectedValue : "(empty)"}
    </span>
  );
};

export { ExifEntryValidity, type ExifEntryValidityProps };
