import { LatLng, LatLngBounds } from "leaflet";
import { create } from "zustand";

// https://github.com/smeijer/leaflet-geosearch#results
type GeoSearchLocationEvent = {
  type: "geosearch/showlocation";
  location: {
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

type GeoSearchLocationStore = {
  location: {
    latLng: LatLng;
    label: string;
    bounds: LatLngBounds;
  } | null;
  setLocationFromEvent: (event: GeoSearchLocationEvent) => void;
};

const useGeoSearchLocationStore = create<GeoSearchLocationStore>((set) => ({
  location: null,
  setLocationFromEvent: (event) => {
    set((state) => {
      const prevLocation = state.location;
      const nextLocation = {
        latLng: new LatLng(event.location.y, event.location.x),
        label: event.location.label,
        bounds: new LatLngBounds(
          event.location.bounds[0],
          event.location.bounds[1],
        ),
      };

      if (prevLocation === null) {
        return {
          location: nextLocation,
        };
      }

      return {
        location: {
          // Only update reference if necessary
          latLng: prevLocation.latLng.equals(nextLocation.latLng)
            ? prevLocation.latLng
            : nextLocation.latLng,
          label: nextLocation.label,
          bounds: prevLocation.bounds.equals(nextLocation.bounds)
            ? prevLocation.bounds
            : nextLocation.bounds,
        },
      };
    });
  },
}));

export {
  useGeoSearchLocationStore,
  type GeoSearchLocationStore,
  type GeoSearchLocationEvent,
};
