import { createFileRoute } from "@tanstack/react-router";

import { useFile } from "#contexts/FileContext";
import { ExifViewer } from "#features/exif-viewer/ExifViewer";
import { m } from "#paraglide/messages";
import { seo } from "#utils/seo";

const ViewerComponent = () => {
  const { file } = useFile();

  return <ExifViewer file={file} />;
};

const Route = createFileRoute("/_app/viewer")({
  head: () => ({
    meta: seo({
      title: m.layout_seo_viewer_title(),
      description: m.layout_seo_viewer_description(),
    }),
  }),
  component: ViewerComponent,
});

export { Route };
