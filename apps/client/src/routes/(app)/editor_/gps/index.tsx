import { useEffect, useEffectEvent, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { LatLng, type LeafletEvent, type Map as LeafletMap } from "leaflet";
import { ExifData, ExifIfd } from "libexif-wasm";
import { useShallow } from "zustand/react/shallow";

import { Dropzone } from "#components/file/Dropzone";
import { FileUrlInput } from "#components/file/FileUrlInput";
import { GeoSearchControl } from "#components/map/GeoSearchControl";
import { Map } from "#components/map/Map";
import { useDropzoneState } from "#hooks/useDropzoneState";
import { updateLatLng } from "#lib/exif/gps/updateLatLng";
import { saveFile } from "#utils/saveFile";
import { Button } from "@exiftools/ui/components/Button";
import { writeExifData } from "@exiftools/write-exif-data";

const EditorGpsComponent = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [latLng, setLatLng] = useState<LatLng | null>(null);
  const [acceptedFiles, replaceAcceptedFileByIndex] = useDropzoneState(
    useShallow((state) => [
      state.acceptedFiles,
      state.replaceAcceptedFileByIndex,
    ]),
  );

  const setLocation = useEffectEvent((event: LeafletEvent) => {
    if (
      "location" in event &&
      typeof event.location === "object" &&
      event.location !== null
    ) {
      if (
        "x" in event.location &&
        "y" in event.location &&
        typeof event.location.x === "number" &&
        typeof event.location.y === "number"
      ) {
        setLatLng(new LatLng(event.location.y, event.location.x));
      }
    }
  });

  useEffect(() => {
    map?.on("geosearch/showlocation", setLocation);

    return () => {
      map?.off("geosearch/showlocation", setLocation);
    };
  }, [map]);

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

const Route = createFileRoute("/(app)/editor_/gps/")({
  component: EditorGpsComponent,
});

export { Route };
