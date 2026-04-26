import { type ExifContent } from "libexif-wasm";
import { Marker } from "react-leaflet";

import { GpsPopup } from "#components/map/GpsPopup";
import { Map } from "#components/map/Map";
import { icon } from "#components/map/icon";
import { getLatLngFromExif } from "#lib/exif/gps/getLatLngFromExif";

type ExifGpsMapProps = {
  exifDataGps: ExifContent;
};

const ExifGpsMap = ({ exifDataGps }: ExifGpsMapProps) => {
  const coordinate = getLatLngFromExif(exifDataGps);

  return (
    <Map className="h-120 rounded" center={coordinate}>
      <Marker icon={icon} position={coordinate}>
        <GpsPopup coordinate={coordinate} />
      </Marker>
    </Map>
  );
};

export { ExifGpsMap, type ExifGpsMapProps };
