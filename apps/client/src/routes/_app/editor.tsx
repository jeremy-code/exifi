import { createFileRoute } from "@tanstack/react-router";

import { useFile } from "#contexts/FileContext";
import { ExifEditor } from "#features/exif-editor/ExifEditor";
import { m } from "#paraglide/messages";
import { seo } from "#utils/seo";

const EditorComponent = () => {
  const { file } = useFile();

  return <ExifEditor file={file} />;
};

const Route = createFileRoute("/_app/editor")({
  head: () => ({
    meta: seo({
      title: m.layout_seo_editor_title(),
      description: m.layout_seo_editor_description(),
    }),
  }),
  component: EditorComponent,
});

export { Route };
