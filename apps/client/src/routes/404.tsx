import { createFileRoute } from "@tanstack/react-router";

import { NotFound } from "#components/misc/NotFound";
import { seo } from "#utils/seo";

// Not an actual route, only here so TanStack Start can find this route, so it
// can be prerendered
// https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling
const NotFoundComponent = () => {
  return <NotFound isNotFound={true} routeId="__root__" />;
};

const Route = createFileRoute("/404")({
  head: () => ({
    meta: seo({
      title: "Not Found | exifi",
      noindex: true,
    }),
  }),
  component: NotFoundComponent,
});

export { Route };
