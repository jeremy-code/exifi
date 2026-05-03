import { createFileRoute } from "@tanstack/react-router";

import { ExifEditor } from "#features/exif-editor/ExifEditor";
import { useFileStore } from "#hooks/useFileStore";
import { seo } from "#utils/seo";

const EditorComponent = () => {
  const { file } = useFileStore();

  return <ExifEditor file={file} />;
};

const Route = createFileRoute("/_app/editor/")({
  head: () => ({
    meta: seo({
      title: "Editor | exifi",
      description: "Local-only Exif editor for JPG images",
    }),
  }),
  component: EditorComponent,
});

export { Route };
