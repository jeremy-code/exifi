import { type ComponentPropsWithRef } from "react";

import { LatLng } from "leaflet";

import { useExifEntryAddGpsForm } from "#features/exif-editor/hooks/useExifEntryAddGpsForm";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { Button } from "@exifi/ui/components/Button";
import { Input } from "@exifi/ui/components/Input";
import { Label } from "@exifi/ui/components/Label";
import { Spinner } from "@exifi/ui/components/Spinner";

import { ExifGpsMap } from "../../gps/ExifGpsMap";

type ExifEntryAddGpsFormProps = ComponentPropsWithRef<"div">;

const ExifEntryAddGpsForm = (props: ExifEntryAddGpsFormProps) => {
  const { gpsForm, setGpsForm } = useExifEntryAddGpsForm();

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
          void gpsForm.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <gpsForm.Field
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
          <gpsForm.Field
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
          <gpsForm.Field
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
          <gpsForm.Subscribe
            selector={(state) => state.values}
            children={(values) => (
              <ExifGpsMap {...values} setCoordinate={setGpsForm} />
            )}
          />
          <gpsForm.Subscribe
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
