import { TileLayer, type TileLayerProps } from "react-leaflet";

import { m } from "#paraglide/messages";

type OsmTileLayerProps = Omit<TileLayerProps, "url">;

const OsmTileLayer = (props: OsmTileLayerProps) => {
  return (
    <TileLayer
      // https://wiki.openstreetmap.org/wiki/Featured_tile_layers
      maxZoom={19}
      // https://osmfoundation.org/wiki/Licence/Attribution_Guidelines
      attribution={m.viewer_map_attribution({
        openStreetMapLink:
          '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })}
      // https://github.com/openstreetmap/operations/issues/737
      // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      {...props}
    />
  );
};

export { OsmTileLayer, type OsmTileLayerProps };
