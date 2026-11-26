import { formOptions } from "@tanstack/react-form";
import type { Tag } from "libexif-wasm";
import * as z from "zod";

import { m } from "#paraglide/messages";
import { getLocale } from "#paraglide/runtime";
import { MAX_UINT32_VALUE } from "@exifi/core/exif/constants";
import { parseCoordinateEntry } from "@exifi/core/exif/gps/parseCoordinateEntry";
import type {
  ExifDataObject,
  ExifEntryObject,
} from "@exifi/core/exif/interfaces";
import { toastQueue } from "@exifi/ui/components/Toast";

const altitudeRangeMessage = () => {
  const numberFormat = new Intl.NumberFormat(getLocale());
  return m.editor_gps_altitude_range({
    min: numberFormat.format(-MAX_UINT32_VALUE),
    max: numberFormat.format(MAX_UINT32_VALUE),
  });
};

const gpsFormSchema = z.strictObject({
  latitude: z
    .number({ error: () => m.editor_gps_latitude_required() })
    .min(-90, { error: () => m.editor_gps_latitude_min() })
    .max(90, { error: () => m.editor_gps_latitude_max() }),
  longitude: z
    .number({ error: () => m.editor_gps_longitude_required() })
    .min(-180, { error: () => m.editor_gps_longitude_min() })
    .max(180, { error: () => m.editor_gps_longitude_max() }),
  altitude: z
    .number({ error: () => m.editor_gps_altitude_invalid() })
    .min(-MAX_UINT32_VALUE, { error: altitudeRangeMessage })
    .max(MAX_UINT32_VALUE, { error: altitudeRangeMessage })
    .optional(),
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
        title: m.editor_gps_toast_none_title(),
        description: m.editor_gps_toast_none_description(),
        toastProps: { variant: "surface" },
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
    throw new Error(m.editor_gps_error_invalid_coordinates());
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
      throw new Error(m.editor_gps_error_invalid_altitude());
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
