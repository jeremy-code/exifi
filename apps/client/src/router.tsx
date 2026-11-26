import { createRouter } from "@tanstack/react-router";

import { CatchBoundary } from "#components/misc/CatchBoundary";
import { NotFound } from "#components/misc/NotFound";
import { deLocalizeUrl, localizeUrl } from "#paraglide/runtime";

import { routeTree } from "./generated/routeTree.gen";

const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: CatchBoundary,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });

  return router;
};

export { getRouter };
