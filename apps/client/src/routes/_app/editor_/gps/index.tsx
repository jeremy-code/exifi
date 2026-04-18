import { Suspense, use, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { LatLng, type Map as LeafletMap } from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { ExifData, ExifIfd } from "libexif-wasm";

import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { Map } from "#components/map/Map";
import { useFileStore } from "#hooks/useFileStore";
import { useGeoSearchLocation } from "#hooks/useGeoSearchLocation";
import { updateLatLng } from "#lib/exif/gps/updateLatLng";
import { createViewbox } from "#utils/createViewbox";
import { getCurrentPosition } from "#utils/getCurrentPosition";
import { saveFile } from "#utils/saveFile";
import { Button } from "@exiftools/ui/components/Button";
import { Skeleton } from "@exiftools/ui/components/Skeleton";
import { writeExifData } from "@exiftools/write-exif-data";

const defaultOsmProvider = new OpenStreetMapProvider();

const getOsmProvider = (currentPositionLatLng: LatLng | null) => {
  if (currentPositionLatLng === null) {
    return defaultOsmProvider;
  }
  const viewbox = createViewbox(
    currentPositionLatLng.lat,
    currentPositionLatLng.lng,
  );
  return new OpenStreetMapProvider({
    params: {
      viewbox: `${viewbox[0]},${viewbox[1]},${viewbox[2]},${viewbox[3]}`,
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
    currentPosition !== null ?
      new LatLng(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
      )
    : null;
  const osmProvider = getOsmProvider(currentPositionLatLng);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const latLng = useGeoSearchLocation(map);
  const { file, setFile } = useFileStore();

  return (
    <div className="flex flex-col gap-2">
      <Map
        className="h-80 rounded"
        ref={(map) => setMap(map)}
        center={currentPositionLatLng ?? undefined}
      >
        <GeoSearchControl provider={osmProvider} />
      </Map>
      {latLng?.toString()}
      <Button
        onClick={async (e) => {
          e.preventDefault();
          if (latLng === null) {
            return;
          }

          const fileInBytes = await file.bytes();

          const exifData = ExifData.from(fileInBytes.buffer);
          updateLatLng(exifData.ifd[ExifIfd.GPS], latLng);

          const newFileInBytes = writeExifData(
            fileInBytes,
            exifData.saveData(),
          );
          exifData.free();
          const newFile = new File(
            [new Uint8Array(newFileInBytes)],
            file.name,
            { type: file.type, lastModified: new Date().getTime() },
          );
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
  component: EditorGpsComponent,
});

export { Route };
