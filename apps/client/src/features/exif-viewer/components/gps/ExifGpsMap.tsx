import { ExifIfd, type ExifData } from "libexif-wasm";
import { Marker, Popup } from "react-leaflet";

import { Map } from "#components/map/Map";
import { icon } from "#components/map/icon";
import { getLatLngFromExif } from "#lib/exif/gps/getLatLngFromExif";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { formatLatLngAsGeoUri } from "#lib/leaflet/formatLatLngAsGeoUri";

type ExifGpsMapProps = {
  exifData: ExifData;
};

const ExifGpsMap = ({ exifData }: ExifGpsMapProps) => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];

  if (exifDataGpsIfd.count === 0) {
    return null;
  }

  const coordinate = getLatLngFromExif(exifDataGpsIfd);

  return (
    <Map className="h-120 rounded" center={coordinate}>
      <Marker icon={icon} position={coordinate}>
        <Popup>
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
