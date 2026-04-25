import type { ComponentPropsWithRef } from "react";

import { Link as RouterLink } from "@tanstack/react-router";
import { cn } from "tailwind-variants";

import { ThemeToggle } from "#components/misc/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@exifi/ui/components/NavigationMenu";

import { MobileNav } from "./MobileNav";
import { NAVIGATION_ITEMS } from "./constants";

type NavbarProps = ComponentPropsWithRef<"header">;

const Navbar = ({ className, ...props }: NavbarProps) => {
  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 border-b bg-background",
        className,
      )}
      {...props}
    >
      <div className="container flex items-center justify-between py-4">
        <RouterLink className="flex items-center gap-2 font-semibold" to="/">
          <img width="24" height="24" src="/favicon.svg" />
          exifi
        </RouterLink>
        <div className="flex items-center gap-2">
          <NavigationMenu className="grow max-sm:hidden">
            <NavigationMenuList>
              {NAVIGATION_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild variant="trigger">
                    <RouterLink to={item.href}>{item.name}</RouterLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle size="lg" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export { Navbar, type NavbarProps };
