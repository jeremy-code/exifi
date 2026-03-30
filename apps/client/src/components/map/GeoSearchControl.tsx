import { createControlComponent } from "@react-leaflet/core";
import {
  GeoSearchControl as createGeoSearchControlInstance,
  OpenStreetMapProvider,
} from "leaflet-geosearch";

import { icon } from "./icon";

const DEFAULT_AUTOCOMPLETE_DELAY = 250;

type GeoSearchControlProps = Partial<
  ReturnType<typeof createGeoSearchControlInstance>["options"]
>;

const createGeoSearchControl = (props: GeoSearchControlProps) => {
  const osmProvider = new OpenStreetMapProvider();

  return createGeoSearchControlInstance({
    provider: osmProvider,
    style: "bar",
    marker: { icon },
    autoComplete: true,
    autoCompleteDelay: DEFAULT_AUTOCOMPLETE_DELAY,
    ...props,
  });
};

const GeoSearchControl = createControlComponent(createGeoSearchControl);

export { GeoSearchControl, type GeoSearchControlProps };
