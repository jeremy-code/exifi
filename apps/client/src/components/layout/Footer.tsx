import type { ComponentPropsWithRef } from "react";

import { cn } from "tailwind-variants";

import { buttonVariants } from "@exifi/ui/components/Button";
import { Link } from "@exifi/ui/components/Link";
import { Github } from "@exifi/ui/components/icons/Github";

const Footer = ({ className, ...props }: ComponentPropsWithRef<"footer">) => {
  return (
    <footer className={cn("shrink border-t", className)} {...props}>
      <div className="container flex items-center justify-between gap-2 py-4">
        <span className="text-balance">
          {"Made with 🧋 by "}
          <Link
            className="inline"
            color="blue"
            href="https://jeremy.ng"
            underline="hover"
          >
            Jeremy Nguyen
          </Link>
        </span>
        <Link
          underline={false}
          className={(renderProps) => buttonVariants({ ...renderProps })}
          href="https://github.com/jeremy-code/exifi"
        >
          <Github aria-hidden className="size-4" />
          GitHub
        </Link>
      </div>
    </footer>
  );
};

export { Footer };
