import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { type Map as LeafletMap } from "leaflet";
import { ExifData, ExifIfd } from "libexif-wasm";
import { useShallow } from "zustand/react/shallow";

import { Dropzone } from "#components/file/Dropzone";
import { FileUrlInput } from "#components/file/FileUrlInput";
import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { Map } from "#components/map/Map";
import {
  DropzoneStoreProvider,
  useDropzoneStore,
} from "#hooks/useDropzoneStore";
import { useGeoSearchLocation } from "#hooks/useGeoSearchLocation";
import { updateLatLng } from "#lib/exif/gps/updateLatLng";
import { saveFile } from "#utils/saveFile";
import { Button } from "@exiftools/ui/components/Button";
import { writeExifData } from "@exiftools/write-exif-data";

const EditorGpsApp = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const latLng = useGeoSearchLocation(map);
  const [acceptedFiles, replaceAcceptedFileByIndex] = useDropzoneStore(
    useShallow((state) => [
      state.acceptedFiles,
      state.replaceAcceptedFileByIndex,
    ]),
  );

  return (
    <div className="flex flex-col gap-2">
      <Map className="h-80 rounded" ref={(map) => setMap(map)}>
        <GeoSearchControl />
      </Map>
      {latLng?.toString()}
      <Dropzone
        dropzoneOptions={{ maxFiles: 1 }}
        rootProps={{ className: "min-h-25" }}
      />
      <div className="flex items-center gap-4 text-muted-foreground before:h-px before:grow before:bg-muted after:h-px after:grow after:bg-muted">
        OR
      </div>
      <FileUrlInput
        inputProps={{
          placeholder:
            "https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg",
        }}
      />
      <Button
        onClick={async (e) => {
          e.preventDefault();
          if (latLng === null || acceptedFiles[0] === undefined) {
            return;
          }

          const exifData = ExifData.from(await acceptedFiles[0].arrayBuffer());
          const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];

          updateLatLng(exifDataGpsIfd, latLng);

          const newFileInBytes = writeExifData(
            await acceptedFiles[0].bytes(),
            exifData.saveData(),
          );
          exifData.free();
          const newFile = new File(
            [new Uint8Array(newFileInBytes)],
            acceptedFiles[0].name,
            { type: acceptedFiles[0].type, lastModified: new Date().getTime() },
          );
          await saveFile(newFile);
          replaceAcceptedFileByIndex(0, newFile);
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const EditorGpsComponent = () => {
  return (
    <DropzoneStoreProvider>
      <EditorGpsApp />
    </DropzoneStoreProvider>
  );
};

const Route = createFileRoute("/_app/editor_/gps/")({
  component: EditorGpsComponent,
});

export { Route };
