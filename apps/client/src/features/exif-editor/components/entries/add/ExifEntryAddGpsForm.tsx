import { useCallback, type ComponentPropsWithRef } from "react";

import { useForm } from "@tanstack/react-form";
import { LatLng } from "leaflet";
import { useListFormatter } from "react-aria/useListFormatter";
import { cn } from "tailwind-variants";
import { useShallow } from "zustand/react/shallow";

import { useExifEditor } from "#features/exif-editor/contexts/ExifEditorContext";
import { addGpsEntriesFormOptions } from "#features/exif-editor/forms/addGpsEntriesForm";
import { useDialogBlockerStore } from "#stores/dialogBlockerStore";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { updateLatLng } from "@exifi/core/exif/actions/updateLatLng";
import { Button } from "@exifi/ui/components/Button";
import { NumberField } from "@exifi/ui/components/NumberField";
import { Spinner } from "@exifi/ui/components/Spinner";

import { ExifGpsMap } from "../../gps/ExifGpsMap";

type ExifEntryAddGpsFormProps = ComponentPropsWithRef<"div">;

const ExifEntryAddGpsForm = ({
  className,
  ...props
}: ExifEntryAddGpsFormProps) => {
  const setIsDialogBlocked = useDialogBlockerStore(
    (state) => state.setIsDialogBlocked,
  );
  const listFormatter = useListFormatter({
    style: "short",
    type: "conjunction",
  });
  const { exifData, exifDataObject, updateExifDataObject } = useExifEditor(
    useShallow((state) => ({
      exifData: state.exifData,
      exifDataObject: state.exifDataObject,
      updateExifDataObject: state.updateExifDataObject,
    })),
  );
  const gpsForm = useForm({
    ...addGpsEntriesFormOptions(exifDataObject),
    onSubmit: ({ value }) => {
      if (value.latitude !== undefined && value.longitude !== undefined) {
        updateLatLng(
          exifData,
          new LatLng(value.latitude, value.longitude, value.altitude),
        );
        updateExifDataObject();
        gpsForm.reset();
        setIsDialogBlocked(false);
      }
    },
    listeners: {
      onChange: (props) => {
        setIsDialogBlocked(!props.formApi.state.isDefaultValue);
      },
    },
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

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Button
        className="max-w-sm"
        type="button"
        onPress={async () => {
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
      <gpsForm.Subscribe selector={(state) => state.values}>
        {(values) => (
          <ExifGpsMap
            coordinate={
              values.latitude !== undefined && values.longitude !== undefined
                ? new LatLng(values.latitude, values.longitude, values.altitude)
                : undefined
            }
            setCoordinate={setGpsForm}
          />
        )}
      </gpsForm.Subscribe>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void gpsForm.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <gpsForm.Field name="latitude">
            {(field) => (
              <NumberField
                label="Latitude"
                value={field.state.value}
                onBlur={field.handleBlur}
                minValue={-90}
                maxValue={90}
                onChange={(value) => {
                  field.handleChange(!Number.isNaN(value) ? value : undefined);
                }}
                formatOptions={{
                  style: "unit",
                  unit: "degree",
                  unitDisplay: "narrow",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                }}
                isInvalid={!field.state.meta.isValid}
                errorMessage={
                  field.state.meta.errors.length > 0
                    ? listFormatter.format(
                        field.state.meta.errors
                          .filter((issue) => issue !== undefined)
                          .map((issue) => issue.message),
                      )
                    : undefined
                }
              />
            )}
          </gpsForm.Field>
          <gpsForm.Field name="longitude">
            {(field) => (
              <NumberField
                label="Longitude"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(value) => {
                  field.handleChange(!Number.isNaN(value) ? value : undefined);
                }}
                minValue={-180}
                maxValue={180}
                formatOptions={{
                  style: "unit",
                  unit: "degree",
                  unitDisplay: "narrow",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 6,
                }}
                isInvalid={!field.state.meta.isValid}
                errorMessage={
                  field.state.meta.errors.length > 0
                    ? listFormatter.format(
                        field.state.meta.errors
                          .filter((issue) => issue !== undefined)
                          .map((issue) => issue.message),
                      )
                    : undefined
                }
              />
            )}
          </gpsForm.Field>
          <gpsForm.Field name="altitude">
            {(field) => (
              <NumberField
                label="Altitude"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(value) => {
                  field.handleChange(!Number.isNaN(value) ? value : undefined);
                }}
                formatOptions={{ style: "unit", unit: "meter" }}
                isInvalid={!field.state.meta.isValid}
                errorMessage={
                  field.state.meta.errors.length > 0
                    ? listFormatter.format(
                        field.state.meta.errors
                          .filter((issue) => issue !== undefined)
                          .map((issue) => issue.message),
                      )
                    : undefined
                }
              />
            )}
          </gpsForm.Field>
          <gpsForm.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" variant="surface" isDisabled={isSubmitting}>
                {isSubmitting && <Spinner className="absolute" />}
                <span
                  className="data-[pending=true]:invisible"
                  data-pending={isSubmitting}
                >
                  Submit
                </span>
              </Button>
            )}
          </gpsForm.Subscribe>
        </div>
      </form>
    </div>
  );
};

export { ExifEntryAddGpsForm, type ExifEntryAddGpsFormProps };
