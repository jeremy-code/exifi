import type { FileRoutesByPath } from "@tanstack/react-router";

type NavigationItem = {
  href: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  name: string;
};

const NAVIGATION_ITEMS = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/viewer",
    name: "Viewer",
  },
  {
    href: "/editor",
    name: "Editor",
  },
] satisfies NavigationItem[];

export { NAVIGATION_ITEMS, type NavigationItem };
