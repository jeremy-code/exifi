import { formOptions } from "@tanstack/react-form";
import type { Tag } from "libexif-wasm";
import * as z from "zod";

import { MAX_UINT32_VALUE } from "@exifi/core/exif/constants";
import { parseCoordinateEntry } from "@exifi/core/exif/gps/parseCoordinateEntry";
import type {
  ExifDataObject,
  ExifEntryObject,
} from "@exifi/core/exif/interfaces";
import { latitudeSchema, longitudeSchema } from "@exifi/schemas/geo";
import { toastQueue } from "@exifi/ui/components/Toast";

const gpsFormSchema = z.strictObject({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
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
    gpsEntries.LONGITUDE === undefined &&
    gpsEntries.LATITUDE === undefined &&
    gpsEntries.LONGITUDE_REF === undefined &&
    gpsEntries.LATITUDE_REF === undefined
  ) {
    toastQueue.add(
      {
        title: "No GPS Exif entries found",
        description: "Initializing default values...",
      },
      { timeout: 5_000 /* 5 seconds */ },
    );
    /**
     * This defaults to the geographic center of the United States (including
     * Alaska, Hawaii): 44° 58′ 2.08″ N, 103° 46′ 17.6″ W.
     *
     * @see {@link https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl?PidBox=PU2386}
     * @see {@link https://geohack.toolforge.org/geohack.php?pagename=Geographic_center_of_the_United_States&params=44_58_2.08_N_103_46_17.60_W_}
     */
    return {
      longitude: -103.77155634166667,
      latitude: 44.967243394444445,
    };
  }

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

  if (gpsEntries.ALTITUDE !== undefined) {
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
