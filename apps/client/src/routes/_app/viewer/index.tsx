import { createFileRoute } from "@tanstack/react-router";

import { ExifViewer } from "#features/exif-viewer/ExifViewer";
import { useFileStore } from "#hooks/useFileStore";

const ViewerComponent = () => {
  const { file } = useFileStore();

  return <ExifViewer file={file} />;
};

const Route = createFileRoute("/_app/viewer/")({
  component: ViewerComponent,
});

export { Route };
