import type { ComponentPropsWithRef } from "react";

import { Link as RouterLink } from "@tanstack/react-router";
import { cn } from "tailwind-variants";

import { ThemeToggle } from "#components/misc/ThemeToggle";
import { m } from "#paraglide/messages";
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
        "sticky inset-x-0 top-0 z-60 h-(--navbar-height) border-b bg-bg",
        className,
      )}
      {...props}
    >
      <div className="container flex h-full items-center justify-between">
        <RouterLink className="flex items-center gap-1 font-semibold" to="/">
          <img width="32" height="32" src="/favicon.svg" />
          {m.siteTitle()}
        </RouterLink>
        <div className="flex items-center gap-2">
          <NavigationMenu className="grow max-sm:hidden">
            <NavigationMenuList>
              {NAVIGATION_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild variant="trigger">
                    <RouterLink to={item.href}>{item.name()}</RouterLink>
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
