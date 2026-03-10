import type { ComponentPropsWithRef } from "react";

import { Link as RouterLink } from "react-router";
import { cn } from "tailwind-variants";

import { ThemeToggle } from "#components/misc/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@exiftools/ui/components/NavigationMenu";

const NAVBAR_ITEMS = [
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
];

export const Navbar = ({
  className,
  ...props
}: ComponentPropsWithRef<"header">) => {
  return (
    <header className={cn("border-b", className)} {...props}>
      <div className="container flex items-center justify-between py-4">
        <RouterLink className="flex items-center gap-2 font-semibold" to="/">
          exiftools
        </RouterLink>
        <div className="flex items-center gap-2">
          <NavigationMenu className="grow max-sm:hidden">
            <NavigationMenuList>
              {NAVBAR_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild variant="trigger">
                    <RouterLink to={item.href}>{item.name}</RouterLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle size="lg" />
        </div>
      </div>
    </header>
  );
};
