import { createFileRoute } from "@tanstack/react-router";

import { ExifTagTable } from "#features/exif-tags/ExifTagTable";
import { seo } from "#utils/seo";
import { Heading } from "@exifi/ui/components/Heading";

const TagsComponent = () => {
  return (
    <div className="container py-8">
      <Heading level={1} size="2xl" className="mb-4">
        Exif tags
      </Heading>
      <ExifTagTable />
    </div>
  );
};

const Route = createFileRoute("/tags/")({
  head: () => ({
    meta: seo({
      title: "Tags | exifi",
      description: "Exif tags used in libexif and their support level",
    }),
  }),
  component: TagsComponent,
});

export { Route };
