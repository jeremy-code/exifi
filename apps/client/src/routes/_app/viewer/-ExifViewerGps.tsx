import { ExifIfd, type ExifData } from "libexif-wasm";
import { Marker, Popup } from "react-leaflet";

import { Map } from "#components/map/Map";
import { icon } from "#components/map/icon";
import { formatLatLngFromExif } from "#lib/exif/gps/formatLatLngFromExif";
import { getLatLngFromExif } from "#lib/exif/gps/getLatLngFromExif";

type ExifViewerGpsProps = {
  exifData: ExifData;
};

const ExifViewerGps = ({ exifData }: ExifViewerGpsProps) => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];

  if (exifDataGpsIfd.count === 0) {
    return null;
  }

  const coordinate = getLatLngFromExif(exifDataGpsIfd);

  return (
    <Map className="h-120 rounded" center={coordinate}>
      <Marker icon={icon} position={coordinate}>
        <Popup>
          {formatLatLngFromExif(exifDataGpsIfd)}{" "}
          <a
            href={`https://www.openstreetmap.org/#map=18/${coordinate.lat}/${coordinate.lng}`}
            target="_blank"
          >
            (OSM)
          </a>{" "}
          <a
            href={`geo:${coordinate.lat},${coordinate.lng}${coordinate.alt !== undefined ? `,${coordinate.alt}` : ""}`}
            target="_blank"
          >
            (geo)
          </a>
        </Popup>
      </Marker>
    </Map>
  );
};

export { ExifViewerGps };
