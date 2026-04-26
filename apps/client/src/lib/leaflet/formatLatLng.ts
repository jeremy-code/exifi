import type { LatLng } from "leaflet";

import { decimalDegreesToDms } from "./decimalDegreesToDms";
import type { Axis } from "./interfaces";

const formatCoordinate = (decimal: number, axis: Axis): string => {
  const { degrees, minutes, seconds, direction } = decimalDegreesToDms(
    decimal,
    axis,
  );

  // Per https://en.wikipedia.org/wiki/Decimal_degrees#Precision, at 6 decimal
  // places, individual humans can be unambiguously recognized
  return `${degrees}°${minutes}\u2032${seconds.toFixed(4)}″ ${direction}`;
};

const formatLatLng = (latLng: LatLng) => {
  const formattedLatLng = `${formatCoordinate(latLng.lat, "lat")} ${formatCoordinate(latLng.lng, "lng")}`;

  return latLng.alt === undefined ?
      formattedLatLng
    : `${formattedLatLng} ${latLng.alt}m`;
};

export { formatLatLng };
