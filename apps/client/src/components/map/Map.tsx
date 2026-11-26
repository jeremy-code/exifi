import type { ComponentPropsWithRef } from "react";

import { AttributionControl, MapContainer, ZoomControl } from "react-leaflet";
import { cn } from "tailwind-variants";

import { m } from "#paraglide/messages";

import { OsmTileLayer } from "./OsmTileLayer";

const DEFAULT_ZOOM = 13;

type MapProps = ComponentPropsWithRef<typeof MapContainer>;

const escapeHtmlAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const Map = ({ className, children, zoom, ...props }: MapProps) => {
  return (
    <MapContainer
      className={cn("z-0", className)}
      zoom={zoom ?? DEFAULT_ZOOM}
      zoomControl={false}
      attributionControl={false}
      {...props}
    >
      <ZoomControl
        zoomInTitle={m.viewer_map_zoom_in()}
        zoomOutTitle={m.viewer_map_zoom_out()}
      />
      {/* Leaflet's default prefix has an English `title`*/}
      <AttributionControl
        prefix={`<a href="https://leafletjs.com" title="${escapeHtmlAttribute(m.viewer_map_leaflet_title())}">Leaflet</a>`}
      />
      <OsmTileLayer />
      {children}
    </MapContainer>
  );
};

export { Map, type MapProps };
