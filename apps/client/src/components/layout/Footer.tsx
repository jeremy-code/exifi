import type { ComponentPropsWithRef } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cn } from "tailwind-variants";

import { m } from "#paraglide/messages";
import { buttonVariants } from "@exifi/ui/components/Button";
import { Link } from "@exifi/ui/components/Link";
import { Github } from "@exifi/ui/components/icons/Github";

const Footer = ({ className, ...props }: ComponentPropsWithRef<"footer">) => {
  return (
    <footer className={cn("shrink border-t", className)} {...props}>
      <div className="container flex items-center justify-between gap-2 py-4">
        <span className="text-balance">
          <ParaglideMessage
            message={m.layout_footer_made_by}
            markup={{
              authorLink: ({ children }) => (
                <Link
                  className="inline"
                  color="blue"
                  href="https://jeremy.ng"
                  underline="hover"
                >
                  {children}
                </Link>
              ),
            }}
          />
        </span>
        <Link
          underline={false}
          className={buttonVariants}
          href="https://github.com/jeremy-code/exifi"
        >
          <Github aria-hidden className="size-4 fill-current stroke-0" />
          {m.layout_footer_github()}
        </Link>
      </div>
    </footer>
  );
};

export { Footer };
