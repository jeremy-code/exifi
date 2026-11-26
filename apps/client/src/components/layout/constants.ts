import type { FileRoutesByPath } from "@tanstack/react-router";

type NavigationItem = {
  to: FileRoutesByPath[keyof FileRoutesByPath]["fullPath"];
  name: string;
};

const NAVIGATION_ITEMS = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/viewer",
    name: "Viewer",
  },
  {
    to: "/editor",
    name: "Editor",
  },
] satisfies NavigationItem[];

export { NAVIGATION_ITEMS, type NavigationItem };
