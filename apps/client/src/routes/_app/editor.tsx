import { createFileRoute } from "@tanstack/react-router";

import { useFile } from "#contexts/FileContext";
import { ExifEditor } from "#features/exif-editor/ExifEditor";
import { seo } from "#utils/seo";

const EditorComponent = () => {
  const { file } = useFile();

  return <ExifEditor file={file} />;
};

const Route = createFileRoute("/_app/editor")({
  head: () => ({
    meta: seo({
      title: "Editor | exifi",
      description: "Local-only Exif editor for JPG images",
    }),
  }),
  component: EditorComponent,
});

export { Route };
