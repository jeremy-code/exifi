import { useCallback, useMemo } from "react";

import { useForm } from "@tanstack/react-form";
import { LatLng } from "leaflet";
import type { Tag } from "libexif-wasm";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { parseCoordinateEntry } from "#lib/exif/gps/parseCoordinateEntry";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { Latitude, Longitude } from "#schemas/common";

import { useExifEditorStoreContext } from "./useExifEditor";

const gpsFormSchema = z.object({
  latitude: Latitude,
  longitude: Longitude,
  // TypeScript treats .optional() and union of undefined differently
  altitude: z.union([z.number(), z.undefined()]),
});

type FieldValues = {
  latitude: number | undefined;
  longitude: number | undefined;
  altitude: number | undefined;
};

const getInitialFieldValues = (
  exifDataObjectGpsIfd: ExifEntryObject[],
): FieldValues => {
  const gpsEntries = exifDataObjectGpsIfd.reduce<
    Partial<Record<Tag, ExifEntryObject>>
  >((acc, prevValue) => {
    acc[prevValue.tag] = prevValue;
    return acc;
  }, {});
  const longitude =
    parseCoordinateEntry(
      gpsEntries.LONGITUDE?.value ?? [],
      gpsEntries.LONGITUDE_REF?.formattedValue ?? "",
    ) ?? undefined;
  const latitude =
    parseCoordinateEntry(
      gpsEntries.LATITUDE?.value ?? [],
      gpsEntries.LATITUDE_REF?.formattedValue ?? "",
    ) ?? undefined;
  const altitude =
    parseCoordinateEntry(
      gpsEntries.ALTITUDE?.value ?? [],
      gpsEntries.ALTITUDE_REF?.formattedValue ?? "",
    ) ?? undefined;

  return { longitude, latitude, altitude };
};

const useExifEntryAddGpsForm = () => {
  const { updateLatLng, exifDataObject } = useExifEditorStoreContext(
    useShallow((state) => ({
      updateLatLng: state.updateLatLng,
      exifDataObject: state.exifDataObject,
    })),
  );
  const initialFormValues = useMemo(
    () => getInitialFieldValues(exifDataObject.ifd.GPS),
    [exifDataObject],
  );
  const gpsForm = useForm({
    defaultValues: initialFormValues,
    onSubmit: ({ value }) => {
      if (value.latitude !== undefined && value.longitude !== undefined) {
        updateLatLng(
          new LatLng(value.latitude, value.longitude, value.altitude),
        );
      }
    },
    validators: { onSubmit: gpsFormSchema },
  });

  const setGpsForm = useCallback(
    (latLng: LatLng) => {
      gpsForm.setFieldValue("latitude", latLng.lat);
      gpsForm.setFieldValue("longitude", latLng.lng);

      // Retain previous altitude if undefined
      if (latLng.alt !== undefined) {
        gpsForm.setFieldValue("altitude", latLng.alt);
      }
    },
    [gpsForm],
  );

  return { gpsForm, setGpsForm };
};

export { useExifEntryAddGpsForm };
