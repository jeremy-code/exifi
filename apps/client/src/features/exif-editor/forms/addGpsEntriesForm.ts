import { formOptions } from "@tanstack/react-form";
import { type Tag } from "libexif-wasm";
import { z } from "zod";

import { Latitude, Longitude } from "#schemas/common";
import { MAX_UINT32_VALUE } from "@exifi/core/exif/constants";
import { parseCoordinateEntry } from "@exifi/core/exif/gps/parseCoordinateEntry";
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

  if (
    gpsEntries.LONGITUDE?.format !== "RATIONAL" ||
    gpsEntries.LONGITUDE_REF?.format !== "ASCII" ||
    gpsEntries.LATITUDE?.format !== "RATIONAL" ||
    gpsEntries.LATITUDE_REF?.format !== "ASCII"
  ) {
    throw new Error("Longitude or Latitude is in an invalid format");
  }

  const longitude =
    parseCoordinateEntry(
      gpsEntries.LONGITUDE.value,
      gpsEntries.LONGITUDE_REF.value,
    ) ?? undefined;
  const latitude =
    parseCoordinateEntry(
      gpsEntries.LATITUDE.value,
      gpsEntries.LATITUDE_REF.value,
    ) ?? undefined;

  if (gpsEntries.LATITUDE !== undefined) {
    if (
      gpsEntries.ALTITUDE?.format !== "RATIONAL" ||
      gpsEntries.ALTITUDE_REF?.format !== "BYTE"
    ) {
      throw new Error("Altitude is in an invalid format");
    }
    const altitude =
      parseCoordinateEntry(
        gpsEntries.ALTITUDE.value,
        gpsEntries.ALTITUDE_REF.formattedValue ?? "",
      ) ?? undefined;

    return { longitude, latitude, altitude };
  }

  return { longitude, latitude, altitude: undefined };
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
