import type { LatLng } from "leaflet";

/**
 * @see {@link https://wiki.openstreetmap.org/wiki/Browsing#Sharing_a_link_to_the_maps}
 */
const formatLatLngAsOsmUrl = (latLng: LatLng) => {
  return new URL(
    `https://www.openstreetmap.org/?${new URLSearchParams({
      // Latitude and longitude of marker
      mlat: latLng.lat.toString(),
      mlon: latLng.lng.toString(),
    }).toString()}#map=16/${latLng.lat}/${latLng.lng}`, // Zoom level and center of map
  );
};

export { formatLatLngAsOsmUrl };
