import { useEffect, useEffectEvent, useState } from "react";

import { LatLng, type LeafletEvent, type Map as LeafletMap } from "leaflet";

// https://github.com/smeijer/leaflet-geosearch#results
type GeoSearchLocationEvent = LeafletEvent & {
  location?: {
    x: number; // lon
    y: number; // lat
    label: string;
    bounds: [
      [lat: number, lng: number], // s, w
      [lat: number, lng: number], // n, e
    ];
    raw: unknown; // raw provider result
  };
};

const useGeoSearchLocation = (map: LeafletMap | null) => {
  const [latLng, setLatLng] = useState<LatLng | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const setLocation = useEffectEvent((event: GeoSearchLocationEvent) => {
    if (
      "location" in event &&
      typeof event.location === "object" &&
      event.location !== null
    ) {
      if (
        "x" in event.location &&
        "y" in event.location &&
        typeof event.location.x === "number" &&
        typeof event.location.y === "number"
      ) {
        setLatLng(new LatLng(event.location.y, event.location.x));
      }
      if (
        "label" in event.location &&
        typeof event.location.label === "string"
      ) {
        setLabel(event.location.label);
      }
    }
  });

  useEffect(() => {
    map?.on("geosearch/showlocation", setLocation);

    return () => {
      map?.off("geosearch/showlocation", setLocation);
    };
  }, [map]);

  return {
    latLng,
    label,
  };
};

export { useGeoSearchLocation };
