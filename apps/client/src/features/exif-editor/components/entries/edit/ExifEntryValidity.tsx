import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { m } from "#paraglide/messages";
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
      {!isEmptyString ? expectedValue : m.editor_validity_empty()}
    </span>
  );
};

export { ExifEntryValidity, type ExifEntryValidityProps };
