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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@exiftools/ui/components/Tooltip";

import { MobileNav } from "./MobileNav";
import { NAVIGATION_ITEMS } from "./constants";

type NavbarProps = ComponentPropsWithRef<"header">;

const Navbar = ({ className, ...props }: NavbarProps) => {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-background",
        className,
      )}
      {...props}
    >
      <div className="container flex items-center justify-between py-4">
        <RouterLink className="flex items-center gap-2 font-semibold" to="/">
          exiftools
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
          <Tooltip>
            <TooltipTrigger>
              <ThemeToggle size="lg" />
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export { Navbar, type NavbarProps };
