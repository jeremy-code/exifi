import { createRouter } from "@tanstack/react-router";

import { CatchBoundary } from "#components/misc/CatchBoundary";

import { routeTree } from "./generated/routeTree.gen";

const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: CatchBoundary,
    scrollRestoration: true,
  });

  return router;
};

export { getRouter };
