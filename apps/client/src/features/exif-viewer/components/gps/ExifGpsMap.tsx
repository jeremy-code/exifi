import { useMemo } from "react";

import { type ExifContent } from "libexif-wasm";
import { Marker, Popup } from "react-leaflet";

import { Map } from "#components/map/Map";
import { icon } from "#components/map/icon";
import { getLatLngFromExif } from "#lib/exif/gps/getLatLngFromExif";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { formatLatLngAsGeoUri } from "#lib/leaflet/formatLatLngAsGeoUri";
import { $api } from "#lib/nominatim/api";

type ExifGpsMapProps = {
  exifDataGps: ExifContent;
};

const ExifGpsMap = ({ exifDataGps }: ExifGpsMapProps) => {
  const coordinate = getLatLngFromExif(exifDataGps);

  const { data } = $api.useSuspenseQuery("get", "/reverse", {
    params: {
      query: {
        lat: coordinate.lat,
        lon: coordinate.lng,
        format: "geojson",
      },
    },
  });
  const displayName = useMemo(() => {
    const feature = data.features.at(0);

    return (
        feature !== undefined &&
          feature.properties !== undefined &&
          "display_name" in feature.properties &&
          typeof feature.properties.display_name === "string"
      ) ?
        feature.properties.display_name
      : null;
  }, [data]);

  return (
    <Map className="h-120 rounded" center={coordinate}>
      <Marker icon={icon} position={coordinate}>
        <Popup>
          {displayName !== null ?
            <p>{displayName}</p>
          : null}
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
      </Marker>
    </Map>
  );
};

export { ExifGpsMap, type ExifGpsMapProps };
