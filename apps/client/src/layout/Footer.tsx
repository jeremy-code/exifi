import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import {
  HorizontalList,
  HorizontalListItem,
} from "@exiftools/ui/components/HorizontalList";
import { Link } from "@exiftools/ui/components/Link";

export const Footer = ({
  className,
  ...props
}: ComponentPropsWithRef<"footer">) => {
  return (
    <footer
      className={cn("grid place-content-center border-t", className)}
      {...props}
    >
      <div className="container py-4">
        <HorizontalList>
          <HorizontalListItem>
            {"Made by "}
            <Link href="https://jeremy.ng" underline="hover">
              Jeremy Nguyen
            </Link>
          </HorizontalListItem>
          <HorizontalListItem>
            <Link
              href="https://github.com/jeremy-code/exiftools"
              underline="hover"
            >
              Source code
            </Link>
          </HorizontalListItem>
        </HorizontalList>
      </div>
    </footer>
  );
};
