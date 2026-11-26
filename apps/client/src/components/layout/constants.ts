import type { FileRoutesByPath } from "@tanstack/react-router";

import { m } from "#paraglide/messages";

type NavigationItem = {
  to: FileRoutesByPath[keyof FileRoutesByPath]["fullPath"];
  name: string;
};

const getNavigationItems = () =>
  [
    { to: "/", name: m.layout_nav_home() },
    { to: "/viewer", name: m.layout_nav_viewer() },
    { to: "/editor", name: m.layout_nav_editor() },
  ] satisfies NavigationItem[];

export { getNavigationItems, type NavigationItem };
