import { useEffect, useEffectEvent, useState } from "react";

import { LatLng, type Map as LeafletMap } from "leaflet";
import { cn } from "tailwind-variants";

import { DraggableMarker } from "#components/map/DraggableMarker";
import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { GpsPopup } from "#components/map/GpsPopup";
import { Map, type MapProps } from "#components/map/Map";
import { useGeoSearchLocation } from "#hooks/useGeoSearchLocation";
import {
  useGeoSearchLocationStore,
  type GeoSearchLocationStore,
} from "#stores/geoSearchLocationStore";

type ExifGpsMapProps = {
  coordinate: LatLng | undefined;
  setCoordinate: (coordinate: LatLng) => void;
} & MapProps;

const ExifGpsMap = ({
  className,
  coordinate,
  setCoordinate,
  ...props
}: ExifGpsMapProps) => {
  // Use label from the store if the coordinate is the same, otherwise undefined
  // (uses Nominatim API to get the label)
  const label = useGeoSearchLocationStore((state) =>
    coordinate !== undefined && state.location?.latLng.equals(coordinate)
      ? state.location.label
      : undefined,
  );
  const [map, setMap] = useState<LeafletMap | null>(null);
  useGeoSearchLocation(map);

  const onLocationChange = useEffectEvent(
    ({ location }: GeoSearchLocationStore) => {
      if (
        location !== null &&
        (coordinate === undefined || !location.latLng.equals(coordinate))
      ) {
        setCoordinate(location.latLng);
      }
    },
  );

  // Leaflet Map isn't controlled by map, so center={coordinate} does not update
  // as expected. Hence, using useEffect to pan whenenvr the coordinate changes
  useEffect(() => {
    if (coordinate !== undefined && map !== null) {
      map.panTo(coordinate);
    }
  }, [map, coordinate]);

  useEffect(() => {
    const unsubscribe = useGeoSearchLocationStore.subscribe(onLocationChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Map
      className={cn("h-65 rounded", className)}
      center={coordinate}
      ref={setMap}
      {...props}
    >
      <GeoSearchControl showMarker={false} />
      {coordinate !== undefined && (
        <DraggableMarker
          position={coordinate}
          onDragEnd={(event) => {
            const newCoordinate = event.target.getLatLng();
            if (coordinate === undefined || !newCoordinate.equals(coordinate)) {
              setCoordinate(newCoordinate);
            }
          }}
        >
          <GpsPopup coordinate={coordinate} label={label} />
        </DraggableMarker>
      )}
    </Map>
  );
};

export { ExifGpsMap, type ExifGpsMapProps };
