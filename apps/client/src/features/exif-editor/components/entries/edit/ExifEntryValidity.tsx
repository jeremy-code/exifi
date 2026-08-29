import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { getValueFromEntryObject } from "#lib/exif/utils/getValueFromEntryObject";
import type { ExifEntryObject } from "@exifi/core/exif/interfaces";

type ExifEntryValidityProps = {
  exifEntryObject: ExifEntryObject;
} & ComponentPropsWithRef<"span">;

const ExifEntryValidity = ({
  className,
  exifEntryObject,
  ...props
}: ExifEntryValidityProps) => {
  const expectedValue = getValueFromEntryObject(exifEntryObject);
  const isEmptyString = expectedValue === "";

  return (
    <span
      className={cn({ "text-fg-muted italic": isEmptyString }, className)}
      {...props}
    >
      {!isEmptyString ? expectedValue : "(empty)"}
    </span>
  );
};

export { ExifEntryValidity, type ExifEntryValidityProps };
