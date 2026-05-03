import { createFileRoute } from "@tanstack/react-router";

import { ExifViewer } from "#features/exif-viewer/ExifViewer";
import { useFileStore } from "#hooks/useFileStore";
import { seo } from "#utils/seo";

const ViewerComponent = () => {
  const { file } = useFileStore();

  return <ExifViewer file={file} />;
};

const Route = createFileRoute("/_app/viewer/")({
  head: () => ({
    meta: seo({
      title: "Viewer | exifi",
      description: "Local-only Exif viewer for JPG images",
    }),
  }),
  component: ViewerComponent,
});

export { Route };
