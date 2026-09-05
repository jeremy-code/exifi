import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import type { ExifEntryObject } from "@exifi/core/exif/interfaces";
import { getValueFromEntryObject } from "@exifi/core/exif/utils/getValueFromEntryObject";

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
