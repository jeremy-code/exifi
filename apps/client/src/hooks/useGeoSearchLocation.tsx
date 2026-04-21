import { useEffect, useEffectEvent, useState } from "react";

import { LatLng, LatLngBounds, type LeafletEvent, type Map } from "leaflet";

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

const useGeoSearchLocation = (map: Map | null) => {
  const [latLng, setLatLng] = useState<LatLng | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const setLocation = useEffectEvent((event: GeoSearchLocationEvent) => {
    if (
      "location" in event &&
      typeof event.location === "object" &&
      event.location !== null
    ) {
      const newLatLng = new LatLng(event.location.y, event.location.x);
      if (latLng === null || !latLng.equals(newLatLng)) {
        setLatLng(newLatLng);
      }
      setLabel(event.location.label);
      const newBounds = new LatLngBounds(
        new LatLng(event.location.bounds[0][0], event.location.bounds[0][1]),
        new LatLng(event.location.bounds[1][0], event.location.bounds[1][1]),
      );
      if (bounds === null || !bounds.equals(newBounds)) {
        setBounds(newBounds);
      }
    }
  });

  useEffect(() => {
    map?.on("geosearch/showlocation", setLocation);

    return () => {
      map?.off("geosearch/showlocation", setLocation);
    };
  }, [map]);

  return { latLng, label, bounds };
};

export { useGeoSearchLocation };
