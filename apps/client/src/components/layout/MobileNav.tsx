import { type ComponentPropsWithRef } from "react";

import { Link as RouterLink } from "@tanstack/react-router";
import { Disclosure, DisclosurePanel } from "react-aria-components/Disclosure";

import { Button, type ButtonProps } from "@exifi/ui/components/Button";
import { navigationMenuTriggerVariants } from "@exifi/ui/components/NavigationMenu";

import { NAVIGATION_ITEMS } from "./constants";

const MobileNavButton = (props: ButtonProps) => {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        className="size-4 stroke-fg stroke-2"
      >
        {/**
         * The following paths are lines of width 18px and height 2px
         * in the 24x24 viewBox. The center of top path and bottom
         * path is (12,18) and (12,6), respectively. Hence, after a
         * rotation, to center them they are translated by 6px in the
         * y-direction.
         */}
        <path
          className="origin-center transition-transform transform-stroke group-expanded/navbar:translate-y-1.5 group-expanded/navbar:rotate-45"
          d="M4 6H20"
        />
        <path
          /**
           * Transition between the default state (line centered at y=12
           * with width 18px) to a point located at the SVG's center
           * (12,12) when open. Since `d` CSS property is not supported in
           * Safari, use opacity to fade in/out.
           *
           * @see {@link https://caniuse.com/mdn-css_properties_d}
           */
          className="transition-[d,opacity] group-expanded/navbar:opacity-0 group-expanded/navbar:[d:path('M12_12H12')]"
          d="M4 12H20"
        />
        <path
          className="origin-center transition-transform transform-stroke group-expanded/navbar:-translate-y-1.5 group-expanded/navbar:-rotate-45"
          d="M4 18H20"
        />
      </svg>
    </Button>
  );
};

type MobileNavProps = ComponentPropsWithRef<typeof Disclosure>;

const MobileNav = (props: Omit<MobileNavProps, "children">) => {
  return (
    <Disclosure className="group/navbar sm:hidden" {...props}>
      <MobileNavButton slot="trigger" />
      <DisclosurePanel
        // Height includes the border-bottom of the navbar (1px)
        className="absolute inset-x-0 top-[calc(100%+1px)] h-(--disclosure-panel-height) overflow-clip motion-safe:transition-[height]"
      >
        <nav role="navigation" className="border-b bg-bg p-3 text-fg">
          <ul className="space-y-0.5">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <RouterLink
                  to={item.href}
                  // Using <NavigationMenuLink> would error due to not being in
                  // a <NavigationMenu>
                  className={navigationMenuTriggerVariants({
                    variant: "link",
                  })}
                >
                  {item.name}
                </RouterLink>
              </li>
            ))}
          </ul>
        </nav>
      </DisclosurePanel>
    </Disclosure>
  );
};

export { MobileNav, type MobileNavProps };
