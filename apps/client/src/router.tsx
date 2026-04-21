import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./generated/routeTree.gen";

const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
};

export { getRouter };
