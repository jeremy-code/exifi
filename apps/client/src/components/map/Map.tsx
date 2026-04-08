import type { ComponentPropsWithRef } from "react";

import { MapContainer } from "react-leaflet";
import { cn } from "tailwind-variants";

import { OsmTileLayer } from "./OsmTileLayer";

const DEFAULT_ZOOM = 13;

type MapProps = ComponentPropsWithRef<typeof MapContainer>;

const Map = ({ className, children, zoom, ...props }: MapProps) => {
  return (
    <MapContainer
      className={cn("z-0", className)}
      zoom={zoom ?? DEFAULT_ZOOM}
      {...props}
    >
      <OsmTileLayer />
      {children}
    </MapContainer>
  );
};

export { Map };
