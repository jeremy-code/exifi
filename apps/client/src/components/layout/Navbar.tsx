import type { ComponentPropsWithRef } from "react";

import { Link as RouterLink } from "@tanstack/react-router";
import { cn, tv } from "tailwind-variants";

import { ThemeToggle } from "#components/misc/ThemeToggle";

import { MobileNav } from "./MobileNav";
import { NAVIGATION_ITEMS } from "./constants";

type NavbarProps = ComponentPropsWithRef<"header">;

const navigationMenuTriggerVariants = tv({
  base: [
    "rounded px-4 py-3 text-sm/none font-medium text-fg transition-colors select-none",
    "hover:bg-bg-muted hover:text-fg",
    "focus:bg-bg-muted focus:text-fg",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      link: "block no-underline", // Defaults to inline
      trigger: "flex items-center justify-between gap-0.5",
    },
  },
  defaultVariants: { variant: "link" },
});

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
          exifi
        </RouterLink>
        <div className="flex items-center gap-2">
          <nav className="relative z-10 flex grow justify-center max-sm:hidden">
            <ul className="flex justify-center gap-2 rounded-md p-1">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <RouterLink
                    className={navigationMenuTriggerVariants({
                      variant: "trigger",
                    })}
                    to={item.href}
                  >
                    {item.name}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle size="lg" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export { Navbar, type NavbarProps, navigationMenuTriggerVariants };
