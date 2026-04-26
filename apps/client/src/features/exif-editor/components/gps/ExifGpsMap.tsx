import { Suspense, useEffect, useMemo, useState } from "react";

import { LatLng, type Map as LeafletMap } from "leaflet";
import { Link, LocateFixed, MapPin } from "lucide-react";
import { Popup } from "react-leaflet";
import { cn } from "tailwind-variants";

import { DraggableMarker } from "#components/map/DraggableMarker";
import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { Map, type MapProps } from "#components/map/Map";
import { useGeoSearchLocation } from "#hooks/useGeoSearchLocation";
import { useNominatimApiReverse } from "#hooks/useNominatimApiReverse";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { formatLatLngAsGeoUri } from "#lib/leaflet/formatLatLngAsGeoUri";
import { Skeleton } from "@exifi/ui/components/Skeleton";

const ExifGpsMapLabel = ({ coordinate }: { coordinate: LatLng }) => {
  const feature = useNominatimApiReverse(coordinate);

  return feature?.properties?.display_name ?? null;
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
            <div className="flex flex-col gap-1">
              <div>
                <div className="flex gap-2">
                  <div className="shrink-0 p-px">
                    <MapPin className="size-4" />
                  </div>
                  {(
                    label !== null &&
                    geoSearchLocationLatLng?.equals(coordinate)
                  ) ?
                    label
                  : <Suspense
                      fallback={<Skeleton className="h-[1em] w-full" />}
                    >
                      <ExifGpsMapLabel coordinate={coordinate} />
                    </Suspense>
                  }
                </div>
              </div>
              <div className="flex gap-2">
                <div className="shrink-0 p-px">
                  <LocateFixed className="size-4" />
                </div>
                <div>{`${formatLatLng(coordinate)} `}</div>
              </div>
              <div className="flex gap-2">
                <div className="shrink-0 p-px">
                  <Link className="size-4" />
                </div>
                <div>
                  <div className="flex gap-0.5">
                    <a
                      href={`https://www.openstreetmap.org/#map=18/${coordinate.lat}/${coordinate.lng}`}
                      target="_blank"
                    >
                      OpenStreetMap
                    </a>
                    {"•"}
                    <a href={formatLatLngAsGeoUri(coordinate)} target="_blank">
                      geo URI
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </DraggableMarker>
      )}
    </Map>
  );
};

export { ExifGpsMap, type ExifGpsMapProps };
