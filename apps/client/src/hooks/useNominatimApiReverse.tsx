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
    headers: {
      // https://operations.osmfoundation.org/policies/nominatim/
      "User-Agent": "exifi",
    },
  });
  const feature = useMemo(() => {
    // Despite what OpenAPI says, features is undefined when nominatim returns an object
    // { "error":"Unable to geocode" }
    if (!("features" in data) || "error" in data) {
      return null;
    }

    const featureCollection = data as components["schemas"]["OSMGeocodeJson"];
    const firstFeature = featureCollection.features.at(0);

    if (firstFeature === undefined) {
      return null;
    }

    if (!("type" in firstFeature) || firstFeature.type !== "Feature") {
      return null;
    }

    return firstFeature;
  }, [data]);

  return feature;
};

export { useNominatimApiReverse };
