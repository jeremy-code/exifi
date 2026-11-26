import { createFileRoute } from "@tanstack/react-router";

import { ExifTagTable } from "#features/exif-tags/ExifTagTable";
import { m } from "#paraglide/messages";
import { seo } from "#utils/seo";
import { Heading } from "@exifi/ui/components/Heading";

const TagsComponent = () => {
  return (
    <div className="container py-8">
      <Heading level={1} size="2xl" className="mb-4">
        {m.layout_tags_heading()}
      </Heading>
      <ExifTagTable />
    </div>
  );
};

const Route = createFileRoute("/tags")({
  head: () => ({
    meta: seo({
      title: m.layout_seo_tags_title(),
      description: m.layout_seo_tags_description(),
    }),
  }),
  component: TagsComponent,
});

export { Route };
