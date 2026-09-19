import { Suspense, type ComponentPropsWithRef } from "react";

import { type LatLng } from "leaflet";
import { Link, LocateFixed, MapPin } from "lucide-react";
import { Popup } from "react-leaflet";

import { useNominatimApiReverse } from "#hooks/useNominatimApiReverse";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { formatLatLngAsGeoUri } from "#lib/leaflet/formatLatLngAsGeoUri";
import { formatLatLngAsOsmUrl } from "#lib/leaflet/formatLatLngAsOsmUrl";
import { m } from "#paraglide/messages";
import {
  HorizontalList,
  HorizontalListItem,
} from "@exifi/ui/components/HorizontalList";
import { Skeleton } from "@exifi/ui/components/Skeleton";

const GpsPopupLabel = ({ coordinate }: { coordinate: LatLng }) => {
  const feature = useNominatimApiReverse(coordinate);

  return typeof feature?.properties?.display_name === "string"
    ? feature?.properties?.display_name
    : "Unknown location";
};

type GpsPopupProps = {
  coordinate: LatLng;
  label?: string;
} & ComponentPropsWithRef<typeof Popup>;

const GpsPopup = ({ coordinate, label, ...props }: GpsPopupProps) => {
  return (
    <Popup {...props}>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <MapPin className="size-4 text-fg-muted" />
        {label ?? (
          <Suspense fallback={<Skeleton className="h-[1em] w-full" />}>
            <GpsPopupLabel coordinate={coordinate} />
          </Suspense>
        )}

        <LocateFixed className="size-4 text-fg-muted" />
        <div>{formatLatLng(coordinate)}</div>

        <Link className="size-4 text-fg-muted" />
        <div>
          <HorizontalList>
            <HorizontalListItem>
              <a href={formatLatLngAsOsmUrl(coordinate).href} target="_blank">
                {m.gaudy_misty_ape_pat()}
              </a>
            </HorizontalListItem>
            <HorizontalListItem>
              <a href={formatLatLngAsGeoUri(coordinate)} target="_blank">
                {m.elegant_top_ladybug_agree()}
              </a>
            </HorizontalListItem>
          </HorizontalList>
        </div>
      </div>
    </Popup>
  );
};

export { GpsPopup, type GpsPopupProps };
