import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { LatLng } from "leaflet";

import { reverseOptions } from "#generated/nominatim/@tanstack/react-query.gen";
import { nominatimClient } from "#lib/nominatim/api";

import { useDebouncedValue } from "./useDebouncedValue";

const useNominatimApiReverse = (coordinate: LatLng) => {
  const debouncedCoordinate = useDebouncedValue(coordinate, 500);
  const { data } = useSuspenseQuery({
    ...reverseOptions({
      query: {
        lat: debouncedCoordinate.lat,
        lon: debouncedCoordinate.lng,
        format: "geojson",
      },
      client: nominatimClient,
    }),
  });
  const feature = useMemo(() => {
    // Despite what OpenAPI says, features is undefined when nominatim returns an object
    // { "error":"Unable to geocode" }
    if (!("features" in data) || "error" in data) {
      return null;
    }

    return data.features.at(0) ?? null;
  }, [data]);

  return feature;
};

export { useNominatimApiReverse };
