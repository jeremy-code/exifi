import { useEffect, useMemo, useState } from "react";

import { LatLng, type Map as LeafletMap } from "leaflet";
import { Popup } from "react-leaflet";
import { cn } from "tailwind-variants";

import { DraggableMarker } from "#components/map/DraggableMarker";
import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { Map, type MapProps } from "#components/map/Map";
import { useDebouncedValue } from "#hooks/useDebouncedValue";
import { useGeoSearchLocation } from "#hooks/useGeoSearchLocation";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { formatLatLngAsGeoUri } from "#lib/leaflet/formatLatLngAsGeoUri";
import { $api } from "#lib/nominatim/api";

const ExifGpsMapLabel = ({ coordinate }: { coordinate: LatLng }) => {
  const debouncedCoordinate = useDebouncedValue(coordinate);

  const { data } = $api.useSuspenseQuery("get", "/reverse", {
    params: {
      query: {
        lat: debouncedCoordinate.lat,
        lon: debouncedCoordinate.lng,
        format: "geojson",
      },
    },
  });
  const displayName = useMemo(() => {
    const feature = data.features?.at(0);

    return (
        feature !== undefined &&
          feature.properties !== undefined &&
          "display_name" in feature.properties &&
          typeof feature.properties.display_name === "string"
      ) ?
        feature.properties.display_name
      : null;
  }, [data]);

  return displayName;
};

type ExifGpsMapProps = {
  latitude: number | undefined;
  longitude: number | undefined;
  altitude: number | undefined;
  setCoordinate: (coordinate: LatLng) => void;
} & MapProps;

const ExifGpsMap = ({
  className,
  latitude,
  longitude,
  altitude,
  setCoordinate,
  ...props
}: ExifGpsMapProps) => {
  const coordinate = useMemo(
    () =>
      latitude !== undefined && longitude !== undefined ?
        new LatLng(latitude, longitude, altitude)
      : undefined,
    [latitude, longitude, altitude],
  );
  const [map, setMap] = useState<LeafletMap | null>(null);
  const { label, latLng: geoSearchLocationLatLng } = useGeoSearchLocation(
    map,
    ({ location }) => {
      const newLatLng = new LatLng(location.y, location.x, coordinate?.alt);
      if (coordinate === undefined || !coordinate.equals(newLatLng)) {
        setCoordinate(newLatLng);
      }
    },
  );

  // Leaflet Map isn't controlled by map, so center={coordinate} does not update
  // as expected. Hence, using useEffect to pan whenenvr the coordinate changes
  useEffect(() => {
    if (coordinate !== undefined) {
      map?.panTo(coordinate);
    }
  }, [map, coordinate]);

  return (
    <Map
      className={cn("h-80 rounded", className)}
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
          <Popup>
            {label !== null && geoSearchLocationLatLng?.equals(coordinate) ?
              label
            : <ExifGpsMapLabel coordinate={coordinate} />}
            {`\n`}
            {`${formatLatLng(coordinate)} `}
            <a
              href={`https://www.openstreetmap.org/#map=18/${coordinate.lat}/${coordinate.lng}`}
              target="_blank"
            >
              (OSM)
            </a>{" "}
            <a href={formatLatLngAsGeoUri(coordinate)} target="_blank">
              (geo)
            </a>
          </Popup>
        </DraggableMarker>
      )}
    </Map>
  );
};

export { ExifGpsMap, type ExifGpsMapProps };
