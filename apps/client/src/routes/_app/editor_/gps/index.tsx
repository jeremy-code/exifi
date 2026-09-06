import { Suspense, use, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { LatLng, type Map as LeafletMap } from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { ExifData } from "libexif-wasm";

import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { Map } from "#components/map/Map";
import { useFile } from "#contexts/FileContext";
import { useGeoSearchLocation } from "#hooks/useGeoSearchLocation";
import { formatLatLng } from "#lib/leaflet/formatLatLng";
import { useGeoSearchLocationStore } from "#stores/geoSearchLocationStore";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { saveFile } from "#utils/saveFile";
import { seo } from "#utils/seo";
import { updateLatLng } from "@exifi/core/exif/actions/updateLatLng";
import { setExifData } from "@exifi/core/exif/utils/setExifData";
import { Button } from "@exifi/ui/components/Button";
import { Skeleton } from "@exifi/ui/components/Skeleton";

const defaultOsmProvider = new OpenStreetMapProvider();

const getOsmProvider = (currentPositionLatLng: LatLng | null) => {
  if (currentPositionLatLng === null) {
    return defaultOsmProvider;
  }
  const currentPositionLatLngBounds = currentPositionLatLng.toBounds(15_000);
  return new OpenStreetMapProvider({
    params: {
      viewbox: currentPositionLatLngBounds.toBBoxString(),
    },
  });
};

const EditorGpsApp = ({
  currentPositionPromise,
}: {
  currentPositionPromise: Promise<GeolocationPosition | null>;
}) => {
  const currentPosition = use(currentPositionPromise);
  const currentPositionLatLng =
    currentPosition !== null
      ? new LatLng(
          currentPosition.coords.latitude,
          currentPosition.coords.longitude,
          currentPosition.coords.altitude ?? undefined,
        )
      : null;
  const osmProvider = getOsmProvider(currentPositionLatLng);
  const [map, setMap] = useState<LeafletMap | null>(null);
  useGeoSearchLocation(map);
  const latLng = useGeoSearchLocationStore((state) => state.location?.latLng);
  const { file, setFile } = useFile();

  return (
    <div className="flex flex-col gap-2">
      <Map
        className="h-80 rounded"
        ref={(map) => setMap(map)}
        center={currentPositionLatLng ?? undefined}
      >
        <GeoSearchControl provider={osmProvider} />
      </Map>
      {latLng !== undefined ? formatLatLng(latLng) : "Location not found"}
      <Button
        onPress={async () => {
          if (latLng === undefined) {
            return;
          }

          const fileInBytes = new Uint8Array(await file.arrayBuffer());

          const exifData = ExifData.from(fileInBytes.buffer);
          updateLatLng(exifData, latLng);

          const newFile = await setExifData(file, exifData);
          exifData.free();

          await saveFile(newFile);
          setFile(newFile);
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const EditorGpsComponent = () => {
  const currentPositionPromise = getCurrentPosition().catch(() => null);

  return (
    <Suspense fallback={<Skeleton className="h-25 w-full" />}>
      <EditorGpsApp currentPositionPromise={currentPositionPromise} />
    </Suspense>
  );
};

const Route = createFileRoute("/_app/editor_/gps/")({
  head: () => ({
    meta: seo({
      title: "GPS Editor | exifi",
      description: "Local-only GPS Exif editor for JPG images",
    }),
  }),
  component: EditorGpsComponent,
});

export { Route };
