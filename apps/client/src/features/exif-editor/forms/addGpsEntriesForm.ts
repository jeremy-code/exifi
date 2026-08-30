import { formOptions } from "@tanstack/react-form";
import type { Tag } from "libexif-wasm";
import { z } from "zod";

import { parseCoordinateEntry } from "#lib/exif/gps/parseCoordinateEntry";
import { Latitude, Longitude } from "#schemas/common";
import { MAX_UINT32_VALUE } from "@exifi/core/exif/constants";
import type {
  ExifDataObject,
  ExifEntryObject,
} from "@exifi/core/exif/interfaces";

const gpsFormSchema = z.strictObject({
  latitude: Latitude,
  longitude: Longitude,
  altitude: z.number().min(-MAX_UINT32_VALUE).max(MAX_UINT32_VALUE).optional(),
});

type GpsFieldValues = Partial<z.infer<typeof gpsFormSchema>>;

const getInitialGpsFieldValues = (
  exifDataObjectGpsIfd: ExifEntryObject[],
): GpsFieldValues => {
  const gpsEntries = exifDataObjectGpsIfd.reduce<
    Partial<Record<Tag, ExifEntryObject>>
  >((acc, prevValue) => {
    acc[prevValue.tag] = prevValue;
    return acc;
  }, {});

  // TODO: Update this to use .value instead of .dataAsTypedArray
  const longitude =
    parseCoordinateEntry(
      gpsEntries.LONGITUDE?.dataAsTypedArray ?? [],
      gpsEntries.LONGITUDE_REF?.formattedValue ?? "",
    ) ?? undefined;
  const latitude =
    parseCoordinateEntry(
      gpsEntries.LATITUDE?.dataAsTypedArray ?? [],
      gpsEntries.LATITUDE_REF?.formattedValue ?? "",
    ) ?? undefined;
  const altitude =
    parseCoordinateEntry(
      gpsEntries.ALTITUDE?.dataAsTypedArray ?? [],
      gpsEntries.ALTITUDE_REF?.formattedValue ?? "",
    ) ?? undefined;

  return { longitude, latitude, altitude };
};

const addGpsEntriesFormOptions = (exifDataObject: ExifDataObject) => {
  return formOptions({
    defaultValues: getInitialGpsFieldValues(exifDataObject.ifd.GPS),
    validators: {
      onSubmit: gpsFormSchema,
    },
  });
};

export { gpsFormSchema, type GpsFieldValues, addGpsEntriesFormOptions };
