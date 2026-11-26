import { createControlComponent } from "@react-leaflet/core";
import {
  GeoSearchControl as createGeoSearchControlInstance,
  OpenStreetMapProvider,
} from "leaflet-geosearch";

import { m } from "#paraglide/messages";

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
    autoComplete: true,
    autoCompleteDelay: DEFAULT_AUTOCOMPLETE_DELAY,
    searchLabel: m.viewer_map_search_label(),
    clearSearchLabel: m.viewer_map_search_clear(),
    providerSelectLabel: m.viewer_map_search_provider(),
    ...props,
    marker: { icon, ...props.marker },
  });
};

const GeoSearchControl = createControlComponent(createGeoSearchControl);

export { GeoSearchControl, type GeoSearchControlProps };
