import { useCallback, useMemo, type ComponentPropsWithRef } from "react";

import { useForm } from "@tanstack/react-form";
import { LatLng } from "leaflet";
import type { Tag } from "libexif-wasm";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { useExifEditorStoreContext } from "#hooks/useExifEditor";
import { mapRationalArray } from "#lib/exif/mapRationalArray";
import type { ExifEntryObject } from "#lib/exif/serializeExifData";
import { dmsToDecimalDegrees } from "#lib/leaflet/dmsToDecimalDegrees";
import { isDirection } from "#lib/leaflet/interfaces";
import { Latitude, Longitude } from "#schemas/common";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { Button } from "@exifi/ui/components/Button";
import { Input } from "@exifi/ui/components/Input";
import { Label } from "@exifi/ui/components/Label";
import { Spinner } from "@exifi/ui/components/Spinner";

import { ExifGpsMap } from "../../gps/ExifGpsMap";

type ExifEntryAddGpsFormProps = ComponentPropsWithRef<"div">;

const toDecimalDegrees = (
  coordinate: ExifEntryObject,
  coordinateRef: ExifEntryObject,
) => {
  const [degrees, minutes, seconds] = mapRationalArray(coordinate.value);
  const direction = coordinateRef.formattedValue;
  if (
    degrees === undefined ||
    minutes === undefined ||
    seconds === undefined ||
    !isDirection(direction)
  ) {
    return null;
  }
  return dmsToDecimalDegrees({ degrees, minutes, seconds, direction });
};

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

  if (
    gpsEntries.LONGITUDE === undefined ||
    gpsEntries.LATITUDE === undefined ||
    gpsEntries.LONGITUDE_REF === undefined ||
    gpsEntries.LATITUDE_REF === undefined
  ) {
    return { longitude: undefined, latitude: undefined, altitude: undefined };
  }

  const longitude = toDecimalDegrees(
    gpsEntries.LONGITUDE,
    gpsEntries.LONGITUDE_REF,
  );
  const latitude = toDecimalDegrees(
    gpsEntries.LATITUDE,
    gpsEntries.LATITUDE_REF,
  );

  if (longitude === null || latitude === null) {
    return { longitude: undefined, latitude: undefined, altitude: undefined };
  }

  if (
    gpsEntries.ALTITUDE === undefined ||
    gpsEntries.ALTITUDE_REF === undefined
  ) {
    return { longitude, latitude, altitude: undefined };
  }

  const [absoluteAltitude] = mapRationalArray(gpsEntries.ALTITUDE.value);

  if (absoluteAltitude === undefined) {
    return { longitude, latitude, altitude: undefined };
  }

  const isSeaLevel = gpsEntries.ALTITUDE_REF.value[0] === 0;

  return {
    longitude,
    latitude,
    altitude: isSeaLevel ? absoluteAltitude : -absoluteAltitude,
  };
};

const gpsFormSchema = z.object({
  latitude: Latitude,
  longitude: Longitude,
  // TypeScript treats .optional() and union of undefined differently
  altitude: z.union([z.number(), z.undefined()]),
});

const ExifEntryAddGpsForm = (props: ExifEntryAddGpsFormProps) => {
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
  const form = useForm({
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
      form.setFieldValue("latitude", latLng.lat);
      form.setFieldValue("longitude", latLng.lng);
      form.setFieldValue("altitude", latLng.alt);
    },
    [form],
  );

  return (
    <div {...props}>
      <Button
        type="button"
        onClick={async () => {
          const currentPosition = await getCurrentPosition();
          setGpsForm(
            new LatLng(
              currentPosition.coords.latitude,
              currentPosition.coords.longitude,
              currentPosition.coords.altitude ?? undefined,
            ),
          );
        }}
      >
        Set latitude/longitude to current position
      </Button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <form.Field
            name="latitude"
            children={(field) => (
              <>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      field.handleChange(undefined);
                    } else if (!Number.isNaN(e.target.valueAsNumber)) {
                      field.handleChange(e.target.valueAsNumber);
                    }
                  }}
                />
              </>
            )}
          />
          <form.Field
            name="longitude"
            children={(field) => (
              <>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      field.handleChange(undefined);
                    } else if (!Number.isNaN(e.target.valueAsNumber)) {
                      field.handleChange(e.target.valueAsNumber);
                    }
                  }}
                />
              </>
            )}
          />
          <form.Field
            name="altitude"
            children={(field) => (
              <>
                <Label>Altitude</Label>
                <Input
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      field.handleChange(undefined);
                    } else if (!Number.isNaN(e.target.valueAsNumber)) {
                      field.handleChange(e.target.valueAsNumber);
                    }
                  }}
                />
              </>
            )}
          />
          <form.Subscribe
            selector={(state) => state.values}
            children={(values) => (
              <ExifGpsMap {...values} setCoordinate={setGpsForm} />
            )}
          />
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" variant="surface" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="absolute" />}
                <span
                  className="data-[pending=true]:invisible"
                  data-pending={isSubmitting}
                >
                  Submit
                </span>
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
};

export { ExifEntryAddGpsForm, type ExifEntryAddGpsFormProps };
