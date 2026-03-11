type NavigationItem = {
  href: `/${string}`;
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
