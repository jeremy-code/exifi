import { createFileRoute } from "@tanstack/react-router";

import { Dropzone } from "#components/file/Dropzone";
import { FileUrlInput } from "#components/file/FileUrlInput";
import { useDropzoneState } from "#hooks/useDropzoneState";
import { Heading } from "@exiftools/ui/components/Heading";

import { ExifViewer } from "./-ExifViewer";

const ViewerComponent = () => {
  const acceptedFiles = useDropzoneState((state) => state.acceptedFiles);

  if (acceptedFiles.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <Heading as="h1" size="2xl" className="mb-4">
          Upload file to view Exif metadata
        </Heading>
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
      </div>
    );
  }

  if (acceptedFiles.length === 1 && acceptedFiles[0] !== undefined) {
    return <ExifViewer file={acceptedFiles[0]} />;
  }

  // TODO: Handle this case
  return null;
};

const Route = createFileRoute("/_app/viewer/")({
  component: ViewerComponent,
});

export { Route };
