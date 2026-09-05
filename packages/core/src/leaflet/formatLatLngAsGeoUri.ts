import type { LatLng } from "leaflet";

/**
 * @see {@link https://en.wikipedia.org/wiki/Geo_URI_scheme}
 */
const formatLatLngAsGeoUri = (coordinate: LatLng) => {
  const geoUri = `geo:0,0?q=${coordinate.lat},${coordinate.lng}`;

  return coordinate.alt !== undefined ? `${geoUri},${coordinate.alt}` : geoUri;
};

export { formatLatLngAsGeoUri };
