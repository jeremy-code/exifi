import type { FileRoutesByPath } from "@tanstack/react-router";

import { m } from "#paraglide/messages";

type NavigationItem = {
  href: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  name: () => string;
};

const NAVIGATION_ITEMS = [
  {
    href: "/",
    name: m.nav_home,
  },
  {
    href: "/viewer",
    name: m.nav_viewer,
  },
  {
    href: "/editor",
    name: m.nav_editor,
  },
] satisfies NavigationItem[];

export { NAVIGATION_ITEMS, type NavigationItem };
