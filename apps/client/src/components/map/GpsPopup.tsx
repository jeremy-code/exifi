import { Suspense, type ComponentPropsWithRef } from "react";

import { type LatLng } from "leaflet";
import { Link, LocateFixed, MapPin } from "lucide-react";
import { Popup } from "react-leaflet";

import { useNominatimApiReverse } from "#hooks/useNominatimApiReverse";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { formatLatLngAsGeoUri } from "#lib/leaflet/formatLatLngAsGeoUri";
import { Skeleton } from "@exifi/ui/components/Skeleton";

const GpsPopupLabel = ({ coordinate }: { coordinate: LatLng }) => {
  const feature = useNominatimApiReverse(coordinate);

  return feature?.properties?.display_name ?? null;
};

type GpsPopupProps = {
  coordinate: LatLng;
  label?: string;
} & ComponentPropsWithRef<typeof Popup>;

const GpsPopup = ({ coordinate, label, ...props }: GpsPopupProps) => {
  return (
    <Popup {...props}>
      <div className="flex flex-col gap-1">
        <div>
          <div className="flex gap-2">
            <div className="shrink-0 p-px">
              <MapPin className="size-4" />
            </div>
            {label !== undefined ?
              label
            : <Suspense fallback={<Skeleton className="h-[1em] w-full" />}>
                <GpsPopupLabel coordinate={coordinate} />
              </Suspense>
            }
          </div>
        </div>
        <div className="flex gap-2">
          <div className="shrink-0 p-px">
            <LocateFixed className="size-4" />
          </div>
          <div>{`${formatLatLng(coordinate)} `}</div>
        </div>
        <div className="flex gap-2">
          <div className="shrink-0 p-px">
            <Link className="size-4" />
          </div>
          <div>
            <div className="flex gap-0.5">
              <a
                href={`https://www.openstreetmap.org/#map=18/${coordinate.lat}/${coordinate.lng}`}
                target="_blank"
              >
                OpenStreetMap
              </a>
              {"•"}
              <a href={formatLatLngAsGeoUri(coordinate)} target="_blank">
                geo URI
              </a>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export { GpsPopup, type GpsPopupProps };
