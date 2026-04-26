import { useMemo } from "react";

import type { LatLng } from "leaflet";

import type { components } from "#generated/nominatim";
import { $api } from "#lib/nominatim/api";

import { useDebouncedValue } from "./useDebouncedValue";

const useNominatimApiReverse = (coordinate: LatLng) => {
  const debouncedCoordinate = useDebouncedValue(coordinate, 500);
  const { data } = $api.useSuspenseQuery("get", "/reverse", {
    params: {
      query: {
        lat: debouncedCoordinate.lat,
        lon: debouncedCoordinate.lng,
        format: "geojson",
      },
    },
  });
  const feature = useMemo(() => {
    // Despite what OpenAPI says, features is undefined when nominatim returns an object
    // { "error":"Unable to geocode" }
    if (!("features" in data) || "error" in data) {
      return null;
    }

    const featureCollection = data as components["schemas"]["OSMGeocodeJson"];
    const feature = featureCollection.features.at(0);

    if (feature === undefined) {
      return null;
    }

    if (!("type" in feature) || feature.type !== "Feature") {
      return null;
    }

    return feature;
  }, [data]);

  return feature;
};

export { useNominatimApiReverse };
